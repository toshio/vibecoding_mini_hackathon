import { NextResponse } from 'next/server';

export async function GET() {
  const appName = process.env.NEXT_PUBLIC_PROJECT_NAME;
  const appDescription = 'Your files, verified and secured on the blockchain.';
  const appIcon = `${process.env.NEXT_PUBLIC_URL}/hero.png`;
  const fid = process.env.FARCASTER_FID;

  if (!fid || isNaN(parseInt(fid, 10))) {
    return new NextResponse('Missing or invalid FARCASTER_FID environment variable', { status: 500 });
  }

  return NextResponse.json({
    name: appName,
    description: appDescription,
    icon: appIcon,
    fids: [parseInt(fid, 10)],
  });
}
