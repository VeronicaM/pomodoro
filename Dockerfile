# stage1 as builder
FROM node:10-alpine as builder
RUN apk update --no-cache && apk upgrade --no-cache
RUN apk add --update nodejs npm

USER root
WORKDIR /home/pomodoro

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install


COPY . .

# Build the project and copy the files
RUN npm rebuild node-sass
RUN npm run build


FROM nginx:alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /pomodoro/build /usr/share/nginx/html

EXPOSE 80 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]