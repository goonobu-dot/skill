# DeNA (株式会社ディー・エヌ・エー) Internal AI Adoption — Deep Research Report

**As of:** July 2026  
**Scope:** Internal LLM platforms, developer productivity AI, game/ops/healthcare/sports AI, democratization programs, org structure, patents/papers/OSS  
**Method:** Primary sources only (engineering blog, official press/IR, CTO/engineer talks/slides, first-party GitHub). Secondary media used only to locate primaries; claims below cite primaries.

---

## Executive summary

DeNA’s public AI posture since **2025-02** (“AIオールイン”) is a three-pillar strategy: (1) company-wide productivity, (2) existing-business competitiveness, (3) AI-native new businesses. Internally this is operationalized through **in-house platforms (ChatAI, SAI, Findout/Ledge, DAAQ, Hekatoncheir)**, **enterprise third-party tools (Gemini, Claude, Cursor, GitHub Copilot, Devin Enterprise, etc.)**, **literacy/governance (AI Policy, manuals, AI Governance Committee, DARS)**, and **domain AI** in games, sports (BayStars), healthcare (Alm / Nippon Tect / DeSC), and live community (IRIAM / Pococha).

There is **no public entity branded “AI Center”**; the closest CoE structures are **IT本部 (CoE)**, **AI・データ戦略統括部**, **AIイノベーション事業本部**, and **DeNA AI Link**.

---

## 1. Internal LLM platforms, chatbots, copilots

| Named system | Role | Key dates | Primary sources |
|---|---|---|---|
| **ChatAI** (Developed by ITS) | Slack bot on Azure OpenAI; company ChatGPT; RAG InternalModel / ClosedModel | Jul 2023 introduce; Sep 2023 RAG; Nov 2023 company-wide literacy + rollout | [Docswell ITS talk](https://docswell.com/s/DeNA_Tech/K6YPLM-2024-02-29-090759); [eng blog ITS](https://engineering.dena.com/blog/2024/09/its-introduction/) |
| **SAI** | Company-wide Web LLM platform; Next.js+Go FE; Dify backend APIs; RAG/apps/templates; Azure OpenAI; GCP | Built May–Jul 2024 (new-grad project); company use from **2024-07**; eng write-up 2024-10 | [dify-operation](https://engineering.dena.com/blog/2024/10/dify-operation/); [Dify Meetup slides](https://www.docswell.com/s/DeNA_Tech/KN161P-2025-05-20-dify-meetup-tokyo); [AI Day SAI slides](https://convert.docswell.com/s/DeNA_Tech/KYDG4V-aiday-commodity-1530) |
| **Findout** | Slack-native IT/HR/GA helpdesk; AI first response then human ticket | AI helpdesk lineage from ChatAI; Findout rebuild ~2025; RAG accuracy **~50%→80% (2025-10)**; later **>90% with Ledge** | [replace-findout](https://engineering.dena.com/blog/2025/09/replace-findout-eng/); [findout-exg](https://engineering.dena.com/blog/2025/09/findout-exg/); [findoutai_rag](https://engineering.dena.com/blog/2025/10/findoutai_rag/); [Ledge](https://engineering.dena.com/blog/2026/04/ai-helpdesk-knowledge-ledge/) |
| **Ledge** | In-house knowledge-management tool feeding Findout RAG | Announced eng blog **2026-04**; claimed 80%→90%+ after ~2 months | [Ledge post](https://engineering.dena.com/blog/2026/04/ai-helpdesk-knowledge-ledge/) |
| **Rinchan** | Game-dev library Q&A chatbot (bottom-up) | AI Day talk; ≥15 library questions/month handled by AI | [Rinchan slides](https://image.docswell.com/s/DeNA_Tech/ZN1G67-aiday-commodity-1700) |
| **GitHub Copilot for Business** | Coding assistant | Banned Jun 2022 → review Feb 2023 → **company rollout Aug 2023** | [Docswell Copilot](https://docswell.com/s/2119490360/5ENVGN-2023-12-05-131500) |
| **Cursor Business** | AI IDE | Company-procured; used heavily in SRE/Pococha/etc. | [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/); [SRE AI](https://engineering.dena.com/blog/2026/03/sre-productivity-with-ai/) |
| **Gemini / Gemini Advanced / Gemini CLI / NotebookLM** | Workspace AI + coding CLI | IR: Gemini Advanced company-wide; MAU target 1,000; Gemini CLI announced company-OK day after release | [Integrated report 2025](https://asset.dena.com/files/jp/ir/pdf/report/00_2025_v2.pdf); [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/); [CSR tech](https://csr.dena.com/jp/technology/) |
| **Claude / Claude Code** | Chat + coding; API via Bedrock/Vertex | Listed in procurement catalog | [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/) |
| **ChatGPT** | General + API | Same | [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/) |
| **Devin Team → Devin Enterprise** | Autonomous AI software engineer | Use from **2025-02**; Cognition partnership **2025-07**; Enterprise eng write-up **2025-09**; **company-wide 2,000+** announced **2026-03-04**; 40+ teams | [Devin press](https://dena.com/jp/news/5356/); [aj-devin-enterprise](https://engineering.dena.com/blog/2025/09/aj-devin-enterprise/); [Devin customer page](https://devin.ai/ja/customers/dena) |
| **Devin Analytics Agent** | Analysis-specialized agent (SQL→viz) | Cited in 2026-03 Devin press (games analytics) | [Devin press](https://dena.com/jp/news/5356/) |
| **Atlassian Intelligence** | Jira/Confluence AI | Procurement catalog | [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/) |
| **Adobe Firefly** | Image gen (Creative Cloud) | Procurement catalog | [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/) |
| **リーダーズAI / AI住吉** | Leader-knowledge AI (product + internal pilot) | Planned 2026 spring; **GA 2026-04-21**; internal “AI住吉” before external GA | [leaders AI announce](https://dena.com/jp/news/5320/); [GA + AI住吉](https://dena.com/jp/news/5378/) |
| **PoCopilot** | Pococha Biz AI playground for prompts | Eng blog 2025-09 | [pococha-play-by-play](https://engineering.dena.com/blog/2025/09/pococha-play-by-play/) |
| **DeNA AI Workspaces** (構想) | Future “AI secretary” workspace | Named as vision by IT head Kaneko | [ai_journey_1](https://engineering.dena.com/blog/2025/08/ai_journey_1/) |

### SAI details (primary)

- Vision from new grads: “DeNA が日本で一番生成 AI を活用している企業になる！” ([dify-operation](https://engineering.dena.com/blog/2024/10/dify-operation/))
- Features: LLM chat, shared-doc RAG, templated apps, image/PDF input; FE in Next.js + Go; most features call Dify APIs ([same](https://engineering.dena.com/blog/2024/10/dify-operation/))
- Infra: GCP Cloud Run (sidecars), Cloud SQL (+pgvector), Memorystore Redis, GCS, Terraform, GitHub Actions; Azure OpenAI ([same](https://engineering.dena.com/blog/2024/10/dify-operation/))
- OSS: [`DeNA/dify-google-cloud-terraform`](https://github.com/DeNA/dify-google-cloud-terraform) (referenced from eng blog)
- Org attribution (2025 Meetup): 大泉壮汰 — IT本部 AI・データ戦略統括部 データ基盤部 ゲームエンタメグループ ([Meetup slides](https://www.docswell.com/s/DeNA_Tech/KN161P-2025-05-20-dify-meetup-tokyo))

### ChatAI → Findout metrics (primary)

- Helpdesk usefulness of ChatAI: **46%** of inquiries helped as of **2024-06** ([its-introduction](https://engineering.dena.com/blog/2024/09/its-introduction/)); earlier ITS talk cited ~25% ([Docswell](https://docswell.com/s/DeNA_Tech/K6YPLM-2024-02-29-090759))
- Findout RAG accuracy: ~50% → **80% by 2025-10** ([findoutai_rag](https://engineering.dena.com/blog/2025/10/findoutai_rag/)); later **90%+** after Ledge ([Ledge](https://engineering.dena.com/blog/2026/04/ai-helpdesk-knowledge-ledge/))

### Devin claimed internal outcomes (company press 2026-03-04)

- Perl→Go asset-management API migration: ~6 months estimate → ~1 month (~**6×**)
- Wonderia Yokohama app: multi-repo iOS/Android porting → ~**2×** speed
- Offshore acceptance: days → ~15 min input + ~2h review; security team findings half pre-caught
- Non-engineer spec checks via SSoT docs: up to **1/10** time (target 2,000 person-hours/month communication savings)
- Analytics: **≥3×** efficiency for all analysis members using Devin Analytics Agent
- Sales estimation from code: ~**8×** faster  
Source: [dena.com/jp/news/5356](https://dena.com/jp/news/5356/)

**Uncertainty:** Press ROI figures are company-reported; independent verification not found. Expansion of “SAI” acronym (Smart/Super AI) appears in secondary PDF analyses, not confirmed in DeNA eng posts (which use “SAI” without expansion).

---

## 2. AI for game development pipelines

| Use case | Named system / approach | Dates | Primary |
|---|---|---|---|
| Balance / matchmaking AI | RL + bandits for **逆転オセロニア**; simulator platform | CEDEC 2020 talk; eng 2020-09/11 | [cedec2020-othellonia-ai](https://engineering.dena.com/blog/2020/09/cedec2020-othellonia-ai/); [simulator platform](https://engineering.dena.com/blog/2020/11/implementation_of_simulator_platform/) |
| Top-level play / ops-game AI | Deep RL agent; **HandyRL** for distributed RL; edge inference | JSAI 2023 paper; CEDEC 2025 / AI Talks #5 (2026-01) | [JSAI PDF](https://www.jstage.jst.go.jp/article/pjsai/JSAI2023/0/JSAI2023_2Q4OS27b05/_pdf/-char/ja); [HandyRL](https://github.com/DeNA/HandyRL); [AI Talks #5](https://docswell.com/s/DeNA_Tech/5M6MDN-2026-01-26-131311) |
| Deck construction assist | Transformer-based deck proposal under constraints (Othellonia) | JSAI 2025 industrial session | [jsai2025](https://engineering.dena.com/blog/2025/06/jsai2025/) |
| Library support | **Rinchan** | AI Day | [Rinchan](https://image.docswell.com/s/DeNA_Tech/ZN1G67-aiday-commodity-1700) |
| QA / autopilot | **Anjin** (Unity autopilot OSS); **DAAQ** (QA AI tooling) | Anjin 2023 OSS; DAAQ strategy 2025-12 | [Anjin](https://github.com/dena/anjin); [DAAQ strategy](https://engineering.dena.com/blog/2025/12/dena-qa-ai-strategy/) |
| Coding / process | Cursor, Claude Code, Gemini CLI, PR-Agent, MCP; Pococha AI-driven development | 2025+ | [pococha-aidd](https://engineering.dena.com/blog/2025/07/pococha-aidd/); [denaaitalks2](https://engineering.dena.com/blog/2025/10/denaaitalks2/) |
| Product feature AI | Pococha AI play-by-play commentary; Biz-led prompts via PoCopilot | 2025-09 eng | [pococha-play-by-play](https://engineering.dena.com/blog/2025/09/pococha-play-by-play/) |
| NPC / LLM in shipped titles | GDC 2026 report discusses industry NPC/LLM patterns DeNA observed; **not** a DeNA shipping claim | 2026-06 | [gdc-report](https://engineering.dena.com/blog/2026/06/gdc-report/) |

**Localization / art (content generation):** No strong primary found describing a named DeNA localization-AI product or art-gen pipeline used in production. Adobe Firefly is company-procured for design ([ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/)). GDC roundtable notes show interest, not deployment proof.

**Uncertainty:** Exact title coverage of simulator platform beyond Othellonia not exhaustively listed in public sources. NPC-LLM production use inside DeNA titles remains unconfirmed.

---

## 3. AI in operations (CS, marketing, data, security)

### Customer / internal support
- **Findout + ChatAI + Ledge**: IT / 総務 / 人事 inquiries; AI-first Slack flow ([findout-exg](https://engineering.dena.com/blog/2025/09/findout-exg/))
- External **consumer CS automation** for end-users of Mobage/etc.: not found as a named public system in this pass

### Marketing / creative
- Southba (Namba) AI Day speech lists CS, SWE, marketing as early AI-impact domains ([fullswing transcript](https://fullswing.dena.com/archives/100153/))
- Marketing org discussed in secondary Web担当者Forum interview (DARS levels); treat as interview, not IR
- **Adobe Firefly**, Gemini Workspace for content/workflows ([ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/))

### Data analysis
- **Devin Analytics Agent** in game analytics org ([Devin press](https://dena.com/jp/news/5356/))
- BayStars goods demand prediction (LightGBM etc.) — see §5
- RecSys Challenge 2024 win reported at JSAI 2025 ([jsai2025](https://engineering.dena.com/blog/2025/06/jsai2025/))

### Security / governance ops
- **AIガバナンスコミッティ**: AI・データ戦略統括部, 法務, セキュリティ, IT戦略, コンプライアンスリスク統括室 ([ai_journey_2](https://engineering.dena.com/blog/2025/08/ai_journey_2/))
- Tool trial→production risk review; 「生成系AIサービス社内利用観点マニュアル」 v5+ ([same](https://engineering.dena.com/blog/2025/08/ai_journey_2/))
- Devin used for security review acceleration on offshore code ([Devin press](https://dena.com/jp/news/5356/))
- Infra SRE uses Devin/Cursor/Gemini for modernization ([sre-productivity-with-ai](https://engineering.dena.com/blog/2026/03/sre-productivity-with-ai/))

### Legal / QA ops
- Integrated report: AI reducing legal & QA cost/effort ([IR 2025](https://asset.dena.com/files/jp/ir/pdf/report/00_2025_v2.pdf))
- DAAQ for test design/execution + ethics/copy/guideline checks ([DAAQ](https://engineering.dena.com/blog/2025/12/dena-qa-ai-strategy/))

### HR
- AI Day 2026 sessions: AI×HR goal/eval cycle; hiring/training ([AI Day 2026](https://dena.ai/ai-day-2026/); [fullswing session list](https://fullswing.dena.com/archives/100191/))
- 「AI住吉」 used by HR for candidate evaluation prompts ([leaders AI](https://dena.com/jp/news/5378/))

---

## 4. Healthcare AI (products + internal)

| Offering | Owner | AI nature | Internal vs product | Primary |
|---|---|---|---|---|
| **Join** clinical form autofill research | Alm + DeNA (森) | LLM form filling from unstructured notes | Research toward Join product | [jsai2025](https://engineering.dena.com/blog/2025/06/jsai2025/) |
| **SIP genAI healthcare ecosystem** | Alm (representative) | GenAI for clinical consult / care ecosystem | Product / national project | [news/5116](https://dena.com/jp/news/5116/) |
| **ONSEI / ONSEI Pro** | Nippon Tect Systems | Voice AI cognitive self-check | Product (Apr 2026 Pro) | [ONSEI Pro](https://dena.com/jp/news/5376/) |
| **KENNOライフアシスト** | Nippon Tect; on MySOS (Alm) | GenAI lifestyle advice for cognition | Product (β on MySOS) | [news/5161](https://dena.com/jp/news/5161/) |
| **拡大推計機能** patent | DeSC × MDV | Statistical expansion estimation (not generative LLM) | Product analytics + **JP patent 7653474** | [news/5246](https://dena.com/jp/news/5246/) |
| Healthcare eng AI culture | Healthcare dept interview | Devin as team knowledge; WG for AI culture | Internal | [fostering-ai-culture](https://engineering.dena.com/blog/2026/03/fostering-ai-culture/) |

**Uncertainty:** Degree to which Join genAI features are already live in production vs research/SIP roadmap not fully specified publicly.

---

## 5. Sports AI (Yokohama DeNA BayStars)

| System | Use | Timeline | Primary |
|---|---|---|---|
| Catcher ability AI | Quantify catcher skills | “数年前から” field use | [AI Day slides](https://docswell.com/s/DeNA_Tech/KL3XRD-2026-03-11-100936); [engineer type interview](https://type.jp/et/feature/30681/) |
| **投手AI / コマンドスコア** | CV: mitt target vs pitch location; 1軍距離 visualization; web system; daily reports; 育成カルテ | Prototype **2024**; production spring **2025** | Same slides + [Advertimes](https://www.advertimes.com/20260326/article538639/) reporting AI Day |
| Batter AI metrics | Motion analysis prototypes | Field proto from **2025-07** | Same |
| Goods demand forecast | LightGBM; features: product attrs, remaining games, recent EC/store sales, tickets | Project presented AI Day 2026; training data 2023–2024 | [demand slides](https://docswell.com/s/DeNA_Tech/57NYDJ-2026-03-11-134929); [dena.ai AI Day](https://dena.ai/ai-day-2026/) |
| App **AI解説** | Fan-facing AI commentary in club app | Fullswing 2025 retrospection: Aug 2025; also MyNavi 2026 article | [fullswing 2025 AI](https://fullswing.dena.com/archives/100181/); [MyNavi](https://news.mynavi.jp/techplus/article/20260408-4265138/) |
| Org | BayStars R&D (biomech analysts, DS) × DeNA AI team (ビジョン・スポーツグループ); PM 大西克典 | Ongoing since ~2017 project start | [type.jp](https://type.jp/et/feature/30681/); [slides](https://docswell.com/s/DeNA_Tech/KL3XRD-2026-03-11-100936) |

Sankei (2026-03-06) reports pitching-related league ranking improvement 2024→2025 attributed partly to AI; treat as press paraphrase of company AI Day messaging.

Kawasaki Brave Thunders basketball tracking demo mentioned at JSAI booth ([jsai2025](https://engineering.dena.com/blog/2025/06/jsai2025/)).

---

## 6. AI democratization / literacy programs

| Program | What | Date | Primary |
|---|---|---|---|
| **DeNAグループAIポリシー** | Public AI principles (7 axes) | Board: **2023-02-24**; published Mar 2023 | [policy PDF](https://csr.dena.com/pdf/DeNA%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97AI%E3%83%9D%E3%83%AA%E3%82%B7%E3%83%BC.pdf); [news](https://dena.com/jp/news/3697a/) |
| 生成系AIサービス社内利用観点マニュアル | Internal practical manual | From ChatGPT era; **v5+** by 2025-08; ~semi-annual revision | [ai_journey_2](https://engineering.dena.com/blog/2025/08/ai_journey_2/) |
| DeNAグループAIガイドライン | Internal guideline under policy | Referenced CSR | [csr.dena.com/technology](https://csr.dena.com/jp/technology/) |
| AI literacy training | Company-wide | Nov 2023 (with ChatAI rollout) per ITS timeline | [Docswell](https://docswell.com/s/DeNA_Tech/K6YPLM-2024-02-29-090759) |
| **AIオールイン** | Top-down strategy: half headcount on current biz (growth), half on new AI biz; “productivity ×2” | Declared **2025-02-05** DeNA × AI Day / TechCon | [ai_journey_1](https://engineering.dena.com/blog/2025/08/ai_journey_1/); [fullswing Namba](https://fullswing.dena.com/archives/100153/); [IR](https://asset.dena.com/files/jp/ir/pdf/report/00_2025_v2.pdf) |
| **DARS** | Personal L1–5 (dev/non-dev) + org L1–5; not direct HR score; grade recommendation; FY2025 goal: all orgs ≥ org L2 | Announced **2025-08-06**; start end-Aug 2025 | [DARS press](https://dena.com/jp/news/5279/); [fullswing DARS](https://fullswing.dena.com/archives/100171/) |
| 品管版DARS | QA-dept localization of DARS around DAAQ | 2025-12 eng | [DAAQ strategy](https://engineering.dena.com/blog/2025/12/dena-qa-ai-strategy/) |
| Trial / fast procurement | 1–2 business-day AI tool trials; `#ai-all-in` Slack **>1,100** members; 50+ AI products in use | Eng 2025-09 | [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/) |
| e-learning / study portal / guilds | Planned/ongoing literacy | DARS press; Fullswing | [DARS press](https://dena.com/jp/news/5279/) |
| **AI活用100本ノック** | Field case publishing | Fullswing 2025 retrospection | [fullswing](https://fullswing.dena.com/archives/100181/) |
| LLM勉強会 materials OSS | Internal study materials published | Dec 2025 | [llm-study20251201](https://github.com/DeNA/llm-study20251201) |
| Devin workshops / handson | 200+ people handson cited for externalization via AI Link | Devin press | [news/5356](https://dena.com/jp/news/5356/) |
| Prototyping mandate (non-eng) | Fullswing: Jul 2025 “企画書禁止 / プロトタイピング” | Cultural policy note | [fullswing](https://fullswing.dena.com/archives/100181/) |

---

## 7. Org structure (labs / teams)

| Entity | Role | Named leaders (public) | Primary |
|---|---|---|---|
| **IT本部** | CoE; tech strategy; company AI journey driver | 金子俊一 (本部長; also listed as AI・データ戦略統括部 統括部長 on officer page) | [ai_journey_1](https://engineering.dena.com/blog/2025/08/ai_journey_1/); [officers](https://dena.com/jp/company/officer.html) |
| **AI・データ戦略統括部** | Platforms (SAI/Dify/Hekatoncheir), domain AI (games/sports), governance | 大泉 (SAI/Dify); 大西 (BayStars AI); 松井 (AI技術開発部ゲームエンタメG Mgr); 加茂 (全社AI戦略) | Eng blogs / slides above |
| **AI技術開発部** / ゲームエンタメG / ビジョン・スポーツG | Domain AI R&D/product | Matsui, Onishi | [jsai2025](https://engineering.dena.com/blog/2025/06/jsai2025/); [type.jp](https://type.jp/et/feature/30681/) |
| **データ基盤部** | SAI/Dify ops, Hekatoncheir | Oizumi, Kajiwara | [dify-operation](https://engineering.dena.com/blog/2024/10/dify-operation/); [hekatoncheir](https://engineering.dena.com/blog/2024/09/hekatoncheir-introduction/) |
| **IT戦略部** / EXG | ChatAI, Findout, Ledge | ITS talks; 長田 | Findout blogs |
| **IT調達統制室** | AI product procurement | 岩崎 | [ai_journey_3](https://engineering.dena.com/blog/2025/09/ai_journey_3/) |
| **IT基盤部** | Devin Enterprise VPC/SSO | 小池 | [aj-devin-enterprise](https://engineering.dena.com/blog/2025/09/aj-devin-enterprise/) |
| **AIガバナンスコミッティ** | Cross-functional oversight | — | [ai_journey_2](https://engineering.dena.com/blog/2025/08/ai_journey_2/) |
| **AIエキスパートチーム** | Embed AI+domain people into biz units | Described by Kaneko/Sumiyoshi | [ai_journey_1](https://engineering.dena.com/blog/2025/08/ai_journey_1/); [fullswing AI ALL IN](https://fullswing.dena.com/archives/100165/) |
| **AIイノベーション事業本部** | AI-native new businesses | 住吉政一郎 (本部長); launched ~**2025-04** | [ITmedia](https://www.itmedia.co.jp/aiplus/articles/2509/08/news048.html) citing talk; [IR](https://asset.dena.com/files/jp/ir/pdf/report/00_2025_v2.pdf) |
| **株式会社DeNA AI Link** | Externalize DeNA AI know-how; Devin JP; リーダーズAI | 住吉 | [dena-ailink.com](https://dena-ailink.com/); Devin/Leaders press |
| **品質管理部** | DAAQ / 品管版DARS | 前川 | [DAAQ](https://engineering.dena.com/blog/2025/12/dena-qa-ai-strategy/) |
| **Pococha AI駆動開発推進チーム** | Live-comm AI-driven development | 松田 et al. | [pococha-aidd](https://engineering.dena.com/blog/2025/07/pococha-aidd/) |
| **IRIAM ML specialized team** | Auto-modeling R&D | IRIAM Co. | [news/5327](https://dena.com/jp/news/5327/) |
| Historical: AI推進部 / AIシステム部 | Game AI (Othellonia era) | 吉村, 甲野 (2020 blogs) | [cedec2020](https://engineering.dena.com/blog/2020/09/cedec2020-othellonia-ai/) |

**Not found as named org:** “AI Center”, “AI Lab” as official English/Japanese lab brand (beyond “AIエキスパートチーム” / CoE language).  
**dena.ai / DeNA × AI** is a public tech/business showcase site for AI Day etc., not confirmed as a legal org name.

---

## 8. Patents, papers, open source

### Patents (confirmed public)
- DeSC × MDV **拡大推計機能** — JP **第7653474号** ([news/5246](https://dena.com/jp/news/5246/))  
**Gap:** No exhaustive J-PlatPat dump executed in this research; additional AI patents may exist.

### Papers / academic (selected primaries)
- JSAI 2023: 強化学習を用いた現代型モバイルゲーム『逆転オセロニア』のトップレベル対戦 ([J-STAGE](https://www.jstage.jst.go.jp/article/pjsai/JSAI2023/0/JSAI2023_2Q4OS27b05/_pdf/-char/ja))
- Prior Othellonia RL works referenced therein (Kono 2019, Sakoda 2020, etc.)
- JSAI 2025: industrial session (Matsui); A-S-C architecture talk (Kono; paper “近日公開” as of Jun 2025); Join clinical form LLM poster (Mori × Alm); RecSys Challenge 2024 win talk ([jsai2025](https://engineering.dena.com/blog/2025/06/jsai2025/))
- Onishi (BayStars AI) personal academic CV mentioned CVPR/ACMMM/AAAI in interview ([type.jp](https://type.jp/et/feature/30681/)) — individual, not necessarily DeNA-affiliated papers

### Open source / public code
| Repo | Purpose | URL |
|---|---|---|
| **HandyRL** | Distributed RL framework | https://github.com/DeNA/HandyRL |
| **Anjin** | Unity game autopilot / monkey test | https://github.com/dena/anjin |
| **dify-google-cloud-terraform** | Dify on GCP IaC (SAI backbone) | https://github.com/DeNA/dify-google-cloud-terraform |
| **llm-study20251201** | Internal LLM study materials | https://github.com/DeNA/llm-study20251201 |

### ML platform (internal, not OSS)
- **Hekatoncheir**: GKE-based model inference platform since ~2020 ([hekatoncheir](https://engineering.dena.com/blog/2024/09/hekatoncheir-introduction/))

### Live-community ML products (related self-use R&D)
- IRIAM auto-modeling ML team ([news/5327](https://dena.com/jp/news/5327/))
- Realtime voice conversion AI; IRIAM internal PoC Mar 2024 ([dena.ai](https://dena.ai/news/iriam-vc-demo-exp/); [news/5053](https://dena.com/jp/news/5053/))

---

## Timeline (compressed)

| When | Event |
|---|---|
| ~2015+ | Pre-genAI ML applied to businesses ([ai_journey_2](https://engineering.dena.com/blog/2025/08/ai_journey_2/)) |
| ~2017 | BayStars × AI project start (Onishi) |
| 2020 | HandyRL OSS; Othellonia RL / simulator platform blogs |
| 2022-06 | GitHub Copilot temporarily banned |
| 2023-02-24 | DeNA Group AI Policy |
| 2023-07 | ChatAI launched |
| 2023-08 | GitHub Copilot for Business company rollout |
| 2023-09 | ChatAI RAG; helpdesk AI |
| 2023-11 | AI literacy training + ChatAI company expansion |
| 2024-03 | IRIAM voice-conversion internal experiment |
| 2024-05–07 | SAI built (new grads); Jul company release |
| 2024 | BayStars pitcher AI prototype season |
| 2025-02-05 | **AIオールイン** declared (AI Day / TechCon) |
| 2025-02 | Devin usage begins |
| 2025-04 | AI Innovation HQ (~); Alm SIP genAI healthcare |
| 2025 spring | Pitcher AI production |
| 2025-07 | Cognition partnership; batter AI proto; Pococha AI-driven dev push |
| 2025-08 | DARS; AI解説 (club app, per Fullswing) |
| 2025-09 | Devin Enterprise eng deep-dive; Findout blogs; procurement catalog (50+ AI products) |
| 2025-10 | Findout RAG 80% |
| 2025-12 | DAAQ strategy; IRIAM ML team; LLM study OSS |
| 2026-03-04 | Devin Enterprise **2,000+** company-wide |
| 2026-03-06 | DeNA × AI Day 2026 “Proof.” |
| 2026-04 | ONSEI Pro; Leaders AI GA + AI住吉; Ledge→Findout 90%+ |
| 2026-07 | (research cutoff) |

---

## Uncertainties & gaps

1. **No public “AI Center” brand** — CoE language is IT本部 / AI・データ戦略統括部 / AIエキスパートチーム.  
2. **SAI expansion / multi-tenant / model router details** — architecture blog confirms Dify+Azure OpenAI; multi-model switching is inferred by secondary writers, not primary.  
3. **Consumer-facing CS AI** for game users — not clearly named.  
4. **Localization AI / generative art pipelines** — procurement of Firefly only; no named production pipeline.  
5. **Patent portfolio** — only one healthcare analytics patent confirmed via press; full portfolio unknown.  
6. **A-S-C paper** — announced as forthcoming at JSAI 2025; publication status as of Jul 2026 not verified here.  
7. **Quantified company-wide productivity** (“半分の人員”) — stated as management target; not audited outcome.  
8. **Secondary PDF** (yorozuipsc) mixes interview synthesis with speculation — not used as authority for claims above.

---

## Source index (primary hubs)

- Engineering blog: https://engineering.dena.com/  
- Corporate news: https://dena.com/jp/news/  
- AI Day / DeNA x AI: https://dena.ai/  
- Fullswing (owned media): https://fullswing.dena.com/  
- Docswell DeNA Tech slides: https://www.docswell.com/user/DeNA_Tech  
- IR integrated report 2025: https://asset.dena.com/files/jp/ir/pdf/report/00_2025_v2.pdf  
- CSR / AI policy: https://csr.dena.com/jp/technology/  
- GitHub org: https://github.com/DeNA  

---

*Report compiled July 2026 for internal research use. Prefer linked primaries over this summary when citing.*
