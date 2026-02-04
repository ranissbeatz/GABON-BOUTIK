import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ChatProvider } from "@/context/ChatContext";
import Provider from "@/components/SessionProvider";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GabonBoutik",
  description: "Marketplace multi-vendeurs pour le Gabon",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ChatProvider>
                  {children}
                  <Footer />
                </ChatProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
