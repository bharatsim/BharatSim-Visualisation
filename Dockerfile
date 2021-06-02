FROM node:14.15.4-alpine

RUN apk add --no-cache \
        sudo \
        curl \
        bash

WORKDIR /visualisation
COPY . /visualisation
RUN yarn deep-clean
RUN yarn install
RUN export NODE_OPTIONS=--max-old-space-size=8192 && yarn build
