"use client";

export interface AdminTabsProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
}

export function AdminTabs(props: AdminTabsProps) {
  const { tabs, activeId, onChange } = props;
  return (
    <div className="adminTabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`adminTab ${tab.id === activeId ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
