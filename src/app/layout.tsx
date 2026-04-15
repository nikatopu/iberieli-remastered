import type { Metadata } from "next";
import { Josefin_Sans, Montserrat } from "next/font/google";
import Layout from "@/components/organisms/Layout";
import { ContextProviderWrapper } from "@/contexts/AppContext";
import "@/styles/globals.scss";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iberieli - Authentic Georgian Natural Wines",
  description:
    "Discover Iberieli's authentic Georgian natural wines, crafted using traditional Kvevri winemaking methods. Explore our unique wines from Guria and Kakheti regions, available worldwide.",
  keywords: [
    "Iberieli",
    "Georgian wine",
    "Natural wine",
    "Kvevri",
    "Zurab Topuridze",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${montserrat.variable}`}
    >
      <body>
        <ContextProviderWrapper>
          <Layout>{children}</Layout>
        </ContextProviderWrapper>
      </body>
    </html>
  );
}
