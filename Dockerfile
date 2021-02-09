FROM node:14.15.4-alpine

RUN apk add --no-cache \
        sudo \
        curl \
        build-base \
        g++ \
        libpng \
        libpng-dev \
        jpeg-dev \
        pango-dev \
        cairo-dev \
        giflib-dev \
        python3 \
	shadow \
        bash
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk update
RUN apk add mongodb=3.4.4-r0

RUN mkdir visualisation
#COPY . /visualisation
WORKDIR /visualisation
#RUN yarn deep-clean
#RUN yarn install
#RUN yarn install-deps

#add variables
ENV MONGOMS_SYSTEM_BINARY=/usr/bin/mongod
