import { body } from 'express-validator';
//body():se utiliza para validar los campos en el cuerpo (body)


export const knowledgeValidator = [
    body("knowledge")
        .exists()
        .withMessage("Section is required")
        .isString()
        .withMessage("Section should be a string")
        .isLength({ min: 5 })
        .withMessage("Section should be at least 5 characters"),
]

