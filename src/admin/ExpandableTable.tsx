'use client';
import React, { useState, useCallback } from "react";
import { TableHeader } from "./TableHeader";

export interface ExpandableTableProps {
  children: React.ReactNode;
  title: string;
  open: boolean;
}
export function ExpandableTable(props: ExpandableTableProps) {
  const { children, open, title } = props;
  const [expanded, setExpanded] = useState(open);

  const toggleExpansion = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <>
      <div className="expandableTable">
        <div onClick={toggleExpansion}>
          <TableHeader title={title} expanded={expanded} />
        </div>
        <div className={`expandableTableContent ${expanded ? 'expanded' : ''}`}>
          {children}
        </div>
      </div>
    </>
  )
}
