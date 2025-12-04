import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "گردونه واژه‌ساز فارسی | Persian Word Spinner",
  description: "ساخت واژه‌های تصادفی با ترکیب پیشوند، ریشه و پسوند | Generate random Persian words by combining prefix, root, and suffix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
