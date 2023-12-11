import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookShelf",
  description:
    "Bookshelf is a simple web application for managing your book collection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="p-0 m-5">
          <div className="grid grid-cols-4 gap-4">
            <Link href="/">
              <Button className="border border-white w-full col-span-3 flex">
                Home
              </Button>
            </Link>
            <Link href="/authors">
              <Button className="border border-white w-full col-span-3 flex">
                Authors
              </Button>
            </Link>
            <Link href="/books">
              <Button className="border border-white w-full col-span-3 flex">
                Books
              </Button>
            </Link>
            <Link href="/search">
              <Button className="border border-white w-full col-span-3 flex">
                Search
              </Button>
            </Link>
          </div>
        </div>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
