/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - clientName
 *         - clientEmail
 *         - clientPhone
 *         - service
 *         - date
 *         - time
 *         - provider
 *         - price
 *       properties:
 *         clientName:
 *           type: string
 *         clientEmail:
 *           type: string
 *         clientPhone:
 *           type: string
 *         service:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         time:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *           default: pending
 *         provider:
 *           type: string
 *         price:
 *           type: number
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *         error:
 *           type: string
 *         count:
 *           type: number
 *
 * /v1/appointment:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Create a new appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *
 * /v1/appointments:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get all appointments
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *
 * /v1/appointment/{id}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get an appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Appointment not found
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Update an appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *   delete:
 *     tags:
 *       - Appointments
 *     summary: Delete an appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         description: Appointment not found
 */

const {Router} = require("express");
const router = Router();
const appointementController = require("../controllers/appointementController");
const sanitize = require("../middleware/sanitize");
const { validateAppointement } = require("../middleware/validator");


router.use("/appointment",sanitize);
router.post("/appointment", validateAppointement, appointementController.createAppointment);
router.get("/appointments", appointementController.getAppointments);
router.get("/appointment/:id", appointementController.getAppointment);
router.put("/appointment/:id",appointementController.updateAppointment);
router.delete("/appointment/:id", appointementController.deleteAppointment);

module.exports = router;
