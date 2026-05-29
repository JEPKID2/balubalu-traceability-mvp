"use client";

import { motion } from "framer-motion";

import type { ScanRecord } from "@/lib/types/scan";
import { calculateDistanceKm } from "@/lib/utils/calculateDistanceKm";
import { formatDate } from "@/lib/utils/formatDate";

type ScanDataCardProps = {
  scan: ScanRecord;
  onNext: () => void;
};

const origin = {
  latitude: 7.883,
  longitude: -76.633
};

export function ScanDataCard({ scan, onNext }: ScanDataCardProps) {
  const distance = calculateDistanceKm(origin, {
    latitude: scan.latitude,
    longitude: scan.longitude
  });

  const rows = [
    {
      label: "Lugar del escaneo",
      value: scan.locationLabel ?? "No identificado"
    },
    {
      label: "Coordenadas",
      value:
        scan.latitude !== null && scan.longitude !== null
          ? `${scan.latitude.toFixed(5)}, ${scan.longitude.toFixed(5)}`
          : "Sin coordenadas registradas"
    },
    {
      label: "Fecha y hora",
      value: formatDate(scan.createdAt)
    },
    {
      label: "Código QR / lote",
      value: `${scan.qrCodeId} / ${scan.lotCode}`
    },
    {
      label: "Distancia desde Apartadó",
      value: distance ? `${distance.toLocaleString("es-CO")} km` : "No disponible"
    },
    {
      label: "Permiso de ubicación",
      value: scan.permissionStatus
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="flex min-h-screen items-center justify-center px-6 py-10"
    >
      <div className="glass-panel w-full max-w-5xl rounded-[2rem] p-8 shadow-glow lg:p-10">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-lime">
              Datos del escaneo
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-white sm:text-4xl">
              Esta caja fue escaneada después de iniciar su recorrido en Apartadó,
              Urabá, Colombia.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-sky/65">
                  {row.label}
                </p>
                <p className="mt-3 text-base font-semibold leading-7 text-white">
                  {row.value}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-lime px-6 py-4 font-semibold text-jungle transition hover:bg-white"
          >
            Siguiente
          </button>
        </div>
      </div>
    </motion.section>
  );
}
