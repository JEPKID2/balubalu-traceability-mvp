"use client";

import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { BaluValueSection } from "@/components/BaluValueSection";
import { EmotionalClosing } from "@/components/EmotionalClosing";
import { LocationPermission } from "@/components/LocationPermission";
import { PlantGrowthAnimation } from "@/components/PlantGrowthAnimation";
import { ScanDataCard } from "@/components/ScanDataCard";
import { TraceMapAnimation } from "@/components/TraceMapAnimation";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import type { PermissionStatus, ScanRecord } from "@/lib/types/scan";

type DestinationState = {
  latitude: number | null;
  longitude: number | null;
  label?: string | null;
};

type ExperienceStep =
  | "welcome"
  | "location"
  | "trace"
  | "plant"
  | "value"
  | "data"
  | "closing";

const originMetadata = {
  originCity: "Apartadó",
  originRegion: "Urabá",
  originCountry: "Colombia"
};

function ExperiencePage() {
  const searchParams = useSearchParams();
  const qrCodeId = searchParams.get("qr") ?? "BALU-QR-0001";
  const lotCode = searchParams.get("lot") ?? "LOTE-UR-2026-001";

  const [step, setStep] = useState<ExperienceStep>("welcome");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("unavailable");
  const [destination, setDestination] = useState<DestinationState>({
    latitude: null,
    longitude: null,
    label: null
  });
  const [savedScan, setSavedScan] = useState<ScanRecord | null>(null);

  const registerScan = async (payload: {
    latitude: number | null;
    longitude: number | null;
    permissionStatus: PermissionStatus;
  }) => {
    const response = await fetch("/api/scans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        qrCodeId,
        lotCode,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
        language: typeof navigator !== "undefined" ? navigator.language : "es-CO",
        createdAt: new Date().toISOString(),
        ...originMetadata,
        ...payload
      })
    });

    if (!response.ok) {
      throw new Error("No fue posible guardar el escaneo.");
    }

    const data = (await response.json()) as { scan: ScanRecord };
    setSavedScan(data.scan);
    setDestination({
      latitude: data.scan.latitude,
      longitude: data.scan.longitude,
      label: data.scan.locationLabel
    });
    setPermissionStatus(data.scan.permissionStatus);
    setStep("trace");
  };

  const handleLocationRequest = () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    const fallbackToIpGeo = async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.latitude !== undefined && ipData.longitude !== undefined) {
            await registerScan({
              latitude: ipData.latitude,
              longitude: ipData.longitude,
              permissionStatus: "accepted"
            });
            return true;
          }
        }
      } catch (err) {
        console.error("IP Geolocation fallback failed:", err);
      }
      return false;
    };

    if (!("geolocation" in navigator)) {
      fallbackToIpGeo()
        .then((success) => {
          if (!success) {
            registerScan({
              latitude: null,
              longitude: null,
              permissionStatus: "unavailable"
            }).catch(() =>
              setErrorMessage("No fue posible registrar el escaneo.")
            );
          }
        })
        .finally(() => setIsSubmitting(false));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await registerScan({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            permissionStatus: "accepted"
          });
        } catch {
          setErrorMessage("Hubo un problema registrando el escaneo con ubicación.");
        } finally {
          setIsSubmitting(false);
        }
      },
      async (error) => {
        try {
          // Intentar geolocalización por IP antes de desistir y pasar a coordenadas de caída
          const ipGeoSuccess = await fallbackToIpGeo();
          if (!ipGeoSuccess) {
            const permStatus =
              error.code === error.PERMISSION_DENIED ? "denied" : "unavailable";
            await registerScan({
              latitude: null,
              longitude: null,
              permissionStatus: permStatus
            });

            if (error.code === error.PERMISSION_DENIED) {
              setErrorMessage(
                "La ubicación fue rechazada. Continuamos con una ruta internacional simbólica."
              );
            } else {
              setErrorMessage(
                "No se pudo obtener la ubicación. Continuamos con una ruta simbólica."
              );
            }
          }
        } catch {
          setErrorMessage("No fue posible registrar el escaneo.");
        } finally {
          setIsSubmitting(false);
        }
      },
      {
        enableHighAccuracy: false, // Prevents timeouts and failures on desktop devices without GPS
        timeout: 15000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  };

  const handleContinueWithoutLocation = () => {
    setErrorMessage("Experiencia iniciada sin permiso de ubicación.");
    setIsSubmitting(true);

    registerScan({
      latitude: null,
      longitude: null,
      permissionStatus: "denied"
    })
      .catch(() => setErrorMessage("No fue posible registrar el escaneo sin ubicación."))
      .finally(() => setIsSubmitting(false));
  };

  const resetExperience = () => {
    setStep("welcome");
    setErrorMessage(null);
    setPermissionStatus("unavailable");
    setDestination({ latitude: null, longitude: null, label: null });
    setSavedScan(null);
  };

  return (
    <main className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "welcome" ? (
          <WelcomeScreen
            key="welcome"
            onStart={() => setStep("location")}
            qrCodeId={qrCodeId}
            lotCode={lotCode}
          />
        ) : null}

        {step === "location" ? (
          <LocationPermission
            key="location"
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onRequestLocation={handleLocationRequest}
            onContinueWithoutLocation={handleContinueWithoutLocation}
          />
        ) : null}

        {step === "trace" ? (
          <TraceMapAnimation
            key="trace"
            destination={destination}
            permissionStatus={permissionStatus}
            onNext={() => setStep("plant")}
          />
        ) : null}

        {step === "plant" ? (
          <PlantGrowthAnimation key="plant" onNext={() => setStep("value")} />
        ) : null}

        {step === "value" ? (
          <BaluValueSection key="value" onNext={() => setStep("data")} />
        ) : null}

        {step === "data" && savedScan ? (
          <ScanDataCard key="data" scan={savedScan} onNext={() => setStep("closing")} />
        ) : null}

        {step === "closing" ? (
          <EmotionalClosing key="closing" onReplay={resetExperience} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Cargando experiencia Balú…</div>}>
      <ExperiencePage />
    </Suspense>
  );
}
