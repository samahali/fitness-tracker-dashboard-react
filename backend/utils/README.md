# Utils (Utility Functions)
This folder contains helper functions that are reusable throughout the project.

## 📌 Common Utility Functions
- `logger.js` - Handles logging for debugging & errors.
- `validator.js` - Validates user inputs before processing requests.
- `dateHelper.js` - Formats dates and time for reports.
- `hashing.js` - Handles password hashing and verification.

## 📍 Example Usage
```javascript
const logger = require("../utils/logger");
logger.info("Server started successfully!");
