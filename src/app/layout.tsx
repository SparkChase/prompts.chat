import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic, Geist_Mono, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import { getMessages, getLocale, getTimeZone } from "next-intl/server";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { ArchiveHeader } from "@/components/archive/archive-header";
import { ArchiveFooter } from "@/components/archive/archive-footer";
import { Footer } from "@/components/layout/footer";
import { CookieConsentBanner } from "@/components/layout/cookie-consent";
import { Analytics } from "@/components/layout/analytics";
import { WebsiteStructuredData } from "@/components/seo/structured-data";
import { AppBanner } from "@/components/layout/app-banner";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { LocaleDetector } from "@/components/providers/locale-detector";
import { getConfig } from "@/lib/config";
import { isRtlLocale } from "@/lib/i18n/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  const { name, description, favicon } = config.branding;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(baseUrl),
    title: { default: name, template: `%s | ${name}` },
    description,
    icons: { icon: favicon, shortcut: favicon, apple: favicon },
    openGraph: { type: "website", siteName: name, title: name, description, images: [{ url: "/richard/social.webp", width: 1200, height: 630, alt: name }] },
    twitter: { card: "summary_large_image", title: name, description, images: ["/richard/social.webp"] },
    other: { "apple-mobile-web-app-title": name },
  };
}

const radiusValues = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
};

function hexToOklch(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "oklch(0.5 0.2 260)";
  
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = (max - min) * 0.4;
  
  let h = 0;
  if (max !== min) {
    if (max === r) h = ((g - b) / (max - min)) * 60;
    else if (max === g) h = (2 + (b - r) / (max - min)) * 60;
    else h = (4 + (r - g) / (max - min)) * 60;
  }
  if (h < 0) h += 360;
  
  return `oklch(${(l * 0.8 + 0.2).toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
  const isEmbedRoute = pathname.startsWith("/embed");
  const isKidsRoute = pathname.startsWith("/kids");
  
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();
  const config = await getConfig();
  const isRtl = isRtlLocale(locale);
  const isArchive = config.homepage?.useCloneBranding ?? false;

  // Calculate theme values server-side
  const themeClasses = `theme-${config.theme.variant} density-${config.theme.density}${isArchive ? " richard-archive" : ""}`;
  const primaryOklch = hexToOklch(config.theme.colors.primary);
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(config.theme.colors.primary);
  const lightness = rgb 
    ? 0.2126 * (parseInt(rgb[1], 16) / 255) + 0.7152 * (parseInt(rgb[2], 16) / 255) + 0.0722 * (parseInt(rgb[3], 16) / 255)
    : 0.5;
  const foreground = lightness > 0.5 ? "oklch(0.2 0 0)" : "oklch(0.98 0 0)";
  
  const themeStyles = {
    "--radius": radiusValues[config.theme.radius],
    "--primary": isArchive ? "var(--archive-accent)" : primaryOklch,
    "--primary-foreground": isArchive ? "var(--archive-on-accent)" : foreground,
  } as React.CSSProperties;

  const fontClasses = isRtl 
    ? `${inter.variable} ${notoSansArabic.variable} ${geistMono.variable} ${playfairDisplay.variable} font-arabic` 
    : `${inter.variable} ${geistMono.variable} ${playfairDisplay.variable} font-sans`;

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning className={themeClasses} style={themeStyles}>
      <head>
        {process.env.GOOGLE_ADSENSE_ACCOUNT && (
          <meta name="google-adsense-account" content={process.env.GOOGLE_ADSENSE_ACCOUNT} />
        )}
        <WebsiteStructuredData />
      </head>
      <body className={`${fontClasses} antialiased`}>
        {process.env.GOOGLE_ANALYTICS_ID && (
          <Analytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
        )}
        <Providers locale={locale} messages={messages} timeZone={timeZone} theme={config.theme} branding={{ ...config.branding, useCloneBranding: config.homepage?.useCloneBranding }}>
          {isEmbedRoute || isKidsRoute ? (
            children
          ) : (
            <>
              <LocaleDetector />
              <div className="relative min-h-screen flex flex-col">
                <AnnouncementBanner />
                {isArchive ? <ArchiveHeader /> : <Header authProvider={config.auth.provider} allowRegistration={config.auth.allowRegistration} />}
                <main className="flex-1">{children}</main>
                {isArchive ? <ArchiveFooter /> : <Footer />}
                <CookieConsentBanner />
              </div>
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
