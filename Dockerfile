FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod
FROM node:22-bookworm-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/data/apps ./data/apps
COPY --from=build /app/data/categories.json /app/data/exchange.json /app/data/icons.json ./data/
COPY --from=build /app/public ./public
COPY --from=build /app/migrations ./migrations
COPY package.json ./
RUN mkdir -p /data && chown -R node:node /data /app/data
USER node
ENV HOST=0.0.0.0 PORT=4311 NODE_ENV=production APP_ENV=production DATA_DIR=/data
EXPOSE 4311
CMD ["node","dist/server/entry.mjs"]
