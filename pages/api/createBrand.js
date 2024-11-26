// pages/api/vendor/signup.js
import { auth, db, storage } from "@/firebase"; // Ensure you import storage
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      email,
      password,
      brandName,
      name,
      logo, 
      businessName,
      subscription,
    } = req.body;
    console.log(email, password, name, brandName, businessName, logo);

    // Validate input data
    if (!email || !password || !name || !brandName || !businessName || !logo) {
      return res.status(400).json({
        message:
          "Please provide all necessary fields: email, password, name, brandName, businessName, logo.",
      });
    }
  
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const brandId = `BR${Date.now()}`;

      await setDoc(doc(db, "brands", brandId), {
        email,
        name,
        role: "brand",
        createdAt: new Date(),
        brandId,
        brandName,
        imageUrl: logo, // Use the URL of the uploaded logo
        uid: user.uid,
        businessName,
        subscription,
      });

      res.status(200).json({
        message: "Brand registered successfully.",
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
