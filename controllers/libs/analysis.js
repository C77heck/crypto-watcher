const {CONSTANTS} = require("../../libs/constants");
const tags = CONSTANTS.TAGS;

class Analysis {
    constructor(price) {
        this.tags = [];
        this.name = price.name;
        this.symbol = price.symbol;
        this.price = price.price;
        this.identifier = price.identifier;
        this.priceChangeLastHour = this.calc(price, 'percentChangeLastHour');
        this.priceChangeLastDay = this.calc(price, 'percentChangeLastDay');
        this.priceChangeLastWeek = this.calc(price, 'percentChangeLastWeek');
        this.priceChangeLastMonth = this.calc(price, 'percentChangeLastMonth');
        this.priceChangeLast60Days = this.calc(price, 'percentChangeLast60Days');
        this.priceChangeLast90Days = this.calc(price, 'percentChangeLast90Days');
        this.isDecline = this.getIsDecline();
        this.median = this.getMedian();
        this.stabilityRating = this.checkPriceStability();
        this.createdAt = new Date();
    }

    calc(price, prop) {
        return price.price * (price[prop] < 0 ? Math.abs((100 - price[prop]) / 100) : price[prop] / 100 + 1);
    }

    getMedian() {
        return (this.priceChangeLastMonth + this.priceChangeLast60Days + this.priceChangeLast90Days) / 3;
    }

    getIsDecline() {
        const tag = this.price < this.priceChangeLastHour
        && this.price < this.priceChangeLastDay
            ? tags.DECLINING : tags.INCLINING;

        this.tags.push(tag);

        return tag;
    }

    checkPriceStability() {
        const percentageDiff = this.price / this.median;
        let tag = '';
        if (percentageDiff < 1) {
            tag = percentageDiff + 0.1 > 1
                ? {grade: 1, label: tags.WEAK_BUY} : percentageDiff + 0.2 > 1
                    ? {grade: 2, label: tags.OKAY_BUY} : percentageDiff + 0.3 > 1
                        ? {grade: 3, label: tags.FAIRLY_GOOD_BUY} : percentageDiff + 0.4 > 1
                            ? {grade: 4, label: tags.VERY_GOOD_BUY} : {grade: 5, label: tags.WELL_BELOW};
        } else {
            tag = percentageDiff - 0.1 > 1
                ? {grade: -1, label: tags.STEADY_PRICE} : percentageDiff - 0.2 > 1
                    ? {grade: -2, label: tags.OKAY_SALE} : percentageDiff - 0.3 > 1
                        ? {grade: -3, label: tags.GOOD_SALE} : percentageDiff - 0.4 > 1
                            ? {grade: -4, label: tags.VERY_GOOD_SALE} : {grade: -5, label: tags.EXCELLENT_SALE};
        }

        this.tags.push(tag.label);

        return tag;
    }
}

exports.Analysis = Analysis;
