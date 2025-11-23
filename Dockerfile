FROM php:8.2-fpm

# Install required packages
RUN apt-get update && apt-get install -y \
    git zip unzip libssl-dev pkg-config \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Generate app key
RUN php artisan key:generate

# Create storage symlink
RUN php artisan storage:link || true

EXPOSE 8080

# Start Laravel
CMD php artisan serve --host 0.0.0.0 --port 8080
