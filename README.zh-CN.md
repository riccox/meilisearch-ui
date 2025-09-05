# Meilisearch-UI

中文 ｜ [ENGLISH](./README.md)

<a href="https://github.com/riccox/meilisearch-ui/actions">![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/riccox/meilisearch-ui/docker-build-release.yaml)</a>
<a href="https://github.com/riccox/meilisearch-ui/releases">![release](https://img.shields.io/github/v/release/riccox/meilisearch-ui?display_name=release)</a>
![stars](https://img.shields.io/github/stars/riccox/meilisearch-ui)
<a href="https://github.com/riccox/meilisearch-ui/issues">![issues](https://img.shields.io/github/issues/riccox/meilisearch-ui)</a>
![last-commit](https://img.shields.io/github/last-commit/riccox/meilisearch-ui)
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui/tags" target="_blank">![Docker Image Version (latest semver)](https://img.shields.io/docker/v/riccoxie/meilisearch-ui?label=image%20version&sort=semver)</a>
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui" target="_blank">![Docker Pulls](https://img.shields.io/docker/pulls/riccoxie/meilisearch-ui)</a>
<a href="https://github.com/riccox/meilisearch-ui/blob/main/LICENSE">![license](https://img.shields.io/github/license/riccox/meilisearch-ui)</a>

<a href="https://www.producthunt.com/posts/meilisearch-ui?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-meilisearch&#0045;ui" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373175&theme=light" alt="Meilisearch&#0045;UI - Pretty&#0044;&#0032;simple&#0032;and&#0032;fast&#0032;meilisearch&#0032;admin&#0032;dashboard | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

一个开源、漂亮、简单、快速的Meilisearch管理仪表板UI，用于管理您的Meilisearch实例

> [!IMPORTANT]
> 在开发期间，主分支可能不稳定或不可用。
> 请使用 release 而不是 main 分支来获取稳定版本的应用程序

## 功能

🚀 索引增删查改

🔎 文档搜索

💪 文档管理

🛠️️ 索引设置

⚓ 多实例管理

🔒 数据存储在您的浏览器中

📦 Docker镜像支持

🎱 单例模式支持（可以轻松与您自己的应用程序集成）

🌐 国际化支持 (en, zh)

## 快速开始

> [!WARNING]
> 这个应用程序没有完全实现响应式设计，所以请注意只在桌面上使用这个应用程序，以获得更好的体验。

### 跨域设置

✅ 请记住在使用此APP之前更新实例服务器中的CORS设置。

因为这个应用程序使用 Meilisearch 官方的JS客户端来调用你的 meilisearch 实例，你需要在你的web服务器中手动配置CORS设置，以确保UI面板可以通过 http api 调用访问你的实例服务器。

将UI面板部署域名添加到实例服务器cors列表中。

Nginx 示例:

```conf
# ... other configurations
     add_header Access-Control-Allow-Origin "your.meilisearch-ui.domain.com";
# ... other configurations
```

[了解如何在你的web服务器配置CORS](https://enable-cors.org/)

### 在线使用

这里有一个线上使用 Vercel 部署的示例 👉 [meilisearch-ui](https://meilisearch-ui.riccox.com).

### Docker

```sh
docker pull riccoxie/meilisearch-ui:latest

docker run -d --restart=on-failure:5 --name="meilisearch-ui" -p <your-port>:24900 riccoxie/meilisearch-ui:latest
```

#### 轻量版镜像

由于适配自定义路径等功能，主镜像体积会成为部分使用者的负担。如果你只需要使用这个应用程序的基本功能，你可以使用`lite`变体镜像，它只包含了必要的构建物，体积相对于主镜像来说非常小。

具体镜像变体请参考[镜像版本列表](https://hub.docker.com/r/riccoxie/meilisearch-ui/tags)

lite 镜像不支持以下功能：

- 单实例模式

### 使用 Vercel 部署

您可以将此应用程序部署到云中，通过[Vercel](https://vercel.com?utm_source=github&utm_medium=readme)

只需点击下面的按钮即可自动部署此应用程序

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Friccox%2Fmeilisearch-ui&project-name=meilisearch-ui)

## 配置

### 基本路径 Base Path

参考这个[问题](https://github.com/riccox/meilisearch-ui/issues/40).

你可以通过设置`BASE_PATH`环境变量来配置基本路径。

例如，如果你想将这个应用程序部署到`/meilissearch-ui`路径，你可以将`BASE_PATH `环境变量设置为`/meilissearch-ui`。

```sh
docker run -d --restart=on-failure:5 --name="meilisearch-ui" -p <your-port>:24900 -e BASE_PATH="/meilisearch-ui" riccoxie/meilisearch-ui:latest
```



### 单实例模式 Singleton mode

参考这个[问题](https://github.com/riccox/meilisearch-ui/issues/43).

如果你想在这个应用中只使用一个 Meilisearch 实例，你可以通过以下两种方式启用单例模式：

#### 使用 Docker（推荐）

使用环境变量来配置单实例模式：

```sh
docker run -d --restart=on-failure:5 \
  --name="meilisearch-ui" \
  -p <your-port>:24900 \
  -e SINGLETON_MODE=true \
  -e SINGLETON_HOST=your-meilisearch-host \
  -e SINGLETON_API_KEY=your-api-key \
  riccoxie/meilisearch-ui:latest
```

> [!CAUTION]
>
> **安全提示**
>
> 通过此方式暴露的单实例模式相关的环境变量最终都会出现在客户端包中，因此应该尽量避免使用此方式。使用单实例模式打包时需要谨慎判断你部署该应用的网络环境，建议在可信的内部网络环境中部署。

#### 自行编译

如果你需要自定义更多配置，可以通过以下步骤自行编译：

1.克隆此仓库：

```sh
git clone git@github.com:riccox/meilisearch-ui.git --depth=1
```

2.进入仓库根目录：

```sh
cd meilisearch-ui
```

3.安装依赖：

```sh
pnpm install
```

4.在仓库根目录创建 `.env.local` 文件，添加以下配置：

```
VITE_SINGLETON_MODE=true
VITE_SINGLETON_HOST=your-meilisearch-host
VITE_SINGLETON_API_KEY=your-api-key
```

> [!CAUTION]
>
> **安全风险**
>
> 参考这个[问题](https://github.com/riccox/meilisearch-ui/issues/161).
>
> `.env.local` 文件仅限本地，你应该在你的 `.gitignore` 中添加它以避免被git记录。
>
> 同时，任何通过此方式暴露的变量最终都会出现在客户端包中，因此应该尽量避免使用此方式。使用单实例模式打包时需要谨慎判断你部署该应用的网络环境，建议在可信的内部网络环境中部署。

5.构建应用：

```sh
pnpm build
```

构建完成后，你将在根目录找到 `dist` 目录，这是一个打包后的SPA应用目录，可以将其部署到任何服务器上。

你可以使用以下命令在本地预览打包后的单实例应用：

```sh
pnpm dlx serve dist
```

无论使用哪种方式，当你打开应用时，都会直接跳转到实例页面。

## 常见问题（FAQ）

### 如何允许自定义主机名或反向代理域名？

默认情况下，系统允许所有主机访问，无需额外配置。

只有在你需要限制允许访问的主机名时，可以通过可选环境变量 `ALLOWED_HOSTS` 进行设置。例如：

```sh
ALLOWED_HOSTS=demo.ddev.site,another.domain.com
```

如无特殊需求，无需设置此变量。

> **注意：** `ALLOWED_HOSTS` 变量仅在完整版镜像中可用，lite 镜像不支持此功能。

## 开发

> [!NOTE]
> 先安装 [pnpm](https://pnpm.io/installation).

```sh
git clone git@github.com:riccox/meilisearch-ui.git

cd meilisearch-ui

pnpm install

pnpm dev
```

## 共同构建 ♥

### 核心依赖
- [Meilisearch](https://github.com/meilisearch/meilisearch) - 搜索引擎
- [React](https://reactjs.org/) v18 - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vitejs.dev/) - 构建工具

### UI 框架和组件
- [Arco Design](https://arco.design/) - 字节跳动出品的企业级设计系统
- [Semi UI](https://semi.design/) - 抖音前端团队的设计系统
- [Mantine UI](https://mantine.dev/) - 现代 React 组件库
- [Next UI](https://nextui.org/) - 美观的 React UI 库
- [Radix UI](https://www.radix-ui.com/) - 无样式、可访问的组件
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [UnoCSS](https://unocss.dev/) - 即时原子 CSS 引擎

### 状态管理和数据处理
- [TanStack Query](https://tanstack.com/query/latest) - 强大的异步状态管理
- [TanStack Router](https://tanstack.com/router/latest) - 类型安全的路由
- [Zustand](https://zustand-demo.pmnd.rs/) - 简单的状态管理
- [Immer](https://immerjs.github.io/immer/) - 不可变状态处理
- [Zod](https://zod.dev/) - TypeScript 优先的模式验证

### 国际化和表单
- [i18next](https://www.i18next.com/) - 国际化框架
- [React Hook Form](https://react-hook-form.com/) - 高性能表单
- [React Error Boundary](https://github.com/bvaughn/react-error-boundary) - 错误边界处理

### 工具和功能增强
- [Lodash](https://lodash.com/) - 实用工具库
- [Day.js](https://day.js.org/) - 轻量级日期处理
- [Fuse.js](https://fusejs.io/) - 模糊搜索库
- [ECharts](https://echarts.apache.org/) - 可视化图表库
- [ahooks](https://ahooks.js.org/) - React Hooks 库

### 开发工具
- [Biome](https://biomejs.dev/) - 代码格式化和检查
- [ESLint](https://eslint.org/) - 代码质量工具
- [Prettier](https://prettier.io/) - 代码格式化

### UI 增强
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Lucide Icons](https://lucide.dev/) - 图标库
- [Tabler Icons](https://tabler-icons.io/) - 图标库
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [Sonner](https://sonner.emilkowal.ski/) - Toast 通知
- [Vaul](https://vaul.emilkowal.ski/) - 抽屉组件
