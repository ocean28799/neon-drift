import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neon Drift - Futuristic Racing Game",
  description: "Navigate the neon highways of 2025 in this thrilling offline racing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`antialiased bg-slate-900 select-none`}
      >
        {children}
      </body>
    </html>
  );
}
