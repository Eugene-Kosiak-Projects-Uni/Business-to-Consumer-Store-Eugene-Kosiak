// import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { toUrlPath } from "@repo/utils/url";
import { TagList } from "@/components/Menu/TagList";
import { prisma } from "@repo/db/prisma";
import Link from "next/link";
import { ThemeProvider } from "@/components/Themes/ThemeContext";
import ThemeSwitch from "@/components/Themes/ThemeSwitcher";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Full-Stack Blog",
  description: "Blog about full stack development",
};

import SearchBox from "@/components/SearchBox";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverCookies = await cookies();
  const theme = (serverCookies.get("theme")?.value || "light") as "light" | "dark";
  const posts = await prisma.post.findMany();

  return (
    <html lang="en" data-theme={theme}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider initialTheme={theme}>
          <div className="flex h-screen">

            {/* Sidebar */}
            <aside className="w-64 border-r border-black dark:border-white p-6">
            <Link href="/" className="block mb-6">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <Image
                  src="/wsuLogo.png"
                  alt="WSU Logo"
                  width={40}
                  height={40}
                />
                <h1 className="text-xl font-bold text-wsu">
                  Full Stack Blog
                </h1>
              </div>
            </Link>

            <nav className="space-y-4">
      
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Categories</p>
                <ul className="space-y-2">
                  {["React", "Node", "Mongo", "DevOps"].map((cat) => {
                    const count = posts.filter(
                      (p) => p.active && p.category === cat
                    ).length;

                    return (
                      <li key={cat}>
                        <Link
                          href={`/category/${toUrlPath(cat)}`}
                          title={`Category / ${cat}`}
                          className="text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                        >
                          {cat} <span data-test-id="post-count">{count}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-6">History</p>
                <ul className="space-y-2">
                  {Array.from(
                    posts
                      .filter((p) => p.active)
                      .reduce((acc, post) => {
                        const d = new Date(post.date);
                        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                        acc.set(key, (acc.get(key) || 0) + 1);
                        return acc;
                      }, new Map<string, number>())
                  ).map(([key, count]) => {
                    const [year, month] = key.split("-");
                    const date = new Date(Number(year), Number(month) - 1);

                    const label = date.toLocaleString("en-GB", {
                      month: "long",
                    }) + `, ${date.getFullYear()}`;

                    return (
                      <li key={key}>
                        <Link
                          href={`/history/${year}/${month}`}
                          title={`History / ${label}`}
                          className="text-500 text-gray-500 dark:text-white dark:hover:text-gray-300"
                        >
                          {label} <span data-test-id="post-count">{count}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-6">
                <TagList posts={posts} />
              </div>
            </nav>
          </aside>

            <div className="flex-1 flex flex-col">


              <header className="flex items-center justify-between p-4 border-b">
                <SearchBox />
                <ThemeSwitch />
              </header>

              <main className="p-6 overflow-y-auto">
                <div className="max-w-5xl">{children}</div>
              </main>

            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
