# Production dependencies stage
FROM node:22.18.0-alpine AS deps
WORKDIR /opt/app

COPY backend/package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

# Final stage
FROM node:22.18.0-alpine
WORKDIR /opt/app

# Copy production dependencies
COPY --from=deps /opt/app/node_modules ./node_modules

# Copy pre-built backend
COPY backend/dist ./dist

# Copy pre-built frontend
COPY frontend/dist ./frontend/

COPY backend/package*.json ./
COPY backend/ecosystem.config.js ./
COPY backend/docker-entrypoint.sh ./

ENV PM2_DISABLE_VERSION_CHECK=true

RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]