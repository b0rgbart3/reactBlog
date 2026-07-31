"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, useStore } from "../state/useStore";
import { useData } from "../data/useData";
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

const col = createColumnHelper<Product>();

const buildProductColumns = (
  onDelete: (p: Product) => void,
): ColumnDef<Product>[] => [
  col.accessor("productName", { header: "Name" }),
  col.accessor("category", {
    header: "Category",
    cell: (info) => info.getValue() || "—",
  }),
  col.accessor("price", {
    header: "Price",
    cell: (info) => `$${Number(info.getValue() ?? 0).toFixed(2)}`,
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

export function AdminMerchandise() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { displayMerch } = useData();
  const { user, settings } = useStore((s) => s);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");

  const showMerch =
    settings?.find((s) => s.name === "showMerch")?.booleanValue ?? false;
  const showMerchLocal =
    settings?.find((s) => s.name === "showMerchLocal")?.booleanValue ?? false;

  const toggleMerch = useCallback(() => {
    displayMerch({ id: user._id, key: user.phash }, "showMerch");
  }, [user]);

  const toggleMerchLocal = useCallback(() => {
    displayMerch({ id: user._id, key: user.phash }, "showMerchLocal");
  }, [user]);

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const { data: queryProducts, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const res = await axios.get("/api/products");
      return res.data.data;
    },
  });

  const newProduct = useCallback(() => {
    router.push(`/product/new`);
  }, [router]);

  const editProduct = useCallback(
    (product: Product) => {
      router.push(`/product/edit/${product._id}`);
    },
    [router],
  );

  const handleDelete = useCallback(
    (product: Product) => {
      const ok = window.confirm(`Are you sure you want to delete this product,
            named: ${product.productName} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
      if (!ok) return;
      deleteProduct.mutate(product._id);
    },
    [deleteProduct],
  );

  const columns = useMemo(
    () => buildProductColumns(handleDelete),
    [handleDelete],
  );

  const table = useReactTable({
    data: queryProducts ?? [],
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
      <div className="merchToggleRow">
        <div className="merchToggle" onClick={toggleMerchLocal}>
          <div
            className={showMerchLocal ? "bigCheckBoxSelected" : "bigCheckBox"}
          >
            {showMerchLocal && <span className="bigCheckmark">✓</span>}
          </div>
          <span className="merchToggleLabel">Show Merch — Local</span>
        </div>
        <div className="merchToggle" onClick={toggleMerch}>
          <div className={showMerch ? "bigCheckBoxSelected" : "bigCheckBox"}>
            {showMerch && <span className="bigCheckmark">✓</span>}
          </div>
          <span className="merchToggleLabel">Show Merch — Production</span>
        </div>
      </div>

      <div className="articlesListLabel">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search products…"
          className="adminArticleSearch"
        />
        <div className="articlesListRight">
          <span className="articlesListCount">
            {table.getFilteredRowModel().rows.length} Products
          </span>
          <div onClick={newProduct} className="adminActionButton">
            New Product
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
                      onClick={() => editProduct(row.original)}
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
