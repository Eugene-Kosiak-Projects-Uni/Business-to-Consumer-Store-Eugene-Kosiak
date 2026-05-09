import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { toUrlPath } from "@repo/utils/url";
import { TagList } from "@/components/Menu/TagList";
import { products } from "@repo/db/data";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/components/Themes/ThemeContext";
import ThemeSwitch from "@/components/Themes/ThemeSwitcher";
import SearchBox from "@/components/SearchBox";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Full-Stack Store",
  description: "B2C Store Application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverCookies = await cookies();
  const theme =
    (serverCookies.get("theme")?.value || "light") as "light" | "dark";

  const activeProducts = products.filter((p) => p.active);

  return (
    <html lang="en" data-theme={theme}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider initialTheme={theme}>
          <div className="flex h-screen">

            {/* SIDEBAR */}
            <aside className="w-64 border-r p-6">
              <Link href="/" className="block mb-6">
                <div className="flex items-center gap-2">
                  <Image src="/wsuLogo.png" alt="Logo" width={40} height={40} />
                  <h1 className="text-xl font-bold">B2C Store</h1>
                </div>
              </Link>

              <nav className="space-y-6">

                {/* CATEGORIES */}
                <div>
                  <p className="font-semibold mb-2">Categories</p>
                  <ul className="space-y-2">
                    {["Electronics", "Gaming", "Clothing"].map((cat) => {
                      const count = activeProducts.filter(
                        (p) => p.category === cat
                      ).length;

                      return (
                        <li key={cat}>
                          <Link
                            href={`/category/${toUrlPath(cat)}`}
                            className="text-gray-500 hover:text-black"
                          >
                            {cat} <span>{count}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* HISTORY */}
                <div>
                  <p className="font-semibold mb-2">History</p>
                  <ul className="space-y-2">
                    {Array.from(
                      activeProducts.reduce((acc, product) => {
                        const d = new Date(product.date);
                        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                        acc.set(key, (acc.get(key) || 0) + 1);
                        return acc;
                      }, new Map<string, number>())
                    ).map(([key, count]) => {
                      const [year, month] = key.split("-");
                      const date = new Date(Number(year), Number(month) - 1);

                      const label = date.toLocaleString("en-GB", {
                        month: "long",
                      });

                      return (
                        <li key={key}>
                          <Link
                            href={`/history/${year}/${month}`}
                            className="text-gray-500"
                          >
                            {label} {year} <span>{count}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* TAGS */}
                <TagList products={activeProducts} />
              </nav>
            </aside>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">
              <header className="flex justify-between p-4 border-b">
                <SearchBox />
                <ThemeSwitch />
              </header>

              <main className="p-6 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}