const enUS = require("../../src/en-US");

describe("en-US", () => {
    it("returns expected ordinal", () => {
        let data = [
            //[value, expectedOrdinal]
            [0, "th"],
            [1, "st"],
            [2, "nd"],
            [3, "rd"],
            [0, "th"],
            [11, "th"],
            [12, "th"],
            [13, "th"],
            [21, "st"],
            [22, "nd"],
            [23, "rd"]
        ];

        data.forEach(([value, expectedOrdinal]) => {
            let result = enUS.ordinal(value);
            expect(result).toBe(expectedOrdinal);
        });
    });
});
