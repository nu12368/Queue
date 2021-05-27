# FROM node:alpine as builder
# WORKDIR /usr/utilityManage

# FROM nginx
# EXPOSE 80
# COPY /usr/utilityManage/client /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx
EXPOSE 80

COPY ./ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf