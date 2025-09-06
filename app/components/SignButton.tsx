"use client";

import { useSignMessage, useWriteContract } from 'wagmi';
import contract from '../abi/FileAuthenticityVerification.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

type SignButtonProps = {
  hash: string | null;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
  status: 'enabled' | 'is_owner' | 'already_verified' | 'no_owner';
};

export default function SignButton({ hash, onSuccess, onError, status }: SignButtonProps) {
  const { signMessageAsync } = useSignMessage();
  const { writeContract, isPending } = useWriteContract();

  const handleSignAndRecord = async () => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.startsWith('0x000')) {
      onError('Contract address is not configured.');
      return;
    }
    if (!hash) {
      onError('Hash has not been calculated yet.');
      return;
    }

    try {
      const signature = await signMessageAsync({ message: { raw: hash as `0x${string}` } });

      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contract.abi,
        functionName: 'addSignature',
        args: [hash, signature],
      }, {
        onSuccess: (hash) => onSuccess(hash),
        onError: (error) => onError(error.message),
      });

    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('An unknown error occurred during the signing process.');
      }
    }
  };

  if (status === 'no_owner') {
    return null;
  }

  const isDisabled = status !== 'enabled' || !hash || isPending;

  const getButtonText = () => {
    if (isPending) return 'Signing...';
    switch (status) {
      case 'is_owner':
        return 'Owner Cannot Verify';
      case 'already_verified':
        return 'Already Verified';
      default:
        return 'Sign & Add as a Verifier';
    }
  };

  return (
    <button
      onClick={handleSignAndRecord}
      disabled={isDisabled}
      className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
    >
      {getButtonText()}
    </button>
  );
}
