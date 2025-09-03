import pkg from 'hardhat';
const { ethers } = pkg;

import dotenv from "dotenv";

// .envファイルから環境変数を読み込む
dotenv.config({ path: '../.env' });

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("\n❌ Error: コントラクトアドレスが見つかりません。");
    console.error("hardhat/.env ファイルに NEXT_PUBLIC_CONTRACT_ADDRESS を設定してください。\n");
    process.exit(1);
  }

  console.log(`\n🔎 Checking contract at address: ${contractAddress}`);

  try {
    const contract = await ethers.getContractAt("FileAuthenticityVerification", contractAddress);
    
    console.log("Contract interface loaded. Attempting to call 'getSigners'...");

    // チェック用のダミーハッシュを使用します
    const dummyHash = ethers.ZeroHash;
    
    // staticCallを使い、ガス代を消費せずに読み取り専用の呼び出しを実行します
    await contract.getSigners.staticCall(dummyHash);

    console.log("\n✅ SUCCESS: コントラクト上で 'getSigners' 関数が見つかりました。");
    console.log("   これにより、正しいバージョンのコントラクトがデプロイされていることが確認できました。");
    console.log("\n   フロントエンドのエラーは、キャッシュの問題である可能性が高いです。以下をお試しください：");
    console.log("   1. 'npm run dev' で実行している開発サーバーを一度完全に停止する");
    console.log("   2. 再度 'npm run dev' で起動する");
    console.log("   3. ブラウザでスーパーリロード（Ctrl+Shift+R または Cmd+Shift+R）を実行する");

  } catch (error: any) {
    console.error("\n❌ FAILURE: 'getSigners' 関数の呼び出しに失敗しました。");

    if (error.message.includes("call revert exception")) {
      console.error("   Reason: コントラクト上に 'getSigners' 関数が存在しません。これは古いバージョンのコードがデプロイされていることを示します。");
      console.error("   Action: 最新のコードがコンパイルされ、正しくデプロイされているか再度ご確認ください。");
    } else {
      console.error("   An unexpected error occurred. Details:", error.message);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
