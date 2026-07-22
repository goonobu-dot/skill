# スキル拡張ガイド

チーム能力を広げるときのルール。一括インストールはしない。

## 導入前チェック

1. リポジトリを clone し `SKILL.md`、`scripts/` を確認（外部通信・危険コマンド）
2. 既存スキルとの機能重複・トリガー競合
3. ライセンスとメンテナンス状況

## 推奨ソース（例）

| ソース | 例 |
|---|---|
| Anthropic skills | frontend-design, theme-factory, webapp-testing, canvas-design, mcp-builder, doc-coauthoring |
| superpowers | systematic-debugging, test-driven-development |
| OpenAI skills | security-best-practices, security-threat-model |

## インストール先

個人利用：`~/.cursor/skills/<skill-name>/`

プロジェクト共有：`<repo>/.cursor/skills/<skill-name>/`

**`~/.cursor/skills-cursor/` には置かない**（Cursor 管理領域）。

## 導入後

- このスキルの SKILL.md 割り当て表を更新
- 1案件で試してから本番運用に組み込む
