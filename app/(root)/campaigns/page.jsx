"use client";

import { useContext } from "react";
import { MyContext } from "@/context/MyContext";
import Details from "./_components/Details";
import Image from "next/image";
import moment from "moment";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

const Campaigns = () => {
  const { campaigns } = useContext(MyContext);

  // Function to get status of campaigns (Active, Upcoming, Closed)
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

  const columns = [
    { accessorKey: "id", header: "campaign id" },
    {
      accessorKey: "campaignName",
      header: "campaign name",
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
      header: "impressions",
      cell: ({ row }) => row.getValue("ipAddress")?.length || 0,
    },
    {
      accessorKey: "startDate",
      header: "start Date",
      cell: ({ row }) =>
        moment
          .unix(row.getValue("startDate")?.seconds)
          .format("DD/MM/YY hh:mm A"),
    },
    {
      accessorKey: "endDate",
      header: "end Date",
      cell: ({ row }) =>
        moment
          .unix(row.getValue("endDate")?.seconds)
          .format("DD/MM/YY hh:mm A"),
    },
    {
      accessorKey: "status",
      header: "status",
      cell: ({ row }) => (
        <div className="flex justify-end">
          {getStatus(row.getValue("startDate"), row.getValue("endDate"))}
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
    <div className="bg-oohpoint-grey-200 flex flex-col p-6 gap-6 w-full">
      <div className="space-y-2">
        <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">
          Campaigns
        </h1>
        <p className=" text-oohpoint-tertiary-2">
          All you need to know about campaigns!
        </p>
      </div>
      {campaigns.length == 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md h-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="bg-white rounded-lg shadow-sm w-full ">
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
            <tbody>
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
      )}
    </div>
  );
};

export default Campaigns;
