# ---- Build Stage ----
FROM node:24 AS builder

WORKDIR /app

# Copy only package manifest (no yarn.lock present)
COPY package.json ./

# Install deps (will generate a yarn.lock inside image)
RUN yarn install --non-interactive

# Copy source
COPY . .

# Build (assumes yarn build exists)
RUN yarn build

# Optional: reinstall only production deps (since no lockfile, skip --frozen-lockfile)
RUN rm -rf node_modules && yarn install --production --non-interactive

# ---- Production Stage ----
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy build output and production deps
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4200
CMD ["node", "build"]