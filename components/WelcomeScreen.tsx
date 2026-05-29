"use client";

import { motion } from "framer-motion";
import { ArrowRight, ScanSearch } from "lucide-react";

type WelcomeScreenProps = {
  onStart: () => void;
  qrCodeId: string;
  lotCode: string;
};

export function WelcomeScreen({ onStart, qrCodeId, lotCode }: WelcomeScreenProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12"
    >
      <div className="hero-grid absolute inset-0 opacity-40" />

      <div className="absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full bg-leaf/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-ember/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-8">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-lime">
            <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_16px_rgba(167,217,72,0.85)]" />
            Balú
          </span>

          <div className="space-y-5">
            <h1 className="font-[var(--font-display)] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
              Bienvenido al recorrido de Balú
            </h1>
            <p className="max-w-xl text-base leading-8 text-sky/78 sm:text-lg">
              Descubre el viaje de esta caja desde Apartadó, Urabá, Colombia, hasta
              el lugar donde fue escaneada.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-sky/72">
            <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              QR: <span className="text-white">{qrCodeId}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              Lote: <span className="text-white">{lotCode}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center gap-3 rounded-full bg-lime px-6 py-4 font-semibold text-jungle transition hover:bg-white"
          >
            Iniciar experiencia
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>

        <div className="glass-panel relative w-full max-w-xl overflow-hidden rounded-[2rem] p-6 shadow-tropical">
          <div className="absolute inset-0 bg-mesh-balu opacity-100" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-ocean/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-sky">
                Trazabilidad
              </span>
              <ScanSearch className="h-6 w-6 text-lime" />
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-sky/70">
                  Origen
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  Apartadó, Urabá, Colombia
                </p>
              </div>

              <div className="flex items-center gap-4 px-2">
                <div className="h-3 w-3 animate-pulseSoft rounded-full bg-lime" />
                <div className="h-px flex-1 bg-gradient-to-r from-lime via-ember to-sky" />
                <div className="h-3 w-3 animate-pulseSoft rounded-full bg-ember" />
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-sky/70">
                  Destino
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  Lugar del escaneo
                </p>
                <p className="mt-3 text-sm leading-7 text-sky/75">
                  Cada escaneo activa una visualización del recorrido internacional de
                  esta caja Balú.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
