# Meilisearch-UI

<a href="https://github.com/riccox/meilisearch-ui/actions">![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/riccox/meilisearch-ui/docker-build-release.yaml)</a>
<a href="https://github.com/riccox/meilisearch-ui/releases">![release](https://img.shields.io/github/v/release/riccox/meilisearch-ui?display_name=release)</a>
![stars](https://img.shields.io/github/stars/riccox/meilisearch-ui)
<a href="https://github.com/riccox/meilisearch-ui/issues">![issues](https://img.shields.io/github/issues/riccox/meilisearch-ui)</a>
![last-commit](https://img.shields.io/github/last-commit/riccox/meilisearch-ui)
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui/tags" target="_blank">![Docker Image Version (latest semver)](https://img.shields.io/docker/v/riccoxie/meilisearch-ui?label=image%20version&sort=semver)</a>
<a href="https://hub.docker.com/r/riccoxie/meilisearch-ui" target="_blank">![Docker Pulls](https://img.shields.io/docker/pulls/riccoxie/meilisearch-ui)</a>
<a href="https://github.com/riccox/meilisearch-ui/blob/main/LICENSE">![license](https://img.shields.io/github/license/riccox/meilisearch-ui)</a>
<a href="https://meilisearch-ui.riccox.com" target="_blank">![GitHub deployments](https://img.shields.io/github/deployments/riccox/meilisearch-ui/production?label=Demo&nbsp;On&nbsp;Vercel&logo=vercel)</a>

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

## Get start

> [IMPORTANT] Remember enable CORS in your instance server for this ui domain before using.
>
> This version have not achieved responsive design, so mind that only use this app on desktop to gain better experience.

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

## Development

```sh
git clone git@github.com:riccox/meilisearch-ui.git

cd meilisearch-ui

pnpm install

pnpm run dev
```

## Built with ♥

- [Sira-UI](https://sira-design.party)
- React v18
- TypeScript
- Vite
- ReactRouter v6
- Mantine
- Zustand
- Tailwind CSS
- ReactErrorBoundary
- ReactQuery
- Prettier
- Fuse.js
- echarts
- Lodash.js
- Immer
- react-json-view
- Dayjs
