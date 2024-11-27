"use client";
import React, { useContext, useEffect, useState } from "react";
import SprukoCard from "./SprukoCard";
import { MdCampaign, MdOutlineCampaign } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MyContext } from "@/context/MyContext";
import SprukoPieChart from "./SprukoPieChart";
import SprukoMixChart from "./SprukoMixChart";
import SprukoActivityCard from "./SprukoActivityCard";
import SprukoMixAreaChart from "./SprukoMixAreaChart";
import SprukoTable from "./SprukoTable";
import DynamicTable from "../NewTable";
import dynamic from "next/dynamic";

const MapLocation = dynamic(() => import("../MapLocation"), {
  ssr: false, // This will disable server-side rendering for the map
});

const SprukoDashboard = () => {
  const { campaigns, user } = useContext(MyContext);
  const [locations, setLocations] = useState([]);

  function convertTimestampToDate(timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }

  function getWeekdayName(date) {
    const options = { weekday: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const [totalScansData, setTotalScansData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [uniqueScansData, setUniqueScansData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [campaignsData, setCampaignsData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [budgetData, setBudgetData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });

  useEffect(() => {
    let totalScans = 0,
      uniqueScans = 0,
      budget = 0,
      campaignCount = 0;
    let todayScans = 0,
      todayUniqueScans = 0,
      todayBudget = 0,
      todayCampaigns = 0;

    const scansLineData = {},
      uniqueScansLineData = {},
      campaignsLineData = {},
      budgetLineData = {};

    const today = new Date();

    campaigns.forEach((campaign) => {
      const createdAt = convertTimestampToDate(campaign.createdAt);
      const weekday = getWeekdayName(createdAt);

      // Total scans and unique scans calculation
      const scanCount = campaign.ipAddress ? campaign.ipAddress.length : 0;
      const uniqueScanCount = campaign.locationIp
        ? campaign.locationIp.length
        : 0;
      totalScans += scanCount;
      uniqueScans += uniqueScanCount;

      // Budget and Campaign count calculation
      const campaignBudget = parseInt(campaign.campaignBudget);
      budget += campaignBudget;
      campaignCount++;

      // Today's increase calculations
      if (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      ) {
        todayScans += scanCount;
        todayUniqueScans += uniqueScanCount;
        todayBudget += campaignBudget;
        todayCampaigns++;
      }

      // Collect line data per weekday for each metric
      scansLineData[weekday] = (scansLineData[weekday] || 0) + scanCount;
      uniqueScansLineData[weekday] =
        (uniqueScansLineData[weekday] || 0) + uniqueScanCount;
      campaignsLineData[weekday] = (campaignsLineData[weekday] || 0) + 1;
      budgetLineData[weekday] = (budgetLineData[weekday] || 0) + campaignBudget;
    });

    // Convert line data to array format for each card
    const formatLineData = (dataObj) =>
      Object.entries(dataObj).map(([name, value]) => ({ name, value }));

    setTotalScansData({
      total: totalScans,
      lineData: formatLineData(scansLineData),
      increase: todayScans,
    });
    setUniqueScansData({
      total: uniqueScans,
      lineData: formatLineData(uniqueScansLineData),
      increase: todayUniqueScans,
    });
    setCampaignsData({
      total: campaignCount,
      lineData: formatLineData(campaignsLineData),
      increase: todayCampaigns,
    });
    setBudgetData({
      total: budget,
      lineData: formatLineData(budgetLineData),
      increase: todayBudget,
    });
    const loc = campaigns.map((campaign) => campaign.location);
    const locationData = loc.flat();
    setLocations(locationData);
  }, [campaigns]);

  const getStatus = (startDate, endDate) => {
    const currentDate = new Date().setHours(0, 0, 0, 0); // Current date without time
    const start = new Date(startDate.seconds * 1000).setHours(0, 0, 0, 0); // Start date
    const end = new Date(endDate.seconds * 1000).setHours(0, 0, 0, 0); // End date

    if (currentDate < start) {
      return "Upcoming"; // Before start date
    } else if (currentDate > end) {
      return "Closed"; // After end date
    } else {
      return "Active"; // Between start and end dates
    }
  };

  const transformCampaignsData = (campaigns) => {
    return campaigns.map((campaign) => ({
      campaign: {
        name: campaign.campaignName || "N/A",
        img: campaign.adCreative || "",
      },
      id: campaign.campaignId || "N/A", // Campaign ID
      impressions: campaign.ipAddress?.length || 0, // Assuming impressions are based on ipAddress
      startDate:
        new Date(campaign.startDate.seconds * 1000).toLocaleDateString() ||
        "N/A", // Start Date
      endDate:
        new Date(campaign.endDate.seconds * 1000).toLocaleDateString() || "N/A", // End Date
      status: getStatus(campaign.startDate, campaign.endDate), // Status
      // budgetAllocated: `Rs. ${campaign.campaignBudget || 0}`, // Budget Allocated
      qr: `https://user-ooh-point.vercel.app/campaign/${campaign.campaignId}-${user.vendorId}`, // QR Code
    }));
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full p-6">
      <div className="grid grid-cols-11 w-full gap-6">
        <SprukoCard
          title="Total Campaigns"
          value={campaignsData.total}
          increase={`+${campaignsData.increase}`}
          color="text-green-500"
          iconColor="text-purple-500"
          Icon={MdCampaign}
          bgColor="bg-purple-100"
          lineData={campaignsData.lineData}
          lineColor="purple"
        />
        <SprukoCard
          title="Total Scans"
          value={totalScansData.total}
          increase={`+${totalScansData.increase}`}
          color="text-green-500"
          iconColor="text-orange-500"
          Icon={MdOutlineCampaign}
          bgColor="bg-orange-100"
          lineData={totalScansData.lineData}
          lineColor="orange"
        />
        <SprukoCard
          title="Unique Scans"
          value={uniqueScansData.total}
          increase={`+${uniqueScansData.increase}`}
          color="text-green-500"
          iconColor="text-green-500"
          Icon={IoIosCheckmarkCircleOutline}
          bgColor="bg-green-100"
          lineData={uniqueScansData.lineData}
          lineColor="green"
        />
        <SprukoCard
          title="Total Budget"
          value={`Rs.${budgetData.total}`}
          increase={`+${budgetData.increase}`}
          color="text-green-500"
          iconColor="text-blue-500"
          Icon={AiOutlineStock}
          bgColor="bg-blue-100"
          lineData={budgetData.lineData}
          lineColor="blue"
        />
        <SprukoPieChart
          totalScans={totalScansData.total}
          uniqueScans={uniqueScansData.total}
        />
        <SprukoMixChart campaign={campaigns} />
        <MapLocation locations={locations} />
        {/* <SprukoActivityCard />
        <SprukoMixAreaChart /> */}
      </div>
      <div className="w-full space-y-2">
        <p className="text-oohpoint-primary-2 text-2xl">Recent Campaigns</p>
        <DynamicTable
          headings={[
            "Campaign Name",
            "Campaign ID",
            "Impressions",
            "Start Date",
            "End Date",
            "Status",
            // "Budget Allocated",
            "QR Code",
          ]}
          data={transformCampaignsData(campaigns)}
          rowsPerPage={4}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default SprukoDashboard;
