# Используем официальный Node.js образ
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости с игнорированием проблем совместимости
RUN yarn install --frozen-lockfile --ignore-engines

# Копируем исходный код
COPY . .

# Собираем приложение используя TypeScript компилятор напрямую
RUN npx tsc -p tsconfig.build.json

# Production image, только необходимые файлы
FROM node:20-alpine as production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --ignore-engines

# Копируем собранные файлы из builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY .env .env

CMD ["node", "dist/main.js"] 