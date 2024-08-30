/**
 * Модель описывающая валюту
 */
import {CurrenciesEnum} from "../enums/CurrenciesEnum";

export class CurrencyModel {
    /** id валюты */
    Id: number
    /** Наименование валюты */
    Name: CurrenciesEnum

    constructor(obj: Partial<CurrencyModel>) {
        Object.assign(this, obj)
    }
}
