# ---- Build Stage ----
FROM node:24 AS builder

WORKDIR /app

# Copy manifests (add yarn.lock if you commit it)
COPY package.json ./
# Copy scripts needed during install (postinstall)
COPY scripts ./scripts

# Install deps
RUN yarn install --non-interactive

# Copy rest of source
COPY . .

# Build
RUN yarn build

# Prune to production deps
RUN rm -rf node_modules && YARN_PRODUCTION=true yarn install --non-interactive --production

# ---- Production Stage ----
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4200
CMD ["node", "build"]