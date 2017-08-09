/*!
 * numbro.js language configuration
 * language : Turkish
 * locale : Turkey
 * author : Ecmel Ercan : https://github.com/ecmel,
 *          Erhan Gundogan : https://github.com/erhangundogan,
 *          Burak Yiğit Kaya: https://github.com/BYK
 */

const suffixes = {
    1: "'inci",
    5: "'inci",
    8: "'inci",
    70: "'inci",
    80: "'inci",

    2: "'nci",
    7: "'nci",
    20: "'nci",
    50: "'nci",

    3: "'üncü",
    4: "'üncü",
    100: "'üncü",

    6: "'ncı",

    9: "'uncu",
    10: "'uncu",
    30: "'uncu",

    60: "'ıncı",
    90: "'ıncı"
};

module.exports = {
    langLocaleCode: "tr-TR",
    cultureCode: "tr-TR",
    delimiters: {
        thousands: ".",
        decimal: ","
    },
    abbreviations: {
        thousand: "bin",
        million: "milyon",
        billion: "milyar",
        trillion: "trilyon"
    },
    ordinal: number => {
        // special case for zero
        if (number === 0) {
            return "'ıncı";
        }

        let a = number % 10;
        let b = number % 100 - a;
        let c = number >= 100 ? 100 : null;

        return suffixes[a] || suffixes[b] || suffixes[c];
    },
    currency: {
        symbol: "\u20BA",
        position: "postfix",
        code: "TRY"
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
