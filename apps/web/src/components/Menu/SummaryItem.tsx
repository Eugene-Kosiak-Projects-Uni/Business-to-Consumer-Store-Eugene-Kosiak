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
        className={`ml-2 text-gray-700 dark:text-gray-200 hover:underline hover:text-black dark:hover:text-white ${
          isSelected ? "font-bold text-blue-500 underline" : ""
        }`}
      >
        <span>{name}</span>
        <span className="ml-2 inline-flex items-center 
                  justify-center min-w-[22px] h-[22px] px-2 
                  rounded-full bg-gray-700 text-white text-xs 
                  font-semibold">
          {count}
        </span>
      </a>
    </li>
  );
}