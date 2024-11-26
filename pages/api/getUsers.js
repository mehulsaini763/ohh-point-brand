import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const usersCollection = collection(db, "users");

      const userSnapshot = await getDocs(usersCollection);
      const users = [];

      userSnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
