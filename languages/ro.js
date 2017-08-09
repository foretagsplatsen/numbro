/*!
 * numbro.js language configuration
 * language : Romanian (ro)
 * author : Tim McIntosh (StayinFront NZ)
 */

module.exports = {
    langLocaleCode: "ro",
    cultureCode: "ro",
    delimiters: {
        thousands: ".",
        decimal: ","
    },
    abbreviations: {
        thousand: "mie",
        million: "mln",
        billion: "mld",
        trillion: "t"
    },
    ordinal: function() {
        return ".";
    },
    currency: {
        symbol: "RON",
        code: "RON"
    }
};
