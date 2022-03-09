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
        this.isGoodBuy = this.getIsGoodBuy();
        this.isDecline = this.getIsDecline();
        this.priceStability = this.checkPriceStability();
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
        const percentageDiff = Math.abs(this.median / this.price);
        if (percentageDiff < 1) {
            return percentageDiff + 0.1 < 1
                ? 'below strong' : percentageDiff + 0.2 < 1
                    ? 'below okay' : percentageDiff + 0.3 < 1
                        ? 'below weak' : percentageDiff + 0.4 < 1 ? 'below very weak' : 'Do not bother';
        } else {
            return percentageDiff + 0.1 < 1
                ? 'above weak' : percentageDiff + 0.2 < 1
                    ? 'above okay' : percentageDiff + 0.3 < 1
                        ? 'above strong' : percentageDiff + 0.4 < 1 ? 'above very strong' : 'too strong. wait for decline';
        }
    }
}

exports.Analysis = Analysis;
