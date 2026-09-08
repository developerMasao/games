# games

Claude Code と一緒に作っているゲーム置き場。1作 = 1ディレクトリ、外部アセットなしの単一 HTML を基本にしている。

| 作品 | 内容 | 遊ぶ |
| --- | --- | --- |
| [agent64-facility](agent64-facility/) | GoldenEye 007 (N64) 風の潜入 FPS。1面完結。three.js、単一 HTML、外部アセットなし | [プレイ](https://developerMasao.github.io/games/agent64-facility/) |
| [jet-board-rush](jet-board-rush/) | ジェットボードで雪山を滑り抜けるオートスクロール横スクロールアクション。1プレイ85秒。スマホ（横向き）対応 | [プレイ](https://developerMasao.github.io/games/jet-board-rush/) |

## 遊び方（ローカル）

```
python3 -m http.server 8712
```

`http://localhost:8712/agent64-facility/` や `http://localhost:8712/jet-board-rush/` を開く。

## itch.io に出す

```
./build-itch.sh agent64-facility
```

`dist/<name>.zip` ができる（index.html が zip の直下に来る形）。itch.io の New project でこう設定する。

| 項目 | 値 |
| --- | --- |
| Kind of project | **HTML** |
| Uploads | zip をアップロードし **「This file will be played in the browser」にチェック** |
| Viewport dimensions | **960 x 600**（内部解像度 320x200 のちょうど3倍） |
| Fullscreen button | 有効にする |
| Mobile friendly | 無効（キーボード＋マウス前提。`jet-board-rush` は**有効**にする — タッチ操作対応） |

ストアページ用の文言と画像は `<game>/store/` に置いてある（`itch-store-page.md` に
全欄の入稿内容、カバー 630x500 とスクリーンショット 960x600）。zip には含まれない。

zip は index.html 1枚で完結している。テクスチャも音も手続き的に生成しているうえ、
three.js も `vendor/` からビルド時に埋め込まれるので、**外部リクエストはゼロ**。
CDN が塞がれた回線でもオフラインでも動く（検証済み: 読み込み時のリクエストは HTML 1件のみ）。

開発中の `agent64-facility/index.html` は CDN 参照のまま残してある（編集しやすさのため）。
埋め込みはビルド時にだけ行われ、ゲーム側のコードには一切手を触れない
（ビルド前後でスクリプトブロックの SHA が一致することを確認している）。

### vendor/

| ファイル | 用途 | ライセンス |
| --- | --- | --- |
| `three.r128.min.js` | 3D 描画。`agent64-facility` が参照している CDN と同一の r128 | MIT (Three.js Authors) |

ライセンスヘッダは最小化ファイルの先頭にあり、埋め込み後もそのまま残る。

## 方針

- **1作 = 1ディレクトリ。** 過去作のコードを次の作品で参照できるように、リポジトリは分けない
- **単一 HTML・外部アセットなし。** テクスチャも音も手続き的に生成する。ダウンロードして開けば動く
- 3D は three.js（CDN）
