FROM nginx:1.16.0-alpine

WORKDIR /var/www
MAINTAINER Csilleri Zoltan <zcsilleri@gmail.com>

RUN apk update
RUN apk add openrc
RUN rm /etc/nginx/conf.d/default.conf

ADD ./dist .
ADD ./scripts/nginx.conf /etc/nginx/conf.d/default.conf
