import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header"; 
import Nav from "@/components/layout/Nav"; 
import authApi from "@/lib/api/authApi"; 
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Management App",
  description: "A Next.js application for managing tasks, employees, and chat",
  openGraph: {
    title: "Task Management App",
    description: "Manage tasks, employees, and communicate via chat",
    url: "https://task-management-app.vercel.app",
    siteName: "Task Management",
  },
};

async function checkAuth() {
  try {
    const user = await authApi.getCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await checkAuth();

  if (!user && process.env.NODE_ENV !== "development") {
    redirect("/login");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}
      >
        {user && <Nav />}
        <div className="flex-1 flex flex-col">
          {user && <Header user={user} />}
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}