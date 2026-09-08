# itch.io ストアページ 入稿用

`Dashboard → Create new project` の各欄に、この内容をそのまま貼れば出せる。
画像はこのフォルダの `cover.png` / `01`〜`05` を使う。

---

## 1. 基本設定

| 欄 | 入れる値 |
| --- | --- |
| **Title** | `AGENT 64 — FACILITY` |
| **Project URL** | `agent64-facility` |
| **Classification** | Games |
| **Kind of project** | **HTML**（初期値は Downloadable。必ず変える） |
| **Release status** | Released |
| **Pricing** | No payments（`$0 or donate` にすると投げ銭も受けられる） |

### Short description / tagline

120字前後で listing に出る。日本語で出すなら:

```
夜の研究施設に一人で潜入し、資料を奪って脱出する。N64風の潜入FPS、1ミッション完結。
```

英語で出すなら:

```
Sneak into a research facility alone, take the documents, and get out alive. A one-mission stealth FPS in N64 style.
```

---

## 2. Uploads

`dist/agent64-facility.zip` を上げて、**「This file will be played in the browser」にチェック**。

### Embed options

| 欄 | 値 |
| --- | --- |
| Viewport dimensions | **960 × 600** |
| Fullscreen button | **有効** |
| Automatically start on page load | **無効**（クリックで開始。音声の自動再生制限に引っかからない） |
| Mobile friendly | **無効**（キーボード＋マウス前提） |

---

## 3. Description（本文）

そのまま貼る。itch.io のエディタは見出し・箇条書き・太字に対応している。

```
夜の研究施設。持ち出されたくない資料が、一番奥の保管庫にある。
こちらの装備は消音拳銃が一丁。応援は来ない。

通気配管を這って中に入り、見つからないように進み、資料を取って、生きて出る。
それだけのゲームです。1ミッションで完結します。


■ 潜入する

・警備兵は視界と音であなたを探します。背中には死角があり、暗がりでは見つかりにくい
・見つかり方には段階があります。気配 → 不審 → 捜索 → 交戦。
　完全にバレる前なら、隠れて仕切り直せます
・倒した兵を見つけられると、そこから警戒が広がります
・無線兵を先に潰しておくと、増援が来るのが遅くなります


■ 出口は二つある

資料を取った瞬間、施設が起きます。ここで選択があります。

・南の門 ── 近い。ただし増援が入ってくるのもそこ
・来た配管 ── 遠く、這うので遅い。でも誰もいない

どちらで帰るかは、資料を取る前から考えておいたほうがいい。


■ 操作

WASD      移動
マウス     視点
左クリック  射撃 ／ 右クリック  構える
Shift     走る
C         しゃがむ（配管はしゃがまないと入れません）
E         調べる・拾う
R         リロード
1〜5      武器切替
TAB       目標を確認
G         画質切替（低解像度のN64風 ⇔ 等倍）

P を押すと CPU が勝手に潜入します。眺めるだけでも。


■ 中身について

HTML ファイル1枚で動いています。
テクスチャも効果音も音楽も、読み込むのではなくその場で生成しているので、
画像ファイルも音声ファイルも一枚も入っていません。

3D描画: three.js (MIT)
```

### 英語版 Description

```
A research facility at night. The documents nobody wants leaked are in the vault at its centre.
You have one silenced pistol. Nobody is coming to help.

Crawl in through a service duct, move without being seen, take the documents, get out alive.
That is the whole game. One mission, start to finish.


■ SNEAKING

- Guards hunt you by sight and sound. They have a blind spot behind them, and poor eyes in the dark
- Being noticed happens in stages: a hint, then suspicion, then a search, then a firefight.
  Before the last one, you can still break line of sight and start over
- If a body is found, the alert spreads from there
- Take out the radiomen first and reinforcements arrive slower


■ TWO WAYS OUT

Taking the documents wakes the facility. That is where the choice is.

- The south gate — close, but it is where reinforcements come in
- The duct you entered by — far, and slow because you crawl, but nobody is there

Worth deciding before you grab them, not after.


■ CONTROLS

WASD           move
Mouse          look
Left click     fire / Right click  aim
Shift          sprint
C              crouch (ducts need it)
E              use / pick up
R              reload
1-5            weapons
TAB            objectives
G              video quality (low-res N64 look <-> native)

Press P and the CPU plays the mission by itself.


■ UNDER THE HOOD

One HTML file. Every texture, sound effect and piece of music is generated at
runtime rather than loaded, so there is not a single image or audio file in the build.

3D: three.js (MIT)
```

---

## 4. 分類タグ

| 欄 | 値 |
| --- | --- |
| **Genre** | Shooter |
| **Tags**（10個まで） | `stealth` `fps` `first-person` `retro` `low-poly` `n64` `spy` `singleplayer` `3d` `shooter` |
| Custom noun | 空欄でよい（"game" と表示される） |
| Community | Comments |

### More information（任意欄）

| 欄 | 値 |
| --- | --- |
| Made with | three.js |
| Average session | A few minutes |
| Inputs | Keyboard, Mouse |
| Languages | Japanese（英語版本文を使うなら English も） |
| Multiplayer | なし（未チェック） |

---

## 5. 画像

| 欄 | ファイル | サイズ |
| --- | --- | --- |
| **Cover image**（必須） | `cover.png` | 630 × 500 |
| Cover image（別案・夜の敷地） | `cover-alt.png` | 630 × 500 |
| Screenshots | `01-canteen.png` … `05-washroom.png` | 960 × 600 |

スクリーンショットの並び順は 01→05 が意図した流れ。

| ファイル | 何の画 |
| --- | --- |
| `01-canteen.png` | 食堂。奥に巡回中の警備兵。手前は消音拳銃 |
| `02-vault-door.png` | 保管庫の施錠扉。開けるには隊長のカードが要る |
| `03-security.png` | 東の警備室。カードを持つ隊長がいる |
| `04-yard.png` | 屋外の敷地。脱出口はこちら側 |
| `05-washroom.png` | 開始地点の手洗い。黄色い枠が這って出てきた通気口 |

いずれも実際のゲーム画面をそのまま書き出したもの（加工なし、カバーの文字だけ後乗せ）。

---

## 6. 公開

保存した時点では **Draft**。`Visibility & access` を **Public** にして初めて公開される。
公開前に `View page` でブラウザ実行を確認しておくとよい。
