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
          :rowSelection="rowSelection"
          @grid-ready="onGridReady"
          @first-data-rendered="onFirstDataRendered"
          @model-updated="onModelUpdated"
          @selection-changed="onSelectionChanged"
          @pagination-changed="onPaginationChanged"
          @sort-changed="onSortChanged"
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
    uid: { type: String, required: true },
  },
  emits: ["trigger-event"],
  setup(props) {
    const { value: selectedRows, setValue: setSelectedRows } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "selectedRows",
      type: "Array",
      defaultValue: [],
    });
    const { value: paginationState, setValue: setPaginationState } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "paginationState",
      type: "Array",
      defaultValue: {
        pageSize: 0,
        currentPage: 0,
        totalPages: 1,
        totalElements: 0,
        isLastPage: true,
      },
    });

    return {
      selectedRows,
      setSelectedRows,
      paginationState,
      setPaginationState,
    };
  },
  computed: {
    theme() {
      return {
        key: `custom-theme-${+new Date()}`,
        value: themeQuartz.withParams({
          accentColor: this.content.color.brand,
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
          oddRowBackgroundColor: this.content.color.backgroundActive,
          textColor: this.content.color.text,
          rowBorder: true,
          rowHoverColor: this.content.color.foreground,
          rowVerticalPaddingScale: 0.5,
          selectedRowBackgroundColor: this.content.color.foreground,
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
    rowSelection() {
      if (!this.content.rowConfig?.selectionMode) return undefined;

      return {
        mode: this.content.rowConfig.selectionMode,
      };
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
    isArrayPropDefined(array) {
      return Array.isArray(array)
        && array.length > 0
        && array.some(item => item !== null && item !== undefined);
    },
    onGridReady({ api }) {
      this.api = api;
      this.$emit("trigger-event", {
        name: "onTableReady",
      });
    },
    onFirstDataRendered() {
      this.$emit("trigger-event", {
        name: "onFirstDataRendered",
      });
    },
    onModelUpdated() {
      this.$emit("trigger-event", {
        name: "onModelUpdated",
      });
    },
    onSelectionChanged({ api }) {
      const selectedRows = api.getSelectedNodes().map(({ data }) => data);
      this.setSelectedRows(selectedRows);
      this.$emit("trigger-event", {
        name: "onSelectionChanged",
        event: {
          selectedRows,
        },
      });
    },
    onPaginationChanged({ api }) {
      const paginationState = {
        pageSize: api.paginationGetPageSize(),
        currentPage: api.paginationGetCurrentPage(),
        totalPages: api.paginationGetTotalPages(),
        totalElements: api.paginationGetRowCount(),
        isLastPage: api.paginationIsLastPageFound(),
      };
      this.setPaginationState(paginationState);
      this.$emit("trigger-event", {
        name: "onPaginationChanged",
        event: {
          ...paginationState,
        },
      });
    },
    onSortChanged({ api }) {
      const sortState = api.getColumnState().map(({ colId, sort }) => ({
        field: colId,
        sort,
      }));
      this.$emit("trigger-event", {
        name: "onSortChanged",
        event: {
          sortState,
        },
      });
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
