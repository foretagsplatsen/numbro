/*!
 * numbro.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
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
        result = input.value();
    } else if (typeof input === "string") {
        result = numbro.unformat(input);
    } else if (isNaN(input) || typeof input !== "number") {
        result = NaN;
    }

    return Number(result);
}

function numbro(input) {
    return new Numbro(normalizeInput(input));
}

// version number
numbro.version = VERSION;

// compare numbro object
numbro.isNumbro = function(obj) {
    return obj instanceof Numbro;
};

const formatter = require("./formatting");
const globalState = require("./globalState");
const validator = require("./validating");
const manipulate = require("./manipulating")(numbro);
const loader = require("./loading")(numbro);
const unformatter = require("./unformatting")(numbro);

Numbro.prototype = {
    clone: function() { return numbro(this._value); },
    format: function(format = {}) { return formatter.format(this, format); },
    formatCurrency: function(format = {}) {
        format.output = "currency";
        return formatter.format(this, format);
    },
    binaryByteUnits: function() { return formatter.getBinaryByteUnit(this);},
    decimalByteUnits: function() { return formatter.getDecimalByteUnit(this);},
    byteUnits: function() { return formatter.getByteUnit(this);},
    difference: function(other) {
        return Math.abs(this.clone().subtract(other).value());
    },
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
numbro.languages = globalState.languages;
numbro.languageData = globalState.currentLanguageData;
numbro.setLanguage = globalState.setCurrentLanguage;
numbro.zeroFormat = globalState.setZeroFormat;
numbro.defaultFormat = globalState.currentDefaults;
numbro.defaultCurrencyFormat = globalState.currentCurrencyDefaults;
numbro.validate = validator.validate;
numbro.loadCulturesInNode = loader.loadCulturesInNode;
numbro.unformat = unformatter.unformat;

module.exports = numbro;
