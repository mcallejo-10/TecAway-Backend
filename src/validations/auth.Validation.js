import { body } from 'express-validator';


export const loginValidator = [
    body("email").isEmail().withMessage("Provide valid email"),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be string")
        .isLength({ min: 5 })
        .withMessage("Password should be at least 5 characters")
]

export const registerValidator = [
    body("email").isEmail(),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be string")
        .isLength({ min: 5 })
        .withMessage("Password should be at least 5 characters")
        .custom(value => {
            if (value == '123456') {
                throw new Error('Este pass es muy basico');
            }
            return true;
        }),
    body("name").isString(),
    body("title")
        .exists()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title should be string")
        .isLength({ min: 20, max: 130 })
        .withMessage("Title should be at least 20 characters"),

    body("description")
        .exists()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description should be string")
        .isLength({ min: 30, max: 2400 })
        .withMessage("Description should be at least 30 characters"),

    body("town")
        .exists()
        .withMessage("Town is required")
        .isString()
        .withMessage("Town should be string")
        .isLength({ min: 3, max: 20 })
        .withMessage("Town should be at least 30 characters"),
    body("can_move")
        .exists()
        .withMessage("Can move is required")
        .isBoolean()
        .withMessage("Can move should be boolean"),
]

export const emailValidator = [
    body("email").isEmail()
];

export const changePasswordValidator = [
    body("token")
        .exists(),
        body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be string")
        .isLength({ min: 5 })
        .withMessage("Password should be at least 5 characters")
];
