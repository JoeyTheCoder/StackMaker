# Angular Dockerfile
FROM node:16 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/stack-maker-fe /usr/share/nginx/html
