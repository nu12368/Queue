# FROM node:alpine as builder
# WORKDIR /usr/queue

# FROM nginx
# EXPOSE 80
# COPY /usr/queue/frontend /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx
EXPOSE 80

COPY ./ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf