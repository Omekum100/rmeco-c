import type { Metadata } from "next";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "RM Finance Bills",
  description: "Daily medical shop supplier bill records"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ToastProvider />
      </body>
    </html>
  );
}
