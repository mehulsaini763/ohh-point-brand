import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { userId, ...updatedData } = req.body;

    try {

      const userQuery = query(
        collection(db, "users"),
        where("userId", "==", userId)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        return res.status(404).json({ message: "User not found." });
      }

      const userDocRef = doc(db, "users", userSnapshot.docs[0].id);

      await updateDoc(userDocRef, updatedData);

      res.status(200).json({ message: "User details updated successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
