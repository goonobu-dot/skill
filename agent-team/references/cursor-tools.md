# Cursor 向けツール・連携ガイド

## サブエージェント（Task ツール）

| subagent_type | 使う場面 |
|---|---|
| `generalPurpose` | 実装、設計書執筆、資料作成、複合タスク |
| `explore` | コードベース調査、ファイル探索（thoroughness を指定） |
| `shell` | git、ビルド、テスト実行、デプロイ準備 |
| `bugbot` | PR/差分のコードレビュー（ユーザー明示時） |
| `security-review` | セキュリティレビュー（ユーザー明示時） |

**並列起動：** 依存のない Task は同一応答内で複数呼ぶ。

**resume：** 同じサブエージェントに追加指示するとき `resume` に agent ID を渡す。

## MCP（cursor-app-control）

| ツール | 用途 |
|---|---|
| `create_project` | 新規プロジェクトディレクトリ + git 初期化 |
| `move_agent_to_root` | 作業ワークスペースを案件ディレクトリに移動 |
| `open_resource` | 成果物をエディタで開いてユーザーに見せる |
| `browser_*`（cursor-ide-browser） | Web アプリの動作確認 |

## スキルの場所

| パス | 内容 |
|---|---|
| `~/.cursor/skills/` | 個人スキル（全プロジェクト） |
| `~/.cursor/skills-cursor/` | Cursor 組み込み（編集禁止） |
| `~/.claude/skills/` | Claude/Cursor 共有スキル |

リーダーは着手前に available skills を確認し、存在するスキルだけをサブエージェントに指定する。

## 進行管理

- **TodoWrite** — 複数工程のチェックリスト（任意）
- **AskQuestion** — ユーザーへの構造化質問（最大4問）
- **SwitchMode** — 大規模設計が必要なとき plan モードを検討

## 品質確認

- コード：`Shell` でビルド・テスト・起動
- Web：`webapp-testing` スキル + browser MCP
- 完了宣言前に `verification-before-completion` の精神で**証拠を取ってから**報告

## GitHub バックアップ

意味のある単位で commit → push（ユーザーが commit を依頼した場合、またはワークスペースルールに従う場合）。`origin` がなければ作成して追加。
