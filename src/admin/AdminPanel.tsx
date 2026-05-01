"use client";
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article, Product, Resource, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { DownloadJsonButton } from "./Download";
import { UsersForm } from "./UsersForm";
import { TableHeader } from "./TableHeader";
import { ExpandableTable } from "./ExpandableTable";
import { PlacedOrdersTable } from "./PlacedOrdersTable";

export function AdminPanel() {
  const { refresh, kill, backUpDB, wipeAndSeed, killProduct, displayMerch, fetchResources, killResource } =
    useData();
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
  } = useStore((s) => s);

  useEffect(() => {
    fetchResources();
  }, []);
  const showMerch =
    settings?.find((s) => s.name === "showMerch")?.booleanValue ?? false;
  const showMerchLocal =
    settings?.find((s) => s.name === "showMerchLocal")?.booleanValue ?? false;
  const router = useRouter();

  const editArticle = useCallback(
    (article: Article) => {
      router.push(`/article/edit/${article._id}`);
    },
    [router],
  );

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

  const editResource = useCallback((resource: Resource) => {
    router.push(`/resource/edit/${resource._id}`);
  }, [router]);

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

  return (
    <div className="adminPanel">
      <div className="titleBar">Admin Panel</div>
      <div className="adminContent">
        <ExpandableTable title="users" open={false}>
          <UsersForm />
        </ExpandableTable>

        <ExpandableTable title="articles" open={false}>
          <div onClick={newArticle} className="newArticleButton">
            + Add a New Article
          </div>
          <div className="articlesListLabel">
            Articles
            <span className="articlesListCount">{articles?.length ?? 0}</span>
          </div>
          <div className="articlesContainer">
            {categories?.map((category, categoryIndex) => (
              <div className="articleCategoryGroup" key={`category-${category}-${categoryIndex}`}>
                <div className="articleCategoryHeader">{category}</div>
                {articles
                  ?.filter((a) => a.category === category)
                  .map((a) => (
                    <div className="aaRow" key={a._id}>
                      <div className="aaItem" onClick={() => editArticle(a)}>
                        {a.title}
                      </div>
                      <div className="killButton" onClick={() => killArticle(a)}>
                        ✕
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </ExpandableTable>

        <ExpandableTable title="resources" open={false}>
          <div onClick={newResource} className="newArticleButton">
            + Add a New Resource
          </div>
          <div className="articlesListLabel">
            Resources
            <span className="articlesListCount">{resources?.length ?? 0}</span>
          </div>
          <div className="articlesContainer">
            {resourceTypes?.map((type, typeIndex) => (
              <div className="articleCategoryGroup" key={`type-${type}-${typeIndex}`}>
                <div className="articleCategoryHeader">{type}</div>
                {resources
                  ?.filter((r) => r.type === type)
                  .map((r) => (
                    <div className="aaRow" key={r._id}>
                      <div className="aaItem" onClick={() => editResource(r)}>
                        {r.title}
                      </div>
                      <div className="killButton" onClick={() => killAResource(r)}>
                        ✕
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </ExpandableTable>

        <ExpandableTable title="merchandise" open={false}>
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
                      ✕
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </ExpandableTable>

        <ExpandableTable title="placed orders" open={false}>
          <PlacedOrdersTable />
        </ExpandableTable>

        <ExpandableTable title="database" open={false}>
          {user.sensi && (
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
          )}
        </ExpandableTable>
      </div>
    </div>
  );
}
