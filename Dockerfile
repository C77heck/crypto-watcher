FROM node:16

MAINTAINER Csilleri Zoltan <zcsilleri@gmail.com>

WORKDIR /var/www

COPY package*.json ./

RUN npm install

ENV MONGO_URL=mongodb://host.docker.internal:27017/crypto
ENV REDIS_HOST=host.docker.internal

COPY . .

# we set the port to run the application
ENV PORT=33453
# expose the port where the application is running
EXPOSE 33453
# docker run -p 33453:33453 -d <containerID>

CMD [ "node", "app.js" ]

# docker build -t <image-name/and-tag> .
