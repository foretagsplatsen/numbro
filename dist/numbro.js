"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
			}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, l, l.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
		module.exports = {
			languageTag: 'en-US',
			delimiters: {
				thousands: ',',
				decimal: '.'
			},
			abbreviations: {
				thousand: 'k',
				million: 'm',
				billion: 'b',
				trillion: 't',
				spaced: false
			},
			ordinal: function ordinal(number) {
				var b = number % 10;
				return ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
			},
			currency: {
				symbol: '$',
				position: 'prefix',
				code: 'USD'
			},
			defaults: {
				currencyFormat: ',4 a'
			},
			formats: {
				fourDigits: '4 a',
				fullWithTwoDecimals: '$ ,0.00',
				fullWithTwoDecimalsNoCurrency: ',0.00',
				fullWithNoDecimals: '$ ,0'
			}
		};
	}, {}], 2: [function (require, module, exports) {
		var globalState = require('./globalState');
		var validating = require('./validating');

		var binarySuffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
		var decimalSuffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var bytes = {
			general: { scale: 1024, suffixes: decimalSuffixes, marker: 'bd' },
			binary: { scale: 1024, suffixes: binarySuffixes, marker: 'b' },
			decimal: { scale: 1000, suffixes: decimalSuffixes, marker: 'd' }
		};

		// general must be before the others because it reuses their characters!
		var byteFormatOrder = [bytes.general, bytes.binary, bytes.decimal];

		/**
   * Entry point. We add the prefix and postfix here to ensure they are correctly placed
   */
		function format(n) {
			var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var valid = validating.validateFormat(format);

			if (!valid) {
				return 'ERROR: invalid format';
			}

			var prefix = format.prefix || '';
			var postfix = format.postfix || '';

			var output = formatNumbro(n, format);
			output = insertPrefix(output, prefix);
			output = insertPostfix(output, postfix);
			return output;
		}

		function formatNumbro(n, format) {
			switch (format.output) {
				case 'currency':
					return formatCurrency(n, format, globalState);
				case 'percent':
					return formatPercentage(n, format, globalState);
				case 'byte':
					return formatByte(n, format, globalState);
				case 'time':
					return formatTime(n, format, globalState);
				case 'ordinal':
					return formatOrdinal(n, format, globalState);
				case 'number':
				default:
					return formatNumber(n, format, globalState);
			}
		}

		function getDecimalByteUnit(n) {
			var data = bytes.decimal;
			return getFormatByteUnits(n._value, data.suffixes, data.scale).suffix;
		}

		function getBinaryByteUnit(n) {
			var data = bytes.binary;
			return getFormatByteUnits(n._value, data.suffixes, data.scale).suffix;
		}

		function getByteUnit(n) {
			var data = bytes.general;
			return getFormatByteUnits(n._value, data.suffixes, data.scale).suffix;
		}

		function getFormatByteUnits(value, suffixes, scale) {
			var suffix = suffixes[0],
			    power = void 0,
			    min = void 0,
			    max = void 0,
			    abs = Math.abs(value);

			if (abs >= scale) {
				for (power = 1; power < suffixes.length; ++power) {
					min = Math.pow(scale, power);
					max = Math.pow(scale, power + 1);

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

		function formatByte(n, format, globalState) {
			var base = format.base || 'binary';
			var baseInfo = bytes[base];

			var _getFormatByteUnits = getFormatByteUnits(n._value, baseInfo.suffixes, baseInfo.scale),
			    value = _getFormatByteUnits.value,
			    suffix = _getFormatByteUnits.suffix;

			var output = formatNumber({ _value: value }, format, globalState, undefined, globalState.currentByteDefaults());
			var abbreviations = globalState.currentAbbreviations();
			return "" + output + (abbreviations.spaced ? ' ' : '') + suffix;
		}

		function formatOrdinal(n, format, globalState) {
			var ordinalFn = globalState.currentOrdinal();
			var abbreviations = globalState.currentAbbreviations();

			var output = formatNumber(n, format, globalState, undefined, globalState.currentOrdinalDefaults());
			var ordinal = ordinalFn(n._value);

			return "" + output + (abbreviations.spaced ? ' ' : '') + ordinal;
		}

		function formatTime(n, format, globalState) {
			var hours = Math.floor(n._value / 60 / 60),
			    minutes = Math.floor((n._value - hours * 60 * 60) / 60),
			    seconds = Math.round(n._value - hours * 60 * 60 - minutes * 60);
			return hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		}

		function formatPercentage(n, format, globalState) {
			var output = formatNumber({ _value: n._value * 100 }, format, globalState, undefined, globalState.currentPercentageDefaults());
			var abbreviations = globalState.currentAbbreviations();
			return "" + output + (abbreviations.spaced ? ' ' : '') + "%";
		}

		function formatCurrency(n, format, globalState) {
			var currentCurrency = globalState.currentCurrency();
			var decimalSeparator = undefined;
			var space = '';

			var output = void 0;

			if (currentCurrency.spaceSeparated) {
				space = ' ';
			}

			if (currentCurrency.position === 'infix') {
				decimalSeparator = space + currentCurrency.symbol + space;
			}

			output = formatNumber(n, format, globalState, decimalSeparator, globalState.currentCurrencyDefaults());

			if (currentCurrency.position === 'prefix') {
				output = currentCurrency.symbol + space + output;
			}

			if (currentCurrency.position === 'postfix') {
				output = output + space + currentCurrency.symbol;
			}

			return output;
		}

		function computeAverage(value, forceAverage, globalState) {
			var abbreviations = globalState.currentAbbreviations();
			var abbreviation = void 0;
			var abs = Math.abs(value);

			if (abs >= Math.pow(10, 12) && !forceAverage || forceAverage === 'trillion') {
				// trillion
				abbreviation = abbreviations.trillion;
				value = value / Math.pow(10, 12);
			} else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !forceAverage || forceAverage === 'billion') {
				// billion
				abbreviation = abbreviations.billion;
				value = value / Math.pow(10, 9);
			} else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !forceAverage || forceAverage === 'million') {
				// million
				abbreviation = abbreviations.million;
				value = value / Math.pow(10, 6);
			} else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !forceAverage || forceAverage === 'thousand') {
				// thousand
				abbreviation = abbreviations.thousand;
				value = value / Math.pow(10, 3);
			}

			var optionalSpace = abbreviations.spaced ? ' ' : '';
			abbreviation = optionalSpace + abbreviation;
			return { value: value, abbreviation: abbreviation };
		}

		function setMantissaPrecision(value, optionalMantissa, precision) {
			if (precision === -1) {
				return value;
			}

			var result = Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision);
			var currentMantissa = result.toString().split('.')[1] || '';

			if (currentMantissa.length < precision) {
				if (currentMantissa.length === 0) {
					if (optionalMantissa) {
						return result;
					} else {
						result += '.';
					}
				}

				var missingZeros = precision - currentMantissa.length;
				for (var i = 0; i < missingZeros; i++) {
					result += '0';
				}
			}

			return result;
		}

		function setCharacteristicPrecision(value, precision) {
			var result = value;
			var currentCharacteristic = result.toString().split('.')[0];

			if (currentCharacteristic.length < precision) {
				var missingZeros = precision - currentCharacteristic.length;
				for (var i = 0; i < missingZeros; i++) {
					result = '0' + result;
				}
			}

			return result;
		}

		/**
   * Return the indexes where are the group separations after splitting `totalLength` in group of `groupSize` size.
   * Important: we start grouping from the right hand side.
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

		function replaceDelimiters(output, thousandSeparated, globalState, decimalSeparator) {
			var delimiters = globalState.currentDelimiters();
			var thousandSeparator = delimiters.thousands;
			decimalSeparator = decimalSeparator || delimiters.decimal;
			var thousandsSize = delimiters.thousandsSize || 3;

			var result = output.toString();
			var characteristic = result.split('.')[0];
			var mantissa = result.split('.')[1];

			if (thousandSeparated) {
				var indexesToInsertThousandDelimiters = indexesOfGroupSpaces(characteristic.length, thousandsSize);
				indexesToInsertThousandDelimiters.forEach(function (position, index) {
					characteristic = characteristic.slice(0, position + index) + thousandSeparator + characteristic.slice(position + index);
				});
			}

			if (mantissa !== undefined) {
				result = characteristic + decimalSeparator + mantissa;
			} else {
				result = characteristic;
			}
			return result;
		}

		function insertAbbreviation(output, abbreviation) {
			return output + abbreviation;
		}

		function insertSign(output, value, negative) {
			if (value >= 0) {
				return "+" + output;
			} else {
				if (negative === 'sign') {
					return output;
				}

				return "(" + output.slice(1) + ")";
			}
		}

		function insertPrefix(output, prefix) {
			return prefix + output;
		}

		function insertPostfix(output, postfix) {
			return output + postfix;
		}

		function formatNumber(n, format, globalState, decimalSeparator, defaults) {
			var value = n._value;
			var output = void 0;

			if (value === 0 && globalState.hasZeroFormat()) {
				return globalState.getZeroFormat();
			}

			if (!isFinite(value)) {
				return value.toString();
			}

			defaults = defaults || globalState.currentDefaults();

			var characteristicPrecision = format.characteristic || defaults.characteristic || 0;
			var forceAverage = format.forceAverage || defaults.forceAverage || false; // 'trillion', 'billion', 'million' or 'thousand'
			var average = format.average || defaults.average || !!forceAverage;
			var mantissaPrecision = format.mantissa !== undefined ? format.mantissa : average ? defaults.mantissa || 0 : -1; // default when averaging is to chop off decimals
			var optionalMantissa = format.optionalMantissa === undefined ? defaults.optionalMantissa !== false : format.optionalMantissa;
			var thousandSeparated = format.thousandSeparated || defaults.thousandSeparated || false;
			var negative = format.negative || defaults.negative || 'sign'; // 'sign' or 'parenthesis'
			var forceSign = format.forceSign || defaults.forceSign || false;

			var abbreviation = '';

			if (average) {
				var data = computeAverage(value, forceAverage, globalState);
				value = data.value;
				abbreviation = data.abbreviation;
			}

			// Set mantissa precision
			output = setMantissaPrecision(value, optionalMantissa, mantissaPrecision);
			output = setCharacteristicPrecision(output, characteristicPrecision);
			output = replaceDelimiters(output, thousandSeparated, globalState, decimalSeparator);

			if (average) {
				output = insertAbbreviation(output, abbreviation);
			}

			if (forceSign || value < 0) {
				output = insertSign(output, value, negative);
			}

			return output;
		}

		module.exports = {
			format: format,
			getByteUnit: getByteUnit,
			getBinaryByteUnit: getBinaryByteUnit,
			getDecimalByteUnit: getDecimalByteUnit,
			__formatOrdinal: formatOrdinal,
			__formatByte: formatByte,
			__formatTime: formatTime,
			__formatCurrency: formatCurrency,
			__formatNumber: formatNumber,
			__formatPercentage: formatPercentage,
			__indexesOfGroupSpaces: indexesOfGroupSpaces
		};
	}, { "./globalState": 3, "./validating": 8 }], 3: [function (require, module, exports) {
		var enUS = require('./en-US');

		var state = {};

		var languages = {};

		registerLanguage(enUS);
		var currentLanguageTag = enUS.languageTag;

		var zeroFormat = null;

		function registerLanguage(data) {
			languages[data.languageTag] = data;
		}

		state.chooseLanguage = function (tag) {
			return currentLanguageTag = tag;
		};
		state.languages = function () {
			return languages;
		};

		//
		// Current language accessors
		//

		state.currentLanguageData = function () {
			return languages[currentLanguageTag];
		};
		state.currentCurrency = function () {
			return state.currentLanguageData().currency || {};
		};
		state.currentAbbreviations = function () {
			return state.currentLanguageData().abbreviations || {};
		};
		state.currentDelimiters = function () {
			return state.currentLanguageData().delimiters || {};
		};
		state.currentOrdinal = function () {
			return state.currentLanguageData().ordinal || {};
		};

		//
		// Defaults
		//

		state.currentDefaults = function () {
			return state.currentLanguageData().defaults || {};
		};
		state.currentOrdinalDefaults = function () {
			return state.currentLanguageData().ordinalDefaults || state.currentDefaults();
		};
		state.currentByteDefaults = function () {
			return state.currentLanguageData().byteDefaults || state.currentDefaults();
		};
		state.currentPercentageDefaults = function () {
			return state.currentLanguageData().percentageDefaults || state.currentDefaults();
		};
		state.currentCurrencyDefaults = function () {
			return state.currentLanguageData().currencyDefaults || state.currentDefaults();
		};

		//
		// Zero format
		//

		state.hasZeroFormat = function () {
			return zeroFormat !== null;
		};
		state.getZeroFormat = function () {
			return zeroFormat;
		};
		state.setZeroFormat = function (format) {
			return zeroFormat = typeof format === 'string' ? format : null;
		};

		//
		// Getters/Setters
		//

		function setLanguage(tag, data) {
			if (tag !== data.languageTag) {
				throw new Error("Mismatch between the provided tag \"" + tag + "\" and the data language tag \"" + data.languageTag + "\"");
			}

			registerLanguage(data);
			state.chooseLanguage(tag);
		}

		state.currentLanguage = function (tag, data) {
			if (!tag) {
				return currentLanguageTag;
			}

			if (tag && !data) {
				if (!languages[tag]) {
					throw new Error("Unknown language tag: " + tag);
				}
				state.chooseLanguage(tag);
			}

			setLanguage(tag, data);
			return tag;
		};

		state.setCurrentLanguage = function (tag) {
			var fallbackTag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : enUS.languageTag;

			var tagToUse = tag;
			var suffix = tag.split('-')[0];
			var matchingLanguageTag = null;
			if (!languages[tagToUse]) {
				if (suffix) {
					Object.keys(languages).forEach(function (tag) {
						if (!matchingLanguageTag && tag.split('-')[0] === suffix) {
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
	}, { "./en-US": 1 }], 4: [function (require, module, exports) {
		// Todo: implement

		function _loadCulturesInNode(numbro) {
			return true;
		}

		module.exports = function (numbro) {
			return {
				loadCulturesInNode: function loadCulturesInNode() {
					return _loadCulturesInNode(numbro);
				}
			};
		};
	}, {}], 5: [function (require, module, exports) {
		// Todo: add BigNumber support (https://github.com/MikeMcl/bignumber.js/)

		function multiplier(x) {
			var parts = x.toString().split('.');
			if (parts.length < 2) {
				return 1;
			}
			return Math.pow(10, parts[1].length);
		}

		function correctionFactor() {
			var args = Array.prototype.slice.call(arguments);
			return args.reduce(function (prev, next) {
				var mp = multiplier(prev),
				    mn = multiplier(next);
				return mp > mn ? mp : mn;
			}, -Infinity);
		}

		function _add(n, other, numbro) {
			var value = other;

			if (numbro.isNumbro(other)) {
				value = other.value();
			}

			var factor = correctionFactor.call(null, n._value, value);

			function callback(acc, number) {
				return acc + factor * number;
			}

			n._value = [n._value, value].reduce(callback, 0) / factor;
			return n;
		}

		function _subtract(n, other, numbro) {
			var value = other;

			if (numbro.isNumbro(other)) {
				value = other.value();
			}

			var factor = correctionFactor.call(null, n._value, value);

			function callback(acc, number) {
				return acc - factor * number;
			}

			n._value = [value].reduce(callback, n._value * factor) / factor;
			return n;
		}

		function _multiply(n, other, numbro) {
			var value = other;

			if (numbro.isNumbro(other)) {
				value = other.value();
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
				value = other.value();
			}

			function callback(accum, curr) {
				var factor = correctionFactor(accum, curr);
				return accum * factor / (curr * factor);
			}

			n._value = [n._value, value].reduce(callback);
			return n;
		}

		function set(n, input) {
			n._value = input;
			return n;
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
				set: set
			};
		};
	}, {}], 6: [function (require, module, exports) {
		/*!
   * numbro.js
   * version : 2.0.0
   * author : Benjamin Van Ryseghem
   * license : MIT
   * https://benjamin.vanryseghem.com
   */

		(function () {
			var VERSION = '2.0.0';

			// check for nodeJS
			var hasModule = typeof module !== 'undefined' && module.exports;

			//
			// Constructor
			//

			function Numbro(number) {
				this._value = number;
			}

			function normalizeInput(input) {
				var result = input;
				if (numbro.isNumbro(input)) {
					result = input.value();
				} else if (typeof input === 'string') {
					result = numbro.unformat(input);
				} else if (isNaN(input) || typeof input !== 'number') {
					result = NaN;
				}

				return Number(result);
			}

			var numbro = function numbro(input) {
				return new Numbro(normalizeInput(input));
			};

			// version number
			// noinspection JSAnnotator
			numbro.version = VERSION;

			// compare numbro object
			numbro.isNumbro = function (obj) {
				return obj instanceof Numbro;
			};

			var formatter = require('./formatting');
			var globalState = require('./globalState');
			var validator = require('./validating');
			var manipulate = require('./manipulating')(numbro);
			var loader = require('./loading')(numbro);
			var unformatter = require('./unformatting')(numbro);

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

					format.output = 'currency';
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
					return Math.abs(this.clone().subtract(other).value());
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
			numbro.languages = globalState.languages;
			numbro.languageData = globalState.currentLanguageData;
			numbro.setLanguage = globalState.setCurrentLanguage;
			numbro.zeroFormat = globalState.setZeroFormat;
			numbro.defaultFormat = globalState.currentDefaults;
			numbro.defaultCurrencyFormat = globalState.currentCurrencyDefaults;
			numbro.validate = validator.validate;
			numbro.loadCulturesInNode = loader.loadCulturesInNode;
			numbro.unformat = unformatter.unformat;

			//
			// Exposing Numbro
			//

			// CommonJS module is defined
			if (hasModule) {
				module.exports = numbro;
			} else {
				/*global ender:false */
				if (typeof ender === 'undefined') {
					// here, `this` means `window` in the browser, or `global` on the server
					// add `numbro` as a global object via a string identifier,
					// for Closure Compiler 'advanced' mode
					this.numbro = numbro;
				}

				/*global define:false */
				if (typeof define === 'function' && define.amd) {
					define([], function () {
						return numbro;
					});
				}
			}
		}).call(typeof window === 'undefined' ? this : window);
	}, { "./formatting": 2, "./globalState": 3, "./loading": 4, "./manipulating": 5, "./unformatting": 7, "./validating": 8 }], 7: [function (require, module, exports) {
		// Todo: implement

		var globalState = require('./globalState');

		function _unformat(inputString, format, numbro) {
			var value = NaN;

			if (!isNaN(+inputString)) {
				value = +inputString;
			} else {
				// Remove the thousand separators
				var delimiters = globalState.currentDelimiters();
				var stripped = inputString.replace(new RegExp(delimiters.thousands, 'g'), '');

				if (stripped !== inputString) {
					return _unformat(stripped, format, numbro);
				}

				stripped = inputString.replace(new RegExp(delimiters.decimal, 'g'), '.');

				if (stripped !== inputString) {
					return _unformat(stripped, format, numbro);
				}
			}

			return numbro(value);
		}

		module.exports = function (numbro) {
			return {
				unformat: function unformat(input, format) {
					return _unformat(input, format, numbro);
				}
			};
		};
	}, { "./globalState": 3 }], 8: [function (require, module, exports) {
		// Todo: implement

		var validOutputValues = ['currency', 'percent', 'byte', 'time', 'ordinal', 'number'];

		var validForceAverageValues = ['trillion', 'billion', 'million', 'thousand'];

		var validNegativeValues = ['sign', 'parenthesis'];

		var validFormat = {
			output: {
				type: 'string',
				validValues: validOutputValues
			},
			characteristic: {
				type: 'number',
				restriction: function restriction(number) {
					return number >= 0;
				},
				message: 'value must be positive'
			},
			prefix: {
				type: 'string'
			},
			postfix: {
				type: 'string'
			},
			forceAverage: {
				type: 'string',
				validValues: validForceAverageValues
			},
			average: {
				type: 'boolean'
			},
			mantissa: {
				type: 'number',
				restriction: function restriction(number) {
					return number >= 0;
				},
				message: 'value must be positive'
			},
			optionalMantissa: {
				type: 'boolean'
			},
			thousandSeparated: {
				type: 'boolean'
			},
			negative: {
				type: 'string',
				validValues: validNegativeValues
			},
			forceSign: {
				type: 'boolean'
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
			var validFormat = validateFormat(format);

			return validInput && validFormat;
		}

		function validateInput(input) {
			return true;
		}

		function validateFormat(format) {
			var results = Object.keys(format).map(function (key) {
				if (!validFormat[key]) {
					console.error("[Validate format] Invalid key: " + key);
					return false;
				}

				var data = validFormat[key];

				var value = format[key];
				if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== data.type) {
					console.error("[Validate format] " + key + " type mismatched: \"" + data.type + "\" expected, \"" + (typeof value === "undefined" ? "undefined" : _typeof(value)) + "\" provided");
					return false;
				}

				if (data.restriction && !data.restriction(value)) {
					console.error("[Validate format] " + key + " invalid value: " + data.message);
					return false;
				}

				if (data.validValues && data.validValues.indexOf(value) === -1) {
					console.error("[Validate format] " + key + " invalid value: must be among " + JSON.stringify(data.validValues) + ", " + value + " provided");
					return false;
				}

				return true;
			});

			return results.reduce(function (acc, current) {
				return acc && current;
			}, true);
		}

		module.exports = {
			validate: validate,
			validateFormat: validateFormat,
			validateInput: validateInput
		};
	}, {}] }, {}, [6]);
//# sourceMappingURL=numbro.js.map
