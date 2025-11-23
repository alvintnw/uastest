FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git zip unzip libssl-dev pkg-config \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy ONLY backend folder
COPY umkm-backend/ .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan key:generate
RUN php artisan storage:link || true

EXPOSE 8080

CMD php artisan serve --host 0.0.0.0 --port 8080
