import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
import '@coinbase/onchainkit/styles.css';
import { Providers } from './providers';

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL!;

export const metadata: Metadata = {
  title: 'File Authenticity Verification on Base',
  description: 'Your files, verified and secured on the blockchain.',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${PUBLIC_URL}/hero.png`,
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Launch App',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': PUBLIC_URL,
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
