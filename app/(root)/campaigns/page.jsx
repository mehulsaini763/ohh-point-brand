"use client";

import { useContext, useState } from "react";
import { MyContext } from "@/context/MyContext";
import Details from "./_components/Details";
import DynamicTable from "@/components/NewTable";

const Campaigns = () => {
  const { campaigns } = useContext(MyContext);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Function to get status of campaigns (Active, Upcoming, Closed)
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

  // Function to generate table data for campaigns
  const transformCampaignsData = (campaigns) => {
    return campaigns.map((campaign) => ({
      id: campaign.campaignId || "N/A", // Campaign ID
      campaign: {
        name: campaign.campaignName || "N/A",
        img: campaign.adCreative || "",
      },
      impressions: campaign.ipAddress?.length || 0, // Assuming impressions are based on ipAddress
      startDate:
        new Date(campaign.startDate.seconds * 1000).toLocaleDateString() ||
        "N/A", // Start Date
      endDate:
        new Date(campaign.endDate.seconds * 1000).toLocaleDateString() || "N/A", // End Date
      status: getStatus(campaign.startDate, campaign.endDate), // Status
      // budgetAllocated: `Rs. ${campaign.campaignBudget || 0}`, // Budget Allocated
      button: "Insights", // Button to view more details
    }));
  };

  const handleShow = (campaignId) => {
    const campaign = campaigns.find((c) => c.campaignId === campaignId);
    setSelectedCampaign(campaign);
  };

  return (
    <div className="bg-oohpoint-grey-200 flex flex-col p-6 gap-6">
      <div>
        <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">
          Campaigns
        </h1>
        <p className=" text-oohpoint-tertiary-2">
          All you need to know about campaigns!
        </p>
      </div>
      {selectedCampaign && (
        <Details
          selectedCampaign={selectedCampaign}
          setSelectedCampaign={setSelectedCampaign}
        />
      )}
      <DynamicTable
        headings={[
          "Campaign ID",
          "Campaign Name",
          "Impressions",
          "Start Date",
          "End Date",
          "Status",
          "",
        ]}
        data={transformCampaignsData(campaigns)}
        rowsPerPage={4}
        pagination={true}
        functionn={handleShow}
      />
    </div>
  );
};

export default Campaigns;
