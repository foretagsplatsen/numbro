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
            expect(formatNumbro).toHaveBeenCalledWith(instance, providedFormat);
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
        let formatTime = undefined;

        beforeEach(() => {
            formatTime = formattingModule.__get__("formatTime");
        });

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
                let result = formatTime(numbroStub(value));
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
    })
});
