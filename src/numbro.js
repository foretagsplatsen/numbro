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

const VERSION = "2.0.0";

//
// Constructor
//

function Numbro(number) {
    this._value = number;
}

function normalizeInput(input) {
    let result = input;
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

numbro.isNumbro = function(object) {
    return object instanceof Numbro;
};

const globalState = require("./globalState");
const validator = require("./validating");
const loader = require("./loading")(numbro);
const unformatter = require("./unformatting");
let formatter = require("./formatting")(numbro);
let manipulate = require("./manipulating")(numbro);

Numbro.prototype = {
    clone: function() { return numbro(this._value); },
    format: function(format = {}) { return formatter.format(this, format); },
    formatCurrency: function(format = {}) {
        format.output = "currency";
        return formatter.format(this, format);
    },
    formatTime: function(format = {}) {
        format.output = "time";
        return formatter.format(this, format);
    },
    binaryByteUnits: function() { return formatter.getBinaryByteUnit(this);},
    decimalByteUnits: function() { return formatter.getDecimalByteUnit(this);},
    byteUnits: function() { return formatter.getByteUnit(this);},
    difference: function(other) { return manipulate.difference(this, other); },
    add: function(other) { return manipulate.add(this, other); },
    subtract: function(other) { return manipulate.subtract(this, other); },
    multiply: function(other) { return manipulate.multiply(this, other); },
    divide: function(other) { return manipulate.divide(this, other); },
    set: function(input) { return manipulate.set(this, normalizeInput(input)); },
    value: function() { return this._value; },
    valueOf: function() { return this._value; }
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
