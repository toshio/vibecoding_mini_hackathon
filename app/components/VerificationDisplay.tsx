"use client";

import { useReadContract } from 'wagmi';
import { abi } from '../abi/FileAuthenticityVerification.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

type VerificationDisplayProps = {
  hash: string | null;
  owner: string | null | undefined;
  isLoading: boolean;
  error: Error | null;
};

export default function VerificationDisplay({ hash, owner, isLoading, error }: VerificationDisplayProps) {
  if (!hash) {
    return null; // ハッシュがなければ何も表示しない
  }

  if (isLoading) {
    return <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center"><p>Loading owner information...</p></div>;
  }

  if (error) {
    return <div className="mt-6 p-4 bg-red-900 rounded-lg text-center"><p>Error loading data. Is the contract address correct?</p></div>;
  }

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
      <p className="text-gray-300">Verification Result:</p>
      {owner && owner !== '0x0000000000000000000000000000000000000000' ? (
        <div>
          <p>Owner Found:</p>
          <p className="text-lg font-mono break-all">{owner as string}</p>
        </div>
      ) : (
        <p>No record found for this file.</p>
      )}
    </div>
  );
}
