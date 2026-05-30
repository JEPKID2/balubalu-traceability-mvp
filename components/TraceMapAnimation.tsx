"use client";

// Removed Leaflet CSS import since we now use Three.js 3D Globe

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Boxes, Globe2, Navigation, ScanLine } from "lucide-react";

import type { PermissionStatus } from "@/lib/types/scan";
import { calculateDistanceKm } from "@/lib/utils/calculateDistanceKm";

const TraceGlobeCanvas = dynamic(() => import("@/components/TraceGlobeCanvas"), { ssr: false });

const origin = {
  latitude: 7.883,
  longitude: -76.633,
  label: "Origen: Apartadó, Urabá, Colombia"
};

type TraceMapAnimationProps = {
  destination: {
    latitude: number | null;
    longitude: number | null;
    label?: string | null;
  };
  permissionStatus: PermissionStatus;
  onNext: () => void;
};

export function TraceMapAnimation({
  destination,
  permissionStatus,
  onNext
}: TraceMapAnimationProps) {
  const fallbackDestination = {
    latitude: 51.9244,
    longitude: 4.4777,
    label: "Puerto de Rotterdam, Países Bajos"
  };

  const resolvedDestination =
    destination.latitude !== null && destination.longitude !== null
      ? {
          latitude: destination.latitude,
          longitude: destination.longitude,
          label: destination.label ?? "Destino detectado"
        }
      : fallbackDestination;

  const distanceKm = calculateDistanceKm(origin, resolvedDestination);
  const [hasIntroFinished, setHasIntroFinished] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHasIntroFinished(true), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Origen",
        value: "Apartadó, Urabá"
      },
      {
        label: "Destino",
        value: resolvedDestination.label
      },
      {
        label: "Trayecto aproximado",
        value: distanceKm ? `${distanceKm.toLocaleString("es-CO")} km` : "Ruta simbólica"
      }
    ],
    [distanceKm, resolvedDestination.label]
  );

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="glass-panel relative w-full max-w-7xl overflow-hidden rounded-[2rem] p-4 shadow-tropical sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-mesh-balu opacity-80" />

        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-[#08121d]/70 p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-sky/60">
                  Recorrido trazable
                </p>
                <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white sm:text-4xl">
                  De Apartadó al destino detectado
                </h2>
              </div>
              <Globe2 className="hidden h-10 w-10 text-lime sm:block" />
            </div>

            <div className="relative h-[52vh] min-h-[380px] overflow-hidden rounded-[1.5rem] border border-white/10">
              <TraceGlobeCanvas origin={origin} destination={resolvedDestination} />

              {!hasIntroFinished ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#06131b]/82 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-lime/30 bg-lime/10">
                      <Boxes className="h-10 w-10 text-lime" />
                    </div>
                    <p className="max-w-sm text-sm uppercase tracking-[0.35em] text-sky/70">
                      Activando visualización del trayecto
                    </p>
                  </motion.div>
                </div>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-7 text-sky/70">
              {permissionStatus === "accepted"
                ? "El recorrido usa la ubicación detectada para mostrar un trayecto estimado y visualmente trazable."
                : "No hubo permiso de ubicación, así que mostramos una ruta simbólica internacional sin romper la experiencia."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6">
              <div className="flex items-center gap-3 text-lime">
                <ScanLine className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.28em]">Estado del trayecto</span>
              </div>

              <div className="mt-5 space-y-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-sky/65">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-ocean/35 p-6">
              <div className="flex items-start gap-3">
                <Navigation className="mt-1 h-5 w-5 text-ember" />
                <div className="space-y-3 text-sm leading-7 text-sky">
                  <p>
                    Coordenadas de origen: <span className="text-white">7.883, -76.633</span>
                  </p>
                  <p>
                    Coordenadas destino:{" "}
                    <span className="text-white">
                      {resolvedDestination.latitude.toFixed(3)},{" "}
                      {resolvedDestination.longitude.toFixed(3)}
                    </span>
                  </p>
                  <p>
                    Comentario técnico: ¡Mapa Leaflet original reemplazado exitosamente
                    por un globo interactivo 3D premium con Three.js para una experiencia inmersiva!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="w-full rounded-full bg-lime px-6 py-4 font-semibold text-jungle transition hover:bg-white"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
