const rewire = require("rewire");
const parsing = rewire("../../src/parsing");

describe("parsing", () => {
    describe("parseFormat", () => {
        it("looks for the output", () => {
            let input = jasmine.createSpy("input");
            let result = jasmine.createSpy("result");
            let parseOutput = jasmine.createSpy("parseOutput");
            let revert = parsing.__set__({parseOutput});

            try {
                parsing.parseFormat(input, result);
                expect(parseOutput).toHaveBeenCalledWith(input, result);
            } finally {
                revert();
            }
        });
    });
    describe("output", () => {
        let parseOutput = undefined;

        beforeEach(() => {
            parseOutput = parsing.__get__("parseOutput");
        });

        it("detects currency", () => {
            let result = {};
            parseOutput("$", result);
            expect(result.output).toBe("currency");
        });

        it("detects percent", () => {
            let result = {};
            parseOutput("%", result);
            expect(result.output).toBe("percent");
        });

        it("detects general byte", () => {
            let result = {};
            parseOutput("bd", result);
            expect(result.output).toBe("byte");
            expect(result.base).toBe("general");
        });

        it("detects binary byte", () => {
            let result = {};
            parseOutput("b", result);
            expect(result.output).toBe("byte");
            expect(result.base).toBe("binary");
        });

        it("detects decimal byte", () => {
            let result = {};
            parseOutput("d", result);
            expect(result.output).toBe("byte");
            expect(result.base).toBe("decimal");
        });

        it("detects time", () => {
            let result = {};
            parseOutput(":", result);
            expect(result.output).toBe("time");
        });

        it("detects ordinal", () => {
            let result = {};
            parseOutput("o", result);
            expect(result.output).toBe("ordinal");
        });

        it("leaves the output unset otherwise", () => {
            let result = {};
            parseOutput("", result);
            expect(result.output).toBe(undefined);
        });
    });
});
