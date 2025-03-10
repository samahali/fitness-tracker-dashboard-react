# Config (Configuration Files)
This folder contains configuration settings for the project.

## 📌 Common Config Files
- `db.config.js` - Configures MongoDB connection using Mongoose.
- `server.config.js` - Stores server settings (port, CORS, etc.).
- `jwt.config.js` - Defines JWT secret key and expiration settings.
- `dotenv.config.js` - Loads environment variables from `.env`.

## 🔹 Environment Variables (`.env`)
To run the project, create a `.env` file in the root directory with the following values:
```env
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_url
JWT_SECRET=your_secret_key
