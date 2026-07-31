"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Article, Meme, Product, Resource, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { DownloadJsonButton } from "./Download";
import { UsersForm } from "./UsersForm";
import { AdminTabs } from "./AdminTabs";
import { AdminTable } from "./AdminTable";
import { PlacedOrdersTable } from "./PlacedOrdersTable";
import { AnalyticsTable } from "./AnalyticsTable";
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
} from "@tanstack/react-table";
import { type ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

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

interface AdminTab {
  id: string;
  label: string;
}

const TABS: AdminTab[] = [
  { id: "users", label: "users" },
  { id: "articles", label: "articles" },
  { id: "resources", label: "resources" },
  { id: "memes", label: "memes" },
  { id: "merchandise", label: "merchandise" },
  { id: "placed-orders", label: "placed orders" },
  { id: "analytics", label: "analytics" },
  { id: "database", label: "database" },
];

export function AdminPanel() {
  return (
    <div className="adminPanel">
      <div className="titleBar">Admin Panel</div>
      <div className="adminContent">
        <Suspense fallback={null}>
          <AdminPanelContent />
        </Suspense>
      </div>
    </div>
  );
}

function AdminPanelContent() {
  const {
    refresh,
    kill,
    backUpDB,
    wipeAndSeed,
    killProduct,
    displayMerch,
    fetchResources,
    killResource,
    fetchMemes,
    killMeme,
  } = useData();

  const queryClient = useQueryClient();

  const {
    user,
    articles,
    categories,
    products,
    productCategories,
    users,
    settings,
    resources,
    resourceTypes,
    memes,
  } = useStore((s) => s);

  const router = useRouter();
  const searchParams = useSearchParams();

  const visibleTabs = useMemo(
    () =>
      TABS.filter(
        (t) => (t.id !== "users" && t.id !== "database") || user.sensi,
      ),
    [user.sensi],
  );

  const requestedTab = searchParams.get("tab");
  const activeTab = visibleTabs.some((t) => t.id === requestedTab)
    ? (requestedTab as string)
    : (visibleTabs[0]?.id ?? "users");

  const handleTabChange = useCallback(
    (id: string) => {
      router.replace(`/admin?tab=${id}`, { scroll: false });
    },
    [router],
  );

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
    enabled: activeTab === "articles",
  });

  const [articleSorting, setArticleSorting] = useState<SortingState>([]);
  const [articleFilter, setArticleFilter] = useState("");

  useEffect(() => {
    fetchResources();
    fetchMemes();
  }, []);
  const showMerch =
    settings?.find((s) => s.name === "showMerch")?.booleanValue ?? false;
  const showMerchLocal =
    settings?.find((s) => s.name === "showMerchLocal")?.booleanValue ?? false;

  const editArticle = useCallback(
    (article: Article) => {
      router.push(`/article/edit/${article._id}`);
    },
    [router],
  );

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

  const articleColumns = useMemo(
    () => buildArticleColumns(handleDelete),
    [handleDelete],
  );
  const articlesTable = useReactTable({
    data: queryArticles ?? [],
    columns: articleColumns,
    state: { sorting: articleSorting, globalFilter: articleFilter },
    onSortingChange: setArticleSorting,
    onGlobalFilterChange: setArticleFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const editProduct = useCallback(
    (product: Product) => {
      router.push(`/product/edit/${product._id}`);
    },
    [router],
  );

  const toggleMerch = useCallback(() => {
    displayMerch({ id: user._id, key: user.phash }, "showMerch");
  }, [user]);

  const toggleMerchLocal = useCallback(() => {
    displayMerch({ id: user._id, key: user.phash }, "showMerchLocal");
  }, [user]);

  const killArticle = useCallback((article: Article) => {
    const confirmDelete =
      window.confirm(`Are you sure you want to delete this article,
            titled: ${article.title} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
    if (!confirmDelete) return;
    kill(article._id);
    refresh();
  }, []);

  const killAProduct = useCallback((productToKill: Product) => {
    const confirmDelete =
      window.confirm(`Are you sure you want to delete this product,
            named: ${productToKill.productName} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
    if (!confirmDelete) return;
    killProduct(productToKill._id);
    refresh();
  }, []);

  const newArticle = useCallback(() => {
    router.push(`/article/new`);
  }, [router]);
  const newProduct = useCallback(() => {
    router.push(`/product/new`);
  }, [router]);
  const newResource = useCallback(() => {
    router.push(`/resource/new`);
  }, [router]);

  const newMeme = useCallback(() => {
    router.push(`/meme/new`);
  }, [router]);

  const editMeme = useCallback(
    (meme: Meme) => {
      router.push(`/meme/edit/${meme._id}`);
    },
    [router],
  );

  const killAMeme = useCallback((memeToKill: Meme) => {
    const confirmDelete =
      window.confirm(`Are you sure you want to delete this meme,
            titled: ${memeToKill.title} ?
            \nIt will be completely deleted from the database and cannot be restored.`);
    if (!confirmDelete) return;
    killMeme(memeToKill._id);
    refresh();
  }, []);

  const editResource = useCallback(
    (resource: Resource) => {
      router.push(`/resource/edit/${resource._id}`);
    },
    [router],
  );

  const killAResource = useCallback((resourceToKill: Resource) => {
    const confirmDelete =
      window.confirm(`Are you sure you want to delete this resource,
            titled: ${resourceToKill.title} ?
            \nIt will be completely deleted from the database and cannot be restored.`);
    if (!confirmDelete) return;
    killResource(resourceToKill._id);
    refresh();
  }, []);

  const clearOut = useCallback(async () => {
    let wiped;
    try {
      wiped = await wipeAndSeed({ id: user._id, key: user.phash });
    } catch (err) {
    } finally {
      if (wiped?.status === 200) refresh();
    }
  }, []);

  const backUp = useCallback(async () => {
    let result;
    try {
      result = await backUpDB({ id: user._id, key: user.phash });
    } catch (err) {
    } finally {
      if (result?.status === 200) refresh();
    }
  }, []);

  let sectionContent: React.ReactNode = null;
  switch (activeTab) {
    case "users":
      sectionContent = <UsersForm />;
      break;

    case "articles":
      sectionContent = (
        <>
          <div className="articlesListLabel">
            <input
              value={articleFilter}
              onChange={(e) => setArticleFilter(e.target.value)}
              placeholder="Search articles…"
              className="adminArticleSearch"
            />
            <div className="articlesListRight">
              <span className="articlesListCount">
                {articlesTable.getFilteredRowModel().rows.length} Articles
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
                      {articlesTable.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                          {hg.headers.map((h) => (
                            <th
                              key={h.id}
                              onClick={h.column.getToggleSortingHandler()}
                              style={{ cursor: "pointer", userSelect: "none" }}
                            >
                              {flexRender(
                                h.column.columnDef.header,
                                h.getContext(),
                              )}
                              {{ asc: " ▲", desc: " ▼" }[
                                h.column.getIsSorted() as string
                              ] ?? ""}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {articlesTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => editArticle(row.original)}
                          style={{ cursor: "pointer" }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
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
                      onClick={() => articlesTable.previousPage()}
                      disabled={!articlesTable.getCanPreviousPage()}
                    >
                      ‹ Prev
                    </button>
                    <button
                      className="adminActionButton"
                      onClick={() => articlesTable.nextPage()}
                      disabled={!articlesTable.getCanNextPage()}
                    >
                      Next ›
                    </button>
                    <span>
                      Page {articlesTable.getState().pagination.pageIndex + 1}{" "}
                      of {articlesTable.getPageCount()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      );
      break;

    case "resources":
      sectionContent = (
        <>
          <div onClick={newResource} className="newArticleButton">
            + Add a New Resource
          </div>
          <div className="articlesListLabel">
            Resources
            <span className="articlesListCount">{resources?.length ?? 0}</span>
          </div>
          <div className="articlesContainer">
            {resourceTypes?.map((type, typeIndex) => (
              <div
                className="articleCategoryGroup"
                key={`type-${type}-${typeIndex}`}
              >
                <div className="articleCategoryHeader">{type}</div>
                {resources
                  ?.filter((r) => r.type === type)
                  .map((r) => (
                    <div className="aaRow" key={r._id}>
                      <div className="aaItem" onClick={() => editResource(r)}>
                        {r.title}
                      </div>
                      <div
                        className="killButton"
                        onClick={() => killAResource(r)}
                      >
                        <TrashIcon />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </>
      );
      break;

    case "memes":
      sectionContent = (
        <>
          <div onClick={newMeme} className="newArticleButton">
            + Add a Meme
          </div>
          <div className="articlesListLabel">
            Memes
            <span className="articlesListCount">{memes?.length ?? 0}</span>
          </div>
          <div className="articlesContainer">
            {memes?.map((m) => (
              <div className="aaRow" key={m._id}>
                <div className="aaItem" onClick={() => editMeme(m)}>
                  {m.title || "(untitled)"}
                </div>
                <div className="killButton" onClick={() => killAMeme(m)}>
                  <TrashIcon />
                </div>
              </div>
            ))}
          </div>
        </>
      );
      break;

    case "merchandise":
      sectionContent = (
        <>
          <div className="merchToggleRow">
            <div className="merchToggle" onClick={toggleMerchLocal}>
              <div
                className={
                  showMerchLocal ? "bigCheckBoxSelected" : "bigCheckBox"
                }
              >
                {showMerchLocal && <span className="bigCheckmark">✓</span>}
              </div>
              <span className="merchToggleLabel">Show Merch — Local</span>
            </div>
            <div className="merchToggle" onClick={toggleMerch}>
              <div
                className={showMerch ? "bigCheckBoxSelected" : "bigCheckBox"}
              >
                {showMerch && <span className="bigCheckmark">✓</span>}
              </div>
              <span className="merchToggleLabel">Show Merch — Production</span>
            </div>
          </div>
          <div onClick={newProduct} className="newArticleButton">
            + Add a New Product
          </div>

          {products && (
            <>
              <div className="productsListLabel">
                Products
                <span className="productsListCount">{products.length}</span>
              </div>
              <div className="productsContainer">
                {products.map((product) => (
                  <div className="productRow" key={product._id}>
                    <div
                      className="productRowMain"
                      onClick={() => editProduct(product)}
                    >
                      <div className="adminProductName">
                        {product.productName}
                      </div>
                      <div className="productRowDesc">
                        {product.productDescription
                          ?.split(" ")
                          .slice(0, 15)
                          .join(" ")}
                        {product.productDescription?.split(" ").length > 15
                          ? "…"
                          : ""}
                      </div>
                    </div>
                    <div
                      className="killProduct"
                      onClick={() => killAProduct(product)}
                    >
                      <TrashIcon />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      );
      break;

    case "placed-orders":
      sectionContent = <PlacedOrdersTable />;
      break;

    case "analytics":
      sectionContent = <AnalyticsTable />;
      break;

    case "database":
      sectionContent = user.sensi ? (
        <>
          <div className="caution" onClick={() => backUp()}>
            Backup the current DataBase.
          </div>
          <div className="JsonData">
            Download data to your local download folder:<br></br>
            <DownloadJsonButton articles={articles} users={users} />
          </div>
          <div className="dangerous" onClick={() => clearOut()}>
            Wipe out the DataBase, and start over with original seed data.
          </div>
        </>
      ) : null;
      break;
  }

  return (
    <>
      <AdminTabs
        tabs={visibleTabs}
        activeId={activeTab}
        onChange={handleTabChange}
      />
      <AdminTable>{sectionContent}</AdminTable>
    </>
  );
}
