"use client";

import { motion } from "framer-motion";

type BaluValueSectionProps = {
  onNext: () => void;
};

export function BaluValueSection({ onNext }: BaluValueSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen items-center justify-center px-6 py-10"
    >
      <div className="glass-panel relative w-full max-w-6xl overflow-hidden rounded-[2rem] p-8 shadow-glow lg:p-12">
        <div className="absolute inset-0 bg-mesh-balu opacity-80" />

        <div className="relative space-y-8">
          <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-sky/80">
            Identidad de origen
          </span>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div className="space-y-5">
              <h2 className="font-[var(--font-display)] text-3xl font-semibold text-white sm:text-5xl">
                Más que una caja, una historia de origen
              </h2>
              <p className="max-w-3xl text-base leading-8 text-sky/75 sm:text-lg">
                Balú representa el esfuerzo de una finca productora ubicada en
                Apartadó, Urabá, una región agrícola estratégica de Colombia. Cada
                fruto es cultivado, seleccionado y empacado con compromiso, llevando al
                mundo un producto fresco, confiable y con identidad de origen.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "Cultivo con identidad territorial",
                "Selección y empaque orientados a exportación",
                "Trazabilidad para conectar origen y destino"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-sky"
                >
                  {item}
                </div>
              ))}
            </div>
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
