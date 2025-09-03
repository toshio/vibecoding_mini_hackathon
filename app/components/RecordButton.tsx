"use client";

import { useWriteContract } from 'wagmi';
import contract from '../abi/FileAuthenticityVerification.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

type RecordButtonProps = {
  hash: string | null;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
};

export default function RecordButton({ hash, onSuccess, onError }: RecordButtonProps) {
  const { writeContract, isPending } = useWriteContract();

  const handleRecord = async () => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.startsWith('0x000')) {
      onError('Contract address is not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local');
      return;
    }

    if (!hash) {
      onError('Hash has not been calculated yet.');
      return;
    }

    writeContract({
      address: `0x${CONTRACT_ADDRESS.substring(2)}`,
      abi: contract.abi,
      functionName: 'storeHash',
      args: [hash],
    }, {
      onSuccess: (hash) => onSuccess(hash),
      onError: (error) => onError(error.message),
    });
  };

  return (
    <button
      onClick={handleRecord}
      disabled={!hash || isPending}
      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
    >
      {isPending ? 'Recording...' : 'Record Hash on Blockchain'}
    </button>
  );
}
