# Use the official Node.js v22.14.0 Alpine image
FROM node:22.14.0-alpine

# Enable Corepack (for Yarn 4+)
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first
COPY package.json yarn.lock ./

# Install Yarn version 4.6.0
RUN corepack prepare yarn@4.6.0 --activate

# Install dependencies without running build scripts
RUN yarn install --mode=skip-build

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend
CMD ["yarn", "run", "start"]
