FROM nginx:alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

RUN ls

# Copy from the stahg 1
COPY ./build /usr/share/nginx/html

EXPOSE 80 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]