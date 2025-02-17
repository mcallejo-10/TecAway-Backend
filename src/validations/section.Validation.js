import { body, check } from 'express-validator';
//body():se utiliza para validar los campos en el cuerpo (body)
//check():se utiliza para validar los campos en el cuerpo (body), los parámetros de la ruta (params)

export const sectionValidator = [
    body("section")
        .exists()
        .withMessage("Section is required")
        .isString()
        .withMessage("Section should be a string")
        .isLength({ min: 5 })
        .withMessage("Section should be at least 5 characters"),
]
