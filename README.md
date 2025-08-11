# Meilisearch-UI

ENGLISH ｜ [中文](./README.zh-CN.md)

<a href="https://github.com/riccox/meilisearch-ui/actions">![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/riccox/meilisearch-ui/docker-build-release.yaml)</a>
<a href="https://github.com/riccox/meilisearch-ui/releases">![release](https://img.shields.io/github/v/release/riccox/meilisearch-ui?display_name=release)</a>
![stars](https://img.shields.io/github/stars/riccox/meilisearch-ui)
<a href="https://github.com/riccox/meilisearch-ui/issues">![issues](https://img.shields.io/github/issues/riccox/meilisearch-ui)</a>
![last-commit](https://img.shields.io/github/last-commit/riccox/meilisearch-ui)
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui/tags" target="_blank">![Docker Image Version (latest semver)](https://img.shields.io/docker/v/riccoxie/meilisearch-ui?label=image%20version&sort=semver)</a>
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui" target="_blank">![Docker Pulls](https://img.shields.io/docker/pulls/riccoxie/meilisearch-ui)</a>
<a href="https://github.com/riccox/meilisearch-ui/blob/main/LICENSE">![license](https://img.shields.io/github/license/riccox/meilisearch-ui)</a>

<a href="https://www.producthunt.com/posts/meilisearch-ui?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-meilisearch&#0045;ui" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373175&theme=light" alt="Meilisearch&#0045;UI - Pretty&#0044;&#0032;simple&#0032;and&#0032;fast&#0032;meilisearch&#0032;admin&#0032;dashboard | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

An open-source, pretty, simple and fast meilisearch admin dashboard UI for managing your meilisearch instances

> [!IMPORTANT]
> The main branch may be unstable or unavailable during development.
> Please use release instead of main branch to obtain a stable version app

## Features

🚀 Indexes CRUD

🔎 Search documents

💪 Documents management

🛠️️ Index settings

⚓ Multiple instances management

🔒 Data is stored inside your browser

📦 Docker image support

🎱 Singleton mode support (easy to integrate with your own apps)

🌐 I18n support (en, zh)

## Quick start

> [!WARNING]
> This app have not achieved responsive design totally, so mind that only use this app on desktop to gain better experience.

### CORS settings

✅ Remember update CORS settings in your instance server for this ui domain before using.

Because this app use meilisearch official JS client to call your meilisearch instance, you need to manually configure CORS settings in your web server to make sure ui panel can access your instance server with api calls.

Add your ui panel deployment domain to your instance server cors list.

ex:

```conf
# ... other configurations
     add_header Access-Control-Allow-Origin "your.meilisearch-ui.domain.com";
# ... other configurations
```

[Learn how to configure CORS settings in your web server](https://enable-cors.org/)

### Online use

There is a live demo 👉 [meilisearch-ui](https://meilisearch-ui.riccox.com), deploy on Vercel.

### Docker

```sh
docker pull riccoxie/meilisearch-ui:latest

docker run -d --restart=on-failure:5 --name="meilisearch-ui" -p <your-port>:24900 riccoxie/meilisearch-ui:latest
```

#### Lightweight mirror image

Due to functions such as adapting custom paths, the main image size will become a burden for some users. If you only need to use the basic functionality of the application, you can use the `lite` variant image, which contains only the necessary constructs and is very small compared to the main image.

For specific image variants, please refer to [Image version list](https://hub.docker.com/r/riccoxie/meilisearch-ui/tags)

lite images do not support the following features:

- Singleton mode

### Deploy on Vercel

You can deploy this app to the cloud
with [Vercel](https://vercel.com?utm_source=github&utm_medium=readme)

Just one click the button below to deploy this app automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Friccox%2Fmeilisearch-ui&project-name=meilisearch-ui)

## Configures

### Base Path

See this [issue](https://github.com/riccox/meilisearch-ui/issues/40).

You can configure the base path of this app by setting the `BASE_PATH` environment variable.

For example, if you want to deploy this app to the `/meilisearch-ui` path, you can set the `BASE_PATH` environment variable to `/meilisearch-ui`.

```sh
docker run -d --restart=on-failure:5 --name="meilisearch-ui" -p <your-port>:24900 -e BASE_PATH="/meilisearch-ui" riccoxie/meilisearch-ui:latest
```



### Singleton mode

See this [issue](https://github.com/riccox/meilisearch-ui/issues/43).

If you want to use this app with only one meilisearch instance, you can enable the singleton mode in two ways:

#### Using Docker (Recommended)

Configure singleton mode using environment variables:

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
> **Security Note**
>
> Any singleton mode relevant env variables exposed in this way will eventually appear in the client package, so you should try to avoid using this method. When using singleton mode packaging, you need to carefully judge the network environment in which you deploy the application, and it is recommended to deploy in a trusted internal network environment.

#### Build from Source

If you need more customization, you can build from source following these steps:

1.Clone this repo

```sh
git clone git@github.com:riccox/meilisearch-ui.git --depth=1
```

2.Go into root dir of repo

```sh
cd meilisearch-ui
```

3.install dependencies

```sh
pnpm install
```

4.create `.env.local` file at root dir of repo, add the following configuration:

```
VITE_SINGLETON_MODE=true
VITE_SINGLETON_HOST=your-meilisearch-host
VITE_SINGLETON_API_KEY=your-api-key
```

> [!CAUTION]
>
> **Security Risk**
>
> See this [issue](https://github.com/riccox/meilisearch-ui/issues/161).
>
> `.env.local` file is local only and you should add it in your `.gitignore` to prevent it from being recorded by git.
>
> At the same time, any variables exposed in this way will eventually appear in the client package, so you should try to avoid using this method. When using singleton mode packaging, you need to carefully judge the network environment in which you deploy the application, and it is recommended to deploy in a trusted internal network environment.

5.Build the app

```sh
pnpm build
```

Once the build is complete, you will find the `dist` directory in the root directory, which is a packaged SPA application directory that can be deployed to any server.

You can preview the packaged singleton mode application locally using the following command:

```sh
pnpm dlx serve dist
```

Regardless of which method you use, when you open the app, you will be directly redirected to the instance page.

## FAQ

### How to allow custom hostnames or reverse proxy domains?

By default, all hosts are allowed and no extra configuration is needed.

Only if you want to restrict allowed hostnames, you can set the optional environment variable `ALLOWED_HOSTS`. For example:

```sh
ALLOWED_HOSTS=demo.ddev.site,another.domain.com
```

If you have no special requirements, you do not need to set this variable.

> **Note:** The `ALLOWED_HOSTS` variable is only available in the full version image. The lite image does not support this feature.

## Development

> [!NOTE]
> Install [pnpm](https://pnpm.io/installation) first.

```sh
git clone git@github.com:riccox/meilisearch-ui.git

cd meilisearch-ui

pnpm install

pnpm dev
```

## Built with ♥

### Core Dependencies
- [Meilisearch](https://github.com/meilisearch/meilisearch) - Search engine
- [React](https://reactjs.org/) v18 - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool

### UI Frameworks & Components
- [Arco Design](https://arco.design/) - Enterprise design system by ByteDance
- [Semi UI](https://semi.design/) - Design system by TikTok Frontend Team
- [Mantine UI](https://mantine.dev/) - Modern React components library
- [Next UI](https://nextui.org/) - Beautiful React UI library
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [UnoCSS](https://unocss.dev/) - Instant atomic CSS engine

### State Management & Data Handling
- [TanStack Query](https://tanstack.com/query/latest) - Powerful async state management
- [TanStack Router](https://tanstack.com/router/latest) - Type-safe routing
- [Zustand](https://zustand-demo.pmnd.rs/) - Simple state management
- [Immer](https://immerjs.github.io/immer/) - Immutable state handling
- [Zod](https://zod.dev/) - TypeScript-first schema validation

### Internationalization & Forms
- [i18next](https://www.i18next.com/) - Internationalization framework
- [React Hook Form](https://react-hook-form.com/) - High-performance forms
- [React Error Boundary](https://github.com/bvaughn/react-error-boundary) - Error handling

### Utilities & Enhancements
- [Lodash](https://lodash.com/) - Utility library
- [Day.js](https://day.js.org/) - Lightweight date handling
- [Fuse.js](https://fusejs.io/) - Fuzzy search library
- [ECharts](https://echarts.apache.org/) - Visualization library
- [ahooks](https://ahooks.js.org/) - React Hooks library

### Development Tools
- [Biome](https://biomejs.dev/) - Code formatting and linting
- [ESLint](https://eslint.org/) - Code quality tool
- [Prettier](https://prettier.io/) - Code formatter

### UI Enhancements
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Tabler Icons](https://tabler-icons.io/) - Icon library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [Vaul](https://vaul.emilkowal.ski/) - Drawer component
