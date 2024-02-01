import { errorFrame, parseFrameRequest, getOwnerAddressFromFid, successFrame } from '@/app/lib/farcaster';
import { FrameRequest } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { airdropTo } from '@/app/lib/nft';
import { createOrFindEmbeddedWalletForFid } from '@/app/lib/embedded-wallet';

export async function POST(req: NextRequest): Promise<Response> {
    let frameRequest: FrameRequest | undefined;

    // Parse and validate request from Frame for fid
    try {
        frameRequest = await req.json();
        if (!frameRequest) throw new Error('Could not deserialize request from frame');
    } catch {
        return new NextResponse(errorFrame);
    }
    const {fid, isValid} = await parseFrameRequest(frameRequest);
    if (!fid || !isValid) return new NextResponse(errorFrame);

    // Query FC Registry contract to get owner address from fid
    const ownerAddress = await getOwnerAddressFromFid(fid);
    if (!ownerAddress) return new NextResponse(errorFrame);

    // Generate an embedded wallet associated with the fid
    const embeddedWalletAddress = await createOrFindEmbeddedWalletForFid(fid, ownerAddress);
    if (!embeddedWalletAddress) return new NextResponse(errorFrame);
    
    // Airdrop NFT to the user's wallet
    const tx = await airdropTo(embeddedWalletAddress);
    if (!tx) return new NextResponse(errorFrame);

    return new NextResponse(successFrame);
}

export const dynamic = 'force-dynamic';