"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { User, useStore } from "../state/useStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";

const col = createColumnHelper<User>();

const buildUserColumns = (currentUserId: string): ColumnDef<User>[] => [
  col.accessor("userName", {
    header: "Username",
    cell: (info) => info.getValue() || "(unnamed)",
  }),
  col.accessor("userEmail", { header: "Email" }),
  col.accessor("status", {
    header: "Status",
    cell: (info) =>
      info.getValue() ? (
        <span className="bBadge bBadge-active">{info.getValue()}</span>
      ) : (
        "—"
      ),
  }),
  col.accessor("author", {
    header: "Author",
    cell: (info) => (
      <span className={`bBadge ${info.getValue() ? "bBadge-true" : "bBadge-false"}`}>
        {info.getValue() ? "true" : "false"}
      </span>
    ),
  }),
  col.accessor("sensi", {
    header: "Sensi",
    cell: (info) => (
      <span className={`bBadge ${info.getValue() ? "bBadge-true" : "bBadge-false"}`}>
        {info.getValue() ? "true" : "false"}
      </span>
    ),
  }),
  col.display({
    id: "actions",
    header: "",
    cell: (info) =>
      info.row.original._id === currentUserId ? (
        <Link
          href="/user"
          className="bButton"
          onClick={(e) => e.stopPropagation()}
        >
          Edit My Account
        </Link>
      ) : null,
  }),
];

export function UsersForm() {
  const { user } = useStore((s) => s);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");

  const { data: queryUsers, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const res = await axios.get("/api/users");
      return res.data.data;
    },
    enabled: user.sensi,
  });

  const columns = useMemo(() => buildUserColumns(user._id), [user._id]);

  const table = useReactTable({
    data: queryUsers ?? [],
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (!user.sensi) return null;

  const adminCount = (queryUsers ?? []).filter((u) => u.sensi).length;

  return (
    <>
      <div className="articlesListLabel">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search users…"
          className="adminArticleSearch"
        />
        <div className="articlesListRight">
          <span className="articlesListCount">
            {table.getFilteredRowModel().rows.length} Users · {adminCount} Admin
          </span>
        </div>
      </div>
      <div className="articlesContainer">
        <div className="articlesContainer">
          {isLoading ? (
            <p>Loading…</p>
          ) : (
            <>
              <table className="adminArticlesTable">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((h) => (
                        <th
                          key={h.id}
                          onClick={h.column.getToggleSortingHandler()}
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {{ asc: " ▲", desc: " ▼" }[
                            h.column.getIsSorted() as string
                          ] ?? ""}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <button
                  className="adminActionButton"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  ‹ Prev
                </button>
                <button
                  className="adminActionButton"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next ›
                </button>
                <span>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
