FROM node:20-slim AS builder
RUN corepack enable

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json .
COPY src ./src
COPY generated ./generated

RUN pnpm build


FROM node:20-slim
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY generated ./generated

EXPOSE 7200
CMD ["node", "dist/server.js"]
