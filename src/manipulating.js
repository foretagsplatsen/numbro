// Todo: add BigNumber support (https://github.com/MikeMcl/bignumber.js/)

function add(n, other, numbro) {
	let value = other;

	if (numbro.isNumbro(other)) {
		value = other.value();
	}

	n._value += value;
	return n;
}

function subtract(n, other, numbro) {
	let value = other;

	if (numbro.isNumbro(other)) {
		value = other.value();
	}

	n._value -= value;
	return n;
}

function multiply(n, other, numbro) {
	let value = other;

	if (numbro.isNumbro(other)) {
		value = other.value();
	}

	n._value *= value;
	return n;
}

function divide(n, other, numbro) {
	let value = other;

	if (numbro.isNumbro(other)) {
		value = other.value();
	}

	n._value /= value;
	return n;
}

function set(n, input) {
	n._value = input;
	return n;
}

module.exports = function(numbro) {
	return {
		add: (n, other) => add(n, other, numbro),
		subtract: (n, other) => subtract(n, other, numbro),
		multiply: (n, other) => multiply(n, other, numbro),
		divide: (n, other) => divide(n, other, numbro),
		set
	}
};