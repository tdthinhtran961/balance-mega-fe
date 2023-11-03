# get the base node image
FROM node:16-alpine as builder

# set the working dir for container
WORKDIR /frontend

# copy the json file first
COPY ./package.json /frontend

# install npm dependencies
RUN npm install

# copy other project files
COPY . .

ARG ENV
ENV ENV $ENV

RUN npm run build:${ENV}

# Handle Nginx
FROM nginx
ARG ENV
ENV ENV $ENV
COPY ./docker/nginx-${ENV}/balance.cert /etc/nginx/
COPY ./docker/nginx-${ENV}/balance.key /etc/nginx
COPY --from=builder /frontend/build /usr/share/nginx/html
COPY ./docker/nginx-${ENV}/default.conf /etc/nginx/conf.d/default.conf

