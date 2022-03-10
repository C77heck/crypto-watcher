class Analysis {
    constructor(price) {
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
        return this.price < this.priceChangeLastHour && this.price < this.priceChangeLastDay && this.price < this.priceChangeLastWeek;
    }

    checkPriceStability() {
        const percentageDiff = this.price / this.median;
        if (percentageDiff < 1) {
            return percentageDiff + 0.1 > 1
                ? {grade: 1, label: 'weak buy'} : percentageDiff + 0.2 > 1
                    ? {grade: 2, label: 'okay buy'} : percentageDiff + 0.3 > 1
                        ? {grade: 3, label: 'fairly good buy'} : percentageDiff + 0.4 > 1
                            ? {grade: 4, label: 'very good buy'} : {grade: 5, label: 'well below its median'};
        } else {
            return percentageDiff - 0.1 > 1
                ? {grade: -1, label: 'steady price'} : percentageDiff - 0.2 > 1
                    ? {grade: -2, label: 'okay sale'} : percentageDiff - 0.3 > 1
                        ? {grade: -3, label: 'good sale'} : percentageDiff - 0.4 > 1
                            ? {grade: -4, label: 'very good sale'} : {grade: -5, label: 'excellent sale'};
        }
    }
}

exports.Analysis = Analysis;
