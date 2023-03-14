FROM node:16-alpine as builder

RUN apk add --update bash

# Setting working directory.
WORKDIR /opt/meilisearch-ui

RUN npm install -g pnpm

# Copying source files
COPY . .

# Installing dependencies
RUN pnpm install

EXPOSE 24900

# Running the app
CMD ["pnpm","run","start"]