import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import "./minimal.css";
import "./ask.css";
import { DemoProvider } from "@/components/store";
import { MessageDetail } from "@/components/inbox";
import { WebTools } from "@/components/web-tools";
export const metadata: Metadata = {
  title: "Miyo — Only what matters.",
  description:
    "A calmer home for your attention. Explore the interactive Miyo demo.",
  icons: { icon: "/miyo-mascot-selected.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <DemoProvider>
          {children}
          <MessageDetail />
          <WebTools />
        </DemoProvider>
      </body>
    </html>
  );
}
