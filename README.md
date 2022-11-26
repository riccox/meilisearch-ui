# Meilisearch-UI

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/riccox/meilisearch-ui/docker-build-release)
![release](https://img.shields.io/github/v/release/riccox/meilisearch-ui?display_name=release)
![stars](https://img.shields.io/github/stars/riccox/meilisearch-ui)
![issues](https://img.shields.io/github/issues/riccox/meilisearch-ui)
![last-commit](https://img.shields.io/github/last-commit/riccox/meilisearch-ui)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/riccoxie/meilisearch-ui?label=image%20version&sort=semver)
![Docker Pulls](https://img.shields.io/docker/pulls/riccoxie/meilisearch-ui)
![license](https://img.shields.io/github/license/riccox/meilisearch-ui)
![GitHub deployments](https://img.shields.io/github/deployments/riccox/meilisearch-ui/production?label=Vercel&logo=vercel)

#### An open-source, pretty, simple and fast meilisearch UI for managing your meilisearch instances

> [IMPORTANT] The main branch may be unstable or unavailable during development.
>
> Please use release instead of main branch to obtain a stable version app

## Online use

There is a live demo 👉 [meilisearch-ui](https://meilisearch-ui.riccox.com), deploy on Vercel.

## Features

🚀 Indexes CRUD

🔎 Search documents

💪 Documents management

🛠️️ Index settings

⚓ Multiple instances management

🔒 Data is stored inside your browser

## Get start

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
