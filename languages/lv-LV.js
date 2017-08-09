/*!
 * numbro.js language configuration
 * language : Latvian
 * locale: Latvia
 * author : Lauris Bukšis-Haberkorns : https://github.com/Lafriks
 */

module.exports = {
    langLocaleCode: "lv-LV",
    cultureCode: "lv-LV",
    delimiters: {
        thousands: " ",
        decimal: ","
    },
    abbreviations: {
        thousand: " tūkst.",
        million: " milj.",
        billion: " mljrd.",
        trillion: " trilj."
    },
    ordinal: function() {
        return ".";
    },
    currency: {
        symbol: "€",
        position: "postfix",
        code: "EUR"
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
