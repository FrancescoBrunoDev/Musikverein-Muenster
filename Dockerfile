# Stage 1: install deps and build
FROM node:20-slim AS builder

WORKDIR /app

# Install git for submodule handling
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for better caching
COPY package.json package-lock.json* ./
COPY scripts/ ./scripts/

# Install dependencies WITHOUT postinstall (we'll run it after cloning submodule)
RUN npm ci --ignore-scripts || npm install --ignore-scripts

# Copy the rest of the sources
COPY . .

# Clone the submodule directly (git submodules don't work in Docker build context)
RUN rm -rf src/components/databaseMusiconn && \
    git clone --branch main --single-branch --depth 1 https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git src/components/databaseMusiconn

# Run postinstall to copy api/map route from submodule
RUN node scripts/postinstall.js

# Build the app
RUN npm run build

# Verify build output exists
RUN test -d /app/build && echo "Build successful" || (echo "Build failed - no build directory" && exit 1)

# Stage 2: production image
FROM node:20-slim AS runner

WORKDIR /app

# Copy package files first
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/scripts ./scripts

# Install production dependencies only (skip postinstall since build is already done)
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev --ignore-scripts

# Copy build output
COPY --from=builder /app/build ./build

# Expose default SvelteKit adapter-node port
EXPOSE 3000

ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]
