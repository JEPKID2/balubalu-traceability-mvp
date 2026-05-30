import { redirect } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/AdminLoginForm";
import { BaluLogo } from "@/components/BaluLogo";
import { getConfiguredUsers, getServerSession, userHasRole } from "@/lib/auth/session";

export default async function AdminLoginPage() {
  const session = await getServerSession();

  if (session && userHasRole(session, ["admin", "analyst"])) {
    redirect("/admin");
  }

  const configuredUsers = getConfiguredUsers();
  const defaultDevUser = configuredUsers[0];
  const hint =
    process.env.NODE_ENV !== "production" && defaultDevUser
      ? `Modo desarrollo: usuario "${defaultDevUser.username}", contraseña "${defaultDevUser.password}" y rol ${defaultDevUser.role}. Cambia estas credenciales con BALU_AUTH_USERS antes de producción.`
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07131c] px-6 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow">
          <div className="space-y-6">
            <BaluLogo compact className="max-w-[220px]" />

            <div className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-4 py-2 text-sm text-lime">
              <LockKeyhole className="h-4 w-4" />
              Acceso protegido
            </div>

            <div className="space-y-4">
              <h1 className="font-[var(--font-display)] text-4xl font-semibold text-white">
                Ingresa al panel administrativo
              </h1>
              <p className="text-base leading-8 text-sky/70">
                El dashboard `/admin` ahora requiere autenticación y valida el rol
                de la sesión antes de mostrar métricas, filtros y registros.
              </p>
            </div>

            <AdminLoginForm defaultUsername={defaultDevUser?.username} hint={hint} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0a2234] to-[#10253a] p-8 shadow-glow">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
              <ShieldCheck className="h-4 w-4 text-lime" />
              Roles y sesión
            </div>

            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-white">
              Qué protege este acceso
            </h2>

            <ul className="space-y-4 text-base leading-8 text-sky/70">
              <li>Bloquea el dashboard a visitantes no autenticados.</li>
              <li>Permite controlar acceso por rol para admin, analyst o viewer.</li>
              <li>Usa una cookie de sesión `httpOnly` con firma HMAC.</li>
              <li>Deja lista la base para migrar a un proveedor formal de identidad.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
