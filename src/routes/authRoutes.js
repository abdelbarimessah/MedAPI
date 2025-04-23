/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [client, admin]
 *                 default: client
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 *
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 * 
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Password Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 * 
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Password Management]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset password token received via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 * 
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 authentication
 *     tags: [Google Authentication]
 *     description: Redirects the user to Google's authentication page
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 * 
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback URL
 *     tags: [Google Authentication]
 *     description: Handles the callback from Google after successful authentication
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in successfully with Google
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Error logging out
 * 
 * /api/auth/2fa/enable:
 *   post:
 *     summary: Enable two-factor authentication for the user
 *     tags: [2FA Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Two-factor authentication setup initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 qrCodeUrl:
 *                   type: string
 *                 secret:
 *                   type: string
 *       500:
 *         description: Error setting up 2FA
 * 
 * /api/auth/2fa/verify:
 *   post:
 *     summary: Verify the two-factor authentication code
 *     tags: [2FA Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Two-factor authentication enabled successfully
 *       400:
 *         description: Invalid verification code
 *       500:
 *         description: Error verifying 2FA
 * 
 * /api/auth/2fa/disable:
 *   post:
 *     summary: Disable two-factor authentication for the user
 *     tags: [2FA Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Two-factor authentication disabled successfully
 *       500:
 *         description: Error disabling 2FA
 * 
 * /api/auth/2fa/validate:
 *   post:
 *     summary: Validate the two-factor authentication code
 *     tags: [2FA Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA validation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error validating 2FA
 */

const express = require("express");
const router = express.Router();
const passport = require('passport');
const { loginLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const { validateLogin, validateRegister, handleValidationErrors } = require('../middleware/validator');
const { ensureAuthenticated } = require('../middleware/auth');

router.post('/register',loginLimiter, validateRegister, handleValidationErrors, authController.register);
router.post('/login',loginLimiter, validateLogin, handleValidationErrors, authController.login);
router.post('/logout', loginLimiter, ensureAuthenticated, authController.logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

router.post('/forgot-password', loginLimiter, authController.forgotPassword);
router.post('/reset-password/:token', loginLimiter, authController.resetPassword);

router.post('/2fa/enable', ensureAuthenticated, loginLimiter, authController.enable2FA);
router.post('/2fa/verify', ensureAuthenticated, loginLimiter, authController.verify2FA);
router.post('/2fa/disable', ensureAuthenticated, loginLimiter, authController.disable2FA);
router.post('/2fa/validate', loginLimiter, authController.validate2FA);

module.exports = router;
