const formatting = require("../../src/formatting");
const globalState = require("../../src/globalState");

exports.formatting = {
	format: (test) => {
		let data = [
			// [[value, format], result]
            [[10, {prefix: "foo"}], "foo10"],
            [[-10, {prefix: "foo"}], "foo-10"],
            [[10, {postfix: "foo"}], "10foo"],

            [[-10, {postfix: "foo", negative: "parenthesis"}], "(10)foo"],
            [[10, {postfix: "foo", output: "percent"}], "1000%foo"]
		];

		data.forEach(([[n, format], expectedResult]) => {
			let result = formatting.format({_value: n}, format, globalState);
            test.strictEqual(result, expectedResult, `${n} formatted with ${JSON.stringify(format)} should be ${expectedResult}`);
		});

		test.done();
	},
	formatOrdinal: (test) => {
		let data = [
			// [[value, format], result]
            [[1, {}], "1st"],
            [[2, {}], "2nd"],
            [[3, {}], "3rd"],
            [[4, {}], "4th"]
		];

		data.forEach(([[n, format], expectedResult]) => {
			let result = formatting.__formatOrdinal({_value: n}, format, globalState);
            test.strictEqual(result, expectedResult, `${n} formatted with ${JSON.stringify(format)} should be ${expectedResult}`);
		});

		test.done();
	},
	formatByte: (test) => {
		let data = [
			// [[value, format], result]
            [[Math.pow(2, 10), {}], "1KiB"],
            [[2 * Math.pow(2, 10), {}], "2KiB"],
            [[Math.pow(2, 20), {}], "1MiB"],
            [[Math.pow(2, 30), {}], "1GiB"],
            [[Math.pow(2, 40), {}], "1TiB"],

            [[Math.pow(10, 3), {base: "decimal"}], "1KB"],
            [[2 * Math.pow(10, 3), {base: "decimal"}], "2KB"],
            [[Math.pow(10, 6), {base: "decimal"}], "1MB"],
            [[Math.pow(10, 9), {base: "decimal"}], "1GB"],
            [[Math.pow(10, 12), {base: "decimal"}], "1TB"],

            [[Math.pow(2, 10), {base: "general"}], "1KB"],
            [[2 * Math.pow(2, 10), {base: "general"}], "2KB"],
            [[Math.pow(2, 20), {base: "general"}], "1MB"],
            [[Math.pow(2, 30), {base: "general"}], "1GB"],
            [[Math.pow(2, 40), {base: "general"}], "1TB"]
		];

		data.forEach(([[n, format], expectedResult]) => {
			let result = formatting.__formatByte({_value: n}, format, globalState);
            test.strictEqual(result, expectedResult, `${n} formatted with ${JSON.stringify(format)} should be ${expectedResult}`);
		});

		test.done();
	},
	formatTime: (test) => {
		let data = [
			// [[value, format], result]
            [[86400, {}], "24:00:00"],
            [[-86400, {}], "-24:00:00"],
            [[0, {}], "0:00:00"]
		];

		data.forEach(([[n, format], expectedResult]) => {
			let result = formatting.__formatTime({_value: n}, format, globalState);
            test.strictEqual(result, expectedResult, `${n} formatted with ${JSON.stringify(format)} should be ${expectedResult}`);
		});

		test.done();
	},
	formatPercentage: (test) => {
		let data = [
			// [[value, format], result]
            [[0.15, {}], "15%"],
            [[12.325, {}], "1232.5%"]
		];

		data.forEach(([[n, format], expectedResult]) => {
			let result = formatting.__formatPercentage({_value: n}, format, globalState);
            test.strictEqual(result, expectedResult, `${n} formatted with ${JSON.stringify(format)} should be ${expectedResult}`);
		});

		test.done();
	},
	formatNumber: (test) => {
		let data = [
			// [[value, format], result]
            [[12.345, {}], "12.345"],
            [[12.345, {mantissa: 0}], "12"],
            [[12.345, {mantissa: 1}], "12.3"],
            [[12.345, {mantissa: 2}], "12.34"],
            [[12.345, {mantissa: 3}], "12.345"],
            [[12.345, {mantissa: 4}], "12.3450"],
            [[12.345, {mantissa: 5}], "12.34500"],

            [[12345, {average: true}], "12k"],
            [[12345, {average: true, mantissa: -1}], "12.345k"],
            [[12345, {average: true, mantissa: 0}], "12k"],
            [[12345, {average: true, mantissa: 1}], "12.3k"],
            [[12345, {average: true, mantissa: 2}], "12.34k"],
            [[12345, {average: true, mantissa: 3}], "12.345k"],
            [[12345, {average: true, mantissa: 4}], "12.3450k"],
            [[12345, {average: true, mantissa: 5}], "12.34500k"],

            [[1234567, {forceAverage: "thousand"}], "1234k"],
            [[1234567890, {forceAverage: "thousand"}], "1234567k"],
            [[1234567890, {forceAverage: "million"}], "1234m"],

            [[12345, {mantissa: 2, optionalMantissa: false}], "12345.00"],
            [[12345, {mantissa: 2, optionalMantissa: true}], "12345"],
            [[12345.1, {mantissa: 2, optionalMantissa: true}], "12345.10"],

            [[12345, {characteristic: 0}], "12345"],
            [[12345, {characteristic: 1}], "12345"],
            [[12345, {characteristic: 2}], "12345"],
            [[12345, {characteristic: 3}], "12345"],
            [[12345, {characteristic: 4}], "12345"],
            [[12345, {characteristic: 5}], "12345"],
            [[12345, {characteristic: 6}], "012345"],
            [[12345, {characteristic: 7}], "0012345"],

            [[1, {thousandSeparated: true}], "1"],
            [[12, {thousandSeparated: true}], "12"],
            [[123, {thousandSeparated: true}], "123"],
            [[1234, {thousandSeparated: true}], "1,234"],
            [[12345, {thousandSeparated: true}], "12,345"],
            [[123456, {thousandSeparated: true}], "123,456"],
            [[1234567, {thousandSeparated: true}], "1,234,567"],
            [[12345678, {thousandSeparated: true}], "12,345,678"],
            [[123456789, {thousandSeparated: true}], "123,456,789"],

            [[1.2, {mantissa: 2}, "y"], "1y20"],

            [[10, {forceSign: true}], "+10"],
            [[-10, {forceSign: true}], "-10"],

            [[10, {negative: "sign"}], "10"],
            [[-10, {negative: "sign"}], "-10"],
            [[10, {negative: "parenthesis"}], "10"],
            [[-10, {negative: "parenthesis"}], "(10)"],

            [[-10, {forceSign: true, negative: "sign"}], "-10"],
            [[10, {forceSign: true, negative: "parenthesis"}], "+10"],
            [[-10, {forceSign: true, negative: "parenthesis"}], "(10)"]
		];

		data.forEach(([[n, format, decimalSeparator = undefined], expectedResult]) => {
			let result = formatting.__formatNumber({_value: n}, format, globalState, decimalSeparator);
            test.strictEqual(result, expectedResult, `${n} formatted with ${JSON.stringify(format)} should be ${expectedResult}`);
		});

		test.done();
	},
	indexesOfGroupSpaces: (test) => {
		let data = [
			// [args, result]
			[[0, 3], []],
			[[1, 3], []],
			[[2, 3], []],
			[[3, 3], []],
			[[4, 3], [1]],
			[[5, 3], [2]],
			[[6, 3], [3]],
			[[7, 3], [1, 4]],
			[[8, 3], [2, 5]],
			[[9, 3], [3, 6]],
			[[10, 3], [1, 4, 7]],
			[[11, 3], [2, 5, 8]]
		];

		data.forEach(([args, expectedResult]) => {
			let result = formatting.__indexesOfGroupSpaces(...args);
            test.same(result, expectedResult, `[${args}] should output [${expectedResult}]`);
		});

		test.done();
	}
};
