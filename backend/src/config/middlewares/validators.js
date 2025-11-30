const { body, validationResult, query } = require('express-validator');


const loginValidator = [
body('username').isString().trim().notEmpty().withMessage('username required'),
body('password').isString().notEmpty().withMessage('password required'),
(req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
}
];


const currencyCreateValidator = [
body('code').isString().trim().notEmpty().isLength({ min: 2, max: 5 }).withMessage('invalid code'),
body('name').isString().trim().notEmpty().withMessage('name required'),
(req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
}
];


const currencySearchValidator = [
query('search').optional().isString().trim(),
(req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
next();
}
];


module.exports = { loginValidator, currencyCreateValidator, currencySearchValidator };