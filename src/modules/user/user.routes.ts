import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import userController from './user.controller';
import { createUserRequestSchema, getUserByIdRequestSchema } from './user.request.schema';

const router = express.Router();

/** Create */
/**
 * @openapi
 * /users:
 *    post:
 *      summary: Create a new user
 *      tags:
 *        - User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          201:
 *              description: Successfully created a new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateUserResponse'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          409:
 *              description: Conflict
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.post('/', validateRequest(createUserRequestSchema), asyncWrapper(userController.createUserHandler));

/** Read */
router.get('/', validateRequest(), requireUser, asyncWrapper(userController.getUsersHandler));

/**
 * @openapi
 * /users/{userId}:
 *    get:
 *      summary: Retrieve a user
 *      tags:
 *        - User
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - $ref: '#/components/parameters/userId'
 *      responses:
 *          200:
 *              description: Successfully retrieved a user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetUserResponse'
 *          400:
 *              description: Bad Request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          404:
 *              description: Not Found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *
 * components:
 *   parameters:
 *     userId:
 *         name: userId
 *         in: path
 *         description: The id of user
 *         required: true
 */
router.get('/:userId', validateRequest(getUserByIdRequestSchema), requireUser, asyncWrapper(userController.getUserByIdHandler));

/**
 * @openapi
 * /users/{userId}/settings:
 *    get:
 *      summary: Retrieve a list of user settings
 *      tags:
 *        - User
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - $ref: '#/components/parameters/userId'
 *      responses:
 *          200:
 *              description: Successfully retrieved a list of user settings
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetUserSettingsResponse'
 *          400:
 *              description: Bad Request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          404:
 *              description: Not Found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */
router.get('/:userId/settings', validateRequest(getUserByIdRequestSchema), requireUser, asyncWrapper(userController.getUserSettingsByIdHandler));

export default router;
