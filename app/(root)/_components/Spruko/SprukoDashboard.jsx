"use client";
import React, { useContext, useEffect, useState } from "react";
import SprukoCard from "./SprukoCard";
import { MdCampaign } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { MyContext } from "@/context/MyContext";
import SprukoPieChart from "./SprukoPieChart";
import SprukoMixChart from "./SprukoMixChart";
import dynamic from "next/dynamic";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import QRCodeGenerator from "@/components/QRCode";
import Image from "next/image";
import moment from "moment";
import Details from "@/app/(root)/campaigns/_components/Details";

const MapLocation = dynamic(() => import("../MapLocation"), {
  ssr: false, // This will disable server-side rendering for the map
});

const SprukoDashboard = () => {
  const { campaigns, vendors, user } = useContext(MyContext);
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
    active: 0,
  });
  const [budgetData, setBudgetData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [redemptions, setRedemtions] = useState(0);

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

    let activeCampaigns = 0;

    campaigns.forEach((campaign) => {
      const createdAt = convertTimestampToDate(campaign.createdAt);
      const weekday = getWeekdayName(createdAt);

      if (Date.now() < convertTimestampToDate(campaign.endDate)) {
        activeCampaigns++;
      }

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
      active: activeCampaigns,
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

  useEffect(() => {
    let redeemed = 0;
    vendors.forEach((vendor) => {
      vendor?.coupons?.forEach((coupon) => coupon.isRedeemed && redeemed++);
    });
    setRedemtions(redeemed);
  }, [vendors]);

  const getStatus = (startDate, endDate) => {
    const currentDate = new Date().setHours(0, 0, 0, 0); // Current date without time
    const start = new Date(startDate.seconds * 1000).setHours(0, 0, 0, 0); // Start date
    const end = new Date(endDate.seconds * 1000).setHours(0, 0, 0, 0); // End date

    if (currentDate < start) {
      return (
        <div className="text-sm py-1 px-2 bg-yellow-300 text-yellow-700 rounded-md w-fit font-semibold">
          Upcoming
        </div>
      ); // Before start date
    } else if (currentDate > end) {
      return (
        <div className="text-sm py-1 px-2 bg-neutral-300 text-neutral-700 rounded-md w-fit font-semibold">
          Closed
        </div>
      ); // After end date
    } else {
      return (
        <div className="text-sm py-1 px-2 bg-green-300 text-green-700 rounded-md w-fit font-semibold">
          Active
        </div>
      ); // Between start and end dates
    }
  };

  // const transformCampaignsData = (campaigns) => {
  //   return campaigns.map((campaign) => ({
  //     campaign: {
  //       name: campaign.campaignName || "N/A",
  //       img: campaign.adCreative || "",
  //     },
  //     id: campaign.campaignId || "N/A", // Campaign ID
  //     impressions: campaign.ipAddress?.length || 0, // Assuming impressions are based on ipAddress
  //     startDate:
  //       new Date(campaign.startDate.seconds * 1000).toLocaleDateString() ||
  //       "N/A", // Start Date
  //     endDate:
  //       new Date(campaign.endDate.seconds * 1000).toLocaleDateString() || "N/A", // End Date
  //     status: getStatus(campaign.startDate, campaign.endDate), // Status
  //     // budgetAllocated: `Rs. ${campaign.campaignBudget || 0}`, // Budget Allocated
  //     qr: `https://user-ooh-point.vercel.app/campaign/${campaign.campaignId}-${user.vendorId}`, // QR Code
  //   }));
  // };

  const columns = [
    { accessorKey: "id", header: <div className="text-left">campaign id</div> },
    {
      accessorKey: "campaignName",
      header: <div className="text-left">campaign name</div>,

      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.original?.adCreative || ""}
            width={32}
            height={32}
            alt="img"
          />
          {row.getValue("campaignName") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: <div className="text-center">impressions</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("ipAddress")?.length || 0}
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: <div className="text-center">start Date</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {moment.unix(row.getValue("startDate")?.seconds).format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: <div className="text-center">end Date</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {moment.unix(row.getValue("endDate")?.seconds).format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: <div className="text-center">status</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {getStatus(row.getValue("startDate"), row.getValue("endDate"))}
        </div>
      ),
    },
    {
      header: "qr code",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <QRCodeGenerator
            value={`https://user-ooh-point.vercel.app/campaign/${row.original.campaignId}-${user.vendorId}`}
          />
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => <Details data={row.original} />,
    },
  ];

  const table = useReactTable({
    data: campaigns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 w-full">
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
        title="Active Campaigns"
        value={campaignsData.active}
        increase={`+${campaignsData.increase}`}
        color="text-green-500"
        iconColor="text-blue-500"
        Icon={AiOutlineStock}
        bgColor="bg-blue-100"
        lineData={campaignsData.lineData}
        lineColor="blue"
      />
      <SprukoCard
        title="Total Budget"
        value={`Rs.${budgetData.total}`}
        increase={`+${budgetData.increase}`}
        color="text-green-500"
        iconColor="text-green-500"
        Icon={AiOutlineStock}
        bgColor="bg-green-100"
        lineData={budgetData.lineData}
        lineColor="green"
      />
      <SprukoPieChart
        totalScans={totalScansData.total}
        uniqueScans={uniqueScansData.total}
      />
      <div className="md:col-span-2 md:row-span-2 bg-white rounded-lg">
        <h2 className="p-4 border-b text-oohpoint-primary-2 text-xl">
          Campaign Status Overview
        </h2>
        <SprukoMixChart campaign={campaigns} />
      </div>
      <SprukoCard
        title="Total Redemptions"
        value={redemptions}
        // increase={`+0`}
        color="text-green-500"
        iconColor="text-yellow-500"
        Icon={AiOutlineStock}
        bgColor="bg-yellow-100"
        // lineData={campaignsData.lineData}
        lineColor="blue"
      />
      <div className="bg-white rounded-lg md:col-span-2 overflow-hidden min-h-56 h-full">
        <h2 className="p-4 border-b text-oohpoint-primary-2 text-xl">
          Top Locations
        </h2>
        <MapLocation locations={locations} />
      </div>
      {campaigns.length == 0 ? (
        <div className="col-span-full  rounded-lg h-48 bg-white flex flex-col justify-center items-center">
          No Data Available
        </div>
      ) : (
        <div className="col-span-full bg-white rounded-lg shadow-sm w-full h-full">
          <h2 className="p-4 border-b text-oohpoint-primary-2 text-xl">
            Recent Campaigns
          </h2>
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                      <th
                        key={header.id}
                        className={`uppercase p-4 border-b font-medium text-neutral-700 ${
                          i != columns.length - 2 ? "text-left" : "text-right"
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        key={cell.id}
                        className={`p-4 ${
                          i != columns.length - 2 ? "text-left" : "text-right"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprukoDashboard;
