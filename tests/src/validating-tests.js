const rewire = require("rewire");
const validating = rewire("../../src/validating");

describe("validatingSpec", () => {
    describe("validate", () => {
        let validateInput = undefined;
        let validateFormat = undefined;
        let revert = undefined;

        beforeEach(() => {
            validateInput = jasmine.createSpy("validateInput");
            validateFormat = jasmine.createSpy("validateFormat");
            revert = validating.__set__({validateFormat, validateInput});
        });

        afterEach(() => {
            revert();
        });

        it("validates the input and the format", () => {
            let input = jasmine.createSpy("input");
            let format = jasmine.createSpy("format");
            validating.validate(input, format);

            expect(validateInput).toHaveBeenCalledWith(input);
            expect(validateFormat).toHaveBeenCalledWith(format);
        });

        it("is valid when input AND format are valid", () => {
            validateInput.and.returnValue(true);
            validateFormat.and.returnValue(true);
            let result = validating.validate();
            expect(result).toBeTruthy();
        });

        it("is invalid when input is valid", () => {
            validateInput.and.returnValue(false);
            validateFormat.and.returnValue(true);
            let result = validating.validate();
            expect(result).toBeFalsy();
        });

        it("is invalid when format is valid", () => {
            validateInput.and.returnValue(true);
            validateFormat.and.returnValue(false);
            let result = validating.validate();
            expect(result).toBeFalsy();
        });
    });

    describe("validateFormat", () => {
        let error = undefined;
        let revert = undefined;

        beforeEach(() => {
            error = jasmine.createSpy("error");
            revert = validating.__set__({
                console: {error}
            });
        });

        afterEach(() => {
            revert();
        });

        it("validates valid formats", () => {
            let data = [
                // format
                {prefix: "foo"},
                {mantissa: 3},
                {totalLength: 3}
            ];

            data.forEach((format) => {
                let result = validating.validateFormat(format);
                expect(result).toBeTruthy();
            });
        });

        it("invalidates invalid formats", () => {
            let data = [
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
                ],
                [
                    {
                        characteristic: -2
                    },
                    "[Validate format] characteristic invalid value: value must be positive"
                ], [
                    {
                        mantissa: -2
                    },
                    "[Validate format] mantissa invalid value: value must be positive"
                ], [
                    {
                        totalLength: -2
                    },
                    "[Validate format] totalLength invalid value: value must be positive"
                ],
                [
                    {
                        output: "lapin"
                    },
                    "[Validate format] output invalid value: must be among [\"currency\",\"percent\",\"byte\",\"time\",\"ordinal\",\"number\"], \"lapin\" provided"
                ]
            ];

            data.forEach(([format, errorMessage]) => {
                let result = validating.validateFormat(format);
                expect(result).toBeFalsy();
                expect(error.calls.mostRecent().args[0]).toBe(errorMessage);
            });
        });
    });

    // Todo
    describe("validateInput", () => {
        it("is dummy", () => {
            expect(validating.validateInput()).toBeTruthy();
        });
    });

});
