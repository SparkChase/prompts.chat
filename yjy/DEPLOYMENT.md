# 部署指南 · Richard · 邪王真眼档案馆

本文记录这个 fork 从 Neon 建库到 Vercel 上线的完整过程与当前状态。上游原版说明见根目录 `SELF-HOSTING.md` 与 `DOCKER.md`；本文只写本站实际采用的做法。

最后更新：2026-10-16

## 1. 站点信息

| 项目 | 值 |
|------|-----|
| 仓库 | `https://github.com/SparkChase/prompts.chat` |
| 正式域名 | `https://promptchat.20040829.xyz` |
| 部署平台 | Vercel |
| 数据库 | Neon PostgreSQL（项目 `prompt`，开发分支） |
| 默认语言 | `zh` |
| 登录方式 | 仅 GitHub OAuth |

## 2. 数据库（Neon）

Neon 项目 `prompt` 的开发分支，数据库名 `neondb`，区域 `us-east-2`（俄亥俄）。当前 26 个迁移全部已应用。

需要两条连接串，用途不同，缺一不可：

- `DATABASE_URL`：走连接池，主机名带 `-pooler`，应用运行时使用。
- `DIRECT_URL`：直连，主机名不带 `-pooler`，Prisma CLI 迁移使用。

分工由 `prisma.config.ts` 固定：迁移读 `DIRECT_URL`，应用读 `DATABASE_URL`（见 `src/lib/db.ts`）。

连接串末尾保留这些参数，`connect_timeout=30` 是针对 Neon 冷启动超过默认等待时间加的：

```
?sslmode=require&channel_binding=require&connect_timeout=30&pool_timeout=30&connection_limit=5
```

注意：本机 `.env` 里的值带双引号，粘贴到 Vercel 时要**去掉引号**。

## 3. 环境变量

本地 `.env` 只作用于本机，Vercel 完全不读它。两边需要分别配置。

### 本地 `.env`

```
DATABASE_URL=        # 池化地址
DIRECT_URL=          # 直连地址
AUTH_SECRET=         # openssl rand -base64 32
AUTH_URL="https://promptchat.20040829.xyz"
NEXTAUTH_URL="https://promptchat.20040829.xyz"
CRON_SECRET=         # openssl rand -base64 32
PCHAT_FEATURE_AI_SEARCH="false"
PCHAT_FEATURE_AI_GENERATION="false"
```

`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 本地默认注释掉，所以**本地点 GitHub 登录会失败**，属于预期。要在本机调试登录，填入凭据并把 `AUTH_URL` / `NEXTAUTH_URL` 临时改回 `http://localhost:3000`。

### Vercel（只勾 Production）

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | 池化地址，去掉外层引号 |
| `DIRECT_URL` | 直连地址，去掉外层引号 |
| `AUTH_SECRET` | 正式环境单独生成，不要复用本地值 |
| `AUTH_URL` | `https://promptchat.20040829.xyz` |
| `NEXTAUTH_URL` | `https://promptchat.20040829.xyz` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App |
| `CRON_SECRET` | 每日额度重置接口鉴权 |

只勾 Production 是刻意的：Preview 部署拿不到变量会连不上库，从而避免预览环境写进正式数据。

## 4. Vercel 项目设置

- Framework Preset：自动识别为 Next.js
- Build Command：`npm run build`（内部为 `prisma generate && next build`）
- Install Command：`npm install`（`postinstall` 会再跑一次 `prisma generate`）
- Output Directory：留空
- **Node.js Version：必须选 `24.x`**（`package.json` 的 `engines` 要求 24，本机是 v22，不一致）
- Region：建议 `cle1`，距 Neon 的 `us-east-2` 最近

## 5. GitHub OAuth App

- Homepage URL：`https://promptchat.20040829.xyz`
- Authorization callback URL：`https://promptchat.20040829.xyz/api/auth/callback/github`

`prompts.config.ts` 的 `auth.providers` 已收窄为 `["github"]`。若以后加回 Google / Apple，需同步补上对应凭据，否则登录页会出现点了就报 `error=Configuration` 的按钮。

## 6. 部署后必做：跑迁移

Vercel 构建只执行 `prisma generate`，**不会建表**。首次部署后必须在本地对着正式库执行一次：

```bash
cd /Users/trace/yjy/prompts.chat
DIRECT_URL="<直连地址>" npx prisma migrate deploy
```

对比：走 Docker 自托管时，`docker/entrypoint.sh` 会自动执行 `npx prisma migrate deploy`，Vercel 没有这一步。

验证：

```bash
curl https://promptchat.20040829.xyz/api/health
# 期望：{"status":"healthy","database":"connected"}
```

## 7. 管理员权限

`/admin` 要求 `role === "ADMIN"`，否则跳回首页。默认注册用户是 `USER`。

提升方式（数据改动，不产生迁移文件）：

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'richardyangjiayu@qq.com';
```

**改完必须退出登录再重新登录。** 原因：`src/lib/auth/index.ts` 用 `strategy: "jwt"`，角色在登录那一刻写进 token。后续请求虽然会查库，但只在 `trigger === "update"` 或 `token.username` 为空时才刷新 `token.role`，所以旧角色会一直留在 token 里（JWT 默认 30 天）。

判断是否生效：重新登录后看头像菜单里是否出现 Admin 项（`archive-header.tsx` 仅在 `role === "ADMIN"` 时渲染）。

## 8. 分类与标签

只能在 `/admin` 后台创建，提示词表单里只能选择已存在的，不能现场新建。

1. 进入 `/admin` → **Categories** → Add，填 Name、Slug（必填）、父分类、描述、图标 emoji、是否置顶。支持多级分类。
2. 同页 **Tags** → Add，填 Name、Slug、颜色（默认 `#6366f1`）。
3. 之后创建或编辑提示词时，Category 下拉与 Tags 多选即可选到。

## 9. 本 fork 的定制

- `prompts.config.ts`：品牌名、Logo、`useCloneBranding: true`、`defaultLocale: "zh"`、`auth.providers: ["github"]`
- 页脚：已移除「基于 prompts.chat」与「角色来源」两个外链（`src/components/archive/archive-footer.tsx`）
- 赞助 widget：CodeRabbit 与 CommandCode 已在 `src/lib/plugins/widgets/index.ts` 注释禁用，当前仅剩 `book-promo`、`textream-promo`，均无 sponsor
- 角色插画来源与授权说明保留在 `public/richard/ASSETS.md`

## 10. 已知问题

- `next start` 会警告 `output: standalone` 不匹配，仅影响自托管，Vercel 不受影响
- `next.config.ts` 中 Sentry 的 org/project 仍指向上游（`promptschat` / `prompts-chat`），且未配 `SENTRY_AUTH_TOKEN`，不会上传 source map
- 未配 `OPENAI_API_KEY`，`aiSearch` / `aiGeneration` 实际不生效（代码有守卫，静默降级）
- 首次请求偶发 Neon pooler 冷启动 `P1001`，已通过 `connect_timeout=30` 缓解
- `src/__tests__/` 有 224 个 TypeScript 错误，均集中在测试文件，不阻断构建；`npx tsc --noEmit` 在业务代码上为 0 错误
- 每日额度重置接口 `/api/cron/reset-credits` 存在，但仓库无 `vercel.json`，Vercel 不会自动调度

## 11. 本地开发

```bash
cd /Users/trace/yjy/prompts.chat
nvm use                     # Node 24
npm run dev                 # http://localhost:3000

npm run lint                # 0 error / 206 warning
npm test                    # 47 文件 / 732 用例
npm run build               # prisma generate && next build
```

提交前跑 `npm run lint`。每完成一个小需求就 commit 一次，便于回溯。

## 12. 上线检查清单

- [x] 26 个迁移已应用
- [x] `/api/health` 返回 healthy
- [x] GitHub OAuth 回调指向正式域名
- [x] `auth.providers` 仅保留 github
- [x] 页脚外链与赞助 widget 已移除
- [x] 管理员账号已提升
- [ ] 导入方法卡内容（数据库目前仅 3 条提示词）
- [ ] 补齐分类与标签（当前均为 0 条）
