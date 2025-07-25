# =================================================================
# Stage 1: Backend Dependencies & Builder
# =================================================================
FROM node:18-alpine AS backend-builder
WORKDIR /app
RUN npm install -g pnpm
COPY ./nova-backend/package.json ./nova-backend/pnpm-lock.yaml ./
RUN pnpm install --force
COPY ./nova-backend ./
RUN pnpm exec prisma generate
RUN pnpm exec tsc
RUN pnpm install --prod --force

# =================================================================
# Stage 2: Frontend Dependencies & Builder
# =================================================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app
RUN npm install -g pnpm
COPY ./project-nova-starter/package.json ./project-nova-starter/pnpm-lock.yaml ./
COPY ./project-nova-starter/tsconfig*.json ./
COPY ./project-nova-starter/vite.config.ts ./
RUN pnpm install --force
COPY ./project-nova-starter ./

# --- THE FINAL DEBUGGING STEP ---
# Print the contents of tsconfig.json to the log.
RUN echo "--- Verifying tsconfig.json contents ---" && cat tsconfig.json
# --------------------------------

# Run the build command with the explicit project flag
RUN pnpm run build

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
