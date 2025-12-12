FROM node:20-slim AS builder
RUN corepack enable

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile 

COPY generated ./generated
COPY tsconfig.json .
COPY src ./src

RUN pnpm build

RUN pnpm prune --prod

RUN rm -rf node_modules/.cache
RUN rm -rf node_modules/.prisma/client/*.so.node || true
RUN rm -rf node_modules/typescript
RUN rm -rf node_modules/@types
RUN rm -rf node_modules/prisma
RUN rm -rf node_modules/@prisma/engines-version

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated

EXPOSE 7200
CMD ["dist/server.js"]
