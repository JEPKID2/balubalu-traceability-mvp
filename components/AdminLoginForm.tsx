"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";

type AdminLoginFormProps = {
  defaultUsername?: string;
  hint?: string;
};

export function AdminLoginForm({
  defaultUsername = "",
  hint
}: AdminLoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setErrorMessage(data.error ?? "No fue posible iniciar sesión.");
      return;
    }

    startTransition(() => {
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {hint ? (
        <div className="rounded-2xl border border-lime/25 bg-lime/10 p-4 text-sm leading-7 text-lime">
          {hint}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
          {errorMessage}
        </div>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm uppercase tracking-[0.22em] text-sky/65">Usuario</span>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-lime"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm uppercase tracking-[0.22em] text-sky/65">Contraseña</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-lime"
        />
      </label>

      <button type="submit" disabled={isPending} className="brand-button w-full">
        {isPending ? (
          <>
            <LockKeyhole className="h-5 w-5" />
            Validando acceso...
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Ingresar al panel
          </>
        )}
      </button>
    </form>
  );
}
