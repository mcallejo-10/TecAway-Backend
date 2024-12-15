import { body } from "express-validator";

export const userSectionValidator = [
  body("user_id")
    .exists()
    .withMessage("Section is required")
    .isInt()
    .withMessage("Invalid user_id"),

  body("section_id")
    .exists()
    .withMessage("Section_id is required")
    .isInt()
    .withMessage("Invalid section_id"),
];
