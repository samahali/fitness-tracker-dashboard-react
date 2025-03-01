# Use Node.js v22.14.0 Alpine to build the frontend
FROM node:22.14.0-alpine AS builder

# Enable Corepack (for Yarn 4+)
RUN corepack enable

WORKDIR /app

# Copy package.json and yarn.lock first
COPY package.json yarn.lock ./

# Install Yarn version 4.6.0
RUN corepack prepare yarn@4.6.0 --activate

# Disable PnP and use node_modules
RUN yarn config set nodeLinker node-modules

# Install dependencies
RUN yarn install

# Copy the rest of the frontend code
COPY . .

# Build the frontend
RUN yarn build

# Use Nginx for serving static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the frontend port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
