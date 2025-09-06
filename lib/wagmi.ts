import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// The connectors array is now defined directly inside createConfig.
// A conditional spread `...(projectId ? [walletConnect(...)] : [])` is used
// to include WalletConnect only if a projectId is available.
// This approach allows TypeScript to correctly infer the union type of all possible connectors at once.
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "File Authenticity Verification" }),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
