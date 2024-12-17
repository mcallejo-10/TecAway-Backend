import { body } from "express-validator";

export const userKnowledgeValidator = [
  body("user_id")
    .exists()
    .withMessage("User_id is required")
    .isInt()
    .withMessage("Invalid user_id"),

  body("knowledge_id")
    .exists()
    .withMessage("Knowledge_id is required")
    .isInt()
    .withMessage("Invalid knowledge_id"),
];
