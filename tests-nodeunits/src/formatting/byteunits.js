const numbro = require("../../../src/numbro");

exports.byteUnits = {
	binaryBytes: function(test) {
        let power = exp => Math.pow(1024, exp);
        let tests = [
            [0, "B"],
            [0.5, "B"],
            [100, "B"],
            [1023.9, "B"],
            [1024, "KiB"],
            [power(1) * 2, "KiB"],
            [power(2) * 5, "MiB"],
            [power(3) * 7.343, "GiB"],
            [power(4) * 3.1536544, "TiB"],
            [power(5) * 2.953454534534, "PiB"],
            [power(6), "EiB"],
            [power(7), "ZiB"],
            [power(8), "YiB"],
            [power(9), "YiB"], // note: it's 1024 YiB
            [power(10), "YiB"] // 1024^2 YiB
        ].reduce((acc, current) => {
            acc.push(current);
            acc.push([-current[0], current[1]]);
            return acc;
        }, []);

		test.expect(tests.length);

        for (let i = 0; i < tests.length; ++i) {
            test.strictEqual(numbro(tests[i][0]).binaryByteUnits(), tests[i][1], `${tests[i][0]} ${tests[i][1]}`);
		}

		test.done();
	},

	bytes: function(test) {
        function power(exp) { return Math.pow(1024, exp); }

        let tests = [
            [0, "B"],
            [0.5, "B"],
            [100, "B"],
            [1023.9, "B"],
            [1024, "KB"],
            [power(1) * 2, "KB"],
            [power(2) * 5, "MB"],
            [power(3) * 7.343, "GB"],
            [power(4) * 3.1536544, "TB"],
            [power(5) * 2.953454534534, "PB"],
            [power(6), "EB"],
            [power(7), "ZB"],
            [power(8), "YB"],
            [power(9), "YB"], // note: it's 1024 YB
            [power(10), "YB"] // 1024^2 YB
        ].reduce((acc, current) => {
            acc.push(current);
            acc.push([-current[0], current[1]]);
            return acc;
        }, []);

		test.expect(tests.length);

        for (let i = 0; i < tests.length; ++i) {
            test.strictEqual(numbro(tests[i][0]).byteUnits(), tests[i][1], `${tests[i][0]} ${tests[i][1]}`);
		}

		test.done();
	},

	decimalBytes: function(test) {
        let power = exp => Math.pow(1000, exp);
        let tests = [
            [0, "B"],
            [0.5, "B"],
            [100, "B"],
            [999.9, "B"],
            [1000, "KB"],
            [power(1) * 2, "KB"],
            [power(2) * 5, "MB"],
            [power(3) * 7.343, "GB"],
            [power(4) * 3.1536544, "TB"],
            [power(5) * 2.953454534534, "PB"],
            [power(6), "EB"],
            [power(7), "ZB"],
            [power(8), "YB"],
            [power(9), "YB"], // note: it's 1000 YB
            [power(10), "YB"] // 1000^2 YB
        ].reduce((acc, current) => {
            acc.push(current);
            acc.push([-current[0], current[1]]);
            return acc;
        }, []);

		test.expect(tests.length);

        for (let i = 0; i < tests.length; ++i) {
            test.strictEqual(numbro(tests[i][0]).decimalByteUnits(), tests[i][1], `${tests[i][0]} ${tests[i][1]}`);
		}

		test.done();
	}
};
