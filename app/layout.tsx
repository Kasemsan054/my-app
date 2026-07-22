import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import AppShell from "./components/layout/AppShell";
import { getCurrentUser } from "./lib/auth";

const promptFont = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "ระบบออกใบรับคืนอุปกรณ์ | QSP Service System",
  description: "ระบบบริหารจัดการและออกใบรับคืนอุปกรณ์ซ่อม สำหรับองค์กร",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="th" className={`${promptFont.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 flex flex-col font-sans">
        <AppShell currentUser={currentUser}>{children}</AppShell>
      </body>
    </html>
  );
}
