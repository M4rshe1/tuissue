import { Toaster } from "@/components/ui/sonner";
import { FormDialogProvider } from "@/providers/form-dialog-provider";
import { QueryClientProvider } from "@/providers/query-client-provider";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { IBM_Plex_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "TuIssue",
  description: "TuIssue is a tool for managing your issues",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const monospace = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-monospace",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${monospace.variable}`}
    >
      <body className="font-monospace">
        <ThemeProvider>
          <QueryClientProvider>
            <FormDialogProvider>{children}</FormDialogProvider>
          </QueryClientProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
