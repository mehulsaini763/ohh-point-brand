import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  const generateUuid = () => {
    const uuid = uuidv4();
    return uuid.slice(0, 6);
  };

  if (req.method === "POST") {
    const {
      email,
      password,
      businessName,
      ownerName,
      businessCategory,
      phoneNumber,
      whatsapp,
      address,
      googleMapLink,
      openingHours,
      closingHours,
      operatingDays,
      kycId,
      gstNumber,
      registrationNumber,
      accountNumber,
      ifsc,
      upiId,
      keyProducts,
      termsAgreement,
    } = req.body;

    // Validate input data
    if (
      !email ||
      !password ||
      !businessName ||
      !ownerName ||
      !businessCategory ||
      !phoneNumber ||
      !address ||
      !openingHours ||
      !closingHours ||
      !kycId ||
      !gstNumber ||
      !accountNumber ||
      !ifsc ||
      !keyProducts ||
      !termsAgreement
    ) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    try {
      // Create vendor in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Generate a custom vendor ID
      const vid = `VE${Date.now()}`;
      const vendorId = generateUuid();

      // Store vendor information in Firestore
      await setDoc(doc(db, "vendors", vid), {
        email,
        businessName,
        ownerName,
        businessCategory,
        phoneNumber,
        whatsapp: whatsapp || "", // optional field
        address,
        googleMapLink: googleMapLink || "", // optional field
        openingHours,
        closingHours,
        operatingDays,
        kycId,
        gstNumber,
        registrationNumber: registrationNumber || "", // optional field
        accountNumber,
        ifsc,
        upiId: upiId || "", // optional field
        keyProducts,
        termsAgreement,
        role: "vendor",
        createdAt: new Date(),
        vendorId,
        uid: user.uid,
        vid,
        status: "unverified", // Vendor will be unverified until admin verifies them
      });

      res.status(200).json({
        message: "Vendor registered successfully. Pending admin verification.",
      });
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        res.status(400).json({ message: "Email already in use." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
