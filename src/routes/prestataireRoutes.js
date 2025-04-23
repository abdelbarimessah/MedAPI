/**
 * @swagger
 * components:
 *   schemas:
 *     Prestataire:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         nomEtablissement:
 *           type: string
 *         description:
 *           type: string
 *         specialites:
 *           type: array
 *           items:
 *             type: string
 *         adresse:
 *           type: string
 *         telephoneProfessionnel:
 *           type: number
 *         horairesDisponibilite:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ouverture:
 *                 type: string
 *                 format: time
 *                 example: "09:00"
 *               fermeture:
 *                 type: string
 *                 format: time
 *                 example: "17:00"
 *               jour:
 *                 type: string
 *                 example: "Monday"
 *         tarifs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               service:
 *                 type: string
 *               prix:
 *                 type: number
 *         avis:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               utilisateurId:
 *                 type: number
 *                 description: "Unique identifier for the user"
 *               note:
 *                 type: number
 *               commentaire:
 *                 type: string
 *               dateAvis:
 *                 type: string
 *                 format: date-time
 *         isBanned:
 *           type: boolean
 *         chances_left:
 *           type: integer
 *           minimum: 0
 *           maximum: 3
 *           description: "Chances left for the user before being banned; can be between 0 and 3"
 *           example: 2
 * 
 * /api/prestataires:
 *   get:
 *     summary: Get all prestataires 
 *     tags: [Prestataires]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of prestataires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestataire'
 * 
 * /api/prestataires/{id}:
 *   get:
 *     summary: Get a prestataire by ID
 *     tags: [Prestataires]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Prestataire found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prestataire'
 * 
 *   put:
 *     summary: Update a prestataire by ID
 *     tags: [Prestataires]
 *     security:
 *       - BearerAuth: []
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
 *             $ref: '#/components/schemas/Prestataire'
 *     responses:
 *       '200':
 *         description: Prestataire updated successfully
 * 
 *   delete:
 *     summary: Delete a prestataire by ID
 *     tags: [Prestataires]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Prestataire deleted successfully
 * 
 * /rdv/{id}/accept:
 *   patch:
 *     summary: Accept an appointment
 *     description: Accept an appointment as a prestataire.
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the appointment to accept.
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
 *         description: Appointment successfully accepted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment accepted successfully!
 *                 appointment:
 *                   type: object
 *                   description: The updated appointment details.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. The user does not have the required role.
 *       404:
 *         description: Appointment not found.
 *       500:
 *         description: Internal Server Error.
 *
 * /rdv/{id}/reject:
 *   patch:
 *     summary: Reject an appointment
 *     description: Reject an appointment as a prestataire.
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the appointment to reject.
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
 *         description: Appointment successfully rejected.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment rejected successfully!
 *                 appointment:
 *                   type: object
 *                   description: The updated appointment details.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. The user does not have the required role.
 *       404:
 *         description: Appointment not found.
 *       500:
 *         description: Internal Server Error.
 */

const express = require('express');
const router = express.Router();
const prestataireController = require('../controllers/prestataireController');
const { ensureAuthenticated, verifyRole} = require('../middleware/auth');
const { validatePrestataire, handleValidationErrors } = require('../middleware/validator');


router.get("/",ensureAuthenticated, prestataireController.getAllPrestataires);
router.patch("/rdv/:id/accept",ensureAuthenticated, verifyRole(["prestataire"]),prestataireController.acceptAppointment);
router.patch("/rdv/:id/reject",ensureAuthenticated, verifyRole(["prestataire"]),prestataireController.rejectAppointment);
router.get("/:id",ensureAuthenticated,prestataireController.getPrestataire);
router.put("/:id",ensureAuthenticated, validatePrestataire,handleValidationErrors, prestataireController.editPrestataire);
router.patch("/:id/notifications/read",ensureAuthenticated,prestataireController.markAllNotificationsAsRead);
router.delete("/:id",ensureAuthenticated,verifyRole(['prestataire','admin']), prestataireController.deletePrestataire);

module.exports = router;