/*!
 * Copyright (c) 2017 Benjamin Van Ryseghem<benjamin@vanryseghem.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

let unformatter = require("./unformatting");

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
        trillion: "string"
    }
};

const validBaseValues = [
    "decimal",
    "binary",
    "general"
];

const validFormat = {
    output: {
        type: "string",
        validValues: validOutputValues
    },
    base: {
        type: "string",
        validValues: validBaseValues
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
    optionalCharacteristic: "boolean",
    thousandSeparated: "boolean",
    spaceSeparated: "boolean",
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
    spaceSeparated: "boolean",
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

function validateInput(input) {
    let value = unformatter.unformat(input);

    return !!value;
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
            let valid = validateSpec(value, data.children, `[Validate ${key}]`);

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
