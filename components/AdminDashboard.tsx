"use client";

import "leaflet/dist/leaflet.css";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarDays, Package2, Radar, ShieldCheck } from "lucide-react";

import type { PermissionStatus, ScanRecord } from "@/lib/types/scan";
import { formatDate } from "@/lib/utils/formatDate";

const AdminMap = dynamic(() => import("@/components/AdminMap"), { ssr: false });

type AdminDashboardProps = {
  scans: ScanRecord[];
};

export function AdminDashboard({ scans }: AdminDashboardProps) {
  const [dateFilter, setDateFilter] = useState("");
  const [lotFilter, setLotFilter] = useState("");
  const [permissionFilter, setPermissionFilter] = useState<PermissionStatus | "all">("all");

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesDate = dateFilter
        ? scan.createdAt.startsWith(dateFilter)
        : true;
      const matchesLot = lotFilter
        ? scan.lotCode.toLowerCase().includes(lotFilter.toLowerCase())
        : true;
      const matchesPermission =
        permissionFilter === "all"
          ? true
          : scan.permissionStatus === permissionFilter;

      return matchesDate && matchesLot && matchesPermission;
    });
  }, [dateFilter, lotFilter, permissionFilter, scans]);

  const scanStats = useMemo(() => {
    const accepted = scans.filter((scan) => scan.permissionStatus === "accepted").length;
    const denied = scans.filter((scan) => scan.permissionStatus === "denied").length;

    return [
      { label: "Total escaneos", value: scans.length, icon: Radar },
      { label: "Ubicación aceptada", value: accepted, icon: ShieldCheck },
      { label: "Permiso denegado", value: denied, icon: CalendarDays },
      { label: "Lotes únicos", value: new Set(scans.map((scan) => scan.lotCode)).size, icon: Package2 }
    ];
  }, [scans]);

  return (
    <div className="min-h-screen bg-[#07131c] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-lime">/admin</p>
          <h1 className="font-[var(--font-display)] text-4xl font-semibold text-white">
            Dashboard administrativo Balú
          </h1>
          <p className="max-w-3xl text-base leading-8 text-sky/70">
            MVP sin autenticación. Antes de producción, esta ruta debería protegerse
            con autenticación, autorización por roles y persistencia en una base de
            datos administrada.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {scanStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.2em] text-sky/65">
                    {stat.label}
                  </p>
                  <Icon className="h-5 w-5 text-lime" />
                </div>
                <p className="mt-5 text-4xl font-semibold text-white">{stat.value}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-glow">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-[var(--font-display)] text-2xl font-semibold text-white">
                  Filtros
                </h2>
                <p className="text-sm text-sky/65">Por fecha, lote y permiso</p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2">
                <span className="text-sm text-sky/70">Fecha</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-lime"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-sky/70">Lote</span>
                <input
                  type="text"
                  value={lotFilter}
                  onChange={(event) => setLotFilter(event.target.value)}
                  placeholder="Ej. LOTE-UR-2026-001"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-lime"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-sky/70">Permiso</span>
                <select
                  value={permissionFilter}
                  onChange={(event) =>
                    setPermissionFilter(event.target.value as PermissionStatus | "all")
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-lime"
                >
                  <option value="all">Todos</option>
                  <option value="accepted">accepted</option>
                  <option value="denied">denied</option>
                  <option value="unavailable">unavailable</option>
                </select>
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-glow">
            <h2 className="mb-4 font-[var(--font-display)] text-2xl font-semibold text-white">
              Mapa de escaneos
            </h2>
            <div className="h-[360px] overflow-hidden rounded-[1.5rem] border border-white/10">
              <AdminMap scans={filteredScans} />
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-glow">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-white">
                Registros
              </h2>
              <p className="text-sm text-sky/65">
                {filteredScans.length} resultados filtrados de {scans.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.22em] text-sky/55">
                  <th className="px-4">Fecha</th>
                  <th className="px-4">Lote</th>
                  <th className="px-4">QR</th>
                  <th className="px-4">Ubicación</th>
                  <th className="px-4">Coordenadas</th>
                  <th className="px-4">Permiso</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="rounded-2xl border border-white/10 bg-black/20 text-sm text-sky"
                  >
                    <td className="rounded-l-2xl px-4 py-4">{formatDate(scan.createdAt)}</td>
                    <td className="px-4 py-4 text-white">{scan.lotCode}</td>
                    <td className="px-4 py-4">{scan.qrCodeId}</td>
                    <td className="px-4 py-4">
                      {scan.locationLabel ?? "Sin ubicación identificada"}
                    </td>
                    <td className="px-4 py-4">
                      {scan.latitude !== null && scan.longitude !== null
                        ? `${scan.latitude.toFixed(4)}, ${scan.longitude.toFixed(4)}`
                        : "N/D"}
                    </td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                        {scan.permissionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
