import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { TagList } from "@/components/Menu/TagList";
import { CategoryList } from "@/components/Menu/CategoryList";
import { products } from "@repo/db/data";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/components/Themes/ThemeContext";
import ThemeSwitch from "@/components/Themes/ThemeSwitcher";
import SearchBox from "@/components/SearchBox";
import { CartProvider } from "@/components/Cart/CartContext";
import jwt from "jsonwebtoken";
import { LogoutButton } from "@/components/Auth/LogoutButton";

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
  const cookieStore = await cookies();

  const theme =
    (cookieStore.get("theme")?.value || "light") as "light" | "dark";

  const token = cookieStore.get("user_auth_token")?.value;

  let loggedIn = false;

  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET || "user-secret-key");
      loggedIn = true;
    }
  } catch {
    loggedIn = false;
  }

  const activeProducts = products.filter((p) => p.active);

  return (
    <html lang="en" data-theme={theme}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider initialTheme={theme}>
          <CartProvider>
            <div className="flex h-screen">

              {/* SIDEBAR */}
              <aside className="w-64 border-r p-6">
                <Link href="/" className="block mb-6">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/wsuLogo.png"
                      alt="Logo"
                      width={40}
                      height={40}
                    />
                    <h1 className="text-xl font-bold">B2C Store</h1>
                  </div>
                </Link>

                <nav className="space-y-6">

                  {/* AUTH SECTION */}
                  <div className="mb-4">
                    {!loggedIn ? (
                      <Link
                        href="/login"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Login
                      </Link>
                    ) : (
                      <LogoutButton />
                    )}
                  </div>

                  {/* CART */}
                  <div>
                    <Link
                      href="/cart"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      🛒 Cart
                    </Link>
                  </div>
                  {loggedIn && (
                    <div>
                      <Link
                        href="/purchases"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        📦 Purchase History
                      </Link>
                    </div>
                  )}

                  {/* CATEGORIES */}
                  <div>
                    <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Categories</h2>
                    <ul className="space-y-2">
                      <CategoryList products={activeProducts} />
                    </ul>
                  </div>

                  {/* HISTORY */}
                  <div>
                    <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">History</h2>
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
                              className="text-gray-700 dark:text-gray-200 hover:underline hover:text-black dark:hover:text-white"
                            >
                              {label} {year}
                              <span className="ml-2 inline-flex items-center justify-center 
                              min-w-[22px] h-[22px] px-2 rounded-full bg-gray-700 text-white 
                              text-xs font-semibold">
                                {count}</span>
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
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}