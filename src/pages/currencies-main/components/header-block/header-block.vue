<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { routesData } from "@/router/routes";
import { HeaderItemModel } from "@/pages/currencies-main/components/header-block/model";
import { currencies } from "@/shared";
import { AdapterService, CurrenciesEnum, CurrencyModel, CurrencyDropdown } from "@/pages";

const router = useRouter();

/**  Сервис для управления данными */
const adapterService = AdapterService.getInstance();

/** Значения меню хедера */
const headerMenuItems: HeaderItemModel[] = [
  new HeaderItemModel({
    Title: routesData.MAIN_PAGE.title,
    Path: routesData.MAIN_PAGE.path,
    Name: routesData.MAIN_PAGE.name,
  }),
  new HeaderItemModel({
    Title: routesData.CONVERTER_PAGE.title,
    Path: routesData.CONVERTER_PAGE.path,
    Name: routesData.CONVERTER_PAGE.name,
  }),
];

/** Имя текущей страницы*/
const currentRouteName = ref<string>(
  router.currentRoute.value.name?.toString()
);
/** Валюта страницы */
const pageCurrency = ref<CurrencyModel>(
  new CurrencyModel({
    ...currencies.find((currency) => currency.Name == CurrenciesEnum.BYN),
  })
);

/** После монтирования компонента */
onMounted(async () => {
  setCurrentRouteName();

  const res = await adapterService.getLocationCurrency();
  pageCurrency.value = res;
});

/** Подписка на изменение url */
watch(
  () => router.currentRoute.value.name,
  () => {
    setCurrentRouteName();
  },
  {
    deep: true,
  }
);

/** Подписка на изменение валюты приложения */
watch(
  () => pageCurrency.value,
  () => {
    if (adapterService.SelectedCurrency.value.Id == pageCurrency.value.Id)
      return;
    adapterService.SelectedCurrency.value = pageCurrency.value;
  },
  {
    deep: true,
  }
);

/** Подписка на изменение валюты приложения в конвекторе*/
watch(
  () => adapterService.SelectedCurrency.value,
  () => {
    pageCurrency.value = adapterService.SelectedCurrency.value;
  },
  {
    deep: true,
  }
);

/** Задать имя текущего URL */
const setCurrentRouteName = () => {
  currentRouteName.value = router.currentRoute.value.name?.toString();
};
</script>

<template>
  <header class="header">
    <nav class="header__nav">
      <ul class="menu">
        <li
          v-for="item in headerMenuItems"
          class="menu__item"
          :class="{ menu__item_active: item.Name == currentRouteName }"
        >
          <router-link :to="item.Path">
            {{ item.Title }}
          </router-link>
        </li>
      </ul>
      <CurrencyDropdown
        unique-name="header"
        :currencies="currencies"
        v-model:currency="pageCurrency"
      />
    </nav>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 80%;
  margin: 0 auto 32px;
  border-bottom: 1px solid #000000;
}

.header__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.menu__item {
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s;
}

.menu__item:hover {
  text-decoration: underline;
}

.menu__item_active {
  font-weight: 600;
}
</style>
