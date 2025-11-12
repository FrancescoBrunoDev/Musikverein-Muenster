
# Stage 1: install deps and build
FROM node:latest AS builder

WORKDIR /usr/src/app

# Install git for submodule handling
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy package manifests and scripts first for better caching
COPY package.json package-lock.json* yarn.lock* ./
COPY scripts/ ./scripts/

# Use npm (no lockfile detected in repo snapshot). If you prefer yarn, adjust here.
RUN npm ci --silent || npm install --silent

# Copy the rest of the sources
COPY . .

# --- Submodule Handling ---
# Clone the submodule directly (git hooks are for local development)
RUN rm -rf src/components/databaseMusiconn && \
    git clone --branch main --single-branch https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git src/components/databaseMusiconn && \
    echo "Submodule cloned successfully" && \
    ls -la src/components/databaseMusiconn/src/components/ || echo "Warning: submodule structure may be different"

# If you have a .env file with build-time secrets (MINIO_*, etc.), copy it so Vite's static env plugin
# (virtual:env/static/private) can expose the variables during the build.
# This will fail silently if .env is not present in the build context.
ARG COPY_ENV=true
RUN if [ "$COPY_ENV" = "true" ] && [ -f .env ]; then echo "Copying .env for build"; else echo ".env not found or copy disabled"; fi

# Build the app (this project uses Vite / SvelteKit)
RUN npm run build

# Stage 2: production image
FROM node:latest AS runner

WORKDIR /usr/src/app

# Copy only the production artifacts and necessary files
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json* ./
COPY --from=builder /usr/src/app/scripts ./scripts

# Install production dependencies only (skip postinstall since build is already done)
RUN npm ci --omit=dev --ignore-scripts --silent || npm install --omit=dev --ignore-scripts --silent

# Verify files are in place
RUN ls -la /usr/src/app && echo "Build directory contents:" && ls -la /usr/src/app/build || echo "Build directory not found"

# Expose default SvelteKit adapter-node port
EXPOSE 3000

# Default environment
ENV NODE_ENV=production

# Start the node server produced by the adapter-node (package.json "start": runs node-server and cron)
CMD ["sh", "-c", "cd /usr/src/app && npm start"]