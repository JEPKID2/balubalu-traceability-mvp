"use client";

import { Player } from "@remotion/player";
import { motion } from "framer-motion";

import { PlantGrowthScene } from "@/components/PlantGrowthScene";

type PlantGrowthAnimationProps = {
  onNext: () => void;
};

export function PlantGrowthAnimation({ onNext }: PlantGrowthAnimationProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45 }}
      className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6"
    >
      <div className="glass-panel w-full max-w-7xl overflow-hidden rounded-[2rem] p-4 shadow-tropical sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.28em] text-lime">
              Animación agrícola
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-white sm:text-5xl">
              Cada caja Balú nace desde la tierra
            </h2>
            <p className="max-w-xl text-base leading-8 text-sky/75">
              Antes de cruzar fronteras, cada fruto crece en el campo colombiano,
              pasa por un proceso de cuidado, selección y empaque, hasta convertirse
              en un producto listo para exportación.
            </p>
            <p className="rounded-2xl border border-white/10 bg-ocean/30 p-4 text-sm leading-7 text-sky">
              Esta versión usa <span className="text-white">Remotion Player</span> para
              la coreografía secuencial. Si luego quieren producir una versión narrativa
              en video o campañas sociales, la misma escena puede renderizarse como pieza
              audiovisual.
            </p>
            <button
              type="button"
              onClick={onNext}
              className="rounded-full bg-lime px-6 py-4 font-semibold text-jungle transition hover:bg-white"
            >
              Siguiente
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07141d] p-3">
            <Player
              component={PlantGrowthScene}
              durationInFrames={190}
              fps={30}
              compositionWidth={1280}
              compositionHeight={720}
              controls
              loop
              autoPlay
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: "24px",
                overflow: "hidden"
              }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
