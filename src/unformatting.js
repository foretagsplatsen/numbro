/*!
 * unformatting.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

// Todo: implement

const globalState = require('./globalState');

function unformat(inputString, format, numbro) {
	let value = NaN;

	if (!isNaN(+inputString)) {
		value = +inputString;
	} else {
		// Remove the thousand separators
		let delimiters = globalState.currentDelimiters();
		let stripped = inputString.replace(new RegExp(delimiters.thousands, 'g'), '');

		if (stripped !== inputString) {
			return unformat(stripped, format, numbro);
		}

		stripped = inputString.replace(new RegExp(delimiters.decimal, 'g'), '.');

		if (stripped !== inputString) {
			return unformat(stripped, format, numbro);
		}
	}

	return numbro(value);
}

module.exports = (numbro) => ({
	unformat: (input, format) => unformat(input, format, numbro)
});