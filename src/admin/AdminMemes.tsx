"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Meme } from "../state/useStore";
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

const col = createColumnHelper<Meme>();

const buildMemeColumns = (
  onDelete: (m: Meme) => void,
): ColumnDef<Meme>[] => [
  col.accessor("title", {
    header: "Title",
    cell: (info) => info.getValue() || "(untitled)",
  }),
  col.accessor("category", {
    header: "Category",
    cell: (info) => info.getValue() || "—",
  }),
  col.accessor("readyToPublish", {
    header: "Status",
    cell: (info) => (info.getValue() ? "Published" : "Draft"),
  }),
  col.accessor("originDate", {
    header: "Origin Date",
    cell: (info) => {
      const raw = info.getValue() as string;
      const d = raw ? new Date(raw) : null;
      return d && !isNaN(d.getTime()) ? d.toLocaleDateString() : "—";
    },
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

export function AdminMemes() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");

  const deleteMeme = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/memes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
    },
  });

  const { data: queryMemes, isLoading } = useQuery({
    queryKey: ["memes"],
    queryFn: async (): Promise<Meme[]> => {
      const res = await axios.get("/api/memes");
      return res.data.data;
    },
  });

  const editMeme = useCallback(
    (meme: Meme) => {
      router.push(`/meme/edit/${meme._id}`);
    },
    [router],
  );

  const newMeme = useCallback(() => {
    router.push(`/meme/new`);
  }, [router]);

  const handleDelete = useCallback(
    (meme: Meme) => {
      const ok = window.confirm(`Are you sure you want to delete this meme,
            titled: ${meme.title} ?
            \nIt will be completely deleted from the database and cannot be restored.`);
      if (!ok) return;
      deleteMeme.mutate(meme._id);
    },
    [deleteMeme],
  );

  const columns = useMemo(() => buildMemeColumns(handleDelete), [handleDelete]);

  const table = useReactTable({
    data: queryMemes ?? [],
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
          placeholder="Search memes…"
          className="adminArticleSearch"
        />
        <div className="articlesListRight">
          <span className="articlesListCount">
            {table.getFilteredRowModel().rows.length} Memes
          </span>
          <div onClick={newMeme} className="adminActionButton">
            New Meme
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
                      onClick={() => editMeme(row.original)}
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
