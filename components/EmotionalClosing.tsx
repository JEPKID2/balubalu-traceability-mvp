"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

type EmotionalClosingProps = {
  onReplay: () => void;
};

export function EmotionalClosing({ onReplay }: EmotionalClosingProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen items-center justify-center px-6 py-10"
    >
      <div className="glass-panel relative w-full max-w-4xl overflow-hidden rounded-[2rem] p-10 text-center shadow-tropical">
        <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-lime/20 blur-3xl" />
        <div className="relative space-y-6">
          <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.28em] text-sky/75">
            Cierre del recorrido
          </span>

          <h2 className="font-[var(--font-display)] text-4xl font-semibold text-white sm:text-5xl">
            De nuestra tierra a tu destino
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-sky/75 sm:text-lg">
            Gracias por ser parte del recorrido de Balú. Cada escaneo nos ayuda a
            visualizar cómo el trabajo del campo colombiano llega a nuevos lugares del
            mundo.
          </p>

          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-3 rounded-full bg-lime px-6 py-4 font-semibold text-jungle transition hover:bg-white"
          >
            <RefreshCcw className="h-5 w-5" />
            Ver recorrido nuevamente
          </button>
        </div>
      </div>
    </motion.section>
  );
}
