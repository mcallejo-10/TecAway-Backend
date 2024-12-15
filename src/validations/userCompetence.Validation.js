import { body } from "express-validator";

export const userCompetenceValidator = [
  body("user_id")
    .exists()
    .withMessage("User_id is required")
    .isInt()
    .withMessage("Invalid user_id"),

  body("competence_id")
    .exists()
    .withMessage("Competence_id is required")
    .isInt()
    .withMessage("Invalid competence_id"),
];