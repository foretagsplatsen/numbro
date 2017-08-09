/*!
 * numbro.js language configuration
 * language : Hungarian
 * locale: Hungary
 * author : Peter Bakondy : https://github.com/pbakondy
 */

module.exports = {
    langLocaleCode: "hu-HU",
    cultureCode: "hu-HU",
    delimiters: {
        thousands: " ",
        decimal: ","
    },
    abbreviations: {
        thousand: "E", // ezer
        million: "M", // millió
        billion: "Mrd", // milliárd
        trillion: "T" // trillió
    },
    ordinal: function() {
        return ".";
    },
    currency: {
        symbol: " Ft",
        position: "postfix",
        code: "HUF"
    },
    defaults: {
        currencyFormat: ",4 a"
    },
    formats: {
        fourDigits: "4 a",
        fullWithTwoDecimals: ",0.00 $",
        fullWithTwoDecimalsNoCurrency: ",0.00",
        fullWithNoDecimals: ",0 $"
    }
};
