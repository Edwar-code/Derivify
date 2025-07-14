import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ derivPoaStatus: user.derivPoaStatus });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
