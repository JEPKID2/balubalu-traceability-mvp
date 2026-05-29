"use client";

import { LoaderCircle, LocateFixed, MapPinned, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

type LocationPermissionProps = {
  isSubmitting: boolean;
  errorMessage?: string | null;
  onRequestLocation: () => void;
  onContinueWithoutLocation: () => void;
};

export function LocationPermission({
  isSubmitting,
  errorMessage,
  onRequestLocation,
  onContinueWithoutLocation
}: LocationPermissionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.45 }}
      className="flex min-h-screen items-center justify-center px-6 py-10"
    >
      <div className="glass-panel relative w-full max-w-4xl overflow-hidden rounded-[2rem] p-6 shadow-glow sm:p-8 lg:p-10">
        <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-lime/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-ocean/30 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-sky/80">
              <LocateFixed className="h-4 w-4 text-lime" />
              Permiso de ubicación
            </span>

            <div className="space-y-4">
              <h2 className="font-[var(--font-display)] text-3xl font-semibold text-white sm:text-5xl">
                Permite tu ubicación para visualizar el recorrido de esta caja Balú
                desde su origen hasta tu destino.
              </h2>
              <p className="max-w-xl text-base leading-8 text-sky/75">
                Usaremos tu ubicación únicamente para registrar el punto del escaneo y
                animar el trayecto internacional de esta caja.
              </p>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-ember/40 bg-ember/10 p-4 text-sm leading-7 text-sand">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onRequestLocation}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-lime px-6 py-4 font-semibold text-jungle transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Detectando ubicación
                  </>
                ) : (
                  <>
                    <MapPinned className="h-5 w-5" />
                    Permitir ubicación
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onContinueWithoutLocation}
                disabled={isSubmitting}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Continuar sin ubicación
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-white">
                <ShieldAlert className="h-5 w-5 text-ember" />
                <span className="font-semibold">Manejo responsable del dato</span>
              </div>

              <ul className="space-y-4 text-sm leading-7 text-sky/75">
                <li>Se registra latitud, longitud, idioma, navegador y fecha del escaneo.</li>
                <li>Si rechazas el permiso, la experiencia sigue funcionando sin romperse.</li>
                <li>La arquitectura queda lista para migrar el historial a una base de datos.</li>
              </ul>

              <div className="rounded-2xl border border-white/10 bg-ocean/35 p-5 text-sm leading-7 text-sky">
                Consejo MVP: en producción este flujo debería acompañarse con política de
                privacidad, consentimiento legal y autenticación en el dashboard admin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
