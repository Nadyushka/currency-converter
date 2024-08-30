import {ref} from "vue";
import {CurrenciesEnum, CurrencyInListModel, CurrencyModel,} from '@/pages'
import {currencies} from "@/shared";


export class AdapterService {
    /** Сервис */
    private static instance: AdapterService

    public static getInstance() {
        if (!AdapterService.instance) {
            AdapterService.instance = new AdapterService()
        }
        return AdapterService.instance
    }

    /** Выбранная валюта */
    SelectedCurrency = ref<CurrencyModel>(new CurrencyModel ({ Id: 1 ,Name: CurrenciesEnum.BYN }))
    /** Валюта для местоположения пользователя */
    UserLocationCurrency = ref<CurrencyModel>(new CurrencyModel ({ Id: 1 ,Name: CurrenciesEnum.BYN }))
    /** Курсы валют  */
    CurrenciesExchangeRates = ref<Array<CurrencyInListModel>>([])
    /** Загрузка*/
    IsLoading = ref(true)

    /**
     * * Получить локацию пользователя
     */
    async getLocationCurrency () {
        this.IsLoading.value = true
        return  new Promise<CurrencyModel | undefined>(async (resolve) => {
            await fetch('https://ipapi.co/json')
                .then(res =>  res.json())
                .then(async (res) => {
                    const currentCountryCurrency = res.currency
                    const locationCurrency =  currencies.find(currency => currency.Name == currentCountryCurrency)  ??
                        new CurrencyModel({
                            Id: currencies.length + 1,
                            Name: currentCountryCurrency
                        })

                    this.SelectedCurrency.value = locationCurrency
                    this.UserLocationCurrency.value = locationCurrency
                    resolve(locationCurrency)
                })
                .catch(e => console.log('getLocationCurrency', e))
                .finally(() => {
                    this.IsLoading.value = false
                })
        })
    }

    /**
     * * Получить курс обмена валют
     */
    async getCurrenciesExchangeRates () {

        this.IsLoading.value = true

        return  new Promise<CurrencyInListModel[] | undefined>(async (resolve) => {
        const currenciesNames = currencies.map(currency => currency.Name)

            const params = new URLSearchParams({
                access_key: '9ad691ab88b0576c25b5532be2a1e63b',
            }).toString();

            await fetch(`http://data.fixer.io/api/latest?${params}`)
                .then(res =>  res.json())
                .then(async (res) => {
                    const extractedCurrenciesValues = {};

                    currenciesNames.forEach(currency => {
                        if (res.rates[currency] !== undefined) {
                            extractedCurrenciesValues[currency] = res.rates[currency];
                        }})

                    const rates = this.mapToCurrenciesExchangeRates(extractedCurrenciesValues)
                        this.CurrenciesExchangeRates.value = rates

                    resolve(rates)
                })
                .catch(e => console.log('getCurrenciesExchangeRates', e))
                .finally(()=> {
                    this.IsLoading.value = false
                })
        })
    }

    /**
     * Приведение обменных ставок к единому виду
     */
    mapToCurrenciesExchangeRates(rates: Record<string, number>):Array<CurrencyInListModel> {
        const currenciesValues = Object.keys(rates)
        return currenciesValues.map((currency) => {
            const currencyName = currency;
            const currencyRate =  rates[currency] / rates[this.SelectedCurrency.value.Name];

            return new CurrencyInListModel({
                Name: currencyName as CurrenciesEnum,
                Rate: +currencyRate.toFixed(4)
            });
        });
    }

}
