import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/lenis-provider";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MAKAN | Digital Sanctuary & Culinary Arts",
  description: "A premium wabi-sabi cafe and digital sanctuary. Experience contemplative culinary craft, wood-fired pizzas, slow-drip V60, and slow-motion cinematic dining in Cairo.",
  keywords: ["wabi-sabi cafe", "Cairo specialty coffee", "V60 Cairo", "artisan wood-fired pizza", "premium lounge Cairo", "MAKAN cafe"],
  openGraph: {
    title: "MAKAN | Digital Sanctuary",
    description: "A premium wabi-sabi cafe and digital sanctuary.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-makan-black text-text-dark-primary font-sans">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
