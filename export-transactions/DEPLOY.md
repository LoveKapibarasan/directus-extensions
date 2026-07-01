# デプロイ手順メモ

## 構成
- コンテナ名: `ocpp-directus`
- Directus: v11.17.4
- 拡張一覧: 3つのstandalone extension

| フォルダ | タイプ | 役割 |
|---|---|---|
| `export-transactions-api` | endpoint | `/export-transactions` エンドポイント (XLSX生成) |
| `export-transactions-ui` | module | サイドバーページ (`/admin/export-transactions`) |
| `export-transactions-panel` | panel | Insights Dashboard パネル |

---

## 初回デプロイ手順

### 1. ソースをコンテナにコピーしてビルド

```bash
# ===== API (endpoint) =====
docker exec ocpp-directus sh -c "mkdir -p /directus/extensions/export-transactions-api/src"
docker cp src/api/index.js ocpp-directus:/directus/extensions/export-transactions-api/src/index.js

docker exec ocpp-directus sh -c "cat > /directus/extensions/export-transactions-api/package.json << 'EOF'
{\"name\":\"export-transactions\",\"version\":\"1.0.0\",\"type\":\"module\",\"directus:extension\":{\"type\":\"endpoint\",\"path\":\"api.js\",\"source\":\"src/index.js\",\"host\":\"^11.0.0\"},\"dependencies\":{\"exceljs\":\"^4.4.0\"}}
EOF"

docker exec -w /directus/extensions/export-transactions-api ocpp-directus sh -c "
  NODE_ENV=development npm install @directus/extensions-sdk exceljs --save-dev --save --quiet &&
  ./node_modules/.bin/directus-extension build -t endpoint -i src/index.js -o api.js
"

# ===== UI (module) =====
docker exec ocpp-directus sh -c "mkdir -p /directus/extensions/export-transactions-ui/src"
docker cp src/app/index.js ocpp-directus:/directus/extensions/export-transactions-ui/src/index.js
docker cp src/app/ExportPage.vue ocpp-directus:/directus/extensions/export-transactions-ui/src/ExportPage.vue

docker exec ocpp-directus sh -c "cat > /directus/extensions/export-transactions-ui/package.json << 'EOF'
{\"name\":\"export-transactions-ui\",\"version\":\"1.0.0\",\"type\":\"module\",\"directus:extension\":{\"type\":\"module\",\"path\":\"app.js\",\"source\":\"src/index.js\",\"host\":\"^11.0.0\"}}
EOF"

docker exec -w /directus/extensions/export-transactions-ui ocpp-directus sh -c "
  NODE_ENV=development npm install @directus/extensions-sdk --save-dev --quiet &&
  ./node_modules/.bin/directus-extension build -t module -i src/index.js -o app.js
"

# ===== Panel =====
docker exec ocpp-directus sh -c "mkdir -p /directus/extensions/export-transactions-panel/src"
docker cp src/panel/index.js ocpp-directus:/directus/extensions/export-transactions-panel/src/index.js
docker cp src/panel/ExportPanel.vue ocpp-directus:/directus/extensions/export-transactions-panel/src/ExportPanel.vue

docker exec ocpp-directus sh -c "cat > /directus/extensions/export-transactions-panel/package.json << 'EOF'
{\"name\":\"export-transactions-panel\",\"version\":\"1.0.0\",\"type\":\"module\",\"directus:extension\":{\"type\":\"panel\",\"path\":\"panel.js\",\"source\":\"src/index.js\",\"host\":\"^11.0.0\"}}
EOF"

docker exec -w /directus/extensions/export-transactions-panel ocpp-directus sh -c "
  NODE_ENV=development npm install @directus/extensions-sdk --save-dev --quiet &&
  ./node_modules/.bin/directus-extension build -t panel -i src/index.js -o panel.js
"
```

### 2. 再起動

```bash
docker restart ocpp-directus
```

Directusが自動で `directus_extensions` テーブルに登録する。

---

## 永続化 (コンテナ再作成時)

現在はextensionがコンテナ内にのみある。コンテナを削除・再作成すると消える。

### 永続化方法: ボリュームマウント追加

```bash
# ビルド済みファイルをホストにコピー
docker cp ocpp-directus:/directus/extensions/export-transactions-api /home/user/directus-extensions-deployed/
docker cp ocpp-directus:/directus/extensions/export-transactions-ui /home/user/directus-extensions-deployed/
docker cp ocpp-directus:/directus/extensions/export-transactions-panel /home/user/directus-extensions-deployed/

# コンテナ停止・削除
docker stop ocpp-directus && docker rm ocpp-directus

# 元のdocker runコマンドに -v を追加して再作成
# (元コマンドは docker inspect で確認)
docker run -d \
  --name ocpp-directus \
  --restart always \
  -p 8055:8055 \
  -v /home/user/directus/uploads:/directus/uploads \
  -v /home/user/directus-extensions-deployed:/directus/extensions \
  -e DB_CLIENT=pg \
  ... (他のenv変数) \
  directus/directus:latest
```

---

## 動作確認

```bash
TOKEN=$(curl -s -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ai-charge.com","password":"<PASS>"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['access_token'])")

# endpointテスト
curl -w "HTTP:%{http_code} Size:%{size_download}b\n" \
  "http://localhost:8055/export-transactions?from=2026-06-01&to=2026-06-29" \
  -H "Authorization: Bearer $TOKEN" -o /tmp/test.xlsx

# app extensionバンドルテスト
curl -w "HTTP:%{http_code} Size:%{size_download}b\n" \
  "http://localhost:8055/extensions/sources/index.js" \
  -H "Authorization: Bearer $TOKEN" -o /dev/null
```

---

## Dashboardパネルの使い方

1. 左サイドバー **💡 Insights** をクリック
2. Dashboard開く (なければ New Dashboard)
3. 右上 **「+」** → Add Panel
4. **「Transaction Export」** を選択
5. Save → パネルに日付ピッカーとExportボタンが表示される

## モジュールページ (直接URL)

`http://directus.ai-charge.net/admin/export-transactions`
