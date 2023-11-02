FROM node:18-slim

# Setting working directory.
WORKDIR /opt/meilisearch-ui

RUN npm install -g pnpm

# Copying source files
COPY . .

# Installing dependencies
RUN pnpm install

EXPOSE 24900

# Running the app
CMD ["pnpm", "run", "start"]
