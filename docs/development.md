# 開発ワークフロー

このドキュメントは、このプロジェクトにおける主要な開発ワークフローとベストプラクティスを記述します。

## スマートコントラクトとフロントエンドのABI同期

### 課題

フロントエンドのアプリケーション（`/app`）は、ブロックチェーン上のスマートコントラクトと通信するために、そのABI（Application Binary Interface）を必要とします。このABIは`app/abi/`にJSONファイルとして保存されています。

ABIの原本は、Hardhatがコンパイル時に生成する`hardhat/artifacts/`内のファイルです。手動でコピーする運用では、コピーを忘れたり、古いABIを参照し続けたりすることで、フロントエンドで`AbiFunctionNotFoundError`のようなエラーが発生する原因となります。

### 解決策

このプロセスを自動化し、エラーを防ぐために、プロジェクトルートの`package.json`に`predev`スクリプトを追加しました。

```json
"scripts": {
  "predev": "cp -p hardhat/artifacts/contracts/FileAuthenticityVerification.sol/FileAuthenticityVerification.json app/abi/ || true",
  "dev": "next dev",
  ...
}
```

#### 動作の仕組み

1.  このスクリプトは、`npm run dev`を実行するたびに自動的に実行されます。
2.  `hardhat`プロジェクトから最新のABIを`app`ディレクトリにコピーしようと試みます。
3.  `|| true`の部分により、`git clone`直後などでコピー元のファイルが存在しなくてもコマンドが失敗せず、開発サーバーの起動が妨げられることはありません。

### 推奨される開発フロー

1.  **コントラクトの修正:** `hardhat/contracts/`内の`.sol`ファイルを修正します。
2.  **コントラクトのコンパイル:** ターミナルで以下のコマンドを実行し、最新のABIを生成します。
    ```bash
    cd hardhat && npx hardhat compile && cd ..
    ```
3.  **フロントエンドの起動:** 開発サーバーを起動します。`predev`スクリプトが自動でABIをコピーします。
    ```bash
    npm run dev
    ```

このフローにより、フロントエンドは常に最新のコントラクトインターフェースを利用することが保証されます。
