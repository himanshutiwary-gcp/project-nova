# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app
# Use the 'project-nova-starter' subdirectory
COPY ./project-nova-starter ./
RUN npm install -g pnpm
RUN pnpm install
# Ensure all build dependencies are there before building
RUN pnpm exec tsc --noEmit || true
RUN pnpm run build

# --- Stage 2: Build Backend ---
FROM node:18-alpine AS backend-builder
WORKDIR /app
# Use the 'nova-backend' subdirectory
COPY ./nova-backend ./
RUN npm install -g pnpm
RUN pnpm install --prod
RUN pnpm exec prisma generate
RUN pnpm exec tsc

# --- Stage 3: Final Production Image ---
FROM node:18-alpine
WORKDIR /app

# Copy backend node_modules from its builder
COPY --from=backend-builder /app/node_modules ./node_modules

# Copy FINAL compiled backend code from its builder
COPY --from=backend-builder /app/dist ./dist

# Copy backend's package.json and prisma schema for runtime
COPY ./nova-backend/package.json .
COPY ./nova-backend/prisma ./prisma

# Copy the BUILT frontend into a 'public' folder for serving
COPY --from=frontend-builder /app/dist ./public

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
