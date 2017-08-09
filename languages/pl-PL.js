/*!
 * numbro.js language configuration
 * language : Polish
 * locale : Poland
 * author : Dominik Bulaj : https://github.com/dominikbulaj
 */

module.exports = {
    langLocaleCode: "pl-PL",
    cultureCode: "pl-PL",
    delimiters: {
        thousands: " ",
        decimal: ","
    },
    abbreviations: {
        thousand: "tys.",
        million: "mln",
        billion: "mld",
        trillion: "bln"
    },
    ordinal: () => ".",
    currency: {
        symbol: " zł",
        position: "postfix",
        code: "PLN"
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
