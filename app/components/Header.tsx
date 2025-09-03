"use client";

import {
  Avatar,
  Badge,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useDisconnect } from "wagmi";

export default function Header() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="w-full flex justify-end p-4">
      {isConnected ? (
        <div className="flex items-center gap-4 bg-gray-800 p-2 rounded-lg">
          <Identity address={address}>
            <Avatar />
            <Name />
            {/* Addressコンポーネントはボタンをネストさせる原因なので使用しない */}
            <EthBalance />
            <Badge />
          </Identity>
          <button
            onClick={() => disconnect()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <ConnectWallet />
      )}
    </header>
  );
}
