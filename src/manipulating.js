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

// Todo: add BigNumber support (https://github.com/MikeMcl/bignumber.js/)

function multiplier(x) {
    let parts = x.toString().split(".");
    let mantissa = parts[1];

    if (!mantissa) {
        return 1;
    }

    return Math.pow(10, mantissa.length);
}

function correctionFactor(...args) {
    let smaller = args.reduce((prev, next) => {
        let mp = multiplier(prev);
        let mn = multiplier(next);
        return mp > mn ? prev : next;
    }, -Infinity);

    return multiplier(smaller);
}

function add(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    let factor = correctionFactor(n._value, value);

    function callback(acc, number) {
        return acc + factor * number;
    }

    n._value = [n._value, value].reduce(callback, 0) / factor;
    return n;
}

function subtract(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    let factor = correctionFactor(n._value, value);

    function callback(acc, number) {
        return acc - factor * number;
    }

    n._value = [value].reduce(callback, n._value * factor) / factor;
    return n;
}

function multiply(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    function callback(accum, curr) {
        let factor = correctionFactor(accum, curr);
        let result = accum * factor;
        result *= curr * factor;
        result /= factor * factor;

        return result;
    }

    n._value = [n._value, value].reduce(callback, 1);
    return n;
}

function divide(n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    function callback(accum, curr) {
        let factor = correctionFactor(accum, curr);
        return (accum * factor) / (curr * factor);
    }

    n._value = [n._value, value].reduce(callback);
    return n;
}

function set (n, other, numbro) {
    let value = other;

    if (numbro.isNumbro(other)) {
        value = other._value;
    }

    n._value = value;
    return n;
}

module.exports = numbro => ({
    add: (n, other) => add(n, other, numbro),
    subtract: (n, other) => subtract(n, other, numbro),
    multiply: (n, other) => multiply(n, other, numbro),
    divide: (n, other) => divide(n, other, numbro),
    set: (n, other) => set(n, other, numbro)
});
