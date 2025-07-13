import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminNavigation from "./admin-navigation"; // We will create this client component next

// This is an async Server Component acting as a security layout
export default async function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 1. Redirect if not logged in
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Fetch user details from the database
  let user = null;
  try {
    const client = await clientPromise;
    const db = client.db();
    user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });
  } catch (error) {
    console.error("Admin Layout: DB Error", error);
    redirect("/dashboard?error=auth_failed"); // Redirect on error
  }

  // 3. Perform the definitive admin check on the server
  const isAdmin = user?.role === 'admin' || user?.email === 'kybeedd@gmail.com';

  // 4. If the user is not an admin, deny access to the entire /admin section
  if (!isAdmin) {
    redirect("/dashboard"); // Or show a 403 Forbidden page
  }

  // 5. If the check passes, render the admin UI layout with the page content
  return <AdminNavigation>{children}</AdminNavigation>;
}