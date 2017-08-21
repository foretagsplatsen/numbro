(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.numbro = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

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

module.exports = {
    languageTag: "en-US",
    delimiters: {
        thousands: ",",
        decimal: "."
    },
    abbreviations: {
        thousand: "k",
        million: "m",
        billion: "b",
        trillion: "t"
    },
    spaceSeparated: false,
    ordinal: function ordinal(number) {
        var b = number % 10;
        return ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
    },
    currency: {
        symbol: "$",
        position: "prefix",
        code: "USD"
    },
    currencyDefaults: {
        thousandSeparated: true,
        totalLength: 4,
        spaceSeparated: true
    },
    formats: {
        fourDigits: {
            totalLength: 4,
            spaceSeparated: true
        },
        fullWithTwoDecimals: {
            output: "currency",
            thousandSeparated: true,
            mantissa: 2
        },
        fullWithTwoDecimalsNoCurrency: {
            thousandSeparated: true,
            mantissa: 2
        },
        fullWithNoDecimals: {
            output: "currency",
            thousandSeparated: true,
            mantissa: 0
        }
    }
};

},{}],2:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var globalState = require("./globalState");
var validating = require("./validating");
var parsing = require("./parsing");

var binarySuffixes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
var decimalSuffixes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
var bytes = {
    general: { scale: 1024, suffixes: decimalSuffixes, marker: "bd" },
    binary: { scale: 1024, suffixes: binarySuffixes, marker: "b" },
    decimal: { scale: 1000, suffixes: decimalSuffixes, marker: "d" }
};

var defaultOptions = {
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
 * Entry point. Format the provided INSTANCE according to the PROVIDEDFORMAT.
 * This method ensure the prefix and postfix are added as the last step.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} [providedFormat] - specification for formatting
 * @param numbro - the numbro singleton
 * @return {string}
 */
function _format(instance) {
    var providedFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var numbro = arguments[2];

    if (typeof providedFormat === "string") {
        providedFormat = parsing.parseFormat(providedFormat);
    }

    var valid = validating.validateFormat(providedFormat);

    if (!valid) {
        return "ERROR: invalid format";
    }

    var prefix = providedFormat.prefix || "";
    var postfix = providedFormat.postfix || "";

    var output = formatNumbro(instance, providedFormat, numbro);
    output = insertPrefix(output, prefix);
    output = insertPostfix(output, postfix);
    return output;
}

/**
 * Format the provided INSTANCE according to the PROVIDEDFORMAT.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param numbro - the numbro singleton
 * @return {string}
 */
function formatNumbro(instance, providedFormat, numbro) {
    switch (providedFormat.output) {
        case "currency":
            return formatCurrency(instance, providedFormat, globalState, numbro);
        case "percent":
            return formatPercentage(instance, providedFormat, globalState, numbro);
        case "byte":
            return formatByte(instance, providedFormat, globalState, numbro);
        case "time":
            return formatTime(instance, providedFormat, globalState, numbro);
        case "ordinal":
            return formatOrdinal(instance, providedFormat, globalState, numbro);
        case "number":
        default:
            return formatNumber({
                instance: instance,
                providedFormat: providedFormat,
                numbro: numbro
            });
    }
}

/**
 * Get the decimal byte unit (MB) for the provided numbro INSTANCE.
 * We go from one unit to another using the decimal system (1000).
 *
 * @param {Numbro} instance - numbro instance to compute
 * @return {String}
 */
function _getDecimalByteUnit(instance) {
    var data = bytes.decimal;
    return getFormatByteUnits(instance._value, data.suffixes, data.scale).suffix;
}

/**
 * Get the binary byte unit (MiB) for the provided numbro INSTANCE.
 * We go from one unit to another using the decimal system (1024).
 *
 * @param {Numbro} instance - numbro instance to compute
 * @return {String}
 */
function _getBinaryByteUnit(instance) {
    var data = bytes.binary;
    return getFormatByteUnits(instance._value, data.suffixes, data.scale).suffix;
}

/**
 * Get the decimal byte unit (MB) for the provided numbro INSTANCE.
 * We go from one unit to another using the decimal system (1024).
 *
 * @param {Numbro} instance - numbro instance to compute
 * @return {String}
 */
function _getByteUnit(instance) {
    var data = bytes.general;
    return getFormatByteUnits(instance._value, data.suffixes, data.scale).suffix;
}

/**
 * Return the value and the suffix computed in byte.
 * It uses the SUFFIXES and the SCALE provided.
 *
 * @param {number} value - Number to format
 * @param {[String]} suffixes - List of suffixes
 * @param {number} scale - Number in-between two units
 * @return {{value: Number, suffix: String}}
 */
function getFormatByteUnits(value, suffixes, scale) {
    var suffix = suffixes[0];
    var abs = Math.abs(value);

    if (abs >= scale) {
        for (var power = 1; power < suffixes.length; ++power) {
            var min = Math.pow(scale, power);
            var max = Math.pow(scale, power + 1);

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

    return { value: value, suffix: suffix };
}

/**
 * Format the provided INSTANCE as bytes using the PROVIDEDFORMAT, and STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @param numbro - the numbro singleton
 * @return {string}
 */
function formatByte(instance, providedFormat, state, numbro) {
    var base = providedFormat.base || "binary";
    var baseInfo = bytes[base];

    var _getFormatByteUnits = getFormatByteUnits(instance._value, baseInfo.suffixes, baseInfo.scale),
        value = _getFormatByteUnits.value,
        suffix = _getFormatByteUnits.suffix;

    var output = formatNumber({
        instance: numbro(value),
        providedFormat: providedFormat,
        state: state,
        defaults: state.currentByteDefaults()
    });
    var abbreviations = state.currentAbbreviations();
    return "" + output + (abbreviations.spaced ? " " : "") + suffix;
}

/**
 * Format the provided INSTANCE as an ordinal using the PROVIDEDFORMAT,
 * and the STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @return {string}
 */
function formatOrdinal(instance, providedFormat, state) {
    var ordinalFn = state.currentOrdinal();
    var options = Object.assign({}, defaultOptions, state.currentOrdinalDefaults(), providedFormat);

    var output = formatNumber({
        instance: instance,
        providedFormat: providedFormat,
        state: state,
        defaults: state.currentOrdinalDefaults()
    });
    var ordinal = ordinalFn(instance._value);

    return "" + output + (options.spaceSeparated ? " " : "") + ordinal;
}

/**
 * Format the provided INSTANCE as a time HH:MM:SS.
 *
 * @param {Numbro} instance - numbro instance to format
 * @return {string}
 */
function formatTime(instance) {
    var hours = Math.floor(instance._value / 60 / 60);
    var minutes = Math.floor((instance._value - hours * 60 * 60) / 60);
    var seconds = Math.round(instance._value - hours * 60 * 60 - minutes * 60);
    return hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

/**
 * Format the provided INSTANCE as a percentage using the PROVIDEDFORMAT,
 * and the STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @param numbro - the numbro singleton
 * @return {string}
 */
function formatPercentage(instance, providedFormat, state, numbro) {
    var output = formatNumber({
        instance: numbro(instance._value * 100),
        providedFormat: providedFormat,
        state: state,
        defaults: state.currentPercentageDefaults()
    });
    var options = Object.assign({}, defaultOptions, state.currentPercentageDefaults(), providedFormat);
    return "" + output + (options.spaceSeparated ? " " : "") + "%";
}

/**
 * Format the provided INSTANCE as a percentage using the PROVIDEDFORMAT,
 * and the STATE.
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} providedFormat - specification for formatting
 * @param {globalState} state - shared state of the library
 * @return {string}
 */
function formatCurrency(instance, providedFormat, state) {
    var currentCurrency = state.currentCurrency();
    var options = Object.assign({}, defaultOptions, state.currentCurrencyDefaults(), providedFormat);
    var decimalSeparator = undefined;
    var space = "";

    if (options.spaceSeparated) {
        space = " ";
    }

    if (currentCurrency.position === "infix") {
        decimalSeparator = space + currentCurrency.symbol + space;
    }

    var output = formatNumber({
        instance: instance,
        providedFormat: providedFormat,
        state: state,
        decimalSeparator: decimalSeparator,
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

/**
 * Compute the average value out of VALUE.
 * The other parameters are computation options.
 *
 * @param {number} value - value to compute
 * @param {string} [forceAverage] - forced unit used to compute
 * @param {{}} abbreviations - part of the language specification
 * @param {boolean} spaceSeparated - `true` if a space must be inserted between the value and the abbreviation
 * @param {number} [totalLength] - total length of the output including the characteristic and the mantissa
 * @return {{value: number, abbreviation: string, mantissaPrecision: number}}
 */
function computeAverage(_ref) {
    var value = _ref.value,
        forceAverage = _ref.forceAverage,
        abbreviations = _ref.abbreviations,
        _ref$spaceSeparated = _ref.spaceSeparated,
        spaceSeparated = _ref$spaceSeparated === undefined ? false : _ref$spaceSeparated,
        _ref$totalLength = _ref.totalLength,
        totalLength = _ref$totalLength === undefined ? 0 : _ref$totalLength;

    var abbreviation = "";
    var abs = Math.abs(value);
    var mantissaPrecision = -1;

    if (abs >= Math.pow(10, 12) && !forceAverage || forceAverage === "trillion") {
        // trillion
        abbreviation = abbreviations.trillion;
        value = value / Math.pow(10, 12);
    } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !forceAverage || forceAverage === "billion") {
        // billion
        abbreviation = abbreviations.billion;
        value = value / Math.pow(10, 9);
    } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !forceAverage || forceAverage === "million") {
        // million
        abbreviation = abbreviations.million;
        value = value / Math.pow(10, 6);
    } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !forceAverage || forceAverage === "thousand") {
        // thousand
        abbreviation = abbreviations.thousand;
        value = value / Math.pow(10, 3);
    }

    var optionalSpace = spaceSeparated ? " " : "";

    if (abbreviation) {
        abbreviation = optionalSpace + abbreviation;
    }

    if (totalLength) {
        var characteristic = value.toString().split(".")[0];
        mantissaPrecision = Math.max(totalLength - characteristic.length, 0);
    }

    return { value: value, abbreviation: abbreviation, mantissaPrecision: mantissaPrecision };
}

/**
 * Return a string of NUMBER zero.
 *
 * @param {number} number - Length of the output
 * @return {string}
 */
function zeroes(number) {
    var result = "";
    for (var i = 0; i < number; i++) {
        result += "0";
    }

    return result;
}

/**
 * Return a string representing VALUE with a PRECISION-long mantissa.
 * This method is for large/small numbers only (a.k.a. including a "e").
 *
 * @param {number} value - number to precise
 * @param {number} precision - desired length for the mantissa
 * @return {string}
 */
function toFixedLarge(value, precision) {
    var result = value.toString();

    var _result$split = result.split("e"),
        _result$split2 = _slicedToArray(_result$split, 2),
        base = _result$split2[0],
        exp = _result$split2[1];

    var _base$split = base.split("."),
        _base$split2 = _slicedToArray(_base$split, 2),
        characteristic = _base$split2[0],
        _base$split2$ = _base$split2[1],
        mantissa = _base$split2$ === undefined ? "" : _base$split2$;

    if (+exp > 0) {
        result = characteristic + mantissa + zeroes(exp - mantissa.length);
    } else {
        var prefix = ".";

        if (+characteristic < 0) {
            prefix = "-0" + prefix;
        } else {
            prefix = "0" + prefix;
        }

        var suffix = (zeroes(-exp - 1) + Math.abs(characteristic) + mantissa).substr(0, precision);
        if (suffix.length < precision) {
            suffix += zeroes(precision - suffix.length);
        }
        result = prefix + suffix;
    }

    if (+exp > 0 && precision > 0) {
        result += "." + zeroes(precision);
    }

    return result;
}

/**
 * Return a string representing VALUE with a PRECISION-long mantissa.
 *
 * @param {number} value - number to precise
 * @param {number} precision - desired length for the mantissa
 * @return {string}
 */
function toFixed(value, precision) {
    if (value.toString().indexOf("e") !== -1) {
        return toFixedLarge(value, precision);
    }

    return (Math.round(+(value + "e+" + precision)) / Math.pow(10, precision)).toFixed(precision);
}

/**
 * Return the current OUTPUT with a mantissa precions of PRECISION.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {boolean} optionalMantissa - `true` if the mantissa is omitted when it's only zeroes
 * @param {number} precision - desired precision of the mantissa
 * @return {string}
 */
function setMantissaPrecision(output, value, optionalMantissa, precision) {
    if (precision === -1) {
        return output;
    }

    var result = toFixed(value, precision);

    var _result$toString$spli = result.toString().split("."),
        _result$toString$spli2 = _slicedToArray(_result$toString$spli, 2),
        currentCharacteristic = _result$toString$spli2[0],
        _result$toString$spli3 = _result$toString$spli2[1],
        currentMantissa = _result$toString$spli3 === undefined ? "" : _result$toString$spli3;

    if (currentMantissa.match(/^0+$/) && optionalMantissa) {
        return currentCharacteristic;
    }

    return result.toString();
}

/**
 * Return the current OUTPUT with a characteristic precions of PRECISION.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {boolean} optionalCharacteristic - `true` if the characteristic is omitted when it's only zeroes
 * @param {number} precision - desired precision of the characteristic
 * @return {string}
 */
function setCharacteristicPrecision(output, value, optionalCharacteristic, precision) {
    var result = output;

    var _result$toString$spli4 = result.toString().split("."),
        _result$toString$spli5 = _slicedToArray(_result$toString$spli4, 2),
        currentCharacteristic = _result$toString$spli5[0],
        currentMantissa = _result$toString$spli5[1];

    if (currentCharacteristic.match(/^-?0$/) && optionalCharacteristic) {
        if (!currentMantissa) {
            return currentCharacteristic.replace("0", "");
        }

        return currentCharacteristic.replace("0", "") + "." + currentMantissa;
    }

    if (currentCharacteristic.length < precision) {
        var missingZeros = precision - currentCharacteristic.length;
        for (var i = 0; i < missingZeros; i++) {
            result = "0" + result;
        }
    }

    return result.toString();
}

/**
 * Return the indexes where are the group separations after splitting
 * `totalLength` in group of `groupSize` size.
 * Important: we start grouping from the right hand side.
 *
 * @param {number} totalLength - total length of the characteristic to split
 * @param {number} groupSize - length of each group
 * @return {[number]}
 */
function indexesOfGroupSpaces(totalLength, groupSize) {
    var result = [];
    var counter = 0;
    for (var i = totalLength; i > 0; i--) {
        if (counter === groupSize) {
            result.unshift(i);
            counter = 0;
        }
        counter++;
    }

    return result;
}

/**
 * Replace the decimal separator with DECIMALSEPARATOR and insert thousand
 * separators.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {boolean} thousandSeparated - `true` if the characteristic must be separated
 * @param {globalState} state - shared state of the library
 * @param {string} decimalSeparator - string to use as decimal separator
 * @return {string}
 */
function replaceDelimiters(output, value, thousandSeparated, state, decimalSeparator) {
    var delimiters = state.currentDelimiters();
    var thousandSeparator = delimiters.thousands;
    decimalSeparator = decimalSeparator || delimiters.decimal;
    var thousandsSize = delimiters.thousandsSize || 3;

    var result = output.toString();
    var characteristic = result.split(".")[0];
    var mantissa = result.split(".")[1];

    if (thousandSeparated) {
        if (value < 0) {
            // Remove the minus sign
            characteristic = characteristic.slice(1);
        }

        var indexesToInsertThousandDelimiters = indexesOfGroupSpaces(characteristic.length, thousandsSize);
        indexesToInsertThousandDelimiters.forEach(function (position, index) {
            characteristic = characteristic.slice(0, position + index) + thousandSeparator + characteristic.slice(position + index);
        });

        if (value < 0) {
            // Add back the minus sign
            characteristic = "-" + characteristic;
        }
    }

    if (!mantissa) {
        result = characteristic;
    } else {
        result = characteristic + decimalSeparator + mantissa;
    }
    return result;
}

/**
 * Insert the provided ABBREVIATION at the end of OUTPUT.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {string} abbreviation - abbreviation to append
 * @return {*}
 */
function insertAbbreviation(output, abbreviation) {
    return output + abbreviation;
}

/**
 * Insert the positive/negative sign according to the NEGATIVE flag.
 * If the value is negative but still output as 0, the negative sign is removed.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {number} value - number being currently formatted
 * @param {string} negative - flag for the negative form ("sign" or "parenthesis")
 * @return {*}
 */
function insertSign(output, value, negative) {
    if (value === 0) {
        return output;
    }

    if (+output === 0) {
        return output.replace("-", "");
    }

    if (value > 0) {
        return "+" + output;
    }

    if (negative === "sign") {
        return output;
    }

    return "(" + output.replace("-", "") + ")";
}

/**
 * Insert the provided PREFIX at the start of OUTPUT.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {string} prefix - abbreviation to prepend
 * @return {*}
 */
function insertPrefix(output, prefix) {
    return prefix + output;
}

/**
 * Insert the provided POSTFIX at the end of OUTPUT.
 *
 * @param {string} output - output being build in the process of formatting
 * @param {string} postfix - abbreviation to append
 * @return {*}
 */
function insertPostfix(output, postfix) {
    return output + postfix;
}

/**
 * Format the provided INSTANCE as a number using the PROVIDEDFORMAT,
 * and the STATE.
 * This is the key method of the framework!
 *
 * @param {Numbro} instance - numbro instance to format
 * @param {{}} [providedFormat] - specification for formatting
 * @param {globalState} state - shared state of the library
 * @param {string} decimalSeparator - string to use as decimal separator
 * @param {{}} defaults - Set of default values used for formatting
 * @return {string}
 */
function formatNumber(_ref2) {
    var instance = _ref2.instance,
        providedFormat = _ref2.providedFormat,
        _ref2$state = _ref2.state,
        state = _ref2$state === undefined ? globalState : _ref2$state,
        decimalSeparator = _ref2.decimalSeparator,
        _ref2$defaults = _ref2.defaults,
        defaults = _ref2$defaults === undefined ? state.currentDefaults() : _ref2$defaults;

    var value = instance._value;

    if (value === 0 && state.hasZeroFormat()) {
        return state.getZeroFormat();
    }

    if (!isFinite(value)) {
        return value.toString();
    }

    var options = Object.assign({}, defaultOptions, defaults, providedFormat);

    var totalLength = options.totalLength;
    var characteristicPrecision = totalLength ? 0 : options.characteristic;
    var optionalCharacteristic = options.optionalCharacteristic;
    var forceAverage = options.forceAverage;
    var average = !!totalLength || !!forceAverage || options.average;

    // default when averaging is to chop off decimals
    var mantissaPrecision = totalLength ? -1 : average && providedFormat.mantissa === undefined ? 0 : options.mantissa;
    var optionalMantissa = totalLength ? false : options.optionalMantissa;
    var thousandSeparated = options.thousandSeparated;
    var spaceSeparated = options.spaceSeparated;
    var negative = options.negative;
    var forceSign = options.forceSign;

    var abbreviation = "";

    if (average) {
        var data = computeAverage({
            value: value,
            forceAverage: forceAverage,
            abbreviations: state.currentAbbreviations(),
            spaceSeparated: spaceSeparated,
            totalLength: totalLength
        });

        value = data.value;
        abbreviation = data.abbreviation;

        if (totalLength) {
            mantissaPrecision = data.mantissaPrecision;
        }
    }

    // Set mantissa precision
    var output = setMantissaPrecision(value.toString(), value, optionalMantissa, mantissaPrecision);
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

module.exports = function (numbro) {
    return {
        format: function format() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _format.apply(undefined, args.concat([numbro]));
        },
        getByteUnit: function getByteUnit() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return _getByteUnit.apply(undefined, args.concat([numbro]));
        },
        getBinaryByteUnit: function getBinaryByteUnit() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return _getBinaryByteUnit.apply(undefined, args.concat([numbro]));
        },
        getDecimalByteUnit: function getDecimalByteUnit() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            return _getDecimalByteUnit.apply(undefined, args.concat([numbro]));
        }
    };
};

},{"./globalState":3,"./parsing":7,"./validating":9}],3:[function(require,module,exports){
"use strict";

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

var enUS = require("./en-US");
var validating = require("./validating");
var parsing = require("./parsing");

var state = {};

var currentLanguageTag = undefined;
var languages = {};

var zeroFormat = null;

var globalDefaults = {};

function chooseLanguage(tag) {
  currentLanguageTag = tag;
}

function currentLanguageData() {
  return languages[currentLanguageTag];
}

/**
 * Return all the register languages
 *
 * @return {{}}
 */
state.languages = function () {
  return Object.assign({}, languages);
};

//
// Current language accessors
//

/**
 * Return the current language tag
 *
 * @return {string}
 */
state.currentLanguage = function () {
  return currentLanguageTag;
};

/**
 * Return the current language currency data
 *
 * @return {{}}
 */
state.currentCurrency = function () {
  return currentLanguageData().currency;
};

/**
 * Return the current language abbreviations data
 *
 * @return {{}}
 */
state.currentAbbreviations = function () {
  return currentLanguageData().abbreviations;
};

/**
 * Return the current language delimiters data
 *
 * @return {{}}
 */
state.currentDelimiters = function () {
  return currentLanguageData().delimiters;
};

/**
 * Return the current language ordinal function
 *
 * @return {function}
 */
state.currentOrdinal = function () {
  return currentLanguageData().ordinal;
};

//
// Defaults
//

/**
 * Return the current formatting defaults.
 * Use first uses the current language default, then fallbacks to the globally defined defaults.
 *
 * @return {{}}
 */
state.currentDefaults = function () {
  return Object.assign({}, currentLanguageData().defaults, globalDefaults);
};

/**
 * Return the current ordinal specific formatting defaults.
 * Use first uses the current language ordinal default, then fallbacks to the regular defaults.
 *
 * @return {{}}
 */
state.currentOrdinalDefaults = function () {
  return Object.assign({}, state.currentDefaults(), currentLanguageData().ordinalDefaults);
};

/**
 * Return the current byte specific formatting defaults.
 * Use first uses the current language byte default, then fallbacks to the regular defaults.
 *
 * @return {{}}
 */
state.currentByteDefaults = function () {
  return Object.assign({}, state.currentDefaults(), currentLanguageData().byteDefaults);
};

/**
 * Return the current percentage specific formatting defaults.
 * Use first uses the current language percentage default, then fallbacks to the regular defaults.
 *
 * @return {{}}
 */
state.currentPercentageDefaults = function () {
  return Object.assign({}, state.currentDefaults(), currentLanguageData().percentageDefaults);
};

/**
 * Return the current currency specific formatting defaults.
 * Use first uses the current language currency default, then fallbacks to the regular defaults.
 *
 * @return {{}}
 */
state.currentCurrencyDefaults = function () {
  return Object.assign({}, state.currentDefaults(), currentLanguageData().currencyDefaults);
};

/**
 * Set the global formatting defaults.
 *
 * @param {{}|string} format - formatting options to use as defaults
 */
state.setDefaults = function (format) {
  format = parsing.parseFormat(format);
  if (validating.validateFormat(format)) {
    globalDefaults = format;
  }
};

//
// Zero format
//

/**
 * Return the format string for 0.
 *
 * @return {string}
 */
state.getZeroFormat = function () {
  return zeroFormat;
};

/**
 * Set a STRING to output when the value is 0.
 *
 * @param {{}|string} string - string to set
 */
state.setZeroFormat = function (string) {
  return zeroFormat = typeof string === "string" ? string : null;
};

/**
 * Return true if a format for 0 has been set already.
 *
 * @return {boolean}
 */
state.hasZeroFormat = function () {
  return zeroFormat !== null;
};

//
// Getters/Setters
//

/**
 * Return the language data for the provided TAG.
 * Return the current language data if no tag is provided.
 *
 * Throw an error if the tag doesn't match any registered language.
 *
 * @param {string} [tag] - language tag of a registered language
 * @return {{}}
 */
state.languageData = function (tag) {
  if (tag) {
    if (languages[tag]) {
      return languages[tag];
    }
    throw new Error("Unknown tag \"" + tag + "\"");
  }

  return currentLanguageData();
};

/**
 * Register the provided DATA as a language if and only if the data is valid.
 * If the data is not valid, an error is thrown.
 *
 * When USELANGUAGE is true, the registered language is then used.
 *
 * @param {{}} data - language data to register
 * @param {boolean} [useLanguage] - `true` if the provided data should become the current language
 */
state.registerLanguage = function (data) {
  var useLanguage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!validating.validateLanguage(data)) {
    throw new Error("Invalid language data");
  }

  languages[data.languageTag] = data;

  if (useLanguage) {
    chooseLanguage(data.languageTag);
  }
};

/**
 * Set the current language according to TAG.
 * If TAG doesn't match a registered language, another language matching
 * the "language" part of the tag (according to BCP47: https://tools.ietf.org/rfc/bcp/bcp47.txt).
 * If none, the FALLBACKTAG is used. If the FALLBACKTAG doesn't match a register language,
 * `en-US` is finally used.
 *
 * @param tag
 * @param fallbackTag
 */
state.setLanguage = function (tag) {
  var fallbackTag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : enUS.languageTag;

  if (!languages[tag]) {
    var suffix = tag.split("-")[0];

    var matchingLanguageTag = Object.keys(languages).find(function (each) {
      return each.split("-")[0] === suffix;
    });

    if (!languages[matchingLanguageTag]) {
      chooseLanguage(fallbackTag);
      return;
    }

    chooseLanguage(matchingLanguageTag);
  }

  chooseLanguage(tag);
};

state.registerLanguage(enUS);
currentLanguageTag = enUS.languageTag;

module.exports = state;

},{"./en-US":1,"./parsing":7,"./validating":9}],4:[function(require,module,exports){
"use strict";

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

/**
 * Load languages matching TAGS. Silently pass over the failing load.
 *
 * We assume here that we are in a node environment, so we don't check for it.
 * @param {[String]} tags - list of tags to load
 * @param {Numbro} numbro - the numbro singleton
 */
function _loadLanguagesInNode(tags, numbro) {
    tags.forEach(function (tag) {
        var data = undefined;
        try {
            data = require("../languages/" + tag);
        } catch (e) {
            console.error("Unable to load \"" + tag + "\". No matching language file found."); // eslint-disable-line no-console
        }

        if (data) {
            numbro.registerLanguage(data);
        }
    });
}

module.exports = function (numbro) {
    return {
        loadLanguagesInNode: function loadLanguagesInNode(tags) {
            return _loadLanguagesInNode(tags, numbro);
        }
    };
};

},{}],5:[function(require,module,exports){
"use strict";

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

// Todo: add BigNumber support (https://github.com/MikeMcl/bignumber.js/)

function multiplier(x) {
    var parts = x.toString().split(".");
    var mantissa = parts[1];

    if (!mantissa) {
        return 1;
    }

    return Math.pow(10, mantissa.length);
}

function correctionFactor() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var smaller = args.reduce(function (prev, next) {
        var mp = multiplier(prev);
        var mn = multiplier(next);
        return mp > mn ? prev : next;
    }, -Infinity);

    return multiplier(smaller);
}

function _add(n, other, numbro) {
    var value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    var factor = correctionFactor(n._value, value);

    function callback(acc, number) {
        return acc + factor * number;
    }

    n._value = [n._value, value].reduce(callback, 0) / factor;
    return n;
}

function _subtract(n, other, numbro) {
    var value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    var factor = correctionFactor(n._value, value);

    function callback(acc, number) {
        return acc - factor * number;
    }

    n._value = [value].reduce(callback, n._value * factor) / factor;
    return n;
}

function _multiply(n, other, numbro) {
    var value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    function callback(accum, curr) {
        var factor = correctionFactor(accum, curr);
        var result = accum * factor;
        result *= curr * factor;
        result /= factor * factor;

        return result;
    }

    n._value = [n._value, value].reduce(callback, 1);
    return n;
}

function _divide(n, other, numbro) {
    var value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    function callback(accum, curr) {
        var factor = correctionFactor(accum, curr);
        return accum * factor / (curr * factor);
    }

    n._value = [n._value, value].reduce(callback);
    return n;
}

function _set(n, other, numbro) {
    var value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    n._value = value;
    return n;
}

function _difference(n, other, numbro) {
    var clone = numbro(n._value);
    _subtract(clone, other, numbro);

    return Math.abs(clone._value);
}

module.exports = function (numbro) {
    return {
        add: function add(n, other) {
            return _add(n, other, numbro);
        },
        subtract: function subtract(n, other) {
            return _subtract(n, other, numbro);
        },
        multiply: function multiply(n, other) {
            return _multiply(n, other, numbro);
        },
        divide: function divide(n, other) {
            return _divide(n, other, numbro);
        },
        set: function set(n, other) {
            return _set(n, other, numbro);
        },
        difference: function difference(n, other) {
            return _difference(n, other, numbro);
        }
    };
};

},{}],6:[function(require,module,exports){
"use strict";

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

var VERSION = "2.0.0";

//
// Constructor
//

function Numbro(number) {
    this._value = number;
}

function normalizeInput(input) {
    var result = input;
    if (numbro.isNumbro(input)) {
        result = input._value;
    } else if (typeof input === "string") {
        result = numbro.unformat(input);
    } else if (isNaN(input)) {
        result = NaN;
    }

    return result;
}

function numbro(input) {
    return new Numbro(normalizeInput(input));
}

numbro.version = VERSION;

numbro.isNumbro = function (object) {
    return object instanceof Numbro;
};

var globalState = require("./globalState");
var validator = require("./validating");
var loader = require("./loading")(numbro);
var unformatter = require("./unformatting");
var formatter = require("./formatting")(numbro);
var manipulate = require("./manipulating")(numbro);

Numbro.prototype = {
    clone: function clone() {
        return numbro(this._value);
    },
    format: function format() {
        var _format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return formatter.format(this, _format);
    },
    formatCurrency: function formatCurrency() {
        var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        format.output = "currency";
        return formatter.format(this, format);
    },
    formatTime: function formatTime() {
        var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        format.output = "time";
        return formatter.format(this, format);
    },
    binaryByteUnits: function binaryByteUnits() {
        return formatter.getBinaryByteUnit(this);
    },
    decimalByteUnits: function decimalByteUnits() {
        return formatter.getDecimalByteUnit(this);
    },
    byteUnits: function byteUnits() {
        return formatter.getByteUnit(this);
    },
    difference: function difference(other) {
        return manipulate.difference(this, other);
    },
    add: function add(other) {
        return manipulate.add(this, other);
    },
    subtract: function subtract(other) {
        return manipulate.subtract(this, other);
    },
    multiply: function multiply(other) {
        return manipulate.multiply(this, other);
    },
    divide: function divide(other) {
        return manipulate.divide(this, other);
    },
    set: function set(input) {
        return manipulate.set(this, normalizeInput(input));
    },
    value: function value() {
        return this._value;
    },
    valueOf: function valueOf() {
        return this._value;
    }
};

//
// `numbro` static methods
//

numbro.language = globalState.currentLanguage;
numbro.registerLanguage = globalState.registerLanguage;
numbro.setLanguage = globalState.setLanguage;
numbro.languages = globalState.languages;
numbro.languageData = globalState.languageData;
numbro.zeroFormat = globalState.setZeroFormat;
numbro.defaultFormat = globalState.currentDefaults;
numbro.setDefaults = globalState.setDefaults;
numbro.defaultCurrencyFormat = globalState.currentCurrencyDefaults;
numbro.validate = validator.validate;
numbro.loadLanguagesInNode = loader.loadLanguagesInNode;
numbro.unformat = unformatter.unformat;

module.exports = numbro;

},{"./formatting":2,"./globalState":3,"./loading":4,"./manipulating":5,"./unformatting":8,"./validating":9}],7:[function(require,module,exports){
"use strict";

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

function parsePrefix(string, result) {
    var match = string.match(/^{([^}]*)}/);
    if (match) {
        result.prefix = match[1];
        return string.slice(match[0].length);
    }

    return string;
}

function parsePostfix(string, result) {
    var match = string.match(/{([^}]*)}$/);
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
    var match = string.match(/[1-9]+[0-9]*/);

    if (match) {
        result.totalLength = +match[0];
    }
}

function parseCharacteristic(string, result) {
    var characteristic = string.split(".")[0];
    var match = characteristic.match(/0+/);
    if (match) {
        result.characteristic = match[0].length;
    }
}

function parseMantissa(string, result) {
    var mantissa = string.split(".")[1];
    if (mantissa) {
        var match = mantissa.match(/0+/);
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

function parseForceAverage(string, result) {
    if (string.indexOf("K") !== -1) {
        result.forceAverage = "thousand";
    } else if (string.indexOf("M") !== -1) {
        result.forceAverage = "million";
    } else if (string.indexOf("B") !== -1) {
        result.forceAverage = "billion";
    } else if (string.indexOf("T") !== -1) {
        result.forceAverage = "trillion";
    }
}

function parseOptionalMantissa(string, result) {
    if (string.match(/\[\.]/)) {
        result.optionalMantissa = true;
    } else if (string.match(/\./)) {
        result.optionalMantissa = false;
    }
}

function parseOptionalCharacteristic(string, result) {
    if (string.indexOf(".") !== -1) {
        var characteristic = string.split(".")[0];
        result.optionalCharacteristic = characteristic.indexOf("0") === -1;
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

function parseFormat(string) {
    var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof string !== "string") {
        return string;
    }

    string = parsePrefix(string, result);
    string = parsePostfix(string, result);
    parseOutput(string, result);
    parseTotalLength(string, result);
    parseCharacteristic(string, result);
    parseOptionalCharacteristic(string, result);
    parseAverage(string, result);
    parseForceAverage(string, result);
    parseMantissa(string, result);
    parseOptionalMantissa(string, result);
    parseThousandSeparated(string, result);
    parseSpaceSeparated(string, result);
    parseNegative(string, result);
    parseForceSign(string, result);

    return result;
}

module.exports = {
    parseFormat: parseFormat
};

},{}],8:[function(require,module,exports){
"use strict";

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

var allSuffixes = [{ key: "ZiB", factor: Math.pow(1024, 7) }, { key: "ZB", factor: Math.pow(1000, 7) }, { key: "YiB", factor: Math.pow(1024, 8) }, { key: "YB", factor: Math.pow(1000, 8) }, { key: "TiB", factor: Math.pow(1024, 4) }, { key: "TB", factor: Math.pow(1000, 4) }, { key: "PiB", factor: Math.pow(1024, 5) }, { key: "PB", factor: Math.pow(1000, 5) }, { key: "MiB", factor: Math.pow(1024, 2) }, { key: "MB", factor: Math.pow(1000, 2) }, { key: "KiB", factor: Math.pow(1024, 1) }, { key: "KB", factor: Math.pow(1000, 1) }, { key: "GiB", factor: Math.pow(1024, 3) }, { key: "GB", factor: Math.pow(1000, 3) }, { key: "EiB", factor: Math.pow(1024, 6) }, { key: "EB", factor: Math.pow(1000, 6) }, { key: "B", factor: 1 }];

function escapeRegExp(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function unformatValue(inputString, delimiters) {
    var currencySymbol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var ordinal = arguments[3];
    var zeroFormat = arguments[4];
    var abbreviations = arguments[5];
    var format = arguments[6];

    if (inputString === "") {
        return undefined;
    }

    if (!isNaN(+inputString)) {
        return +inputString;
    }

    // Zero Format

    if (inputString === zeroFormat) {
        return 0;
    }

    // Negative

    var match = inputString.match(/\(([^)]*)\)/);

    if (match) {
        return -1 * unformatValue(match[1], delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format);
    }

    // Currency

    var stripped = inputString.replace(currencySymbol, "");

    if (stripped !== inputString) {
        return unformatValue(stripped, delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format);
    }

    // Thousand separators

    stripped = inputString.replace(new RegExp(escapeRegExp(delimiters.thousands), "g"), "");

    if (stripped !== inputString) {
        return unformatValue(stripped, delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format);
    }

    // Decimal

    stripped = inputString.replace(delimiters.decimal, ".");

    if (stripped !== inputString) {
        return unformatValue(stripped, delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format);
    }

    // Byte

    for (var i = 0; i < allSuffixes.length; i++) {
        var suffix = allSuffixes[i];
        stripped = inputString.replace(suffix.key, "");

        if (stripped !== inputString) {
            return unformatValue(stripped, delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format) * suffix.factor;
        }
    }

    // Percent

    stripped = inputString.replace("%", "");

    if (stripped !== inputString) {
        return unformatValue(stripped, delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format) / 100;
    }

    // Ordinal

    var possibleOrdinalValue = parseInt(inputString, 10);

    if (isNaN(possibleOrdinalValue)) {
        return undefined;
    }

    var ordinalString = ordinal(possibleOrdinalValue);
    stripped = inputString.replace(ordinalString, "");

    if (stripped !== inputString) {
        return unformatValue(stripped, delimiters, currencySymbol, format);
    }

    // Average
    var abbreviationKeys = Object.keys(abbreviations);
    var numberOfAbbreviations = abbreviationKeys.length;

    for (var _i = 0; _i < numberOfAbbreviations; _i++) {
        var key = abbreviationKeys[_i];

        stripped = inputString.replace(abbreviations[key], "");

        if (stripped !== inputString) {
            var factor = undefined;
            switch (key) {// eslint-disable-line default-case
                case "thousand":
                    factor = Math.pow(1000, 1);
                    break;
                case "million":
                    factor = Math.pow(1000, 2);
                    break;
                case "billion":
                    factor = Math.pow(1000, 3);
                    break;
                case "trillion":
                    factor = Math.pow(1000, 4);
                    break;
            }
            return unformatValue(stripped, delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format) * factor;
        }
    }

    return undefined;
}

function matchesTime(inputString, delimiters) {
    var separators = inputString.indexOf(":") && delimiters.thousands !== ":";

    if (!separators) {
        return false;
    }

    var segments = inputString.split(":");
    if (segments.length !== 3) {
        return false;
    }

    var hours = +segments[0];
    var minutes = +segments[1];
    var seconds = +segments[2];

    return !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds);
}

function unformatTime(inputString) {
    var segments = inputString.split(":");

    var hours = +segments[0];
    var minutes = +segments[1];
    var seconds = +segments[2];

    return seconds + 60 * minutes + 3600 * hours;
}

function unformat(inputString, format) {
    // Avoid circular references
    var globalState = require("./globalState");

    var delimiters = globalState.currentDelimiters();
    var currencySymbol = globalState.currentCurrency().symbol;
    var ordinal = globalState.currentOrdinal();
    var zeroFormat = globalState.getZeroFormat();
    var abbreviations = globalState.currentAbbreviations();

    var value = undefined;

    if (typeof inputString === "string") {
        if (matchesTime(inputString, delimiters)) {
            value = unformatTime(inputString);
        } else {
            value = unformatValue(inputString, delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format);
        }
    } else if (typeof inputString === "number") {
        value = inputString;
    } else {
        return undefined;
    }

    if (value === undefined) {
        return undefined;
    }

    return value;
}

module.exports = {
    unformat: unformat
};

},{"./globalState":3}],9:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var unformatter = require("./unformatting");

var validOutputValues = ["currency", "percent", "byte", "time", "ordinal", "number"];

var validForceAverageValues = ["trillion", "billion", "million", "thousand"];

var validNegativeValues = ["sign", "parenthesis"];

var validAbbreviations = {
    type: "object",
    children: {
        thousand: "string",
        million: "string",
        billion: "string",
        trillion: "string"
    }
};

var validBaseValues = ["decimal", "binary", "general"];

var validFormat = {
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
        restriction: function restriction(number) {
            return number >= 0;
        },
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
        restriction: function restriction(number) {
            return number >= 0;
        },
        message: "value must be positive"
    },
    mantissa: {
        type: "number",
        restriction: function restriction(number) {
            return number >= 0;
        },
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

var validLanguage = {
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
    var validInput = validateInput(input);
    var isFormatValid = validateFormat(format);

    return validInput && isFormatValid;
}

function validateInput(input) {
    var value = unformatter.unformat(input);

    return !!value;
}

function validateSpec(toValidate, spec, prefix) {
    var results = Object.keys(toValidate).map(function (key) {
        if (!spec[key]) {
            console.error(prefix + " Invalid key: " + key); // eslint-disable-line no-console
            return false;
        }

        var value = toValidate[key];
        var data = spec[key];

        if (typeof data === "string") {
            data = { type: data };
        }

        if (data.type === "format") {
            var valid = validateSpec(value, validFormat, "[Validate " + key + "]");

            if (!valid) {
                return false;
            }
        } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== data.type) {
            console.error(prefix + " " + key + " type mismatched: \"" + data.type + "\" expected, \"" + (typeof value === "undefined" ? "undefined" : _typeof(value)) + "\" provided"); // eslint-disable-line no-console
            return false;
        }

        if (data.restriction && !data.restriction(value)) {
            console.error(prefix + " " + key + " invalid value: " + data.message); // eslint-disable-line no-console
            return false;
        }

        if (data.validValues && data.validValues.indexOf(value) === -1) {
            console.error(prefix + " " + key + " invalid value: must be among " + JSON.stringify(data.validValues) + ", \"" + value + "\" provided"); // eslint-disable-line no-console
            return false;
        }

        if (data.children) {
            var _valid = validateSpec(value, data.children, "[Validate " + key + "]");

            if (!_valid) {
                return false;
            }
        }

        return true;
    });

    return results.reduce(function (acc, current) {
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
    validate: validate,
    validateFormat: validateFormat,
    validateInput: validateInput,
    validateLanguage: validateLanguage
};

},{"./unformatting":8}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW4tVVMuanMiLCJzcmMvZm9ybWF0dGluZy5qcyIsInNyYy9nbG9iYWxTdGF0ZS5qcyIsInNyYy9sb2FkaW5nLmpzIiwic3JjL21hbmlwdWxhdGluZy5qcyIsInNyYy9udW1icm8uanMiLCJzcmMvcGFyc2luZy5qcyIsInNyYy91bmZvcm1hdHRpbmcuanMiLCJzcmMvdmFsaWRhdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsaUJBQWEsT0FEQTtBQUViLGdCQUFZO0FBQ1IsbUJBQVcsR0FESDtBQUVSLGlCQUFTO0FBRkQsS0FGQztBQU1iLG1CQUFlO0FBQ1gsa0JBQVUsR0FEQztBQUVYLGlCQUFTLEdBRkU7QUFHWCxpQkFBUyxHQUhFO0FBSVgsa0JBQVU7QUFKQyxLQU5GO0FBWWIsb0JBQWdCLEtBWkg7QUFhYixhQUFTLGlCQUFTLE1BQVQsRUFBaUI7QUFDdEIsWUFBSSxJQUFJLFNBQVMsRUFBakI7QUFDQSxlQUFRLENBQUMsRUFBRSxTQUFTLEdBQVQsR0FBZSxFQUFqQixDQUFELEtBQTBCLENBQTNCLEdBQWdDLElBQWhDLEdBQXdDLE1BQU0sQ0FBUCxHQUFZLElBQVosR0FBb0IsTUFBTSxDQUFQLEdBQVksSUFBWixHQUFvQixNQUFNLENBQVAsR0FBWSxJQUFaLEdBQW1CLElBQXZHO0FBQ0gsS0FoQlk7QUFpQmIsY0FBVTtBQUNOLGdCQUFRLEdBREY7QUFFTixrQkFBVSxRQUZKO0FBR04sY0FBTTtBQUhBLEtBakJHO0FBc0JiLHNCQUFrQjtBQUNkLDJCQUFtQixJQURMO0FBRWQscUJBQWEsQ0FGQztBQUdkLHdCQUFnQjtBQUhGLEtBdEJMO0FBMkJiLGFBQVM7QUFDTCxvQkFBWTtBQUNSLHlCQUFhLENBREw7QUFFUiw0QkFBZ0I7QUFGUixTQURQO0FBS0wsNkJB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RDhDLENBQ29CO0FBQ2xFLG1CQUFPLEtBQVA7QUFDSDs7QUFFRCxZQUFJLEtBQUssV0FBTCxJQUFvQixLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsS0FBekIsTUFBb0MsQ0FBQyxDQUE3RCxFQUFnRTtBQUM1RCxvQkFBUSxLQUFSLENBQWlCLE1BQWpCLFNBQTJCLEdBQTNCLHNDQUErRCxLQUFLLFNBQUwsQ0FBZSxLQUFLLFdBQXBCLENBQS9ELFlBQXFHLEtBQXJHLGtCQUQ0RCxDQUM2RDtBQUN6SCxtQkFBTyxLQUFQO0FBQ0g7O0FBRUQsWUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDZixnQkFBSSxTQUFRLGFBQWEsS0FBYixFQUFvQixLQUFLLFFBQXpCLGlCQUFnRCxHQUFoRCxPQUFaOztBQUVBLGdCQUFJLENBQUMsTUFBTCxFQUFZO0FBQ1IsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0EzQ2EsQ0FBZDs7QUE2Q0EsV0FBTyxRQUFRLE1BQVIsQ0FBZSxVQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWtCO0FBQ3BDLGVBQU8sT0FBTyxPQUFkO0FBQ0gsS0FGTSxFQUVKLElBRkksQ0FBUDtBQUdIOztBQUVELFNBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQztBQUM1QixXQUFPLGFBQWEsTUFBYixFQUFxQixXQUFyQixFQUFrQyxtQkFBbEMsQ0FBUDtBQUNIOztBQUVELFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0M7QUFDNUIsV0FBTyxhQUFhLElBQWIsRUFBbUIsYUFBbkIsRUFBa0MscUJBQWxDLENBQVA7QUFDSDs7QUFFRCxPQUFPLE9BQVAsR0FBaUI7QUFDYixzQkFEYTtBQUViLGtDQUZhO0FBR2IsZ0NBSGE7QUFJYjtBQUphLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE3IEJlbmphbWluIFZhbiBSeXNlZ2hlbTxiZW5qYW1pbkB2YW5yeXNlZ2hlbS5jb20+XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBsYW5ndWFnZVRhZzogXCJlbi1VU1wiLFxuICAgIGRlbGltaXRlcnM6IHtcbiAgICAgICAgdGhvdXNhbmRzOiBcIixcIixcbiAgICAgICAgZGVjaW1hbDogXCIuXCJcbiAgICB9LFxuICAgIGFiYnJldmlhdGlvbnM6IHtcbiAgICAgICAgdGhvdXNhbmQ6IFwia1wiLFxuICAgICAgICBtaWxsaW9uOiBcIm1cIixcbiAgICAgICAgYmlsbGlvbjogXCJiXCIsXG4gICAgICAgIHRyaWxsaW9uOiBcInRcIlxuICAgIH0sXG4gICAgc3BhY2VTZXBhcmF0ZWQ6IGZhbHNlLFxuICAgIG9yZGluYWw6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgICBsZXQgYiA9IG51bWJlciAlIDEwO1xuICAgICAgICByZXR1cm4gKH5+KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyBcInRoXCIgOiAoYiA9PT0gMSkgPyBcInN0XCIgOiAoYiA9PT0gMikgPyBcIm5kXCIgOiAoYiA9PT0gMykgPyBcInJkXCIgOiBcInRoXCI7XG4gICAgfSxcbiAgICBjdXJyZW5jeToge1xuICAgICAgICBzeW1ib2w6IFwiJFwiLFxuICAgICAgICBwb3NpdGlvbjogXCJwcmVmaXhcIixcbiAgICAgICAgY29kZTogXCJVU0RcIlxuICAgIH0sXG4gICAgY3VycmVuY3lEZWZhdWx0czoge1xuICAgICAgICB0aG91c2FuZFNlcGFyYXRlZDogdHJ1ZSxcbiAgICAgICAgdG90YWxMZW5ndGg6IDQsXG4gICAgICAgIHNwYWNlU2VwYXJhdGVkOiB0cnVlXG4gICAgfSxcbiAgICBmb3JtYXRzOiB7XG4gICAgICAgIGZvdXJEaWdpdHM6IHtcbiAgICAgICAgICAgIHRvdGFsTGVuZ3RoOiA0LFxuICAgICAgICAgICAgc3BhY2VTZXBhcmF0ZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZnVsbFdpdGhUd29EZWNpbWFsczoge1xuICAgICAgICAgICAgb3V0cHV0OiBcImN1cnJlbmN5XCIsXG4gICAgICAgICAgICB0aG91c2FuZFNlcGFyYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIG1hbnRpc3NhOiAyXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bGxXaXRoVHdvRGVjaW1hbHNOb0N1cnJlbmN5OiB7XG4gICAgICAgICAgICB0aG91c2FuZFNlcGFyYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIG1hbnRpc3NhOiAyXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bGxXaXRoTm9EZWNpbWFsczoge1xuICAgICAgICAgICAgb3V0cHV0OiBcImN1cnJlbmN5XCIsXG4gICAgICAgICAgICB0aG91c2FuZFNlcGFyYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIG1hbnRpc3NhOiAwXG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgQmVuamFtaW4gVmFuIFJ5c2VnaGVtPGJlbmphbWluQHZhbnJ5c2VnaGVtLmNvbT5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqIFNPRlRXQVJFLlxuICovXG5cbmNvbnN0IGdsb2JhbFN0YXRlID0gcmVxdWlyZShcIi4vZ2xvYmFsU3RhdGVcIik7XG5jb25zdCB2YWxpZGF0aW5nID0gcmVxdWlyZShcIi4vdmFsaWRhdGluZ1wiKTtcbmNvbnN0IHBhcnNpbmcgPSByZXF1aXJlKFwiLi9wYXJzaW5nXCIpO1xuXG5jb25zdCBiaW5hcnlTdWZmaXhlcyA9IFtcIkJcIiwgXCJLaUJcIiwgXCJNaUJcIiwgXCJHaUJcIiwgXCJUaUJcIiwgXCJQaUJcIiwgXCJFaUJcIiwgXCJaaUJcIiwgXCJZaUJcIl07XG5jb25zdCBkZWNpbWFsU3VmZml4ZXMgPSBbXCJCXCIsIFwiS0JcIiwgXCJNQlwiLCBcIkdCXCIsIFwiVEJcIiwgXCJQQlwiLCBcIkVCXCIsIFwiWkJcIiwgXCJZQlwiXTtcbmNvbnN0IGJ5dGVzID0ge1xuICAgIGdlbmVyYWw6IHtzY2FsZTogMTAyNCwgc3VmZml4ZXM6IGRlY2ltYWxTdWZmaXhlcywgbWFya2VyOiBcImJkXCJ9LFxuICAgIGJpbmFyeToge3NjYWxlOiAxMDI0LCBzdWZmaXhlczogYmluYXJ5U3VmZml4ZXMsIG1hcmtlcjogXCJiXCJ9LFxuICAgIGRlY2ltYWw6IHtzY2FsZTogMTAwMCwgc3VmZml4ZXM6IGRlY2ltYWxTdWZmaXhlcywgbWFya2VyOiBcImRcIn1cbn07XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIHRvdGFsTGVuZ3RoOiAwLFxuICAgIGNoYXJhY3RlcmlzdGljOiAwLFxuICAgIGZvcmNlQXZlcmFnZTogZmFsc2UsXG4gICAgYXZlcmFnZTogZmFsc2UsXG4gICAgbWFudGlzc2E6IC0xLFxuICAgIG9wdGlvbmFsTWFudGlzc2E6IHRydWUsXG4gICAgdGhvdXNhbmRTZXBhcmF0ZWQ6IGZhbHNlLFxuICAgIHNwYWNlU2VwYXJhdGVkOiBmYWxzZSxcbiAgICBuZWdhdGl2ZTogXCJzaWduXCIsXG4gICAgZm9yY2VTaWduOiBmYWxzZVxufTtcblxuLyoqXG4gKiBFbnRyeSBwb2ludC4gRm9ybWF0IHRoZSBwcm92aWRlZCBJTlNUQU5DRSBhY2NvcmRpbmcgdG8gdGhlIFBST1ZJREVERk9STUFULlxuICogVGhpcyBtZXRob2QgZW5zdXJlIHRoZSBwcmVmaXggYW5kIHBvc3RmaXggYXJlIGFkZGVkIGFzIHRoZSBsYXN0IHN0ZXAuXG4gKlxuICogQHBhcmFtIHtOdW1icm99IGluc3RhbmNlIC0gbnVtYnJvIGluc3RhbmNlIHRvIGZvcm1hdFxuICogQHBhcmFtIHt7fX0gW3Byb3ZpZGVkRm9ybWF0XSAtIHNwZWNpZmljYXRpb24gZm9yIGZvcm1hdHRpbmdcbiAqIEBwYXJhbSBudW1icm8gLSB0aGUgbnVtYnJvIHNpbmdsZXRvblxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBmb3JtYXQoaW5zdGFuY2UsIHByb3ZpZGVkRm9ybWF0ID0ge30sIG51bWJybykge1xuICAgIGlmICh0eXBlb2YgcHJvdmlkZWRGb3JtYXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcHJvdmlkZWRGb3JtYXQgPSBwYXJzaW5nLnBhcnNlRm9ybWF0KHByb3ZpZGVkRm9ybWF0KTtcbiAgICB9XG5cbiAgICBsZXQgdmFsaWQgPSB2YWxpZGF0aW5nLnZhbGlkYXRlRm9ybWF0KHByb3ZpZGVkRm9ybWF0KTtcblxuICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIFwiRVJST1I6IGludmFsaWQgZm9ybWF0XCI7XG4gICAgfVxuXG4gICAgbGV0IHByZWZpeCA9IHByb3ZpZGVkRm9ybWF0LnByZWZpeCB8fCBcIlwiO1xuICAgIGxldCBwb3N0Zml4ID0gcHJvdmlkZWRGb3JtYXQucG9zdGZpeCB8fCBcIlwiO1xuXG4gICAgbGV0IG91dHB1dCA9IGZvcm1hdE51bWJybyhpbnN0YW5jZSwgcHJvdmlkZWRGb3JtYXQsIG51bWJybyk7XG4gICAgb3V0cHV0ID0gaW5zZXJ0UHJlZml4KG91dHB1dCwgcHJlZml4KTtcbiAgICBvdXRwdXQgPSBpbnNlcnRQb3N0Zml4KG91dHB1dCwgcG9zdGZpeCk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHByb3ZpZGVkIElOU1RBTkNFIGFjY29yZGluZyB0byB0aGUgUFJPVklERURGT1JNQVQuXG4gKlxuICogQHBhcmFtIHtOdW1icm99IGluc3RhbmNlIC0gbnVtYnJvIGluc3RhbmNlIHRvIGZvcm1hdFxuICogQHBhcmFtIHt7fX0gcHJvdmlkZWRGb3JtYXQgLSBzcGVjaWZpY2F0aW9uIGZvciBmb3JtYXR0aW5nXG4gKiBAcGFyYW0gbnVtYnJvIC0gdGhlIG51bWJybyBzaW5nbGV0b25cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZm9ybWF0TnVtYnJvKGluc3RhbmNlLCBwcm92aWRlZEZvcm1hdCwgbnVtYnJvKSB7XG4gICAgc3dpdGNoIChwcm92aWRlZEZvcm1hdC5vdXRwdXQpIHtcbiAgICAgICAgY2FzZSBcImN1cnJlbmN5XCI6XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0Q3VycmVuY3koaW5zdGFuY2UsIHByb3ZpZGVkRm9ybWF0LCBnbG9iYWxTdGF0ZSwgbnVtYnJvKTtcbiAgICAgICAgY2FzZSBcInBlcmNlbnRcIjpcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRQZXJjZW50YWdlKGluc3RhbmNlLCBwcm92aWRlZEZvcm1hdCwgZ2xvYmFsU3RhdGUsIG51bWJybyk7XG4gICAgICAgIGNhc2UgXCJieXRlXCI6XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0Qnl0ZShpbnN0YW5jZSwgcHJvdmlkZWRGb3JtYXQsIGdsb2JhbFN0YXRlLCBudW1icm8pO1xuICAgICAgICBjYXNlIFwidGltZVwiOlxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdFRpbWUoaW5zdGFuY2UsIHByb3ZpZGVkRm9ybWF0LCBnbG9iYWxTdGF0ZSwgbnVtYnJvKTtcbiAgICAgICAgY2FzZSBcIm9yZGluYWxcIjpcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRPcmRpbmFsKGluc3RhbmNlLCBwcm92aWRlZEZvcm1hdCwgZ2xvYmFsU3RhdGUsIG51bWJybyk7XG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXROdW1iZXIoe1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVkRm9ybWF0LFxuICAgICAgICAgICAgICAgIG51bWJyb1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgZGVjaW1hbCBieXRlIHVuaXQgKE1CKSBmb3IgdGhlIHByb3ZpZGVkIG51bWJybyBJTlNUQU5DRS5cbiAqIFdlIGdvIGZyb20gb25lIHVuaXQgdG8gYW5vdGhlciB1c2luZyB0aGUgZGVjaW1hbCBzeXN0ZW0gKDEwMDApLlxuICpcbiAqIEBwYXJhbSB7TnVtYnJvfSBpbnN0YW5jZSAtIG51bWJybyBpbnN0YW5jZSB0byBjb21wdXRlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldERlY2ltYWxCeXRlVW5pdChpbnN0YW5jZSkge1xuICAgIGxldCBkYXRhID0gYnl0ZXMuZGVjaW1hbDtcbiAgICByZXR1cm4gZ2V0Rm9ybWF0Qnl0ZVVuaXRzKGluc3RhbmNlLl92YWx1ZSwgZGF0YS5zdWZmaXhlcywgZGF0YS5zY2FsZSkuc3VmZml4O1xufVxuXG4vKipcbiAqIEdldCB0aGUgYmluYXJ5IGJ5dGUgdW5pdCAoTWlCKSBmb3IgdGhlIHByb3ZpZGVkIG51bWJybyBJTlNUQU5DRS5cbiAqIFdlIGdvIGZyb20gb25lIHVuaXQgdG8gYW5vdGhlciB1c2luZyB0aGUgZGVjaW1hbCBzeXN0ZW0gKDEwMjQpLlxuICpcbiAqIEBwYXJhbSB7TnVtYnJvfSBpbnN0YW5jZSAtIG51bWJybyBpbnN0YW5jZSB0byBjb21wdXRlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEJpbmFyeUJ5dGVVbml0KGluc3RhbmNlKSB7XG4gICAgbGV0IGRhdGEgPSBieXRlcy5iaW5hcnk7XG4gICAgcmV0dXJuIGdldEZvcm1hdEJ5dGVVbml0cyhpbnN0YW5jZS5fdmFsdWUsIGRhdGEuc3VmZml4ZXMsIGRhdGEuc2NhbGUpLnN1ZmZpeDtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGRlY2ltYWwgYnl0ZSB1bml0IChNQikgZm9yIHRoZSBwcm92aWRlZCBudW1icm8gSU5TVEFOQ0UuXG4gKiBXZSBnbyBmcm9tIG9uZSB1bml0IHRvIGFub3RoZXIgdXNpbmcgdGhlIGRlY2ltYWwgc3lzdGVtICgxMDI0KS5cbiAqXG4gKiBAcGFyYW0ge051bWJyb30gaW5zdGFuY2UgLSBudW1icm8gaW5zdGFuY2UgdG8gY29tcHV0ZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRCeXRlVW5pdChpbnN0YW5jZSkge1xuICAgIGxldCBkYXRhID0gYnl0ZXMuZ2VuZXJhbDtcbiAgICByZXR1cm4gZ2V0Rm9ybWF0Qnl0ZVVuaXRzKGluc3RhbmNlLl92YWx1ZSwgZGF0YS5zdWZmaXhlcywgZGF0YS5zY2FsZSkuc3VmZml4O1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgdmFsdWUgYW5kIHRoZSBzdWZmaXggY29tcHV0ZWQgaW4gYnl0ZS5cbiAqIEl0IHVzZXMgdGhlIFNVRkZJWEVTIGFuZCB0aGUgU0NBTEUgcHJvdmlkZWQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gTnVtYmVyIHRvIGZvcm1hdFxuICogQHBhcmFtIHtbU3RyaW5nXX0gc3VmZml4ZXMgLSBMaXN0IG9mIHN1ZmZpeGVzXG4gKiBAcGFyYW0ge251bWJlcn0gc2NhbGUgLSBOdW1iZXIgaW4tYmV0d2VlbiB0d28gdW5pdHNcbiAqIEByZXR1cm4ge3t2YWx1ZTogTnVtYmVyLCBzdWZmaXg6IFN0cmluZ319XG4gKi9cbmZ1bmN0aW9uIGdldEZvcm1hdEJ5dGVVbml0cyh2YWx1ZSwgc3VmZml4ZXMsIHNjYWxlKSB7XG4gICAgbGV0IHN1ZmZpeCA9IHN1ZmZpeGVzWzBdO1xuICAgIGxldCBhYnMgPSBNYXRoLmFicyh2YWx1ZSk7XG5cbiAgICBpZiAoYWJzID49IHNjYWxlKSB7XG4gICAgICAgIGZvciAobGV0IHBvd2VyID0gMTsgcG93ZXIgPCBzdWZmaXhlcy5sZW5ndGg7ICsrcG93ZXIpIHtcbiAgICAgICAgICAgIGxldCBtaW4gPSBNYXRoLnBvdyhzY2FsZSwgcG93ZXIpO1xuICAgICAgICAgICAgbGV0IG1heCA9IE1hdGgucG93KHNjYWxlLCBwb3dlciArIDEpO1xuXG4gICAgICAgICAgICBpZiAoYWJzID49IG1pbiAmJiBhYnMgPCBtYXgpIHtcbiAgICAgICAgICAgICAgICBzdWZmaXggPSBzdWZmaXhlc1twb3dlcl07XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIG1pbjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbHVlcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gW3NjYWxlXSBZQiBuZXZlciBzZXQgdGhlIHN1ZmZpeFxuICAgICAgICBpZiAoc3VmZml4ID09PSBzdWZmaXhlc1swXSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KHNjYWxlLCBzdWZmaXhlcy5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIHN1ZmZpeCA9IHN1ZmZpeGVzW3N1ZmZpeGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHt2YWx1ZSwgc3VmZml4fTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHByb3ZpZGVkIElOU1RBTkNFIGFzIGJ5dGVzIHVzaW5nIHRoZSBQUk9WSURFREZPUk1BVCwgYW5kIFNUQVRFLlxuICpcbiAqIEBwYXJhbSB7TnVtYnJvfSBpbnN0YW5jZSAtIG51bWJybyBpbnN0YW5jZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB7e319IHByb3ZpZGVkRm9ybWF0IC0gc3BlY2lmaWNhdGlvbiBmb3IgZm9ybWF0dGluZ1xuICogQHBhcmFtIHtnbG9iYWxTdGF0ZX0gc3RhdGUgLSBzaGFyZWQgc3RhdGUgb2YgdGhlIGxpYnJhcnlcbiAqIEBwYXJhbSBudW1icm8gLSB0aGUgbnVtYnJvIHNpbmdsZXRvblxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBmb3JtYXRCeXRlKGluc3RhbmNlLCBwcm92aWRlZEZvcm1hdCwgc3RhdGUsIG51bWJybykge1xuICAgIGxldCBiYXNlID0gcHJvdmlkZWRGb3JtYXQuYmFzZSB8fCBcImJpbmFyeVwiO1xuICAgIGxldCBiYXNlSW5mbyA9IGJ5dGVzW2Jhc2VdO1xuXG4gICAgbGV0IHt2YWx1ZSwgc3VmZml4fSA9IGdldEZvcm1hdEJ5dGVVbml0cyhpbnN0YW5jZS5fdmFsdWUsIGJhc2VJbmZvLnN1ZmZpeGVzLCBiYXNlSW5mby5zY2FsZSk7XG4gICAgbGV0IG91dHB1dCA9IGZvcm1hdE51bWJlcih7XG4gICAgICAgIGluc3RhbmNlOiBudW1icm8odmFsdWUpLFxuICAgICAgICBwcm92aWRlZEZvcm1hdCxcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIGRlZmF1bHRzOiBzdGF0ZS5jdXJyZW50Qnl0ZURlZmF1bHRzKClcbiAgICB9KTtcbiAgICBsZXQgYWJicmV2aWF0aW9ucyA9IHN0YXRlLmN1cnJlbnRBYmJyZXZpYXRpb25zKCk7XG4gICAgcmV0dXJuIGAke291dHB1dH0ke2FiYnJldmlhdGlvbnMuc3BhY2VkID8gXCIgXCIgOiBcIlwifSR7c3VmZml4fWA7XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBwcm92aWRlZCBJTlNUQU5DRSBhcyBhbiBvcmRpbmFsIHVzaW5nIHRoZSBQUk9WSURFREZPUk1BVCxcbiAqIGFuZCB0aGUgU1RBVEUuXG4gKlxuICogQHBhcmFtIHtOdW1icm99IGluc3RhbmNlIC0gbnVtYnJvIGluc3RhbmNlIHRvIGZvcm1hdFxuICogQHBhcmFtIHt7fX0gcHJvdmlkZWRGb3JtYXQgLSBzcGVjaWZpY2F0aW9uIGZvciBmb3JtYXR0aW5nXG4gKiBAcGFyYW0ge2dsb2JhbFN0YXRlfSBzdGF0ZSAtIHNoYXJlZCBzdGF0ZSBvZiB0aGUgbGlicmFyeVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBmb3JtYXRPcmRpbmFsKGluc3RhbmNlLCBwcm92aWRlZEZvcm1hdCwgc3RhdGUpIHtcbiAgICBsZXQgb3JkaW5hbEZuID0gc3RhdGUuY3VycmVudE9yZGluYWwoKTtcbiAgICBsZXQgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBzdGF0ZS5jdXJyZW50T3JkaW5hbERlZmF1bHRzKCksIHByb3ZpZGVkRm9ybWF0KTtcblxuICAgIGxldCBvdXRwdXQgPSBmb3JtYXROdW1iZXIoe1xuICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgcHJvdmlkZWRGb3JtYXQsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBkZWZhdWx0czogc3RhdGUuY3VycmVudE9yZGluYWxEZWZhdWx0cygpXG4gICAgfSk7XG4gICAgbGV0IG9yZGluYWwgPSBvcmRpbmFsRm4oaW5zdGFuY2UuX3ZhbHVlKTtcblxuICAgIHJldHVybiBgJHtvdXRwdXR9JHtvcHRpb25zLnNwYWNlU2VwYXJhdGVkID8gXCIgXCIgOiBcIlwifSR7b3JkaW5hbH1gO1xufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgcHJvdmlkZWQgSU5TVEFOQ0UgYXMgYSB0aW1lIEhIOk1NOlNTLlxuICpcbiAqIEBwYXJhbSB7TnVtYnJvfSBpbnN0YW5jZSAtIG51bWJybyBpbnN0YW5jZSB0byBmb3JtYXRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZm9ybWF0VGltZShpbnN0YW5jZSkge1xuICAgIGxldCBob3VycyA9IE1hdGguZmxvb3IoaW5zdGFuY2UuX3ZhbHVlIC8gNjAgLyA2MCk7XG4gICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKChpbnN0YW5jZS5fdmFsdWUgLSAoaG91cnMgKiA2MCAqIDYwKSkgLyA2MCk7XG4gICAgbGV0IHNlY29uZHMgPSBNYXRoLnJvdW5kKGluc3RhbmNlLl92YWx1ZSAtIChob3VycyAqIDYwICogNjApIC0gKG1pbnV0ZXMgKiA2MCkpO1xuICAgIHJldHVybiBgJHtob3Vyc306JHsobWludXRlcyA8IDEwKSA/IFwiMFwiIDogXCJcIn0ke21pbnV0ZXN9OiR7KHNlY29uZHMgPCAxMCkgPyBcIjBcIiA6IFwiXCJ9JHtzZWNvbmRzfWA7XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBwcm92aWRlZCBJTlNUQU5DRSBhcyBhIHBlcmNlbnRhZ2UgdXNpbmcgdGhlIFBST1ZJREVERk9STUFULFxuICogYW5kIHRoZSBTVEFURS5cbiAqXG4gKiBAcGFyYW0ge051bWJyb30gaW5zdGFuY2UgLSBudW1icm8gaW5zdGFuY2UgdG8gZm9ybWF0XG4gKiBAcGFyYW0ge3t9fSBwcm92aWRlZEZvcm1hdCAtIHNwZWNpZmljYXRpb24gZm9yIGZvcm1hdHRpbmdcbiAqIEBwYXJhbSB7Z2xvYmFsU3RhdGV9IHN0YXRlIC0gc2hhcmVkIHN0YXRlIG9mIHRoZSBsaWJyYXJ5XG4gKiBAcGFyYW0gbnVtYnJvIC0gdGhlIG51bWJybyBzaW5nbGV0b25cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZm9ybWF0UGVyY2VudGFnZShpbnN0YW5jZSwgcHJvdmlkZWRGb3JtYXQsIHN0YXRlLCBudW1icm8pIHtcbiAgICBsZXQgb3V0cHV0ID0gZm9ybWF0TnVtYmVyKHtcbiAgICAgICAgaW5zdGFuY2U6IG51bWJybyhpbnN0YW5jZS5fdmFsdWUgKiAxMDApLFxuICAgICAgICBwcm92aWRlZEZvcm1hdCxcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIGRlZmF1bHRzOiBzdGF0ZS5jdXJyZW50UGVyY2VudGFnZURlZmF1bHRzKClcbiAgICB9KTtcbiAgICBsZXQgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBzdGF0ZS5jdXJyZW50UGVyY2VudGFnZURlZmF1bHRzKCksIHByb3ZpZGVkRm9ybWF0KTtcbiAgICByZXR1cm4gYCR7b3V0cHV0fSR7b3B0aW9ucy5zcGFjZVNlcGFyYXRlZCA/IFwiIFwiIDogXCJcIn0lYDtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHByb3ZpZGVkIElOU1RBTkNFIGFzIGEgcGVyY2VudGFnZSB1c2luZyB0aGUgUFJPVklERURGT1JNQVQsXG4gKiBhbmQgdGhlIFNUQVRFLlxuICpcbiAqIEBwYXJhbSB7TnVtYnJvfSBpbnN0YW5jZSAtIG51bWJybyBpbnN0YW5jZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB7e319IHByb3ZpZGVkRm9ybWF0IC0gc3BlY2lmaWNhdGlvbiBmb3IgZm9ybWF0dGluZ1xuICogQHBhcmFtIHtnbG9iYWxTdGF0ZX0gc3RhdGUgLSBzaGFyZWQgc3RhdGUgb2YgdGhlIGxpYnJhcnlcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZm9ybWF0Q3VycmVuY3koaW5zdGFuY2UsIHByb3ZpZGVkRm9ybWF0LCBzdGF0ZSkge1xuICAgIGNvbnN0IGN1cnJlbnRDdXJyZW5jeSA9IHN0YXRlLmN1cnJlbnRDdXJyZW5jeSgpO1xuICAgIGxldCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHN0YXRlLmN1cnJlbnRDdXJyZW5jeURlZmF1bHRzKCksIHByb3ZpZGVkRm9ybWF0KTtcbiAgICBsZXQgZGVjaW1hbFNlcGFyYXRvciA9IHVuZGVmaW5lZDtcbiAgICBsZXQgc3BhY2UgPSBcIlwiO1xuXG4gICAgaWYgKG9wdGlvbnMuc3BhY2VTZXBhcmF0ZWQpIHtcbiAgICAgICAgc3BhY2UgPSBcIiBcIjtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudEN1cnJlbmN5LnBvc2l0aW9uID09PSBcImluZml4XCIpIHtcbiAgICAgICAgZGVjaW1hbFNlcGFyYXRvciA9IHNwYWNlICsgY3VycmVudEN1cnJlbmN5LnN5bWJvbCArIHNwYWNlO1xuICAgIH1cblxuICAgIGxldCBvdXRwdXQgPSBmb3JtYXROdW1iZXIoe1xuICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgcHJvdmlkZWRGb3JtYXQsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBkZWNpbWFsU2VwYXJhdG9yLFxuICAgICAgICBkZWZhdWx0czogc3RhdGUuY3VycmVudEN1cnJlbmN5RGVmYXVsdHMoKVxuICAgIH0pO1xuXG4gICAgaWYgKGN1cnJlbnRDdXJyZW5jeS5wb3NpdGlvbiA9PT0gXCJwcmVmaXhcIikge1xuICAgICAgICBvdXRwdXQgPSBjdXJyZW50Q3VycmVuY3kuc3ltYm9sICsgc3BhY2UgKyBvdXRwdXQ7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRDdXJyZW5jeS5wb3NpdGlvbiA9PT0gXCJwb3N0Zml4XCIpIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgc3BhY2UgKyBjdXJyZW50Q3VycmVuY3kuc3ltYm9sO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQ7XG59XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgYXZlcmFnZSB2YWx1ZSBvdXQgb2YgVkFMVUUuXG4gKiBUaGUgb3RoZXIgcGFyYW1ldGVycyBhcmUgY29tcHV0YXRpb24gb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB2YWx1ZSB0byBjb21wdXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gW2ZvcmNlQXZlcmFnZV0gLSBmb3JjZWQgdW5pdCB1c2VkIHRvIGNvbXB1dGVcbiAqIEBwYXJhbSB7e319IGFiYnJldmlhdGlvbnMgLSBwYXJ0IG9mIHRoZSBsYW5ndWFnZSBzcGVjaWZpY2F0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNwYWNlU2VwYXJhdGVkIC0gYHRydWVgIGlmIGEgc3BhY2UgbXVzdCBiZSBpbnNlcnRlZCBiZXR3ZWVuIHRoZSB2YWx1ZSBhbmQgdGhlIGFiYnJldmlhdGlvblxuICogQHBhcmFtIHtudW1iZXJ9IFt0b3RhbExlbmd0aF0gLSB0b3RhbCBsZW5ndGggb2YgdGhlIG91dHB1dCBpbmNsdWRpbmcgdGhlIGNoYXJhY3RlcmlzdGljIGFuZCB0aGUgbWFudGlzc2FcbiAqIEByZXR1cm4ge3t2YWx1ZTogbnVtYmVyLCBhYmJyZXZpYXRpb246IHN0cmluZywgbWFudGlzc2FQcmVjaXNpb246IG51bWJlcn19XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVBdmVyYWdlKHt2YWx1ZSwgZm9yY2VBdmVyYWdlLCBhYmJyZXZpYXRpb25zLCBzcGFjZVNlcGFyYXRlZCA9IGZhbHNlLCB0b3RhbExlbmd0aCA9IDB9KSB7XG4gICAgbGV0IGFiYnJldmlhdGlvbiA9IFwiXCI7XG4gICAgbGV0IGFicyA9IE1hdGguYWJzKHZhbHVlKTtcbiAgICBsZXQgbWFudGlzc2FQcmVjaXNpb24gPSAtMTtcblxuICAgIGlmICgoYWJzID49IE1hdGgucG93KDEwLCAxMikgJiYgIWZvcmNlQXZlcmFnZSkgfHwgKGZvcmNlQXZlcmFnZSA9PT0gXCJ0cmlsbGlvblwiKSkge1xuICAgICAgICAvLyB0cmlsbGlvblxuICAgICAgICBhYmJyZXZpYXRpb24gPSBhYmJyZXZpYXRpb25zLnRyaWxsaW9uO1xuICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDEyKTtcbiAgICB9IGVsc2UgaWYgKChhYnMgPCBNYXRoLnBvdygxMCwgMTIpICYmIGFicyA+PSBNYXRoLnBvdygxMCwgOSkgJiYgIWZvcmNlQXZlcmFnZSkgfHwgKGZvcmNlQXZlcmFnZSA9PT0gXCJiaWxsaW9uXCIpKSB7XG4gICAgICAgIC8vIGJpbGxpb25cbiAgICAgICAgYWJicmV2aWF0aW9uID0gYWJicmV2aWF0aW9ucy5iaWxsaW9uO1xuICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gTWF0aC5wb3coMTAsIDkpO1xuICAgIH0gZWxzZSBpZiAoKGFicyA8IE1hdGgucG93KDEwLCA5KSAmJiBhYnMgPj0gTWF0aC5wb3coMTAsIDYpICYmICFmb3JjZUF2ZXJhZ2UpIHx8IChmb3JjZUF2ZXJhZ2UgPT09IFwibWlsbGlvblwiKSkge1xuICAgICAgICAvLyBtaWxsaW9uXG4gICAgICAgIGFiYnJldmlhdGlvbiA9IGFiYnJldmlhdGlvbnMubWlsbGlvbjtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIE1hdGgucG93KDEwLCA2KTtcbiAgICB9IGVsc2UgaWYgKChhYnMgPCBNYXRoLnBvdygxMCwgNikgJiYgYWJzID49IE1hdGgucG93KDEwLCAzKSAmJiAhZm9yY2VBdmVyYWdlKSB8fCAoZm9yY2VBdmVyYWdlID09PSBcInRob3VzYW5kXCIpKSB7XG4gICAgICAgIC8vIHRob3VzYW5kXG4gICAgICAgIGFiYnJldmlhdGlvbiA9IGFiYnJldmlhdGlvbnMudGhvdXNhbmQ7XG4gICAgICAgIHZhbHVlID0gdmFsdWUgLyBNYXRoLnBvdygxMCwgMyk7XG4gICAgfVxuXG4gICAgbGV0IG9wdGlvbmFsU3BhY2UgPSBzcGFjZVNlcGFyYXRlZCA/IFwiIFwiIDogXCJcIjtcblxuICAgIGlmIChhYmJyZXZpYXRpb24pIHtcbiAgICAgICAgYWJicmV2aWF0aW9uID0gb3B0aW9uYWxTcGFjZSArIGFiYnJldmlhdGlvbjtcbiAgICB9XG5cbiAgICBpZiAodG90YWxMZW5ndGgpIHtcbiAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMF07XG4gICAgICAgIG1hbnRpc3NhUHJlY2lzaW9uID0gTWF0aC5tYXgodG90YWxMZW5ndGggLSBjaGFyYWN0ZXJpc3RpYy5sZW5ndGgsIDApO1xuICAgIH1cblxuICAgIHJldHVybiB7dmFsdWUsIGFiYnJldmlhdGlvbiwgbWFudGlzc2FQcmVjaXNpb259O1xufVxuXG4vKipcbiAqIFJldHVybiBhIHN0cmluZyBvZiBOVU1CRVIgemVyby5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gTGVuZ3RoIG9mIHRoZSBvdXRwdXRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gemVyb2VzKG51bWJlcikge1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ICs9IFwiMFwiO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyBWQUxVRSB3aXRoIGEgUFJFQ0lTSU9OLWxvbmcgbWFudGlzc2EuXG4gKiBUaGlzIG1ldGhvZCBpcyBmb3IgbGFyZ2Uvc21hbGwgbnVtYmVycyBvbmx5IChhLmsuYS4gaW5jbHVkaW5nIGEgXCJlXCIpLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIG51bWJlciB0byBwcmVjaXNlXG4gKiBAcGFyYW0ge251bWJlcn0gcHJlY2lzaW9uIC0gZGVzaXJlZCBsZW5ndGggZm9yIHRoZSBtYW50aXNzYVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB0b0ZpeGVkTGFyZ2UodmFsdWUsIHByZWNpc2lvbikge1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZS50b1N0cmluZygpO1xuXG4gICAgbGV0IFtiYXNlLCBleHBdID0gcmVzdWx0LnNwbGl0KFwiZVwiKTtcblxuICAgIGxldCBbY2hhcmFjdGVyaXN0aWMsIG1hbnRpc3NhID0gXCJcIl0gPSBiYXNlLnNwbGl0KFwiLlwiKTtcblxuICAgIGlmICgrZXhwID4gMCkge1xuICAgICAgICByZXN1bHQgPSBjaGFyYWN0ZXJpc3RpYyArIG1hbnRpc3NhICsgemVyb2VzKGV4cCAtIG1hbnRpc3NhLmxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByZWZpeCA9IFwiLlwiO1xuXG4gICAgICAgIGlmICgrY2hhcmFjdGVyaXN0aWMgPCAwKSB7XG4gICAgICAgICAgICBwcmVmaXggPSBgLTAke3ByZWZpeH1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJlZml4ID0gYDAke3ByZWZpeH1gO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN1ZmZpeCA9ICh6ZXJvZXMoLWV4cCAtIDEpICsgTWF0aC5hYnMoY2hhcmFjdGVyaXN0aWMpICsgbWFudGlzc2EpLnN1YnN0cigwLCBwcmVjaXNpb24pO1xuICAgICAgICBpZiAoc3VmZml4Lmxlbmd0aCA8IHByZWNpc2lvbikge1xuICAgICAgICAgICAgc3VmZml4ICs9IHplcm9lcyhwcmVjaXNpb24gLSBzdWZmaXgubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBwcmVmaXggKyBzdWZmaXg7XG4gICAgfVxuXG4gICAgaWYgKCtleHAgPiAwICYmIHByZWNpc2lvbiA+IDApIHtcbiAgICAgICAgcmVzdWx0ICs9IGAuJHt6ZXJvZXMocHJlY2lzaW9uKX1gO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyBWQUxVRSB3aXRoIGEgUFJFQ0lTSU9OLWxvbmcgbWFudGlzc2EuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gbnVtYmVyIHRvIHByZWNpc2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBwcmVjaXNpb24gLSBkZXNpcmVkIGxlbmd0aCBmb3IgdGhlIG1hbnRpc3NhXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHRvRml4ZWQodmFsdWUsIHByZWNpc2lvbikge1xuICAgIGlmICh2YWx1ZS50b1N0cmluZygpLmluZGV4T2YoXCJlXCIpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gdG9GaXhlZExhcmdlKHZhbHVlLCBwcmVjaXNpb24pO1xuICAgIH1cblxuICAgIHJldHVybiAoTWF0aC5yb3VuZCgrYCR7dmFsdWV9ZSske3ByZWNpc2lvbn1gKSAvIChNYXRoLnBvdygxMCwgcHJlY2lzaW9uKSkpLnRvRml4ZWQocHJlY2lzaW9uKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgT1VUUFVUIHdpdGggYSBtYW50aXNzYSBwcmVjaW9ucyBvZiBQUkVDSVNJT04uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG91dHB1dCAtIG91dHB1dCBiZWluZyBidWlsZCBpbiB0aGUgcHJvY2VzcyBvZiBmb3JtYXR0aW5nXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBudW1iZXIgYmVpbmcgY3VycmVudGx5IGZvcm1hdHRlZFxuICogQHBhcmFtIHtib29sZWFufSBvcHRpb25hbE1hbnRpc3NhIC0gYHRydWVgIGlmIHRoZSBtYW50aXNzYSBpcyBvbWl0dGVkIHdoZW4gaXQncyBvbmx5IHplcm9lc1xuICogQHBhcmFtIHtudW1iZXJ9IHByZWNpc2lvbiAtIGRlc2lyZWQgcHJlY2lzaW9uIG9mIHRoZSBtYW50aXNzYVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBzZXRNYW50aXNzYVByZWNpc2lvbihvdXRwdXQsIHZhbHVlLCBvcHRpb25hbE1hbnRpc3NhLCBwcmVjaXNpb24pIHtcbiAgICBpZiAocHJlY2lzaW9uID09PSAtMSkge1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSB0b0ZpeGVkKHZhbHVlLCBwcmVjaXNpb24pO1xuICAgIGxldCBbY3VycmVudENoYXJhY3RlcmlzdGljLCBjdXJyZW50TWFudGlzc2EgPSBcIlwiXSA9IHJlc3VsdC50b1N0cmluZygpLnNwbGl0KFwiLlwiKTtcblxuICAgIGlmIChjdXJyZW50TWFudGlzc2EubWF0Y2goL14wKyQvKSAmJiBvcHRpb25hbE1hbnRpc3NhKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50Q2hhcmFjdGVyaXN0aWM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdC50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgY3VycmVudCBPVVRQVVQgd2l0aCBhIGNoYXJhY3RlcmlzdGljIHByZWNpb25zIG9mIFBSRUNJU0lPTi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gb3V0cHV0IC0gb3V0cHV0IGJlaW5nIGJ1aWxkIGluIHRoZSBwcm9jZXNzIG9mIGZvcm1hdHRpbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIG51bWJlciBiZWluZyBjdXJyZW50bHkgZm9ybWF0dGVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbmFsQ2hhcmFjdGVyaXN0aWMgLSBgdHJ1ZWAgaWYgdGhlIGNoYXJhY3RlcmlzdGljIGlzIG9taXR0ZWQgd2hlbiBpdCdzIG9ubHkgemVyb2VzXG4gKiBAcGFyYW0ge251bWJlcn0gcHJlY2lzaW9uIC0gZGVzaXJlZCBwcmVjaXNpb24gb2YgdGhlIGNoYXJhY3RlcmlzdGljXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHNldENoYXJhY3RlcmlzdGljUHJlY2lzaW9uKG91dHB1dCwgdmFsdWUsIG9wdGlvbmFsQ2hhcmFjdGVyaXN0aWMsIHByZWNpc2lvbikge1xuICAgIGxldCByZXN1bHQgPSBvdXRwdXQ7XG4gICAgbGV0IFtjdXJyZW50Q2hhcmFjdGVyaXN0aWMsIGN1cnJlbnRNYW50aXNzYV0gPSByZXN1bHQudG9TdHJpbmcoKS5zcGxpdChcIi5cIik7XG5cbiAgICBpZiAoY3VycmVudENoYXJhY3RlcmlzdGljLm1hdGNoKC9eLT8wJC8pICYmIG9wdGlvbmFsQ2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgaWYgKCFjdXJyZW50TWFudGlzc2EpIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Q2hhcmFjdGVyaXN0aWMucmVwbGFjZShcIjBcIiwgXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYCR7Y3VycmVudENoYXJhY3RlcmlzdGljLnJlcGxhY2UoXCIwXCIsIFwiXCIpfS4ke2N1cnJlbnRNYW50aXNzYX1gO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50Q2hhcmFjdGVyaXN0aWMubGVuZ3RoIDwgcHJlY2lzaW9uKSB7XG4gICAgICAgIGxldCBtaXNzaW5nWmVyb3MgPSBwcmVjaXNpb24gLSBjdXJyZW50Q2hhcmFjdGVyaXN0aWMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pc3NpbmdaZXJvczsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBgMCR7cmVzdWx0fWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0LnRvU3RyaW5nKCk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBpbmRleGVzIHdoZXJlIGFyZSB0aGUgZ3JvdXAgc2VwYXJhdGlvbnMgYWZ0ZXIgc3BsaXR0aW5nXG4gKiBgdG90YWxMZW5ndGhgIGluIGdyb3VwIG9mIGBncm91cFNpemVgIHNpemUuXG4gKiBJbXBvcnRhbnQ6IHdlIHN0YXJ0IGdyb3VwaW5nIGZyb20gdGhlIHJpZ2h0IGhhbmQgc2lkZS5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxMZW5ndGggLSB0b3RhbCBsZW5ndGggb2YgdGhlIGNoYXJhY3RlcmlzdGljIHRvIHNwbGl0XG4gKiBAcGFyYW0ge251bWJlcn0gZ3JvdXBTaXplIC0gbGVuZ3RoIG9mIGVhY2ggZ3JvdXBcbiAqIEByZXR1cm4ge1tudW1iZXJdfVxuICovXG5mdW5jdGlvbiBpbmRleGVzT2ZHcm91cFNwYWNlcyh0b3RhbExlbmd0aCwgZ3JvdXBTaXplKSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBmb3IgKGxldCBpID0gdG90YWxMZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT09IGdyb3VwU2l6ZSkge1xuICAgICAgICAgICAgcmVzdWx0LnVuc2hpZnQoaSk7XG4gICAgICAgICAgICBjb3VudGVyID0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb3VudGVyKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBSZXBsYWNlIHRoZSBkZWNpbWFsIHNlcGFyYXRvciB3aXRoIERFQ0lNQUxTRVBBUkFUT1IgYW5kIGluc2VydCB0aG91c2FuZFxuICogc2VwYXJhdG9ycy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gb3V0cHV0IC0gb3V0cHV0IGJlaW5nIGJ1aWxkIGluIHRoZSBwcm9jZXNzIG9mIGZvcm1hdHRpbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIG51bWJlciBiZWluZyBjdXJyZW50bHkgZm9ybWF0dGVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHRob3VzYW5kU2VwYXJhdGVkIC0gYHRydWVgIGlmIHRoZSBjaGFyYWN0ZXJpc3RpYyBtdXN0IGJlIHNlcGFyYXRlZFxuICogQHBhcmFtIHtnbG9iYWxTdGF0ZX0gc3RhdGUgLSBzaGFyZWQgc3RhdGUgb2YgdGhlIGxpYnJhcnlcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZWNpbWFsU2VwYXJhdG9yIC0gc3RyaW5nIHRvIHVzZSBhcyBkZWNpbWFsIHNlcGFyYXRvclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiByZXBsYWNlRGVsaW1pdGVycyhvdXRwdXQsIHZhbHVlLCB0aG91c2FuZFNlcGFyYXRlZCwgc3RhdGUsIGRlY2ltYWxTZXBhcmF0b3IpIHtcbiAgICBsZXQgZGVsaW1pdGVycyA9IHN0YXRlLmN1cnJlbnREZWxpbWl0ZXJzKCk7XG4gICAgbGV0IHRob3VzYW5kU2VwYXJhdG9yID0gZGVsaW1pdGVycy50aG91c2FuZHM7XG4gICAgZGVjaW1hbFNlcGFyYXRvciA9IGRlY2ltYWxTZXBhcmF0b3IgfHwgZGVsaW1pdGVycy5kZWNpbWFsO1xuICAgIGxldCB0aG91c2FuZHNTaXplID0gZGVsaW1pdGVycy50aG91c2FuZHNTaXplIHx8IDM7XG5cbiAgICBsZXQgcmVzdWx0ID0gb3V0cHV0LnRvU3RyaW5nKCk7XG4gICAgbGV0IGNoYXJhY3RlcmlzdGljID0gcmVzdWx0LnNwbGl0KFwiLlwiKVswXTtcbiAgICBsZXQgbWFudGlzc2EgPSByZXN1bHQuc3BsaXQoXCIuXCIpWzFdO1xuXG4gICAgaWYgKHRob3VzYW5kU2VwYXJhdGVkKSB7XG4gICAgICAgIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbWludXMgc2lnblxuICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMgPSBjaGFyYWN0ZXJpc3RpYy5zbGljZSgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleGVzVG9JbnNlcnRUaG91c2FuZERlbGltaXRlcnMgPSBpbmRleGVzT2ZHcm91cFNwYWNlcyhjaGFyYWN0ZXJpc3RpYy5sZW5ndGgsIHRob3VzYW5kc1NpemUpO1xuICAgICAgICBpbmRleGVzVG9JbnNlcnRUaG91c2FuZERlbGltaXRlcnMuZm9yRWFjaCgocG9zaXRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYyA9IGNoYXJhY3RlcmlzdGljLnNsaWNlKDAsIHBvc2l0aW9uICsgaW5kZXgpICsgdGhvdXNhbmRTZXBhcmF0b3IgKyBjaGFyYWN0ZXJpc3RpYy5zbGljZShwb3NpdGlvbiArIGluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgLy8gQWRkIGJhY2sgdGhlIG1pbnVzIHNpZ25cbiAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljID0gYC0ke2NoYXJhY3RlcmlzdGljfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIW1hbnRpc3NhKSB7XG4gICAgICAgIHJlc3VsdCA9IGNoYXJhY3RlcmlzdGljO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGNoYXJhY3RlcmlzdGljICsgZGVjaW1hbFNlcGFyYXRvciArIG1hbnRpc3NhO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgcHJvdmlkZWQgQUJCUkVWSUFUSU9OIGF0IHRoZSBlbmQgb2YgT1VUUFVULlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvdXRwdXQgLSBvdXRwdXQgYmVpbmcgYnVpbGQgaW4gdGhlIHByb2Nlc3Mgb2YgZm9ybWF0dGluZ1xuICogQHBhcmFtIHtzdHJpbmd9IGFiYnJldmlhdGlvbiAtIGFiYnJldmlhdGlvbiB0byBhcHBlbmRcbiAqIEByZXR1cm4geyp9XG4gKi9cbmZ1bmN0aW9uIGluc2VydEFiYnJldmlhdGlvbihvdXRwdXQsIGFiYnJldmlhdGlvbikge1xuICAgIHJldHVybiBvdXRwdXQgKyBhYmJyZXZpYXRpb247XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBwb3NpdGl2ZS9uZWdhdGl2ZSBzaWduIGFjY29yZGluZyB0byB0aGUgTkVHQVRJVkUgZmxhZy5cbiAqIElmIHRoZSB2YWx1ZSBpcyBuZWdhdGl2ZSBidXQgc3RpbGwgb3V0cHV0IGFzIDAsIHRoZSBuZWdhdGl2ZSBzaWduIGlzIHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG91dHB1dCAtIG91dHB1dCBiZWluZyBidWlsZCBpbiB0aGUgcHJvY2VzcyBvZiBmb3JtYXR0aW5nXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBudW1iZXIgYmVpbmcgY3VycmVudGx5IGZvcm1hdHRlZFxuICogQHBhcmFtIHtzdHJpbmd9IG5lZ2F0aXZlIC0gZmxhZyBmb3IgdGhlIG5lZ2F0aXZlIGZvcm0gKFwic2lnblwiIG9yIFwicGFyZW50aGVzaXNcIilcbiAqIEByZXR1cm4geyp9XG4gKi9cbmZ1bmN0aW9uIGluc2VydFNpZ24ob3V0cHV0LCB2YWx1ZSwgbmVnYXRpdmUpIHtcbiAgICBpZiAodmFsdWUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBpZiAoK291dHB1dCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb3V0cHV0LnJlcGxhY2UoXCItXCIsIFwiXCIpO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA+IDApIHtcbiAgICAgICAgcmV0dXJuIGArJHtvdXRwdXR9YDtcbiAgICB9XG5cbiAgICBpZiAobmVnYXRpdmUgPT09IFwic2lnblwiKSB7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGAoJHtvdXRwdXQucmVwbGFjZShcIi1cIiwgXCJcIil9KWA7XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBwcm92aWRlZCBQUkVGSVggYXQgdGhlIHN0YXJ0IG9mIE9VVFBVVC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gb3V0cHV0IC0gb3V0cHV0IGJlaW5nIGJ1aWxkIGluIHRoZSBwcm9jZXNzIG9mIGZvcm1hdHRpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXggLSBhYmJyZXZpYXRpb24gdG8gcHJlcGVuZFxuICogQHJldHVybiB7Kn1cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0UHJlZml4KG91dHB1dCwgcHJlZml4KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIG91dHB1dDtcbn1cblxuLyoqXG4gKiBJbnNlcnQgdGhlIHByb3ZpZGVkIFBPU1RGSVggYXQgdGhlIGVuZCBvZiBPVVRQVVQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG91dHB1dCAtIG91dHB1dCBiZWluZyBidWlsZCBpbiB0aGUgcHJvY2VzcyBvZiBmb3JtYXR0aW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zdGZpeCAtIGFiYnJldmlhdGlvbiB0byBhcHBlbmRcbiAqIEByZXR1cm4geyp9XG4gKi9cbmZ1bmN0aW9uIGluc2VydFBvc3RmaXgob3V0cHV0LCBwb3N0Zml4KSB7XG4gICAgcmV0dXJuIG91dHB1dCArIHBvc3RmaXg7XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBwcm92aWRlZCBJTlNUQU5DRSBhcyBhIG51bWJlciB1c2luZyB0aGUgUFJPVklERURGT1JNQVQsXG4gKiBhbmQgdGhlIFNUQVRFLlxuICogVGhpcyBpcyB0aGUga2V5IG1ldGhvZCBvZiB0aGUgZnJhbWV3b3JrIVxuICpcbiAqIEBwYXJhbSB7TnVtYnJvfSBpbnN0YW5jZSAtIG51bWJybyBpbnN0YW5jZSB0byBmb3JtYXRcbiAqIEBwYXJhbSB7e319IFtwcm92aWRlZEZvcm1hdF0gLSBzcGVjaWZpY2F0aW9uIGZvciBmb3JtYXR0aW5nXG4gKiBAcGFyYW0ge2dsb2JhbFN0YXRlfSBzdGF0ZSAtIHNoYXJlZCBzdGF0ZSBvZiB0aGUgbGlicmFyeVxuICogQHBhcmFtIHtzdHJpbmd9IGRlY2ltYWxTZXBhcmF0b3IgLSBzdHJpbmcgdG8gdXNlIGFzIGRlY2ltYWwgc2VwYXJhdG9yXG4gKiBAcGFyYW0ge3t9fSBkZWZhdWx0cyAtIFNldCBvZiBkZWZhdWx0IHZhbHVlcyB1c2VkIGZvciBmb3JtYXR0aW5nXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGZvcm1hdE51bWJlcih7aW5zdGFuY2UsIHByb3ZpZGVkRm9ybWF0LCBzdGF0ZSA9IGdsb2JhbFN0YXRlLCBkZWNpbWFsU2VwYXJhdG9yLCBkZWZhdWx0cyA9IHN0YXRlLmN1cnJlbnREZWZhdWx0cygpfSkge1xuICAgIGxldCB2YWx1ZSA9IGluc3RhbmNlLl92YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gMCAmJiBzdGF0ZS5oYXNaZXJvRm9ybWF0KCkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmdldFplcm9Gb3JtYXQoKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBsZXQgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBkZWZhdWx0cywgcHJvdmlkZWRGb3JtYXQpO1xuXG4gICAgbGV0IHRvdGFsTGVuZ3RoID0gb3B0aW9ucy50b3RhbExlbmd0aDtcbiAgICBsZXQgY2hhcmFjdGVyaXN0aWNQcmVjaXNpb24gPSB0b3RhbExlbmd0aCA/IDAgOiBvcHRpb25zLmNoYXJhY3RlcmlzdGljO1xuICAgIGxldCBvcHRpb25hbENoYXJhY3RlcmlzdGljID0gb3B0aW9ucy5vcHRpb25hbENoYXJhY3RlcmlzdGljO1xuICAgIGxldCBmb3JjZUF2ZXJhZ2UgPSBvcHRpb25zLmZvcmNlQXZlcmFnZTtcbiAgICBsZXQgYXZlcmFnZSA9ICEhdG90YWxMZW5ndGggfHwgISFmb3JjZUF2ZXJhZ2UgfHwgb3B0aW9ucy5hdmVyYWdlO1xuXG4gICAgLy8gZGVmYXVsdCB3aGVuIGF2ZXJhZ2luZyBpcyB0byBjaG9wIG9mZiBkZWNpbWFsc1xuICAgIGxldCBtYW50aXNzYVByZWNpc2lvbiA9IHRvdGFsTGVuZ3RoID8gLTEgOiAoYXZlcmFnZSAmJiBwcm92aWRlZEZvcm1hdC5tYW50aXNzYSA9PT0gdW5kZWZpbmVkID8gMCA6IG9wdGlvbnMubWFudGlzc2EpO1xuICAgIGxldCBvcHRpb25hbE1hbnRpc3NhID0gdG90YWxMZW5ndGggPyBmYWxzZSA6IG9wdGlvbnMub3B0aW9uYWxNYW50aXNzYTtcbiAgICBsZXQgdGhvdXNhbmRTZXBhcmF0ZWQgPSBvcHRpb25zLnRob3VzYW5kU2VwYXJhdGVkO1xuICAgIGxldCBzcGFjZVNlcGFyYXRlZCA9IG9wdGlvbnMuc3BhY2VTZXBhcmF0ZWQ7XG4gICAgbGV0IG5lZ2F0aXZlID0gb3B0aW9ucy5uZWdhdGl2ZTtcbiAgICBsZXQgZm9yY2VTaWduID0gb3B0aW9ucy5mb3JjZVNpZ247XG5cbiAgICBsZXQgYWJicmV2aWF0aW9uID0gXCJcIjtcblxuICAgIGlmIChhdmVyYWdlKSB7XG4gICAgICAgIGxldCBkYXRhID0gY29tcHV0ZUF2ZXJhZ2Uoe1xuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBmb3JjZUF2ZXJhZ2UsXG4gICAgICAgICAgICBhYmJyZXZpYXRpb25zOiBzdGF0ZS5jdXJyZW50QWJicmV2aWF0aW9ucygpLFxuICAgICAgICAgICAgc3BhY2VTZXBhcmF0ZWQ6IHNwYWNlU2VwYXJhdGVkLFxuICAgICAgICAgICAgdG90YWxMZW5ndGhcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFsdWUgPSBkYXRhLnZhbHVlO1xuICAgICAgICBhYmJyZXZpYXRpb24gPSBkYXRhLmFiYnJldmlhdGlvbjtcblxuICAgICAgICBpZiAodG90YWxMZW5ndGgpIHtcbiAgICAgICAgICAgIG1hbnRpc3NhUHJlY2lzaW9uID0gZGF0YS5tYW50aXNzYVByZWNpc2lvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCBtYW50aXNzYSBwcmVjaXNpb25cbiAgICBsZXQgb3V0cHV0ID0gc2V0TWFudGlzc2FQcmVjaXNpb24odmFsdWUudG9TdHJpbmcoKSwgdmFsdWUsIG9wdGlvbmFsTWFudGlzc2EsIG1hbnRpc3NhUHJlY2lzaW9uKTtcbiAgICBvdXRwdXQgPSBzZXRDaGFyYWN0ZXJpc3RpY1ByZWNpc2lvbihvdXRwdXQsIHZhbHVlLCBvcHRpb25hbENoYXJhY3RlcmlzdGljLCBjaGFyYWN0ZXJpc3RpY1ByZWNpc2lvbik7XG4gICAgb3V0cHV0ID0gcmVwbGFjZURlbGltaXRlcnMob3V0cHV0LCB2YWx1ZSwgdGhvdXNhbmRTZXBhcmF0ZWQsIHN0YXRlLCBkZWNpbWFsU2VwYXJhdG9yKTtcblxuICAgIGlmIChhdmVyYWdlKSB7XG4gICAgICAgIG91dHB1dCA9IGluc2VydEFiYnJldmlhdGlvbihvdXRwdXQsIGFiYnJldmlhdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKGZvcmNlU2lnbiB8fCB2YWx1ZSA8IDApIHtcbiAgICAgICAgb3V0cHV0ID0gaW5zZXJ0U2lnbihvdXRwdXQsIHZhbHVlLCBuZWdhdGl2ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAobnVtYnJvKSA9PiAoe1xuICAgIGZvcm1hdDogKC4uLmFyZ3MpID0+IGZvcm1hdCguLi5hcmdzLCBudW1icm8pLFxuICAgIGdldEJ5dGVVbml0OiAoLi4uYXJncykgPT4gZ2V0Qnl0ZVVuaXQoLi4uYXJncywgbnVtYnJvKSxcbiAgICBnZXRCaW5hcnlCeXRlVW5pdDogKC4uLmFyZ3MpID0+IGdldEJpbmFyeUJ5dGVVbml0KC4uLmFyZ3MsIG51bWJybyksXG4gICAgZ2V0RGVjaW1hbEJ5dGVVbml0OiAoLi4uYXJncykgPT4gZ2V0RGVjaW1hbEJ5dGVVbml0KC4uLmFyZ3MsIG51bWJybylcbn0pO1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgQmVuamFtaW4gVmFuIFJ5c2VnaGVtPGJlbmphbWluQHZhbnJ5c2VnaGVtLmNvbT5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqIFNPRlRXQVJFLlxuICovXG5cbmNvbnN0IGVuVVMgPSByZXF1aXJlKFwiLi9lbi1VU1wiKTtcbmNvbnN0IHZhbGlkYXRpbmcgPSByZXF1aXJlKFwiLi92YWxpZGF0aW5nXCIpO1xuY29uc3QgcGFyc2luZyA9IHJlcXVpcmUoXCIuL3BhcnNpbmdcIik7XG5cbmxldCBzdGF0ZSA9IHt9O1xuXG5sZXQgY3VycmVudExhbmd1YWdlVGFnID0gdW5kZWZpbmVkO1xubGV0IGxhbmd1YWdlcyA9IHt9O1xuXG5sZXQgemVyb0Zvcm1hdCA9IG51bGw7XG5cbmxldCBnbG9iYWxEZWZhdWx0cyA9IHt9O1xuXG5mdW5jdGlvbiBjaG9vc2VMYW5ndWFnZSh0YWcpIHsgY3VycmVudExhbmd1YWdlVGFnID0gdGFnOyB9XG5cbmZ1bmN0aW9uIGN1cnJlbnRMYW5ndWFnZURhdGEoKSB7IHJldHVybiBsYW5ndWFnZXNbY3VycmVudExhbmd1YWdlVGFnXTsgfVxuXG4vKipcbiAqIFJldHVybiBhbGwgdGhlIHJlZ2lzdGVyIGxhbmd1YWdlc1xuICpcbiAqIEByZXR1cm4ge3t9fVxuICovXG5zdGF0ZS5sYW5ndWFnZXMgPSAoKSA9PiBPYmplY3QuYXNzaWduKHt9LCBsYW5ndWFnZXMpO1xuXG4vL1xuLy8gQ3VycmVudCBsYW5ndWFnZSBhY2Nlc3NvcnNcbi8vXG5cbi8qKlxuICogUmV0dXJuIHRoZSBjdXJyZW50IGxhbmd1YWdlIHRhZ1xuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuc3RhdGUuY3VycmVudExhbmd1YWdlID0gKCkgPT4gY3VycmVudExhbmd1YWdlVGFnO1xuXG4vKipcbiAqIFJldHVybiB0aGUgY3VycmVudCBsYW5ndWFnZSBjdXJyZW5jeSBkYXRhXG4gKlxuICogQHJldHVybiB7e319XG4gKi9cbnN0YXRlLmN1cnJlbnRDdXJyZW5jeSA9ICgpID0+IGN1cnJlbnRMYW5ndWFnZURhdGEoKS5jdXJyZW5jeTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgbGFuZ3VhZ2UgYWJicmV2aWF0aW9ucyBkYXRhXG4gKlxuICogQHJldHVybiB7e319XG4gKi9cbnN0YXRlLmN1cnJlbnRBYmJyZXZpYXRpb25zID0gKCkgPT4gY3VycmVudExhbmd1YWdlRGF0YSgpLmFiYnJldmlhdGlvbnM7XG5cbi8qKlxuICogUmV0dXJuIHRoZSBjdXJyZW50IGxhbmd1YWdlIGRlbGltaXRlcnMgZGF0YVxuICpcbiAqIEByZXR1cm4ge3t9fVxuICovXG5zdGF0ZS5jdXJyZW50RGVsaW1pdGVycyA9ICgpID0+IGN1cnJlbnRMYW5ndWFnZURhdGEoKS5kZWxpbWl0ZXJzO1xuXG4vKipcbiAqIFJldHVybiB0aGUgY3VycmVudCBsYW5ndWFnZSBvcmRpbmFsIGZ1bmN0aW9uXG4gKlxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbnN0YXRlLmN1cnJlbnRPcmRpbmFsID0gKCkgPT4gY3VycmVudExhbmd1YWdlRGF0YSgpLm9yZGluYWw7XG5cbi8vXG4vLyBEZWZhdWx0c1xuLy9cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgZm9ybWF0dGluZyBkZWZhdWx0cy5cbiAqIFVzZSBmaXJzdCB1c2VzIHRoZSBjdXJyZW50IGxhbmd1YWdlIGRlZmF1bHQsIHRoZW4gZmFsbGJhY2tzIHRvIHRoZSBnbG9iYWxseSBkZWZpbmVkIGRlZmF1bHRzLlxuICpcbiAqIEByZXR1cm4ge3t9fVxuICovXG5zdGF0ZS5jdXJyZW50RGVmYXVsdHMgPSAoKSA9PiBPYmplY3QuYXNzaWduKHt9LCBjdXJyZW50TGFuZ3VhZ2VEYXRhKCkuZGVmYXVsdHMsIGdsb2JhbERlZmF1bHRzKTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgb3JkaW5hbCBzcGVjaWZpYyBmb3JtYXR0aW5nIGRlZmF1bHRzLlxuICogVXNlIGZpcnN0IHVzZXMgdGhlIGN1cnJlbnQgbGFuZ3VhZ2Ugb3JkaW5hbCBkZWZhdWx0LCB0aGVuIGZhbGxiYWNrcyB0byB0aGUgcmVndWxhciBkZWZhdWx0cy5cbiAqXG4gKiBAcmV0dXJuIHt7fX1cbiAqL1xuc3RhdGUuY3VycmVudE9yZGluYWxEZWZhdWx0cyA9ICgpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmN1cnJlbnREZWZhdWx0cygpLCBjdXJyZW50TGFuZ3VhZ2VEYXRhKCkub3JkaW5hbERlZmF1bHRzKTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgYnl0ZSBzcGVjaWZpYyBmb3JtYXR0aW5nIGRlZmF1bHRzLlxuICogVXNlIGZpcnN0IHVzZXMgdGhlIGN1cnJlbnQgbGFuZ3VhZ2UgYnl0ZSBkZWZhdWx0LCB0aGVuIGZhbGxiYWNrcyB0byB0aGUgcmVndWxhciBkZWZhdWx0cy5cbiAqXG4gKiBAcmV0dXJuIHt7fX1cbiAqL1xuc3RhdGUuY3VycmVudEJ5dGVEZWZhdWx0cyA9ICgpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmN1cnJlbnREZWZhdWx0cygpLCBjdXJyZW50TGFuZ3VhZ2VEYXRhKCkuYnl0ZURlZmF1bHRzKTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgcGVyY2VudGFnZSBzcGVjaWZpYyBmb3JtYXR0aW5nIGRlZmF1bHRzLlxuICogVXNlIGZpcnN0IHVzZXMgdGhlIGN1cnJlbnQgbGFuZ3VhZ2UgcGVyY2VudGFnZSBkZWZhdWx0LCB0aGVuIGZhbGxiYWNrcyB0byB0aGUgcmVndWxhciBkZWZhdWx0cy5cbiAqXG4gKiBAcmV0dXJuIHt7fX1cbiAqL1xuc3RhdGUuY3VycmVudFBlcmNlbnRhZ2VEZWZhdWx0cyA9ICgpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmN1cnJlbnREZWZhdWx0cygpLCBjdXJyZW50TGFuZ3VhZ2VEYXRhKCkucGVyY2VudGFnZURlZmF1bHRzKTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgY3VycmVuY3kgc3BlY2lmaWMgZm9ybWF0dGluZyBkZWZhdWx0cy5cbiAqIFVzZSBmaXJzdCB1c2VzIHRoZSBjdXJyZW50IGxhbmd1YWdlIGN1cnJlbmN5IGRlZmF1bHQsIHRoZW4gZmFsbGJhY2tzIHRvIHRoZSByZWd1bGFyIGRlZmF1bHRzLlxuICpcbiAqIEByZXR1cm4ge3t9fVxuICovXG5zdGF0ZS5jdXJyZW50Q3VycmVuY3lEZWZhdWx0cyA9ICgpID0+IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmN1cnJlbnREZWZhdWx0cygpLCBjdXJyZW50TGFuZ3VhZ2VEYXRhKCkuY3VycmVuY3lEZWZhdWx0cyk7XG5cbi8qKlxuICogU2V0IHRoZSBnbG9iYWwgZm9ybWF0dGluZyBkZWZhdWx0cy5cbiAqXG4gKiBAcGFyYW0ge3t9fHN0cmluZ30gZm9ybWF0IC0gZm9ybWF0dGluZyBvcHRpb25zIHRvIHVzZSBhcyBkZWZhdWx0c1xuICovXG5zdGF0ZS5zZXREZWZhdWx0cyA9IChmb3JtYXQpID0+IHtcbiAgICBmb3JtYXQgPSBwYXJzaW5nLnBhcnNlRm9ybWF0KGZvcm1hdCk7XG4gICAgaWYgKHZhbGlkYXRpbmcudmFsaWRhdGVGb3JtYXQoZm9ybWF0KSkge1xuICAgICAgICBnbG9iYWxEZWZhdWx0cyA9IGZvcm1hdDtcbiAgICB9XG59O1xuXG4vL1xuLy8gWmVybyBmb3JtYXRcbi8vXG5cbi8qKlxuICogUmV0dXJuIHRoZSBmb3JtYXQgc3RyaW5nIGZvciAwLlxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuc3RhdGUuZ2V0WmVyb0Zvcm1hdCA9ICgpID0+IHplcm9Gb3JtYXQ7XG5cbi8qKlxuICogU2V0IGEgU1RSSU5HIHRvIG91dHB1dCB3aGVuIHRoZSB2YWx1ZSBpcyAwLlxuICpcbiAqIEBwYXJhbSB7e318c3RyaW5nfSBzdHJpbmcgLSBzdHJpbmcgdG8gc2V0XG4gKi9cbnN0YXRlLnNldFplcm9Gb3JtYXQgPSAoc3RyaW5nKSA9PiB6ZXJvRm9ybWF0ID0gdHlwZW9mKHN0cmluZykgPT09IFwic3RyaW5nXCIgPyBzdHJpbmcgOiBudWxsO1xuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIGEgZm9ybWF0IGZvciAwIGhhcyBiZWVuIHNldCBhbHJlYWR5LlxuICpcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbnN0YXRlLmhhc1plcm9Gb3JtYXQgPSAoKSA9PiB6ZXJvRm9ybWF0ICE9PSBudWxsO1xuXG4vL1xuLy8gR2V0dGVycy9TZXR0ZXJzXG4vL1xuXG4vKipcbiAqIFJldHVybiB0aGUgbGFuZ3VhZ2UgZGF0YSBmb3IgdGhlIHByb3ZpZGVkIFRBRy5cbiAqIFJldHVybiB0aGUgY3VycmVudCBsYW5ndWFnZSBkYXRhIGlmIG5vIHRhZyBpcyBwcm92aWRlZC5cbiAqXG4gKiBUaHJvdyBhbiBlcnJvciBpZiB0aGUgdGFnIGRvZXNuJ3QgbWF0Y2ggYW55IHJlZ2lzdGVyZWQgbGFuZ3VhZ2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFt0YWddIC0gbGFuZ3VhZ2UgdGFnIG9mIGEgcmVnaXN0ZXJlZCBsYW5ndWFnZVxuICogQHJldHVybiB7e319XG4gKi9cbnN0YXRlLmxhbmd1YWdlRGF0YSA9ICh0YWcpID0+IHtcbiAgICBpZiAodGFnKSB7XG4gICAgICAgIGlmIChsYW5ndWFnZXNbdGFnXSkge1xuICAgICAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1t0YWddO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB0YWcgXCIke3RhZ31cImApO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50TGFuZ3VhZ2VEYXRhKCk7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBwcm92aWRlZCBEQVRBIGFzIGEgbGFuZ3VhZ2UgaWYgYW5kIG9ubHkgaWYgdGhlIGRhdGEgaXMgdmFsaWQuXG4gKiBJZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQsIGFuIGVycm9yIGlzIHRocm93bi5cbiAqXG4gKiBXaGVuIFVTRUxBTkdVQUdFIGlzIHRydWUsIHRoZSByZWdpc3RlcmVkIGxhbmd1YWdlIGlzIHRoZW4gdXNlZC5cbiAqXG4gKiBAcGFyYW0ge3t9fSBkYXRhIC0gbGFuZ3VhZ2UgZGF0YSB0byByZWdpc3RlclxuICogQHBhcmFtIHtib29sZWFufSBbdXNlTGFuZ3VhZ2VdIC0gYHRydWVgIGlmIHRoZSBwcm92aWRlZCBkYXRhIHNob3VsZCBiZWNvbWUgdGhlIGN1cnJlbnQgbGFuZ3VhZ2VcbiAqL1xuc3RhdGUucmVnaXN0ZXJMYW5ndWFnZSA9IChkYXRhLCB1c2VMYW5ndWFnZSA9IGZhbHNlKSA9PiB7XG4gICAgaWYgKCF2YWxpZGF0aW5nLnZhbGlkYXRlTGFuZ3VhZ2UoZGF0YSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBsYW5ndWFnZSBkYXRhXCIpO1xuICAgIH1cblxuICAgIGxhbmd1YWdlc1tkYXRhLmxhbmd1YWdlVGFnXSA9IGRhdGE7XG5cbiAgICBpZiAodXNlTGFuZ3VhZ2UpIHtcbiAgICAgICAgY2hvb3NlTGFuZ3VhZ2UoZGF0YS5sYW5ndWFnZVRhZyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBTZXQgdGhlIGN1cnJlbnQgbGFuZ3VhZ2UgYWNjb3JkaW5nIHRvIFRBRy5cbiAqIElmIFRBRyBkb2Vzbid0IG1hdGNoIGEgcmVnaXN0ZXJlZCBsYW5ndWFnZSwgYW5vdGhlciBsYW5ndWFnZSBtYXRjaGluZ1xuICogdGhlIFwibGFuZ3VhZ2VcIiBwYXJ0IG9mIHRoZSB0YWcgKGFjY29yZGluZyB0byBCQ1A0NzogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9yZmMvYmNwL2JjcDQ3LnR4dCkuXG4gKiBJZiBub25lLCB0aGUgRkFMTEJBQ0tUQUcgaXMgdXNlZC4gSWYgdGhlIEZBTExCQUNLVEFHIGRvZXNuJ3QgbWF0Y2ggYSByZWdpc3RlciBsYW5ndWFnZSxcbiAqIGBlbi1VU2AgaXMgZmluYWxseSB1c2VkLlxuICpcbiAqIEBwYXJhbSB0YWdcbiAqIEBwYXJhbSBmYWxsYmFja1RhZ1xuICovXG5zdGF0ZS5zZXRMYW5ndWFnZSA9ICh0YWcsIGZhbGxiYWNrVGFnID0gZW5VUy5sYW5ndWFnZVRhZykgPT4ge1xuICAgIGlmICghbGFuZ3VhZ2VzW3RhZ10pIHtcbiAgICAgICAgbGV0IHN1ZmZpeCA9IHRhZy5zcGxpdChcIi1cIilbMF07XG5cbiAgICAgICAgbGV0IG1hdGNoaW5nTGFuZ3VhZ2VUYWcgPSBPYmplY3Qua2V5cyhsYW5ndWFnZXMpLmZpbmQoZWFjaCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWFjaC5zcGxpdChcIi1cIilbMF0gPT09IHN1ZmZpeDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFsYW5ndWFnZXNbbWF0Y2hpbmdMYW5ndWFnZVRhZ10pIHtcbiAgICAgICAgICAgIGNob29zZUxhbmd1YWdlKGZhbGxiYWNrVGFnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNob29zZUxhbmd1YWdlKG1hdGNoaW5nTGFuZ3VhZ2VUYWcpO1xuICAgIH1cblxuICAgIGNob29zZUxhbmd1YWdlKHRhZyk7XG59O1xuXG5zdGF0ZS5yZWdpc3Rlckxhbmd1YWdlKGVuVVMpO1xuY3VycmVudExhbmd1YWdlVGFnID0gZW5VUy5sYW5ndWFnZVRhZztcblxubW9kdWxlLmV4cG9ydHMgPSBzdGF0ZTtcbiIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE3IEJlbmphbWluIFZhbiBSeXNlZ2hlbTxiZW5qYW1pbkB2YW5yeXNlZ2hlbS5jb20+XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIExvYWQgbGFuZ3VhZ2VzIG1hdGNoaW5nIFRBR1MuIFNpbGVudGx5IHBhc3Mgb3ZlciB0aGUgZmFpbGluZyBsb2FkLlxuICpcbiAqIFdlIGFzc3VtZSBoZXJlIHRoYXQgd2UgYXJlIGluIGEgbm9kZSBlbnZpcm9ubWVudCwgc28gd2UgZG9uJ3QgY2hlY2sgZm9yIGl0LlxuICogQHBhcmFtIHtbU3RyaW5nXX0gdGFncyAtIGxpc3Qgb2YgdGFncyB0byBsb2FkXG4gKiBAcGFyYW0ge051bWJyb30gbnVtYnJvIC0gdGhlIG51bWJybyBzaW5nbGV0b25cbiAqL1xuZnVuY3Rpb24gbG9hZExhbmd1YWdlc0luTm9kZSh0YWdzLCBudW1icm8pIHtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBsZXQgZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGEgPSByZXF1aXJlKGAuLi9sYW5ndWFnZXMvJHt0YWd9YCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBsb2FkIFwiJHt0YWd9XCIuIE5vIG1hdGNoaW5nIGxhbmd1YWdlIGZpbGUgZm91bmQuYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIG51bWJyby5yZWdpc3Rlckxhbmd1YWdlKGRhdGEpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKG51bWJybykgPT4gKHtcbiAgICBsb2FkTGFuZ3VhZ2VzSW5Ob2RlOiAodGFncykgPT4gbG9hZExhbmd1YWdlc0luTm9kZSh0YWdzLCBudW1icm8pXG59KTtcbiIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE3IEJlbmphbWluIFZhbiBSeXNlZ2hlbTxiZW5qYW1pbkB2YW5yeXNlZ2hlbS5jb20+XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xuXG4vLyBUb2RvOiBhZGQgQmlnTnVtYmVyIHN1cHBvcnQgKGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2JpZ251bWJlci5qcy8pXG5cbmZ1bmN0aW9uIG11bHRpcGxpZXIoeCkge1xuICAgIGxldCBwYXJ0cyA9IHgudG9TdHJpbmcoKS5zcGxpdChcIi5cIik7XG4gICAgbGV0IG1hbnRpc3NhID0gcGFydHNbMV07XG5cbiAgICBpZiAoIW1hbnRpc3NhKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLnBvdygxMCwgbWFudGlzc2EubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gY29ycmVjdGlvbkZhY3RvciguLi5hcmdzKSB7XG4gICAgbGV0IHNtYWxsZXIgPSBhcmdzLnJlZHVjZSgocHJldiwgbmV4dCkgPT4ge1xuICAgICAgICBsZXQgbXAgPSBtdWx0aXBsaWVyKHByZXYpO1xuICAgICAgICBsZXQgbW4gPSBtdWx0aXBsaWVyKG5leHQpO1xuICAgICAgICByZXR1cm4gbXAgPiBtbiA/IHByZXYgOiBuZXh0O1xuICAgIH0sIC1JbmZpbml0eSk7XG5cbiAgICByZXR1cm4gbXVsdGlwbGllcihzbWFsbGVyKTtcbn1cblxuZnVuY3Rpb24gYWRkKG4sIG90aGVyLCBudW1icm8pIHtcbiAgICBsZXQgdmFsdWUgPSBvdGhlcjtcblxuICAgIGlmIChudW1icm8uaXNOdW1icm8ob3RoZXIpKSB7XG4gICAgICAgIHZhbHVlID0gb3RoZXIuX3ZhbHVlO1xuICAgIH1cblxuICAgIGxldCBmYWN0b3IgPSBjb3JyZWN0aW9uRmFjdG9yKG4uX3ZhbHVlLCB2YWx1ZSk7XG5cbiAgICBmdW5jdGlvbiBjYWxsYmFjayhhY2MsIG51bWJlcikge1xuICAgICAgICByZXR1cm4gYWNjICsgZmFjdG9yICogbnVtYmVyO1xuICAgIH1cblxuICAgIG4uX3ZhbHVlID0gW24uX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNhbGxiYWNrLCAwKSAvIGZhY3RvcjtcbiAgICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gc3VidHJhY3Qobiwgb3RoZXIsIG51bWJybykge1xuICAgIGxldCB2YWx1ZSA9IG90aGVyO1xuXG4gICAgaWYgKG51bWJyby5pc051bWJybyhvdGhlcikpIHtcbiAgICAgICAgdmFsdWUgPSBvdGhlci5fdmFsdWU7XG4gICAgfVxuXG4gICAgbGV0IGZhY3RvciA9IGNvcnJlY3Rpb25GYWN0b3Iobi5fdmFsdWUsIHZhbHVlKTtcblxuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKGFjYywgbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBhY2MgLSBmYWN0b3IgKiBudW1iZXI7XG4gICAgfVxuXG4gICAgbi5fdmFsdWUgPSBbdmFsdWVdLnJlZHVjZShjYWxsYmFjaywgbi5fdmFsdWUgKiBmYWN0b3IpIC8gZmFjdG9yO1xuICAgIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBseShuLCBvdGhlciwgbnVtYnJvKSB7XG4gICAgbGV0IHZhbHVlID0gb3RoZXI7XG5cbiAgICBpZiAobnVtYnJvLmlzTnVtYnJvKG90aGVyKSkge1xuICAgICAgICB2YWx1ZSA9IG90aGVyLl92YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxsYmFjayhhY2N1bSwgY3Vycikge1xuICAgICAgICBsZXQgZmFjdG9yID0gY29ycmVjdGlvbkZhY3RvcihhY2N1bSwgY3Vycik7XG4gICAgICAgIGxldCByZXN1bHQgPSBhY2N1bSAqIGZhY3RvcjtcbiAgICAgICAgcmVzdWx0ICo9IGN1cnIgKiBmYWN0b3I7XG4gICAgICAgIHJlc3VsdCAvPSBmYWN0b3IgKiBmYWN0b3I7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBuLl92YWx1ZSA9IFtuLl92YWx1ZSwgdmFsdWVdLnJlZHVjZShjYWxsYmFjaywgMSk7XG4gICAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGRpdmlkZShuLCBvdGhlciwgbnVtYnJvKSB7XG4gICAgbGV0IHZhbHVlID0gb3RoZXI7XG5cbiAgICBpZiAobnVtYnJvLmlzTnVtYnJvKG90aGVyKSkge1xuICAgICAgICB2YWx1ZSA9IG90aGVyLl92YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxsYmFjayhhY2N1bSwgY3Vycikge1xuICAgICAgICBsZXQgZmFjdG9yID0gY29ycmVjdGlvbkZhY3RvcihhY2N1bSwgY3Vycik7XG4gICAgICAgIHJldHVybiAoYWNjdW0gKiBmYWN0b3IpIC8gKGN1cnIgKiBmYWN0b3IpO1xuICAgIH1cblxuICAgIG4uX3ZhbHVlID0gW24uX3ZhbHVlLCB2YWx1ZV0ucmVkdWNlKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gc2V0IChuLCBvdGhlciwgbnVtYnJvKSB7XG4gICAgbGV0IHZhbHVlID0gb3RoZXI7XG5cbiAgICBpZiAobnVtYnJvLmlzTnVtYnJvKG90aGVyKSkge1xuICAgICAgICB2YWx1ZSA9IG90aGVyLl92YWx1ZTtcbiAgICB9XG5cbiAgICBuLl92YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBkaWZmZXJlbmNlKG4sIG90aGVyLCBudW1icm8pIHtcbiAgICBsZXQgY2xvbmUgPSBudW1icm8obi5fdmFsdWUpO1xuICAgIHN1YnRyYWN0KGNsb25lLCBvdGhlciwgbnVtYnJvKTtcblxuICAgIHJldHVybiBNYXRoLmFicyhjbG9uZS5fdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG51bWJybyA9PiAoe1xuICAgIGFkZDogKG4sIG90aGVyKSA9PiBhZGQobiwgb3RoZXIsIG51bWJybyksXG4gICAgc3VidHJhY3Q6IChuLCBvdGhlcikgPT4gc3VidHJhY3Qobiwgb3RoZXIsIG51bWJybyksXG4gICAgbXVsdGlwbHk6IChuLCBvdGhlcikgPT4gbXVsdGlwbHkobiwgb3RoZXIsIG51bWJybyksXG4gICAgZGl2aWRlOiAobiwgb3RoZXIpID0+IGRpdmlkZShuLCBvdGhlciwgbnVtYnJvKSxcbiAgICBzZXQ6IChuLCBvdGhlcikgPT4gc2V0KG4sIG90aGVyLCBudW1icm8pLFxuICAgIGRpZmZlcmVuY2U6IChuLCBvdGhlcikgPT4gZGlmZmVyZW5jZShuLCBvdGhlciwgbnVtYnJvKVxufSk7XG4iLCIvKiFcbiAqIENvcHlyaWdodCAoYykgMjAxNyBCZW5qYW1pbiBWYW4gUnlzZWdoZW08YmVuamFtaW5AdmFucnlzZWdoZW0uY29tPlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogU09GVFdBUkUuXG4gKi9cblxuY29uc3QgVkVSU0lPTiA9IFwiMi4wLjBcIjtcblxuLy9cbi8vIENvbnN0cnVjdG9yXG4vL1xuXG5mdW5jdGlvbiBOdW1icm8obnVtYmVyKSB7XG4gICAgdGhpcy5fdmFsdWUgPSBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUlucHV0KGlucHV0KSB7XG4gICAgbGV0IHJlc3VsdCA9IGlucHV0O1xuICAgIGlmIChudW1icm8uaXNOdW1icm8oaW5wdXQpKSB7XG4gICAgICAgIHJlc3VsdCA9IGlucHV0Ll92YWx1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXN1bHQgPSBudW1icm8udW5mb3JtYXQoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAoaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgIHJlc3VsdCA9IE5hTjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBudW1icm8oaW5wdXQpIHtcbiAgICByZXR1cm4gbmV3IE51bWJybyhub3JtYWxpemVJbnB1dChpbnB1dCkpO1xufVxuXG5udW1icm8udmVyc2lvbiA9IFZFUlNJT047XG5cbm51bWJyby5pc051bWJybyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBOdW1icm87XG59O1xuXG5jb25zdCBnbG9iYWxTdGF0ZSA9IHJlcXVpcmUoXCIuL2dsb2JhbFN0YXRlXCIpO1xuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZShcIi4vdmFsaWRhdGluZ1wiKTtcbmNvbnN0IGxvYWRlciA9IHJlcXVpcmUoXCIuL2xvYWRpbmdcIikobnVtYnJvKTtcbmNvbnN0IHVuZm9ybWF0dGVyID0gcmVxdWlyZShcIi4vdW5mb3JtYXR0aW5nXCIpO1xubGV0IGZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL2Zvcm1hdHRpbmdcIikobnVtYnJvKTtcbmxldCBtYW5pcHVsYXRlID0gcmVxdWlyZShcIi4vbWFuaXB1bGF0aW5nXCIpKG51bWJybyk7XG5cbk51bWJyby5wcm90b3R5cGUgPSB7XG4gICAgY2xvbmU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbnVtYnJvKHRoaXMuX3ZhbHVlKTsgfSxcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uKGZvcm1hdCA9IHt9KSB7IHJldHVybiBmb3JtYXR0ZXIuZm9ybWF0KHRoaXMsIGZvcm1hdCk7IH0sXG4gICAgZm9ybWF0Q3VycmVuY3k6IGZ1bmN0aW9uKGZvcm1hdCA9IHt9KSB7XG4gICAgICAgIGZvcm1hdC5vdXRwdXQgPSBcImN1cnJlbmN5XCI7XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZXIuZm9ybWF0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSxcbiAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbihmb3JtYXQgPSB7fSkge1xuICAgICAgICBmb3JtYXQub3V0cHV0ID0gXCJ0aW1lXCI7XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZXIuZm9ybWF0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSxcbiAgICBiaW5hcnlCeXRlVW5pdHM6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZm9ybWF0dGVyLmdldEJpbmFyeUJ5dGVVbml0KHRoaXMpO30sXG4gICAgZGVjaW1hbEJ5dGVVbml0czogZnVuY3Rpb24oKSB7IHJldHVybiBmb3JtYXR0ZXIuZ2V0RGVjaW1hbEJ5dGVVbml0KHRoaXMpO30sXG4gICAgYnl0ZVVuaXRzOiBmdW5jdGlvbigpIHsgcmV0dXJuIGZvcm1hdHRlci5nZXRCeXRlVW5pdCh0aGlzKTt9LFxuICAgIGRpZmZlcmVuY2U6IGZ1bmN0aW9uKG90aGVyKSB7IHJldHVybiBtYW5pcHVsYXRlLmRpZmZlcmVuY2UodGhpcywgb3RoZXIpOyB9LFxuICAgIGFkZDogZnVuY3Rpb24ob3RoZXIpIHsgcmV0dXJuIG1hbmlwdWxhdGUuYWRkKHRoaXMsIG90aGVyKTsgfSxcbiAgICBzdWJ0cmFjdDogZnVuY3Rpb24ob3RoZXIpIHsgcmV0dXJuIG1hbmlwdWxhdGUuc3VidHJhY3QodGhpcywgb3RoZXIpOyB9LFxuICAgIG11bHRpcGx5OiBmdW5jdGlvbihvdGhlcikgeyByZXR1cm4gbWFuaXB1bGF0ZS5tdWx0aXBseSh0aGlzLCBvdGhlcik7IH0sXG4gICAgZGl2aWRlOiBmdW5jdGlvbihvdGhlcikgeyByZXR1cm4gbWFuaXB1bGF0ZS5kaXZpZGUodGhpcywgb3RoZXIpOyB9LFxuICAgIHNldDogZnVuY3Rpb24oaW5wdXQpIHsgcmV0dXJuIG1hbmlwdWxhdGUuc2V0KHRoaXMsIG5vcm1hbGl6ZUlucHV0KGlucHV0KSk7IH0sXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH0sXG4gICAgdmFsdWVPZjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxufTtcblxuLy9cbi8vIGBudW1icm9gIHN0YXRpYyBtZXRob2RzXG4vL1xuXG5udW1icm8ubGFuZ3VhZ2UgPSBnbG9iYWxTdGF0ZS5jdXJyZW50TGFuZ3VhZ2U7XG5udW1icm8ucmVnaXN0ZXJMYW5ndWFnZSA9IGdsb2JhbFN0YXRlLnJlZ2lzdGVyTGFuZ3VhZ2U7XG5udW1icm8uc2V0TGFuZ3VhZ2UgPSBnbG9iYWxTdGF0ZS5zZXRMYW5ndWFnZTtcbm51bWJyby5sYW5ndWFnZXMgPSBnbG9iYWxTdGF0ZS5sYW5ndWFnZXM7XG5udW1icm8ubGFuZ3VhZ2VEYXRhID0gZ2xvYmFsU3RhdGUubGFuZ3VhZ2VEYXRhO1xubnVtYnJvLnplcm9Gb3JtYXQgPSBnbG9iYWxTdGF0ZS5zZXRaZXJvRm9ybWF0O1xubnVtYnJvLmRlZmF1bHRGb3JtYXQgPSBnbG9iYWxTdGF0ZS5jdXJyZW50RGVmYXVsdHM7XG5udW1icm8uc2V0RGVmYXVsdHMgPSBnbG9iYWxTdGF0ZS5zZXREZWZhdWx0cztcbm51bWJyby5kZWZhdWx0Q3VycmVuY3lGb3JtYXQgPSBnbG9iYWxTdGF0ZS5jdXJyZW50Q3VycmVuY3lEZWZhdWx0cztcbm51bWJyby52YWxpZGF0ZSA9IHZhbGlkYXRvci52YWxpZGF0ZTtcbm51bWJyby5sb2FkTGFuZ3VhZ2VzSW5Ob2RlID0gbG9hZGVyLmxvYWRMYW5ndWFnZXNJbk5vZGU7XG5udW1icm8udW5mb3JtYXQgPSB1bmZvcm1hdHRlci51bmZvcm1hdDtcblxubW9kdWxlLmV4cG9ydHMgPSBudW1icm87XG4iLCIvKiFcbiAqIENvcHlyaWdodCAoYykgMjAxNyBCZW5qYW1pbiBWYW4gUnlzZWdoZW08YmVuamFtaW5AdmFucnlzZWdoZW0uY29tPlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogU09GVFdBUkUuXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VQcmVmaXgoc3RyaW5nLCByZXN1bHQpIHtcbiAgICBsZXQgbWF0Y2ggPSBzdHJpbmcubWF0Y2goL157KFtefV0qKX0vKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0LnByZWZpeCA9IG1hdGNoWzFdO1xuICAgICAgICByZXR1cm4gc3RyaW5nLnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZztcbn1cblxuZnVuY3Rpb24gcGFyc2VQb3N0Zml4KHN0cmluZywgcmVzdWx0KSB7XG4gICAgbGV0IG1hdGNoID0gc3RyaW5nLm1hdGNoKC97KFtefV0qKX0kLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJlc3VsdC5wb3N0Zml4ID0gbWF0Y2hbMV07XG5cbiAgICAgICAgcmV0dXJuIHN0cmluZy5zbGljZSgwLCAtbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBwYXJzZU91dHB1dChzdHJpbmcsIHJlc3VsdCkge1xuICAgIGlmIChzdHJpbmcuaW5kZXhPZihcIiRcIikgIT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5vdXRwdXQgPSBcImN1cnJlbmN5XCI7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoc3RyaW5nLmluZGV4T2YoXCIlXCIpICE9PSAtMSkge1xuICAgICAgICByZXN1bHQub3V0cHV0ID0gXCJwZXJjZW50XCI7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoc3RyaW5nLmluZGV4T2YoXCJiZFwiKSAhPT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lm91dHB1dCA9IFwiYnl0ZVwiO1xuICAgICAgICByZXN1bHQuYmFzZSA9IFwiZ2VuZXJhbFwiO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHN0cmluZy5pbmRleE9mKFwiYlwiKSAhPT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lm91dHB1dCA9IFwiYnl0ZVwiO1xuICAgICAgICByZXN1bHQuYmFzZSA9IFwiYmluYXJ5XCI7XG4gICAgICAgIHJldHVybjtcblxuICAgIH1cblxuICAgIGlmIChzdHJpbmcuaW5kZXhPZihcImRcIikgIT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5vdXRwdXQgPSBcImJ5dGVcIjtcbiAgICAgICAgcmVzdWx0LmJhc2UgPSBcImRlY2ltYWxcIjtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgfVxuXG4gICAgaWYgKHN0cmluZy5pbmRleE9mKFwiOlwiKSAhPT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lm91dHB1dCA9IFwidGltZVwiO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHN0cmluZy5pbmRleE9mKFwib1wiKSAhPT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lm91dHB1dCA9IFwib3JkaW5hbFwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VUaG91c2FuZFNlcGFyYXRlZChzdHJpbmcsIHJlc3VsdCkge1xuICAgIGlmIChzdHJpbmcuaW5kZXhPZihcIixcIikgIT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC50aG91c2FuZFNlcGFyYXRlZCA9IHRydWU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVNwYWNlU2VwYXJhdGVkKHN0cmluZywgcmVzdWx0KSB7XG4gICAgaWYgKHN0cmluZy5pbmRleE9mKFwiIFwiKSAhPT0gLTEpIHtcbiAgICAgICAgcmVzdWx0LnNwYWNlU2VwYXJhdGVkID0gdHJ1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlVG90YWxMZW5ndGgoc3RyaW5nLCByZXN1bHQpIHtcbiAgICBsZXQgbWF0Y2ggPSBzdHJpbmcubWF0Y2goL1sxLTldK1swLTldKi8pO1xuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJlc3VsdC50b3RhbExlbmd0aCA9ICttYXRjaFswXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ2hhcmFjdGVyaXN0aWMoc3RyaW5nLCByZXN1bHQpIHtcbiAgICBsZXQgY2hhcmFjdGVyaXN0aWMgPSBzdHJpbmcuc3BsaXQoXCIuXCIpWzBdO1xuICAgIGxldCBtYXRjaCA9IGNoYXJhY3RlcmlzdGljLm1hdGNoKC8wKy8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXN1bHQuY2hhcmFjdGVyaXN0aWMgPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZU1hbnRpc3NhKHN0cmluZywgcmVzdWx0KSB7XG4gICAgbGV0IG1hbnRpc3NhID0gc3RyaW5nLnNwbGl0KFwiLlwiKVsxXTtcbiAgICBpZiAobWFudGlzc2EpIHtcbiAgICAgICAgbGV0IG1hdGNoID0gbWFudGlzc2EubWF0Y2goLzArLyk7XG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgcmVzdWx0Lm1hbnRpc3NhID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZUF2ZXJhZ2Uoc3RyaW5nLCByZXN1bHQpIHtcbiAgICBpZiAoc3RyaW5nLmluZGV4T2YoXCJhXCIpICE9PSAtMSkge1xuICAgICAgICByZXN1bHQuYXZlcmFnZSA9IHRydWU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZUZvcmNlQXZlcmFnZShzdHJpbmcsIHJlc3VsdCkge1xuICAgIGlmIChzdHJpbmcuaW5kZXhPZihcIktcIikgIT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5mb3JjZUF2ZXJhZ2UgPSBcInRob3VzYW5kXCI7XG4gICAgfSBlbHNlIGlmIChzdHJpbmcuaW5kZXhPZihcIk1cIikgIT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5mb3JjZUF2ZXJhZ2UgPSBcIm1pbGxpb25cIjtcbiAgICB9IGVsc2UgaWYgKHN0cmluZy5pbmRleE9mKFwiQlwiKSAhPT0gLTEpIHtcbiAgICAgICAgcmVzdWx0LmZvcmNlQXZlcmFnZSA9IFwiYmlsbGlvblwiO1xuICAgIH0gZWxzZSBpZiAoc3RyaW5nLmluZGV4T2YoXCJUXCIpICE9PSAtMSkge1xuICAgICAgICByZXN1bHQuZm9yY2VBdmVyYWdlID0gXCJ0cmlsbGlvblwiO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VPcHRpb25hbE1hbnRpc3NhKHN0cmluZywgcmVzdWx0KSB7XG4gICAgaWYgKHN0cmluZy5tYXRjaCgvXFxbXFwuXS8pKSB7XG4gICAgICAgIHJlc3VsdC5vcHRpb25hbE1hbnRpc3NhID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZy5tYXRjaCgvXFwuLykpIHtcbiAgICAgICAgcmVzdWx0Lm9wdGlvbmFsTWFudGlzc2EgPSBmYWxzZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlT3B0aW9uYWxDaGFyYWN0ZXJpc3RpYyhzdHJpbmcsIHJlc3VsdCkge1xuICAgIGlmIChzdHJpbmcuaW5kZXhPZihcIi5cIikgIT09IC0xKSB7XG4gICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpYyA9IHN0cmluZy5zcGxpdChcIi5cIilbMF07XG4gICAgICAgIHJlc3VsdC5vcHRpb25hbENoYXJhY3RlcmlzdGljID0gY2hhcmFjdGVyaXN0aWMuaW5kZXhPZihcIjBcIikgPT09IC0xO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VOZWdhdGl2ZShzdHJpbmcsIHJlc3VsdCkge1xuICAgIGlmIChzdHJpbmcubWF0Y2goL15cXCs/XFwoW14pXSpcXCkkLykpIHtcbiAgICAgICAgcmVzdWx0Lm5lZ2F0aXZlID0gXCJwYXJlbnRoZXNpc1wiO1xuICAgIH1cbiAgICBpZiAoc3RyaW5nLm1hdGNoKC9eXFwrPy0vKSkge1xuICAgICAgICByZXN1bHQubmVnYXRpdmUgPSBcInNpZ25cIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlRm9yY2VTaWduKHN0cmluZywgcmVzdWx0KSB7XG4gICAgaWYgKHN0cmluZy5tYXRjaCgvXlxcKy8pKSB7XG4gICAgICAgIHJlc3VsdC5mb3JjZVNpZ24gPSB0cnVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VGb3JtYXQoc3RyaW5nLCByZXN1bHQgPSB7fSkge1xuICAgIGlmICh0eXBlb2Ygc3RyaW5nICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgc3RyaW5nID0gcGFyc2VQcmVmaXgoc3RyaW5nLCByZXN1bHQpO1xuICAgIHN0cmluZyA9IHBhcnNlUG9zdGZpeChzdHJpbmcsIHJlc3VsdCk7XG4gICAgcGFyc2VPdXRwdXQoc3RyaW5nLCByZXN1bHQpO1xuICAgIHBhcnNlVG90YWxMZW5ndGgoc3RyaW5nLCByZXN1bHQpO1xuICAgIHBhcnNlQ2hhcmFjdGVyaXN0aWMoc3RyaW5nLCByZXN1bHQpO1xuICAgIHBhcnNlT3B0aW9uYWxDaGFyYWN0ZXJpc3RpYyhzdHJpbmcsIHJlc3VsdCk7XG4gICAgcGFyc2VBdmVyYWdlKHN0cmluZywgcmVzdWx0KTtcbiAgICBwYXJzZUZvcmNlQXZlcmFnZShzdHJpbmcsIHJlc3VsdCk7XG4gICAgcGFyc2VNYW50aXNzYShzdHJpbmcsIHJlc3VsdCk7XG4gICAgcGFyc2VPcHRpb25hbE1hbnRpc3NhKHN0cmluZywgcmVzdWx0KTtcbiAgICBwYXJzZVRob3VzYW5kU2VwYXJhdGVkKHN0cmluZywgcmVzdWx0KTtcbiAgICBwYXJzZVNwYWNlU2VwYXJhdGVkKHN0cmluZywgcmVzdWx0KTtcbiAgICBwYXJzZU5lZ2F0aXZlKHN0cmluZywgcmVzdWx0KTtcbiAgICBwYXJzZUZvcmNlU2lnbihzdHJpbmcsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwYXJzZUZvcm1hdFxufTtcbiIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE3IEJlbmphbWluIFZhbiBSeXNlZ2hlbTxiZW5qYW1pbkB2YW5yeXNlZ2hlbS5jb20+XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xuXG5jb25zdCBhbGxTdWZmaXhlcyA9IFtcbiAgICB7a2V5OiBcIlppQlwiLCBmYWN0b3I6IE1hdGgucG93KDEwMjQsIDcpfSxcbiAgICB7a2V5OiBcIlpCXCIsIGZhY3RvcjogTWF0aC5wb3coMTAwMCwgNyl9LFxuICAgIHtrZXk6IFwiWWlCXCIsIGZhY3RvcjogTWF0aC5wb3coMTAyNCwgOCl9LFxuICAgIHtrZXk6IFwiWUJcIiwgZmFjdG9yOiBNYXRoLnBvdygxMDAwLCA4KX0sXG4gICAge2tleTogXCJUaUJcIiwgZmFjdG9yOiBNYXRoLnBvdygxMDI0LCA0KX0sXG4gICAge2tleTogXCJUQlwiLCBmYWN0b3I6IE1hdGgucG93KDEwMDAsIDQpfSxcbiAgICB7a2V5OiBcIlBpQlwiLCBmYWN0b3I6IE1hdGgucG93KDEwMjQsIDUpfSxcbiAgICB7a2V5OiBcIlBCXCIsIGZhY3RvcjogTWF0aC5wb3coMTAwMCwgNSl9LFxuICAgIHtrZXk6IFwiTWlCXCIsIGZhY3RvcjogTWF0aC5wb3coMTAyNCwgMil9LFxuICAgIHtrZXk6IFwiTUJcIiwgZmFjdG9yOiBNYXRoLnBvdygxMDAwLCAyKX0sXG4gICAge2tleTogXCJLaUJcIiwgZmFjdG9yOiBNYXRoLnBvdygxMDI0LCAxKX0sXG4gICAge2tleTogXCJLQlwiLCBmYWN0b3I6IE1hdGgucG93KDEwMDAsIDEpfSxcbiAgICB7a2V5OiBcIkdpQlwiLCBmYWN0b3I6IE1hdGgucG93KDEwMjQsIDMpfSxcbiAgICB7a2V5OiBcIkdCXCIsIGZhY3RvcjogTWF0aC5wb3coMTAwMCwgMyl9LFxuICAgIHtrZXk6IFwiRWlCXCIsIGZhY3RvcjogTWF0aC5wb3coMTAyNCwgNil9LFxuICAgIHtrZXk6IFwiRUJcIiwgZmFjdG9yOiBNYXRoLnBvdygxMDAwLCA2KX0sXG4gICAge2tleTogXCJCXCIsIGZhY3RvcjogMX1cbl07XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZSgvWy0vXFxcXF4kKis/LigpfFtcXF17fV0vZywgXCJcXFxcJCZcIik7XG59XG5cbmZ1bmN0aW9uIHVuZm9ybWF0VmFsdWUoaW5wdXRTdHJpbmcsIGRlbGltaXRlcnMsIGN1cnJlbmN5U3ltYm9sID0gXCJcIiwgb3JkaW5hbCwgemVyb0Zvcm1hdCwgYWJicmV2aWF0aW9ucywgZm9ybWF0KSB7XG4gICAgaWYgKGlucHV0U3RyaW5nID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCFpc05hTigraW5wdXRTdHJpbmcpKSB7XG4gICAgICAgIHJldHVybiAraW5wdXRTdHJpbmc7XG4gICAgfVxuXG4gICAgLy8gWmVybyBGb3JtYXRcblxuICAgIGlmIChpbnB1dFN0cmluZyA9PT0gemVyb0Zvcm1hdCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvLyBOZWdhdGl2ZVxuXG4gICAgbGV0IG1hdGNoID0gaW5wdXRTdHJpbmcubWF0Y2goL1xcKChbXildKilcXCkvKTtcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4gLTEgKiB1bmZvcm1hdFZhbHVlKG1hdGNoWzFdLCBkZWxpbWl0ZXJzLCBjdXJyZW5jeVN5bWJvbCwgb3JkaW5hbCwgemVyb0Zvcm1hdCwgYWJicmV2aWF0aW9ucywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICAvLyBDdXJyZW5jeVxuXG4gICAgbGV0IHN0cmlwcGVkID0gaW5wdXRTdHJpbmcucmVwbGFjZShjdXJyZW5jeVN5bWJvbCwgXCJcIik7XG5cbiAgICBpZiAoc3RyaXBwZWQgIT09IGlucHV0U3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB1bmZvcm1hdFZhbHVlKHN0cmlwcGVkLCBkZWxpbWl0ZXJzLCBjdXJyZW5jeVN5bWJvbCwgb3JkaW5hbCwgemVyb0Zvcm1hdCwgYWJicmV2aWF0aW9ucywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICAvLyBUaG91c2FuZCBzZXBhcmF0b3JzXG5cbiAgICBzdHJpcHBlZCA9IGlucHV0U3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoZGVsaW1pdGVycy50aG91c2FuZHMpLCBcImdcIiksIFwiXCIpO1xuXG4gICAgaWYgKHN0cmlwcGVkICE9PSBpbnB1dFN0cmluZykge1xuICAgICAgICByZXR1cm4gdW5mb3JtYXRWYWx1ZShzdHJpcHBlZCwgZGVsaW1pdGVycywgY3VycmVuY3lTeW1ib2wsIG9yZGluYWwsIHplcm9Gb3JtYXQsIGFiYnJldmlhdGlvbnMsIGZvcm1hdCk7XG4gICAgfVxuXG4gICAgLy8gRGVjaW1hbFxuXG4gICAgc3RyaXBwZWQgPSBpbnB1dFN0cmluZy5yZXBsYWNlKGRlbGltaXRlcnMuZGVjaW1hbCwgXCIuXCIpO1xuXG4gICAgaWYgKHN0cmlwcGVkICE9PSBpbnB1dFN0cmluZykge1xuICAgICAgICByZXR1cm4gdW5mb3JtYXRWYWx1ZShzdHJpcHBlZCwgZGVsaW1pdGVycywgY3VycmVuY3lTeW1ib2wsIG9yZGluYWwsIHplcm9Gb3JtYXQsIGFiYnJldmlhdGlvbnMsIGZvcm1hdCk7XG4gICAgfVxuXG4gICAgLy8gQnl0ZVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxTdWZmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc3VmZml4ID0gYWxsU3VmZml4ZXNbaV07XG4gICAgICAgIHN0cmlwcGVkID0gaW5wdXRTdHJpbmcucmVwbGFjZShzdWZmaXgua2V5LCBcIlwiKTtcblxuICAgICAgICBpZiAoc3RyaXBwZWQgIT09IGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5mb3JtYXRWYWx1ZShzdHJpcHBlZCwgZGVsaW1pdGVycywgY3VycmVuY3lTeW1ib2wsIG9yZGluYWwsIHplcm9Gb3JtYXQsIGFiYnJldmlhdGlvbnMsIGZvcm1hdCkgKiBzdWZmaXguZmFjdG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUGVyY2VudFxuXG4gICAgc3RyaXBwZWQgPSBpbnB1dFN0cmluZy5yZXBsYWNlKFwiJVwiLCBcIlwiKTtcblxuICAgIGlmIChzdHJpcHBlZCAhPT0gaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHVuZm9ybWF0VmFsdWUoc3RyaXBwZWQsIGRlbGltaXRlcnMsIGN1cnJlbmN5U3ltYm9sLCBvcmRpbmFsLCB6ZXJvRm9ybWF0LCBhYmJyZXZpYXRpb25zLCBmb3JtYXQpIC8gMTAwO1xuICAgIH1cblxuICAgIC8vIE9yZGluYWxcblxuICAgIGxldCBwb3NzaWJsZU9yZGluYWxWYWx1ZSA9IHBhcnNlSW50KGlucHV0U3RyaW5nLCAxMCk7XG5cbiAgICBpZiAoaXNOYU4ocG9zc2libGVPcmRpbmFsVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbGV0IG9yZGluYWxTdHJpbmcgPSBvcmRpbmFsKHBvc3NpYmxlT3JkaW5hbFZhbHVlKTtcbiAgICBzdHJpcHBlZCA9IGlucHV0U3RyaW5nLnJlcGxhY2Uob3JkaW5hbFN0cmluZywgXCJcIik7XG5cbiAgICBpZiAoc3RyaXBwZWQgIT09IGlucHV0U3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB1bmZvcm1hdFZhbHVlKHN0cmlwcGVkLCBkZWxpbWl0ZXJzLCBjdXJyZW5jeVN5bWJvbCwgZm9ybWF0KTtcbiAgICB9XG5cbiAgICAvLyBBdmVyYWdlXG4gICAgbGV0IGFiYnJldmlhdGlvbktleXMgPSBPYmplY3Qua2V5cyhhYmJyZXZpYXRpb25zKTtcbiAgICBsZXQgbnVtYmVyT2ZBYmJyZXZpYXRpb25zID0gYWJicmV2aWF0aW9uS2V5cy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mQWJicmV2aWF0aW9uczsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgPSBhYmJyZXZpYXRpb25LZXlzW2ldO1xuXG4gICAgICAgIHN0cmlwcGVkID0gaW5wdXRTdHJpbmcucmVwbGFjZShhYmJyZXZpYXRpb25zW2tleV0sIFwiXCIpO1xuXG4gICAgICAgIGlmIChzdHJpcHBlZCAhPT0gaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIGxldCBmYWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRlZmF1bHQtY2FzZVxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0aG91c2FuZFwiOlxuICAgICAgICAgICAgICAgICAgICBmYWN0b3IgPSBNYXRoLnBvdygxMDAwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pbGxpb25cIjpcbiAgICAgICAgICAgICAgICAgICAgZmFjdG9yID0gTWF0aC5wb3coMTAwMCwgMik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJiaWxsaW9uXCI6XG4gICAgICAgICAgICAgICAgICAgIGZhY3RvciA9IE1hdGgucG93KDEwMDAsIDMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwidHJpbGxpb25cIjpcbiAgICAgICAgICAgICAgICAgICAgZmFjdG9yID0gTWF0aC5wb3coMTAwMCwgNCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZm9ybWF0VmFsdWUoc3RyaXBwZWQsIGRlbGltaXRlcnMsIGN1cnJlbmN5U3ltYm9sLCBvcmRpbmFsLCB6ZXJvRm9ybWF0LCBhYmJyZXZpYXRpb25zLCBmb3JtYXQpICogZmFjdG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1RpbWUoaW5wdXRTdHJpbmcsIGRlbGltaXRlcnMpIHtcbiAgICBsZXQgc2VwYXJhdG9ycyA9IGlucHV0U3RyaW5nLmluZGV4T2YoXCI6XCIpICYmIGRlbGltaXRlcnMudGhvdXNhbmRzICE9PSBcIjpcIjtcblxuICAgIGlmICghc2VwYXJhdG9ycykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHNlZ21lbnRzID0gaW5wdXRTdHJpbmcuc3BsaXQoXCI6XCIpO1xuICAgIGlmIChzZWdtZW50cy5sZW5ndGggIT09IDMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBob3VycyA9ICtzZWdtZW50c1swXTtcbiAgICBsZXQgbWludXRlcyA9ICtzZWdtZW50c1sxXTtcbiAgICBsZXQgc2Vjb25kcyA9ICtzZWdtZW50c1syXTtcblxuICAgIHJldHVybiAhaXNOYU4oaG91cnMpICYmICFpc05hTihtaW51dGVzKSAmJiAhaXNOYU4oc2Vjb25kcyk7XG59XG5cbmZ1bmN0aW9uIHVuZm9ybWF0VGltZShpbnB1dFN0cmluZykge1xuICAgIGxldCBzZWdtZW50cyA9IGlucHV0U3RyaW5nLnNwbGl0KFwiOlwiKTtcblxuICAgIGxldCBob3VycyA9ICtzZWdtZW50c1swXTtcbiAgICBsZXQgbWludXRlcyA9ICtzZWdtZW50c1sxXTtcbiAgICBsZXQgc2Vjb25kcyA9ICtzZWdtZW50c1syXTtcblxuICAgIHJldHVybiBzZWNvbmRzICsgNjAgKiBtaW51dGVzICsgMzYwMCAqIGhvdXJzO1xufVxuXG5mdW5jdGlvbiB1bmZvcm1hdChpbnB1dFN0cmluZywgZm9ybWF0KSB7XG4gICAgLy8gQXZvaWQgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICAgIGNvbnN0IGdsb2JhbFN0YXRlID0gcmVxdWlyZShcIi4vZ2xvYmFsU3RhdGVcIik7XG5cbiAgICBsZXQgZGVsaW1pdGVycyA9IGdsb2JhbFN0YXRlLmN1cnJlbnREZWxpbWl0ZXJzKCk7XG4gICAgbGV0IGN1cnJlbmN5U3ltYm9sID0gZ2xvYmFsU3RhdGUuY3VycmVudEN1cnJlbmN5KCkuc3ltYm9sO1xuICAgIGxldCBvcmRpbmFsID0gZ2xvYmFsU3RhdGUuY3VycmVudE9yZGluYWwoKTtcbiAgICBsZXQgemVyb0Zvcm1hdCA9IGdsb2JhbFN0YXRlLmdldFplcm9Gb3JtYXQoKTtcbiAgICBsZXQgYWJicmV2aWF0aW9ucyA9IGdsb2JhbFN0YXRlLmN1cnJlbnRBYmJyZXZpYXRpb25zKCk7XG5cbiAgICBsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGlucHV0U3RyaW5nID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGlmIChtYXRjaGVzVGltZShpbnB1dFN0cmluZywgZGVsaW1pdGVycykpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdW5mb3JtYXRUaW1lKGlucHV0U3RyaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gdW5mb3JtYXRWYWx1ZShpbnB1dFN0cmluZywgZGVsaW1pdGVycywgY3VycmVuY3lTeW1ib2wsIG9yZGluYWwsIHplcm9Gb3JtYXQsIGFiYnJldmlhdGlvbnMsIGZvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dFN0cmluZyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICB2YWx1ZSA9IGlucHV0U3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHVuZm9ybWF0XG59O1xuIiwiLyohXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgQmVuamFtaW4gVmFuIFJ5c2VnaGVtPGJlbmphbWluQHZhbnJ5c2VnaGVtLmNvbT5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqIFNPRlRXQVJFLlxuICovXG5cbmxldCB1bmZvcm1hdHRlciA9IHJlcXVpcmUoXCIuL3VuZm9ybWF0dGluZ1wiKTtcblxuY29uc3QgdmFsaWRPdXRwdXRWYWx1ZXMgPSBbXG4gICAgXCJjdXJyZW5jeVwiLFxuICAgIFwicGVyY2VudFwiLFxuICAgIFwiYnl0ZVwiLFxuICAgIFwidGltZVwiLFxuICAgIFwib3JkaW5hbFwiLFxuICAgIFwibnVtYmVyXCJcbl07XG5cbmNvbnN0IHZhbGlkRm9yY2VBdmVyYWdlVmFsdWVzID0gW1xuICAgIFwidHJpbGxpb25cIixcbiAgICBcImJpbGxpb25cIixcbiAgICBcIm1pbGxpb25cIixcbiAgICBcInRob3VzYW5kXCJcbl07XG5cbmNvbnN0IHZhbGlkTmVnYXRpdmVWYWx1ZXMgPSBbXG4gICAgXCJzaWduXCIsXG4gICAgXCJwYXJlbnRoZXNpc1wiXG5dO1xuXG5jb25zdCB2YWxpZEFiYnJldmlhdGlvbnMgPSB7XG4gICAgdHlwZTogXCJvYmplY3RcIixcbiAgICBjaGlsZHJlbjoge1xuICAgICAgICB0aG91c2FuZDogXCJzdHJpbmdcIixcbiAgICAgICAgbWlsbGlvbjogXCJzdHJpbmdcIixcbiAgICAgICAgYmlsbGlvbjogXCJzdHJpbmdcIixcbiAgICAgICAgdHJpbGxpb246IFwic3RyaW5nXCJcbiAgICB9XG59O1xuXG5jb25zdCB2YWxpZEJhc2VWYWx1ZXMgPSBbXG4gICAgXCJkZWNpbWFsXCIsXG4gICAgXCJiaW5hcnlcIixcbiAgICBcImdlbmVyYWxcIlxuXTtcblxuY29uc3QgdmFsaWRGb3JtYXQgPSB7XG4gICAgb3V0cHV0OiB7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIHZhbGlkVmFsdWVzOiB2YWxpZE91dHB1dFZhbHVlc1xuICAgIH0sXG4gICAgYmFzZToge1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICB2YWxpZFZhbHVlczogdmFsaWRCYXNlVmFsdWVzXG4gICAgfSxcbiAgICBjaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICByZXN0cmljdGlvbjogKG51bWJlcikgPT4gbnVtYmVyID49IDAsXG4gICAgICAgIG1lc3NhZ2U6IFwidmFsdWUgbXVzdCBiZSBwb3NpdGl2ZVwiXG4gICAgfSxcbiAgICBwcmVmaXg6IFwic3RyaW5nXCIsXG4gICAgcG9zdGZpeDogXCJzdHJpbmdcIixcbiAgICBmb3JjZUF2ZXJhZ2U6IHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgdmFsaWRWYWx1ZXM6IHZhbGlkRm9yY2VBdmVyYWdlVmFsdWVzXG4gICAgfSxcbiAgICBhdmVyYWdlOiBcImJvb2xlYW5cIixcbiAgICB0b3RhbExlbmd0aDoge1xuICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICByZXN0cmljdGlvbjogKG51bWJlcikgPT4gbnVtYmVyID49IDAsXG4gICAgICAgIG1lc3NhZ2U6IFwidmFsdWUgbXVzdCBiZSBwb3NpdGl2ZVwiXG4gICAgfSxcbiAgICBtYW50aXNzYToge1xuICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICByZXN0cmljdGlvbjogKG51bWJlcikgPT4gbnVtYmVyID49IDAsXG4gICAgICAgIG1lc3NhZ2U6IFwidmFsdWUgbXVzdCBiZSBwb3NpdGl2ZVwiXG4gICAgfSxcbiAgICBvcHRpb25hbE1hbnRpc3NhOiBcImJvb2xlYW5cIixcbiAgICBvcHRpb25hbENoYXJhY3RlcmlzdGljOiBcImJvb2xlYW5cIixcbiAgICB0aG91c2FuZFNlcGFyYXRlZDogXCJib29sZWFuXCIsXG4gICAgc3BhY2VTZXBhcmF0ZWQ6IFwiYm9vbGVhblwiLFxuICAgIGFiYnJldmlhdGlvbnM6IHZhbGlkQWJicmV2aWF0aW9ucyxcbiAgICBuZWdhdGl2ZToge1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICB2YWxpZFZhbHVlczogdmFsaWROZWdhdGl2ZVZhbHVlc1xuICAgIH0sXG4gICAgZm9yY2VTaWduOiBcImJvb2xlYW5cIlxufTtcblxuY29uc3QgdmFsaWRMYW5ndWFnZSA9IHtcbiAgICBsYW5ndWFnZVRhZzogXCJzdHJpbmdcIixcbiAgICBkZWxpbWl0ZXJzOiB7XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgICB0aG91c2FuZHM6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBkZWNpbWFsOiBcInN0cmluZ1wiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFiYnJldmlhdGlvbnM6IHZhbGlkQWJicmV2aWF0aW9ucyxcbiAgICBzcGFjZVNlcGFyYXRlZDogXCJib29sZWFuXCIsXG4gICAgb3JkaW5hbDogXCJmdW5jdGlvblwiLFxuICAgIGN1cnJlbmN5OiB7XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgICBzeW1ib2w6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBwb3NpdGlvbjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIGNvZGU6IFwic3RyaW5nXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGVmYXVsdHM6IFwiZm9ybWF0XCIsXG4gICAgb3JkaW5hbERlZmF1bHRzOiBcImZvcm1hdFwiLFxuICAgIGJ5dGVEZWZhdWx0czogXCJmb3JtYXRcIixcbiAgICBwZXJjZW50YWdlRGVmYXVsdHM6IFwiZm9ybWF0XCIsXG4gICAgY3VycmVuY3lEZWZhdWx0czogXCJmb3JtYXRcIixcbiAgICBmb3JtYXRzOiB7XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgICBmb3VyRGlnaXRzOiBcImZvcm1hdFwiLFxuICAgICAgICAgICAgZnVsbFdpdGhUd29EZWNpbWFsczogXCJmb3JtYXRcIixcbiAgICAgICAgICAgIGZ1bGxXaXRoVHdvRGVjaW1hbHNOb0N1cnJlbmN5OiBcImZvcm1hdFwiLFxuICAgICAgICAgICAgZnVsbFdpdGhOb0RlY2ltYWxzOiBcImZvcm1hdFwiXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIENoZWNrIHRoZSB2YWxpZGl0eSBvZiB0aGUgcHJvdmlkZWQgaW5wdXQgYW5kIGZvcm1hdC5cbiAqIFRoZSBjaGVjayBpcyBOT1QgbGF6eS5cbiAqXG4gKiBAcGFyYW0gaW5wdXRcbiAqIEBwYXJhbSBmb3JtYXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgd2hlbiBldmVyeXRoaW5nIGlzIGNvcnJlY3RcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGUoaW5wdXQsIGZvcm1hdCkge1xuICAgIGxldCB2YWxpZElucHV0ID0gdmFsaWRhdGVJbnB1dChpbnB1dCk7XG4gICAgbGV0IGlzRm9ybWF0VmFsaWQgPSB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gICAgcmV0dXJuIHZhbGlkSW5wdXQgJiYgaXNGb3JtYXRWYWxpZDtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVJbnB1dChpbnB1dCkge1xuICAgIGxldCB2YWx1ZSA9IHVuZm9ybWF0dGVyLnVuZm9ybWF0KGlucHV0KTtcblxuICAgIHJldHVybiAhIXZhbHVlO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVNwZWModG9WYWxpZGF0ZSwgc3BlYywgcHJlZml4KSB7XG4gICAgbGV0IHJlc3VsdHMgPSBPYmplY3Qua2V5cyh0b1ZhbGlkYXRlKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICBpZiAoIXNwZWNba2V5XSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHtwcmVmaXh9IEludmFsaWQga2V5OiAke2tleX1gKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSB0b1ZhbGlkYXRlW2tleV07XG4gICAgICAgIGxldCBkYXRhID0gc3BlY1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZGF0YSA9IHt0eXBlOiBkYXRhfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFwiZm9ybWF0XCIpIHtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IHZhbGlkYXRlU3BlYyh2YWx1ZSwgdmFsaWRGb3JtYXQsIGBbVmFsaWRhdGUgJHtrZXl9XWApO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gZGF0YS50eXBlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGAke3ByZWZpeH0gJHtrZXl9IHR5cGUgbWlzbWF0Y2hlZDogXCIke2RhdGEudHlwZX1cIiBleHBlY3RlZCwgXCIke3R5cGVvZiB2YWx1ZX1cIiBwcm92aWRlZGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLnJlc3RyaWN0aW9uICYmICFkYXRhLnJlc3RyaWN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHtwcmVmaXh9ICR7a2V5fSBpbnZhbGlkIHZhbHVlOiAke2RhdGEubWVzc2FnZX1gKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS52YWxpZFZhbHVlcyAmJiBkYXRhLnZhbGlkVmFsdWVzLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgJHtwcmVmaXh9ICR7a2V5fSBpbnZhbGlkIHZhbHVlOiBtdXN0IGJlIGFtb25nICR7SlNPTi5zdHJpbmdpZnkoZGF0YS52YWxpZFZhbHVlcyl9LCBcIiR7dmFsdWV9XCIgcHJvdmlkZWRgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgICAgICAgbGV0IHZhbGlkID0gdmFsaWRhdGVTcGVjKHZhbHVlLCBkYXRhLmNoaWxkcmVuLCBgW1ZhbGlkYXRlICR7a2V5fV1gKTtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKChhY2MsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyAmJiBjdXJyZW50O1xuICAgIH0sIHRydWUpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICByZXR1cm4gdmFsaWRhdGVTcGVjKGZvcm1hdCwgdmFsaWRGb3JtYXQsIFwiW1ZhbGlkYXRlIGZvcm1hdF1cIik7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGFuZ3VhZ2UoZGF0YSkge1xuICAgIHJldHVybiB2YWxpZGF0ZVNwZWMoZGF0YSwgdmFsaWRMYW5ndWFnZSwgXCJbVmFsaWRhdGUgbGFuZ3VhZ2VdXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB2YWxpZGF0ZSxcbiAgICB2YWxpZGF0ZUZvcm1hdCxcbiAgICB2YWxpZGF0ZUlucHV0LFxuICAgIHZhbGlkYXRlTGFuZ3VhZ2Vcbn07XG4iXX0=
