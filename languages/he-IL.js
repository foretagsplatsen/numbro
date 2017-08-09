/*!
 * numbro.js language configuration
 * language : Hebrew
 * locale : IL
 * author : Eli Zehavi : https://github.com/eli-zehavi
 */

module.exports = {
    langLocaleCode: "he-IL",
    cultureCode: "he-IL",
    delimiters: {
        thousands: ",",
        decimal: "."
    },
    abbreviations: {
        thousand: "אלף",
        million: "מליון",
        billion: "בליון",
        trillion: "טריליון"
    },
    currency: {
        symbol: "₪",
        position: "prefix",
        code: "ILS"
    },
    defaults: {
        currencyFormat: ",4 a"
    },
    formats: {
        fourDigits: "4 a",
        fullWithTwoDecimals: "₪ ,0.00",
        fullWithTwoDecimalsNoCurrency: ",0.00",
        fullWithNoDecimals: "₪ ,0"
    }
};
