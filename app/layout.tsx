import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEE Standards & Labelling Portal",
  description:
    "Bureau of Energy Efficiency — Standards & Labelling Portal. Verify star-rated appliances, compare energy savings, and manage the model & label lifecycle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
