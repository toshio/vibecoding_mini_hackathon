"use client";

type VerificationDisplayProps = {
  hash: string | null;
  owner: `0x${string}` | null | undefined;
  signers: readonly `0x${string}`[] | undefined;
  isLoading: boolean;
  isLoadingSigners: boolean;
  error: Error | null;
  errorSigners: Error | null;
};

export default function VerificationDisplay({ 
  hash, 
  owner, 
  signers, 
  isLoading, 
  isLoadingSigners, 
  error,
  errorSigners
}: VerificationDisplayProps) {
  if (!hash) {
    return null;
  }

  if (isLoading) {
    return <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center"><p>Loading owner information...</p></div>;
  }

  if (error) {
    return <div className="mt-6 p-4 bg-red-900 rounded-lg text-center"><p>Error loading data. Is the contract address correct?</p></div>;
  }

  return (
    <div className="mt-6 p-6 bg-gray-800 rounded-lg text-left space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-200">Verification Result</h3>
      {owner && owner !== '0x0000000000000000000000000000000000000000' ? (
        <div className='space-y-4'>
          <div>
            <p className="text-sm text-gray-400">Owner:</p>
            <p className="text-md font-mono break-all text-green-400">{owner}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Verifiers:</p>
            {isLoadingSigners && <p className='text-gray-400'>Loading verifiers...</p>}
            {errorSigners && <p className='text-red-400'>Error loading verifiers.</p>}
            {signers && signers.length > 0 ? (
              <ul className="list-disc list-inside bg-gray-900 p-3 rounded-md">
                {signers.map((verifier, index) => (
                  <li key={index} className="font-mono text-sm break-all text-cyan-400">{verifier}</li>
                ))}
              </ul>
            ) : (
              !isLoadingSigners && <p className='text-gray-500'>No verifiers yet.</p>
            )}
          </div>
        </div>
      ) : (
        <p className='text-center text-gray-400'>No record found for this file.</p>
      )}
    </div>
  );
}
