



import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../styles/custom.css"; // Uncomment this line
import { AuthProvider } from "@/context/AuthContext";
import { PropertyProvider } from "@/context/PropertyContext";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://onlyif.com'),
  title: {
    default: "OnlyIf - Real Estate Platform | Buy and Sell Homes with Confidence",
    template: "%s | OnlyIf"
  },
  description: "OnlyIf makes buying and selling homes simple, transparent, and stress-free. Get a cash offer in minutes or browse our inventory of move-in ready homes. Connect with trusted real estate agents.",
  keywords: [
    "real estate",
    "property",
    "homes for sale",
    "real estate agents",
    "property listings",
    "buy home",
    "sell home",
    "cash offer",
    "housing",
    "real estate platform",
    "property search",
    "home buying",
    "home selling"
  ],
  authors: [{ name: "OnlyIf Team", url: "https://onlyif.com" }],
  creator: "OnlyIf",
  publisher: "OnlyIf",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onlyif.com",
    siteName: "OnlyIf",
    title: "OnlyIf - Real Estate Platform | Buy and Sell Homes with Confidence",
    description: "OnlyIf makes buying and selling homes simple, transparent, and stress-free. Get a cash offer in minutes or browse our inventory of move-in ready homes.",
    images: [
      {
        url: "/images/hero-home.jpg", // Use existing image
        width: 1200,
        height: 630,
        alt: "OnlyIf - Real Estate Platform",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@onlyif",
    creator: "@onlyif",
    title: "OnlyIf - Real Estate Platform | Buy and Sell Homes with Confidence",
    description: "OnlyIf makes buying and selling homes simple, transparent, and stress-free. Get a cash offer in minutes or browse our inventory of move-in ready homes.",
    images: ["/images/hero-home.jpg"], // Use existing image
  },
  alternates: {
    canonical: "https://onlyif.com",
  },
  category: "Real Estate",
  classification: "Real Estate Platform",
  other: {
    "msapplication-TileColor": "#1f2937",
    "theme-color": "#1f2937",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="OnlyIf" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OnlyIf" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "OnlyIf",
              "description": "OnlyIf makes buying and selling homes simple, transparent, and stress-free.",
              "url": "https://onlyif.com",
              "logo": "https://onlyif.com/logo.png",
              "image": "https://onlyif.com/images/hero-bg.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "sameAs": [
                "https://twitter.com/onlyif",
                "https://facebook.com/onlyif",
                "https://linkedin.com/company/onlyif"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased font-sans text-black">
        <AuthProvider>
          <PropertyProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
              Skip to main content
            </a>
            <main id="main-content">
              {children}
            </main>
            <Footer 
              logo="/logo.png"
              logoText="OnlyIf"
              description="Sell your home in days, not months. Get a competitive cash offer in 24 hours with no obligation."
              copyrightText="© 2025 OnlyIf. All rights reserved."
            />
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
