/*!
 * validating.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

const validOutputValues = [
    "currency",
    "percent",
    "byte",
    "time",
    "ordinal",
    "number"
];

const validForceAverageValues = [
    "trillion",
    "billion",
    "million",
    "thousand"
];

const validNegativeValues = [
    "sign",
    "parenthesis"
];

const validAbbreviations = {
    type: "object",
    children: {
        thousand: "string",
        million: "string",
        billion: "string",
        trillion: "string",
        spaced: "boolean"
    }
};

const validFormat = {
    output: {
        type: "string",
        validValues: validOutputValues
    },
    characteristic: {
        type: "number",
        restriction: (number) => number >= 0,
        message: "value must be positive"
    },
    prefix: "string",
    postfix: "string",
    forceAverage: {
        type: "string",
        validValues: validForceAverageValues
    },
    average: "boolean",
    totalLength: {
        type: "number",
        restriction: (number) => number >= 0,
        message: "value must be positive"
    },
    mantissa: {
        type: "number",
        restriction: (number) => number >= 0,
        message: "value must be positive"
    },
    optionalMantissa: "boolean",
    thousandSeparated: "boolean",
    abbreviations: validAbbreviations,
    negative: {
        type: "string",
        validValues: validNegativeValues
    },
    forceSign: "boolean"
};

const validLanguage = {
    languageTag: "string",
    delimiters: {
        type: "object",
        children: {
            thousands: "string",
            decimal: "string"
        }
    },
    abbreviations: validAbbreviations,
    ordinal: "function",
    currency: {
        type: "object",
        children: {
            symbol: "string",
            position: "string",
            code: "string"
        }
    },
    defaults: "format",
    ordinalDefaults: "format",
    byteDefaults: "format",
    percentageDefaults: "format",
    currencyDefaults: "format",
    formats: {
        type: "object",
        children: {
            fourDigits: "format",
            fullWithTwoDecimals: "format",
            fullWithTwoDecimalsNoCurrency: "format",
            fullWithNoDecimals: "format"
        }
    }
};

/**
 * Check the validity of the provided input and format.
 * The check is NOT lazy.
 *
 * @param input
 * @param format
 * @return {boolean} True when everything is correct
 */
function validate(input, format) {
    let validInput = validateInput(input);
    let isFormatValid = validateFormat(format);

    return validInput && isFormatValid;
}

// Todo: Implement
// eslint-disable-next-line no-unused-vars
function validateInput(input) {
    return true;
}

function validateSpec(toValidate, spec, prefix) {
    let results = Object.keys(toValidate).map((key) => {
        if (!spec[key]) {
            console.error(`${prefix} Invalid key: ${key}`); // eslint-disable-line no-console
            return false;
        }

        let value = toValidate[key];
        let data = spec[key];

        if (typeof data === "string") {
            data = {type: data};
        }

        if (data.type === "format") {
            let valid = validateSpec(value, validFormat, `[Validate ${key}]`);

            if (!valid) {
                return false;
            }
        } else if (typeof value !== data.type) {
            console.error(`${prefix} ${key} type mismatched: "${data.type}" expected, "${typeof value}" provided`); // eslint-disable-line no-console
            return false;
        }

        if (data.restriction && !data.restriction(value)) {
            console.error(`${prefix} ${key} invalid value: ${data.message}`); // eslint-disable-line no-console
            return false;
        }

        if (data.validValues && data.validValues.indexOf(value) === -1) {
            console.error(`${prefix} ${key} invalid value: must be among ${JSON.stringify(data.validValues)}, "${value}" provided`); // eslint-disable-line no-console
            return false;
        }

        if (data.children) {
            let valid = validateSpec(value, data.children, prefix);

            if (!valid) {
                return false;
            }
        }

        return true;
    });

    return results.reduce((acc, current) => {
        return acc && current;
    }, true);
}

function validateFormat(format) {
    return validateSpec(format, validFormat, "[Validate format]");
}

function validateLanguage(data) {
    return validateSpec(data, validLanguage, "[Validate language]");
}

module.exports = {
    validate,
    validateFormat,
    validateInput,
    validateLanguage
};
