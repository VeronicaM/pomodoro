# stage1 as builder
FROM node:10-alpine as builder

USER $USER

RUN whoami
# change npm's default directory
WORKDIR /pomodoro

RUN NPM_CONFIG_PREFIX=~/.npm-global
RUN npm -v
RUN node -v

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN  npm install


# Build the project and copy the files
RUN npm rebuild node-sass

COPY . .

RUN ls

RUN npm run build

RUN ls

FROM nginx:alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

RUN ls

# Copy from the stahg 1
COPY --from=builder ./build /usr/share/nginx/html

EXPOSE 80 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]