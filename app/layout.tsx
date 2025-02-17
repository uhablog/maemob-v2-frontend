'use client';

import Footer from "@/components/footer";
import Header from "@/components/header";
import './globals.css'; // Tailwind CSSのグローバル設定を反映
import Nav from "@/components/nav";
import { MatchProvider } from "@/context/MatchContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full bg-gray-100">
      <body className="h-full">
        <MatchProvider>
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
        </MatchProvider>
      </body>
    </html>
  );
}
