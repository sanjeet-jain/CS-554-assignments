import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div>
          <Button className="border-white">
            <Link href="/">Home</Link>
          </Button>
          <Link href="/authors">Authors</Link>
          <Link href="/books">Books</Link>
        </div>
        <br></br>
        <br></br>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}