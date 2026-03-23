# Stage 1: Build
FROM node:22 AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy app code
COPY . .

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy only necessary files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy app code from builder
COPY --from=builder /usr/src/app .

# Expose the port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start the app
CMD ["node", "app.js"]