"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Resource } from "../state/useStore";
import { TrashIcon } from "./icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const col = createColumnHelper<Resource>();

const buildResourceColumns = (
  onDelete: (r: Resource) => void,
): ColumnDef<Resource>[] => [
  col.accessor("title", { header: "Title" }),
  col.accessor("type", { header: "Type" }),
  col.accessor("author", {
    header: "Author",
    cell: (info) => info.getValue() || "—",
  }),
  col.accessor("readyToPublish", {
    header: "Status",
    cell: (info) => (info.getValue() ? "Published" : "Draft"),
  }),
  col.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="killButton"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(info.row.original);
          }}
        >
          <TrashIcon />
        </button>
      </div>
    ),
  }),
];

export function AdminResources() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const { data: queryResources, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async (): Promise<Resource[]> => {
      const res = await axios.get("/api/resources");
      return res.data.data;
    },
  });

  const editResource = useCallback(
    (resource: Resource) => {
      router.push(`/resource/edit/${resource._id}`);
    },
    [router],
  );

  const newResource = useCallback(() => {
    router.push(`/resource/new`);
  }, [router]);

  const handleDelete = useCallback(
    (resource: Resource) => {
      const ok = window.confirm(
        `Delete "${resource.title}"? This cannot be undone.`,
      );
      if (!ok) return;
      deleteResource.mutate(resource._id);
    },
    [deleteResource],
  );

  const columns = useMemo(
    () => buildResourceColumns(handleDelete),
    [handleDelete],
  );

  const table = useReactTable({
    data: queryResources ?? [],
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

  return (
    <>
      <div className="articlesListLabel">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search resources…"
          className="adminArticleSearch"
        />
        <div className="articlesListRight">
          <span className="articlesListCount">
            {table.getFilteredRowModel().rows.length} Resources
          </span>
          <div onClick={newResource} className="adminActionButton">
            New Resource
          </div>
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
                    <tr
                      key={row.id}
                      onClick={() => editResource(row.original)}
                      style={{ cursor: "pointer" }}
                    >
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
