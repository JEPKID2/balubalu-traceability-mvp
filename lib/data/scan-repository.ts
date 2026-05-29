import { promises as fs } from "node:fs";
import path from "node:path";

import type { ScanRecord, ScanRecordInput } from "@/lib/types/scan";

const scansFilePath = path.join(process.cwd(), "lib", "data", "scans.json");
const inMemoryFallback: ScanRecord[] = [];

export interface ScanRepository {
  list(): Promise<ScanRecord[]>;
  create(input: ScanRecordInput): Promise<ScanRecord>;
}

function buildScanRecord(input: ScanRecordInput): ScanRecord {
  return {
    ...input,
    id: crypto.randomUUID()
  };
}

async function readScansFromDisk() {
  try {
    const raw = await fs.readFile(scansFilePath, "utf8");
    return JSON.parse(raw) as ScanRecord[];
  } catch {
    return inMemoryFallback;
  }
}

async function writeScansToDisk(scans: ScanRecord[]) {
  try {
    await fs.writeFile(scansFilePath, JSON.stringify(scans, null, 2), "utf8");
  } catch {
    inMemoryFallback.splice(0, inMemoryFallback.length, ...scans);
  }
}

export class LocalJsonScanRepository implements ScanRepository {
  async list() {
    const scans = await readScansFromDisk();
    return scans.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(input: ScanRecordInput) {
    const scans = await readScansFromDisk();
    const record = buildScanRecord(input);
    const nextScans = [record, ...scans];

    await writeScansToDisk(nextScans);

    return record;
  }
}

// This factory keeps the storage layer swappable.
// A future Supabase, PostgreSQL or MySQL repository can implement the same interface.
export function getScanRepository(): ScanRepository {
  return new LocalJsonScanRepository();
}
