"use client";

import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap
} from "react-leaflet";
import { useEffect } from "react";

import type { ScanRecord } from "@/lib/types/scan";

function FitMarkers({ scans }: { scans: ScanRecord[] }) {
  const map = useMap();

  useEffect(() => {
    const validScans = scans.filter(
      (scan) => scan.latitude !== null && scan.longitude !== null
    );

    if (!validScans.length) {
      map.setView([7.883, -76.633], 2);
      return;
    }

    map.fitBounds(
      validScans.map((scan) => [scan.latitude as number, scan.longitude as number]),
      {
        padding: [50, 50]
      }
    );
  }, [map, scans]);

  return null;
}

export default function AdminMap({ scans }: { scans: ScanRecord[] }) {
  const validScans = scans.filter(
    (scan) => scan.latitude !== null && scan.longitude !== null
  );

  return (
    <MapContainer
      center={[7.883, -76.633]}
      zoom={2}
      scrollWheelZoom={false}
      zoomControl={false}
      className="bg-[#0b2431]"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMarkers scans={validScans} />
      {validScans.map((scan) => (
        <CircleMarker
          key={scan.id}
          center={[scan.latitude as number, scan.longitude as number]}
          radius={7}
          pathOptions={{
            color: "#F1E5C5",
            fillColor: "#56A35C",
            fillOpacity: 0.92,
            weight: 2
          }}
        >
          <Tooltip direction="top">
            {scan.locationLabel ?? scan.lotCode}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
