
export interface TableHeaderProps {
    title: string;
    expanded?: boolean;
}
export function TableHeader(TableHeaderProps) {
    const {title, expanded} = TableHeaderProps;
    return (
          <div className={`expandableTableHeaderRow ${expanded ? 'expanded' : ''}`}>
              <span className={`expandableTableArrow ${expanded ? 'expanded' : ''}`}>&#8250;</span>
              {title}
          </div>
    )
}