import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name, imageUrl } = req.body;

    // Validate input data
    if (!email || !password || !name || !imageUrl) {
      return res.status(400).json({
        message: "Please provide all necessary fields: email, password, name, image.",
      });
    }

    try {
      // Create admin in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store admin information in Firestore
      const adid = `AD${Date.now()}`;
      await setDoc(doc(db, "admins", adid), {
        email,
        name,
        role: "admin",
        createdAt: new Date(),
        adminId: adid,
        imageUrl,
        uid: user.uid,
      });

      res.status(200).json({ message: "Admin created successfully." });
    } catch (error) {
      if (error.message == "Firebase: Error (auth/email-already-in-use).") {
        res.status(400).json({ message: "Email already in use." });
      }
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
