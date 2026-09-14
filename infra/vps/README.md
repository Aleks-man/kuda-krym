# Развёртывание на VPS

Production-стек запускает Caddy, Next.js, API, PostgreSQL и Redis отдельными
контейнерами. Наружу публикуются только порты 80 и 443. Образы приложения
собираются в GitHub Actions после проверок `main` и публикуются в GitHub Container
Registry, поэтому VPS не тратит память и CPU на сборку.

## До слияния в main

В GitHub откройте `Settings` → `Secrets and variables` → `Actions` и создайте
repository secret:

```text
NEXT_PUBLIC_YANDEX_MAPS_API_KEY
```

Значением должен быть ключ JavaScript API Яндекс Карт. Он встраивается в web-образ
при сборке: добавление ключа только в `.env` на VPS карту не включит. В кабинете
Яндекса разрешите домен `kudakrym.ru`.

## Проверка сервера

Убедитесь, что Amnezia или другой сервис не занимает TCP-порты 80 и 443:

```bash
sudo ss -tulpn
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

UDP-порт 443 используется Caddy для HTTP/3. Если только UDP 443 занят VPN,
удалите из `compose.yaml` строку `443:443/udp`: обычный HTTPS продолжит работать
по TCP 443.

Для сервера с 2 ГБ RAM рекомендуется swap объёмом 2 ГБ. Сначала проверьте,
не настроен ли он уже:

```bash
swapon --show
free -h
```

## Первый запуск

Создайте закрытый каталог и скопируйте в него `compose.yaml`, `Caddyfile` и
`.env.example` из `infra/vps`:

```bash
sudo mkdir -p /opt/kuda-krym
sudo chown "$USER":"$USER" /opt/kuda-krym
cd /opt/kuda-krym
cp .env.example .env
chmod 600 .env
```

В `.env` замените оба шаблона пароля одним стойким паролем. В `DATABASE_URL`
пароль должен быть URL-кодирован. Укажите `IMAGE_TAG` равным полному SHA коммита
из `main`, для которого GitHub Actions успешно опубликовал образы. Ключ Яндекс
Карт хранится в `.env` для проверки общей production-конфигурации; в web-образ
его передаёт GitHub Actions.

Если пакеты GHCR закрытые, войдите с GitHub Personal Access Token, имеющим только
право `read:packages`:

```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u Aleks-man --password-stdin
unset GHCR_TOKEN
```

Не сохраняйте токен в `.env` приложения. Проверьте конфигурацию и запустите стек:

```bash
docker compose config --quiet
docker compose pull
docker compose up -d
docker compose ps
```

Миграции запускаются автоматически перед API. Для новой пустой базы один раз
добавьте начальный каталог:

```bash
docker compose --profile tools run --rm seed
```

Повторять seed при обычных обновлениях нельзя: он может перезаписать production-
данные. После первого запуска проверьте сервисы:

```bash
docker compose ps
docker compose logs --tail=100 api web caddy
curl --fail --show-error https://kudakrym.ru/
```

## Обновление

Перед обновлением сохраните дамп базы, поменяйте `IMAGE_TAG` на новый успешный SHA
из `main` и выполните:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

После проверки можно удалить только неиспользуемые образы:

```bash
docker image prune -f
```

Не используйте `docker system prune --volumes`: именованный том PostgreSQL
содержит production-данные.

## Резервная копия и откат

Пример логического бэкапа без установки PostgreSQL на хост:

```bash
mkdir -p backups
docker compose exec -T postgres pg_dump -U kuda_krym -d kuda_krym -Fc > "backups/kuda-krym-$(date +%F-%H%M).dump"
```

Копируйте бэкапы за пределы VPS: файл на том же диске не защищает от отказа
сервера. `docker compose down` не удаляет тома, но использовать `--volumes` в
production нельзя без отдельного подтверждения и проверенной резервной копии.

Для отката задайте `IMAGE_TAG` равным SHA предыдущего успешного коммита и снова
запустите Compose. Миграции Prisma откатываются только отдельной совместимой
миграцией; `prisma migrate reset` в production запрещён.
