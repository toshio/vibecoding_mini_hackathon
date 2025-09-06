import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./providers";

const NEXT_PUBLIC_HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "File Authenticity Verification on Base",
  description: "Your files, verified and secured on the blockchain.",
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${NEXT_PUBLIC_HOST_URL}/hero.png`,
    'fc:frame:post_url': `${NEXT_PUBLIC_HOST_URL}/api/frame`,
    'fc:frame:button:1': 'ハッシュ値を記録・検証',
    'fc:frame:button:2': '使い方',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${NEXT_PUBLIC_HOST_URL}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
