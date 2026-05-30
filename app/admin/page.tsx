import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/AdminDashboard";
import { getServerSession, userHasRole } from "@/lib/auth/session";
import { getScanRepository } from "@/lib/data/scan-repository";

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (!userHasRole(session, ["admin", "analyst"])) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07131c] px-6 py-10">
        <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-lime">Acceso restringido</p>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold">
            Tu rol no tiene acceso al dashboard
          </h1>
          <p className="mt-4 text-base leading-8 text-sky/70">
            Esta sesión está autenticada, pero el rol actual no cuenta con permisos
            para consultar `/admin`.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="brand-button">
              Ir a la landing
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/10"
            >
              Cambiar de usuario
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const repository = getScanRepository();
  const scans = await repository.list();

  return <AdminDashboard scans={scans} session={session} />;
}
