export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <a
        href={link}
        title={title}
        className={isSelected ? "selected" : ""}
      >
        <span>{name}</span>
        <span>{count}</span>
      </a>
    </li>
  );
}