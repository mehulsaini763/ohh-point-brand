"use client";
import { MyContext } from "@/context/MyContext";
import React, { useContext, useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

const Profile = () => {
  const { user } = useContext(MyContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const inputClassName =
    "mt-1 block w-full rounded-md py-2 px-4 bg-oohpoint-grey-200 font-light w-[20rem]";
  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col gap-4 md:gap-6 p-4 md:p-6">
      <div className=" flex justify-between items-center w-full">
        <div className="flex flex-col items-start justify-center ">
          <h1 className="text-oohpoint-grey-500 font-bold text-4xl">
            Welcome {user?.name}!
          </h1>
          <p className="text-oohpoint-tertiary-2 font-medium">
            Your business profile
          </p>
        </div>
        <button
          onClick={openModal}
          className="bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white py-2 px-6 rounded-lg hover:scale-95 transition-all"
        >
          Change Password
        </button>
      </div>
      <div className="bg-white h-full p-6 rounded-lg w-full flex flex-col gap-6">
        {/* Profile Image */}
        <div className="size-36 mb-4 relative">
          {user?.imageUrl ? (
            <img
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src={user?.imageUrl}
              alt="Profile"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg" />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name of POC */}
          <div>
            <label className="block text-oohpoint-primary-2 text-lg">
              Name of POC:
            </label>
            <input
              type="name"
              value={user?.name}
              className={inputClassName}
              disabled
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-oohpoint-primary-2 text-lg">
              Email:
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className={inputClassName}
            />
          </div>

          {/* Subscription */}
          <div>
            <label className="block text-oohpoint-primary-2 text-lg">
              Subscription
            </label>
            <select
              value={user?.subscription}
              className={inputClassName}
              disabled
            >
              <option value="" disabled>
                Select a Subscription
              </option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-oohpoint-primary-2 text-lg">
              Business Name:
            </label>
            <input
              type="text"
              value={user?.businessName}
              className={inputClassName}
              disabled
            />
          </div>
          <div>
            <label className="block text-oohpoint-primary-2 text-lg">
              Brand Name:
            </label>
            <input
              type="text"
              value={user?.brandName}
              className={inputClassName}
              disabled
            />
          </div>
          {/* Brand ID */}
          <div>
            <label className="block text-oohpoint-primary-2 text-lg">
              Brand ID:
            </label>
            <input
              type="text"
              value={user?.brandId}
              className={inputClassName}
              disabled
            />
          </div>
        </div>
      </div>
      {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
    </div>
  );
};

export default Profile;
