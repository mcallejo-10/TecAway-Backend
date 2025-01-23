import { body } from 'express-validator';

export const knowledgeValidator = [
    body("knowledge")
        .exists()
        .withMessage("Knowledge is required")
        .isString()
        .withMessage("Knowledge should be a string")
        .isLength({ min: 2 })
        .withMessage("Knowledge should be at least 2 characters"),
]

