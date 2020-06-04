# stage1 as builder
FROM node:10-alpine as builder

USER root

# change npm's default directory
RUN mkdir ~/.npm-global
RUN npm config set prefix '~/.npm-global'
RUN echo 'export PATH=~/.npm-global/bin:$PATH' > ~/.profile
RUN source ~/.profile

# RUN ls -la /usr/local/lib/node_modules
# RUN sudo chown -R $USER /usr/local/lib/node_modules
# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN  npm install && mkdir /pomodoro && mv ./node_modules ./pomodoro

WORKDIR /pomodoro

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