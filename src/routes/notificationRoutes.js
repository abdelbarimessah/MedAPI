/**
 * @swagger
 * /{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     description: Mark a specific notification as read for the authenticated user.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to mark as read.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification successfully marked as read.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification marked as read.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal Server Error.
 *
 * /{id}/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieve all notifications for the authenticated user.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose notifications are being retrieved.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifications successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: [{ id: "123", message: "You have a new appointment!" }]
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: User or notifications not found.
 *       500:
 *         description: Internal Server Error.
 *
 * /{id}:
 *   delete:
 *     summary: Delete a notification
 *     description: Delete a specific notification for the authenticated user.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to delete.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification deleted successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal Server Error.
 */



const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { ensureAuthenticated } = require('../middleware/auth');

router.put("/:id/read",ensureAuthenticated, NotificationController.markNotificationAsRead);
router.get("/:id/notifications",ensureAuthenticated,NotificationController.getUserNotification);
router.delete("/:id",ensureAuthenticated, NotificationController.deleteNotification);

module.exports = router;