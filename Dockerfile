# Build stage
FROM node:20.8.1-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code (as root to ensure proper permissions)
USER root
COPY . .
RUN chown -R nextjs:nodejs /app
USER nextjs

# Build the application
RUN npx vite build

# Production stage - use nginx for better performance
FROM nginx:alpine

# Install security updates
RUN apk upgrade --no-cache

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]