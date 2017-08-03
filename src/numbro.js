/*!
 * numbro.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

(function() {
	const VERSION = '2.0.0';

	// check for nodeJS
	const hasModule = (typeof module !== 'undefined' && module.exports);

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
		} else if (typeof input === 'string') {
			result = Numbro.prototype.unformat(input);
		} else {
			result = NaN;
		}

		return Number(result);
	}

	let numbro = function(input) {
		return new Numbro(normalizeInput(input));
	};

	// version number
	// noinspection JSAnnotator
	numbro.version = VERSION;

	// compare numbro object
	numbro.isNumbro = function(obj) {
		return obj instanceof Numbro;
	};

	const formatter = require('./formatting');
	const globalState = require('./globalState');
	const manipulate = require('./manipulating')(numbro);

	Numbro.prototype = {
		format: (format) => formatter.format(this, format),
		formatCurrency: (format) => {
			format.output = 'currency';
			return formatter.format(this, format);
		},
		unformat: (format) => {
			console.log('Not yet supported');
			return '';
		},
		binaryByteUnits: () => formatter.getBinaryByteUnit(this),
		decimalByteUnits: () => formatter.getDecimalByteUnit(this),
		byteUnits: () => formatter.getByteUnit(this),
		difference: (other) => {
			return Math.abs(this.clone().subtract(other).value());
		},
		add: (other) => manipulate.add(this, other),
		subtract: (other) => manipulate.subtract(this, other),
		multiply: (other) => manipulate.multiply(this, other),
		divide: (other) => manipulate.divide(this, other),
		set: (input) => manipulate.set(this, normalizeInput(input)),
		value: () => this._value,
		valueOf: () => this._value,
	};

	//
	// `numbro` static methods
	//

	numbro.language = globalState.currentLanguage;
	numbro.languages = globalState.languages;
	numbro.languageData = globalState.currentLanguage;

	//
	// Exposing Numbro
	//

	if (inNodejsRuntime()) {
		//Todo: Rename the folder in 2.0.0
		numbro.loadCulturesInNode();
	}

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
			define([], function() {
				return numbro;
			});
		}
	}
}.call(typeof window === 'undefined' ? this : window));
