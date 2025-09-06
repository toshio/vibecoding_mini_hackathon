import contract from './FileAuthenticityVerification.json';

/**
 * This file acts as a provider for the contract ABI.
 * It imports the JSON ABI and re-exports it as a new array literal with `as const`.
 * The spread syntax `[...contract.abi]` is the key to creating a new literal
 * that `as const` can be applied to.
 * This allows TypeScript to correctly infer the types for wagmi's hooks,
 * without needing to modify the original JSON file which is a build artifact.
 */
export const fileAuthenticityVerificationAbi = [...contract.abi] as const;
