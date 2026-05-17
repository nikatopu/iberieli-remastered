import type { Metadata } from "next";
import { Josefin_Sans, Merriweather, Montserrat } from "next/font/google";
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

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.iberieli.com"),
  title: {
    default: "Iberieli — Authentic Georgian Natural Wines",
    template: "%s | Iberieli",
  },
  description:
    "Iberieli produces authentic Georgian natural wines using traditional Kvevri methods. Family-owned winery in Guria and Kakheti, exporting to 10+ countries worldwide.",
  keywords: [
    "Iberieli",
    "Georgian wine",
    "natural wine",
    "Kvevri",
    "Zurab Topuridze",
    "Guria",
    "Kakheti",
    "Chkhaveri",
    "Saperavi",
    "Rkatsiteli",
    "wine importer",
    "wine distributor",
    "Georgian winery",
  ],
  authors: [{ name: "Iberieli LLC" }],
  creator: "Iberieli LLC",
  publisher: "Iberieli LLC",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.iberieli.com",
    siteName: "Iberieli",
    title: "Iberieli — Authentic Georgian Natural Wines",
    description:
      "Iberieli produces authentic Georgian natural wines using traditional Kvevri methods. Family-owned winery in Guria and Kakheti, exporting to 10+ countries worldwide.",
    images: [
      {
        url: "/photos/Wines 1.webp",
        width: 1200,
        height: 630,
        alt: "Iberieli Georgian Natural Wines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iberieli — Authentic Georgian Natural Wines",
    description:
      "Iberieli produces authentic Georgian natural wines using traditional Kvevri methods. Family-owned winery in Guria and Kakheti, exporting to 10+ countries worldwide.",
    images: ["/photos/Wines 1.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.iberieli.com/#organization",
      name: "Iberieli LLC",
      url: "https://www.iberieli.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.iberieli.com/photos/Iberieli Logo.webp",
      },
      description:
        "Family-owned Georgian winery producing authentic natural wines using traditional Kvevri methods.",
      founder: {
        "@type": "Person",
        name: "Zurab Topuridze",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+995599584624",
          contactType: "sales",
          availableLanguage: ["English", "Georgian", "Russian"],
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GE",
        addressRegion: "Guria",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.iberieli.com/#website",
      url: "https://www.iberieli.com",
      name: "Iberieli",
      description: "Authentic Georgian natural wines",
      publisher: { "@id": "https://www.iberieli.com/#organization" },
    },
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
      className={`${josefinSans.variable} ${montserrat.variable} ${merriweather.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ContextProviderWrapper>
          <Layout>{children}</Layout>
        </ContextProviderWrapper>
      </body>
    </html>
  );
}
