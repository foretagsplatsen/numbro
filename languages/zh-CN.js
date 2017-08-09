/*!
 * numbro.js language configuration
 * language : simplified chinese
 * locale : China
 * author : badplum : https://github.com/badplum
 */

module.exports = {
    langLocaleCode: "zh-CN",
    cultureCode: "zh-CN",
    delimiters: {
        thousands: ",",
        decimal: "."
    },
    abbreviations: {
        thousand: "千",
        million: "百万",
        billion: "十亿",
        trillion: "兆"
    },
    ordinal: function() {
        return ".";
    },
    currency: {
        symbol: "¥",
        position: "prefix",
        code: "CNY"
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

