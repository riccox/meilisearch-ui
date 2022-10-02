FROM node:16-alpine

RUN apk add --update bash

# Setting working directory.
WORKDIR /opt/meilisearch-ui

# Installing dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copying source files
COPY . .

EXPOSE 24900

# Running the app
CMD [ "npm", "run", "start" ]