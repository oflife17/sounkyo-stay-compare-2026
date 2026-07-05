# 層雲峡 宿比較サイト v1

このフォルダは GitHub Pages 用の静的サイト一式です。

## 中身

- `index.html`
- `styles.css`
- `app.js`
- `data/hotels.json`

## 更新方法

1. `data/hotels.json` の `snapshot.updatedAt` を更新
2. 各ホテルの `pricing` / `availability` / `sources` を更新
3. GitHub Pages 側へ再反映

## GitHub Pages 配備メモ

1. 公開用の GitHub リポジトリを用意する
2. このフォルダの中身をリポジトリ直下へ配置する
3. GitHub の `Settings > Pages` で `Deploy from a branch` を選ぶ
4. `main` ブランチの `/ (root)` を公開元に設定する

ZIP 配布用:

- `sounkyo_stay_compare_site_20260705_v1.zip` をそのまま展開して配置可能

## 補足

- `予約状況を更新` ボタンは、保存済み JSON の再読込です。
- GitHub Pages 単体では外部予約サイトの安定したライブ取得が難しいため、継続更新は手動前提です。
- 「朝日リゾート」は「朝陽リゾートホテル」として扱っています。
