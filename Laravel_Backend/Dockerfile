FROM php:8.3-cli

RUN apt-get update && apt-get install -y     git unzip zip libzip-dev libssl-dev pkg-config     && docker-php-ext-install pdo pdo_mysql zip

RUN pecl install mongodb && docker-php-ext-enable mongodb

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan storage:link || true

EXPOSE 10000

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
