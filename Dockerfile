FROM php:7.4.33-apache AS base
WORKDIR /app
COPY ./server/composer.json ./server/composer.lock /app/
COPY ./server/classes /app/classes

FROM base AS vendor
RUN apt-get update && \
  apt-get install -y \
  git \
  unzip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
  composer install

FROM node:16 AS build
WORKDIR /app
COPY epsolar-app/package.json epsolar-app/yarn.lock /app/
RUN ["yarn", "--frozen-lockfile"]
COPY epsolar-app /app/
RUN ["yarn", "build"]

FROM base AS final
RUN a2enmod rewrite
RUN docker-php-ext-install sockets
COPY --from=vendor /app/vendor /var/www/html/vendor
COPY --from=build /app/build /var/www/html/app/
COPY ./server/classes /var/www/html/classes
COPY ./server/index.php ./server/.htaccess /var/www/html/