/*!
 * numbro.js language configuration
 * language : French
 * locale: Canada
 * author : Léo Renaud-Allaire : https://github.com/renaudleo
 */

module.exports = {
    langLocaleCode: "fr-CA",
    cultureCode: "fr-CA",
    delimiters: {
        thousands: " ",
        decimal: ","
    },
    abbreviations: {
        thousand: "k",
        million: "M",
        billion: "G",
        trillion: "T"
    },
    ordinal: (number) => {
        return number === 1 ? "er" : "ème";
    },
    currency: {
        symbol: "$",
        position: "postfix",
        spaceSeparated: true,
        code: "USD"
    },
    defaults: {
        currencyFormat: ",4 a"
    },
    formats: {
        fourDigits: "4 a",
        fullWithTwoDecimals: "$ ,0.00",
        fullWithTwoDecimalsNoCurrency: ",0.00",
        fullWithNoDecimals: "$ ,0"
    }
};
