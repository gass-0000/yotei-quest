# Architecture

## 永続データ
- 正式キー: `yoteiquest_data_v1`
- Schema: 1
- 旧キーは移行元および一時的なロールバック互換用

## ディレクトリ
- `css/`: 見た目
- `js/migration.js`: Schema・データ移行
- `js/storage.js`: 読み書き
- `js/backup.js`: 書き出し・復元・修復
- `js/sound.js`: サウンド基盤
- `js/animation.js`: 演出基盤
- `js/app.js`: 現在の画面・機能
- `assets/`: 画像・アイコン・将来の音源

## 原則
UIは自由に変更できる。データ形式変更時はmigration.jsへ移行処理を追加する。
