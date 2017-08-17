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
            return formatNumber({
                number: n,
                providedFormat,
                numbro
            });
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
    let output = formatNumber({
        number: numbro(value),
        providedFormat,
        state,
        defaults: state.currentByteDefaults()
    });
    let abbreviations = state.currentAbbreviations();
    return `${output}${abbreviations.spaced ? " " : ""}${suffix}`;
}

function formatOrdinal(number, providedFormat, state) {
    let ordinalFn = state.currentOrdinal();
    let options = Object.assign({}, defaultOptions, state.currentOrdinalDefaults(), providedFormat);

    let output = formatNumber({
        number,
        providedFormat,
        state,
        defaults: state.currentOrdinalDefaults()
    });
    let ordinal = ordinalFn(number._value);

    return `${output}${options.spaceSeparated ? " " : ""}${ordinal}`;
}

function formatTime(n) {
    let hours = Math.floor(n._value / 60 / 60);
    let minutes = Math.floor((n._value - (hours * 60 * 60)) / 60);
    let seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
    return `${hours}:${(minutes < 10) ? "0" : ""}${minutes}:${(seconds < 10) ? "0" : ""}${seconds}`;
}

function formatPercentage(n, providedFormat, state, numbro) {
    let output = formatNumber({
        number: numbro(n._value * 100),
        providedFormat,
        state,
        defaults: state.currentPercentageDefaults()
    });
    let options = Object.assign({}, defaultOptions, state.currentPercentageDefaults(), providedFormat);
    return `${output}${options.spaceSeparated ? " " : ""}%`;
}

function formatCurrency(number, providedFormat, state) {
    const currentCurrency = state.currentCurrency();
    let options = Object.assign({}, defaultOptions, state.currentCurrencyDefaults(), providedFormat);
    let decimalSeparator = undefined;
    let space = "";

    if (options.spaceSeparated) {
        space = " ";
    }

    if (currentCurrency.position === "infix") {
        decimalSeparator = space + currentCurrency.symbol + space;
    }

    let output = formatNumber({
        number,
        providedFormat,
        state,
        decimalSeparator,
        defaults: state.currentCurrencyDefaults()
    });

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

function zeroes(number) {
    let result = "";
    for (let i = 0; i < number; i++) {
        result += "0";
    }

    return result;
}

function toFixedLarge(value, precision) {
    let result = value.toString();

    let [base, exp] = result.split("e");

    let [characteristic, mantissa = ""] = base.split(".");

    if (+exp > 0) {
        result = characteristic + mantissa + zeroes(exp - mantissa.length);
    } else {
        let prefix = ".";

        if (+characteristic < 0) {
            prefix = `-0${prefix}`;
        } else {
            prefix = `0${prefix}`;
        }

        let suffix = (zeroes(-exp - 1) + Math.abs(characteristic) + mantissa).substr(0, precision);
        if (suffix.length < precision) {
            suffix += zeroes(precision - suffix.length);
        }
        result = prefix + suffix;
    }

    if (+exp > 0 && precision > 0) {
        result += `.${zeroes(precision)}`;
    }

    return result;
}

function toFixed(value, precision) {
    if (value.toString().indexOf("e") !== -1) {
        return toFixedLarge(value, precision);
    }

    return (Math.round(+`${value}e+${precision}`) / (Math.pow(10, precision))).toFixed(precision);
}

function setMantissaPrecision(output, value, optionalMantissa, precision) {
    if (precision === -1) {
        return output;
    }

    let result = toFixed(value, precision);
    let [currentCharacteristic, currentMantissa = ""] = result.toString().split(".");

    if (currentMantissa.match(/^0+$/) && optionalMantissa) {
        return currentCharacteristic;
    }

    return result.toString();
}

function setCharacteristicPrecision(output, value, optionalCharacteristic, precision) {
    let result = output;
    let [currentCharacteristic, currentMantissa] = result.toString().split(".");

    if (currentCharacteristic.match(/^-?0$/) && optionalCharacteristic) {
        if (!currentMantissa) {
            return currentCharacteristic.replace("0", "");
        }

        return `${currentCharacteristic.replace("0", "")}.${currentMantissa}`;
    }

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

function replaceDelimiters(output, value, thousandSeparated, state, decimalSeparator) {
    let delimiters = state.currentDelimiters();
    let thousandSeparator = delimiters.thousands;
    decimalSeparator = decimalSeparator || delimiters.decimal;
    let thousandsSize = delimiters.thousandsSize || 3;

    let result = output.toString();
    let characteristic = result.split(".")[0];
    let mantissa = result.split(".")[1];

    if (thousandSeparated) {
        if (value < 0) {
            // Remove the minus sign
            characteristic = characteristic.slice(1);
        }

        let indexesToInsertThousandDelimiters = indexesOfGroupSpaces(characteristic.length, thousandsSize);
        indexesToInsertThousandDelimiters.forEach((position, index) => {
            characteristic = characteristic.slice(0, position + index) + thousandSeparator + characteristic.slice(position + index);
        });

        if (value < 0) {
            // Add back the minus sign
            characteristic = `-${characteristic}`;
        }
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
    if (value === 0) {
        return output;
    }

    if (+output === 0) {
        return output.replace("-", "");
    }

    if (value > 0) {
        return `+${output}`;
    }

    if (negative === "sign") {
        return output;
    }

    return `(${output.replace("-", "")})`;
}

function insertPrefix(output, prefix) {
    return prefix + output;
}

function insertPostfix(output, postfix) {
    return output + postfix;
}

function formatNumber({number, providedFormat, state = globalState, decimalSeparator, defaults = state.currentDefaults()}) {
    let value = number._value;

    if (value === 0 && state.hasZeroFormat()) {
        return state.getZeroFormat();
    }

    if (!isFinite(value)) {
        return value.toString();
    }

    let options = Object.assign({}, defaultOptions, defaults, providedFormat);

    let totalLength = options.totalLength;
    let characteristicPrecision = totalLength ? 0 : options.characteristic;
    let optionalCharacteristic = options.optionalCharacteristic;
    let forceAverage = options.forceAverage;
    let average = !!totalLength || !!forceAverage || options.average;

    // default when averaging is to chop off decimals
    let mantissaPrecision = totalLength ? -1 : (average && providedFormat.mantissa === undefined ? 0 : options.mantissa);
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
    let output = setMantissaPrecision(value.toString(), value, optionalMantissa, mantissaPrecision);
    output = setCharacteristicPrecision(output, value, optionalCharacteristic, characteristicPrecision);
    output = replaceDelimiters(output, value, thousandSeparated, state, decimalSeparator);

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
    getDecimalByteUnit: (...args) => getDecimalByteUnit(...args, numbro)
});
