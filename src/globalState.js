/*!
 * globalState.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

const enUS = require("./en-US");
const validating = require("./validating");

let state = {};

let currentLanguageTag = undefined;
let languages = {};

let zeroFormat = null;

function chooseLanguage(tag) { currentLanguageTag = tag; }

function currentLanguageData() { return languages[currentLanguageTag]; }

state.languages = () => languages;

//
// Current language accessors
//

state.currentLanguage = () => currentLanguageTag;
state.currentCurrency = () => currentLanguageData().currency || {};
state.currentAbbreviations = () => currentLanguageData().abbreviations || {};
state.currentDelimiters = () => currentLanguageData().delimiters || {};
state.currentOrdinal = () => currentLanguageData().ordinal || {};

//
// Defaults
//

state.currentDefaults = () => currentLanguageData().defaults || {};
state.currentOrdinalDefaults = () => currentLanguageData().ordinalDefaults || state.currentDefaults();
state.currentByteDefaults = () => currentLanguageData().byteDefaults || state.currentDefaults();
state.currentPercentageDefaults = () => currentLanguageData().percentageDefaults || state.currentDefaults();
state.currentCurrencyDefaults = () => currentLanguageData().currencyDefaults || state.currentDefaults();

//
// Zero format
//

state.hasZeroFormat = () => zeroFormat !== null;
state.getZeroFormat = () => zeroFormat;
state.setZeroFormat = (format) => zeroFormat = typeof(format) === "string" ? format : null;

//
// Getters/Setters
//

state.languageData = (tag) => {
    if (tag) {
        if (languages[tag]) {
            return languages[tag];
        }
        throw new Error(`Unknown tag "${tag}"`);
    }

    return currentLanguageData();
};

state.registerLanguage = (data, useLanguage = false) => {
    if (!validating.validateLanguage(data)) {
        throw new Error("Invalid language data");
    }

    languages[data.languageTag] = data;

    if (useLanguage) {
        chooseLanguage(data.languageTag);
    }
};

state.setLanguage = (tag, fallbackTag = enUS.languageTag) => {
    let tagToUse = tag;
    let suffix = tag.split("-")[0];
    let matchingLanguageTag = null;
    if (!languages[tagToUse]) {
        if (suffix) {
            Object.keys(languages).forEach(each => {
                if (!matchingLanguageTag && each.split("-")[0] === suffix) {
                    matchingLanguageTag = each;
                }
            });
        }

        if (languages[matchingLanguageTag]) {
            tagToUse = matchingLanguageTag;
        } else if (languages[fallbackTag]) {
            tagToUse = fallbackTag;
        } else {
            tagToUse = enUS.languageTag;
        }
    }

    chooseLanguage(tagToUse);
};

state.registerLanguage(enUS);
currentLanguageTag = enUS.languageTag;

module.exports = state;
