// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/authController");
// const { authenticateToken } = require("../middleware/authMiddleware");
// const {
//   validateUserRegistration,
//   validateUserLogin,
// } = require("../middleware/validationMiddleware");

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       required:
//  *         - email
//  *         - password
//  *         - name
//  *         - role
//  *       properties:
//  *         id:
//  *           type: integer
//  *           description: Auto-generated user ID
//  *         email:
//  *           type: string
//  *           format: email
//  *           description: User's email address
//  *         password:
//  *           type: string
//  *           description: User's password (min 6 characters)
//  *         name:
//  *           type: string
//  *           description: User's full name
//  *         role:
//  *           type: string
//  *           enum: [Admin, Manager, Developer]
//  *           description: User's role in the system
//  *         isActive:
//  *           type: boolean
//  *           description: Whether the user account is active
//  *         lastLoginAt:
//  *           type: string
//  *           format: date-time
//  *           description: Last login timestamp
//  *         createdAt:
//  *           type: string
//  *           format: date-time
//  *           description: Account creation timestamp
//  *         updatedAt:
//  *           type: string
//  *           format: date-time
//  *           description: Last update timestamp
//  *     LoginRequest:
//  *       type: object
//  *       required:
//  *         - email
//  *         - password
//  *       properties:
//  *         email:
//  *           type: string
//  *           format: email
//  *           description: User's email address
//  *         password:
//  *           type: string
//  *           description: User's password
//  *     RegisterRequest:
//  *       type: object
//  *       required:
//  *         - email
//  *         - password
//  *         - name
//  *         - role
//  *       properties:
//  *         email:
//  *           type: string
//  *           format: email
//  *           description: User's email address
//  *         password:
//  *           type: string
//  *           description: User's password (min 6 characters)
//  *         name:
//  *           type: string
//  *           description: User's full name
//  *         role:
//  *           type: string
//  *           enum: [Admin, Manager, Developer]
//  *           description: User's role in the system
//  *     AuthResponse:
//  *       type: object
//  *       properties:
//  *         success:
//  *           type: boolean
//  *           description: Request success status
//  *         message:
//  *           type: string
//  *           description: Response message
//  *         data:
//  *           type: object
//  *           properties:
//  *             user:
//  *               $ref: '#/components/schemas/User'
//  *             token:
//  *               type: string
//  *               description: JWT authentication token
//  *     ErrorResponse:
//  *       type: object
//  *       properties:
//  *         success:
//  *           type: boolean
//  *           example: false
//  *         message:
//  *           type: string
//  *           description: Error message
//  *         error:
//  *           type: string
//  *           description: Error code
//  */

// /**
//  * @swagger
//  * /auth/register:
//  *   post:
//  *     summary: Register a new user (Admin only)
//  *     description: Create a new user account. Only admins can register new users.
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/RegisterRequest'
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/AuthResponse'
//  *       400:
//  *         description: Bad request - validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *       401:
//  *         description: Unauthorized - admin access required
//  *       409:
//  *         description: Conflict - email already exists
//  */
// router.post("/register", validateUserRegistration, authController.registerUser);

// /**
//  * @swagger
//  * /auth/login:
//  *   post:
//  *     summary: Login user
//  *     description: Authenticate user and return JWT token
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/LoginRequest'
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/AuthResponse'
//  *       400:
//  *         description: Bad request - validation error
//  *       401:
//  *         description: Unauthorized - invalid credentials
//  */
// router.post("/login", validateUserLogin, authController.loginUser);

// /**
//  * @swagger
//  * /auth/me:
//  *   get:
//  *     summary: Get current user profile
//  *     description: Retrieve the profile of the currently authenticated user
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   $ref: '#/components/schemas/User'
//  *       401:
//  *         description: Unauthorized - invalid or missing token
//  */
// router.get("/me", authenticateToken, authController.getCurrentUser);

// /**
//  * @swagger
//  * /auth/me:
//  *   put:
//  *     summary: Update current user profile
//  *     description: Update the profile of the currently authenticated user
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 description: User's full name
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 description: User's email address
//  *     responses:
//  *       200:
//  *         description: Profile updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   $ref: '#/components/schemas/User'
//  *       400:
//  *         description: Bad request - validation error
//  *       401:
//  *         description: Unauthorized - invalid or missing token
//  */
// router.put("/me", authenticateToken, authController.updateCurrentUser);

// /**
//  * @swagger
//  * /auth/change-password:
//  *   put:
//  *     summary: Change password
//  *     description: Change the password of the currently authenticated user
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - currentPassword
//  *               - newPassword
//  *             properties:
//  *               currentPassword:
//  *                 type: string
//  *                 description: Current password
//  *               newPassword:
//  *                 type: string
//  *                 description: New password (min 6 characters)
//  *     responses:
//  *       200:
//  *         description: Password changed successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Password changed successfully
//  *       400:
//  *         description: Bad request - validation error
//  *       401:
//  *         description: Unauthorized - invalid current password
//  */
// router.put(
//   "/change-password",
//   authenticateToken,
//   authController.changePassword
// );

// /**
//  * @swagger
//  * /auth/refresh:
//  *   post:
//  *     summary: Refresh token
//  *     description: Get a new access token using a refresh token
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - refreshToken
//  *             properties:
//  *               refreshToken:
//  *                 type: string
//  *                 description: Refresh token
//  *     responses:
//  *       200:
//  *         description: Token refreshed successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     token:
//  *                       type: string
//  *                       description: New JWT access token
//  *       401:
//  *         description: Unauthorized - invalid refresh token
//  */
// router.post("/refresh", authController.refreshToken);

// /**
//  * @swagger
//  * /auth/logout:
//  *   post:
//  *     summary: Logout user
//  *     description: Logout the currently authenticated user (client-side token removal)
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Logout successful
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Logout successful
//  *       401:
//  *         description: Unauthorized - invalid or missing token
//  */
// router.post("/logout", authenticateToken, authController.logoutUser);

// module.exports = router;

const express = require("express");
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const {
  validateUserRegisterData,
  validateUserLoginData,
} = require("../validations/validateUserData");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  authenticateToken,
  requireAdmin,
  validateRequest(validateUserRegisterData),
  register
);
router.post("/login", validateRequest(validateUserLoginData), login);
router.get("/me", authenticateToken, getCurrentUser);

module.exports = router;
