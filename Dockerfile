# Stage 1: Build
FROM node:latest AS builder

WORKDIR /usr/src/app

# Install git for submodule handling
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Declare build arguments for environment variables
ARG POKETBASE
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD
ARG MINIO_ENDPOINT
ARG MINIO_PORT
ARG MINIO_ACCESS_KEY
ARG MINIO_SECRET_KEY
ARG MINIO_USE_SSL
ARG MINIO_BUCKET_NAME
ARG PROTOMAP_V

# Set them as environment variables for the build
ENV POKETBASE=${POKETBASE}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV MINIO_ENDPOINT=${MINIO_ENDPOINT}
ENV MINIO_PORT=${MINIO_PORT}
ENV MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
ENV MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
ENV MINIO_USE_SSL=${MINIO_USE_SSL}
ENV MINIO_BUCKET_NAME=${MINIO_BUCKET_NAME}
ENV PROTOMAP_V=${PROTOMAP_V}

# Copy package files
COPY package.json package-lock.json* ./

# Copy scripts directory (needed by postinstall)
COPY scripts/ ./scripts/

# Copy source code
COPY . .

# Clone the submodule directly (since .git is excluded)
RUN git clone --branch main --single-branch https://github.com/FrancescoBrunoDev/DatabaseMusiconn.git src/components/databaseMusiconn

# Install all dependencies (postinstall will handle submodule build)
RUN npm install

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:latest AS runner

WORKDIR /usr/src/app

# Copy build artifacts
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package.json ./package.json

# Copy scripts (needed for cron)
COPY --from=builder /usr/src/app/scripts ./scripts
COPY --from=builder /usr/src/app/src/scripts ./src/scripts

# Copy the API routes from submodule (generated during build)
COPY --from=builder /usr/src/app/src/routes/api/map ./src/routes/api/map

# Install production dependencies only
RUN npm ci --omit=dev --silent || npm install --omit=dev --silent

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
