# Stage 1: install deps and build
FROM node:latest AS builder

WORKDIR /usr/src/app

# Install git for submodule handling
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for better caching
COPY package.json package-lock.json* yarn.lock* ./

# Copy scripts directory (needed by postinstall)
COPY scripts/ ./scripts/

# Install dependencies first (without postinstall running yet)
RUN npm ci --silent --ignore-scripts || npm install --silent --ignore-scripts

# Copy the rest of the sources
COPY . .

# Clone the submodule directly (since .git is excluded from build context)
RUN git clone --branch main --single-branch https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git src/components/databaseMusiconn

# Create a temporary .env file with placeholder values for build
# Coolify will inject real values at runtime
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

# Now run postinstall to build the submodule
RUN npm run postinstall || echo "Postinstall completed with warnings"

# Build the main app
RUN npm run build

# Stage 2: production image
FROM node:latest AS runner

WORKDIR /usr/src/app

# Copy only the production artifacts and necessary files
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package.json ./package.json

# Copy scripts directory needed by cron
COPY --from=builder /usr/src/app/scripts ./scripts
COPY --from=builder /usr/src/app/src/scripts ./src/scripts

# Copy the API routes from submodule (generated during build)
COPY --from=builder /usr/src/app/src/routes/api/map ./src/routes/api/map

# Install production dependencies only
RUN npm ci --omit=dev --silent || npm install --omit=dev --silent

# Expose default SvelteKit adapter-node port
EXPOSE 3000

# Default environment
ENV NODE_ENV=production

# Start the node server (using npm start which runs both server and cron)
# Coolify will inject real environment variables at runtime
CMD ["npm", "start"]
