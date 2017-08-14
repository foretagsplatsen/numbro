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
const manipulatingModule = rewire("../../src/manipulating");
const manipulating = manipulatingModule(numbroStub);

function numbroStub(value) { return {_value: value}; }

describe("manipulating", () => {
    beforeEach(() => {
        numbroStub.isNumbro = jasmine.createSpy("isNumbro");
    });

    describe("multiplier", () => {
        let multiplier = undefined;

        beforeEach(() => {
            multiplier = manipulatingModule.__get__("multiplier");
        });

        it("returns multiplier to get rid of mantissa", () => {
            let data = [
                // [value, expectedOutput]
                [10, 1],
                [1, 1],
                [0.1, 10],
                [0.01, 100],
                [0.001, 1000],
                [0.0001, 10000]
            ];

            data.forEach(([value, expectedOutput]) => {
                let result = multiplier(value);
                expect(result).toBe(expectedOutput);
            });
        });
    });

    describe("correctionFactor", () => {
        let correctionFactor = undefined;

        beforeEach(() => {
            correctionFactor = manipulatingModule.__get__("correctionFactor");
        });

        it("returns the biggest multiplier", () => {
            let data = [
                // [value, expectedOutput]
                [[10, 1, 0.1], 10],
                [[0.1, 1, 10], 10]
            ];

            data.forEach(([args, expectedOutput]) => {
                let result = correctionFactor(...args);
                expect(result).toBe(expectedOutput);
            });
        });
    });

    describe("add", () => {
        it("works with numbers", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 1010],
                [0.5, 3, 3.5],
                [-100, 200, 100],
                [0.1, 0.2, 0.3]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                let instance = numbroStub(value);
                let result = manipulating.add(instance, other);
                expect(result._value).toBe(expectedOutput);
            });
        });

        it("works with numbro instances", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 1010],
                [0.5, 3, 3.5],
                [-100, 200, 100],
                [0.1, 0.2, 0.3]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                numbroStub.isNumbro.and.returnValue(true);
                let instance = numbroStub(value);
                let result = manipulating.add(instance, numbroStub(other));
                expect(result._value).toBe(expectedOutput);
            });
        });
    });

    describe("subtract", () => {
        it("works with numbers", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 990],
                [0.5, 3, -2.5],
                [-100, 200, -300],
                [0.3, 0.1, 0.2]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                let instance = numbroStub(value);
                let result = manipulating.subtract(instance, other);
                expect(result._value).toBe(expectedOutput);
            });
        });

        it("works with numbro instances", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 990],
                [0.5, 3, -2.5],
                [-100, 200, -300],
                [0.3, 0.1, 0.2]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                numbroStub.isNumbro.and.returnValue(true);
                let instance = numbroStub(value);
                let result = manipulating.subtract(instance, numbroStub(other));
                expect(result._value).toBe(expectedOutput);
            });
        });
    });

    describe("multiply", () => {
        it("works with numbers", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 10000],
                [0.5, 3, 1.5],
                [-100, 200, -20000],
                [0.1, 0.2, 0.02]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                let instance = numbroStub(value);
                let result = manipulating.multiply(instance, other);
                expect(result._value).toBe(expectedOutput);
            });
        });

        it("works with numbro instances", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 10000],
                [0.5, 3, 1.5],
                [-100, 200, -20000],
                [0.1, 0.2, 0.02]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                numbroStub.isNumbro.and.returnValue(true);
                let instance = numbroStub(value);
                let result = manipulating.multiply(instance, numbroStub(other));
                expect(result._value).toBe(expectedOutput);
            });
        });
    });

    describe("divide", () => {
        it("works with numbers", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 100],
                [0.5, 3, 0.16666666666666666],
                [-100, 200, -0.5],
                [5.3, 0.1, 53]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                let instance = numbroStub(value);
                let result = manipulating.divide(instance, other);
                expect(result._value).toBe(expectedOutput);
            });
        });

        it("works with numbro instances", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10, 100],
                [0.5, 3, 0.16666666666666666],
                [-100, 200, -0.5],
                [5.3, 0.1, 53]
            ];

            data.forEach(([value, other, expectedOutput]) => {
                numbroStub.isNumbro.and.returnValue(true);
                let instance = numbroStub(value);
                let result = manipulating.divide(instance, numbroStub(other));
                expect(result._value).toBe(expectedOutput);
            });
        });
    });

    describe("set", () => {
        it("works with numbers", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10],
                [0.5, 3],
                [-100, 200],
                [5.3, 0.1]
            ];

            data.forEach(([value, other]) => {
                let instance = numbroStub(value);
                let result = manipulating.set(instance, other);
                expect(result._value).toBe(other);
            });
        });

        it("works with numbro instances", () => {
            let data = [
                // [value, other, expectedOutput]
                [1000, 10],
                [0.5, 3],
                [-100, 200],
                [5.3, 0.1]
            ];

            data.forEach(([value, other]) => {
                numbroStub.isNumbro.and.returnValue(true);
                let instance = numbroStub(value);
                let result = manipulating.set(instance, numbroStub(other));
                expect(result._value).toBe(other);
            });
        });
    });
});
