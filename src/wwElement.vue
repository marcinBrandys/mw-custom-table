<template>
  <div class="mywork-custom-table">
    <div v-if="theme" class="mywork-custom-table--container">
      <ag-grid-vue
          class="mywork-custom-table--grid-table"
          :key="theme.key"
          :rowData="rowData"
          :columnDefs="columnDefs"
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
    defaultColumnDefs() {
      const dataTemplate = this.content.dataSource?.[0];

      if (!dataTemplate) return [];

      return Object.keys(dataTemplate).map((key) => ({
        field: key,
      }));
    },
    customColumnDefs() {
      if (!this.isArrayPropDefined(this.content.columnConfig)) {
        return [];
      }

      return this.content.columnConfig.map((column) => ({
        field: column.field,
        headerName: column.headerName,
      }));
    },
    columnDefs() {
      return this.isArrayPropDefined(this.content.columnConfig) ? this.customColumnDefs : this.defaultColumnDefs;
    },
    rowData() {
      return this.content.dataSource ?? [];
    },
  },
  methods: {
    isArrayPropDefined: (array) => {
      return Array.isArray(array)
        && array.length > 0
        && array.every(item => item !== undefined);
    }
  }
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
