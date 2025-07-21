import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import Header from "@/components/layout/Header";
import Nav from "@/components/layout/Nav";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const metadata: Metadata = {
  title: "Skipli",
  description: "Quản lý công việc",
};
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.decode(token) as {
      id: string;
      phoneNumber?: string;
      role?: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await checkAuth();


  return (
    <html lang="vi">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}>

        {user && <Nav />}
        <div className="flex-1 flex flex-col">
          {user && <Header user={user} />}
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
