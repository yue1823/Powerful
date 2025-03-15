

import "./globals.css";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import { ActiveLink } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { ReactQueryClientProvider } from "@/components/wallet/ReactQueryClientProvider";
import { AutoConnectProvider } from "@/components/wallet/AutoConnectProvider";
import { WalletConnectionHandler } from "@/components/wallet/User_store";
import Wallet from "@/components/wallet/client_wallet";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from '@mantine/modals'
import '@mantine/charts/styles.css';

const publicSans = Public_Sans({ subsets: ["latin"] });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 240 41"
    className="h-8 flex-shrink-0 self-start"
  >
    <path
      fill="currentColor"
      d="M 60.95 35.85 L 53 10.8 L 56 10.8 L 62.85 33.15 L 63.15 33.15 L 69.4 10.8 L 73.45 10.8 L 79.75 33.05 L 80.05 33.05 L 86.9 10.8 L 89.85 10.8 L 81.7 35.85 L 77.8 35.85 L 71.55 13.65 L 71.15 13.65 L 64.85 35.85 L 60.95 35.85 Z M 93.45 24.4 L 93.5 22.05 L 111.75 22.05 A 14.618 14.618 0 0 0 111.501 19.274 Q 111.058 16.984 109.825 15.35 Q 107.94 12.854 104.019 12.801 A 12.656 12.656 0 0 0 103.85 12.8 Q 100.645 12.8 98.687 14.233 A 6.223 6.223 0 0 0 97.4 15.5 A 8.913 8.913 0 0 0 96.035 18.205 Q 95.639 19.446 95.472 20.955 A 21.337 21.337 0 0 0 95.35 23.3 A 20.869 20.869 0 0 0 95.545 26.256 Q 95.76 27.754 96.211 28.971 A 8.764 8.764 0 0 0 97.35 31.125 A 6.116 6.116 0 0 0 100.279 33.251 Q 101.347 33.64 102.679 33.776 A 14.93 14.93 0 0 0 104.2 33.85 A 14.444 14.444 0 0 0 105.843 33.763 Q 107.604 33.561 108.67 32.888 A 3.98 3.98 0 0 0 108.875 32.75 Q 110.4 31.65 110.95 29.85 L 114.1 29.85 A 11.62 11.62 0 0 1 112.926 32.449 A 10.466 10.466 0 0 1 112.4 33.225 A 6.744 6.744 0 0 1 110.433 34.978 A 8.676 8.676 0 0 1 109.35 35.525 A 9.044 9.044 0 0 1 107.712 36.028 Q 106.861 36.209 105.857 36.288 A 21.092 21.092 0 0 1 104.2 36.35 A 15.854 15.854 0 0 1 100.777 36.004 Q 97.455 35.269 95.45 32.975 Q 93.023 30.198 92.593 25.441 A 23.791 23.791 0 0 1 92.5 23.3 Q 92.5 17 95.425 13.65 A 9.446 9.446 0 0 1 100.518 10.661 A 14.491 14.491 0 0 1 103.85 10.3 A 12.073 12.073 0 0 1 107.496 10.838 A 10.934 10.934 0 0 1 109.225 11.55 A 8.445 8.445 0 0 1 112.11 14.025 A 11.381 11.381 0 0 1 113.125 15.65 Q 114.207 17.74 114.495 20.879 A 26.503 26.503 0 0 1 114.6 23.3 L 114.6 24.4 L 93.45 24.4 Z M 170.6 25.5 L 170.6 10.85 L 173.45 10.85 L 173.45 35.9 L 170.6 35.9 L 170.6 31.65 Q 169.5 33.8 167.55 35.075 Q 166.058 36.051 163.717 36.28 A 15.593 15.593 0 0 1 162.2 36.35 A 12.203 12.203 0 0 1 159.562 36.082 Q 157.169 35.552 155.625 33.975 Q 153.3 31.6 153.3 26.45 L 153.3 10.8 L 156.15 10.8 L 156.1 26.3 A 15.759 15.759 0 0 0 156.22 28.319 Q 156.564 30.975 157.9 32.2 A 5.955 5.955 0 0 0 160.368 33.534 Q 161.288 33.791 162.384 33.839 A 11.765 11.765 0 0 0 162.9 33.85 A 10.418 10.418 0 0 0 165.11 33.624 A 8.501 8.501 0 0 0 166.85 33.05 A 5.744 5.744 0 0 0 169.338 30.846 A 7.267 7.267 0 0 0 169.6 30.4 A 7.392 7.392 0 0 0 170.247 28.699 Q 170.462 27.853 170.546 26.85 A 16.21 16.21 0 0 0 170.6 25.5 Z M 0 35.85 L 0 0.5 L 11.8 0.5 A 22.267 22.267 0 0 1 14.527 0.657 Q 15.886 0.825 17.021 1.173 A 10.144 10.144 0 0 1 18.65 1.825 A 8.992 8.992 0 0 1 21.017 3.536 A 7.928 7.928 0 0 1 22.45 5.55 A 11.016 11.016 0 0 1 23.42 8.535 A 15.272 15.272 0 0 1 23.65 11.25 A 15.308 15.308 0 0 1 23.395 14.112 A 11.359 11.359 0 0 1 22.45 17 A 8.349 8.349 0 0 1 18.933 20.66 A 10.294 10.294 0 0 1 18.675 20.8 Q 16.1 22.15 11.9 22.15 L 3 22.15 L 3 35.85 L 0 35.85 Z M 143.3 2.6 L 143.3 35.85 L 140.45 35.85 L 140.45 5.15 A 9.267 9.267 0 0 1 140.524 3.94 Q 140.606 3.317 140.78 2.797 A 4.537 4.537 0 0 1 141.025 2.2 A 3.341 3.341 0 0 1 142.548 0.695 A 4.417 4.417 0 0 1 142.925 0.525 Q 144.25 0 146.45 0 L 149.55 0 L 149.55 2.6 L 143.3 2.6 Z M 35.231 35.969 A 14.863 14.863 0 0 0 38.7 36.35 A 14.935 14.935 0 0 0 42.095 35.987 A 9.718 9.718 0 0 0 47.3 32.975 A 10.255 10.255 0 0 0 48.819 30.709 Q 49.625 29.086 49.992 27.036 A 21.213 21.213 0 0 0 50.3 23.3 A 24.573 24.573 0 0 0 50.276 22.207 Q 50.121 18.715 48.95 16.2 A 11.709 11.709 0 0 0 48.732 15.755 A 9.534 9.534 0 0 0 45.025 11.8 A 9.511 9.511 0 0 0 44.636 11.586 Q 42.172 10.3 38.7 10.3 A 14.969 14.969 0 0 0 35.231 10.678 A 9.715 9.715 0 0 0 30.1 13.65 Q 27.1 17 27.1 23.3 A 23.686 23.686 0 0 0 27.176 25.235 Q 27.578 30.138 30.1 32.975 A 9.699 9.699 0 0 0 35.231 35.969 Z M 124.1 20.95 L 124.1 35.85 L 121.25 35.85 L 121.25 10.8 L 124.1 10.8 L 124.1 15.4 Q 124.85 13.35 126.525 12.075 A 6.171 6.171 0 0 1 129.333 10.901 A 8.296 8.296 0 0 1 130.65 10.8 L 133.05 10.8 L 133.05 13.3 L 130.6 13.3 A 7.786 7.786 0 0 0 128.593 13.544 A 5.441 5.441 0 0 0 125.8 15.275 Q 124.407 16.894 124.155 19.671 A 14.199 14.199 0 0 0 124.1 20.95 Z M 184.55 0 L 184.55 35.85 L 181.7 35.85 L 181.7 0 L 184.55 0 Z M 38.7 33.8 A 10.467 10.467 0 0 0 41.36 33.481 A 7.271 7.271 0 0 0 45.175 31.1 Q 47.45 28.4 47.45 23.3 Q 47.45 19.898 46.438 17.576 A 8.19 8.19 0 0 0 45.175 15.525 Q 42.9 12.85 38.7 12.85 A 10.56 10.56 0 0 0 36.04 13.166 A 7.281 7.281 0 0 0 32.225 15.525 Q 29.95 18.2 29.95 23.3 Q 29.95 26.743 30.987 29.092 A 8.286 8.286 0 0 0 32.225 31.1 A 7.398 7.398 0 0 0 36.691 33.626 A 11.054 11.054 0 0 0 38.7 33.8 Z M 3 19.55 L 11.7 19.55 Q 15.2 19.55 17.15 18.525 A 6.215 6.215 0 0 0 18.806 17.288 A 5.44 5.44 0 0 0 19.875 15.625 Q 20.65 13.75 20.65 11.25 A 14.134 14.134 0 0 0 20.522 9.298 Q 20.335 7.959 19.875 6.875 A 5.36 5.36 0 0 0 17.647 4.349 A 6.969 6.969 0 0 0 17.15 4.075 A 7.641 7.641 0 0 0 15.614 3.52 Q 14.069 3.127 11.902 3.102 A 25.819 25.819 0 0 0 11.6 3.1 L 3 3.1 L 3 19.55 Z M 149.35 13.3 L 136.05 13.3 L 136.05 10.8 L 149.35 10.8 L 149.35 13.3 Z"
      vectorEffect="non-scaling-stroke" />
  </svg>

);

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AutoConnectProvider>
      <ReactQueryClientProvider>
        <WalletProvider>
          <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
          <WalletConnectionHandler>{children}</WalletConnectionHandler>
          </body>
          </html>
        </WalletProvider>
      </ReactQueryClientProvider>
    </AutoConnectProvider>
  );
};

export default function RootLayout({
                                     children
                                   }: {
  children: React.ReactNode;
}) {

  return (
    <AutoConnectProvider>
      <ReactQueryClientProvider>
        <WalletProvider>
          <html lang="en">
          <head>
            <title>Powerful</title>
            <link rel="shortcut icon" href="/images/favicon.ico" />
            <meta
              name="description"
              content="Powerful AI"
            />
            <meta
              property="og:title"
              content="Powerful"
            />
            <meta
              property="og:description"
              content="Powerful"
            />
            <meta property="og:image" content="/images/og-image.png" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content="Powerful"
            />
            <meta
              name="twitter:description"
              content="Powerful"
            />
            <meta name="twitter:image" content="/images/og-image.png" />
          </head>
          <body className={publicSans.className}>
          <WalletConnectionHandler>
            <MantineProvider>

              <NuqsAdapter>
                <div className="bg-secondary grid grid-rows-[auto,1fr] h-[100dvh]">
                  <div className="grid grid-cols-[1fr,auto] gap-2 p-4">
                    <div className="flex gap-4 flex-col md:flex-row md:items-center justify-between">
                      <a
                        href="https://github.com/yue1823/move-agent-kit/blob/main/README.md"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <Logo />

                      </a>
                      <nav className="flex gap-1 flex-col md:flex-row">
                        <Wallet />
                      </nav>
                    </div>
                  </div>
                  <div className="bg-background mx-4 relative grid rounded-t-2xl border border-input border-b-0">
                    <div className="absolute inset-0">{children}</div>
                  </div>
                </div>
                <Toaster />
              </NuqsAdapter>
            </MantineProvider>
          </WalletConnectionHandler>
          </body>
          </html>
        </WalletProvider>
      </ReactQueryClientProvider>
    </AutoConnectProvider>
  );
}
