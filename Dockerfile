# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY ./project-nova-starter/package.json ./project-nova-starter/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --force
COPY ./project-nova-starter ./
RUN pnpm run build

# --- Stage 2: Build Backend ---
FROM node:18-alpine AS backend-builder
WORKDIR /app
# First, copy the package files
COPY ./nova-backend/package.json ./nova-backend/pnpm-lock.yaml ./
RUN npm install -g pnpm
# NOW, install ALL dependencies so we can use dev tools
RUN pnpm install --force
# THEN, copy the rest of the code
COPY ./nova-backend ./
# NOW, run the dev tool commands
RUN pnpm exec prisma generate
RUN pnpm exec tsc
# FINALLY, for the final image, we'll reinstall only production dependencies
RUN pnpm install --prod --force

# --- Stage 3: Final Production Image ---
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies
COPY --from=backend-builder /app/node_modules ./node_modules
# Copy compiled backend code
COPY --from=backend-builder /app/dist ./dist
# Copy backend package and schema files
COPY --from=backend-builder /app/package.json .
COPY --from=backend-builder /app/prisma ./prisma

# Copy built frontend files
COPY --from=frontend-builder /app/dist ./public

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
