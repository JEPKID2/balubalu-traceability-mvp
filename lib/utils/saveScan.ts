import type { ScanRecordInput } from "@/lib/types/scan";
import { getScanRepository } from "@/lib/data/scan-repository";

export async function saveScan(input: ScanRecordInput) {
  const repository = getScanRepository();
  return repository.create(input);
}
