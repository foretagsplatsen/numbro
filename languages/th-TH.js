/*!
 * numbro.js language configuration
 * language : Thai
 * locale : Thailand
 * author : Sathit Jittanupat : https://github.com/jojosati
 */

module.exports = {
    langLocaleCode: "th-TH",
    cultureCode: "th-TH",
    delimiters: {
        thousands: ",",
        decimal: "."
    },
    abbreviations: {
        thousand: "พัน",
        million: "ล้าน",
        billion: "พันล้าน",
        trillion: "ล้านล้าน"
    },
    ordinal: function() {
        return ".";
    },
    currency: {
        symbol: "฿",
        position: "postfix",
        code: "THB"
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
