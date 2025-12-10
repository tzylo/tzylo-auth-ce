FROM node:20-slim AS builder
RUN corepack enable

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY tsconfig.json .
COPY src ./src
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY data ./data
COPY generated ./generated

RUN pnpm build



FROM node:20-slim
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

COPY tsconfig.json .
COPY generated ./generated
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY data ./data
COPY src ./src

EXPOSE 7200
CMD ["node", "dist/server.js"]
