# Stage 1: Build
FROM node:latest AS builder

WORKDIR /usr/src/app

# Install git for submodule handling
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy manifests and scripts for caching
COPY package.json package-lock.json* yarn.lock* ./
COPY scripts/ ./scripts/

# Install all dependencies (including dev)
RUN npm ci --silent || npm install --silent

# Copy the rest of the source code
COPY . .

# --- Submodule Handling ---
# Remove submodule directory if it exists and clone fresh
RUN rm -rf src/components/databaseMusiconn && \
    git clone --branch main --single-branch https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git src/components/databaseMusiconn

# --- Build-time Environment ---
# Create a temporary .env for SvelteKit build, will be replaced by Coolify at runtime
RUN echo "POKETBASE=http://localhost:8090" > .env && \
    echo "ADMIN_EMAIL=build@placeholder.com" >> .env && \
    echo "ADMIN_PASSWORD=placeholder" >> .env && \
    echo "MINIO_ENDPOINT=localhost" >> .env && \
    echo "MINIO_PORT=9000" >> .env && \
    echo "MINIO_ACCESS_KEY=placeholder" >> .env && \
    echo "MINIO_SECRET_KEY=placeholder" >> .env && \
    echo "MINIO_USE_SSL=false" >> .env && \
    echo "MINIO_BUCKET_NAME=protomaps" >> .env && \
    echo "PROTOMAP_V=placeholder" >> .env

# --- Build Process ---
# 1. Build the submodule via postinstall script
RUN npm run postinstall
# 2. Build the main SvelteKit application
RUN npm run build

# --- Stage 2: Production Runner ---
FROM node:latest AS runner

WORKDIR /usr/src/app

# Copy production artifacts from the builder stage
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json
COPY --from=builder /usr/src/app/scripts ./scripts
# Copy generated API routes from the submodule build
COPY --from=builder /usr/src/app/src/routes/api/map ./src/routes/api/map

# Install only production dependencies
RUN npm ci --omit=dev --silent || npm install --omit=dev --silent

# --- Runtime Configuration ---
EXPOSE 3000
ENV NODE_ENV=production

# Start the node server and the cron job
CMD ["npm", "start"]
