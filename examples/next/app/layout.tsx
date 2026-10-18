import type { Metadata } from "next";
import "./surflane.css";

export const metadata: Metadata = { title: "Surflane on Next.js" };

// Resolve the theme on the server (for example from a cookie) to avoid a flash.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light">
      <body className="pui-typography">{children}</body>
    </html>
  );
}
