"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { CiBellOn, CiFileOn, CiHome, CiLogout, CiShop } from "react-icons/ci";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoBackspaceOutline } from "react-icons/io5";
import {
  PiHandshakeLight,
  PiHexagonLight,
  PiPersonSimpleCircle,
  PiQrCode,
  PiQuestionLight,
} from "react-icons/pi";
import { MyContext } from "@/context/MyContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import toast from "react-hot-toast";
import { TbBrandBlogger } from "react-icons/tb";

const Sidebar = () => {
  const router = useRouter();
  const { isOpen, setIsOpen, isHovered, setIsHovered } = useContext(MyContext);
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsOpen(false)}
      className={`h-screen transition-all duration-200 w-[15rem] text-oohpoint-grey-300 bg-oohpoint-primary-1 rounded-r-[2rem] md:relative justify-center items-start p-4 md:flex ${
        isOpen
          ? "flex fixed z-50 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
          : "hidden"
      } ${isHovered ? "w-[15rem]" : "w-[4rem]"}`}
    >
      <IoBackspaceOutline
        onClick={() => setIsOpen(false)}
        className=" text-3xl absolute top-4 left-4 md:hidden block"
      />
      <div
        className="absolute inset-0 bg-design-bg bg-contain bg-center bg-repeat"
        style={{
          filter: "opacity(0.2)",
        }}
      ></div>
      <div className=" flex gap-8 justify-center items-center flex-col z-10">
        <Image
          src="/logo.webp"
          alt="logo"
          width={1000}
          height={1000}
          className={` w-auto mt-4 ${isHovered ? "h-16" : "h-8"}`}
        />
        <div className="flex flex-col gap-4 justify-center items-start">
          {[
            { label: "Dashboard", path: "/", icon: CiHome },

            { label: "Campaigns", path: "/campaigns", icon: CiShop },

            {
              label: "Helpdesk",
              path: "/helpdesk",
              icon: PiQuestionLight,
            },

            { label: "Profile", path: "/profile", icon: PiPersonSimpleCircle },
          ].map(({ label, path, icon: Icon }) => (
            <div
              key={path}
              onClick={() => router.push(path)}
              className={`flex gap-4 justify-center items-center cursor-pointer relative ${
                pathname === path ? "text-white" : ""
              }`}
            >
              <Icon className="text-3xl" />
              <p
                className={`transition-all duration-1000 ease-out opacity-0 transform ${
                  isHovered
                    ? "opacity-100 scale-100"
                    : "absolute scale-0 duration-0"
                }`}
              >
                {label}
              </p>
              <div
                className={`absolute w-1 h-12 bg-oohpoint-grey-100 -left-5 ${
                  pathname === path ? "block" : "hidden"
                }`}
              ></div>
            </div>
          ))}

          <div
            onClick={async () => {
              await signOut(auth);
              toast.success("Logged out successfully");
              router.push("/sign-in");
            }}
            className="flex gap-4 justify-center items-center cursor-pointer absolute bottom-[2rem]"
          >
            <CiLogout className="text-3xl" />
            <p
              className={`transition-all duration-300 ease-in-out opacity-0 transform scale-95 ${
                isHovered ? "opacity-100 scale-100" : ""
              }`}
            >
              Log out
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
