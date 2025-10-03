FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Prisma generate early (needs schema)
COPY prisma ./prisma
RUN npx prisma generate

# Build
COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN npm run build

# PM2 for cluster mode
RUN npm i -g pm2

# Runtime image
FROM node:20-alpine
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY ecosystem.config.js ./ecosystem.config.js

# Entrypoint runs migrations, seed, then starts PM2 in cluster mode
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PORT=3000
EXPOSE 3000

CMD ["/entrypoint.sh"]
