"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { drawWorldMapToCanvas } from "@/lib/utils/worldData";

type Coordinates = {
  latitude: number;
  longitude: number;
  label: string;
};

type TraceGlobeCanvasProps = {
  origin: Coordinates;
  destination: Coordinates;
};

// Converts latitude/longitude to 3D Cartesian coordinates on a sphere of a given radius.
// Uses the standard SphereGeometry UV projection math to ensure 100% alignment with the land texture.
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  // phi: inclination from the North Pole (latitude)
  const phi = (90 - lat) * (Math.PI / 180);
  // theta: azimuth (longitude)
  const theta = (lng + 180) * (Math.PI / 180);

  // Cartesian coordinates mapping matching Three.js SphereGeometry exactly
  const x = -radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(theta) * Math.sin(phi);

  return new THREE.Vector3(x, y, z);
}

export default function TraceGlobeCanvas({ origin, destination }: TraceGlobeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // States to keep track of screen projection positions for HTML tooltips overlay
  const [projections, setProjections] = useState<{
    origin: { x: number; y: number; visible: boolean } | null;
    destination: { x: number; y: number; visible: boolean } | null;
    box: { x: number; y: number; visible: boolean } | null;
  }>({
    origin: null,
    destination: null,
    box: null,
  });

  const [boxProgress, setBoxProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Create Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040e17, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Position camera far initially, we'll animate a fly-in zoom
    camera.position.set(0, 5, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 3, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x56a35c, 0.4); // Subtle Balú green light reflection
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xa7d948, 1.2, 20); // Glowing point light
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    // 3. Globe Mesh & Texture Generation
    const R = 5; // Earth Sphere Radius
    
    // Create an in-memory canvas to draw the world map
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = 2048;
    mapCanvas.height = 1024;
    
    // Render the premium stylized vector map on the canvas
    drawWorldMapToCanvas(
      mapCanvas,
      "#a7d948", // Theme color: lime/green Balú
      "rgba(167, 217, 72, 0.12)", // Thin coordinate gridlines
      "rgba(86, 163, 92, 0.35)" // Glowing continental margins
    );

    const globeTexture = new THREE.CanvasTexture(mapCanvas);
    globeTexture.colorSpace = THREE.SRGBColorSpace;

    // Create the Earth Sphere Mesh
    const sphereGeo = new THREE.SphereGeometry(R, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.7,
      metalness: 0.25,
      bumpScale: 0.05,
    });
    
    const globe = new THREE.Group();
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globe.add(earthMesh);
    scene.add(globe);

    // Subtle atmospheric outer glow sphere (Glassmorphism look)
    const glowGeo = new THREE.SphereGeometry(R * 1.025, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x56a35c,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globe.add(glowMesh);

    // 4. Coordinates Mapping & Markers Creation
    const originVec = latLngToVector3(origin.latitude, origin.longitude, R);
    const destVec = latLngToVector3(destination.latitude, destination.longitude, R);

    const markerBaseGeo = new THREE.RingGeometry(0.01, 0.15, 32);
    const markerCoreGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const materialsToDispose: THREE.Material[] = [];

    // Marker helper creator
    const createMarkerMesh = (color: number) => {
      const group = new THREE.Group();
      
      // Base circle flat on surface
      const baseMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      materialsToDispose.push(baseMat);
      const base = new THREE.Mesh(markerBaseGeo, baseMat);
      base.lookAt(new THREE.Vector3(0, 0, 0)); // Orient flat to surface
      group.add(base);

      // Glowing core sphere
      const coreMat = new THREE.MeshBasicMaterial({ color: color });
      materialsToDispose.push(coreMat);
      const core = new THREE.Mesh(markerCoreGeo, coreMat);
      group.add(core);

      return group;
    };

    const originMarker = createMarkerMesh(0xa7d948); // Green
    originMarker.position.copy(originVec);
    // Align marker with the sphere normal (facing outwards)
    originMarker.lookAt(originVec.clone().multiplyScalar(2));
    globe.add(originMarker);

    const destMarker = createMarkerMesh(0xf28c28); // Orange
    destMarker.position.copy(destVec);
    destMarker.lookAt(destVec.clone().multiplyScalar(2));
    globe.add(destMarker);

    // 5. 3D Arc Trajectory
    // Calculate bezier control point that arches upwards
    const midPoint = new THREE.Vector3().addVectors(originVec, destVec).multiplyScalar(0.5);
    const distance = originVec.distanceTo(destVec);
    // Rise height is proportional to the distance between points
    const arcHeight = Math.max(1.8, distance * 0.45);
    const controlPoint = midPoint.clone().normalize().multiplyScalar(R + arcHeight);

    // Quadratic Bezier Curve
    const curve = new THREE.QuadraticBezierCurve3(originVec, controlPoint, destVec);
    const pathPoints = curve.getPoints(80);
    const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);

    // Glowing dotted arc path material
    const pathMat = new THREE.LineBasicMaterial({
      color: 0xa7d948,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });

    const pathLine = new THREE.Line(pathGeo, pathMat);
    globe.add(pathLine);

    // 6. Traveling "Caja Balú" Box Mesh
    const boxSize = 0.16;
    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize * 0.9, boxSize * 1.2);
    // Styled as a premium glowing green/yellow cardboard box
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xf1e5c5, // Cream box color
      roughness: 0.6,
      metalness: 0.1,
      emissive: 0xa7d948, // Subtle green glow
      emissiveIntensity: 0.2,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    globe.add(boxMesh);

    // 7. Mouse and Touch Interaction (Smooth Rotation dragging)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    // Inertia rotation variables
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    // Automatically orient the globe so the arc is facing the camera on start
    const targetCenter = new THREE.Vector3().addVectors(originVec, destVec).normalize();
    // Compute pitch/yaw to targetCenter
    const targetLat = Math.asin(targetCenter.y);
    const targetLng = Math.atan2(-targetCenter.x, targetCenter.z);

    // Set initial rotation to show the trajectory nicely
    globe.rotation.y = targetLng;
    globe.rotation.x = -targetLat + 0.2; // slight offset for tilt
    
    targetRotationY = globe.rotation.y;
    targetRotationX = globe.rotation.x;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Adjust target rotations
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;

      // Limit vertical rotation to prevent flipping
      targetRotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Mobile touch events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.006;
      targetRotationX += deltaY * 0.006;

      targetRotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotationX));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    // 8. Projection helper (maps 3D Vector to HTML Screen 2D X/Y coords)
    const project3DTo2D = (vector3: THREE.Vector3) => {
      // Clone vector because project() mutates the vector
      const vector = vector3.clone();
      
      // Calculate normal from globe center to point
      const normal = vector.clone().normalize();
      
      // Apply globe's current rotation to get the actual world position of the marker
      normal.applyEuler(globe.rotation);
      vector.applyEuler(globe.rotation);
      
      // Check if point is facing the camera (behind the horizon?)
      // Vector from camera to the world point
      const camPosNormalized = camera.position.clone().normalize();
      const dot = normal.dot(camPosNormalized);
      
      // If dot < -0.15, the marker is rotated onto the back side of the sphere
      const visible = dot > -0.15;

      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * width;
      const y = (-(vector.y * 0.5) + 0.5) * height;

      return { x, y, visible };
    };

    // 9. Animation Loop
    let animationFrameId = 0;
    const startTime = Date.now();
    const durationMs = 4200; // Animation duration in ms (matching original Leaflet)

    // Smoothly zoom/move camera towards the globe on load
    let hasFocused = false;
    const zoomSpeed = 0.04;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth inertia rotation dampening
      if (!isDragging) {
        globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.08;
        globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.08;
      } else {
        globe.rotation.y = targetRotationY;
        globe.rotation.x = targetRotationX;
      }

      // Camera intro glide zoom in
      if (!hasFocused) {
        camera.position.z += (11.5 - camera.position.z) * zoomSpeed;
        camera.position.y += (1.8 - camera.position.y) * zoomSpeed;
        if (Math.abs(camera.position.z - 11.5) < 0.05) {
          hasFocused = true;
        }
      }

      // Animate Traveling Box position along the Bezier curve
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / durationMs) % 1.0;
      setBoxProgress(progress);

      const boxPos = curve.getPointAt(progress);
      boxMesh.position.copy(boxPos);

      // Make the box align with the direction of the curve
      const tangent = curve.getTangentAt(progress).normalize();
      const boxLookTarget = boxPos.clone().add(tangent);
      boxMesh.lookAt(boxLookTarget);
      
      // Add a tiny rolling spin for visual fun
      boxMesh.rotateX(progress * 0.2);

      // Update light tracking origin/destination dynamically
      pointLight.position.copy(boxPos).multiplyScalar(1.2);

      // Project positions for HTML labels
      const projectedOrigin = project3DTo2D(originVec);
      const projectedDest = project3DTo2D(destVec);
      const projectedBox = project3DTo2D(boxPos);

      setProjections({
        origin: projectedOrigin,
        destination: projectedDest,
        box: projectedBox,
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize handler
    const handleResize = () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose materials/geometries for memory leaks prevention
      sphereGeo.dispose();
      sphereMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      materialsToDispose.forEach((mat) => mat.dispose());
      markerBaseGeo.dispose();
      markerCoreGeo.dispose();
      pathGeo.dispose();
      pathMat.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      globeTexture.dispose();
      renderer.dispose();
    };
  }, [origin, destination]);

  return (
    <div className="relative h-full w-full select-none cursor-grab active:cursor-grabbing bg-[#040e17]">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Floating HTML overlays - Projecting tooltips over 3D space coordinates */}

      {/* Origin Label */}
      {projections.origin && projections.origin.visible && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-300"
          style={{
            left: `${projections.origin.x}px`,
            top: `${projections.origin.y - 12}px`,
          }}
        >
          <div className="rounded-xl border border-lime/40 bg-black/80 px-3 py-1.5 text-center text-xs font-semibold text-[#a7d948] shadow-[0_0_12px_rgba(167,217,72,0.3)] backdrop-blur-sm whitespace-nowrap">
            📍 {origin.label}
          </div>
          <div className="mx-auto h-2 w-0.5 bg-[#a7d948]/80 shadow-[0_0_8px_rgba(167,217,72,0.5)]" />
        </div>
      )}

      {/* Destination Label */}
      {projections.destination && projections.destination.visible && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-300"
          style={{
            left: `${projections.destination.x}px`,
            top: `${projections.destination.y - 12}px`,
          }}
        >
          <div className="rounded-xl border border-ember/40 bg-black/80 px-3 py-1.5 text-center text-xs font-semibold text-ember shadow-[0_0_12px_rgba(242,140,40,0.3)] backdrop-blur-sm whitespace-nowrap">
            🎯 {destination.label}
          </div>
          <div className="mx-auto h-2 w-0.5 bg-ember/80 shadow-[0_0_8px_rgba(242,140,40,0.5)]" />
        </div>
      )}

      {/* Traveling Box Label */}
      {projections.box && projections.box.visible && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-300"
          style={{
            left: `${projections.box.x}px`,
            top: `${projections.box.y - 14}px`,
          }}
        >
          <div className="rounded-full border border-sky/30 bg-[#0b2231]/92 px-3 py-1 text-center text-[10px] uppercase tracking-wider font-semibold text-white shadow-tropical backdrop-blur-sm whitespace-nowrap flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            Caja Balú en tránsito
          </div>
          <div className="mx-auto h-2 w-px bg-white/20" />
        </div>
      )}

      {/* Stylized Compass / Interactive Helper HUD */}
      <div className="absolute bottom-4 left-4 pointer-events-none flex flex-col gap-1 text-[10px] uppercase tracking-[0.2em] text-sky/50 font-mono">
        <p className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full border border-white/20 animate-spin" style={{ borderTopColor: "transparent" }} />
          Interactuable: Arrastra para rotar
        </p>
        <p>Trayecto: {(boxProgress * 100).toFixed(0)}% completado</p>
      </div>
    </div>
  );
}
