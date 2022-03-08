const {Analysis} = require("./analysis");

class Fluctuation {
    constructor(price) {
        this.name = price.name;
        this.symbol = price.symbol;
        this.price = price.price;
        this.identifier = price.identifier;
        this.percentChangeLastHour = price.percentChangeLastHour;
        this.percentChangeLastDay = price.percentChangeLastDay;
        this.percentChangeLastWeek = price.percentChangeLastWeek;
        this.percentChangeLastMonth = price.percentChangeLastMonth;
        this.percentChangeLast60Days = price.percentChangeLast60Days;
        this.percentChangeLast90Days = price.percentChangeLast90Days;
        this.analysis = new Analysis(price);
    }
}

exports.Fluctuation = Fluctuation;
