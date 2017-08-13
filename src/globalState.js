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

const enUS = require("./en-US");
const validating = require("./validating");

let state = {};

let currentLanguageTag = undefined;
let languages = {};

let zeroFormat = null;

function chooseLanguage(tag) { currentLanguageTag = tag; }

function currentLanguageData() { return languages[currentLanguageTag]; }

state.languages = () => Object.assign({}, languages);

//
// Current language accessors
//

state.currentLanguage = () => currentLanguageTag;
state.currentCurrency = () => currentLanguageData().currency;
state.currentAbbreviations = () => currentLanguageData().abbreviations;
state.currentDelimiters = () => currentLanguageData().delimiters;
state.currentOrdinal = () => currentLanguageData().ordinal;

//
// Defaults
//

state.currentDefaults = () => Object.assign({}, currentLanguageData().defaults);
state.currentOrdinalDefaults = () => Object.assign({}, state.currentDefaults(), currentLanguageData().ordinalDefaults);
state.currentByteDefaults = () => Object.assign({}, state.currentDefaults(), currentLanguageData().byteDefaults);
state.currentPercentageDefaults = () => Object.assign({}, state.currentDefaults(), currentLanguageData().percentageDefaults);
state.currentCurrencyDefaults = () => Object.assign({}, state.currentDefaults(), currentLanguageData().currencyDefaults);

//
// Zero format
//

state.getZeroFormat = () => zeroFormat;
state.setZeroFormat = (format) => zeroFormat = typeof(format) === "string" ? format : null;
state.hasZeroFormat = () => zeroFormat !== null;

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
        Object.keys(languages).forEach(each => {
            if (!matchingLanguageTag && each.split("-")[0] === suffix) {
                matchingLanguageTag = each;
            }
        });

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
