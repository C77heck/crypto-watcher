FROM node:14.14.0-alpine3.12

MAINTAINER Csilleri Zoltan <zcsilleri@gmail.com>

WORKDIR /var/www

COPY . .
COPY config/config.build.js config/config.js

