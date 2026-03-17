const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - priority
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la tarea (UUID o Timestamp)
 *         title:
 *           type: string
 *           description: Título descriptivo
 *         category:
 *           type: string
 *           enum: [Trabajo, Formación, Equipo]
 *         priority:
 *           type: string
 *           enum: [Alta, Media, Baja]
 *         completed:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: integer
 *           format: int64
 *           description: Timestamp de creación
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Obtiene todas las tareas
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', taskController.getTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarea creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Error de validación (ej. falta el título)
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea por su ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea a eliminar
 *     responses:
 *       204:
 *         description: Tarea eliminada correctamente (sin contenido)
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
