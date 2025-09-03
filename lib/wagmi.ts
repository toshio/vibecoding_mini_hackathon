import { type Connector, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Define a base set of connectors
const connectors: Connector[] = [
  injected(),
  coinbaseWallet({ appName: "File Authenticity Verification" }),
];

// Add WalletConnect only if a project ID is provided
if (projectId) {
  connectors.push(walletConnect({ projectId }));
}

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(),
  },
});