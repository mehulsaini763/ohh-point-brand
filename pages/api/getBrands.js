import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const brandsCollection = collection(db, "brands");

      const brandSnapshot = await getDocs(brandsCollection);
      const brands = [];

      brandSnapshot.forEach((doc) => {
        brands.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(brands);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
