import type { PropsWithChildren } from "react";

 export function LinkList({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">{title}</p>
      {children}
    </div>
  );
}
