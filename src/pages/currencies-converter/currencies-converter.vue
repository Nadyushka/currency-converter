<script lang="ts" setup>
import {
  AdapterService,
  CurrenciesEnum,
  CurrencyDropdown,
  CurrencyModel,
} from "@/pages";
import { computed,  onMounted, ref, watch } from "vue";
import { currencies } from "@/shared";

/**  Сервис для управления данными */
const adapterService = AdapterService.getInstance();

/** Валюта покупки */
const buyCurrency = ref<CurrencyModel>(
  new CurrencyModel({
    ...currencies.find((currency) => currency.Name == CurrenciesEnum.BYN),
  })
);
/** Валюта продажи */
const sellCurrency = ref<CurrencyModel>(
  new CurrencyModel({
    ...currencies.find((currency) => currency.Name == CurrenciesEnum.USD),
  })
);
/** Сумма покупки */
const buyAmount = ref();
/** Сумма продажи */
const sellAmount = ref();

/** Валюта местоположения пользователя */
const userLocationCurrency = computed(
  () => adapterService.UserLocationCurrency.value.Name
);
/** Курсы валют */
const exchangeRates = computed(
  () => adapterService.CurrenciesExchangeRates.value
);

/** Загрудается ли прилижоение сейчас*/
const isLoading = computed(() => adapterService.IsLoading.value);

/** После монтирования компонента */
onMounted(async () => {
  /** Определяем валюту покупки */
  if (!adapterService.SelectedCurrency.value.Id) {
    const res = await adapterService.getLocationCurrency();
    buyCurrency.value =  res;
  } else {
    buyCurrency.value = adapterService.SelectedCurrency.value;
  }

  await adapterService.getCurrenciesExchangeRates();

  /** Дефолтное значение для суммы продажи  */
  sellAmount.value = 0;
});

/** Провести конверсию валют */
const calculateAmount = (event) => {
  const amount = event.target.value.trim()

  /** Сумма покупки не задана */
  if (!amount) {
    sellAmount.value = undefined;
    buyAmount.value = undefined;
    return;
  }


  /** Валюта продажи и покупки совпадает */
  if (buyCurrency.value.Name == sellCurrency.value.Name) {
    sellAmount.value = amount;
    buyAmount.value = amount;
    return;
  }

  if (event.target.classList.contains('buy-input')) {
    buyAmount.value = amount
    setSellAmount(+amount);

  } else if (event.target.classList.contains('sell-input')) {

    sellAmount.value = amount
    setBuyAmount(+amount)
  }
}

/** Подписка на изменение суммы покупки */
watch(
  () => sellCurrency.value,
  () => {
    /** Сумма покупки не задана */
    if (!buyAmount.value) {
      sellAmount.value = undefined;
      return;
    }

    /** Валюта продажи и покупки совпадает */
    if (buyCurrency.value.Name == sellCurrency.value.Name) {
      sellAmount.value = buyAmount.value;
      return;
    }

    setSellAmount(buyAmount.value);
  },
  {
    deep: true,
  }
);

/** Подписка на изменение валюты покупки */
watch(
  () => buyCurrency.value,
  async () => {
    adapterService.SelectedCurrency.value = buyCurrency.value;
    await adapterService.getCurrenciesExchangeRates();

    setSellAmount(buyAmount.value);
  },
  {
    deep: true,
  }
);

/** Подписка на изменение валюты приложения */
watch(
    () => adapterService.SelectedCurrency.value,
    () => {
      buyCurrency.value = adapterService.SelectedCurrency.value;
    }, {
      deep: true
    }
)

/** Задать сумму продажи*/
const setSellAmount = (amount: number) => {
  if (!amount) {
    sellAmount.value = 0;
  } else {
    const exchangeRate =
      exchangeRates.value.find((rate) => rate.Name == sellCurrency.value.Name)
        ?.Rate ?? 1;

    sellAmount.value = (amount * exchangeRate).toFixed(2);
  }
};

/** Задать сумму покупки*/
const setBuyAmount = (amount: number) => {
  if (!amount) {
    buyAmount.value = 0;
  } else {
    const exchangeRate =
        exchangeRates.value.find((rate) => rate.Name == sellCurrency.value.Name)
            ?.Rate ?? 1;

    buyAmount.value = (amount / exchangeRate).toFixed(2);
  }
};
</script>

<template>
  <main class="exchange">
    <div
      class="exchange__loader"
      :class="{
        exchange__loader_visible: isLoading,
      }"
    >
      Loading...
    </div>

    <div class="exchange__data">
      <div class="exchange__currency">
        <span>Валюта страны местоположения пользователя: </span
        ><span>
          <b>{{ userLocationCurrency }} </b></span
        >
      </div>
      <div class="currency-action">
        <div class="currency-action__buy">
          <label for="currency-buy" class="currency-action__label"
            >Покупаю:</label
          >
          <input
            :value="buyAmount"
            type="number"
            class="currency-action__input buy-input"
            placeholder="Введите сумму"
            @input="calculateAmount($event)"
          />
          <CurrencyDropdown
            v-model:currency="buyCurrency"
            :currencies="currencies"
            unique-name="buy"
          />
        </div>
        <div class="currency-action__sell">
          <div class="currency-action__label">
            Необходимо в выбранной валюте:
          </div>
          <input
              :value="sellAmount"
              type="number"
              class="currency-action__input sell-input"
              placeholder="Введите сумму"
              @input="calculateAmount($event)"
          />
          <CurrencyDropdown
            v-model:currency="sellCurrency"
            :currencies="currencies"
            unique-name="sell"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.exchange {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}

.exchange__loader {
  position: absolute;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  color: #000;
  visibility: hidden;
}

.exchange__loader_visible {
  visibility: visible;
}

.exchange__data {
  width: 500px;
  border-radius: 16px;
  border: 1px solid black;
  padding: 16px;
}
.exchange__currency {
  padding-bottom: 8px;
  font-size: 20px;
}

.currency-action__buy,
.currency-action__sell {
  margin-bottom: 8px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
</style>
