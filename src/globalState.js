const enUS = require('./en-US');

let state = {};

let languages = {
	'en-US': enUS
};
let currentLanguageTag = 'en-US';
let zeroFormat = null;

function registerLanguage(tag, data) {
	languages[tag] = data;
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

//
// Getters/Setters
//

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

	state.setLanguage(tag, data);
	return tag;
};

state.setLanguage = (tag, data) => {
	registerLanguage(tag, data);
	state.chooseLanguage(tag);
};

module.exports = state;