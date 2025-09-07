# File Authenticity Verification on Base - 開発タスクリスト

## フェーズ 1: プロジェクト基盤とスマートコントラクト開発

- [✅] 要件定義と設計書の作成・更新
- [✅] **スマートコントラクト開発環境のセットアップ**
  - [✅] 開発フレームワークの決定 (Hardhat)
  - [✅] プロジェクトの初期化と依存関係のインストール
- [✅] **スマートコントラクトの実装 (`FileAuthenticityVerification.sol`)**
  - [✅] 状態変数 (`records`, `signers`, `signerList`) の定義
  - [✅] イベント (`RecordStored`, `SignatureAdded`) の定義
  - [✅] `storeHash` 関数の実装
  - [✅] `addSignature` 関数の実装 (署名者リストへの追加含む)
  - [✅] `view`関数 (`getOwner`, `hasSigned`, `getSigners`) の実装
- [✅] **スマートコントラクトのテスト**
  - [✅] `storeHash` 関数の単体テスト作成
  - [✅] `addSignature` 関数の単体テスト作成
  - [✅] `getSigners` 関数の単体テスト作成
  - [✅] エッジケース（二重登録、二重署名など）のテスト作成
- [✅] **スマートコントラクトのデプロイ**
  - [✅] デプロイスクリプトの作成
  - [✅] Base Sepolia テストネットへのデプロイ
  - [✅] BasescanでのコントラクトVerify

## フェーズ 2: フロントエンド開発

- [✅] **フロントエンドの基本セットアップ**
  - [✅] `create-onchain --mini` のひな形を確認し、不要なファイルを整理
  - [✅] OnchainKitプロバイダー (`providers.tsx`) の設定
  - [✅] 全体的なレイアウトコンポーネント (`layout.tsx`) の作成
- [✅] **コアUIコンポーネントの実装**
  - [✅] OnchainKitを使用したウォレット接続機能 (`ConnectWallet`ボタン) の実装
  - [✅] ファイルアップロードとクライアントサイドでのハッシュ計算機能 (`FileUpload`コンポーネント) の実装
- [✅] **ファイル記録機能の実装**
  - [✅] `FileUpload`コンポーネントをメインページに配置
  - [✅] `storeHash`関数を呼び出す`RecordButton`コンポーネントの実装
  - [✅] トランザクションの状態（待機中、成功、失敗）に応じたUIフィードバックの実装
- [✅] **検証＆第三者署名機能の実装**
  - [✅] 検証用の`FileUpload`コンポーネントをメインページに配置
  - [✅] `getOwner`や`hasSigned`を呼び出し、検証結果を表示するUIの実装
  - [✅] `getSigners`を呼び出し、署名者一覧を表示するUIの実装
  - [✅] `addSignature`関数を呼び出す`SignButton`コンポーネントの実装
  - [✅] 検証・署名アクションに対するUIフィードバックの実装
- [✅] **UI/UXの磨き込み**
  - [✅] Tailwind CSS を用いたスタイリングの適用
  - [⬜] レスポンシブデザインへの対応
  - [⬜] トースト通知などを活用したユーザー体験の向上

## フェーズ 3: 統合テストと最終デプロイ

- [⬜] **総合テスト**
  - [⬜] 全体のユーザーフローを通したE2Eテストの実施
- [✅] **フロントエンドのデプロイ**
  - [✅] Vercelへの最終版アプリケーションのデプロイ

## フェーズ 4: Farcaster Frame対応

- [✅] **Farcaster Frameの基本設定**
  - [✅] `app/page.tsx` の `<head>` にFarcaster Frame用の `meta` タグを追加する
    - `fc:frame`: `vNext`
    - `fc:frame:image`: アプリケーションの初期状態を示す画像のURL
    - `fc:frame:post_url`: ボタンクリック時にPOSTリクエストを送信するAPIエンドポイントのURL
    - `fc:frame:button:1`: 最初のボタンのラベル
  - [⬜] Frameの初期画像を最終版に差し替える
- [✅] **Frame処理用APIエンドポイントの作成**
  - [✅] `app/api/frame/route.ts` のようなAPIルートを作成する
  - [✅] FarcasterからのPOSTリクエストを処理するロジックを実装する
- [✅] **Farcasterメッセージの検証**
  - [✅] Farcasterからのリクエストボディに含まれる `trustedData` を検証するライブラリを導入する (例: `onchain-kit`)
  - [✅] APIルート内でメッセージの署名を検証し、リクエストが正当なものであることを確認する
- [✅] **Frameインタラクションの実装**
  - [✅] 初期Frameからハッシュ値入力Frameへの遷移を実装
  - [✅] 入力されたハッシュ値をコントラクトで検証し、結果をFrameに表示するロジックを実装
  - [⬜] 検証結果から、さらに署名者一覧を表示するなどの追加インタラクションを実装
- [⬜] **環境変数とデプロイ設定**
  - [⬜] `.env.sample` にFrame対応に必要な環境変数を追記する
    - `NEXT_PUBLIC_URL`: デプロイしたアプリケーションの公開URL
  - [⬜] アプリケーションをVercelなどのホスティングサービスにデプロイし、公開URLを取得する
- [⬜] **テストとデバッグ**
  - [⬜] `ngrok` を使用してローカル環境でFrameの動作をテストする
  - [⬜] WarpcastのFrame Validatorなどのツールで `meta` タグが正しく設定されているか検証する
- [⬜] **Farcasterでのキャスト**
  - [⬜] Farcasterアカウントを取得する
  - [⬜] デプロイしたアプリケーションのURLを含んだキャストを投稿し、Frameが正しく表示・動作することを確認する
