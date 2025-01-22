<template>
  <div class="mywork-custom-table">
    <div v-if="theme" class="mywork-custom-table--container">
      <ag-grid-vue
          class="mywork-custom-table--grid-table"
          :key="theme.key"
          :rowData="rowData"
          :columnDefs="colDefs"
          :grid-options="{
            theme: theme.value,
          }"
      >
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { themeQuartz } from "ag-grid-community";

export default {
  components: {
    AgGridVue,
  },
  props: {
    content: { type: Object, required: true },
  },
  computed: {
    theme() {
      return {
        key: `custom-theme-${+new Date()}`,
        value: themeQuartz.withParams({
          backgroundColor: this.content.backgroundColor,
          borderColor: this.content.borderColor,
          borderRadius: `${this.content.borderRadius}px`,
          browserColorScheme: "light",
          cellTextColor: this.content.cellTextColor,
          columnBorder: false,
          fontFamily: 'Inter',
          foregroundColor: this.content.foregroundColor,
          headerBackgroundColor: this.content.backgroundColor ?? this.content.headerBackgroundColor,
          headerFontSize: `${this.content.fontSize}px`,
          dataFontSize: `${this.content.fontSize}px`,
          headerTextColor: this.content.headerTextColor,
          oddRowBackgroundColor: this.content.foregroundColor,
          rowBorder: true,
          sidePanelBorder: true,
          wrapperBorder: true,
          wrapperBorderRadius: `${this.content.borderRadius}px`,
        }),
      };
    },
  },
  data() {
    const rowData = [
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ];

    // Column Definitions: Defines the columns to be displayed.
    const colDefs = [
      { field: "make" },
      { field: "model" },
      { field: "price" },
      { field: "electric" }
    ];

    return {
      rowData,
      colDefs,
    };
  },
};
</script>

<style lang="scss" scoped>
.mywork-custom-table {
  &--container {
    height: 500px; // dev purposes only
    width: 1000px; // dev purposes only
  }
  &--grid-table {
    height: 100%;
    width: 100%;
  }
}
</style>
