### STAGE 1: Build ###
FROM node:16.14 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install -f
COPY . .
RUN npm i run build 

### STAGE 2: Run ###
FROM nginx:stable
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/manage-rh-frontend /usr/share/nginx/html