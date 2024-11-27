"use client";
import React, { useContext, useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { MyContext } from "@/context/MyContext";
import ModalCreateIssue from "./_components/RaiseIssue";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import ModalDetails from "./_components/Details";
import moment from "moment";

const HelpDesk = () => {
  const { user } = useContext(MyContext);

  const fetchQueries = async () => {
    try {
      const q = query(
        collection(db, "brandQueries"),
        orderBy("createdAt", "desc"),
        where("brandId", "==", user.brandId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQueries();
    }
  }, [user]);

  const [data, setData] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = [
    {
      id: "id",
      accessorKey: "queryId",
      header: "query id",
    },
    {
      accessorKey: "customerName",
      header: "brand",
    },
    {
      accessorKey: "category",
      header: "category",
    },
    {
      accessorKey: "createdAt",
      header: "date",
      cell: ({ row }) =>
        moment.unix(row.getValue("createdAt")?.seconds || 0).format("DD/MM/YY"),
    },
    {
      accessorKey: "status",
      header: "status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const color = ["Opened", "Reopened"].includes(status)
          ? "bg-yellow-300 text-yellow-700"
          : status == "Resolved"
          ? "bg-green-300 text-green-700"
          : "bg-neutral-300 text-neutral-700";
        return (
          <div
            className={`${color} py-1 px-2 rounded-lg w-fit ml-auto text-xs font-semibold`}
          >
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "",
      cell: ({ row }) => <ModalDetails data={row.original} />,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="p-4 md:p-6 w-full flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-3xl font-bold">Helpdesk</h1>
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-lg"
            value={table.getColumn("id")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
          />
          <ModalCreateIssue />
        </div>
      </div>
      {!data ? (
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
                      className={`p-4 text-sm ${
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

export default HelpDesk;
