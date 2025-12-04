import { TableHeader } from "./TableHeader";
import { React, useState, useCallback } from "react";


export interface ExpandableTableProps {
    children: React.ReactNode;
    title: string;
    open: boolean;
}
export function ExpandableTable(props: ExpandableTableProps) {
    const {children, open, title} = props;

    const [expanded, setExpanded] = useState(open);

    const toggleExpansion = useCallback(() => {
        setExpanded(!expanded);
    },[expanded]);


    return (
        <>
        <div className="expandableTable">
            <div onClick={toggleExpansion}>
              <TableHeader title={title} />
            </div>

          <div className={`expandableTableContent ${expanded ? 'expanded' : ''}`}>
                { children }
            </div>
        </div>
        </>
    )
}