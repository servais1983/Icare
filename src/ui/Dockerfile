# --- Stage 1: Build the React application ---
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY ./src/ui/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./src/ui/ ./

# Create necessary directories
RUN mkdir -p src public

# Build the application
RUN npm run build

# --- Stage 2: Serve the application with Nginx ---
FROM nginx:1.25-alpine

# Copy the build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy the custom nginx configuration
COPY ./src/ui/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 