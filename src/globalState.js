/*!
 * globalState.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

const enUS = require("./en-US");

let state = {};

let languages = {};

registerLanguage(enUS);
let currentLanguageTag = enUS.languageTag;

let zeroFormat = null;

function registerLanguage(data) {
    languages[data.languageTag] = data;
}

state.chooseLanguage = (tag) => currentLanguageTag = tag;
state.languages = () => languages;

//
// Current language accessors
//

state.currentLanguageData = () => languages[currentLanguageTag];
state.currentCurrency = () => state.currentLanguageData().currency || {};
state.currentAbbreviations = () => state.currentLanguageData().abbreviations || {};
state.currentDelimiters = () => state.currentLanguageData().delimiters || {};
state.currentOrdinal = () => state.currentLanguageData().ordinal || {};

//
// Defaults
//

state.currentDefaults = () => state.currentLanguageData().defaults || {};
state.currentOrdinalDefaults = () => state.currentLanguageData().ordinalDefaults || state.currentDefaults();
state.currentByteDefaults = () => state.currentLanguageData().byteDefaults || state.currentDefaults();
state.currentPercentageDefaults = () => state.currentLanguageData().percentageDefaults || state.currentDefaults();
state.currentCurrencyDefaults = () => state.currentLanguageData().currencyDefaults || state.currentDefaults();

//
// Zero format
//

state.hasZeroFormat = () => zeroFormat !== null;
state.getZeroFormat = () => zeroFormat;
state.setZeroFormat = (format) => zeroFormat = typeof(format) === "string" ? format : null;

//
// Getters/Setters
//

function setLanguage(tag, data) {
    if (tag !== data.languageTag) {
        throw new Error(`Mismatch between the provided tag "${tag}" and the data language tag "${data.languageTag}"`);
    }

    registerLanguage(data);
    state.chooseLanguage(tag);
}

state.currentLanguage = (tag, data) => {
    if (!tag) {
        return currentLanguageTag;
    }

    if (tag && !data) {
        if (!languages[tag]) {
            throw new Error(`Unknown language tag: ${tag}`);
        }
        state.chooseLanguage(tag);
    }

    setLanguage(tag, data);
    return tag;
};

state.setCurrentLanguage = (tag, fallbackTag = enUS.languageTag) => {
    let tagToUse = tag;
    let suffix = tag.split("-")[0];
    let matchingLanguageTag = null;
    if (!languages[tagToUse]) {
        if (suffix) {
            Object.keys(languages).forEach(tag => {
                if (!matchingLanguageTag && tag.split("-")[0] === suffix) {
                    matchingLanguageTag = tag;
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

    state.chooseLanguage(tagToUse);
};

module.exports = state;
