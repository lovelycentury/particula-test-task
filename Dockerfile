# Build stage: install dependencies and build the static site.
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
# `@parcel/watcher` (used by sass for watch mode) wants a build script; the build doesn't need it.
ENV pnpm_config_strict_dep_builds=false

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Run stage: serve the built files with nginx.
FROM nginx:1.29-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
