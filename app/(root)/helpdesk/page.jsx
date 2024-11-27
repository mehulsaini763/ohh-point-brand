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
  getPaginationRowModel,
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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const columns = [
    {
      id: "id",
      accessorKey: "queryId",
      header: <div className="text-left">query id</div>,
    },
    {
      accessorKey: "category",
      header: <div className="mx-auto">category</div>,
      cell: ({ row }) => (
        <div className="mx-auto text-center">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const color =
          status == "Opened"
            ? "bg-yellow-300 text-yellow-700"
            : status == "Reopened"
            ? "bg-orange-300 text-orange-700"
            : status == "Resolved"
            ? "bg-green-300 text-green-700"
            : "bg-neutral-300 text-neutral-700";
        return (
          <div
            className={`${color} uppercase py-1 px-2 rounded-lg w-fit text-sm font-semibold mx-auto`}
          >
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: <div className="text-right">date</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {moment
            .unix(row.getValue("createdAt")?.seconds || 0)
            .format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "",
      cell: ({ row }) => (
        <ModalDetails data={row.original} refresh={fetchQueries} />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="p-4 md:p-6 w-full flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-3xl font-bold">Helpdesk</h1>
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search by Category"
            className="px-4 py-2 rounded-lg"
            value={table.getColumn("category")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("category")?.setFilterValue(event.target.value)
            }
          />
          <ModalCreateIssue refresh={fetchQueries} />
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
                      className="uppercase p-4 border-b font-medium text-neutral-700"
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
                    <td key={cell.id} className="px-4 py-8">
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
      {data && (
        <div className="flex justify-end items-center gap-2">
          <button
            className="rounded-md py-2 px-4 bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white disabled:bg-neutral-300 disabled:text-neutral-500"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <div className="flex items-center justify-center p-2 px-4 rounded-md text-white aspect-square bg-oohpoint-primary-2">
            <strong>{table.getState().pagination.pageIndex + 1}</strong>
          </div>
          <button
            className="rounded-md py-2 px-4 bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white disabled:bg-neutral-300 disabled:text-neutral-500"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HelpDesk;
