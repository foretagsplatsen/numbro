const rewire = require("rewire");
const globalState = rewire("../../src/globalState");

const enUS = require("../../src/en-US");

describe("globalState-tests", () => {
    describe("chooseLanguage", () => {
        let chooseLanguage = undefined;

        beforeEach(() => {
            chooseLanguage = globalState.__get__("chooseLanguage");
        });

        it("set the current tag property (with no check)", () => {
            chooseLanguage("fooboo");
            let currentTag = globalState.currentLanguage();
            expect(currentTag).toBe("fooboo");
        });
    });

    describe("languages", () => {
        it("returns the all the registered languages", () => {
            let result = globalState.languages();
            expect(result).toEqual({
                "en-US": enUS
            });
        });

        it("returns a copy to avoid spoiling", () => {
            let result = globalState.languages();
            result.foo = 34;
            let newResult = globalState.languages();

            expect(newResult).toEqual({
                "en-US": enUS
            });
        });
    });
});
