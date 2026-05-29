import { AdminDashboard } from "@/components/AdminDashboard";
import { getScanRepository } from "@/lib/data/scan-repository";

export default async function AdminPage() {
  const repository = getScanRepository();
  const scans = await repository.list();

  return <AdminDashboard scans={scans} />;
}
