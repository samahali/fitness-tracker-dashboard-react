# 🛠️ Step 1: Build Frontend using Node.js
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Copy package.json and yarn.lock first to leverage Docker cache
COPY ./package.json ./yarn.lock ./

# Install dependencies
RUN yarn install --immutable --network-timeout 1000000

# Copy the frontend source code
COPY . .  

# Build the frontend
RUN yarn build

# 🚀 Step 2: Use Nginx to Serve the Frontend
FROM nginx:alpine

# Copy built frontend files from builder stage to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional, if you need custom settings)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

