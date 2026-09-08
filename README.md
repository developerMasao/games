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

## 方針

- **1作 = 1ディレクトリ。** 過去作のコードを次の作品で参照できるように、リポジトリは分けない
- **単一 HTML・外部アセットなし。** テクスチャも音も手続き的に生成する。ダウンロードして開けば動く
- 3D は three.js（CDN）
