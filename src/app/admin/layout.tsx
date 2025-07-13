import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminNavigation from "./../../components/admin/admin-navigation"; // Using a standard components path

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Fetch user from DB to verify role
  let user = null;
  try {
    const client = await clientPromise;
    const db = client.db();
    user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });
  } catch (error) {
    console.error("Admin Layout DB Error:", error);
    redirect("/dashboard?error=auth_failed");
  }

  // 3. Check if the user is an admin
  const isAdmin = user?.role === 'admin' || user?.email === 'kybeedd@gmail.com';

  // 4. If not an admin, redirect them away
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // 5. If they are an admin, wrap the page in the admin navigation UI
  return <AdminNavigation>{children}</AdminNavigation>;
}