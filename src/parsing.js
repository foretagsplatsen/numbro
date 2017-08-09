/*!
 * parsing.js
 * version : 2.0.0
 * author : Benjamin Van Ryseghem
 * license : MIT
 * https://benjamin.vanryseghem.com
 */

// Todo: implement
// eslint-disable-next-line no-unused-vars
function parseOutput(string, result) {
    if (string.indexOf("$") !== -1) {
        result.output = "currency";
        return;
    }

    if (string.indexOf("%") !== -1) {
        result.output = "percent";
        return;
    }

    if (string.indexOf("%") !== -1) {
        result.output = "percent";
        return;
    }
}

function parseFormat(string) {
    let result = {};

    parseOutput(string, result);

    return result;
}

module.exports = {
    parseFormat
};
