'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Article, Product, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { DownloadJsonButton } from "./Download";
import { UsersForm } from "./UsersForm";
import { TableHeader } from "./TableHeader";
import { ExpandableTable } from "./ExpandableTable";
import { PlacedOrdersTable } from "./PlacedOrdersTable";

export function AdminPanel() {
  const { refresh, kill, backUpDB, wipeAndSeed, killProduct, displayMerch } = useData();
  const { user, articles, categories, products, productCategories, users, settings } = useStore((s) => s);
  const showMerch = settings?.find((s) => s.name === "showMerch")?.booleanValue ?? false;
  const showMerchLocal = settings?.find((s) => s.name === "showMerchLocal")?.booleanValue ?? false;
  const router = useRouter();

  const editArticle = useCallback((article: Article) => {
    router.push(`/article/edit/${article._id}`);
  }, [router]);

  const editProduct = useCallback((product: Product) => {
    router.push(`/product/edit/${product._id}`);
  }, [router]);

  const toggleMerch = useCallback(() => {
    displayMerch({ id: user._id, key: user.phash }, 'showMerch');
  }, [user]);

  const toggleMerchLocal = useCallback(() => {
    displayMerch({ id: user._id, key: user.phash }, 'showMerchLocal');
  }, [user]);

  const killArticle = useCallback((article: Article) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this article,
            titled: ${article.title} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
    if (!confirmDelete) return;
    kill(article._id);
    refresh();
  }, []);

  const killAProduct = useCallback((productToKill: Product) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this product,
            named: ${productToKill.productName} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
    if (!confirmDelete) return;
    killProduct(productToKill._id);
    refresh();
  }, []);

  const newArticle = useCallback(() => { router.push(`/article/new`); }, [router]);
  const newProduct = useCallback(() => { router.push(`/product/new`); }, [router]);

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
          <div onClick={newArticle} className="newArticleButton">New Article</div>
          <br></br>
          {categories?.map((category, categoryIndex) => (
            <div key={`category-${category}-${categoryIndex}`}>
              <div className="killCategory">{category}</div>
              <div className="articlesTable">
                {articles?.filter((a) => a.category === category).map((a) => (
                  <React.Fragment key={a._id}>
                    <div className="aaRow">
                      <div className="aaItem" onClick={() => editArticle(a)}>{a.title}</div>
                      <div className="killButton" onClick={() => killArticle(a)}>X</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </ExpandableTable>

        <ExpandableTable title="merchandise" open={false}>
          <div className="merchToggle" onClick={toggleMerchLocal}>
            <div className={showMerchLocal ? "bigCheckBoxSelected" : "bigCheckBox"}>
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
          <div onClick={newProduct} className="newArticleButton">New Product</div>

          {products && (
            <>
              Products:<br></br>
              <div className="productsContainer">
                {products.map((product) => (
                  <div key={product._id}>
                    <div onClick={() => editProduct(product)}>{product.productName}</div>
                    <div>{product.productDescription}</div>
                    <div className="killProduct" onClick={() => killAProduct(product)}>X</div>
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
              <div className="caution" onClick={() => backUp()}>Backup the current DataBase.</div>
              <div className="JsonData">
                Download data to your local download folder:<br></br>
                <DownloadJsonButton articles={articles} users={users} />
              </div>
              <div className="dangerous" onClick={() => clearOut()}>Wipe out the DataBase, and start over with original seed data.</div>
            </>
          )}
        </ExpandableTable>
      </div>
    </div>
  );
}
