/**
 * Custom error used for all validation failures.
 * @class
 * @extends Error
 */
class ValidationError extends Error {
    /**
     * Creates a validation error.
     * @param {string} code - Machine readable error code
     * @param {string} message - Human readable error message
     */
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

/**
 * Calculates a user's age and validates legal adulthood.
 *
 * @param {Date} birthDate - User birth date
 * @returns {number} Exact age in years
 * @throws {ValidationError} INVALID_DATE - If date is invalid
 * @throws {ValidationError} UNDERAGE - If user is under 18
 */
function validateAge(birthDate) {
    if (!(birthDate instanceof Date) || isNaN(birthDate)) {
        throw new ValidationError("INVALID_DATE", "Invalid birth date");
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const birthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());

    if (!birthdayPassed) age--;

    if (age < 18) {
        throw new ValidationError("UNDERAGE", "User must be at least 18");
    }

    return age;
}

/**
 * Validates a French postal code format.
 *
 * @param {string} code - Postal code to validate
 * @throws {ValidationError} INVALID_TYPE - If value is not a string
 * @throws {ValidationError} INVALID_POSTAL_CODE - If format is incorrect
 */
function validatePostalCode(code) {
    if (typeof code !== "string") {
        throw new ValidationError("INVALID_TYPE", "Postal code must be string");
    }

    if (!/^\d{5}$/.test(code)) {
        throw new ValidationError("INVALID_POSTAL_CODE", "Invalid French postal code");
    }
}

/**
 * Validates identity fields (name or surname).
 *
 * Allows letters, accents, spaces and hyphens only.
 * Protects against basic XSS injections.
 *
 * @param {string} value - Name or surname to validate
 * @throws {ValidationError} INVALID_TYPE - If value is not a string
 * @throws {ValidationError} XSS_DETECTED - If HTML content is detected
 * @throws {ValidationError} INVALID_NAME - If invalid characters are present
 */
function validateIdentity(value) {
    if (typeof value !== "string") {
        throw new ValidationError("INVALID_TYPE", "Identity must be string");
    }

    if (/<[^>]*>/.test(value)) {
        throw new ValidationError("XSS_DETECTED", "HTML content detected");
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\- ]+$/;

    if (!nameRegex.test(value)) {
        throw new ValidationError("INVALID_NAME", "Invalid characters in name");
    }
}

/**
 * Validates email address format.
 *
 * @param {string} email - Email to validate
 * @throws {ValidationError} INVALID_TYPE - If value is not a string
 * @throws {ValidationError} INVALID_EMAIL - If format is invalid
 */
function validateEmail(email) {
    if (typeof email !== "string") {
        throw new ValidationError("INVALID_TYPE", "Email must be string");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new ValidationError("INVALID_EMAIL", "Invalid email format");
    }
}

module.exports = {
    ValidationError,
    validateAge,
    validatePostalCode,
    validateIdentity,
    validateEmail
};
