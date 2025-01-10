"use client";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Slack Clone",
//   description: "A simple Slack clone built with Next.js",
// };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 1000 * 10, // 10 seconds
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark bg-gray-900 text-gray-100`}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
