const request = require("supertest");
const app = require("../app");
const { User } = require("../models");

describe("Authentication Endpoints", () => {
  let testUser;

  beforeAll(async () => {
    // Clean up database before tests
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    // Clean up after tests
    await User.destroy({ where: {} });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "TestPass123",
        name: "Test User",
        role: "Developer",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.role).toBe(userData.role);
      expect(response.body.data.user).not.toHaveProperty("password");
      expect(response.body.data).toHaveProperty("token");

      testUser = response.body.data.user;
    });

    it("should return error for duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        password: "TestPass123",
        name: "Test User 2",
        role: "Developer",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("USER_EXISTS");
    });

    it("should return error for invalid email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "TestPass123",
        name: "Test User",
        role: "Developer",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return error for weak password", async () => {
      const userData = {
        email: "test2@example.com",
        password: "123",
        name: "Test User",
        role: "Developer",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user successfully with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "TestPass123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user).not.toHaveProperty("password");
      expect(response.body.data).toHaveProperty("token");
    });

    it("should return error for invalid email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "TestPass123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("INVALID_CREDENTIALS");
    });

    it("should return error for invalid password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "WrongPassword123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("INVALID_CREDENTIALS");
    });

    it("should return error for missing email", async () => {
      const loginData = {
        password: "TestPass123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/auth/me", () => {
    let authToken;

    beforeAll(async () => {
      // Login to get token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "TestPass123",
      });

      authToken = loginResponse.body.data.token;
    });

    it("should get current user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user.email).toBe("test@example.com");
      expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("should return error for missing token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("UNAUTHORIZED");
    });

    it("should return error for invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("INVALID_TOKEN");
    });
  });

  describe("PUT /api/auth/me", () => {
    let authToken;

    beforeAll(async () => {
      // Login to get token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "TestPass123",
      });

      authToken = loginResponse.body.data.token;
    });

    it("should update user profile successfully", async () => {
      const updateData = {
        name: "Updated Test User",
        email: "updated@example.com",
      };

      const response = await request(app)
        .put("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.email).toBe(updateData.email);
    });

    it("should return error for invalid email format", async () => {
      const updateData = {
        email: "invalid-email",
      };

      const response = await request(app)
        .put("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });
});
