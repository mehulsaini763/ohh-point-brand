import { auth, db } from "@/firebase";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { userId } = req.body;

    // Validate input data
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      // Get the user by userId
      const userDoc = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: "User not found." });
      }

      await deleteDoc(userDoc);

      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
