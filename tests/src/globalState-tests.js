/*!
 * Copyright (c) 2017 Benjamin Van Ryseghem<benjamin@vanryseghem.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
