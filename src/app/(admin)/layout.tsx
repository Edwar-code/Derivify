import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminNavigation from "@/app/(admin)/admin/admin-navigation"; // <-- CORRECTED IMPORT PATH

export default async function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  let user = null;
  try {
    const client = await clientPromise;
    const db = client.db();
    user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });
  } catch (error) {
    console.error("Admin Layout: DB Error", error);
    redirect("/dashboard?error=auth_failed");
  }

  const isAdmin = user?.role === 'admin' || user?.email === 'kybeedd@gmail.com';

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return <AdminNavigation>{children}</AdminNavigation>;
}