"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Article, useStore } from "../state/useStore";
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

const col = createColumnHelper<Article>();

const buildArticleColumns = (
  onDelete: (a: Article) => void,
): ColumnDef<Article>[] => [
  col.accessor("title", { header: "Title" }),
  col.accessor("category", { header: "Category" }),
  col.accessor("readyToPublish", {
    header: "Status",
    cell: (info) => (info.getValue() ? "Published" : "Draft"),
  }),
  col.accessor("lastModifiedDate", {
    header: "Last Modified",
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

export function AdminArticles() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useStore((s) => s);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      // match your existing kill() auth shape: { id, key }
      await axios.delete(`/api/articles/${id}`, {
        data: { id: user._id, key: user.phash },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const { data: queryArticles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async (): Promise<Article[]> => {
      const res = await axios.get("/api/articles");
      return res.data.data; // ← twice: Axios .data, then your API's .data
    },
  });

  const editArticle = useCallback(
    (article: Article) => {
      router.push(`/article/edit/${article._id}`);
    },
    [router],
  );

  const newArticle = useCallback(() => {
    router.push(`/article/new`);
  }, [router]);

  const handleDelete = useCallback(
    (article: Article) => {
      const ok = window.confirm(
        `Delete "${article.title}"? This cannot be undone.`,
      );
      if (!ok) return;
      deleteArticle.mutate(article._id);
    },
    [deleteArticle],
  );

  const columns = useMemo(() => buildArticleColumns(handleDelete), [handleDelete]);

  const table = useReactTable({
    data: queryArticles ?? [],
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
          placeholder="Search articles…"
          className="adminArticleSearch"
        />
        <div className="articlesListRight">
          <span className="articlesListCount">
            {table.getFilteredRowModel().rows.length} Articles
          </span>
          <div onClick={newArticle} className="adminActionButton">
            New Article
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
                      onClick={() => editArticle(row.original)}
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
