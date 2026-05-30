import { NextResponse } from "next/server";

import { authenticateUser, getConfiguredUsers, setServerSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    if (getConfiguredUsers().length === 0) {
      return NextResponse.json(
        { error: "No hay usuarios configurados para el panel administrativo." },
        { status: 503 }
      );
    }

    const user = authenticateUser(body.username, body.password);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 401 }
      );
    }

    await setServerSession(user);

    return NextResponse.json({
      ok: true,
      user: {
        username: user.username,
        role: user.role,
        displayName: user.displayName
      }
    });
  } catch {
    return NextResponse.json(
      { error: "No fue posible iniciar sesión." },
      { status: 500 }
    );
  }
}
