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
    prefix: {
        type: "string"
    },
    postfix: {
        type: "string"
    },
    forceAverage: {
        type: "string",
        validValues: validForceAverageValues
    },
    average: {
        type: "boolean"
    },
    mantissa: {
        type: "number",
        restriction: (number) => number >= 0,
        message: "value must be positive"
    },
    optionalMantissa: {
        type: "boolean"
    },
    thousandSeparated: {
        type: "boolean"
    },
    negative: {
        type: "string",
        validValues: validNegativeValues
    },
    forceSign: {
        type: "boolean"
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
    let validFormat = validateFormat(format);

    return validInput && validFormat;
}

// Todo: Implement
// eslint-disable-next-line no-unused-vars
function validateInput(input) {
    return true;
}

function validateFormat(format) {
    let results = Object.keys(format).map((key) => {
        if (!validFormat[key]) {
            console.error(`[Validate format] Invalid key: ${key}`); // eslint-disable-line no-console
            return false;
        }

        let data = validFormat[key];

        let value = format[key];
        if (typeof value !== data.type) {
            console.error(`[Validate format] ${key} type mismatched: "${data.type}" expected, "${typeof value}" provided`); // eslint-disable-line no-console
            return false;
        }

        if (data.restriction && !data.restriction(value)) {
            console.error(`[Validate format] ${key} invalid value: ${data.message}`); // eslint-disable-line no-console
            return false;
        }

        if (data.validValues && data.validValues.indexOf(value) === -1) {
            console.error(`[Validate format] ${key} invalid value: must be among ${JSON.stringify(data.validValues)}, ${value} provided`); // eslint-disable-line no-console
            return false;
        }

        return true;
    });

    return results.reduce((acc, current) => {
        return acc && current;
    }, true);
}

module.exports = {
    validate,
    validateFormat,
    validateInput
};
