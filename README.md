# games

Claude Code と一緒に作っているゲーム置き場。1作 = 1ディレクトリ、外部アセットなしの単一 HTML を基本にしている。

| 作品 | 内容 | 遊ぶ |
| --- | --- | --- |
| [agent64-facility](agent64-facility/) | GoldenEye 007 (N64) 風の潜入 FPS。1面完結。three.js、単一 HTML、外部アセットなし | [プレイ](https://developerMasao.github.io/games/agent64-facility/) |

## 遊び方（ローカル）

```
python3 -m http.server 8712
```

`http://localhost:8712/agent64-facility/` を開く。

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
| Mobile friendly | 無効（キーボード＋マウス前提） |

zip は index.html 1枚で完結している（テクスチャも音も手続き的に生成）。
唯一の外部依存は three.js の CDN で、itch.io の iframe から問題なく読める。

## 方針

- **1作 = 1ディレクトリ。** 過去作のコードを次の作品で参照できるように、リポジトリは分けない
- **単一 HTML・外部アセットなし。** テクスチャも音も手続き的に生成する。ダウンロードして開けば動く
- 3D は three.js（CDN）
