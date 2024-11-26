import { db } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { cid } = req.body;

    if (!cid) {
      return res.status(400).json({ message: "Campaign ID is required." });
    }

    try {
      const campaignRef = doc(db, "campaigns", cid);
      await deleteDoc(campaignRef);
      res.status(200).json({ message: "Campaign deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
