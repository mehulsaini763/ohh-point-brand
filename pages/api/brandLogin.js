// pages/api/vendor/login.js
import { auth, db } from "@/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    try {
      // Set persistence to 'local' so user doesn't need to sign in again after login
      await setPersistence(auth, browserLocalPersistence);

      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Query Firestore to find the vendor by Firebase UID
      const brandsRef = collection(db, "brands");
      const q = query(brandsRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return res.status(404).json({ message: "Brand not found." });
      }

      // Grab the first result since the UID should be unique
      const brandDoc = querySnapshot.docs[0];
      const brandData = brandDoc.data();

      // Respond with vendor data (omit sensitive data)
      res.status(200).json({
        message: "Login successful.",
        brand: brandData,
      });
    } catch (error) {
      if (error.message == "Firebase: Error (auth/invalid-credential).") {
        res.status(404).json({ message: "Invalid email or password." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
