# stage1 as builder
FROM node:10-alpine as builder

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN  sudo npm install && mkdir /pomodoro && mv ./node_modules ./pomodoro

WORKDIR /pomodoro

COPY . .

# Build the project and copy the files
RUN sudo npm rebuild node-sass
RUN sudo npm run build


FROM nginx:alpine

## Remove default nginx index page
RUN sudo rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /pomodoro/build /usr/share/nginx/html

EXPOSE 80 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]