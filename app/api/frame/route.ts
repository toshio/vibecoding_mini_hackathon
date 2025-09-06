import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage } from '@coinbase/onchain-kit/frame';
import { createPublicClient, http, getAddress } from 'viem';
import { baseSepolia } from 'viem/chains';
import contractAbi from '../../abi/FileAuthenticityVerification.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;

// For production apps, it's recommended to use a dedicated RPC provider.
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(), // Uses a public RPC endpoint
});

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const NEXT_PUBLIC_HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000';
  const body = await req.json();

  const { message, isValid } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Invalid Frame message', { status: 400 });
  }

  const action = req.nextUrl.searchParams.get('action');

  if (action === 'verify') {
    const inputText = message.input || '';
    
    // Basic validation for a SHA-256 hash
    if (!inputText.startsWith('0x') || inputText.length !== 66) {
       return new NextResponse(`
         <!DOCTYPE html><html><head>
           <title>Invalid Hash</title>
           <meta property="og:title" content="Invalid Hash" />
           <meta property="fc:frame" content="vNext" />
           <meta property="fc:frame:image" content="${NEXT_PUBLIC_HOST_URL}/hero.png" />
           <meta property="fc:frame:button:1" content="無効なハッシュです。もう一度試す" />
           <meta property="fc:frame:post_url" content="${NEXT_PUBLIC_HOST_URL}/api/frame" />
         </head></html>`);
    }
    
    const hash = inputText as `0x${string}`;

    try {
      const owner = await publicClient.readContract({
        address: CONTRACT_ADDRESS!,
        abi: contractAbi.abi,
        functionName: 'getOwner',
        args: [hash],
      });

      if (owner && owner !== '0x0000000000000000000000000000000000000000') {
        // Hash is recorded
        return new NextResponse(`
          <!DOCTYPE html><html><head>
            <title>Hash Found</title>
            <meta property="og:title" content="Hash Found" />
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${NEXT_PUBLIC_HOST_URL}/screenshot.png" />
            <meta property="fc:frame:button:1" content="オーナー: ${getAddress(owner as string).slice(0, 10)}..." />
            <meta property="fc:frame:button:1:action" content="link" />
            <meta property="fc:frame:button:1:target" content="https://sepolia.basescan.org/address/${owner}" />
            <meta property="fc:frame:button:2" content="もう一度試す" />
            <meta property="fc:frame:post_url" content="${NEXT_PUBLIC_HOST_URL}/api/frame" />
          </head></html>`);
      } else {
        // Hash not found
        return new NextResponse(`
          <!DOCTYPE html><html><head>
            <title>Hash Not Found</title>
            <meta property="og:title" content="Hash Not Found" />
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${NEXT_PUBLIC_HOST_URL}/hero.png" />
            <meta property="fc:frame:button:1" content="このハッシュは記録されていません" />
            <meta property="fc:frame:button:2" content="もう一度試す" />
            <meta property="fc:frame:post_url" content="${NEXT_PUBLIC_HOST_URL}/api/frame" />
          </head></html>`);
      }
    } catch (err) {
      console.error(err);
      return new NextResponse('Error reading from contract', { status: 500 });
    }

  } else {
    // Initial state: request for input
    const buttonIndex = message.button;
    if (buttonIndex === 1) {
      return new NextResponse(`
        <!DOCTYPE html><html><head>
          <title>Enter Hash</title>
          <meta property="og:title" content="Enter Hash" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${NEXT_PUBLIC_HOST_URL}/screenshot.png" />
          <meta property="fc:frame:input:text" content="ここにファイルハッシュを入力..." />
          <meta property="fc:frame:button:1" content="このハッシュを検証" />
          <meta property="fc:frame:post_url" content="${NEXT_PUBLIC_HOST_URL}/api/frame?action=verify" />
        </head></html>`);
    }
    return new NextResponse('Invalid action', { status: 400 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
