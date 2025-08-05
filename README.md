# Портфолио John Wayne

Минималистичный лендинг-сайт портфолио с админ-панелью и интеграцией Telegram, готовый к деплою на Netlify.

## 🚀 Быстрый старт

### Локальная разработка

1. **Установка зависимостей:**
```bash
npm install
```

2. **Настройка переменных окружения:**
Создайте файл `.env` в корне проекта:
```env
DATABASE_URL=postgresql://username:password@host:port/database
ADMIN_PASSWORD=ваш_пароль_админки
BOT_TOKEN=ваш_telegram_bot_token
TELEGRAM_CHAT_ID=ваш_chat_id
```

3. **Настройка базы данных:**
```bash
npm run db:push
```

4. **Запуск проекта:**
```bash
npm run dev
```

## 📱 Деплой на Netlify

### Шаг 1: Создание базы данных

Поскольку Netlify не предоставляет встроенную PostgreSQL базу данных, используйте один из этих сервисов:

#### Вариант A: Neon (Рекомендуется)
1. Зайдите на [neon.tech](https://neon.tech)
2. Создайте бесплатный аккаунт
3. Создайте новую базу данных
4. Скопируйте строку подключения (CONNECTION_STRING)

#### Вариант B: Supabase
1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В настройках найдите Database URL

#### Вариант C: Railway
1. Зайдите на [railway.app](https://railway.app)
2. Создайте PostgreSQL сервис
3. Скопируйте CONNECTION_URL

### Шаг 2: Деплой на Netlify

1. **Подключите репозиторий:**
   - Зайдите на [netlify.com](https://netlify.com)
   - Нажмите "New site from Git"
   - Выберите ваш репозиторий

2. **Настройте сборку:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Добавьте переменные окружения:**
   Зайдите в Site settings → Environment variables и добавьте:
   ```
   DATABASE_URL=ваша_строка_подключения_к_базе
   ADMIN_PASSWORD=ваш_пароль_админки
   BOT_TOKEN=ваш_telegram_bot_token (опционально)
   TELEGRAM_CHAT_ID=ваш_chat_id (опционально)
   ```

4. **Деплой:**
   Нажмите "Deploy site"

### Шаг 3: Инициализация базы данных

После успешного деплоя нужно создать таблицы в базе данных:

1. **Вариант A: Локально через Drizzle**
```bash
# Установите переменную DATABASE_URL
export DATABASE_URL="ваша_строка_подключения"
npm run db:push
```

2. **Вариант B: Через SQL-запросы**
Выполните SQL-запросы в консоли вашей базы данных:

```sql
-- Создание таблиц
CREATE TABLE IF NOT EXISTS "profile" (
    "id" serial PRIMARY KEY NOT NULL,
    "firstName" varchar(255) NOT NULL,
    "lastName" varchar(255) NOT NULL,
    "description" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "portfolio_items" (
    "id" varchar(255) PRIMARY KEY NOT NULL,
    "title" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "image" varchar(255) NOT NULL,
    "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "services" (
    "id" varchar(255) PRIMARY KEY NOT NULL,
    "title" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "price" varchar(255) NOT NULL,
    "audience" varchar(255) NOT NULL,
    "format" varchar(255) NOT NULL,
    "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "settings" (
    "key" varchar(255) PRIMARY KEY NOT NULL,
    "value" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "contacts" (
    "id" serial PRIMARY KEY NOT NULL,
    "telegram" varchar(255) NOT NULL DEFAULT '',
    "github" varchar(255) NOT NULL DEFAULT ''
);

-- Вставка начальных данных
INSERT INTO "profile" ("firstName", "lastName", "description") 
VALUES ('John', 'Wayne', 'Профессиональный веб-разработчик и дизайнер с опытом создания современных цифровых решений. Специализируюсь на разработке пользовательских интерфейсов и создании незабываемого пользовательского опыта.')
ON CONFLICT DO NOTHING;

INSERT INTO "contacts" ("telegram", "github") 
VALUES ('', '')
ON CONFLICT DO NOTHING;

INSERT INTO "settings" ("key", "value") 
VALUES ('backgroundVideo', '')
ON CONFLICT DO NOTHING;
```

## 🔧 Настройка Telegram бота (Опционально)

Для работы формы обратной связи:

1. **Создайте бота:**
   - Напишите [@BotFather](https://t.me/botfather) в Telegram
   - Отправьте `/newbot`
   - Следуйте инструкциям
   - Скопируйте токен бота

2. **Получите Chat ID:**
   - Добавьте бота в чат или группу
   - Отправьте сообщение боту
   - Перейдите по ссылке: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
   - Найдите `chat.id` в ответе

3. **Добавьте переменные в Netlify:**
   - `BOT_TOKEN`: токен вашего бота
   - `TELEGRAM_CHAT_ID`: ID чата

## 📋 Функционал

### Публичная часть:
- **Героическая секция** с фоновым изображением
- **Секция "Обо мне"** с личной информацией
- **Видео секция** с фоновым видео
- **Портфолио** с примерами работ
- **Услуги** с описанием предложений
- **Контакты** с формой обратной связи и социальными ссылками

### Админ-панель (`/admin`):
- **Управление профилем** (имя, описание)
- **Управление видео** (фоновое видео)
- **Управление портфолио** (добавление/редактирование работ)
- **Управление услугами** (добавление/редактирование услуг)
- **Управление контактами** (Telegram, GitHub ссылки)

## 🔐 Доступ к админ-панели

1. Перейдите на `/admin`
2. Введите пароль (по умолчанию: `admin123`)
3. Управляйте контентом через интуитивный интерфейс

## 🛠️ Техническая архитектура

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **База данных**: PostgreSQL + Drizzle ORM
- **Деплой**: Netlify Functions
- **Маршрутизация**: Wouter
- **Состояние**: TanStack Query
- **UI компоненты**: Shadcn/ui + Radix UI

## 📝 Устранение неполадок

### "Page not found" на Netlify
Файлы `_redirects` и `netlify.toml` уже настроены для правильной работы SPA.

### Проблемы с базой данных
1. Проверьте правильность `DATABASE_URL`
2. Убедитесь, что база данных доступна извне
3. Выполните миграции через `npm run db:push`

### Форма обратной связи не работает
1. Проверьте `BOT_TOKEN` и `TELEGRAM_CHAT_ID`
2. Убедитесь, что бот добавлен в чат
3. Проверьте логи Netlify Functions

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Netlify Functions
2. Убедитесь в правильности переменных окружения
3. Проверьте доступность базы данных

---

**Автор**: John Wayne  
**Лицензия**: MIT