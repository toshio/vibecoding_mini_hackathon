"use client";

import { useSignMessage, useWriteContract } from 'wagmi';
import contract from '../abi/FileAuthenticityVerification.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

type SignButtonProps = {
  hash: string | null;
  owner: string | null | undefined;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
};

export default function SignButton({ hash, owner, onSuccess, onError }: SignButtonProps) {
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
      const signature = await signMessageAsync({ message: hash });

      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contract.abi,
        functionName: 'addSignature',
        args: [hash, signature],
      }, {
        onSuccess: (hash) => onSuccess(hash),
        onError: (error) => onError(error.message),
      });

    } catch (error: any) {
      onError(error.message || 'Failed to sign message.');
    }
  };

  // 記録が存在しない場合はボタンを表示しない
  if (!owner || owner === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  return (
    <button
      onClick={handleSignAndRecord}
      disabled={!hash || isPending}
      className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
    >
      {isPending ? 'Signing...' : 'Sign & Add as a Verifier'}
    </button>
  );
}
