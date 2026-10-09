# 本地启动：Neon + prompts.chat

先让原项目在本地运行，再修改名称和风格，最后部署 Vercel。

## 1. 使用 Node 24

项目的 `package.json` 要求 Node 24，`.nvmrc` 已固定大版本。

```bash
cd /Users/trace/yjy/prompts.chat
source "$HOME/.nvm/nvm.sh"
nvm use
```

本次已安装锁文件中的依赖，并完成 Prisma Client 生成。无需重复安装。

从全新克隆开始时，先准备 `.env`，再执行 `npm ci`：项目的 postinstall 会读取数据库配置，即使生成客户端本身不连接数据库，也不能缺少相关变量。

## 2. 在 Neon 创建独立的项目

登录 Neon 后，新建用于本项目的 PostgreSQL 数据库。选择适合自己的区域，并在之后的 Vercel 配置中尽量使用相近的运行区域。

在 Connect 面板中选中同一项目、同一 branch、database 和 role，取得两种连接地址，填入本地 `.env`：

- `DATABASE_URL`：开启 connection pooling 后的应用连接地址。
- `DIRECT_URL`：关闭 connection pooling 后的直连地址。

`.env` 已创建，权限为仅当前用户读写，并被 Git 忽略。现有数据库地址包含 `replace-host.invalid`，只是占位值，必须替换后才能连接。保留连接地址中的 SSL 等查询参数。

`AUTH_SECRET` 已随机生成。`AUTH_URL` 和 `NEXTAUTH_URL` 当前均为 `http://localhost:3000`。

## 3. 检查并初始化数据库

先确认连接的是本项目专用的开发数据库，然后运行：

```bash
npx prisma validate
npm run db:deploy
npm run dev
```

`db:deploy` 应用仓库已有的迁移，不创建新的迁移文件。等日志显示 ready 后，打开 `http://localhost:3000`。只有迁移和实际页面请求都成功，才算完成本地启动。

`prisma.config.ts` 已明确让 Prisma CLI 使用 `DIRECT_URL`；应用的 `src/lib/db.ts` 继续使用 `DATABASE_URL`。这样迁移走直连，运行时可以走连接池。两个变量都必须配置。

暂时不需要 `npm run db:seed`。现有脚本会从社区导入大量提示词，并创建使用固定演示密码的管理员；个人方法库应按自己的内容与账号需求初始化。

## 4. 配置登录和个人品牌

当前 `prompts.config.ts` 仍是原站配置，登录 providers 为 GitHub、Google、Apple。要完成登录，需要配置相应 provider，或明确选择项目已有的账号密码方式；本次尚未改动登录流程。

注意实际 GitHub 插件读取的是 `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`，Google 插件读取的是 `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`。安装向导生成的变量名称与这些插件存在差异，应以当前代码为准。GitHub 本地回调路径为 `/api/auth/callback/github`。

个人品牌从以下配置开始：

- `useCloneBranding`：启用自有品牌首页。
- `branding`：名字、简介和 Logo。
- `theme`：颜色、圆角和密度。
- `i18n.defaultLocale`：默认中文使用 `zh`。

标签页标题、分享卡片、favicon 还需核查 `src/app/layout.tsx` 和 `public/favicon/`；当前这些地方有原站硬编码，不能认为只改一个名字就会全部替换。

## 5. 部署 Vercel

本地流程验证成功后，再将自己的 GitHub 仓库导入 Vercel，设置 Node 24、数据库和认证环境变量，并配置正式站点的登录回调。

本地、预览和正式环境应明确区分。不要让预览版本无意写入正式数据。数据库迁移作为受控部署步骤执行，不在每个预览构建中随意运行。

学习时按“配置 → 页面 → 表单 → API → Prisma 数据模型”的顺序阅读，每完成一个小改动就检查并 commit。
