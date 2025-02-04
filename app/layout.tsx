import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import './globals.css'; // Tailwind CSSのグローバル設定を反映
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "MaeMob",
  description: "FC25の結果を管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full bg-gray-100">
      <body className="h-full">
        <div className="min-h-screen">
          <Nav/>
          <Header/>
          <main className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
