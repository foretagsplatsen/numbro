/*!
 * numbro.js language configuration
 * language : Bulgarian
 * author : Tim McIntosh (StayinFront NZ)
 */

module.exports = {
    langLocaleCode: "bg",
    cultureCode: "bg",
    delimiters: {
        thousands: " ",
        decimal: ","
    },
    abbreviations: {
        thousand: "И",
        million: "А",
        billion: "M",
        trillion: "T"
    },
    ordinal: function() {
        return ".";
    },
    currency: {
        symbol: "лв.",
        code: "BGN"
    }
};
