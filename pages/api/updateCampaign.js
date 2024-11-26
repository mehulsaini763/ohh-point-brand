import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { cid, ...updatedCampaign } = req.body;

    if (!cid) {
      return res.status(400).json({ message: "Campaign ID is required." });
    }

    try {
      // Reference to the campaign document
      const campaignRef = doc(db, "campaigns", cid);

      // Update fields in the campaign
      await updateDoc(campaignRef, updatedCampaign);

      res.status(200).json({ message: "Campaign updated successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
