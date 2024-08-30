<script setup lang="ts">
import { onMounted, PropType, ref, watch } from "vue";
import { CurrencyModel } from "@/pages";
import DropdownArrow from "@/assets/images/svg/dropdown-arrow.svg";

const props = defineProps({
  currency: {
    type: Object as PropType<CurrencyModel>,
    required: true,
  },
  currencies: {
    type: Array as PropType<CurrencyModel[]>,
    required: true,
  },
  uniqueName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (emit: "update:currency", currency: CurrencyModel): void;
}>();

/** Выбранная валюта */
const selectedCurrency = ref<CurrencyModel>();
/** Видны ли варианты для выбора */
const isOptionsVisible = ref(false);

onMounted(() => {
  selectedCurrency.value = props.currency;
});

/** Подписка на значение выбранной валюты*/
watch(
  () => props.currency,
  () => {
    selectedCurrency.value = props.currency;
  },
  {
    deep: true,
  }
);

/** Изменить видимости опций дропдауна*/
const toggleOptionsVisibility = () => {
  if (isOptionsVisible.value) {
    document.removeEventListener("click", closeOnClickOutside);
  } else {
    document.addEventListener("click", closeOnClickOutside);
  }
  isOptionsVisible.value = !isOptionsVisible.value;
};
/** Выбрать валюту */
const selectCurrency = (currency: CurrencyModel) => {
  if (props.currency.Id == currency.Id) return;
  emit("update:currency", currency);
  selectedCurrency.value = currency;
};
/** Закрыть опции при клике вне списка */
const closeOnClickOutside = (e) => {
  if (
    isOptionsVisible.value &&
    !e.target.closest(`.currency-dropdown-${props.uniqueName}`)
  ) {
    isOptionsVisible.value = false;
  }
};
</script>

<template>
  <div :class="['currency-dropdown', `currency-dropdown-${props.uniqueName}`]">
    <div class="currency-dropdown__name" @click="toggleOptionsVisibility">
      {{ selectedCurrency?.Name }}
      <DropdownArrow
        class="currency-dropdown__icon"
        :class="{ 'currency-dropdown__icon_open': isOptionsVisible }"
      />
    </div>
    <div
      class="currency-dropdown__options"
      :class="{ 'currency-dropdown__options_visible': isOptionsVisible }"
    >
      <div
        class="currency-dropdown__option"
        :class="{
          'currency-dropdown__option_active':
            currency.Name == selectedCurrency?.Name,
        }"
        v-for="currency in props.currencies"
        @click="selectCurrency(currency)"
      >
        {{ currency.Name }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.currency-dropdown {
  position: relative;
  display: inline-block;
}

.currency-dropdown__name {
  cursor: pointer;
  padding: 5px;
  border: 1px solid black;
  border-radius: 16px;
  min-width: 60px;
  text-align: center;
  vertical-align: center;
}

.currency-dropdown__icon {
  transform: rotate(0deg);
  transition: transform 0.3s;
}

.currency-dropdown__icon_open {
  transform: rotate(180deg);
}

.currency-dropdown__options {
  position: absolute;
  opacity: 0;
  top: 35px;
  left: -4px;
  visibility: hidden;
  overflow: hidden;
  transition: opacity 0.3s;
  border: 1px solid black;
  border-radius: 16px;
  padding: 4px;
  min-width: 60px;
  text-align: center;
}

.currency-dropdown__options_visible {
  opacity: 1;
  visibility: visible;
  z-index: 120;
  transition: opacity 0.3s;
  background-color: #fff;
}

.currency-dropdown__option {
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
}

.currency-dropdown__option:hover,
.currency-dropdown__option_active {
  background-color: lightgrey;
}
</style>
