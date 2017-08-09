/*!
 * numeral.js language configuration
 * language : Romanian
 * author : Andrei Alecu https://github.com/andreialecu
 */

module.exports = {
    langLocaleCode: "ro-RO",
    cultureCode: "ro-RO",
    delimiters: {
        thousands: ".",
        decimal: ","
    },
    abbreviations: {
        thousand: "mii",
        million: "mil",
        billion: "mld",
        trillion: "bln"
    },
    ordinal: function() {
        return ".";
    },
    currency: {
        symbol: " lei",
        position: "postfix",
        code: "RON"
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
