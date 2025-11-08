# Stage 1: Build the React + Vite + TypeScript app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Install curl (optional for healthchecks)
RUN apk add --no-cache curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
