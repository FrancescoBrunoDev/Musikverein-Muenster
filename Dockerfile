# ---- Build Stage ----
FROM node:24 AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache. If you have a lockfile (package-lock.json or yarn.lock)
# include it here for more reproducible installs. This project currently has no package-lock, so npm will be used.
# Copy package files first to leverage Docker cache. Include yarn.lock for reproducible installs
COPY package.json yarn.lock ./

# Install full dependencies (including dev deps) required for the build
# Use yarn (this repo uses yarn v1) and respect the lockfile
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the app (runs `vite build` via package.json)
RUN yarn build

# Remove development dependencies to prepare a smaller production image
# Reinstall only production dependencies to shrink node_modules
RUN yarn install --production --frozen-lockfile

# ---- Production Stage ----
# ---- Production Stage ----
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built output and production node_modules from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app listens on (adjust if the server uses another PORT)
EXPOSE 4200

# Run the production server. `node build` is used by the repo's `node-server` script.
CMD ["node", "build"]