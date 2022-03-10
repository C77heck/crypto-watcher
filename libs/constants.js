const CONSTANTS = {
    REDIS: {
        CRYPTOS_TO_FOLLOW: 'cryptos-to-follow',
        CRYPTOS_FOR_SELECT: 'crypto-for-select',
        CRYPTO_FLUCTUATION: 'crypto-fluctuation',
        CRYPTO_PAGINATION: 'crypto-pagination',
        FAVOURITE_CRYPTOS: 'favourite-cryptos',
    },
    PAGINATION_VAL: 20,
    CURRENCY: 'HUF',
    TRANSACTION_FEE: (100 - 1.5) / 100,
    TAGS: {
        WEAK_BUY: 'weak buy',
        OKAY_BUY: 'okay buy',
        FAIRLY_GOOD_BUY: 'fairly good buy',
        VERY_GOOD_BUY: 'very good buy',
        WELL_BELOW: 'well below its median',
        EXCELLENT_SALE: 'excellent sale',
        VERY_GOOD_SALE: 'very good sale',
        GOOD_SALE: 'good sale',
        OKAY_SALE: 'okay sale',
        STEADY_PRICE: 'steady price',
        DECLINING: 'Declining state',
        INCLINING: 'Inclining state',
    }
}

exports.CONSTANTS = CONSTANTS;
