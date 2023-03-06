FROM node:16-alpine as builder

RUN apk add --update bash

# Setting working directory.
WORKDIR /opt/meilisearch-ui

RUN npm install -g pnpm

# Copying source files
COPY . .

# Installing dependencies
RUN pnpm install

# Build
RUN pnpm build

FROM node:16-alpine

RUN apk add --update bash

# Setting working directory.
WORKDIR /opt/meilisearch-ui

COPY --from=builder /opt/meilisearch-ui/dist /opt/meilisearch-ui/dist

RUN npm install -g serve

EXPOSE 24900

# Running the app
CMD ["serve dist -p 24900"]