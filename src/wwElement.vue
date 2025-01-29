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
          :pagination="pagination.enabled"
          :paginationPageSize="pagination.pageSize"
          :paginationPageSizeSelector="pagination.pageSizeSelector"
          @grid-ready="onGridReady"
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
          backgroundColor: this.content.color.background,
          borderColor: this.content.border.color,
          borderRadius: this.content.border.radius,
          browserColorScheme: "normal",
          cellTextColor: this.content.color.text,
          columnBorder: false,
          fontFamily: this.content.font.fontFamily,
          foregroundColor: this.content.color.foreground,
          headerBackgroundColor: this.content.header.backgroundColor,
          headerColumnBorder: false,
          headerFontSize: this.content.header.fontSize ?? this.content.font.fontSize,
          headerVerticalPaddingScale: 0.5,
          dataFontSize: this.content.font.fontSize,
          headerTextColor: this.content.header.textColor ?? this.content.color.text,
          oddRowBackgroundColor: this.content.color.foreground,
          textColor: this.content.color.text,
          rowBorder: true,
          rowHoverColor: this.content.color.foreground,
          rowVerticalPaddingScale: 0.5,
          sidePanelBorder: true,
          wrapperBorder: true,
          wrapperBorderRadius: this.content.border.radius,
        }),
      };
    },
    defaultColumnDefs() {
      const dataTemplate = this.content.dataSource?.[0];

      if (!dataTemplate) return [];

      return Object.keys(dataTemplate).map((key) => ({
        field: key,
        sortable: true,
      }));
    },
    customColumnDefs() {
      if (!this.isArrayPropDefined(this.content.columnConfig)) {
        return [];
      }

      return this.content.columnConfig.map((column) => ({
        field: column.field,
        headerName: column.headerName,
        sortable: column.sortable,
      }));
    },
    columnDefs() {
      return this.isArrayPropDefined(this.content.columnConfig) ? this.customColumnDefs : this.defaultColumnDefs;
    },
    rowData() {
      return this.content.dataSource ?? [];
    },
    pagination() {
      return {
        enabled: this.content?.pagination?.enabled ?? false,
        pageSize: this.content?.pagination?.pageSize ?? 50,
        pageSizeSelector: this.isArrayPropDefined(this.content?.pagination?.pageSizeOptions)
            ? this.content?.pagination?.pageSizeOptions
            : [10, 25, 50, 100],
      };
    },
  },
  methods: {
    isArrayPropDefined: function (array) {
      return Array.isArray(array)
        && array.length > 0
        && array.some(item => item !== null && item !== undefined);
    },
    onGridReady: function ({ api }) {
      this.api = api;
    },
  },
  data() {
    return {
      api: null,
    };
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
