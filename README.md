# agent-team（Cursor スキル）

業務依頼をリーダー主導のエージェントチームで遂行するための Cursor Agent Skill です。

## インストール

```bash
cp -r agent-team ~/.cursor/skills/
```

## 使い方

Cursor Agent に業務依頼を出すと、スキルが自動適用されます（description のトリガー語に一致）。

例：
- 「飲食店のホームページを作ってほしい」
- 「在庫管理システムを開発して」
- 「競合調査をまとめて提案書にして」

## 構成

```
agent-team/
├── SKILL.md                 # メイン手順（リーダーフロー）
└── references/
    ├── roles.md             # 役割カタログ
    ├── playbooks.md         # 案件タイプ別プレイブック
    ├── intake.md            # 要件整理の質問バンク
    ├── cursor-tools.md      # Task/MCP/スキル連携
    └── skill-acquisition.md # スキル拡張ルール
```

## 設計方針

- **リーダー1人**が窓口・統合・品質の責任を持つ
- **案件ごとにチームを動的編成**（固定の「全部入りチーム」は作らない）
- **自律実行** — 計画は報告し、大きな判断以外は前提を明示して進む
- **Cursor Task ツール**でサブエージェントを並列起動
