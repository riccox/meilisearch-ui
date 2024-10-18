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

#### 一个开源、漂亮、简单、快速的Meilisearch管理仪表板UI，用于管理您的Meilisearch实例

> [重要] 在开发期间，主分支可能不稳定或不可用。
>
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

> ⚠️ 这个应用程序没有完全实现响应式设计，所以请注意只在桌面上使用这个应用程序，以获得更好的体验。

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

docker run -d --restart=always --name="meilisearch-ui" -p <your-port>:24900 riccoxie/meilisearch-ui:latest
```

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
docker run -d --restart=always --name="meilisearch-ui" -p <your-port>:24900 -e BASE_PATH="/meilisearch-ui" riccoxie/meilisearch-ui:latest
```

### 单实例模式 Singleton mode

参考这个[问题](https://github.com/riccox/meilisearch-ui/issues/43).

如果你想在这个应用中只使用一个meilisearch实例，你可以通过下面的配置启用单例模式。

然后，当你打开这个应用程序时，你将直接跳转到实例页面。

只需要像下面这样用一些环境变量启动这个应用程序。

```sh
VITE_SINGLETON_MODE=true
VITE_SINGLETON_HOST=http://localhost:27700
VITE_SINGLETON_API_KEY=your-api-key
```

- `VITE_SINGLETON_MODE` 用于启用单例模式。
- `VITE_SINGLETON_HOST` 是 Meilisearch 实例的主机URL。
- `VITE_SINGLETON_API_KEY` 是 Meilisearch 实例的 Master Key。

## 开发

> 先安装 [pnpm](https://pnpm.io/installation).

```sh
git clone git@github.com:riccox/meilisearch-ui.git

cd meilisearch-ui

pnpm install

pnpm dev
```

## 共同构建 ♥

- Meilisearch
- Tanstack
- React v18
- Arco design
- Semi UI
- Mantine UI
- Next UI
- Radix UI
- Tabler Icon
- Lucide Icon
- Monaco Editor for react
- TypeScript
- Vite
- Zustand
- TailwindCSS
- React Error Boundary
- Prettier
- Fuse.js
- Echarts
- Lodash.js
- Immer
- Ahooks
- Framer motion
- react-json-view
- Dayjs
- I18Next
- UnoCSS
- qs
- Sonner
- Vaul
- Zod
