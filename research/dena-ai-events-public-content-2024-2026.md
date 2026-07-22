# DeNA（株式会社ディー・エヌ・エー）AI-related public events, talks, YouTube, and demos

**Research date:** 2026-07-22  
**Scope:** Primarily 2024–2026; Japanese primary sources preferred  
**Method:** Official DeNA sites, press releases, Engineering Blog, Fullswing, connpass, CEDEC/JSAI pages, GitHub org, YouTube channel pages

---

## Executive summary

From Feb 2025 onward DeNA’s public AI story is organized around **「AIオールイン」** (AI All-In): half the people grow current businesses with AI-driven productivity; the other half shift to new AI-native businesses. The flagship venues are **DeNA × AI Day** (2025 online with TechCon; 2026 offline “Proof.”) and the monthly meetup **DeNA × AI Talks** (#1–#8 through Jun 2026). Archives live mainly on **YouTube `DeNATech`**. High binge value comes from (1) Namba’s AI All-In keynote (~84k views), (2) AI Day 2025/2026 session playlists, (3) practical Devin / game LLM / sports AI talks, and (4) companion content such as **AI活用100本ノック** and open LLM study materials.

---

## 1. DeNA-hosted AI events

### 1.1 Flagship conferences

| Event | Date | Theme / format | What AI was shown | Primary sources |
| --- | --- | --- | --- | --- |
| **DeNA × AI Day \|\| DeNA TechCon 2025** | 2025-02-05 | Theme **UTILIZATION**; online; up to 4 lanes / 33 sessions; AI Day + TechCon same day | Opening: Namba declares **AI All-In** (“第2の創業 / Chapter 2”). AI Day lanes (Commodity / Specific): org AI strategy, SAI (Web LLM platform on Dify), BayStars AI, Pococha AI, GO drive-recorder CV, voice-conversion AI business, LLMOps, game lib chatbot “Rinchan”, Hekatoncheir MLOps, HR×AI, autonomous/game AI, designer×AI, etc. Closing panel: Takahiro Anno + DeNA execs on **AI × BizDev**. | [dena.com news](https://dena.com/jp/news/5205/), [techcon2025.dena.dev](https://techcon2025.dena.dev/), [Engineering announce](https://engineering.dena.com/blog/2024/12/denaxai-day_dena-techcon-2025/), [Event index](https://engineering.dena.com/event/) |
| **DeNA × AI Day 2026 \| Proof.** | 2026-03-06 13:00–20:00 | Offline only (no livestream); Shibuya Hikarie Hall; ~1,000 attendees; RED/BLUE/YELLOW stages + booths + Afterparty | One-year **Proof** of AI All-In: Devin enterprise rollout; Wonderia Yokohama app (Devin + On-Device AI); QA LLM productivity; game LLM ecosystem (Rinchan / Leap / Microsoft.Extensions.AI); AI Workspace agents (RAG); BayStars pitcher AI + demand forecasting; HR/DARS-related talent AI; Leaders AI × 「AI社長」; AI-native product development; YELLOW LTs (Pococha UX AI, EDGE POKER strongest AI, IRIAM ML, etc.) | [dena.ai/ai-day-2026](https://dena.ai/ai-day-2026/), [PR TIMES](https://prtimes.jp/main/html/rd/p/000000172.000013971.html), [Engineering announce](https://engineering.dena.com/blog/2026/01/announcement-aiday-2026/), [Fullswing session guide](https://fullswing.dena.com/archives/100191/), [connpass](https://dena.connpass.com/event/377295/), [intern report](https://engineering.dena.com/blog/2026/03/ai-day2026-intern-event-report/) |

**AI Day 2026 session map (AI shown):**

| Stage / time | Session | AI tech / product shown | Source |
| --- | --- | --- | --- |
| Opening | 金子俊一 | AI All-In 3 pillars + 1-year proof framing | [Fullswing](https://fullswing.dena.com/archives/100191/), [dena.ai](https://dena.ai/ai-day-2026/) |
| RED | Wonderia Yokohama app | Devin for mobile; On-Device AI | same |
| RED | New QA model | LLM in requirements / test design / execution | same |
| RED | Game LLM ecosystem | Rinchan, Leap, Unity↔AI loop | same |
| RED | AI Workspace Agent | RAG + agents for corp IT | same |
| RED | BayStars team strengthening | Pitcher AI; CV / ML | same |
| RED | BayStars demand forecast | ML for merch/F&B pricing & inventory | same |
| RED | HR goals & evaluation | ML / AI in talent cycle | same |
| BLUE | HR hiring & development | LLM for hiring “見極め”; AI-era talent definition | same |
| BLUE | Devin transformation | Enterprise Devin; Japan rollout via DeNA AI Link | same |
| BLUE | Seed VC org conditions | Delight Ventures view of small AI teams | same |
| BLUE | AI社長 × Leaders AI | Org tacit-knowledge AI (THA + DeNA AI Link) | same |
| BLUE | AI-native product development | Internal AI product craft | same |
| Closing | 南場智子 | “先に人を動かす”; move freed capacity to new biz | [Fullswing transcript](https://fullswing.dena.com/archives/100189/) |
| YELLOW | LTs / niche cases | Pococha UX AI; EDGE POKER AI; IRIAM ML; partner LTs | [dena.ai](https://dena.ai/ai-day-2026/) |

Slides for AI Day 2026 main sessions are on Docswell under `DeNA_Tech` (linked from Fullswing article above).

### 1.2 Recurring meetup: DeNA × AI Talks

Hybrid (Shibuya Scramble Square 40F + online), roughly monthly from Aug 2025. Organizer: DeNA / DeNA Tech connpass. Announcements also via X `@DeNAxAI_NEWS`.

| # | Date | Theme | Notable AI content | Primary sources |
| --- | --- | --- | --- | --- |
| **#1** | 2025-08-05 | AIスペシャリストが語る最新技術 | SAM2 lineage; structured LLM output; GUI-op LLM (UI-TARS) | [connpass](https://dena.connpass.com/event/362260/), [Engineering report](https://engineering.dena.com/blog/2025/08/dena_ai_talks1/), [Docswell slides](https://www.docswell.com/s/DeNA_Tech/K74L9V-denaaitalks1) |
| **#2** | 2025-09-10 | エンジニアのためのAIツール導入・活用最前線 | Pococha AI-driven dev (Cursor, Claude Code, Gemini CLI, PR-Agent, MCP…); kencom EM / Devin framing; PRD→docs→impl with AI; AI as pair-prog partner; **DARS** intro | [Engineering report](https://engineering.dena.com/blog/2025/10/denaaitalks2/) |
| **#3** | 2025-10-14 | 生成AIをコアとするプロダクト開発の舞台裏 | AI-native product definition; fromm (AI dating) strategy; multi-AI multimodal chat (LangChain); async LLM infra (Celery/KEDA) | [connpass](https://dena.connpass.com/event/368200/), [Engineering report](https://engineering.dena.com/blog/2025/10/denaaitalks3/) |
| **#4** | 2025-12-18 | LLMを組み込んだプロダクト開発の実践的知見 | BASE☆BLUE prompt design; LLM workflows (LangChain/LangGraph); LLM study deep-dive; AI specialist hiring tracks | [Engineering report](https://engineering.dena.com/blog/2026/01/denaaitalks4/) |
| **#5** | 2026-01-23 | ゲーム開発現場の強化学習・Gemini CLI活用事例 | Edge RL for live games (ties to CEDEC 2025); Gemini CLI in game eng workflow | [connpass listing](https://dena.connpass.com/), [Talks #4 next-event blurb](https://engineering.dena.com/blog/2026/01/denaaitalks4/) |
| **#6** | 2026-02-24 | 生成AI時代のKaggleの戦い方 | Kaggler practice under AI All-In | [connpass](https://dena.connpass.com/) |
| **#7** | 2026-03-24 | AI時代のアプリ開発：使うほど成長するプロダクト | Conversational AI memory libs; data flywheel; English-learning app **olelo** | [connpass media](https://dena.connpass.com/), [Slideshare Yoshida](https://www.slideshare.net/slideshow/ai-dena-x-ai-talks-7/286651498) |
| **#8** | 2026-06-02 | 事業に活かす画像認識AI（スポーツ〜エンタメ） | Wonderia SAM3 annotation; basketball tracking; data-centric CV | [connpass](https://dena.connpass.com/) |

Archives: Engineering posts state YouTube archives are published; AI Talks playlist cited in search results as `https://www.youtube.com/playlist?list=PLA4bt89i8SEGTqJXOwkg4qlp6cjELDJt1` (verify on DeNATech channel).

### 1.3 Other DeNA / affiliated AI gatherings

| Event | Date | Notes | Source |
| --- | --- | --- | --- |
| **Delight AI Frontier #1** (product-dev edition) | 2025-12-11 | DeNA × startups (ALGO ARTIS, CraftBank) on AI product reality | [connpass](https://delight-ai-frontier.connpass.com/event/375137/) |
| **Delight AI Frontier #1** (engineer survival strategy edition; mirrored on DeNA Tech) | 2026-02-05 | DeNA AI leaders + “DeNA mafia” CPOs | [connpass](https://delight-ai-frontier.connpass.com/event/379966/), [dena.connpass](https://dena.connpass.com/) |
| Internal **LLM勉強会** (then publicized) | 2025-12-01 | 3h lecture + hands-on; 52 participants; materials OSS’d | [Engineering](https://engineering.dena.com/blog/2025/12/llm-study-1201/) |
| **mizchi Claude Code ハンズオン** | ~2025-07 | Internal/community handson reported on Engineering Blog | [Engineering](https://engineering.dena.com/blog/2025/07/17/) (related from Talks #3) |
| TechCon 2025 **After Events** | 2025-02–03 | Mostly language/community meetups; includes **DeNA Data/ML Engineering Night** (2025-03-14) | [techcon2025.dena.dev](https://techcon2025.dena.dev/) |

### 1.4 Hackathons

**No primary-source evidence of a DeNA-hosted public AI hackathon series (2024–2026).** Related:

- Employees won **SPAJAM2025** using AI-heavy Swift/app production — external MCF hackathon, not DeNA-hosted. ([dena.com/jp/news/5325](https://dena.com/jp/news/5325/))
- TechCon 2024 LT: intern at **ETHGlobal Waterloo** (crypto hackathon). ([Docswell](https://docswell.com/s/DeNA_Tech/ZM1N9E-2024-02-29-122816))

---

## 2. DeNA speakers at external events

| Event | Date | Talk / activity | AI shown | Primary source |
| --- | --- | --- | --- | --- |
| **CEDEC 2025** | 2025-07-23 | 「強化学習の恩恵をユーザー体験に 〜 運営型ゲームにおけるエッジAI開発の舞台裏」— 竹村伸太郎, 坂見耕輔, 村上直輝 | On-device RL for GaaS; model design; Python↔C#/native stack; distributed training / MLOps | [CEDEC page](https://cedec.cesa.or.jp/2025/timetable/detail/s67ad6b32bd472/), [CEDiL](https://cedil.cesa.or.jp/cedil_sessions/view/3138) |
| **JSAI 2025** (第39回) | 2025-05-27–30 | Platinum sponsor; industrial session「DeNAにおけるAI技術の事業適用」; RecSys Challenge 2024 win talk; research talk A-S-C; poster LLM clinical forms w/ Alm; booth demos (basketball tracking) | Othelonia deck AI (Transformer); RecSys; RL research; medical LLM; sports CV demo | [Engineering report](https://engineering.dena.com/blog/2025/06/jsai2025/) |
| **JSAI 2026** (第40回) | 2026 (announced 2026-06-08) | Booth + presentations planned | TBD on dena.ai news | [dena.ai](https://dena.ai/) news item |
| **Google Cloud Generative AI Summit '24 Fall** | 2024-10-24 | 大竹悠人: Gemini long-context chatbot for internal game libraries (“Rinchan”) | Gemini + internal lib docs chatbot | [Docswell slides](https://www.docswell.com/s/DeNA_Tech/KWWVYX-2024-10-28-153429) (path variant seen as image.docswell.com) |
| **AI GALA by 生成AI EXPO** (Nagoya / TechGALA side) | 2026-01-25 | DeNA AI Link (佐々木 et al.): org AI agents / muddy reality of adoption | Devin / org AI agents | [DeNA AI Link note](https://note.com/dena_ailink/n/n7185309ce051) |
| **HR SUCCESS SUMMIT 2025** | 2025 (featured on dena.ai) | Namba on people / org / AI | Org transformation narrative | [dena.ai](https://dena.ai/) pickup |
| **Google I/O 2024** | 2024-05 | DeNA engineer **attended** (report), not a DeNA speaker slot | Gemini / Google AI landscape | [Engineering report](https://engineering.dena.com/blog/2024/05/googleio2024-report/) |

### Not found (as of research date)

| Venue | Finding |
| --- | --- |
| **NVIDIA GTC / Japan AI Day** | No DeNA speaker listing found in primary NVIDIA/JDLA materials reviewed |
| **AI Expo Tokyo** (major Tokyo expo) | No confirmed DeNA main-stage session found in this pass (Nagoya AI EXPO side event above is distinct) |
| **Google I/O Extended (as speaker)** | Not found; only I/O attendance report |

---

## 3. Official YouTube channels & representative AI video themes

### Primary channel: **DeNATech**

- Channel: [https://www.youtube.com/@DeNATech](https://www.youtube.com/@DeNATech)
- Role: TechCon / AI Day / AI Talks archives; engineering-facing

| Playlist / video cluster | Theme | Why it matters | URL |
| --- | --- | --- | --- |
| **Opening Keynote (AI Day \|\| TechCon 2025)** — 南場智子 | AI All-In / Chapter 2 / 半々戦略 | Highest-visibility single video found (~84.3k views, ~2.1k likes as scraped) | [youtu.be/1veMnZUsn4I](https://www.youtube.com/watch?v=1veMnZUsn4I) |
| **DeNA × AI Day \|\| TechCon 2025** playlist | Full 33-session archive | Breadth of AI+eng content | Playlist ID reported: `PLA4bt89i8SEEEKkez-lIi3gPW4Fnl8pLu` |
| **DeNA × AI Day 2026** playlist | Proof sessions | Devin, game LLM, sports AI, HR AI, etc. | [playlist](https://www.youtube.com/playlist?list=PLA4bt89i8SEG8n4GrGiuONIxYOWWAdKst) |
| Example 2026 talk | AI×HR hiring | Talent × AI All-In | [watch?v=k3pA-_vMf_A](https://www.youtube.com/watch?v=k3pA-_vMf_A) |
| Example 2026 talk | AI×ゲーム LLM ecosystem | Rinchan / Leap / Unity AI loop | [watch?v=L5wJtK-g2iU](https://www.youtube.com/watch?v=L5wJtK-g2iU) |
| **DeNA × AI Talks** playlist | Monthly deep dives | Practitioner detail beyond keynotes | Playlist ID reported: `PLA4bt89i8SEGTqJXOwkg4qlp6cjELDJt1` |

### Other video surfaces

- Corporate / brand re-uploads of Namba AI talks appear under titles such as「【AIの未来】DeNA南場智子が語る…」([watch?v=kmIItIucCC0](https://www.youtube.com/watch?v=kmIItIucCC0)) — treat channel ownership carefully; canonical technical archive is **DeNATech**.
- Hub site **[dena.ai](https://dena.ai/)** aggregates AI vision, news, articles, events, career — points back to Fullswing / Engineering / AI Day.

### Representative AI themes on video

1. **Executive strategy:** AI All-In, half/half resource shift, “人を先に動かす”
2. **Coding agents:** Devin as teammate; Cursor/Claude Code/Gemini CLI culture
3. **Game AI:** LLM-in-dev-environment; edge RL opponents; EDGE POKER “最強AI”
4. **Sports AI:** Pitcher AI, tracking, demand forecasting (BayStars)
5. **Corp productivity:** SAI/Dify, AI Workspace agents, QA AI, Rinchan
6. **AI-native products / B2B:** Leaders AI, AI社長, fromm, olelo, Wonderia
7. **CV / multimodal:** SAM family, Wonderia vision, basketball tracking

---

## 4. Blog / media series accompanying events

| Outlet | Role | Key AI event-adjacent pieces | URL |
| --- | --- | --- | --- |
| **DeNA Engineering Blog** | Technical + event reports | AI Day/TechCon announces; Talks #1–#4 reports; JSAI 2025; LLM study OSS; Dify ops; Claude Code / Codex study reports (2026) | [engineering.dena.com](https://engineering.dena.com/) |
| **Fullswing by DeNA** | Broader company narrative | Namba 2025 keynote transcript; AI Day 2026 session guide; Namba 2026 closing transcript; DARS feature; AI活用100本ノック year retrospect | [fullswing.dena.com](https://fullswing.dena.com/) |
| **dena.ai** | AI All-In hub | Vision, event pickups, article feed (e.g. AI活用100本ノック第2弾 2026-07-17) | [dena.ai](https://dena.ai/) |
| **Docswell `DeNA_Tech`** | Slide hosting for TechCon / AI Day / Talks | Session PDFs | [docswell.com/user/DeNA_Tech](https://www.docswell.com/user/DeNA_Tech) |
| **connpass DeNA Tech** | Registration + media attachments | Talks #5–#8 slides/archives | [dena.connpass.com](https://dena.connpass.com/) |
| **DeNA AI Link note** | B2B AI solutions voice | Devin / AI GALA posts | [note.com/dena_ailink](https://note.com/dena_ailink) |

### Standout non-talk artifacts

| Artifact | Date | Content | Source |
| --- | --- | --- | --- |
| **AI活用100本ノック** | From ~2025-07; PDF pack ~2025-12; 第2弾 noted 2026-07 | 100 field AI use cases (eng/biz/creative); later “1000+” internal efforts claimed in secondary coverage | [Fullswing retrospect](https://fullswing.dena.com/archives/100181/), [PDF](https://fullswing.dena.com/pdf/AI_100tips_slide.pdf) |
| **DARS (DeNA AI Readiness Score)** | Introduced 2025-08 | 5-level individual + org AI skill scorecard | [dena.com/jp/news/5279](https://dena.com/jp/news/5279/), [Fullswing](https://fullswing.dena.com/archives/100171/) |

---

## 5. Demo days, OSS, GitHub orgs

### Demo / experience surfaces

| Surface | What was demable | Source |
| --- | --- | --- |
| AI Day 2026 booths | Group AI solutions; hands-on demos; Devin presence across venue | [dena.ai](https://dena.ai/ai-day-2026/), [Fullswing](https://fullswing.dena.com/archives/100191/) |
| JSAI 2025 booth | Basketball tracking auto-generation demo video | [Engineering](https://engineering.dena.com/blog/2025/06/jsai2025/) |
| Product launches as “living demos” | **Devin** Japan launch (2025-07); **リーダーズAI** (2026, Daiichi Sankyo Healthcare first customer per Nikkei syndication of PR) | [dena.com/jp/news/5269](https://dena.com/jp/news/5269/), Nikkei PR mirror |

### GitHub organization: [github.com/DeNA](https://github.com/DeNA)

AI-relevant public repos (not exhaustive of historic CV/ML repos):

| Repo | What | Source |
| --- | --- | --- |
| **DeNA/llm-study20251201** | Internal LLM study slides + hands-on code (Gemini API, structured output, agents, LangChain, n8n…) | [GitHub](https://github.com/DeNA/llm-study20251201), [Pages](https://dena.github.io/llm-study20251201/), [Engineering](https://engineering.dena.com/blog/2025/12/llm-study-1201/) |
| **DeNA/dify-google-cloud-terraform** | Production-ish Terraform for Dify on GCP (powers internal **SAI**) | [GitHub](https://github.com/DeNA/dify-google-cloud-terraform), [Engineering](https://engineering.dena.com/blog/2024/10/dify-operation/) |
| Historic ML demos | e.g. Chainer pose estimation, PyTorch YOLOv3, SRCNNKit — older research/demo lineage, less tied to 2025–26 narrative | [github.com/DeNA](https://github.com/DeNA) |

**Note:** DeNA’s public AI narrative in 2025–26 emphasizes **usage / agents / productization** more than releasing foundation models.

---

## 6. Why someone would binge DeNA YouTube for AI usage (2024–2026)

Ordered by public visibility + practical density:

1. **Namba AI All-In keynote (2025-02)** — rare CEO-level, concrete “half/half” operating model; transcript on Fullswing. ([video](https://www.youtube.com/watch?v=1veMnZUsn4I), [transcript](https://fullswing.dena.com/archives/100153/))
2. **Full AI Day / TechCon 2025 playlist** — 33 sessions spanning strategy → LLMOps → sports → game chatbots → HR.
3. **AI Day 2026 “Proof.” playlist** — same company one year later with metrics-ish stories (Devin, QA 2×, game LLM ecosystem, pitcher AI).
4. **AI Talks series** — monthly practitioner depth (tools, agents, RL, CV, Kaggle).
5. **Companion reading while watching:** AI活用100本ノック PDF + Engineering Devin/Cursor posts + LLM study GitHub.

Binge pattern that matches DeNA’s own funnel: **Keynote → AI Day sessions in your domain → Talks episode → 100本ノック / OSS repo**.

---

## 7. Recurring public narrative (how DeNA talks about AI)

Synthesized from primary speeches and event framing:

1. **AI All-In as second founding** — not a side project; “Chapter 2” (Namba 2025).
2. **Three pillars** (repeated in Talks intros / AI Day 2026 opening):  
   (a) company-wide productivity, (b) strengthen existing businesses, (c) create/grow AI-native new businesses.
3. **Half / half resource shift** — ~3000 people running current biz → grow with ~half via AI; free the rest for new bets.
4. **From PoC to Proof** — 2025 Utilization → 2026 Proof.; “試すもの→使うもの”.
5. **AI as teammate, not autocomplete** — Devin / agents / org knowledge AI (Leaders AI).
6. **Top-down × bottom-up** — Namba flag + field “100本ノック” / DARS / CoPs.
7. **Human remains the starting point** — productivity frees creative / decision work; “先に人を動かす” when efficiency alone backfills busywork (2026 closing).
8. **Platform + ecosystem** — Delight Ventures / startups / AI Link solutions, not only in-house products.
9. **Domain breadth as proof** — games, live (Pococha/IRIAM), sports, healthcare, HR, QA, corp IT, immersive entertainment (Wonderia).

---

## 8. Gaps / limitations of this research

| Gap | Detail |
| --- | --- |
| **Exact YouTube playlist membership / view counts** | Channel page fetch returned minimal HTML; view counts for Opening Keynote and playlist IDs come from video page scrapes / search — re-verify in UI if citing metrics. |
| **AI Talks #5–#8 Engineering writeups** | #1–#4 have full Engineering reports; later episodes confirmed via connpass/media but full blog digests may be unpublished or delayed. |
| **NVIDIA GTC JP / AI Expo Tokyo** | No solid primary hit for DeNA as main speaker; absence ≠ proven non-attendance of booths. |
| **Hackathons** | No DeNA-hosted public AI hackathon found; only external participation awards. |
| **Pre-2024 TechCon AI history** | TechCon has AI threads since ~2019 (SHIFT UP) — not exhaustively cataloged here. |
| **Closed sessions** | e.g. Talks #3 Toyama talk: archive/slides withheld by design. |
| **Secondary press** | ITmedia/Nikkei used only when pointing back to DeNA PR; prefer linked primary URLs above. |
| **Wonderia / product demos post-open** | Wonderia Yokohama described as 2026 spring opening; ongoing public demo status after AI Day not fully tracked. |

---

## 9. Quick link desk (canonical hubs)

| Hub | URL |
| --- | --- |
| DeNA × AI | https://dena.ai/ |
| AI Day 2026 | https://dena.ai/ai-day-2026/ |
| TechCon / AI Day 2025 | https://techcon2025.dena.dev/ |
| Engineering events | https://engineering.dena.com/event/ |
| DeNA Tech connpass | https://dena.connpass.com/ |
| YouTube DeNATech | https://www.youtube.com/@DeNATech |
| GitHub DeNA | https://github.com/DeNA |
| X DeNA × AI news | https://x.com/DeNAxAI_NEWS |
| Fullswing | https://fullswing.dena.com/ |

---

*File location: `research/dena-ai-events-public-content-2024-2026.md`*
