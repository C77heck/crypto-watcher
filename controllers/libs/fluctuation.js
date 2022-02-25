class Fluctuation {
    change_1h;
    change_24h;
    change_7d;
    change_30d;
    change_60d;
    change_90d;

    constructor(price) {
        this.change_1h = price?.quote?.HUF?.percentage_change_1h || ' - ';
        this.change_24h = price?.quote?.HUF?.percentage_change_24h || ' - ';
        this.change_7d = price?.quote?.HUF?.percentage_change_7h || ' - ';
        this.change_30d = price?.quote?.HUF?.percentage_change_30d || ' - ';
        this.change_60d = price?.quote?.HUF?.percentage_change_60d || ' - ';
        this.change_90d = price?.quote?.HUF?.percentage_change_90d || ' - ';
    }
}

exports.Fluctuation = Fluctuation;
