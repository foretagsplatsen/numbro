/*!
 * formatting.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

const globalState = require("./globalState");
const validating = require("./validating");

const binarySuffixes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
const decimalSuffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const bytes = {
    general: {scale: 1024, suffixes: decimalSuffixes, marker: "bd"},
    binary: {scale: 1024, suffixes: binarySuffixes, marker: "b"},
    decimal: {scale: 1000, suffixes: decimalSuffixes, marker: "d"}
};

/**
 * Entry point. We add the prefix and postfix here to ensure they are correctly placed
 */
function format(n, format = {}) {
    let valid = validating.validateFormat(format);

    if (!valid) {
        return "ERROR: invalid format";
    }

    let prefix = format.prefix || "";
    let postfix = format.postfix || "";

    let output = formatNumbro(n, format);
    output = insertPrefix(output, prefix);
    output = insertPostfix(output, postfix);
    return output;
}

function formatNumbro(n, format) {
    switch (format.output) {
        case "currency":
            return formatCurrency(n, format, globalState);
        case "percent":
            return formatPercentage(n, format, globalState);
        case "byte":
            return formatByte(n, format, globalState);
        case "time":
            return formatTime(n, format, globalState);
        case "ordinal":
            return formatOrdinal(n, format, globalState);
        case "number":
        default:
            return formatNumber(n, format, globalState);
    }
}

function getDecimalByteUnit(n) {
    let data = bytes.decimal;
    return getFormatByteUnits(n._value, data.suffixes, data.scale).suffix;
}

function getBinaryByteUnit(n) {
    let data = bytes.binary;
    return getFormatByteUnits(n._value, data.suffixes, data.scale).suffix;
}

function getByteUnit(n) {
    let data = bytes.general;
    return getFormatByteUnits(n._value, data.suffixes, data.scale).suffix;
}

function getFormatByteUnits(value, suffixes, scale) {
    let suffix = suffixes[0],
        power,
        min,
        max,
        abs = Math.abs(value);

    if (abs >= scale) {
        for (power = 1; power < suffixes.length; ++power) {
            min = Math.pow(scale, power);
            max = Math.pow(scale, power + 1);

            if (abs >= min && abs < max) {
                suffix = suffixes[power];
                value = value / min;
                break;
            }
        }

        // values greater than or equal to [scale] YB never set the suffix
        if (suffix === suffixes[0]) {
            value = value / Math.pow(scale, suffixes.length - 1);
            suffix = suffixes[suffixes.length - 1];
        }
    }

    return {value: value, suffix: suffix};
}

function formatByte(n, format, globalState) {
    let base = format.base || "binary";
    let baseInfo = bytes[base];

    let {value, suffix} = getFormatByteUnits(n._value, baseInfo.suffixes, baseInfo.scale);
    let output = formatNumber({_value: value}, format, globalState, undefined, globalState.currentByteDefaults());
    let abbreviations = globalState.currentAbbreviations();
    return `${output}${abbreviations.spaced ? " " : ""}${suffix}`;
}

function formatOrdinal(n, format, globalState) {
    let ordinalFn = globalState.currentOrdinal();
    let abbreviations = globalState.currentAbbreviations();

    let output = formatNumber(n, format, globalState, undefined, globalState.currentOrdinalDefaults());
    let ordinal = ordinalFn(n._value);

    return `${output}${abbreviations.spaced ? " " : ""}${ordinal}`;
}

function formatTime(n) {
    let hours = Math.floor(n._value / 60 / 60),
        minutes = Math.floor((n._value - (hours * 60 * 60)) / 60),
        seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
    return `${hours}:${(minutes < 10) ? "0" : ""}${minutes}:${(seconds < 10) ? "0" : ""}${seconds}`;
}

function formatPercentage(n, format, globalState) {
    let output = formatNumber({_value: n._value * 100}, format, globalState, undefined, globalState.currentPercentageDefaults());
    let abbreviations = globalState.currentAbbreviations();
    return `${output}${abbreviations.spaced ? " " : ""}%`;
}

function formatCurrency(n, format, globalState) {
    const currentCurrency = globalState.currentCurrency();
    let decimalSeparator = undefined;
    let space = "";

    let output;

    if (currentCurrency.spaceSeparated) {
        space = " ";
    }

    if (currentCurrency.position === "infix") {
        decimalSeparator = space + currentCurrency.symbol + space;
    }

    output = formatNumber(n, format, globalState, decimalSeparator, globalState.currentCurrencyDefaults());

    if (currentCurrency.position === "prefix") {
        output = currentCurrency.symbol + space + output;
    }

    if (currentCurrency.position === "postfix") {
        output = output + space + currentCurrency.symbol;
    }

    return output;
}

function computeAverage(value, forceAverage, globalState) {
    let abbreviations = globalState.currentAbbreviations();
    let abbreviation;
    let abs = Math.abs(value);

    if ((abs >= Math.pow(10, 12) && !forceAverage) || (forceAverage === "trillion")) {
        // trillion
        abbreviation = abbreviations.trillion;
        value = value / Math.pow(10, 12);
    } else if ((abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !forceAverage) || (forceAverage === "billion")) {
        // billion
        abbreviation = abbreviations.billion;
        value = value / Math.pow(10, 9);
    } else if ((abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !forceAverage) || (forceAverage === "million")) {
        // million
        abbreviation = abbreviations.million;
        value = value / Math.pow(10, 6);
    } else if ((abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !forceAverage) || (forceAverage === "thousand")) {
        // thousand
        abbreviation = abbreviations.thousand;
        value = value / Math.pow(10, 3);
    }

    let optionalSpace = abbreviations.spaced ? " " : "";
    abbreviation = optionalSpace + abbreviation;
    return {value, abbreviation};
}

function setMantissaPrecision(value, optionalMantissa, precision) {
    if (precision === -1) {
        return value;
    }

    let result = Math.floor(value * (Math.pow(10, precision))) / (Math.pow(10, precision));
    let currentMantissa = result.toString().split(".")[1] || "";

    if (currentMantissa.length < precision) {
        if (currentMantissa.length === 0) {
            if (optionalMantissa) {
                return result;
            } else {
                result += ".";
            }
        }

        let missingZeros = precision - currentMantissa.length;
        for (let i = 0; i < missingZeros; i++) {
            result += "0";
        }
    }

    return result;
}

function setCharacteristicPrecision(value, precision) {
    let result = value;
    let currentCharacteristic = result.toString().split(".")[0];

    if (currentCharacteristic.length < precision) {
        let missingZeros = precision - currentCharacteristic.length;
        for (let i = 0; i < missingZeros; i++) {
            result = `0${result}`;
        }
    }

    return result;
}

/**
 * Return the indexes where are the group separations after splitting `totalLength` in group of `groupSize` size.
 * Important: we start grouping from the right hand side.
 */
function indexesOfGroupSpaces(totalLength, groupSize) {
    let result = [];
    let counter = 0;
    for (let i = totalLength; i > 0; i--) {
        if (counter === groupSize) {
            result.unshift(i);
            counter = 0;
        }
        counter++;
    }

    return result;
}

function replaceDelimiters(output, thousandSeparated, globalState, decimalSeparator) {
    let delimiters = globalState.currentDelimiters();
    let thousandSeparator = delimiters.thousands;
    decimalSeparator = decimalSeparator || delimiters.decimal;
    let thousandsSize = delimiters.thousandsSize || 3;

    let result = output.toString();
    let characteristic = result.split(".")[0];
    let mantissa = result.split(".")[1];

    if (thousandSeparated) {
        let indexesToInsertThousandDelimiters = indexesOfGroupSpaces(characteristic.length, thousandsSize);
        indexesToInsertThousandDelimiters.forEach((position, index) => {
            characteristic = characteristic.slice(0, position + index) + thousandSeparator + characteristic.slice(position + index);
        });
    }

    if (mantissa !== undefined) {
        result = characteristic + decimalSeparator + mantissa;
    } else {
        result = characteristic;
    }
    return result;
}

function insertAbbreviation(output, abbreviation) {
    return output + abbreviation;
}

function insertSign(output, value, negative) {
    if (value >= 0) {
        return `+${output}`;
    } else {
        if (negative === "sign") {
            return output;
        }

        return `(${output.slice(1)})`;
    }
}

function insertPrefix(output, prefix) {
    return prefix + output;
}

function insertPostfix(output, postfix) {
    return output + postfix;
}

function formatNumber(n, format, globalState, decimalSeparator, defaults) {
    let value = n._value;
    let output;

    if (value === 0 && globalState.hasZeroFormat()) {
        return globalState.getZeroFormat();
    }

    if (!isFinite(value)) {
        return value.toString();
    }

    defaults = defaults || globalState.currentDefaults();

    let characteristicPrecision = format.characteristic || defaults.characteristic || 0;
    let forceAverage = format.forceAverage || defaults.forceAverage || false; // 'trillion', 'billion', 'million' or 'thousand'
    let average = format.average || defaults.average || !!forceAverage;
    let mantissaPrecision = (format.mantissa !== undefined) ? format.mantissa : (average ? (defaults.mantissa || 0) : -1); // default when averaging is to chop off decimals
    let optionalMantissa = format.optionalMantissa === undefined ? defaults.optionalMantissa !== false : format.optionalMantissa;
    let thousandSeparated = format.thousandSeparated || defaults.thousandSeparated || false;
    let negative = format.negative || defaults.negative || "sign"; // 'sign' or 'parenthesis'
    let forceSign = format.forceSign || defaults.forceSign || false;

    let abbreviation = "";

    if (average) {
        let data = computeAverage(value, forceAverage, globalState);
        value = data.value;
        abbreviation = data.abbreviation;
    }

    // Set mantissa precision
    output = setMantissaPrecision(value, optionalMantissa, mantissaPrecision);
    output = setCharacteristicPrecision(output, characteristicPrecision);
    output = replaceDelimiters(output, thousandSeparated, globalState, decimalSeparator);

    if (average) {
        output = insertAbbreviation(output, abbreviation);
    }

    if (forceSign || value < 0) {
        output = insertSign(output, value, negative);
    }

    return output;
}

module.exports = {
    format,
    getByteUnit,
    getBinaryByteUnit,
    getDecimalByteUnit,
    __formatOrdinal: formatOrdinal,
    __formatByte: formatByte,
    __formatTime: formatTime,
    __formatCurrency: formatCurrency,
    __formatNumber: formatNumber,
    __formatPercentage: formatPercentage,
    __indexesOfGroupSpaces: indexesOfGroupSpaces
};
