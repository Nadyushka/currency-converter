/**
 * Модель описывающие значение курсов валют в списке
 */
import {CurrenciesEnum} from "@/pages";

export class CurrencyInListModel {
    /** Наименование валюты */
    Name: CurrenciesEnum
    /** Курс валюты */
    Rate: number

    constructor(obj: Partial<CurrencyInListModel>) {
        Object.assign(this, obj)
    }
}
