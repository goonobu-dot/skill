# DeNA AI 深掘りリサーチ

**調査日**: 2026-07-22  
**対象**: 株式会社ディー・エヌ・エー（DeNA）のAI戦略・社内導入・対外事業・イベント・X上の議論  
**目的**: 自社アイデアへの転用・活用のヒント抽出  
**方針**: 一次情報（公式プレス、IR、Engineering Blog、フルスイング、dena.ai）を優先。二次情報は補助。

---

## 1. 結論サマリー（先に読む用）

DeNAのAIは「ツール導入」ではなく、**組織OSの書き換え**として設計されている。

| レイヤー | 中身 |
|---|---|
| 経営 | 2025/2「AIオールイン」宣言 → 2026/6 南場智子が社長兼CEO復帰（15年ぶり）で実行加速 |
| 測定 | **DARS**（個人・組織のAI習熟度を5段階可視化。人事評価には直結させない） |
| 現場浸透 | **AI活用100本ノック**（社内事例をXで毎日公開→PDF無料公開） |
| 社内基盤 | **SAI**（Difyベース全社LLM）、**Devin Enterprise**（2,000人超）、Claude Code / Cursor / Gemini / NotebookLM 等の併用 |
| 対外事業 | 子会社 **DeNA AI Link**（コンサル・Devin日本展開・**リーダーズAI**） |
| 既存事業強化 | ゲーム開発エコシステム、ベイスターズ「投手AI」、ヘルスケア生成AI、ライブ（Pococha/IRIAM） |
| 発信 | **DeNA × AI Day**、YouTube「事業家のDNA」、Engineering Blog、フルスイング |

**アイデア転用の核心**: DeNAが強いのは単一のAI製品より、**(1) トップが資源配分を言い切る (2) 測定指標 (3) 現場事例の強制可視化 (4) 自社で殴ってから外販** という一連のオペレーティングシステム。

---

## 2. 戦略の骨格

### 2.1 「AIオールイン」三本柱

統合報告書・公式発信で繰り返し語られる三視点:

1. **AIによる全社生産性向上**
2. **AIによる既存事業の競争力強化**
3. **AI新規事業の創出・グロース**

推進組織: **AIイノベーション事業本部** と **IT本部**。AIエキスパートチームが各部門に入り込む形。

出典:
- [統合報告書 2025](https://asset.dena.com/files/jp/ir/pdf/report/00_2025_v2.pdf)
- [dena.ai](https://dena.ai/)

### 2.2 南場ビジョン（人員再配置）

- 現業に携わる人員をAIで半減し、浮いた人材をAI新規事業へシフトする、という方針を公言。
- 1年後の自己評価（AI Day 2026クロージング / ITmedia）: **効率化は進んだが、浮いた時間が既存の「やり残し仕事」に吸い込まれ、新規事業シフトは想定より遅い**。
- 対策として「人を先に動かす」（配置転換・マネジャー評価に人材輩出を組み込む等）を強調。

出典:
- [フルスイング AI Day 2026レポート](https://fullswing.dena.com/archives/100191/)
- [ITmedia: AIオールインから1年](https://www.itmedia.co.jp/aiplus/article/2603/09/1260309087/)
- [南場スピーチ書き起こし](https://fullswing.dena.com/archives/100189/)

### 2.3 2026年の経営転換

- 2026年5月発表、**2026年6月27日付で南場智子が社長兼CEO復帰**（岡村信悟は会長へ）。
- 動機の公的ナラティブ: AIで生産性は上がったが「稼ぐ力」への転換・資源再配分を創業者自らが加速させる。

出典:
- [日経: 南場会長の社長復帰](https://www.nikkei.com/article/DGXZQOUC128MC0S6A510C2000000/)
- [ITmedia: 背水の社長復帰](https://www.itmedia.co.jp/business/articles/2605/12/news145.html)

---

## 3. タイムライン（主要イベント）

| 時期 | 出来事 | 出典 |
|---|---|---|
| 〜2024 | ゲーム×ML（オセロニアGAN、シミュレータ基盤）、ヘルスケアデータ、アルム医療系 | Engineering Blog / プレス |
| 2024/7頃 | 社内LLM基盤 **SAI**（Difyバックエンド）全社リリース方向 | [Engineering: Dify運用](https://engineering.dena.com/blog/2024/10/dify-operation/) |
| 2024/6 | アルムがSIP採択、医療・ヘルスケア生成AIエコシステム開始 | [プレス](https://dena.com/jp/news/5116/) |
| 2025/2/5 | **DeNA × AI Day \|\| TechCon 2025** で「AIオールイン」宣言 | DARSプレス内記載 |
| 2025/2頃 | Devin社内利用開始（後の公式発表で言及） | Cognition提携プレス |
| 2025/4 | **DeNA AI Link** 設立（100%子会社） | [プレス](https://dena.com/jp/news/5247/) |
| 2025/7 | Cognition AI と戦略提携、**Devin日本展開**をAI Linkが支援 | [国際プレス](https://dena.com/intl/news/4755/) |
| 2025/7頃 | 特定健診受診確率予測AI（データホライゾン×DeSC） | [プレス](https://dena.com/jp/news/5268/) |
| 2025/8 | **DARS** 導入発表 | [プレス](https://dena.com/jp/news/5279/) |
| 2025通年 | Xで **AI活用100本ノック** 連載 → 12月頃PDF公開 | [フルスイング振り返り](https://fullswing.dena.com/archives/100181/) / [PDF](https://fullswing.dena.com/pdf/AI_100tips_slide.pdf) |
| 2026/1 | リーダーズAI（THA協業）春提供予定を発表 | [プレス](https://dena.com/jp/news/5320/) |
| 2026/3/4 | Devin Enterprise **全社導入**（2,000人超）発表 | [プレス](https://dena.com/jp/news/5356/) |
| 2026/3/6 | **DeNA × AI Day 2026「Proof.」**（渋谷ヒカリエ、1,000名超） | [公式](https://dena.ai/ai-day-2026/) |
| 2026/3/19頃 | ワンダリア横浜開業（アプリ開発にDevin / On-Device AI） | AI Day / Devinプレス |
| 2026/4/21 | **リーダーズAI正式提供**、第一三共ヘルスケアが初導入 | [プレス](https://dena.com/jp/news/5378/) |
| 2026/5 | 決算で南場社長復帰発表 | 日経 / ITmedia |
| 2026/6/27 | 南場社長兼CEO就任 | 同上 |
| 2026/6〜7 | Engineering BlogでDevinプロンプト育成ループ、Claude Code、100本ノック第二弾など継続発信 | [dena.ai](https://dena.ai/) |

---

## 4. 対外AI事業（他社への売り込み）

### 4.1 DeNA AI Link（子会社）

**役割**（公式定義）:
- 日本企業向けAIコンサルティング
- カスタムソリューション / AIエージェント共同開発
- 海外AIツールの日本展開サポート

サイト: https://dena-ailink.com/  
設立プレス: https://dena.com/jp/news/5247/

代表（プレス上）: 住吉 政一郎（AIイノベーション事業本部長と兼務の文脈）

### 4.2 リーダーズAI（旗艦プロダクト）

| 項目 | 内容 |
|---|---|
| 何をするか | 経営者・事業責任者・ベテラン等「組織が頼る人」の判断基準・理念をAI化し、Slack/Teams/Google Chatで24/365相談可能に |
| 技術基盤 | THAの「AI社長」（中小向け・50社超導入）をエンタープライズ向けに拡張 |
| 導入プロセス | 約3ヶ月ヒアリング・チューニング。マニュアル暗記ではなく「なぜそう考えるか」をインタビューで抽出 |
| 差別化 | 問い返し・深掘りで思考を育てる設計。チャンネル共有でブラックボックス化を防ぐ |
| 社内先行 | 「AI住吉」（住吉本部長の知見AI）。新規事業コンテスト壁打ち、採用見極めにも波及 |
| 外販初号 | **第一三共ヘルスケア** — 内田社長本人インタビューで「AI内田さん」構築 |
| 提供開始 | 2026年4月 |

出典: https://dena.com/jp/news/5378/ / https://dena-ailink.com/service/leaders-ai

### 4.3 Devin（Cognition）日本展開・導入支援

| 項目 | 内容 |
|---|---|
| パートナーシップ | 2025/7 Cognition AI × DeNA AI Link |
| 自社利用 | 2025/2頃から社内利用 → 約半年のα/β → 2026/3 全社（2,000人超）、VPC版・SSO |
| 外販メニュー | Enterprise導入支援、ガバナンス構築、コードマイグレーション等ソリューション、200名超向けハンズオン |
| 採用 | X上で FDE（Forward Deployed Engineer）募集の言及あり（二次） |

公表された自社成果例（プレス https://dena.com/jp/news/5356/ ）:
1. Perl→Go 資産管理APIモダナイズ: 想定半年 → **約1ヶ月（約6倍）**
2. ワンダリア横浜アプリ: マルチリポで iOS↔Android 移植、**開発速度約2倍**
3. オフショア検収: 日単位待機 → **分〜時間単位**、セキュリティ指摘の半数以上を先行検知
4. SSoT仕様書自動整備: 非エンジニアの仕様確認を一部 **1/10**、月間2,000時間相当の削減目標
5. Analytics Agent: 分析部で **3倍以上**の効率化
6. 営業の見積もり: コード直結で **約8倍**高速化

技術詳細ブログ: https://engineering.dena.com/blog/2025/09/aj-devin-enterprise/

### 4.4 Delight Ventures（VC / Venture Builder）

独立系VCだが、dena.aiのエコシステムに明示。AIスタートアップ投資・ベンチャービルダー・DelightX（米国起業家育成）など。AI Dayでも「少数でも勝てるチーム」セッション登壇。

https://www.delight-ventures.com/

### 4.5 ヘルスケア領域の対外AI

| 取組 | 内容 | 出典 |
|---|---|---|
| アルム × SIP | 医療・ヘルスケア生成AIエコシステム。Join / MySOS / Team 等に生成AI。文書作成支援・専門医相談等 | https://dena.com/jp/news/5116/ |
| 特定健診受診確率予測 | データホライゾン × DeSC。レセプト等で個人の受診確率予測→勧奨最適化 | https://dena.com/jp/news/5268/ |
| DeSC AI Agent | 自然言語でRWD分析。製薬医学会セミナー等で発表 | https://dena.com/jp/news/5415/ |
| 聖マリアンナ医科大 | 包括連携（2026/7言及） | DeNAニュース一覧 |

### 4.6 価格・売上への寄与（公開情報の限界）

- リーダーズAI・Devin支援の**公開価格表は未確認**。
- IR上は「AIをレバレッジした中長期成長」「コスト構造改革」は語られるが、**AI事業単体の売上セグメント開示は本調査時点で確認できず**（ギャップ）。

---

## 5. 社内AIシステム・導入実態

### 5.1 SAI（社内生成AI / LLM WEBプラットフォーム）

| 項目 | 内容 |
|---|---|
| 役割 | 全社員向けチャット、RAG、カスタムプロンプトアプリ |
| バックエンド | OSS系 **Dify**（API経由）。フロントは自前（Next.js + Go） |
| インフラ | Google Cloud（Cloud Run / Cloud SQL / Memorystore 等）、Terraform |
| 起源 | 2024新卒研修（8名有志）「日本一生成AIを活用する企業」ビジョンから |
| OSS | [DeNA/dify-google-cloud-terraform](https://github.com/DeNA/dify-google-cloud-terraform) |

出典: https://engineering.dena.com/blog/2024/10/dify-operation/

### 5.2 DARS（DeNA AI Readiness Score）

- 個人レベル（開発者 / 非開発者）× 組織レベル、各Lv1–5
- **人事評価には直結させない**（グレードの推奨要素・半期目標）
- 2025年度末までに全組織が組織Lv2到達を目標（一部例外除く）
- 補完施策: eラーニング、有志勉強会、学習ポータル整備

出典: https://dena.com/jp/news/5279/

### 5.3 ツールスタック（公開言及ベース）

頻繁に名前が出るもの:
- **Gemini / NotebookLM**（100本ノックの定番。南場関連コンテンツでも話題）
- **Claude / Claude Code**
- **Cursor / GitHub Copilot**
- **Devin Enterprise**
- **Dify / SAI**
- ゲーム向け内製: **Rinchan / Rinchan.Client / Leap**（Unity×AIエコシステム、Microsoft.Extensions.AI中核）

### 5.4 AI Workspace / CorpOps

- 社内情報RAG → エージェントによるワークフロー自動化（AI Day セッション）
- 情シス「使いまくる」事例集: https://engineering.dena.com/blog/2026/05/ai-use-cases-corpops/
- 申請代行エージェントのプロンプトを **毎週Devinが育てる**ループ（2026/6 Engineering発信、Cognition Japanも言及）

### 5.5 生産性の公表数字（要注記: 社内特定プロジェクト）

| 領域 | 数字 | 出典文脈 |
|---|---|---|
| 一部開発 | 生産性20倍 | 住吉氏インタビュー（ITmedia） |
| リーガル | 90%効率化 | 同上 / 南場発言 |
| 一部開発作業 | AIが95%代替 | 南場（AI Day後報道） |
| QA | 半員で同等品質の言及 | 住吉氏インタビュー |
| Devin事例 | 上記4章の6事例 | 公式プレス |

※「全社平均」ではなく**成功プロジェクトのピーク値**として読むのが安全。

---

## 6. 事業ドメイン別AI

### 6.1 ゲーム

- **逆転オセロニア**: GANで1万体キャラ生成、音声合成、超解像（過去の象徴事例）
- **シミュレータ基盤**: 対戦AI・バランス調整・QA副次効果をタイトル横断
- **LLM開発エコシステム（2026）**: Rinchan系でログ解析〜実機テストまでエージェント化
- **EDGE POKER**: 最強ポーカーAI（ヨコサワ密着動画あり）
- オンデバイス / エッジ対戦AIの技術発信（Docswell等）

### 6.2 スポーツ（横浜DeNAベイスターズ）

- **投手AI**: プロトタイプ→本格運用。育成・パフォーマンス（CV + ML）
- **需要予測 / 購買体験**: グッズ・飲食の廃棄ロス、発注、価格最適化
- AI Dayで両セッション登壇。Xでもファン層が「AI Dayで育成プログラムの話を聞いた」と引用

### 6.3 ライブコミュニティ

- **Pococha**: UX向上のためのAI活用（AI Day YELLOW STAGE）
- **IRIAM**: キャラ体験のML舞台裏（PdM登壇）

### 6.4 新規エンタメ施設

- **ワンダリア横浜**: On-Device AI、Devinによるアプリ開発、AI前提アーキテクチャ

### 6.5 ヘルスケア

- 上記4.5に加え、ヘルスビッグデータ研究の学会発表継続

---

## 7. イベント・YouTube・発信設計

### 7.1 DeNA × AI Day

| | 2025 | 2026 |
|---|---|---|
| 位置づけ | TechConと同日、「AIオールイン」宣言 | 「Proof.」— 1年の成果証明 |
| 会場 | （公式に同日開催記載） | 渋谷ヒカリエ、オフライン、1,000名超 |
| アーカイブ | — | [YouTube playlist](https://www.youtube.com/playlist?list=PLA4bt89i8SEG8n4GrGiuONIxYOWWAdKst) |
| サイト | — | https://dena.ai/ai-day-2026/ |

**2026メインセッション（抜粋）**:
1. ワンダリアアプリ開発  
2. QA新モデル  
3. ゲームLLMエコシステム  
4. AI Workspace Agent  
5. ベイスターズ投手AI  
6. ベイスターズ需要予測  
7. HR目標・評価  
8. HR採用・育成  
9. Devin変革と外販  
10. Delight Ventures組織論  
11. AI社長×リーダーズAI  
12. AIネイティブプロダクト開発  
13. 南場クロージング  

スライドは Docswell（DeNA_Tech）に公開。まとめ記事: https://fullswing.dena.com/archives/100191/

### 7.2 YouTube（ユーザーが「よく見る」対象と推定）

| チャンネル | 役割 |
|---|---|
| **【DeNA公式】事業家のDNA** | AI密着・南場対談・100本ノック第二弾・ポーカーAIなど。事業家向けだがAI実装のリアルが厚い |
| DeNA AI Day プレイリスト | 技術・事業セッションのアーカイブ |
| Engineering / 登壇動画 | Qiita Conference でのDevin登壇など外部イベント |

チャンネル: https://www.youtube.com/channel/UC01kcYpT2NKrrJWkC-h90YQ

### 7.3 発信の設計思想（観察）

1. **トップ宣言**（南場）で注意を取る  
2. **現場の泥臭い事例を毎日晒す**（100本ノック）  
3. **数字付きケースを年次イベントで証明**（AI Day）  
4. **エンジニアブログで再現可能な実装を出す**（Dify Terraform、Devin Enterprise）  
5. **自社運用の実績を外販の信頼に変換**（AI Link）

これが「YouTubeを見るとAIの使い方が進んでいる」と感じる構造の正体。

---

## 8. X（Twitter）上の議論（2026/7時点スナップショット）

MCP `x_search`（browser）で取得した主なトーン:

| テーマ | 観測 |
|---|---|
| AI活用100本ノック | NotebookLMに入れて「専属コーチ化」する個人活用が流行。グラレコ・解説投稿が活発 |
| AIオールイン | 「効率化ではなく組織再設計」という解釈記事・スレッド |
| Devin | Cognition JapanがDeNAの「プロンプトを育てるDevin」事例を引用。2,000人導入が実績として流通 |
| 南場社長復帰 | 「AI全振り」「人材移動」としてIR・日経引用投稿 |
| FDE採用 | Devin日本展開の顧客伴走職としてDeNA言及 |
| ベイスターズ | AI Dayの投手育成話がファン議論に混ざる |

※Xは二次・三次情報が多い。**事実確認は公式プレスを正**とする。

代表的な公式発信ハブ:
- フルスイングX（100本ノック連載の主戦場だった）
- @DeNAxTech（Engineering）
- @DeNAPR

---

## 9. 組織マップ（公開情報ベース）

```
経営: 南場智子（社長兼CEO, 2026/6〜） / 岡村信悟（会長）
├── AIイノベーション事業本部（住吉政一郎）
│   ├── プロダクト開発統括
│   └── DeNA AI Link（外販: コンサル / Devin / リーダーズAI）
├── IT本部（金子俊一）— AI Day CoE的統括
│   ├── AI・データ戦略統括部（SAI, 投手AI, データ基盤）
│   ├── 品質管理部（QA×AI）
│   └── IT戦略部（AI Workspace / CorpOps）
├── ゲームサービス事業本部（Rinchan等）
├── ヘルスケア（アルム / DeSC / データホライゾン）
├── スポーツ（ベイスターズ）
└── Delight Ventures（投資・ビルダー、生態系）
```

---

## 10. アイデア転用ガイド（本リサーチの本命）

ユーザー目的: **DeNAのやり方を自分のアイデアに取り込む**。製品をコピーするより、以下のパターンを移植せよ。

### パターンA: 「自社で殴ってから売る」

DeNAはDevin・リーダーズAIとも **社内で痛みと数字を出してから外販**。  
→ 自分のAIアイデアも、まず自分の業務でKPIを1つ壊す → その再現手順を商品にする。

### パターンB: 「リーダーの脳のAPI化」

リーダーズAIの本質はRAG資料集めではなく、**インタビューで暗黙知を言語化し、問い返すAIにする**こと。  
→ 自分のドメインの「あの人に聞かないとわからない」を1人分AI化するだけでも強いプロトタイプになる。

### パターンC: 「100本ノック＝組織学習の公開」

完璧なガイドラインより、**毎日1事例を型（課題→解決→成果→ツール）で晒す**方が浸透する。  
→ 個人なら「30本ノック」、チームなら週次公開。NotebookLMに入れて検索可能ナレッジにする（X上で実際に流行）。

### パターンD: 「DARS的な自己採点」

Lv1 対話補完 → Lv2 IDE連携 → Lv3 エージェント委任 → Lv4 複数連携/CI組込 → Lv5 設計・展開  
→ 自分の現状レベルを決め、**次の1レベルだけ**週次で上げる。評価と切り離すと継続しやすい（DeNAも人事非連動）。

### パターンE: 「プロンプトを育てるメタエージェント」

申請エージェントの差し戻しを人が直さず、**週次でDevin/Claude Codeがプロンプトを改善**。  
→ 運用系AIは「初回精度」より「自己改善ループ」を設計に入れる。

### パターンF: 「AIが浮かせた時間の行き先を先に決める」

南場の反省: 効率化しても真面目な人は既存仕事を増やす。  
→ AI導入のKPIに **「新規に振り分ける時間/人数」** を先に置く。効率化％だけ追うと失敗する。

### パターンG: 「ドメイン特化エージェント」

投手AI、需要予測、ポーカーAI、ゲーム実機テストRPC——汎用Chatより **勝ち筋のある狭い問題**。  
→ 自分のアイデアも「業界横断プラットフォーム」より、まず1ドメインで深く。

### 今すぐ使える公式素材

1. [AI活用100本ノック PDF](https://fullswing.dena.com/pdf/AI_100tips_slide.pdf)  
2. [AI Day 2026 動画一覧](https://www.youtube.com/playlist?list=PLA4bt89i8SEG8n4GrGiuONIxYOWWAdKst)  
3. [Dify on GCP Terraform](https://github.com/DeNA/dify-google-cloud-terraform)  
4. [dena.ai ハブ](https://dena.ai/)  
5. [リーダーズAI](https://dena-ailink.com/service/leaders-ai)

---

## 11. ギャップ・未確認事項

1. AI事業の**売上・利益の単独開示**は未確認  
2. リーダーズAI・コンサルの**価格体系**は非公開  
3. OpenAI / Anthropic との**包括提携**の有無は、ツール利用言及はあるが公式包括契約は本調査で断定せず  
4. 自動車（過去のオートモーティブ）領域の現在のAI位置づけは薄い  
5. 特許・論文の網羅リストは未作成（必要なら追加調査）  
6. 「生産性20倍」等は**プロジェクト単位のピーク**であり全社平均ではない  
7. X情報はノイズが多く、採用・噂は要一次確認

---

## 12. 主要一次ソース一覧

| 種別 | URL |
|---|---|
| AIハブ | https://dena.ai/ |
| AI Day 2026 | https://dena.ai/ai-day-2026/ |
| AI Link | https://dena-ailink.com/ |
| リーダーズAI提供開始 | https://dena.com/jp/news/5378/ |
| Devin全社導入 | https://dena.com/jp/news/5356/ |
| DARS | https://dena.com/jp/news/5279/ |
| AI Link設立 | https://dena.com/jp/news/5247/ |
| 100本ノックPDF | https://fullswing.dena.com/pdf/AI_100tips_slide.pdf |
| 2025振り返り | https://fullswing.dena.com/archives/100181/ |
| AI Dayレポート | https://fullswing.dena.com/archives/100191/ |
| SAI/Dify | https://engineering.dena.com/blog/2024/10/dify-operation/ |
| 統合報告書 | https://asset.dena.com/files/jp/ir/pdf/report/00_2025_v2.pdf |
| YouTube 事業家のDNA | https://www.youtube.com/channel/UC01kcYpT2NKrrJWkC-h90YQ |

---

## 改訂履歴

- 2026-07-22: 初版。公式・フルスイング・Engineering・X（MCP）・並行エージェント調査を統合。
