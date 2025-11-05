# 🚀 Deployment Guide

Быстрый деплой Remnawave Subscription Page на любой VPS с Docker.

## 📋 Prerequisites

- Docker и Docker Compose установлены на сервере
- Доступ к Remnawave API

## 🔧 Quick Start

### 1. Создайте `.env` файл

```bash
# Remnawave API Configuration
REMNAWAVE_API_URL=https://your-api-url.com
REMNAWAVE_API_TOKEN=your-api-token-here

# Application Configuration
NODE_ENV=production
PORT=3010

# Meta Tags
META_TITLE="Subscription Page"
META_DESCRIPTION="View your subscription details"

# JWT Configuration
JWT_SECRET=your-secret-key-here
```

### 2. Создайте `docker-compose.yml`

```yaml
services:
  remnawave-subscription-page:
    image: markrk/subscription-page:latest
    env_file:
      - .env
    ports:
      - '127.0.0.1:3010:3010'
    restart: unless-stopped
```

### 3. Запустите приложение

```bash
docker-compose up -d
```

### 4. Проверьте статус

```bash
docker-compose logs -f
```

## 🔄 Обновление до новой версии

```bash
# Остановите текущий контейнер
docker-compose down

# Скачайте новую версию образа
docker pull markrk/subscription-page:latest

# Запустите обновленную версию
docker-compose up -d
```

## 🐳 Multi-Platform Support

Образ поддерживает следующие платформы:
- `linux/amd64` (Intel/AMD процессоры)
- `linux/arm64` (ARM процессоры, Raspberry Pi, Apple Silicon)

Docker автоматически выберет правильную версию для вашей платформы.

## 🔍 Troubleshooting

### Проверка логов

```bash
docker-compose logs -f remnawave-subscription-page
```

### Перезапуск контейнера

```bash
docker-compose restart
```

### Полная переустановка

```bash
docker-compose down
docker rmi markrk/subscription-page:latest
docker-compose up -d
```

## 📦 DockerHub

Образ доступен на: [markrk/subscription-page](https://hub.docker.com/r/markrk/subscription-page)

## 🔐 API Token Permissions

Убедитесь, что ваш `REMNAWAVE_API_TOKEN` имеет следующие права:
- `HWID Devices Read` или `HWID Full Access`
- `Users Read`
- `Subscriptions Read`

## 🌐 Nginx Configuration

Если используете Nginx как reverse proxy:

```nginx
location /subscription {
    proxy_pass http://127.0.0.1:3010;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## 📝 License

MIT

