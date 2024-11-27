"use client";
import React, { createContext, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [uid, setUid] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Log in first");
        router.push("/sign-in"); // Adjust the route as per your application
      } else {
        fetchUser(user.uid);
        setUid(user.uid);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const fetchUser = async (uid) => {
    try {
      const res = await fetch("/api/getBrands");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      const data = userData.find((user) => user.uid === uid);
      setUser(data);
      fetchCampaigns(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCampaigns = async (brand) => {
    try {
      const res = await fetch("/api/getCampaigns");

      if (!res.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const campaignsData = await res.json();

      const brandCampaigns = campaignsData.filter(
        (campaign) => campaign.client === brand.brandId
      );

      setCampaigns(brandCampaigns.reverse());
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  if (!user) return null;

  return (
    <MyContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isHovered,
        setIsHovered,
        user,
        setUser,
        campaigns,
        setCampaigns,
        fetchCampaigns,
        fetchUser,
        uid,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
