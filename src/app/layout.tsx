import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingBackground from "@/components/layout/FloatingBackground";
import { COLORS } from "@/constants/styles";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Crunchy Cashews | Best Cashew Factory & Distributor in India",
  description: "Crunchy Cashews is the best cashew factory and distributor in Siliguri, West Bengal, India. Buy premium, farm-fresh cashews online in bulk or retail.",
  keywords: ["Best cashew", "Cashew", "Cashew in Siliguri", "Cashew in West Bengal", "Cashew in India", "Cashew factory", "Cashew distributor", "Premium Cashews", "Wholesaler"],
  authors: [{ name: "Crunchy Cashews" }],
  openGraph: {
    title: "Crunchy Cashews | Best Cashew Factory & Distributor",
    description: "Crunchy Cashews is the best cashew factory and distributor in Siliguri, West Bengal, India. Buy premium, farm-fresh cashews.",
    url: "https://crunchycashews.com",
    siteName: "Crunchy Cashews",
    images: [{ url: "/images/cc-Logo-01-1.png", width: 800, height: 600 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crunchy Cashews | Best Cashew Factory & Distributor",
    description: "Crunchy Cashews is the best cashew factory and distributor in Siliguri, West Bengal, India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body 
        className={`${montserrat.variable} font-sans antialiased`}
        style={{
          '--theme-primary': COLORS.primary,
          '--theme-primary-light': COLORS.primaryLight,
          '--theme-yellow': COLORS.yellow,
          '--theme-amber': COLORS.amber,
          '--theme-bg': COLORS.bg,
          '--theme-bg-mobile': COLORS.bgMobile,
          '--theme-danger': COLORS.danger,
        } as React.CSSProperties}
      >
        <StoreProvider>
          <FloatingBackground />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
