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
    }

    calc(price, prop) {
        return price.price * (price[prop] + 1);
    }

    getMedian() {
        // get the median from the 90 days 60 days and 30 days then see how far the value is
    }

    getIsGoodBuy() {
        return true;
    }

    getIsDecline() {
        return true;
    }
}

exports.Analysis = Analysis;
