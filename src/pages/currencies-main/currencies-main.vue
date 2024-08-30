<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { AdapterService } from "@/pages";

/**  Сервис для управления данными */
const adapterService = AdapterService.getInstance();

/** Текущие курсы валют */
const currenciesExchangeRates = ref();

/** Подписка на изменение валюты страницы */
watch(
    () => adapterService.SelectedCurrency.value,
    async () =>
        await setCurrenciesExchangeRates()
);

/** После монтирования компонента */
onMounted(async () => {
  await setCurrenciesExchangeRates()
});

/** Установить текущие курсы валют к выбранной валюте */
const setCurrenciesExchangeRates = async () => {
  currenciesExchangeRates.value =
      await adapterService.getCurrenciesExchangeRates();
}
</script>

<template>
  <main class="main">
    <div v-for="rate in currenciesExchangeRates" class="main__rate">
      <span>{{
        adapterService.SelectedCurrency.value.Name + "/" + rate.Name + ": "
      }}</span>
      <span>{{ rate.Rate }}</span>
    </div>
  </main>
</template>

<style scoped lang="scss">
.main {
  width: 80%;
  margin: 0 auto;
}

.main__rate {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
