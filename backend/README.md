# Backend Service

## Development Setup

### Prerequisites
- Docker and Docker Compose installed
- Node.js/Yarn (if developing outside containers)

## Common Commands

### 🐳 Docker-Based Workflow

#### Run Tests
```sh
docker compose exec backend yarn test


# Add a dependency
docker compose exec backend yarn add <package>

# Remove a dependency
docker compose exec backend yarn remove <package>

# Install all dependencies (if package.json changes)
docker compose exec backend yarn install