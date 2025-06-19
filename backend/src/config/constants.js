require("dotenv").config();

const JWT_PRIVATE_KEY = process.env.JWT_SECRET || "ProjectManagmentTool@123";
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
BCRYPT_ROUNDS = 10;

module.exports = {
  JWT_PRIVATE_KEY,
  PORT,
  DATABASE_URL,
  NODE_ENV,
  ALLOWED_ORIGIN,
  BCRYPT_ROUNDS,
};
