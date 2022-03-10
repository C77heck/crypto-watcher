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
        this.isGoodBuy = this.getIsGoodBuy();
        this.isDecline = this.getIsDecline();
        this.stabilityRating = this.checkPriceStability();
        this.median = this.getMedian();
    }

    calc(price, prop) {
        return price.price * (price[prop] < 0 ? Math.abs((100 - price[prop]) / 100) : price[prop] / 100 + 1);
    }

    getMedian() {
        return (this.priceChangeLastMonth + this.priceChangeLast60Days + this.priceChangeLast90Days) / 3;
    }

    getIsGoodBuy() {
        // make a ranking with percentage based differences
        return this.median > this.price;
    }

    getIsDecline() {
        return this.price < this.priceChangeLastHour && this.price < this.priceChangeLastDay && this.price < this.priceChangeLastWeek;
    }

    checkPriceStability() {
        const percentageDiff = Math.abs(this.price / this.median);
        if (percentageDiff < 1) {
            return percentageDiff + 0.1 > 1
                ? 'weak buy' : percentageDiff + 0.2 > 1
                    ? 'okay buy' : percentageDiff + 0.3 > 1
                        ? 'fairly good buy' : percentageDiff + 0.4 > 1 ? 'very good buy' : 'well below its median';
        } else {
            return percentageDiff - 0.1 < 1
                ? 'steady price' : percentageDiff - 0.2 < 1
                    ? 'okay sale' : percentageDiff - 0.3 < 1
                        ? 'good sale' : percentageDiff - 0.4 < 1 ? 'very good sale' : 'excellent sale';
        }
    }
}

exports.Analysis = Analysis;
