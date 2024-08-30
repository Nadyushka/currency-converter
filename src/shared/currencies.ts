import {CurrenciesEnum, CurrencyModel} from "@/pages";

export const currencies: Array<CurrencyModel> = [
    new CurrencyModel({
        Id: 1,
        Name: CurrenciesEnum.BYN
    }),
    new CurrencyModel({
        Id: 2,
        Name: CurrenciesEnum.USD
    }),
    new CurrencyModel({
        Id: 3,
        Name: CurrenciesEnum.EUR
    }),
    new CurrencyModel({
        Id: 4,
        Name: CurrenciesEnum.PLN
    }),
    new CurrencyModel({
        Id: 5,
        Name: CurrenciesEnum.RUB
    })
];
