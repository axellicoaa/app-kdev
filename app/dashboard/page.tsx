import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies(); // 👈 con await
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardClient />;
}
