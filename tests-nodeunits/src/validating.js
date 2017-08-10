const validating = require("../../src/validating");

let lastErrorMessage = "";
let oldConsole = undefined;

exports.validating = {
	setUp: (callback) => {
        oldConsole = console.error; // eslint-disable-line no-console

        console.error = (message) => { // eslint-disable-line no-console
			lastErrorMessage = message;
		};

		callback();
	},
	tearDown: (callback) => {
        console.error = oldConsole; // eslint-disable-line no-console
		callback();
	},
	format: (test) => {
		let validFormat = [
			// format
            {prefix: "foo"}
		];

		validFormat.forEach((format) => {
			let result = validating.validateFormat(format);
			test.ok(result, `Format ${JSON.stringify(format)} should be valid`);
		});

		let invalidFormat = [
			// [format, errorMessage]
			[
				{
					bar: 0
				},
                "[Validate format] Invalid key: bar"
			],
			[
				{
					prefix: 2
				},
                "[Validate format] prefix type mismatched: \"string\" expected, \"number\" provided"
			]
		];

		invalidFormat.forEach(([format, errorMessage]) => {
			let result = validating.validateFormat(format);
			test.ok(!result, `Format ${JSON.stringify(format)} should not be valid`);
			test.strictEqual(errorMessage, lastErrorMessage, `"${lastErrorMessage}" should be "${errorMessage}"`);
		});

		test.done();
	}
};
