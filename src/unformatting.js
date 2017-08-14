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

const allSuffixes = [
    {key: "ZiB", factor: Math.pow(1024, 7)},
    {key: "ZB", factor: Math.pow(1000, 7)},
    {key: "YiB", factor: Math.pow(1024, 8)},
    {key: "YB", factor: Math.pow(1000, 8)},
    {key: "TiB", factor: Math.pow(1024, 4)},
    {key: "TB", factor: Math.pow(1000, 4)},
    {key: "PiB", factor: Math.pow(1024, 5)},
    {key: "PB", factor: Math.pow(1000, 5)},
    {key: "MiB", factor: Math.pow(1024, 2)},
    {key: "MB", factor: Math.pow(1000, 2)},
    {key: "KiB", factor: Math.pow(1024, 1)},
    {key: "KB", factor: Math.pow(1000, 1)},
    {key: "GiB", factor: Math.pow(1024, 3)},
    {key: "GB", factor: Math.pow(1000, 3)},
    {key: "EiB", factor: Math.pow(1024, 6)},
    {key: "EB", factor: Math.pow(1000, 6)},
    {key: "B", factor: 1}
];

const globalState = require("./globalState");

function escapeRegExp(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function unformatValue(inputString, delimiters, currencySymbol = "", ordinal, zeroFormat, abbreviations, format) {
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

    let match = inputString.match(/\(([^)]*)\)/);

    if (match) {
        return -1 * unformatValue(match[1], delimiters, currencySymbol, ordinal, zeroFormat, abbreviations, format);
    }

    // Currency

    let stripped = inputString.replace(currencySymbol, "");

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

    for (let i = 0; i < allSuffixes.length; i++) {
        let suffix = allSuffixes[i];
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

    let possibleOrdinalValue = parseInt(inputString, 10);

    if (isNaN(possibleOrdinalValue)) {
        return undefined;
    }

    let ordinalString = ordinal(possibleOrdinalValue);
    stripped = inputString.replace(ordinalString, "");

    if (stripped !== inputString) {
        return unformatValue(stripped, delimiters, currencySymbol, format);
    }

    // Average
    let abbreviationKeys = Object.keys(abbreviations);
    let numberOfAbbreviations = abbreviationKeys.length;

    for (let i = 0; i < numberOfAbbreviations; i++) {
        let key = abbreviationKeys[i];

        stripped = inputString.replace(abbreviations[key], "");

        if (stripped !== inputString) {
            let factor = undefined;
            switch (key) { // eslint-disable-line default-case
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
    let separators = inputString.indexOf(":") && delimiters.thousands !== ":";

    if (!separators) {
        return false;
    }

    let segments = inputString.split(":");
    if (segments.length !== 3) {
        return false;
    }

    let hours = +segments[0];
    let minutes = +segments[1];
    let seconds = +segments[2];

    return !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds);
}

function unformatTime(inputString) {
    let segments = inputString.split(":");

    let hours = +segments[0];
    let minutes = +segments[1];
    let seconds = +segments[2];

    return seconds + 60 * minutes + 3600 * hours;
}

function unformat(inputString, format, numbro) {
    let delimiters = globalState.currentDelimiters();
    let currencySymbol = globalState.currentCurrency().symbol;
    let ordinal = globalState.currentOrdinal();
    let zeroFormat = globalState.getZeroFormat();
    let abbreviations = globalState.currentAbbreviations();

    let value = undefined;

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

    return numbro(value);
}

module.exports = (numbro) => ({
    unformat: (input, format) => unformat(input, format, numbro)
});
