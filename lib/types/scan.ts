export type PermissionStatus = "accepted" | "denied" | "unavailable";

export type ScanRecordInput = {
  qrCodeId: string;
  lotCode: string;
  latitude: number | null;
  longitude: number | null;
  permissionStatus: PermissionStatus;
  userAgent: string;
  language: string;
  createdAt: string;
  originCity: string;
  originRegion: string;
  originCountry: string;
  locationLabel?: string | null;
};

export type ScanRecord = ScanRecordInput & {
  id: string;
};
