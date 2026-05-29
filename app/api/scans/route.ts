import { NextResponse } from "next/server";

import { getScanRepository } from "@/lib/data/scan-repository";
import type { PermissionStatus, ScanRecordInput } from "@/lib/types/scan";
import { reverseGeocode } from "@/lib/utils/reverseGeocode";
import { saveScan } from "@/lib/utils/saveScan";

function normalizePermissionStatus(value: unknown): PermissionStatus {
  if (value === "accepted" || value === "denied" || value === "unavailable") {
    return value;
  }

  return "unavailable";
}

export async function GET() {
  const repository = getScanRepository();
  const scans = await repository.list();

  return NextResponse.json({
    total: scans.length,
    scans
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ScanRecordInput>;

    if (!body.qrCodeId || !body.lotCode) {
      return NextResponse.json(
        { error: "qrCodeId y lotCode son obligatorios." },
        { status: 400 }
      );
    }

    const permissionStatus = normalizePermissionStatus(body.permissionStatus);
    const location = await reverseGeocode(body.latitude ?? null, body.longitude ?? null);

    const scan = await saveScan({
      qrCodeId: body.qrCodeId,
      lotCode: body.lotCode,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      permissionStatus,
      userAgent: body.userAgent ?? "unknown",
      language: body.language ?? "unknown",
      createdAt: body.createdAt ?? new Date().toISOString(),
      originCity: body.originCity ?? "Apartadó",
      originRegion: body.originRegion ?? "Urabá",
      originCountry: body.originCountry ?? "Colombia",
      locationLabel: body.locationLabel ?? location.label
    });

    return NextResponse.json({ scan }, { status: 201 });
  } catch (error) {
    console.error("Failed to register scan", error);

    return NextResponse.json(
      { error: "No fue posible registrar el escaneo." },
      { status: 500 }
    );
  }
}
