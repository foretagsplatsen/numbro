/*!
 * numbro.js language configuration
 * language : French
 * locale: Switzerland
 * author : Adam Draper : https://github.com/adamwdraper
 */

module.exports = {
    langLocaleCode: "fr-CH",
    cultureCode: "fr-CH",
    delimiters: {
        thousands: " ",
        decimal: "."
    },
    abbreviations: {
        thousand: "k",
        million: "m",
        billion: "b",
        trillion: "t"
    },
    ordinal: (number) => {
        return number === 1 ? "er" : "ème";
    },
    currency: {
        symbol: "CHF",
        position: "postfix",
        code: "CHF"
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
