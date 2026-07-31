"use client";
import React, { Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../state/useStore";
import { UsersForm } from "./UsersForm";
import { AdminTabs } from "./AdminTabs";
import { AdminTable } from "./AdminTable";
import { AdminArticles } from "./AdminArticles";
import { AdminResources } from "./AdminResources";
import { AdminMemes } from "./AdminMemes";
import { AdminMerchandise } from "./AdminMerchandise";
import { AdminDatabase } from "./AdminDatabase";
import { PlacedOrdersTable } from "./PlacedOrdersTable";
import { AnalyticsTable } from "./AnalyticsTable";

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
  const { user } = useStore((s) => s);

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

  let sectionContent: React.ReactNode = null;
  switch (activeTab) {
    case "users":
      sectionContent = <UsersForm />;
      break;

    case "articles":
      sectionContent = <AdminArticles />;
      break;

    case "resources":
      sectionContent = <AdminResources />;
      break;

    case "memes":
      sectionContent = <AdminMemes />;
      break;

    case "merchandise":
      sectionContent = <AdminMerchandise />;
      break;

    case "placed-orders":
      sectionContent = <PlacedOrdersTable />;
      break;

    case "analytics":
      sectionContent = <AnalyticsTable />;
      break;

    case "database":
      sectionContent = <AdminDatabase />;
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
