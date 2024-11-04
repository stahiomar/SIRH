# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /frontend-service
COPY package*.json ./
RUN npm install
COPY . .
# Build the production version of the React app
RUN npm run build

# Stage 2: Serve the production build with NGINX
FROM nginx:alpine
# Copy the React build from the previous stage to the NGINX html directory
COPY --from=build /frontend-service/build /usr/share/nginx/html
# Expose the port NGINX will serve on
EXPOSE 80
# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
