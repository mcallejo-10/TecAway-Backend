import { body } from 'express-validator';
//body():se utiliza para validar los campos en el cuerpo (body)


export const generalCompetenceValidator = [
    body("generalCompetence")
        .exists()
        .withMessage("General competence is required")
        .isString()
        .withMessage("General competence should be a string")
        .isLength({ min: 5 })
        .withMessage("General competence should be at least 5 characters"),
]

