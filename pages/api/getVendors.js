import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const vendorsCollection = collection(db, "vendors");

      const vendorSnapshot = await getDocs(vendorsCollection);
      const vendors = [];

      vendorSnapshot.forEach((doc) => {
        vendors.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
