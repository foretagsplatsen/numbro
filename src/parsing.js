/*!
 * parsing.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

function parsePrefix(string, result) {
    let match = string.match(/^{([^}]*)}/);
    if (match) {
        result.prefix = match[1];
        return string.slice(match[0].length);
    }

    return string;
}

function parsePostfix(string, result) {
    let match = string.match(/{([^}]*)}$/);
    if (match) {
        result.postfix = match[1];

        return string.slice(0, -match[0].length);
    }

    return string;
}

function parseOutput(string, result) {
    if (string.indexOf("$") !== -1) {
        result.output = "currency";
        return;
    }

    if (string.indexOf("%") !== -1) {
        result.output = "percent";
        return;
    }

    if (string.indexOf("bd") !== -1) {
        result.output = "byte";
        result.base = "general";
        return;
    }

    if (string.indexOf("b") !== -1) {
        result.output = "byte";
        result.base = "binary";
        return;

    }

    if (string.indexOf("d") !== -1) {
        result.output = "byte";
        result.base = "decimal";
        return;

    }

    if (string.indexOf(":") !== -1) {
        result.output = "time";
        return;
    }

    if (string.indexOf("o") !== -1) {
        result.output = "ordinal";
    }
}

function parseThousandSeparated(string, result) {
    if (string.indexOf(",") !== -1) {
        result.thousandSeparated = true;
    }
}

function parseSpaceSeparated(string, result) {
    if (string.indexOf(" ") !== -1) {
        result.spaceSeparated = true;
    }
}

function parseTotalLength(string, result) {
    let match = string.match(/[1-9]+[0-9]*/);

    if (match) {
        result.totalLength = +match[0];
    }
}

function parseCharacteristic(string, result) {
    let characteristic = string.split(".")[0];
    let match = characteristic.match(/0+/);
    if (match) {
        result.characteristic = match[0].length;
    }
}

function parseMantissa(string, result) {
    let mantissa = string.split(".")[1];
    if (mantissa) {
        let match = mantissa.match(/0+/);
        if (match) {
            result.mantissa = match[0].length;
        }
    }
}

function parseAverage(string, result) {
    if (string.indexOf("a") !== -1) {
        result.average = true;
    }
}

function parseOptionalMantissa(string, result) {
    if (string.match(/\[\.]/)) {
        result.optionalMantissa = true;
    } else if (string.match(/\./)) {
        result.optionalMantissa = false;
    }
}

function parseNegative(string, result) {
    if (string.match(/^\+?\([^)]*\)$/)) {
        result.negative = "parenthesis";
    }
    if (string.match(/^\+?-/)) {
        result.negative = "sign";
    }
}

function parseForceSign(string, result) {
    if (string.match(/^\+/)) {
        result.forceSign = true;
    }
}

function parseFormat(string, result = {}) {
    string = parsePrefix(string, result);
    string = parsePostfix(string, result);
    parseOutput(string, result);
    parseTotalLength(string, result);
    parseCharacteristic(string, result);
    parseAverage(string, result);
    parseMantissa(string, result);
    parseOptionalMantissa(string, result);
    parseThousandSeparated(string, result);
    parseSpaceSeparated(string, result);
    parseNegative(string, result);
    parseForceSign(string, result);

    return result;
}

module.exports = {
    parseFormat
};
