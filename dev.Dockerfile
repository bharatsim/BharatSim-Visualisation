FROM node:14.15.4-alpine

RUN apk add --no-cache curl
WORKDIR /visualisation
COPY . /visualisation
RUN yarn deep-clean
RUN yarn install
RUN yarn install-deps
