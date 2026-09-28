import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "5MT Copy Server: Self-Hosted MT5 Copy Trading Server";
const shareDescription =
  "Copy trades from one master MT5 account to many slaves on any broker. Runs on your own server, managed from a web page.";

export const metadata: Metadata = {
  metadataBase: new URL("https://5mtrader.com"),
  title,
  description:
    "Self-hosted copy trading server for MT5. Copy trades from one master MT5 account to many slaves on any broker, in about one second. No terminal, no EA, no Windows VPS.",
  robots: { index: true, follow: true, "max-image-preview": "large" },
  alternates: { canonical: "https://5mtrader.com/" },
  icons: { icon: { url: "/cube.svg", type: "image/svg+xml" } },
  openGraph: {
    type: "website",
    siteName: "5MT Copy Server",
    url: "/",
    title,
    description: shareDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "5MT Copy Server web panel copying trades between MT5 accounts",
      },
    ],
    videos: [{ url: "https://5mtrader.com/demo.mp4", type: "video/mp4", width: 1440, height: 904 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: shareDescription,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
