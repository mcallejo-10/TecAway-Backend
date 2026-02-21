import { body } from 'express-validator';


export const loginValidator = [
    body("email").isEmail().withMessage("Provide valid email"),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be string")
        .isLength({ min: 4 })
        .withMessage("Password should be at least 4 characters")
]

export const registerValidator = [
    body("email").isEmail(),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be string")
        .isLength({ min: 4 })
        .withMessage("Password should be at least 4 characters")
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

    body("city")
        .exists()
        .withMessage("City is required")
        .isString()
        .withMessage("City should be string")
        .isLength({ min: 3, max: 20 })
        .withMessage("City should be between 3 and 20 characters"),

    body("country")
        .exists()
        .withMessage("Country is required")
        .isString()
        .withMessage("Country should be string")
        .isLength({ min: 2, max: 30 })
        .withMessage("Country should be between 2 and 30 characters"),

    body("latitude")
        .exists()
        .withMessage("Latitude is required (from autocomplete)")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude should be a valid decimal between -90 and 90"),

    body("longitude")
        .exists()
        .withMessage("Longitude is required (from autocomplete)")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude should be a valid decimal between -180 and 180"),
    body("can_move")
        .optional()
        .isBoolean()
        .withMessage("Can move should be boolean"),
    
    body("roles")
        .optional()
        .custom((value) => {
            if (Array.isArray(value)) {
                return value.every((role) => typeof role === 'string');
            }
            return typeof value === 'string';
        })
        .withMessage("Roles should be a string or array of strings"),
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

export const updateUserValidator = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email must be valid if provided"),
    
    body("name")
        .optional()
        .isString()
        .withMessage("Name should be string"),
    
    body("title")
        .optional()
        .isString()
        .withMessage("Title should be string")
        .if(() => false) // Solo validar length si está presente
        .isLength({ min: 20, max: 130 })
        .withMessage("Title should be between 20 and 130 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description should be string")
        .if(() => false) // Solo validar length si está presente
        .isLength({ min: 30, max: 2400 })
        .withMessage("Description should be between 30 and 2400 characters"),

    // Ubicación: igual de estricto que en registro
    body("city")
        .exists()
        .withMessage("City is required (from autocomplete)")
        .isString()
        .withMessage("City should be string")
        .isLength({ min: 3, max: 20 })
        .withMessage("City should be between 3 and 20 characters"),

    body("country")
        .exists()
        .withMessage("Country is required")
        .isString()
        .withMessage("Country should be string")
        .isLength({ min: 2, max: 30 })
        .withMessage("Country should be between 2 and 30 characters"),

    body("latitude")
        .exists()
        .withMessage("Latitude is required (from autocomplete)")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude should be a valid decimal between -90 and 90"),

    body("longitude")
        .exists()
        .withMessage("Longitude is required (from autocomplete)")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude should be a valid decimal between -180 and 180"),

    body("can_move")
        .optional()
        .isBoolean()
        .withMessage("Can move should be boolean"),
];
