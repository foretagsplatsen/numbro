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

const globalState = require("./globalState");
const validating = require("./validating");
const parsing = require("./parsing");

const binarySuffixes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
const decimalSuffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const bytes = {
    general: {scale: 1024, suffixes: decimalSuffixes, marker: "bd"},
    binary: {scale: 1024, suffixes: binarySuffixes, marker: "b"},
    decimal: {scale: 1000, suffixes: decimalSuffixes, marker: "d"}
};

const defaultOptions = {
    totalLength: 0,
    characteristic: 0,
    forceAverage: false,
    average: false,
    mantissa: -1,
    optionalMantissa: true,
    thousandSeparated: false,
    spaceSeparated: false,
    negative: "sign",
    forceSign: false
};

/**
 * Entry point. We add the prefix and postfix here to ensure they are correctly placed
 */
function format(n, providedFormat = {}, numbro) {
    if (typeof providedFormat === "string") {
        providedFormat = parsing.parseFormat(providedFormat);
    }

    let valid = validating.validateFormat(providedFormat);

    if (!valid) {
        return "ERROR: invalid format";
    }

    let prefix = providedFormat.prefix || "";
    let postfix = providedFormat.postfix || "";

    let output = formatNumbro(n, providedFormat, numbro);
    output = insertPrefix(output, prefix);
    output = insertPostfix(output, postfix);
    return output;
}

function formatNumbro(n, providedFormat, numbro) {
    switch (providedFormat.output) {
        case "currency":
            return formatCurrency(n, providedFormat, globalState, numbro);
        case "percent":
            return formatPercentage(n, providedFormat, globalState, numbro);
        case "byte":
            return formatByte(n, providedFormat, globalState, numbro);
        case "time":
            return formatTime(n, providedFormat, globalState, numbro);
        case "ordinal":
            return formatOrdinal(n, providedFormat, globalState, numbro);
        case "number":
        default:
            return formatNumber(n, providedFormat, globalState, numbro);
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
    let suffix = suffixes[0];
    let abs = Math.abs(value);

    if (abs >= scale) {
        for (let power = 1; power < suffixes.length; ++power) {
            let min = Math.pow(scale, power);
            let max = Math.pow(scale, power + 1);

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

    return {value, suffix};
}

function formatByte(n, providedFormat, state, numbro) {
    let base = providedFormat.base || "binary";
    let baseInfo = bytes[base];

    let {value, suffix} = getFormatByteUnits(n._value, baseInfo.suffixes, baseInfo.scale);
    let output = formatNumber(numbro(value), providedFormat, state, undefined, state.currentByteDefaults());
    let abbreviations = state.currentAbbreviations();
    return `${output}${abbreviations.spaced ? " " : ""}${suffix}`;
}

function formatOrdinal(n, providedFormat, state) {
    let ordinalFn = state.currentOrdinal();
    let abbreviations = state.currentAbbreviations();

    let output = formatNumber(n, providedFormat, state, undefined, state.currentOrdinalDefaults());
    let ordinal = ordinalFn(n._value);

    return `${output}${abbreviations.spaced ? " " : ""}${ordinal}`;
}

function formatTime(n) {
    let hours = Math.floor(n._value / 60 / 60);
    let minutes = Math.floor((n._value - (hours * 60 * 60)) / 60);
    let seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
    return `${hours}:${(minutes < 10) ? "0" : ""}${minutes}:${(seconds < 10) ? "0" : ""}${seconds}`;
}

function formatPercentage(n, providedFormat, state, numbro) {
    let output = formatNumber(numbro(n._value * 100), providedFormat, state, undefined, state.currentPercentageDefaults());
    let abbreviations = state.currentAbbreviations();
    return `${output}${abbreviations.spaced ? " " : ""}%`;
}

function formatCurrency(n, providedFormat, state) {
    const currentCurrency = state.currentCurrency();
    let decimalSeparator = undefined;
    let space = "";

    if (currentCurrency.spaceSeparated) {
        space = " ";
    }

    if (currentCurrency.position === "infix") {
        decimalSeparator = space + currentCurrency.symbol + space;
    }

    let output = formatNumber(n, providedFormat, state, decimalSeparator, state.currentCurrencyDefaults());

    if (currentCurrency.position === "prefix") {
        output = currentCurrency.symbol + space + output;
    }

    if (currentCurrency.position === "postfix") {
        output = output + space + currentCurrency.symbol;
    }

    return output;
}

function computeAverage({value, forceAverage, abbreviations, spaceSeparated = false, totalLength = 0}) {
    let abbreviation = "";
    let abs = Math.abs(value);
    let mantissaPrecision = -1;

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

    let optionalSpace = spaceSeparated ? " " : "";

    if (abbreviation) {
        abbreviation = optionalSpace + abbreviation;
    }

    if (totalLength) {
        let characteristic = value.toString().split(".")[0];
        mantissaPrecision = Math.max(totalLength - characteristic.length, 0);
    }

    return {value, abbreviation, mantissaPrecision};
}

function setMantissaPrecision(value, optionalMantissa, precision) {
    if (precision === -1) {
        return value.toString();
    }

    let result = Math.floor(value * (Math.pow(10, precision))) / (Math.pow(10, precision));
    let currentMantissa = result.toString().split(".")[1] || "";

    if (currentMantissa.length < precision) {
        if (currentMantissa.length === 0) {
            if (optionalMantissa) {
                return result.toString();
            }

            result += ".";
        }

        let missingZeros = precision - currentMantissa.length;
        for (let i = 0; i < missingZeros; i++) {
            result += "0";
        }
    }

    return result.toString();
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

    return result.toString();
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

function replaceDelimiters(output, thousandSeparated, state, decimalSeparator) {
    let delimiters = state.currentDelimiters();
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

    if (!mantissa) {
        result = characteristic;
    } else {
        result = characteristic + decimalSeparator + mantissa;
    }
    return result;
}

function insertAbbreviation(output, abbreviation) {
    return output + abbreviation;
}

function insertSign(output, value, negative) {
    if (value >= 0) {
        return `+${output}`;
    }

    if (negative === "sign") {
        return output;
    }

    return `(${output.slice(1)})`;
}

function insertPrefix(output, prefix) {
    return prefix + output;
}

function insertPostfix(output, postfix) {
    return output + postfix;
}

function formatNumber(n, providedFormat, state, decimalSeparator, defaults = state.currentDefaults()) {
    let value = n._value;

    if (value === 0 && state.hasZeroFormat()) {
        return state.getZeroFormat();
    }

    if (!isFinite(value)) {
        return value.toString();
    }

    let options = Object.assign({}, defaultOptions, defaults, providedFormat);

    let totalLength = options.totalLength;
    let characteristicPrecision = totalLength ? 0 : options.characteristic;
    let forceAverage = options.forceAverage;
    let average = totalLength || forceAverage || options.average;

    // default when averaging is to chop off decimals
    let mantissaPrecision = totalLength ? -1 : (average ? 0 : options.mantissa);
    let optionalMantissa = totalLength ? false : options.optionalMantissa;
    let thousandSeparated = options.thousandSeparated;
    let spaceSeparated = options.spaceSeparated;
    let negative = options.negative;
    let forceSign = options.forceSign;

    let abbreviation = "";

    if (average) {
        let data = computeAverage({
            value,
            forceAverage,
            abbreviations: state.currentAbbreviations(),
            spaceSeparated: spaceSeparated,
            totalLength
        });

        value = data.value;
        abbreviation = data.abbreviation;

        if (totalLength) {
            mantissaPrecision = data.mantissaPrecision;
        }
    }

    // Set mantissa precision
    let output = setCharacteristicPrecision(value, characteristicPrecision);
    output = setMantissaPrecision(output, optionalMantissa, mantissaPrecision);
    output = replaceDelimiters(output, thousandSeparated, state, decimalSeparator);

    if (average) {
        output = insertAbbreviation(output, abbreviation);
    }

    if (forceSign || value < 0) {
        output = insertSign(output, value, negative);
    }

    return output;
}

module.exports = (numbro) => ({
    format: (...args) => format(...args, numbro),
    getByteUnit: (...args) => getByteUnit(...args, numbro),
    getBinaryByteUnit: (...args) => getBinaryByteUnit(...args, numbro),
    getDecimalByteUnit: (...args) => getDecimalByteUnit(...args, numbro),
    formatTime: (...args) => formatTime(...args, numbro)
});
