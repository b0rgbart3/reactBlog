'use client';
import React from "react";

export interface AdminTableProps {
  children: React.ReactNode;
}

export function AdminTable(props: AdminTableProps) {
  const { children } = props;
  return <div className="adminTable">{children}</div>;
}
