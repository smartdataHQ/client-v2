# Build stage
FROM oven/bun:1.3.5-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code (as root to ensure proper permissions)
USER root
COPY . .
RUN chown -R appuser:appgroup /app
USER appuser

# Build the application (skip postbuild which creates archives we don't need)
RUN bunx --bun vite build

# Production stage - use nginx for better performance
FROM nginx:alpine

# Install security updates
RUN apk upgrade --no-cache

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
