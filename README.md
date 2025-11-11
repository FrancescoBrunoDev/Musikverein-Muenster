# Musikverein-Münster

A SvelteKit application for managing music society exhibitions and events in Münster.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment with Coolify

This project is configured for deployment using Coolify with the Dockerfile.

### Environment Variables

Set these in your Coolify project settings (Project page > gear icon):

- `POKETBASE` - PocketBase backend URL (e.g., `http://localhost:8090`)
- `ADMIN_EMAIL` - Admin email for cron jobs
- `ADMIN_PASSWORD` - Admin password for cron jobs
- `MINIO_ENDPOINT` - MinIO server endpoint
- `MINIO_PORT` - MinIO server port (e.g., `9000`)
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key
- `MINIO_USE_SSL` - Use SSL for MinIO (`true` or `false`)
- `MINIO_BUCKET_NAME` - MinIO bucket name (e.g., `protomaps`)
- `PROTOMAP_V` - ProtoMap tiles version (e.g., `world-v1`)

Reference `.env.example` for sample values.

### Deployment Steps

1. Push your code to GitHub
2. In Coolify, create a new resource and select "Dockerfile" as the build pack
3. Configure the environment variables in the project settings
4. Deploy!
