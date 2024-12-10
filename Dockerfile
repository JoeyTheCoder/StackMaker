# Use a lightweight NGINX image to serve the built Angular app
FROM nginx:alpine

# Copy the built Angular files from the host (server directory)
COPY ./dist/stack-maker-fe /usr/share/nginx/html

# Expose port 80 for the NGINX container
EXPOSE 80
