
export interface TableHeaderProps {
    title: string;
}
export function TableHeader(TableHeaderProps) {
    const {title} = TableHeaderProps;
    return (
          <div className="expandableTableHeaderRow">{title}</div>
    )
}