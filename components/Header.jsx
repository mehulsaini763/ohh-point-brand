"use client";
import { MyContext } from "@/context/MyContext";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { PiBellLight } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const router = useRouter();
  const { isOpen, setIsOpen, user, setIsHovered } = useContext(MyContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is already logged in, redirect to dashboard
        toast.error("Log in first");
        router.push("/sign-in"); // Adjust the route as per your application
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return (
    <div className=" min-h-[4rem] w-full flex justify-between items-center py-4 md:px-12 px-2 gap-4 bg-white">
      {/* <div className="flex gap-4 items-center justify-center">
        <p className=" font-semibold">Sort:</p>
        <select className="rounded-lg border border-oohpoint-grey-200 py-1 px-2 text-[0.9rem] text-oohpoint-grey-300">
          <option value="week">Last week</option>
          <option value="month">Last month</option>
          <option value="year">Last year</option>
        </select>
      </div> */}
      <RxHamburgerMenu
        onClick={() => {
          setIsOpen((prev) => !prev);
          setIsHovered((prev) => !prev);
        }}
        className=" text-3xl block text-oohpoint-grey-300"
      />
      <div className="flex gap-2 items-center justify-around sm:justify-center sm:gap-8 sm:w-auto w-full">
        {/* <div
          onClick={() => router.push("/notifications")}
          className=" relative cursor-pointer"
        >
          <PiBellLight className=" text-3xl text-oohpoint-grey-300" />
          <div className=" absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-white"></div>
        </div> */}
        <div className=" flex gap-4 justify-center items-center">
          <div className="relative">
            <Image
              src="/profile.png"
              alt="profile"
              width={1000}
              height={1000}
              className=" size-12 rounded-full"
            />
            <div className=" absolute top-0 right-0 size-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className=" flex flex-col justify-center items-start">
            <p className=" font-bold text-lg text-oohpoint-primary-1">
              {user?.name}
            </p>
            <p className=" text-[0.9rem] text-oohpoint-grey-300 font-light">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
