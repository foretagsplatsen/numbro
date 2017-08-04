const numbro = require('../../src/numbro');

exports.misc = {

	value: function(test) {
		test.expect(5);

		let tests = [
				[1000, 1000],
				[0.5, 0.5],
				[undefined, NaN],
				['1,000', 1000],
				['not a number', NaN],
			],
			num;

		for (let i = 0; i < tests.length; i++) {
			num = numbro(tests[i][0]);
			if (isNaN(tests[i][1])) {
				test.ok(isNaN(num.value()), tests[i][0]);
			} else {
				test.strictEqual(num.value(), tests[i][1], tests[i][1]);
			}
		}

		test.done();
	},

	regression265: function(test) {
		// Setup
		let result = numbro(null).format();
		test.strictEqual(result, "NaN");

		//Teardown
		test.done();
	},

	set: function(test) {
		test.expect(2);

		let tests = [
				[1000, 1000],
				[-0.25, -0.25]
			],
			num;

		for (let i = 0; i < tests.length; i++) {
			num = numbro().set(tests[i][0]);
			test.strictEqual(num.value(), tests[i][1], tests[i][0]);
		}

		test.done();
	},

	customZero: function(test) {
		test.expect(3);

		let tests = [
			[0, null, '0'],
			[0, 'N/A', 'N/A'],
			[0, '', '']
		];

		for (let i = 0; i < tests.length; i++) {
			numbro.zeroFormat(tests[i][1]);
			test.strictEqual(numbro(tests[i][0]).format('0'), tests[i][2], tests[i][1]);
		}

		test.done();
	},

	clone: function(test) {
		test.expect(4);

		let a = numbro(1000),
			b = numbro(a),
			c = a.clone(),
			aVal = a.value(),
			aSet = a.set(2000).value(),
			bVal = b.value(),
			cVal = c.add(10).value();

		test.strictEqual(aVal, 1000, 'Parent starting value');
		test.strictEqual(aSet, 2000, 'Parent set to 2000');
		test.strictEqual(bVal, 1000, 'Implicit clone unmanipulated');
		test.strictEqual(cVal, 1010, 'Explicit clone + 10');

		test.done();
	},

	isNumbro: function(test) {
		test.expect(2);

		let tests = [
			[numbro(), true],
			[1, false]
		];

		for (let i = 0; i < tests.length; i++) {
			test.strictEqual(numbro.isNumbro(tests[i][0]), tests[i][1], tests[i][0]);
		}

		test.done();
	},

	languageData: function(test) {
		test.expect(10);

		let cOld = '$',
			cNew = '!',
			formatTestVal = function() {
				return numbro(100).formatCurrency();
			},
			oldCurrencyVal = cOld + '100',
			newCurrencyVal = cNew + '100';

		test.strictEqual(numbro.languageData().currency.symbol, cOld, 'Current language currency is ' + cOld);
		test.strictEqual(numbro.languageData('en-US').currency.symbol, cOld, 'English language currency is ' + cOld);

		numbro.languageData().currency.symbol = cNew;
		test.strictEqual(numbro.languageData().currency.symbol, cNew,
			'Current language currency is changed to ' + cNew);
		test.strictEqual(formatTestVal(), newCurrencyVal, 'Format uses new currency');

		numbro.languageData().currency.symbol = cOld;
		test.strictEqual(numbro.languageData().currency.symbol, '$', 'Current language currency is reset to ' + cOld);
		test.strictEqual(formatTestVal(), oldCurrencyVal, 'Format uses old currency');

		numbro.languageData('en-US').currency.symbol = cNew;
		test.strictEqual(numbro.languageData().currency.symbol, cNew,
			'English language currency is changed to ' + cNew);
		test.strictEqual(formatTestVal(), newCurrencyVal, 'Format uses new currency');

		numbro.languageData('en-US').currency.symbol = cOld;
		test.strictEqual(numbro.languageData().currency.symbol, cOld,
			'English language currency is reset to ' + cOld);
		test.strictEqual(formatTestVal(), oldCurrencyVal, 'Format uses old currency');

		test.done();
	},

	setLanguage: function(test) {
		numbro.language('fr-CA', {languageTag: 'fr-CA'});

		numbro.setLanguage('fr-CA');
		test.strictEqual(numbro.language(), 'fr-CA', 'Current language is Québec french');

		numbro.setLanguage('fr-NOT_EXISTING');
		test.strictEqual(numbro.language(), 'fr-CA', 'Current language is Québec french');

		numbro.setLanguage('NOT_EXISTING', 'fr-FR');
		test.strictEqual(numbro.language(), 'en-US', 'Current language fallbacks to american english as `fr-FR` doesn\'t match any existing language');

		numbro.language('fr-FR', {languageTag: 'fr-FR'});

		numbro.setLanguage('NOT_EXISTING', 'fr-FR');
		test.strictEqual(numbro.language(), 'fr-FR', 'Current language fallbacks to french');

		numbro.setLanguage('NOT_EXISTING');
		test.strictEqual(numbro.language(), 'en-US', 'Current language fallbacks to american english');

		// Teardown
		numbro.setLanguage('en-US');
		test.done();
	}
};
