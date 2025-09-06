"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useAccount, useReadContract } from "wagmi";
import { fileAuthenticityVerificationAbi } from "./abi/provider";
import FileHasher from "./components/FileHasher";
import RecordButton from "./components/RecordButton";
import VerificationDisplay from "./components/VerificationDisplay";
import SignButton from "./components/SignButton";

const Header = dynamic(() => import('./components/Header'), { ssr: false });

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;

export default function Page() {
  const [calculatedHash, setCalculatedHash] = useState<`0x${string}` | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { address: connectedAddress } = useAccount();

  const { data: owner, isLoading: isOwnerLoading, error: ownerError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: fileAuthenticityVerificationAbi,
    functionName: 'getOwner',
    args: calculatedHash ? [calculatedHash] : undefined,
    query: {
      enabled: !!calculatedHash,
    },
  });

  const { data: signers, isLoading: isLoadingSigners, error: errorSigners } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: fileAuthenticityVerificationAbi,
    functionName: 'getSigners',
    args: calculatedHash ? [calculatedHash] : undefined,
    query: {
      enabled: !!calculatedHash && !!owner && owner !== '0x0000000000000000000000000000000000000000',
    },
  });

  useEffect(() => {
    if (errorSigners) {
      console.error("Detailed Verifier Error:", errorSigners);
    }
  }, [errorSigners]);

  const handleSuccess = (hash: string) => {
    setTxHash(hash);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTxHash(null);
  };

  const handleHashCalculated = (hash: `0x${string}`) => {
    setCalculatedHash(hash);
    setTxHash(null);
    setError(null);
  }

  const isOwnerFound = owner && owner !== '0x0000000000000000000000000000000000000000';
  const verifiers = signers as (`0x${string}`[]) | undefined;
  const hasUserSigned = verifiers?.some(verifier => verifier.toLowerCase() === connectedAddress?.toLowerCase());

  const isRecordButtonHidden = isOwnerFound;
  
  let signButtonState: 'enabled' | 'is_owner' | 'already_verified' | 'no_owner' = 'enabled';
  if (!isOwnerFound) {
    signButtonState = 'no_owner';
  } else if (owner === connectedAddress) {
    signButtonState = 'is_owner';
  } else if (hasUserSigned) {
    signButtonState = 'already_verified';
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
          <VerificationDisplay 
            hash={calculatedHash} 
            owner={owner as `0x${string}` | undefined} 
            signers={verifiers} 
            isLoading={isOwnerLoading} 
            isLoadingSigners={isLoadingSigners} 
            error={ownerError} 
            errorSigners={errorSigners} 
          />
          {!isRecordButtonHidden && (
            <RecordButton hash={calculatedHash} onSuccess={handleSuccess} onError={handleError} />
          )}
          <SignButton 
            hash={calculatedHash} 
            onSuccess={handleSuccess} 
            onError={handleError} 
            status={signButtonState}
          />
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