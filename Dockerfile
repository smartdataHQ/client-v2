# Build stage
FROM node:20.8.1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN npx vite build

# Production stage
FROM node:20.8.1-alpine

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Install a simple static file server
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the built application
CMD ["serve", "-s", "dist", "-p", "3000"]