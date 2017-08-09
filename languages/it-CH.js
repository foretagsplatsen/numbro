/*!
 * numbro.js language configuration
 * language : Italian
 * locale: Switzerland
 * author : Tim McIntosh (StayinFront NZ)
 */

module.exports = {
    langLocaleCode: "it-CH",
    cultureCode: "it-CH",
    delimiters: {
        thousands: "'",
        decimal: "."
    },
    abbreviations: {
        thousand: "mila",
        million: "mil",
        billion: "b",
        trillion: "t"
    },
    ordinal: function() {
        return "°";
    },
    currency: {
        symbol: "CHF",
        code: "CHF"
    }
};
