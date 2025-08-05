# John Wayne Portfolio - Лендинг-сайт портфолио

Минималистичный лендинг-сайт портфолио с админ-панелью и интеграцией Telegram, готовый к деплою на Netlify.

## Особенности

- 🎨 Минималистичный дизайн с шрифтом Montserrat
- 📱 Адаптивная верстка для всех устройств
- 🔐 Защищенная админ-панель
- 📧 Отправка форм в Telegram
- 🎞️ Управление фоновым видео
- 🖼️ Управление портфолио
- 💼 Управление услугами
- 🗄️ База данных Neon PostgreSQL

## Технологический стек

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Wouter (роутинг)
- TanStack Query (управление состоянием)
- Framer Motion (анимации)
- Shadcn/ui (компоненты)

### Backend
- Node.js
- Express
- PostgreSQL (Neon)
- Drizzle ORM
- Telegram Bot API

## Структура проекта

```
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # Компоненты UI
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Хуки
│   │   └── lib/            # Утилиты
├── server/                 # Backend (Express)
│   ├── db.ts              # Подключение к БД
│   ├── routes.ts          # API маршруты
│   └── storage.ts         # Работа с данными
├── shared/                 # Общие типы
│   └── schema.ts          # Схема БД
└── package.json
```

## Развертывание на Netlify

### 1. Подготовка к деплою

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build
```

### 2. Создание базы данных на Netlify

1. **Войдите в Netlify Dashboard**
   - Перейдите на [netlify.com](https://netlify.com)
   - Авторизуйтесь в своем аккаунте

2. **Создайте новую базу данных**
   - В боковом меню выберите "Databases" 
   - Нажмите "Create new database"
   - Выберите "PostgreSQL"
   - Введите название базы данных (например: `john-wayne-portfolio`)
   - Выберите регион (рекомендуется тот же, где будет размещен сайт)

3. **Получите строку подключения**
   - После создания БД перейдите во вкладку "Connection"
   - Скопируйте "Connection string" - это будет ваш `DATABASE_URL`

### 3. Деплой на Netlify

#### Способ 1: Через GitHub (рекомендуется)

1. **Загрузите код в GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ваш-username/john-wayne-portfolio.git
   git push -u origin main
   ```

2. **Подключите к Netlify**
   - В Netlify Dashboard нажмите "Add new site" → "Import an existing project"
   - Выберите GitHub и найдите ваш репозиторий
   - Настройки деплоя:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: 18 или выше

#### Способ 2: Через Netlify CLI

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Логин в Netlify
netlify login

# Инициализация проекта
netlify init

# Деплой
netlify deploy --prod
```

### 4. Настройка переменных окружения

В Netlify Dashboard → Site settings → Environment variables добавьте:

#### Обязательные переменные:
```env
DATABASE_URL=postgresql://username:password@hostname:port/database
ADMIN_PASSWORD=ваш_безопасный_пароль_админа
NODE_ENV=production
```

#### Для интеграции Telegram (опционально):
```env
BOT_TOKEN=ваш_токен_бота_telegram
TELEGRAM_CHAT_ID=ваш_chat_id
```

### 5. Применение схемы базы данных

После успешного деплоя:

1. **Через Netlify Functions (автоматически)**
   - Схема БД применится автоматически при первом запуске

2. **Вручную через локальную машину**
   ```bash
   # Установите DATABASE_URL в .env
   echo "DATABASE_URL=ваша_строка_подключения_netlify" > .env
   
   # Примените схему
   npm run db:push
   ```

### 6. Настройка Telegram бота (опционально)

1. **Создайте бота**
   - Напишите [@BotFather](https://t.me/BotFather) в Telegram
   - Выполните команду `/newbot`
   - Следуйте инструкциям и получите токен

2. **Получите Chat ID**
   - Напишите вашему боту любое сообщение
   - Перейдите по ссылке: `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
   - Найдите `chat.id` в ответе

3. **Добавьте переменные в Netlify**
   - `BOT_TOKEN`: токен от BotFather
   - `TELEGRAM_CHAT_ID`: ваш chat ID

### 7. Проверка деплоя

После успешного деплоя:

✅ **Основной сайт**: https://ваш-сайт.netlify.app
- Главная страница с секциями
- Адаптивный дизайн
- Навигация между секциями

✅ **Админ-панель**: https://ваш-сайт.netlify.app/admin
- Авторизация по паролю
- Редактирование профиля
- Управление портфолио и услугами
- Настройка контактов и видео

✅ **База данных**
- Подключение к Netlify PostgreSQL
- Автоматическое создание таблиц
- Сохранение данных

### 8. Послеустановочная настройка

1. **Войдите в админ-панель**
   - Перейдите на `/admin`
   - Введите пароль из `ADMIN_PASSWORD`

2. **Заполните профиль**
   - Имя и фамилия
   - Описание деятельности

3. **Добавьте контент**
   - Загрузите работы в портфолио
   - Опишите ваши услуги
   - Настройте контакты (Telegram, GitHub)
   - Добавьте фоновое видео (опционально)

## Возможные проблемы и решения

### База данных не подключается
```
Error: database "..." does not exist
```
**Решение**: Убедитесь, что DATABASE_URL корректен и база данных создана в Netlify

### Ошибка при применении схемы
```
Failed to create database: org_id is required
```
**Решение**: 
1. Проверьте правильность строки подключения
2. Убедитесь, что база данных активна в Netlify Dashboard
3. Попробуйте пересоздать базу данных

### Telegram не работает
```
Telegram bot token or chat ID not configured
```
**Решение**: Это нормально, если не настроен Telegram. Формы просто не будут отправляться в чат.

### Проблемы с деплоем
- Проверьте команду сборки: `npm run build`
- Убедитесь, что publish directory: `dist`
- Проверьте Node.js версию (минимум 18)

## Поддержка

Если возникли проблемы:
1. Проверьте логи деплоя в Netlify Dashboard
2. Убедитесь в корректности всех переменных окружения
3. Проверьте статус базы данных в Netlify

## Локальная разработка

### Требования
- Node.js 18+
- PostgreSQL (локально или удаленно)

### Запуск
```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env с вашими настройками

# Применение схемы БД
npm run db:push

# Запуск в режиме разработки
npm run dev
```

Сайт будет доступен по адресу: http://localhost:5000
