# よていクエスト v1.0.0 Foundation

Phase1（土台）として、現在の正式版を機能維持したまま整理したリリースです。

## Phase1で行ったこと
- 保存キーを `yoteiquest_data_v1` に固定
- 旧 `yoteiQuestData` と各旧保存キーから自動移行
- Schema 1 と将来用データ領域を導入
- JSONバックアップ・復元・修復を維持
- HTML / CSS / JavaScript / 画像を分離
- サウンド・アニメーションの拡張基盤を追加
- GitHub Pages / PWA / iPhoneホーム画面対応を維持

## 更新方法
ZIP内の内容を、GitHubリポジトリのルートへアップロードしてください。
フォルダ構造を崩さず、`main`へコミットします。

## データ互換
同じGitHub Pages URLで更新する限り、旧版の記録を起動時に自動移行します。
更新前には設定画面からJSONバックアップを書き出してください。
