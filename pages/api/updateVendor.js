// pages/api/vendor/update.js
import { auth, db } from "@/firebase";
import { getAuth } from "firebase/auth";
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
    const { vendorId, ...updatedData } = req.body; // Extract vendorId and the rest of the data

    try {
      // Query Firestore to find the vendor by vendorId
      const vendorQuery = query(
        collection(db, "vendors"),
        where("vid", "==", vendorId)
      );
      const vendorSnapshot = await getDocs(vendorQuery);

      if (vendorSnapshot.empty) {
        return res.status(404).json({ message: "Vendor not found." });
      }

      // Get the vendor document reference (assuming only one document will match)
      const vendorDocRef = doc(db, "vendors", vendorSnapshot.docs[0].id);

      // Update the vendor document in Firestore
      await updateDoc(vendorDocRef, updatedData);

      res.status(200).json({ message: "Vendor details updated successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
