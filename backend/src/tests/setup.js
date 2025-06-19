// Test setup file for Jest
require("dotenv").config();

// Set test environment
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "sqlite:./test-database.sqlite";
process.env.JWT_SECRET = "test-jwt-secret";

// Increase timeout for database operations
jest.setTimeout(10000);

// Global test setup
beforeAll(async () => {
  // Import database and models
  const { sequelize } = require("../config/database");
  require("../models");

  // Sync database for testing
  await sequelize.sync({ force: true });
});

// Global test teardown
afterAll(async () => {
  const { sequelize } = require("../config/database");
  await sequelize.close();
});

// Suppress console logs during tests unless explicitly needed
if (process.env.NODE_ENV === "test") {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}
