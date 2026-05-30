"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST"
    });

    startTransition(() => {
      router.push("/admin/login");
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
