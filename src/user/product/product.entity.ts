export class Product {
    id: number;
    name: string;
    description?: string;
    title: string;
    startDate: Date;
    dueDate: Date;
    apy: string;
    apyChanging?: boolean;
    symbol?: string;
    slug: string;
    details?: string;
    payment_period: string;
    invest_period: string;
    min_amount: string;
    service_name: string;
    invest_period_in_weeks: string;
    payment_period_in_weeks: string;
    investor_level?: string;
    locale: string;

    constructor(
        id: number,
        name: string,
        title: string,
        startDate: Date,
        dueDate: Date,
        apy: string,
        apyChanging: boolean,
        symbol: string,
        slug: string,
        payment_period: string,
        invest_period: string,
        min_amount: string,
        service_name: string,
        invest_period_in_weeks: string,
        payment_period_in_weeks: string,
        locale: string,
        details?: string,
        investor_level?: string,
        description?: string,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.title = title;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.apy = apy;
        this.apyChanging = apyChanging;
        this.symbol = symbol;
        this.slug = slug;
        this.details = details;
        this.payment_period = payment_period;
        this.invest_period = invest_period;
        this.min_amount = min_amount;
        this.service_name = service_name;
        this.invest_period_in_weeks = invest_period_in_weeks;
        this.payment_period_in_weeks = payment_period_in_weeks;
        this.investor_level = investor_level;
        this.locale = locale;
    }
}