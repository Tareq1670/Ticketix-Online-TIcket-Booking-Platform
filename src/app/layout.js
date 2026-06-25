import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ThemeProviders from "@/providers/Providers";
import { Toaster } from "react-hot-toast";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Ticketix",
  description: "Book tickets easily for your favorite events with Ticketix.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${ibmMono.variable} min-h-screen`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProviders>
          <main className={bricolage.className}>{children}</main>
          <Toaster />
        </ThemeProviders>
      </body>
    </html>
  );
}