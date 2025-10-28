import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import ClientLayout from "./utilities/client-layout/page";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "O7ONG CORP",
  description: "BOOKING APPLICATION FOR MINISOCCER AND FUTSAL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ClientLayout>
            {children}
          <Toaster 
          position="top-right"
          theme="dark"
          richColors
          closeButton
          duration={3000}
        />
            </ClientLayout>
      </body>
    </html>
  );
}