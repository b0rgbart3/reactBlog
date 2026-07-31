"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { TrashIcon } from "./icons";

export function AdminMerchandise() {
  const router = useRouter();
  const { refresh, killProduct, displayMerch } = useData();
  const { user, products, settings } = useStore((s) => s);

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

  const newProduct = useCallback(() => {
    router.push(`/product/new`);
  }, [router]);

  const editProduct = useCallback(
    (product: Product) => {
      router.push(`/product/edit/${product._id}`);
    },
    [router],
  );

  const killAProduct = useCallback((productToKill: Product) => {
    const confirmDelete =
      window.confirm(`Are you sure you want to delete this product,
            named: ${productToKill.productName} ?
            \nIt will be complete deleted from the database, and cannot be restored.`);
    if (!confirmDelete) return;
    killProduct(productToKill._id);
    refresh();
  }, []);

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
}
