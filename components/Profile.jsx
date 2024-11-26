"use client";
import { MyContext } from '@/context/MyContext'
import React, { useContext, useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
    const {user} = useContext(MyContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const inputClassName =
    "mt-1 block w-full rounded-3xl py-1 px-4 bg-oohpoint-grey-200 font-light w-[20rem]";
  const buttonClassName =
    "bg-oohpoint-primary-2 text-white font-semibold px-5 py-2 rounded-lg mt-2 hover:scale-90 transition-all";

  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col justify-start items-start  mt-2">
            <div className=" flex justify-between items-center w-full lg:px-8 py-4 gap-1 px-5">
     <div className="flex flex-col items-start justify-center ">
        <h1 className="text-oohpoint-grey-500 font-bold text-4xl">
          Welcome {user?.name}!
        </h1>
        <p className="text-oohpoint-tertiary-2 font-medium">
          Your business profile
        </p>
      </div>
      <button onClick={openModal} className="bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white py-2 px-6 rounded-xl hover:scale-95 transition-all">
          Change Password
        </button>
     </div>

        <div className="bg-white h-full p-6 px-10 rounded-2xl w-full flex gap-4 justify-around items-center">
        <div className="mb-4 flex flex-col items-center">
          {/* Profile Image */}
          <div className="size-48 mb-4 relative">
            {user?.imageUrl ? (
              <img
                className="w-full h-full object-cover rounded-full shadow-lg"
                src={user?.imageUrl}
                alt="Profile"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full" />
            )}
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Name of POC */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Name of POC:</label>
          <input
            type="name"
            value={user?.name}
            className={inputClassName}
            disabled
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Email:</label>
          <input
            type="email"
            value={user?.email}
            disabled
            className={inputClassName}
       
          />
        </div>

        {/* Subscription */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Subscription</label>
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
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Business Name:</label>
          <input
            type="text"
            value={user?.businessName}
            className={inputClassName}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Brand Name:</label>
          <input
            type="text"
            value={user?.brandName}
            className={inputClassName}
            disabled
          />
        </div>
        {/* Brand ID */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Brand ID:</label>
          <input
            type="text"
            value={user?.brandId}
            className={inputClassName}
            disabled
          />
        </div>

        {/* Change Password */}
        {/* <div className="mb-4 col-span-2">
          <label className="block text-oohpoint-primary-2 text-lg">Change Password</label>
          <div className="flex items-center gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Current Password"
              className={inputClassName}
            />
            <button className={buttonClassName}>Change</button>
          </div>
        </div> */}
      </div>

      {/* Action Buttons */}
      {/* <div className="flex justify-between mt-4">
        <button
          className={`${buttonClassName} bg-red-500`}
          onClick={() => {
            setName("");
            setEmail("");
            setSubscription("");
            setBusinessName("");
            setBrandID("");
            setLogo(null);
            setPassword("");
          }}
        >
          Cancel Changes
        </button>
        <button
          onClick={handleSaveChanges}
          className={buttonClassName}
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div> */}
    </div>
    {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
    </div>
  )
}

export default Profile
