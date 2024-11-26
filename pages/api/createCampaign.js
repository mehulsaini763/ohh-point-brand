import { db, storage } from "@/firebase"; // Adjust based on your Firebase config
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

// Generate a unique campaign ID
const generateUuid = () => {
  const uuid = uuidv4();
  return uuid.slice(0, 6);
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      campaignName,
      moq,
      targetAudience,
      startDate,
      endDate,
      geographicTargeting,
      qrCodeTags,
      placementChannel,
      client,
      campaignBudget,
      campaignObjectives,
      reportingFrequency,
      redirectLink,
      quizQuestions, // Added to capture quiz questions
      advertisingVideo,
      adCreative,
    } = req.body;

    // Validate input data
    // Example validation logic
    if (
      !campaignName ||
      !moq ||
      !targetAudience ||
      !startDate ||
      !endDate ||
      !geographicTargeting ||
      !qrCodeTags ||
      !placementChannel ||
      !client ||
      !campaignBudget ||
      !campaignObjectives ||
      !reportingFrequency ||
      !redirectLink ||
      !quizQuestions || // Ensure quiz questions are included
      !advertisingVideo ||
      !adCreative

    ) {
      return res.status(400).json({
        message: "Please provide all the required fields.",
      });
    }

    try {
      const cid = `CMP${Date.now()}`;
      const campaignId = generateUuid();

      // Handle file uploads
      let adCreativeUrl = null;
      let advertisingVideoUrl = null;

  

      // Create the campaign document in Firestore
      await setDoc(doc(db, "campaigns", cid), {
        campaignName,
        moq,
        targetAudience,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        geographicTargeting,
        qrCodeTags,
        placementChannel,
        client,
        campaignBudget,
        campaignObjectives,
        reportingFrequency,
        advertisingVideo,
        adCreative,
        redirectLink,
        quizQuestions, // Add quiz questions to the document
        campaignId,
        cid,
        createdAt: new Date(),
      });

      res.status(200).json({
        message: "Campaign created successfully.",
        campaignId,
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
