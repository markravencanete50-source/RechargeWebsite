import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import "./globals.css";

const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [
    { path: "./fonts/Montserrat_400Regular.ttf", weight: "400" },
    { path: "./fonts/Montserrat_500Medium.ttf", weight: "500" },
    { path: "./fonts/Montserrat_600SemiBold.ttf", weight: "600" },
    { path: "./fonts/Montserrat_700Bold.ttf", weight: "700" },
  ],
});

const description =
  "Serviced apartments and short-let management in Glasgow, Edinburgh and across Scotland. Book direct, or let us run your property with guaranteed rent or full management.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Recharge | Serviced accommodation and short-let management in Scotland", template: "%s | Recharge" },
  description,
  openGraph: { type: "website", locale: "en_GB", siteName: "Recharge", url: site.url, title: "Recharge | Short stays, run properly", description },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#efe9db" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={montserrat.variable}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
