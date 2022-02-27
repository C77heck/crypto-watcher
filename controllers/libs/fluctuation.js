class Fluctuation {
    constructor(price) {
        this.name = price.name;
        this.symbol = price.symbol;
        this.price = price.price;
        this.priceChangeLastHour = this.calc(price, 'percentChangeLastHour');
        this.priceChangeLastDay = this.calc(price, 'percentChangeLastDay');
        this.priceChangeLastWeek = this.calc(price, 'percentChangeLastWeek');
        this.priceChangeLastMonth = this.calc(price, 'percentChangeLastMonth');
        this.priceChangeLast60Days = this.calc(price, 'percentChangeLast60Days');
        this.priceChangeLast90Days = this.calc(price, 'percentChangeLast90Days');
        this.percentChangeLastHour = price.percentChangeLastHour;
        this.percentChangeLastDay = price.percentChangeLastDay;
        this.percentChangeLastWeek = price.percentChangeLastWeek;
        this.percentChangeLastMonth = price.percentChangeLastMonth;
        this.percentChangeLast60Days = price.percentChangeLast60Days;
        this.percentChangeLast90Days = price.percentChangeLast90Days;
    }

    calc(price, prop) {
        return price.price * (price[prop] + 1);
    }
}

exports.Fluctuation = Fluctuation;
