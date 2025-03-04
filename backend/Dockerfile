# Use the official Node.js v22.14.0 Alpine image
FROM node:22.14.0-alpine

WORKDIR /app

# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.6.0 --activate && yarn set version 4.6.0

# Copy package.json and yarn.lock
COPY ./package.json ./yarn.lock ./

# Verify Yarn version (optional but helpful for debugging)
RUN yarn --version

# Install dependencies (Removed --no-progress)
RUN yarn install --immutable --network-timeout 1000000

# Copy the rest of the backend code
COPY . .  

EXPOSE 5000
CMD ["yarn", "run", "start"]
