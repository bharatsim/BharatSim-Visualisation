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
        python \
        bash
RUN mkdir visualisation
COPY . /visualisation
WORKDIR /visualisation
RUN npm run deep-clean
RUN npm install
RUN npm run install-deps