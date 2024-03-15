FROM node:18-slim AS build

# Setting working directory.
WORKDIR /opt/meilisearch-ui

RUN npm install -g pnpm

# Copying source files
COPY . .

# Installing dependencies
RUN pnpm install

# Build the app
RUN npm run build

# -------
FROM nginx

COPY --from=build /opt/meilisearch-ui/dist /usr/share/nginx/html

RUN sed -i 's/80/24900/g' /etc/nginx/conf.d/default.conf

EXPOSE 24900
