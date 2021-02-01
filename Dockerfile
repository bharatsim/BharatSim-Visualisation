FROM node:14.15.4-alpine3.12
COPY package*.json ./
RUN npm install
RUN mkdir visualisation
COPY . ./visualisation
RUN cd visualisation/frontend && yarn install
RUN cd visualisation/backend && yarn install