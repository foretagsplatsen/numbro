const rewire = require("rewire");
const validating = require("../../src/validating");

const formattingModule = rewire("../../src/formatting");
const numbroStub = (value) => {
    return {_value: value};
};
const formatting = formattingModule(numbroStub);

const globalState = require("../../src/globalState");

describe("formatting", () => {
    describe("format", () => {
        let revert = undefined;
        let formatNumbro = undefined;
        let insertPrefix = undefined;
        let insertPostfix = undefined;

        beforeEach(() => {
            formatNumbro = jasmine.createSpy("formatNumbro");
            insertPrefix = jasmine.createSpy("insertPrefix");
            insertPostfix = jasmine.createSpy("insertPostfix");
            revert = formattingModule.__set__({
                formatNumbro,
                insertPrefix,
                insertPostfix
            });
        });

        afterEach(() => {
            revert();
        });

        it("returns an error message when the provided format is invalid", () => {
            spyOn(validating, "validateFormat").and.returnValue(false);

            let result = formatting.format();
            expect(result).toMatch(/Error/i);
            expect(result).toMatch(/format/i);
        });

        it("delegates to formatNumbro when the provided format is valid", () => {
            spyOn(validating, "validateFormat").and.returnValue(true);
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");

            formatting.format(instance, providedFormat);
            expect(formatNumbro).toHaveBeenCalledWith(instance, providedFormat, numbroStub);
        });

        it("inserts the prefix when the provided format is valid", () => {
            spyOn(validating, "validateFormat").and.returnValue(true);
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.prefix = jasmine.createSpy("prefix");

            formatting.format(instance, providedFormat);
            expect(insertPrefix).toHaveBeenCalledWith(undefined, providedFormat.prefix);
        });

        it("set the prefix after formatting the number", () => {
            spyOn(validating, "validateFormat").and.returnValue(true);
            let output = jasmine.createSpy("output");
            formatNumbro.and.returnValue(output);

            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.prefix = jasmine.createSpy("prefix");

            formatting.format(instance, providedFormat);
            expect(insertPrefix).toHaveBeenCalledWith(output, providedFormat.prefix);
        });

        it("inserts the postfix when the provided format is valid", () => {
            spyOn(validating, "validateFormat").and.returnValue(true);
            let instance = {_value: 0};
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.postfix = jasmine.createSpy("postfix");

            formatting.format(instance, providedFormat);
            expect(insertPostfix).toHaveBeenCalledWith(undefined, providedFormat.postfix);
        });

        it("set the postfix after the prefix", () => {
            spyOn(validating, "validateFormat").and.returnValue(true);
            let output = jasmine.createSpy("output");
            insertPrefix.and.returnValue(output);

            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.postfix = jasmine.createSpy("postfix");

            formatting.format(instance, providedFormat);
            expect(insertPostfix).toHaveBeenCalledWith(output, providedFormat.postfix);
        });

        it("returns the last constructed output", () => {
            spyOn(validating, "validateFormat").and.returnValue(true);
            let output = jasmine.createSpy("output");
            insertPostfix.and.returnValue(output);

            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");

            let result = formatting.format(instance, providedFormat);
            expect(result).toBe(output);
        });
    });

    describe("formatNumbro", () => {
        let formatNumbro = undefined;
        let formatCurrency = undefined;
        let formatPercentage = undefined;
        let formatByte = undefined;
        let formatTime = undefined;
        let formatOrdinal = undefined;
        let formatNumber = undefined;
        let revert = undefined;

        beforeEach(() => {
            formatNumbro = formattingModule.__get__("formatNumbro");
            formatCurrency = jasmine.createSpy("formatCurrency");
            formatPercentage = jasmine.createSpy("formatPercentage");
            formatByte = jasmine.createSpy("formatByte");
            formatTime = jasmine.createSpy("formatTime");
            formatOrdinal = jasmine.createSpy("formatOrdinal");
            formatNumber = jasmine.createSpy("formatNumber");
            revert = formattingModule.__set__({
                formatByte,
                formatCurrency,
                formatPercentage,
                formatTime,
                formatOrdinal,
                formatNumber
            });
        });

        afterEach(() => {
            revert();
        });

        it("delegates the formatting of currency", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.output = "currency";

            formatNumbro(instance, providedFormat, numbroStub);

            expect(formatCurrency).toHaveBeenCalledWith(instance, providedFormat, globalState, numbroStub);
        });

        it("delegates the formatting of percent", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.output = "percent";

            formatNumbro(instance, providedFormat, numbroStub);

            expect(formatPercentage).toHaveBeenCalledWith(instance, providedFormat, globalState, numbroStub);
        });

        it("delegates the formatting of byte", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.output = "byte";

            formatNumbro(instance, providedFormat, numbroStub);

            expect(formatByte).toHaveBeenCalledWith(instance, providedFormat, globalState, numbroStub);
        });

        it("delegates the formatting of time", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.output = "time";

            formatNumbro(instance, providedFormat, numbroStub);

            expect(formatTime).toHaveBeenCalledWith(instance, providedFormat, globalState, numbroStub);
        });

        it("delegates the formatting of ordinal", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.output = "ordinal";

            formatNumbro(instance, providedFormat, numbroStub);

            expect(formatOrdinal).toHaveBeenCalledWith(instance, providedFormat, globalState, numbroStub);
        });

        it("delegates the formatting of number", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.output = "number";

            formatNumbro(instance, providedFormat, numbroStub);

            expect(formatNumber).toHaveBeenCalledWith(instance, providedFormat, globalState, numbroStub);
        });

        it("default to number", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            providedFormat.output = "";

            formatNumbro(instance, providedFormat, numbroStub);

            expect(formatNumber).toHaveBeenCalledWith(instance, providedFormat, globalState, numbroStub);
        });
    });

    describe("byte", () => {
        let bytes = undefined;

        beforeAll(() => {
            bytes = formattingModule.__get__("bytes");
        });

        describe("formatByte", () => {
            let formatByte = undefined;
            let getFormatByteUnits = undefined;
            let formatNumber = undefined;
            let revert = undefined;

            beforeEach(() => {
                formatByte = formattingModule.__get__("formatByte");
                getFormatByteUnits = jasmine.createSpy("getFormatByteUnits");
                formatNumber = jasmine.createSpy("formatNumber");
                revert = formattingModule.__set__({
                    getFormatByteUnits,
                    formatNumber
                });
            });

            afterEach(() => {
                revert();
            });

            it("calls formatNumber", () => {
                let format = {base: "general"};
                let value = jasmine.createSpy("value");
                let n = numbroStub(value);
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({});
                getFormatByteUnits.and.returnValue({});

                formatByte(n, format, state, numbroStub);

                expect(formatNumber).toHaveBeenCalledWith(jasmine.anything(), format, state, undefined, state.currentByteDefaults());
            });

            it("calls getFormatByteUnits with the byte suffixes when the base is `general`", () => {
                let format = {base: "general"};
                let value = jasmine.createSpy("value");
                let instance = numbroStub(value);
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({});
                getFormatByteUnits.and.returnValue({});

                formatByte(instance, format, state, numbroStub);

                expect(getFormatByteUnits).toHaveBeenCalledWith(value, bytes.general.suffixes, bytes.general.scale);
            });

            it("calls getFormatByteUnits with the binary byte suffixes when the base is `binary`", () => {
                let format = {base: "binary"};
                let value = jasmine.createSpy("value");
                let n = numbroStub(value);
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({});
                getFormatByteUnits.and.returnValue({});

                formatByte(n, format, state, numbroStub);

                expect(getFormatByteUnits).toHaveBeenCalledWith(value, bytes.binary.suffixes, bytes.binary.scale);
            });

            it("calls getFormatByteUnits with the decimal byte suffixes when the base is `decimal`", () => {
                let format = {base: "decimal"};
                let value = jasmine.createSpy("value");
                let n = numbroStub(value);
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({});
                getFormatByteUnits.and.returnValue({});

                formatByte(n, format, state, numbroStub);

                expect(getFormatByteUnits).toHaveBeenCalledWith(value, bytes.decimal.suffixes, bytes.decimal.scale);
            });

            it("calls getFormatByteUnits with the binary byte suffixes by default", () => {
                let format = {base: undefined};
                let value = jasmine.createSpy("value");
                let n = numbroStub(value);
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({});
                getFormatByteUnits.and.returnValue({});

                formatByte(n, format, state, numbroStub);

                expect(getFormatByteUnits).toHaveBeenCalledWith(value, bytes.binary.suffixes, bytes.binary.scale);
            });

            it("separates the suffix with a space when `spaced` flag is true", () => {
                let instance = jasmine.createSpy("instance");
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({spaced: true});
                getFormatByteUnits.and.returnValue({suffix: "B"});
                formatNumber.and.returnValue("2");

                let result = formatByte(instance, {}, state, numbroStub);
                expect(result).toMatch(/ /);
            });

            it("does not separate the suffix with a space when `spaced` flag is false", () => {
                let instance = jasmine.createSpy("instance");
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({spaced: false});
                getFormatByteUnits.and.returnValue({suffix: "B"});
                formatNumber.and.returnValue("2");

                let result = formatByte(instance, {}, state, numbroStub);
                expect(result).not.toMatch(/ /);
            });

            it("appends the suffix at the end", () => {
                let instance = jasmine.createSpy("instance");
                let state = jasmine.createSpyObj("state", ["currentByteDefaults", "currentAbbreviations"]);
                state.currentAbbreviations.and.returnValue({});
                getFormatByteUnits.and.returnValue({suffix: "B"});
                formatNumber.and.returnValue("2");

                let result = formatByte(instance, {}, state, numbroStub);
                expect(result).toMatch(/B$/);
            });
        });

        describe("getBinaryByteUnit", () => {
            it("computes the binary byte suffix correctly", () => {
                let power = exp => Math.pow(1024, exp);
                let data = [
                    [0, "B"],
                    [-0, "B"],
                    [0.5, "B"],
                    [-0.5, "B"],
                    [100, "B"],
                    [-100, "B"],
                    [1023.9, "B"],
                    [-1023.9, "B"],
                    [1024, "KiB"],
                    [-1024, "KiB"],
                    [power(1) * 2, "KiB"],
                    [-power(1) * 2, "KiB"],
                    [power(2) * 5, "MiB"],
                    [-power(2) * 5, "MiB"],
                    [power(3) * 7.343, "GiB"],
                    [-power(3) * 7.343, "GiB"],
                    [power(4) * 3.1536544, "TiB"],
                    [-power(4) * 3.1536544, "TiB"],
                    [power(5) * 2.953454534534, "PiB"],
                    [-power(5) * 2.953454534534, "PiB"],
                    [power(6), "EiB"],
                    [-power(6), "EiB"],
                    [power(7), "ZiB"],
                    [-power(7), "ZiB"],
                    [power(8), "YiB"],
                    [-power(8), "YiB"],
                    [power(9), "YiB"], // note: it's 1024 YiB
                    [-power(9), "YiB"], // note: it's 1024 YiB
                    [power(10), "YiB"], // 1024^2 YiB
                    [-power(10), "YiB"] // 1024^2 YiB
                ];

                data.forEach(([value, expectedSuffix]) => {
                    let number = {_value: value};
                    let suffix = formatting.getBinaryByteUnit(number);
                    expect(suffix).toBe(expectedSuffix);
                });
            });
        });

        describe("getByteUnit", () => {
            it("computes the byte suffix correctly", () => {
                let power = exp => Math.pow(1024, exp);
                let data = [
                    [0, "B"],
                    [-0, "B"],
                    [0.5, "B"],
                    [-0.5, "B"],
                    [100, "B"],
                    [-100, "B"],
                    [1023.9, "B"],
                    [-1023.9, "B"],
                    [1024, "KB"],
                    [-1024, "KB"],
                    [power(1) * 2, "KB"],
                    [-power(1) * 2, "KB"],
                    [power(2) * 5, "MB"],
                    [-power(2) * 5, "MB"],
                    [power(3) * 7.343, "GB"],
                    [-power(3) * 7.343, "GB"],
                    [power(4) * 3.1536544, "TB"],
                    [-power(4) * 3.1536544, "TB"],
                    [power(5) * 2.953454534534, "PB"],
                    [-power(5) * 2.953454534534, "PB"],
                    [power(6), "EB"],
                    [-power(6), "EB"],
                    [power(7), "ZB"],
                    [-power(7), "ZB"],
                    [power(8), "YB"],
                    [-power(8), "YB"],
                    [power(9), "YB"], // note: it's 1024 YB
                    [-power(9), "YB"], // note: it's 1024 YB
                    [power(10), "YB"], // 1024^2 YB
                    [-power(10), "YB"] // 1024^2 YB
                ];

                data.forEach(([value, expectedSuffix]) => {
                    let number = {_value: value};
                    let suffix = formatting.getByteUnit(number);
                    expect(suffix).toBe(expectedSuffix);
                });
            });
        });

        describe("getDecimalByteUnit", () => {
            it("computes the decimal byte suffix correctly", () => {
                let power = exp => Math.pow(1000, exp);
                let data = [
                    [0, "B"],
                    [-0, "B"],
                    [0.5, "B"],
                    [-0.5, "B"],
                    [100, "B"],
                    [-100, "B"],
                    [999.9, "B"],
                    [-999.9, "B"],
                    [1000, "KB"],
                    [-1000, "KB"],
                    [power(1) * 2, "KB"],
                    [-power(1) * 2, "KB"],
                    [power(2) * 5, "MB"],
                    [-power(2) * 5, "MB"],
                    [power(3) * 7.343, "GB"],
                    [-power(3) * 7.343, "GB"],
                    [power(4) * 3.1536544, "TB"],
                    [-power(4) * 3.1536544, "TB"],
                    [power(5) * 2.953454534534, "PB"],
                    [-power(5) * 2.953454534534, "PB"],
                    [power(6), "EB"],
                    [-power(6), "EB"],
                    [power(7), "ZB"],
                    [-power(7), "ZB"],
                    [power(8), "YB"],
                    [-power(8), "YB"],
                    [power(9), "YB"], // note: it's 1024 YB
                    [-power(9), "YB"], // note: it's 1024 YB
                    [power(10), "YB"], // 1024^2 YB
                    [-power(10), "YB"] // 1024^2 YB
                ];

                data.forEach(([value, expectedSuffix]) => {
                    let number = {_value: value};
                    let suffix = formatting.getDecimalByteUnit(number);
                    expect(suffix).toBe(expectedSuffix);
                });
            });
        });

        describe("getFormatByteUnits", () => {
            let getFormatByteUnits = undefined;

            beforeEach(() => {
                getFormatByteUnits = formattingModule.__get__("getFormatByteUnits");
            });

            it("computes binary byte units correctly", () => {
                let data = [
                    // [value, result]
                    [Math.pow(2, 10), {value: 1, suffix: "KiB"}],
                    [2 * Math.pow(2, 10), {value: 2, suffix: "KiB"}],
                    [Math.pow(2, 20), {value: 1, suffix: "MiB"}],
                    [Math.pow(2, 30), {value: 1, suffix: "GiB"}],
                    [Math.pow(2, 40), {value: 1, suffix: "TiB"}]
                ];

                data.forEach(([number, expectedOutput]) => {
                    let {value, suffix} = getFormatByteUnits(number, bytes.binary.suffixes, bytes.binary.scale);
                    expect(value).toBe(expectedOutput.value);
                    expect(suffix).toBe(expectedOutput.suffix);
                });
            });

            it("computes byte units correctly", () => {
                let data = [
                    // [value, result]
                    [Math.pow(2, 10), {value: 1, suffix: "KB"}],
                    [2 * Math.pow(2, 10), {value: 2, suffix: "KB"}],
                    [Math.pow(2, 20), {value: 1, suffix: "MB"}],
                    [Math.pow(2, 30), {value: 1, suffix: "GB"}],
                    [Math.pow(2, 40), {value: 1, suffix: "TB"}]
                ];

                data.forEach(([number, expectedOutput]) => {
                    let {value, suffix} = getFormatByteUnits(number, bytes.general.suffixes, bytes.general.scale);
                    expect(value).toBe(expectedOutput.value);
                    expect(suffix).toBe(expectedOutput.suffix);
                });
            });

            it("computes decimal byte units correctly", () => {
                let data = [
                    // [[value, format], result]
                    [Math.pow(10, 3), {value: 1, suffix: "KB"}],
                    [2 * Math.pow(10, 3), {value: 2, suffix: "KB"}],
                    [Math.pow(10, 6), {value: 1, suffix: "MB"}],
                    [Math.pow(10, 9), {value: 1, suffix: "GB"}],
                    [Math.pow(10, 12), {value: 1, suffix: "TB"}]
                ];

                data.forEach(([number, expectedOutput]) => {
                    let {value, suffix} = getFormatByteUnits(number, bytes.decimal.suffixes, bytes.decimal.scale);
                    expect(value).toBe(expectedOutput.value);
                    expect(suffix).toBe(expectedOutput.suffix);
                });
            });
        });
    });

    describe("formatOrdinal", () => {
        let formatOrdinal = undefined;
        let formatNumber = undefined;
        let revert = undefined;

        beforeEach(() => {
            formatNumber = jasmine.createSpy("formatNumber");
            formatOrdinal = formattingModule.__get__("formatOrdinal");
            revert = formattingModule.__set__({formatNumber});
        });

        afterEach(() => {
            revert();
        });

        it("calls formatNumber", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let ordinalFn = jasmine.createSpy("ordinalFn");
            let instance = numbroStub(value);
            let state = jasmine.createSpyObj("state", ["currentOrdinal", "currentAbbreviations", "currentOrdinalDefaults"]);
            state.currentOrdinal.and.returnValue(ordinalFn);
            state.currentAbbreviations.and.returnValue({});

            formatOrdinal(instance, providedFormat, state, numbroStub);

            expect(formatNumber).toHaveBeenCalledWith(jasmine.anything(), providedFormat, state, undefined, state.currentOrdinalDefaults());
        });

        it("calls the ordinal function with the provided value", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let ordinalFn = jasmine.createSpy("ordinalFn");

            let state = jasmine.createSpyObj("state", ["currentOrdinal", "currentAbbreviations", "currentOrdinalDefaults"]);
            state.currentOrdinal.and.returnValue(ordinalFn);
            state.currentAbbreviations.and.returnValue({});

            let instance = numbroStub(value);

            formatOrdinal(instance, providedFormat, state);

            expect(ordinalFn).toHaveBeenCalledWith(value);
        });

        it("separates the suffix with a space when `spaced` flag is true", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let ordinalFn = jasmine.createSpy("ordinalFn").and.returnValue("nd");

            let state = jasmine.createSpyObj("state", ["currentOrdinal", "currentAbbreviations", "currentOrdinalDefaults"]);
            state.currentOrdinal.and.returnValue(ordinalFn);
            state.currentAbbreviations.and.returnValue({spaced: true});

            formatNumber.and.returnValue("2");

            let instance = numbroStub(value);

            let result = formatOrdinal(instance, providedFormat, state);

            expect(ordinalFn).toHaveBeenCalledWith(value);
            expect(result).toMatch(/ /);
        });

        it("does not separate the suffix with a space when `spaced` flag is false", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let ordinalFn = jasmine.createSpy("ordinalFn").and.returnValue("nd");

            let state = jasmine.createSpyObj("state", ["currentOrdinal", "currentAbbreviations", "currentOrdinalDefaults"]);
            state.currentOrdinal.and.returnValue(ordinalFn);
            state.currentAbbreviations.and.returnValue({spaced: false});

            formatNumber.and.returnValue("2");

            let instance = numbroStub(value);

            let result = formatOrdinal(instance, providedFormat, state);

            expect(ordinalFn).toHaveBeenCalledWith(value);
            expect(result).not.toMatch(/ /);
        });

        it("appends the ordinal at the end", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let ordinalFn = jasmine.createSpy("ordinalFn").and.returnValue("nd");

            let state = jasmine.createSpyObj("state", ["currentOrdinal", "currentAbbreviations", "currentOrdinalDefaults"]);
            state.currentOrdinal.and.returnValue(ordinalFn);
            state.currentAbbreviations.and.returnValue({});

            formatNumber.and.returnValue("2");

            let instance = numbroStub(value);

            let result = formatOrdinal(instance, providedFormat, state);

            expect(ordinalFn).toHaveBeenCalledWith(value);
            expect(result).toMatch(/nd$/);
        });
    });

    describe("formatTime", () => {
        it("convert seconds to time", () => {
            let data = [
                // [value, result]
                [86400, "24:00:00"],
                [-86400, "-24:00:00"],
                [10, "0:00:10"],
                [610, "0:10:10"],
                [0, "0:00:00"]
            ];

            data.forEach(([value, expectedResult]) => {
                let result = formatting.formatTime(numbroStub(value));
                expect(result).toBe(expectedResult);
            });
        });
    });

    describe("formatPercent", () => {
        let formatPercentage = undefined;
        let formatNumber = undefined;
        let revert = undefined;

        beforeEach(() => {
            formatNumber = jasmine.createSpy("formatNumber");
            formatPercentage = formattingModule.__get__("formatPercentage");
            revert = formattingModule.__set__({formatNumber});
        });

        afterEach(() => {
            revert();
        });

        it("calls formatNumber", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let instance = numbroStub(value);
            let state = jasmine.createSpyObj("state", ["currentAbbreviations", "currentPercentageDefaults"]);
            state.currentAbbreviations.and.returnValue({});

            formatPercentage(instance, providedFormat, state, numbroStub);

            expect(formatNumber).toHaveBeenCalledWith(jasmine.anything(), providedFormat, state, undefined, state.currentPercentageDefaults());
        });

        it("separates the percent sign with a space when `spaced` flag is true", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let instance = numbroStub(value);
            let state = jasmine.createSpyObj("state", ["currentAbbreviations", "currentPercentageDefaults"]);
            state.currentAbbreviations.and.returnValue({spaced: true});

            let result = formatPercentage(instance, providedFormat, state, numbroStub);

            expect(result).toMatch(/ /);
        });

        it("does not separate the percent sign with a space when `spaced` flag is false", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let instance = numbroStub(value);
            let state = jasmine.createSpyObj("state", ["currentAbbreviations", "currentPercentageDefaults"]);
            state.currentAbbreviations.and.returnValue({spaced: false});

            let result = formatPercentage(instance, providedFormat, state, numbroStub);

            expect(result).not.toMatch(/ /);
        });

        it("appends the percent sign at the end", () => {
            let value = jasmine.createSpy("value");
            let providedFormat = jasmine.createSpy("providedFormat");
            let instance = numbroStub(value);
            let state = jasmine.createSpyObj("state", ["currentAbbreviations", "currentPercentageDefaults"]);
            state.currentAbbreviations.and.returnValue({});

            let result = formatPercentage(instance, providedFormat, state, numbroStub);

            expect(result).toMatch(/%$/);
        });
    });

    describe("formatCurrency", () => {
        let formatCurrency = undefined;
        let formatNumber = undefined;
        let revert = undefined;

        beforeEach(() => {
            formatCurrency = formattingModule.__get__("formatCurrency");
            formatNumber = jasmine.createSpy("formatNumber");
            revert = formattingModule.__set__({formatNumber});
        });

        afterEach(() => {
            revert();
        });

        it("calls formatNumber with decimal separator when `infix`", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            let state = jasmine.createSpyObj("state", ["currentCurrencyDefaults", "currentCurrency"]);
            state.currentCurrency.and.returnValue({
                position: "infix",
                symbol: "foo"
            });
            formatCurrency(instance, providedFormat, state);

            expect(formatNumber).toHaveBeenCalledWith(instance, providedFormat, state, "foo", state.currentCurrencyDefaults());
        });

        it("adds a space before and after the decimal separator when `infix`", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            let state = jasmine.createSpyObj("state", ["currentCurrencyDefaults", "currentCurrency"]);
            state.currentCurrency.and.returnValue({
                position: "infix",
                spaceSeparated: true,
                symbol: "foo"
            });
            formatCurrency(instance, providedFormat, state);

            expect(formatNumber).toHaveBeenCalledWith(instance, providedFormat, state, " foo ", state.currentCurrencyDefaults());
        });

        it("adds the currency symbol afterward when `prefix`", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            let state = jasmine.createSpyObj("state", ["currentCurrencyDefaults", "currentCurrency"]);
            state.currentCurrency.and.returnValue({
                position: "prefix",
                spaceSeparated: false,
                symbol: "foo"
            });
            formatNumber.and.returnValue("output");

            let result = formatCurrency(instance, providedFormat, state);
            expect(result).toBe("foooutput");
        });

        it("adds the currency symbol afterward with a space when `prefix`", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            let state = jasmine.createSpyObj("state", ["currentCurrencyDefaults", "currentCurrency"]);
            state.currentCurrency.and.returnValue({
                position: "prefix",
                spaceSeparated: true,
                symbol: "foo"
            });
            formatNumber.and.returnValue("output");

            let result = formatCurrency(instance, providedFormat, state);
            expect(result).toBe("foo output");
        });

        it("adds the currency symbol afterward when `postfix`", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            let state = jasmine.createSpyObj("state", ["currentCurrencyDefaults", "currentCurrency"]);
            state.currentCurrency.and.returnValue({
                position: "postfix",
                spaceSeparated: false,
                symbol: "foo"
            });
            formatNumber.and.returnValue("output");

            let result = formatCurrency(instance, providedFormat, state);
            expect(result).toBe("outputfoo");
        });

        it("adds the currency symbol afterward with a space when `postfix`", () => {
            let instance = jasmine.createSpy("instance");
            let providedFormat = jasmine.createSpy("providedFormat");
            let state = jasmine.createSpyObj("state", ["currentCurrencyDefaults", "currentCurrency"]);
            state.currentCurrency.and.returnValue({
                position: "postfix",
                spaceSeparated: true,
                symbol: "foo"
            });
            formatNumber.and.returnValue("output");

            let result = formatCurrency(instance, providedFormat, state);
            expect(result).toBe("output foo");
        });
    });

    describe("computeAverage", () => {
        let computeAverage = undefined;

        beforeEach(() => {
            computeAverage = formattingModule.__get__("computeAverage");
        });

        it("computes the correct values when not forcing a precision", () => {
            let state = jasmine.createSpyObj("state", ["currentAbbreviations"]);
            state.currentAbbreviations.and.returnValue({
                thousand: "K",
                million: "M",
                billion: "B",
                trillion: "T"
            });

            let data = [
                [
                    Math.pow(10, 0),
                    {
                        value: 1,
                        abbreviation: "",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 1),
                    {
                        value: 10,
                        abbreviation: "",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 2),
                    {
                        value: 100,
                        abbreviation: "",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 3),
                    {
                        value: 1,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 4),
                    {
                        value: 10,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 5),
                    {
                        value: 100,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 6),
                    {
                        value: 1,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 7),
                    {
                        value: 10,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 8),
                    {
                        value: 100,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 9),
                    {
                        value: 1,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 10),
                    {
                        value: 10,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 11),
                    {
                        value: 100,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 12),
                    {
                        value: 1,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 13),
                    {
                        value: 10,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 14),
                    {
                        value: 100,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 15),
                    {
                        value: 1000,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 16),
                    {
                        value: 10000,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 17),
                    {
                        value: 100000,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ]
            ];

            data.forEach(([value, expectedResult]) => {
                let result = computeAverage(value, undefined, state);
                expect(result).toEqual(expectedResult);
            });
        });

        it("computes the correct abbreviations when space separating", () => {
            let state = jasmine.createSpyObj("state", ["currentAbbreviations"]);
            state.currentAbbreviations.and.returnValue({
                thousand: "K",
                million: "M",
                billion: "B",
                trillion: "T",
                spaced: true
            });

            let data = [
                [
                    Math.pow(10, 0),
                    {
                        value: 1,
                        abbreviation: "",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 1),
                    {
                        value: 10,
                        abbreviation: "",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 2),
                    {
                        value: 100,
                        abbreviation: "",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 3),
                    {
                        value: 1,
                        abbreviation: " K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 4),
                    {
                        value: 10,
                        abbreviation: " K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 5),
                    {
                        value: 100,
                        abbreviation: " K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 6),
                    {
                        value: 1,
                        abbreviation: " M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 7),
                    {
                        value: 10,
                        abbreviation: " M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 8),
                    {
                        value: 100,
                        abbreviation: " M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 9),
                    {
                        value: 1,
                        abbreviation: " B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 10),
                    {
                        value: 10,
                        abbreviation: " B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 11),
                    {
                        value: 100,
                        abbreviation: " B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 12),
                    {
                        value: 1,
                        abbreviation: " T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 13),
                    {
                        value: 10,
                        abbreviation: " T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 14),
                    {
                        value: 100,
                        abbreviation: " T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 15),
                    {
                        value: 1000,
                        abbreviation: " T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 16),
                    {
                        value: 10000,
                        abbreviation: " T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 17),
                    {
                        value: 100000,
                        abbreviation: " T",
                        mantissaPrecision: -1
                    }
                ]
            ];

            data.forEach(([value, expectedResult]) => {
                let result = computeAverage(value, undefined, state);
                expect(result).toEqual(expectedResult);
            });
        });

        it("computes the correct values when forcing a thousand precision", () => {
            let state = jasmine.createSpyObj("state", ["currentAbbreviations"]);
            state.currentAbbreviations.and.returnValue({
                thousand: "K",
                million: "M",
                billion: "B",
                trillion: "T"
            });

            let data = [
                [
                    Math.pow(10, 0),
                    {
                        value: 0.001,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 1),
                    {
                        value: 0.01,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 2),
                    {
                        value: 0.1,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 3),
                    {
                        value: 1,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 4),
                    {
                        value: 10,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 5),
                    {
                        value: 100,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 6),
                    {
                        value: 1000,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 7),
                    {
                        value: 10000,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 8),
                    {
                        value: 100000,
                        abbreviation: "K",
                        mantissaPrecision: -1
                    }
                ]
            ];

            data.forEach(([value, expectedResult]) => {
                let result = computeAverage(value, "thousand", state);
                expect(result).toEqual(expectedResult);
            });
        });

        it("computes the correct values when forcing a million precision", () => {
            let state = jasmine.createSpyObj("state", ["currentAbbreviations"]);
            state.currentAbbreviations.and.returnValue({
                thousand: "K",
                million: "M",
                billion: "B",
                trillion: "T"
            });

            let data = [
                [
                    Math.pow(10, 3),
                    {
                        value: 0.001,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 4),
                    {
                        value: 0.01,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 5),
                    {
                        value: 0.1,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 6),
                    {
                        value: 1,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 7),
                    {
                        value: 10,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 8),
                    {
                        value: 100,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 9),
                    {
                        value: 1000,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 10),
                    {
                        value: 10000,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 11),
                    {
                        value: 100000,
                        abbreviation: "M",
                        mantissaPrecision: -1
                    }
                ]
            ];

            data.forEach(([value, expectedResult]) => {
                let result = computeAverage(value, "million", state);
                expect(result).toEqual(expectedResult);
            });
        });

        it("computes the correct values when forcing a billion precision", () => {
            let state = jasmine.createSpyObj("state", ["currentAbbreviations"]);
            state.currentAbbreviations.and.returnValue({
                thousand: "K",
                million: "M",
                billion: "B",
                trillion: "T"
            });

            let data = [
                [
                    Math.pow(10, 6),
                    {
                        value: 0.001,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 7),
                    {
                        value: 0.01,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 8),
                    {
                        value: 0.1,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 9),
                    {
                        value: 1,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 10),
                    {
                        value: 10,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 11),
                    {
                        value: 100,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 12),
                    {
                        value: 1000,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 13),
                    {
                        value: 10000,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 14),
                    {
                        value: 100000,
                        abbreviation: "B",
                        mantissaPrecision: -1
                    }
                ]
            ];

            data.forEach(([value, expectedResult]) => {
                let result = computeAverage(value, "billion", state);
                expect(result).toEqual(expectedResult);
            });
        });

        it("computes the correct values when forcing a trillion precision", () => {
            let state = jasmine.createSpyObj("state", ["currentAbbreviations"]);
            state.currentAbbreviations.and.returnValue({
                thousand: "K",
                million: "M",
                billion: "B",
                trillion: "T"
            });

            let data = [
                [
                    Math.pow(10, 9),
                    {
                        value: 0.001,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 10),
                    {
                        value: 0.01,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 11),
                    {
                        value: 0.1,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 12),
                    {
                        value: 1,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 13),
                    {
                        value: 10,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 14),
                    {
                        value: 100,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 15),
                    {
                        value: 1000,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 16),
                    {
                        value: 10000,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ],
                [
                    Math.pow(10, 17),
                    {
                        value: 100000,
                        abbreviation: "T",
                        mantissaPrecision: -1
                    }
                ]
            ];

            data.forEach(([value, expectedResult]) => {
                let result = computeAverage(value, "trillion", state);
                expect(result).toEqual(expectedResult);
            });
        });

        it("computes the correct mantissa precision", () => {
            let state = jasmine.createSpyObj("state", ["currentAbbreviations"]);
            state.currentAbbreviations.and.returnValue({
                thousand: "K",
                million: "M",
                billion: "B",
                trillion: "T"
            });

            let data = [
                [
                    1,
                    4,
                    {
                        value: 1,
                        abbreviation: "",
                        mantissaPrecision: 3
                    }
                ],
                [
                    10,
                    4,
                    {
                        value: 10,
                        abbreviation: "",
                        mantissaPrecision: 2
                    }
                ],
                [
                    100,
                    4,
                    {
                        value: 100,
                        abbreviation: "",
                        mantissaPrecision: 1
                    }
                ],
                [
                    1000,
                    4,
                    {
                        value: 1,
                        abbreviation: "K",
                        mantissaPrecision: 3
                    }
                ],
                [
                    10000,
                    4,
                    {
                        value: 10,
                        abbreviation: "K",
                        mantissaPrecision: 2
                    }
                ],
                [
                    1,
                    2,
                    {
                        value: 1,
                        abbreviation: "",
                        mantissaPrecision: 1
                    }
                ],
                [
                    10,
                    2,
                    {
                        value: 10,
                        abbreviation: "",
                        mantissaPrecision: 0
                    }
                ],
                [
                    100,
                    2,
                    {
                        value: 100,
                        abbreviation: "",
                        mantissaPrecision: 0
                    }
                ]
            ];

            data.forEach(([value, totalLength, expectedResult]) => {
                let result = computeAverage(value, undefined, state, totalLength);
                expect(result).toEqual(expectedResult);
            });
        });
    });

    describe("setMantissaPrecision", () => {
        let setMantissaPrecision = undefined;

        beforeEach(() => {
            setMantissaPrecision = formattingModule.__get__("setMantissaPrecision");
        });

        it("returns the value if the precision is `-1`", () => {
            let string = jasmine.createSpy("string");
            let value = jasmine.createSpyObj("value", ["toString"]);
            value.toString.and.returnValue(string);

            let result = setMantissaPrecision(value, undefined, -1);

            expect(result).toBe(string);
        });

        it("gives the correct mantissa length", () => {
            let data = [
                [12, 0, "12"],
                [12, 1, "12.0"],
                [12, 2, "12.00"],
                [12, 3, "12.000"],
                [12.345, 0, "12"],
                [12.345, 1, "12.3"],
                [12.345, 2, "12.34"],
                [12.345, 3, "12.345"],
                [12.345, 4, "12.3450"],
                [12.345, 5, "12.34500"]
            ];

            data.forEach(([value, precision, expectedResult]) => {
                let result = setMantissaPrecision(value, undefined, precision);
                expect(result).toBe(expectedResult);
            });
        });

        it("gives the correct mantissa length with optional matissa", () => {
            let data = [
                [12, 0, "12"],
                [12, 1, "12"],
                [12, 2, "12"],
                [12, 3, "12"],
                [12.345, 0, "12"],
                [12.345, 1, "12.3"],
                [12.345, 2, "12.34"],
                [12.345, 3, "12.345"],
                [12.345, 4, "12.3450"],
                [12.345, 5, "12.34500"]
            ];

            data.forEach(([value, precision, expectedResult]) => {
                let result = setMantissaPrecision(value, true, precision);
                expect(result).toBe(expectedResult);
            });
        });
    });

    describe("setCharacteristicPrecision", () => {
        let setCharacteristicPrecision = undefined;

        beforeEach(() => {
            setCharacteristicPrecision = formattingModule.__get__("setCharacteristicPrecision");
        });

        it("gives the correct characteristic length", () => {
            let data = [
                [12, 0, "12"],
                [12, 1, "12"],
                [12, 2, "12"],
                [12, 3, "012"],
                [12.345, 0, "12.345"],
                [12.345, 1, "12.345"],
                [12.345, 2, "12.345"],
                [12.345, 3, "012.345"],
                [12.345, 4, "0012.345"],
                [12.345, 5, "00012.345"]
            ];

            data.forEach(([value, precision, expectedResult]) => {
                let result = setCharacteristicPrecision(value, precision);
                expect(result).toBe(expectedResult);
            });
        });
    });

    describe("indexesOfGroupSpaces", () => {
        let indexesOfGroupSpaces = undefined;

        beforeEach(() => {
            indexesOfGroupSpaces = formattingModule.__get__("indexesOfGroupSpaces");
        });

        it("returns correct indexes", () => {
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
                [[11, 3], [2, 5, 8]],

                [[0, 4], []],
                [[1, 4], []],
                [[2, 4], []],
                [[3, 4], []],
                [[4, 4], []],
                [[5, 4], [1]],
                [[6, 4], [2]],
                [[7, 4], [3]],
                [[8, 4], [4]],
                [[9, 4], [1, 5]],
                [[10, 4], [2, 6]],
                [[11, 4], [3, 7]]
            ];

            data.forEach(([args, expectedResult]) => {
                let result = indexesOfGroupSpaces(...args);
                expect(result).toEqual(expectedResult);
            });
        });
    });

    describe("replaceDelimiters", () => {
        let replaceDelimiters = undefined;

        beforeEach(() => {
            replaceDelimiters = formattingModule.__get__("replaceDelimiters");
        });

        it("generates expected output", () => {
            let state = jasmine.createSpyObj("state", ["currentDelimiters"]);
            state.currentDelimiters.and.returnValue({
                thousands: ","
            });

            let data = [
                ["12.00", {thousandSeparated: false}, "T", "12T00"],
                ["12", {thousandSeparated: false}, "T", "12"],
                ["123456.00", {thousandSeparated: false}, "T", "123456T00"],
                ["123456789.00", {thousandSeparated: false}, "T", "123456789T00"],
                ["123456.00", {thousandSeparated: true}, "T", "123,456T00"],
                ["123456789.00", {thousandSeparated: true}, "T", "123,456,789T00"]
            ];

            data.forEach(([input, {thousandSeparated}, decimalSeparator, expectedValue]) => {
                let result = replaceDelimiters(input, thousandSeparated, state, decimalSeparator);
                expect(result).toBe(expectedValue);
            });
        });

        it("allows custom thousand grouping", () => {
            let state = jasmine.createSpyObj("state", ["currentDelimiters"]);
            state.currentDelimiters.and.returnValue({
                thousands: ",",
                thousandsSize: 2
            });

            let data = [
                ["123456.00", {thousandSeparated: true}, "T", "12,34,56T00"],
                ["123456789.00", {thousandSeparated: true}, "T", "1,23,45,67,89T00"]
            ];

            data.forEach(([input, {thousandSeparated}, decimalSeparator, expectedValue]) => {
                let result = replaceDelimiters(input, thousandSeparated, state, decimalSeparator);
                expect(result).toBe(expectedValue);
            });
        });

        it("defaults to `decimal` if no decimalSeparator provided", () => {
            let state = jasmine.createSpyObj("state", ["currentDelimiters"]);
            state.currentDelimiters.and.returnValue({
                thousands: ",",
                decimal: "W"
            });

            let data = [
                ["12.00", "12W00"],
                ["12", "12"]
            ];

            data.forEach(([input, expectedValue]) => {
                let result = replaceDelimiters(input, false, state);
                expect(result).toBe(expectedValue);
            });
        });
    });

    describe("insertAbbreviation", () => {
        let insertAbbreviation = undefined;

        beforeEach(() => {
            insertAbbreviation = formattingModule.__get__("insertAbbreviation");
        });

        it("appends abbreviation at the end", () => {
            let input = "foo";
            let abbreviation = "bar";

            let result = insertAbbreviation(input, abbreviation);
            expect(result).toBe("foobar");
        });
    });

    describe("insertSign", () => {
        let insertSign = undefined;

        beforeEach(() => {
            insertSign = formattingModule.__get__("insertSign");
        });

        it("appends `+` to positive numbers", () => {
            let result = insertSign("foo", 24);
            expect(result).toBe("+foo");
        });

        it("appends `+` to 0", () => {
            let result = insertSign("foo", 0);
            expect(result).toBe("+foo");
        });

        // We assume the minus sign comes from the fact that the value is negative. Might be a bit too naïve.
        it("does nothing to negative value with `sign` flag", () => {
            let result = insertSign("foo", -4, "sign");
            expect(result).toBe("foo");
        });

        // Remove first character assuming it's a `-`
        it("add parenthesis to negative value with `parenthesis` flag", () => {
            let result = insertSign("foo", -4, "parenthesis");
            expect(result).toBe("(oo)");
        });
    });

    describe("insertPrefix", () => {
        let insertPrefix = undefined;

        beforeEach(() => {
            insertPrefix = formattingModule.__get__("insertPrefix");
        });

        it("appends prefix at the beginning", () => {
            let input = "foo";
            let prefix = "bar";

            let result = insertPrefix(input, prefix);
            expect(result).toBe("barfoo");
        });
    });

    describe("insertPostfix", () => {
        let insertPostfix = undefined;

        beforeEach(() => {
            insertPostfix = formattingModule.__get__("insertPostfix");
        });

        it("appends postfix at the end", () => {
            let input = "foo";
            let postfix = "bar";

            let result = insertPostfix(input, postfix);
            expect(result).toBe("foobar");
        });

    });

    describe("formatNumber", () => {
        let formatNumber = undefined;
        let computeAverage = undefined;
        let setMantissaPrecision = undefined;
        let setCharacteristicPrecision = undefined;
        let replaceDelimiters = undefined;
        let insertAbbreviation = undefined;
        let insertSign = undefined;
        let revert = undefined;

        beforeEach(() => {
            computeAverage = jasmine.createSpy("computeAverage");
            setMantissaPrecision = jasmine.createSpy("setMantissaPrecision");
            setCharacteristicPrecision = jasmine.createSpy("setCharacteristicPrecision");
            replaceDelimiters = jasmine.createSpy("replaceDelimiters");
            insertAbbreviation = jasmine.createSpy("insertAbbreviation");
            insertSign = jasmine.createSpy("insertSign");
            formatNumber = formattingModule.__get__("formatNumber");
            revert = formattingModule.__set__({
                computeAverage,
                setMantissaPrecision,
                setCharacteristicPrecision,
                replaceDelimiters,
                insertAbbreviation,
                insertSign
            });

            computeAverage.and.returnValue({});
        });

        afterEach(() => {
            revert();
        });

        it("returns `zeroFormat` if existing when value is 0", () => {
            let instance = numbroStub(0);

            let zeroFormat = jasmine.createSpy("zeroFormat");
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "getZeroFormat"]);
            state.hasZeroFormat.and.returnValue(true);
            state.getZeroFormat.and.returnValue(zeroFormat);

            let result = formatNumber(instance, format, state, undefined, defaults);
            expect(result).toBe(zeroFormat);
        });

        it("returns `\"NaN\"` if the value is NaN", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat"]);

            let result = formatNumber(numbroStub(NaN), format, state, undefined, defaults);
            expect(result).toBe("NaN");

            result = formatNumber(numbroStub(Infinity), format, state, undefined, defaults);
            expect(result).toBe("Infinity");

            result = formatNumber(numbroStub(-Infinity), format, state, undefined, defaults);
            expect(result).toBe("-Infinity");
        });

        it("calls `computeAverage` when a total length is set", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});
            format.average = false;
            format.totalLength = 3;

            formatNumber(numbroStub(1), format, state, undefined, defaults);

            expect(computeAverage).toHaveBeenCalled();
            expect(insertAbbreviation).toHaveBeenCalled();
        });

        it("calls `computeAverage` and `insertAbbreviation` when the `average` flag is provided", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});
            format.average = true;

            formatNumber(numbroStub(1), format, state, undefined, defaults);

            expect(computeAverage).toHaveBeenCalled();
            expect(insertAbbreviation).toHaveBeenCalled();
        });

        it("doesn't call `computeAverage` when the `average` flag is not provided", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});
            format.average = undefined;

            formatNumber(numbroStub(1), format, state, undefined, defaults);

            expect(computeAverage).not.toHaveBeenCalled();
            expect(insertAbbreviation).not.toHaveBeenCalled();
        });

        it("set setMantissaPrecision according to `mantissa`", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});

            format.mantissa = jasmine.createSpy("mantissa");
            format.optionalMantissa = jasmine.createSpy("optionalMantissa");

            formatNumber(numbroStub(1), format, state, undefined, defaults);

            expect(setMantissaPrecision.calls.argsFor(0)[1]).toBe(format.optionalMantissa);
            expect(setMantissaPrecision.calls.argsFor(0)[2]).toBe(format.mantissa);
        });

        it("set setCharacteristicPrecision according to `characteristic`", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});

            format.characteristic = jasmine.createSpy("characteristic");

            formatNumber(numbroStub(1), format, state, undefined, defaults);

            expect(setCharacteristicPrecision.calls.argsFor(0)[1]).toBe(format.characteristic);
        });

        it("replaces the delimiters ", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});

            format.thousandSeparated = jasmine.createSpy("thousandSeparated");
            let decimalSeparator = jasmine.createSpy("characteristic");

            formatNumber(numbroStub(1), format, state, decimalSeparator, defaults);

            expect(replaceDelimiters.calls.argsFor(0)[1]).toBe(format.thousandSeparated);
            expect(replaceDelimiters.calls.argsFor(0)[3]).toBe(decimalSeparator);
        });

        it("inserts the sign for negative values", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});

            format.negative = jasmine.createSpy("negative");

            formatNumber(numbroStub(-1), format, state, undefined, defaults);

            expect(insertSign.calls.argsFor(0)[2]).toBe(format.negative);
        });

        it("doesn't insert the negative sign for positive value", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters"]);
            state.currentDelimiters.and.returnValue({});

            format.negative = jasmine.createSpy("negative");

            formatNumber(numbroStub(1), format, state, undefined, defaults);

            expect(insertSign).not.toHaveBeenCalled();
        });

        it("retrieves defaults from the state if none is provided", () => {
            let format = jasmine.createSpy("format");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters", "currentDefaults"]);
            state.currentDelimiters.and.returnValue({});
            state.currentDefaults.and.returnValue({});

            format.negative = jasmine.createSpy("negative");

            formatNumber(numbroStub(1), format, state, undefined, undefined);

            expect(state.currentDefaults).toHaveBeenCalled();
        });

        it("doesn't use state defaults when defaults are provided", () => {
            let format = jasmine.createSpy("format");
            let defaults = jasmine.createSpy("defaults");
            let state = jasmine.createSpyObj("state", ["hasZeroFormat", "currentDelimiters", "currentDefaults"]);
            state.currentDelimiters.and.returnValue({});
            state.currentDefaults.and.returnValue({});

            format.negative = jasmine.createSpy("negative");

            formatNumber(numbroStub(1), format, state, undefined, defaults);

            expect(state.currentDefaults).not.toHaveBeenCalled();
        });
    });

    describe("formatNumber computation", () => {
        let formatNumber = undefined;

        beforeEach(() => {
            formatNumber = formattingModule.__get__("formatNumber");
        });

        it("computes the correct output", () => {
            let data = [
                //[[value, format, state, decimalSeparator, defaults], expectedOutput]
                [
                    [
                        123456,
                        {
                            thousandSeparated: true,
                            totalLength: 2
                        },
                        globalState,
                        undefined,
                        undefined
                    ],
                    "123k"
                ],
                [
                    [
                        12,
                        {
                            thousandSeparated: true,
                            characteristic: 4
                        },
                        globalState,
                        undefined,
                        undefined
                    ],
                    "0,012"
                ],
                [
                    [
                        12,
                        {
                            totalLength: 4
                        },
                        globalState,
                        undefined,
                        undefined
                    ],
                    "12.00"
                ]
            ];

            data.forEach(([[value, format, state, decimalSeparator, defaults], expectedResult]) => {
                let result = formatNumber(numbroStub(value), format, state, decimalSeparator, defaults);
                expect(result).toBe(expectedResult);
            });
        });
    });
});
