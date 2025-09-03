"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { useReadContract } from "wagmi";
import contract from "./abi/FileAuthenticityVerification.json";
import FileHasher from "./components/FileHasher";
import RecordButton from "./components/RecordButton";
import VerificationDisplay from "./components/VerificationDisplay";
import SignButton from "./components/SignButton";

const Header = dynamic(() => import('./components/Header'), { ssr: false });

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Page() {
  const [calculatedHash, setCalculatedHash] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: owner, isLoading: isOwnerLoading, error: ownerError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}` | undefined,
    abi: contract.abi,
    functionName: 'getOwner',
    args: calculatedHash ? [calculatedHash] : undefined,
    query: {
      enabled: !!calculatedHash,
    },
  });

  const handleSuccess = (hash: string) => {
    setTxHash(hash);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTxHash(null);
  };

  const handleHashCalculated = (hash: string) => {
    setCalculatedHash(hash);
    setTxHash(null);
    setError(null);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 p-24">
        <h1 className="text-5xl font-bold mb-8">
          File Authenticity Verification on Base
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Your files, verified and secured on the blockchain.
        </p>
        
        <div className="w-full max-w-2xl">
          <FileHasher onHashCalculated={handleHashCalculated} />
          {calculatedHash && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
              <p className="text-gray-300">Calculated SHA-256 Hash:</p>
              <p className="text-lg font-mono break-all">{calculatedHash}</p>
            </div>
          )}
          <VerificationDisplay hash={calculatedHash} owner={owner as string | null | undefined} isLoading={isOwnerLoading} error={ownerError} />
          <RecordButton hash={calculatedHash} onSuccess={handleSuccess} onError={handleError} />
          <SignButton hash={calculatedHash} owner={owner as string | null | undefined} onSuccess={handleSuccess} onError={handleError} />
          {txHash && (
            <div className="mt-6 p-4 bg-green-900 rounded-lg text-center">
              <p className="text-green-300">Success! Transaction Hash:</p>
              <a 
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono break-all text-blue-400 hover:underline"
              >
                {txHash}
              </a>
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-900 rounded-lg text-center">
              <p className="text-red-300">Error:</p>
              <p className="text-sm font-mono break-all">{error}</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}