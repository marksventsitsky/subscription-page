# Frontend build stage
FROM node:22.18.0 AS frontend-build
WORKDIR /opt/app

COPY frontend/package*.json ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.node.json ./
COPY frontend/vite.config.ts ./
COPY frontend/postcss.config.cjs ./

RUN npm ci --legacy-peer-deps

COPY frontend/ .

RUN npm run build

RUN npm cache clean --force

# Backend build stage
FROM node:22.18.0 AS backend-build
WORKDIR /opt/app

COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/tsconfig.build.json ./

RUN npm ci

COPY backend/ .

RUN npm run build

RUN npm cache clean --force 

RUN npm prune --omit=dev

# Final stage
FROM node:22.18.0-alpine
WORKDIR /opt/app

COPY --from=backend-build /opt/app/dist ./dist
COPY --from=backend-build /opt/app/node_modules ./node_modules

# Copy built frontend from frontend-build stage
COPY --from=frontend-build /opt/app/dist ./frontend/

COPY backend/package*.json ./

COPY backend/ecosystem.config.js ./
COPY backend/docker-entrypoint.sh ./

ENV PM2_DISABLE_VERSION_CHECK=true

RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]