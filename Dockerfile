FROM node:18-slim

# Setting working directory.
WORKDIR /opt/meilisearch-ui

RUN npm install -g pnpm

# Copying source files
COPY . .

# Installing dependencies
RUN pnpm install --frozen-lockfile

EXPOSE 3000

# Running the app
CMD ["pnpm", "run", "start"]
