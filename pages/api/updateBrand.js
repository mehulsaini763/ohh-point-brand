import { auth, db } from "@/firebase";
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
    const { brandId, ...updatedData } = req.body;

    try {

      const brandQuery = query(
        collection(db, "brands"),
        where("brandId", "==", brandId)
      );
      const brandSnapshot = await getDocs(brandQuery);

      if (brandSnapshot.empty) {
        return res.status(404).json({ message: "Brand not found." });
      }

      const brandDocRef = doc(db, "brands", brandSnapshot.docs[0].id);

      await updateDoc(brandDocRef, updatedData);

      res.status(200).json({ message: "Brand details updated successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
