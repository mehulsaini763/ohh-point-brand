"use client";
import { MyContext } from "@/context/MyContext";
import React, { useContext, useEffect, useState } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";

const SprukoMixChart = () => {
  const { campaigns } = useContext(MyContext);
  const [data, setData] = useState([]);

  // Custom legend data
  const legendItems = [
    { name: "Closed", color: "#c1c1c1" },
    { name: "Active", color: "#8884d8" },
    { name: "Upcoming", color: "#ff7300" },
  ];

  // Function to get the status of the campaign
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

  // Categorize campaigns based on date
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      console.log("No campaigns data available");
      return;
    }
    console.log("Found Campaigns");

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }), // Get month names (Jan, Feb, ...)
      closed: 0,
      active: 0,
      upcoming: 0,
    }));

    campaigns.forEach(campaign => {
      const status = getStatus(campaign.startDate, campaign.endDate);
      const createdAtMonth = new Date(campaign.createdAt.seconds * 1000).getMonth();
      
      if (status === "Closed") {
        monthlyData[createdAtMonth].closed += 1;
      } else if (status === "Active") {
        monthlyData[createdAtMonth].active += 1;
      } else if (status === "Upcoming") {
        monthlyData[createdAtMonth].upcoming += 1; // Count upcoming in the created month
      }
    });

    console.log("Monthly Data:", monthlyData);
    setData(monthlyData);
  }, [campaigns]);

  // Function to render custom legend
  const renderLegend = () => (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}
      className="gap-4"
    >
      {legendItems.map((item) => (
        <div key={item.name} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              backgroundColor: item.color,
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              marginRight: "5px",
            }}
          />
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white text-xs shadow rounded-lg col-span-2 row-span-2 min-w-[15rem]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg">Campaign Status Overview</h2>
      </div>
      {/* Custom legend */}
      {renderLegend()}
      <ResponsiveContainer width="100%" height={385}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c1c1c1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#c1c1c1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUpcoming" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="closed"
            stroke="#c1c1c1"
            fillOpacity={0.5}
            fill="url(#colorClosed)"
          />
          <Bar
            dataKey="active"
            fill="#8884d8"
            barSize={12}
            radius={[5, 5, 5, 5]}
          />
          <Line
            type="monotone"
            dataKey="upcoming"
            stroke="#ff7300"
            dot={false}
            strokeDasharray={"6 5"}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SprukoMixChart;
