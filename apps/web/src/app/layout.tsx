import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { TagList } from "@/components/Menu/TagList";
import { CategoryList } from "@/components/Menu/CategoryList";
import { prisma } from "@repo/db/prisma";
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
  let userName = "";

  try {
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "user-secret-key"
      ) as {
        name: string;
      };

      loggedIn = true;
      userName = decoded.name;
    }
  } catch {
    loggedIn = false;
  }

  const activeProducts = await prisma.product.findMany({
    where: {
      active: true,
    },
  });

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
                      src="/B2CLogo.png"
                      alt="Logo"
                      width={64}
                      height={64}
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

                  {/* TAGS */}
                  <TagList products={activeProducts} />
                </nav>
              </aside>

              {/* MAIN AREA */}
              <div className="flex-1 flex flex-col">

                <header className="flex justify-between items-center p-4 border-b">
                  <SearchBox />
                  <div className="flex items-center gap-4">
                    {loggedIn && (
                      <p className="font-semibold">
                        Hi {userName}
                      </p>
                    )}
                    <ThemeSwitch />
                  </div>
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