# Meilisearch-UI

<a href="https://github.com/riccox/meilisearch-ui/actions">![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/riccox/meilisearch-ui/docker-build-release.yaml)</a>
<a href="https://github.com/riccox/meilisearch-ui/releases">![release](https://img.shields.io/github/v/release/riccox/meilisearch-ui?display_name=release)</a>
![stars](https://img.shields.io/github/stars/riccox/meilisearch-ui)
<a href="https://github.com/riccox/meilisearch-ui/issues">![issues](https://img.shields.io/github/issues/riccox/meilisearch-ui)</a>
![last-commit](https://img.shields.io/github/last-commit/riccox/meilisearch-ui)
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui/tags" target="_blank">![Docker Image Version (latest semver)](https://img.shields.io/docker/v/riccoxie/meilisearch-ui?label=image%20version&sort=semver)</a>
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui" target="_blank">![Docker Pulls](https://img.shields.io/docker/pulls/riccoxie/meilisearch-ui)</a>
<a href="https://github.com/riccox/meilisearch-ui/blob/main/LICENSE">![license](https://img.shields.io/github/license/riccox/meilisearch-ui)</a>

<a href="https://www.producthunt.com/posts/meilisearch-ui?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-meilisearch&#0045;ui" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373175&theme=light" alt="Meilisearch&#0045;UI - Pretty&#0044;&#0032;simple&#0032;and&#0032;fast&#0032;meilisearch&#0032;admin&#0032;dashboard | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

#### An open-source, pretty, simple and fast meilisearch admin dashboard UI for managing your meilisearch instances

> [IMPORTANT] The main branch may be unstable or unavailable during development.
>
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

> ⚠️ This app have not achieved responsive design totally, so mind that only use this app on desktop to gain better experience.

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

docker run -d --restart=always --name="meilisearch-ui" -p <your-port>:24900 riccoxie/meilisearch-ui:latest
```

### Deploy on Vercel

You can deploy this app to the cloud
with [Vercel](https://vercel.com?utm_source=github&utm_medium=readme)

Just one click the button below to deploy this app automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Friccox%2Fmeilisearch-ui&project-name=meilisearch-ui)

### Singleton mode

See this [issue](https://github.com/riccox/meilisearch-ui/issues/43).

If you want to use this app with only one meilisearch instance, you can enable the singleton mode by below config.

Then you will directly jump to the instance page when you open this app.

Just need to start this app with some env variables like below.

```sh
VITE_SINGLETON_MODE=true
VITE_SINGLETON_HOST=http://localhost:27700
VITE_SINGLETON_API_KEY=your-api-key
```

- `VITE_SINGLETON_MODE` tell this app to enable singleton mode.
- `VITE_SINGLETON_HOST` is the meilisearch host url.
- `VITE_SINGLETON_API_KEY` is the meilisearch master key.

## Development

```sh
git clone git@github.com:riccox/meilisearch-ui.git

cd meilisearch-ui

pnpm install

pnpm dev
```

## Built with ♥

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
