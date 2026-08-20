# Локальная база данных

Проект использует PostgreSQL 18 и Prisma ORM. База запускается локально и не
входит в Git-репозиторий.

## Требования

- запущенный PostgreSQL 18;
- пользователь PostgreSQL с правом создавать базы;
- свободный порт `5432`.

## Первичная настройка

Создать отдельную базу проекта:

```powershell
createdb -U postgres -h 127.0.0.1 -p 5432 -W kuda_krym
```

Скопировать пример переменных окружения:

```powershell
Copy-Item packages/database/.env.example packages/database/.env
```

Проверить логин, пароль и порт в `packages/database/.env`. Этот файл содержит
локальные учётные данные, исключён из Git и не должен попадать в коммиты.

Применить миграции:

```powershell
npm run migrate:dev --workspace @kuda-krym/database
```

Проверить состояние базы:

```powershell
npm exec --workspace @kuda-krym/database -- prisma migrate status
```

Ожидаемый результат: `Database schema is up to date!`.

## Повседневные команды

После изменения `schema.prisma` создать миграцию с понятным именем:

```powershell
npm run migrate:dev --workspace @kuda-krym/database -- --name change_name
```

Пересоздать типизированный Prisma Client:

```powershell
npm run generate --workspace @kuda-krym/database
```

Открыть Prisma Studio:

```powershell
npm run studio --workspace @kuda-krym/database
```

Команда `migrate:deploy` предназначена для применения уже существующих миграций
в production. Она не создаёт новые миграции.
