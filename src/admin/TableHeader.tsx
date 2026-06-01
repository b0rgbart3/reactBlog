'use client';
export interface TableHeaderProps {
  title: string;
  expanded?: boolean;
}
export function TableHeader(props: TableHeaderProps) {
  const { title, expanded } = props;
  return (
    <div className={`expandableTableHeaderRow ${expanded ? 'expanded' : ''}`}>
      <span className={`expandableTableArrow ${expanded ? 'expanded' : ''}`}>&#8250;</span>
      {title}
    </div>
  )
}
