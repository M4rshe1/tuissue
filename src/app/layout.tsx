import { Toaster } from "@/components/ui/sonner";
import { FormDialogProvider } from "@/providers/form-dialog-provider";
import { QueryClientProvider } from "@/providers/query-client-provider";
import { ShortcutsProvider } from "@/providers/shortcuts-provider";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { JetBrains_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "TuIssue",
  description: "TuIssue is a tool for managing your issues",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const monospace = JetBrains_Mono({
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
      <body className="font-monospace h-screen overflow-hidden">
        <ThemeProvider>
          <QueryClientProvider>
            <ShortcutsProvider>
              <FormDialogProvider>
                <div className="h-full max-h-screen overflow-hidden">
                  {children}
                </div>
              </FormDialogProvider>
            </ShortcutsProvider>
          </QueryClientProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
