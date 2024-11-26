"use client"
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)", // white background with 70% opacity
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <p style={{ margin: 0 }}>{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SprukoLineChart = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={data}>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SprukoLineChart;
