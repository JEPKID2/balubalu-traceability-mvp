"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";

type Coordinates = {
  latitude: number;
  longitude: number;
  label: string;
};

type TraceMapCanvasProps = {
  origin: Coordinates;
  destination: Coordinates;
};

const originIcon = L.divIcon({
  className: "custom-origin-marker",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:9999px;background:#A7D948;box-shadow:0 0 0 8px rgba(167,217,72,0.18)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const destinationIcon = L.divIcon({
  className: "custom-destination-marker",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:9999px;background:#F28C28;box-shadow:0 0 0 8px rgba(242,140,40,0.18)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

function FitRouteBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(points, {
      padding: [60, 60]
    });
  }, [map, points]);

  return null;
}

function AnimatedTravelPoint({ origin, destination }: TraceMapCanvasProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }

      const elapsed = timestamp - start;
      const nextProgress = Math.min(elapsed / 4200, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [destination.latitude, destination.longitude, origin.latitude, origin.longitude]);

  const latitude =
    origin.latitude + (destination.latitude - origin.latitude) * progress;
  const longitude =
    origin.longitude + (destination.longitude - origin.longitude) * progress;

  return (
    <CircleMarker
      center={[latitude, longitude]}
      radius={9}
      pathOptions={{
        color: "#F1E5C5",
        fillColor: "#F28C28",
        fillOpacity: 0.95,
        weight: 3
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} permanent>
        Caja Balú en tránsito
      </Tooltip>
    </CircleMarker>
  );
}

export default function TraceMapCanvas({ origin, destination }: TraceMapCanvasProps) {
  const points = useMemo<[number, number][]>(
    () => [
      [origin.latitude, origin.longitude],
      [destination.latitude, destination.longitude]
    ],
    [destination.latitude, destination.longitude, origin.latitude, origin.longitude]
  );

  return (
    <MapContainer
      center={[origin.latitude, origin.longitude]}
      zoom={3}
      scrollWheelZoom={false}
      zoomControl={false}
      className="bg-[#08263a]"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitRouteBounds points={points} />

      <Polyline
        positions={points}
        pathOptions={{
          color: "#A7D948",
          opacity: 0.95,
          weight: 4,
          dashArray: "10 16"
        }}
      />

      <Marker position={points[0]} icon={originIcon}>
        <Tooltip direction="top" offset={[0, -10]} permanent>
          {origin.label}
        </Tooltip>
      </Marker>

      <Marker position={points[1]} icon={destinationIcon}>
        <Tooltip direction="top" offset={[0, -10]} permanent>
          {destination.label}
        </Tooltip>
      </Marker>

      <AnimatedTravelPoint origin={origin} destination={destination} />
    </MapContainer>
  );
}
