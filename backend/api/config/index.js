const {port, corsOptions} = require("./server.config");
const {connectDB} = require("./db.config");
const {jwtSecret, jwtExpiresIn} = require("./jwt.config");

module.exports = {
  port,
  connectDB,
  jwtSecret,
  jwtExpiresIn,
}