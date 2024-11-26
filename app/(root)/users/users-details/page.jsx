"use client";

import React from "react";
import { ProfileHeader } from "@/components/UserDetails/profile-header";
import { ProfileForm } from "@/components/UserDetails/profile-form";
import { RecentOrders } from "@/components/UserDetails/recent-orders";
import { ViewStatistic } from "@/components/UserDetails/view-statistic";
import Card from "@/components/Card";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCampaign } from "react-icons/md";
import { PiHandshake } from "react-icons/pi";

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <ProfileHeader />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProfileForm />
        </div>
        <div>
          <RecentOrders />
        </div>
      </div>
      <div className="mt-10">
        <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
          <Card
            head="Pending Approvals"
            count="60"
            Icon={IoIosCheckmarkCircleOutline}
          />
          <Card
            head="Number of campaigns"
            count="90"
            Icon={MdOutlineCampaign}
          />
          <Card head="Total vendors" count="750" Icon={PiHandshake} />
        </div>
      </div>
      <div className="mt-8">
        <ViewStatistic />
      </div>
    </div>
  );
}
