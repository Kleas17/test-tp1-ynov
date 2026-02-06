const {
    validateAge,
    validatePostalCode,
    validateIdentity,
    validateEmail,
    ValidationError
} = require("../validator");

const expectErrorCode = (fn, code) => {
    try {
        fn();
    } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.code).toBe(code);
        return;
    }
    throw new Error("Expected error was not thrown");
};

describe("Age validation", () => {

    test("valid adult", () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 20);
        expect(validateAge(d)).toBe(20);
    });

    test("underage rejected", () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 17);
        expectErrorCode(() => validateAge(d), "UNDERAGE");
    });

    test("birthday not passed yet", () => {
        const today = new Date();
        const d = new Date(
            today.getFullYear() - 18,
            today.getMonth() + 1,
            today.getDate()
        );
        expectErrorCode(() => validateAge(d), "UNDERAGE");
    });

    test("february 29 edge case", () => {
        const d = new Date(2004, 1, 29);
        expect(validateAge(d)).toBeGreaterThanOrEqual(18);
    });

    test("null rejected", () => {
        expectErrorCode(() => validateAge(null), "INVALID_DATE");
    });
});

describe("Postal code", () => {

    test("valid code", () => {
        expect(() => validatePostalCode("75001")).not.toThrow();
    });

    test("too short", () => {
        expectErrorCode(() => validatePostalCode("123"), "INVALID_POSTAL_CODE");
    });

    test("letters rejected", () => {
        expectErrorCode(() => validatePostalCode("75A01"), "INVALID_POSTAL_CODE");
    });

    test("null rejected", () => {
        expectErrorCode(() => validatePostalCode(null), "INVALID_TYPE");
    });
});

describe("Identity", () => {

    test("valid name", () => {
        expect(() => validateIdentity("Jean-Pierre Dupont")).not.toThrow();
    });

    test("numbers rejected", () => {
        expectErrorCode(() => validateIdentity("Jean3"), "INVALID_NAME");
    });

    test("script rejected", () => {
        expectErrorCode(
            () => validateIdentity("<script>alert(1)</script>"),
            "XSS_DETECTED"
        );
    });

    test("object rejected", () => {
        expectErrorCode(() => validateIdentity({}), "INVALID_TYPE");
    });
});

describe("Email", () => {

    test("valid email", () => {
        expect(() => validateEmail("test@mail.com")).not.toThrow();
    });

    test("missing @", () => {
        expectErrorCode(() => validateEmail("testmail.com"), "INVALID_EMAIL");
    });

    test("null rejected", () => {
        expectErrorCode(() => validateEmail(null), "INVALID_TYPE");
    });
});
