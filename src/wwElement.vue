<template>
  <div class="mywork-custom-table">
    <div v-if="theme && domLayout" class="mywork-custom-table--container">
      <ag-grid-vue
          :key="`${theme.key}-${domLayout}`"
          class="mywork-custom-table--grid-table"
          :class="{'mywork-custom-table--grid-table--filled': displayedRowsCount > 0}"
          :style="styleObject"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :dataTypeDefinitions="dataTypeDefinitions"
          :grid-options="{
            domLayout,
            theme: theme.value,
            suppressCellFocus: true,
          }"
          :modules="modules"
          :pagination="gridPagination.enabled"
          :paginationPageSize="gridPagination.pageSize"
          :paginationPageSizeSelector="gridPagination.pageSizeSelector"
          :rowSelection="rowSelection"
          @grid-ready="onGridReady"
          @first-data-rendered="onFirstDataRendered"
          @model-updated="onModelUpdated"
          @selection-changed="onSelectionChanged"
          @pagination-changed="onPaginationChanged"
          @sort-changed="onSortChanged"
          @filter-changed="onFilterChanged"
          @row-clicked="onRowClicked"
          @row-double-clicked="onRowDoubleClicked"
          @cell-clicked="onCellClicked"
          @cell-double-clicked="onCellDoubleClicked"
          @column-header-clicked="onColumnHeaderClicked"
      >
      </ag-grid-vue>
      <ServerSidePaginatorComponent
          v-if="serverSidePagination.enabled && serverSidePagination.state"
          :state="serverSidePagination.state"
          :color-config="content?.color"
          :border-config="content?.border"
          :paging-elements-config="content?.pagingElements"
          @on-page-change="onServerSidePaginationPageChange"
      ></ServerSidePaginatorComponent>
    </div>
  </div>
</template>

<script>
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { themeQuartz } from "@ag-grid-community/theming";
import { AgGridVue } from "@ag-grid-community/vue3";
import ActionButtonCellComponent from "./ActionButtonCellComponent.vue";
import CellComponent from "./CellComponent.vue";
import CellLayoutComponent from "./CellLayoutComponent.vue";
import ServerSidePaginatorComponent from "./ServerSidePaginatorComponent.vue";

const DATATYPE_TO_WW_ELEMENT_MAP = {
  "button-element": "ww-button",
  "text-element": "ww-text",
  "image-element": "ww-image",
};

const FILTER_DATATYPE_TO_COMPARATOR_MAP = {
  text: "agTextColumnFilter",
  number: "agNumberColumnFilter",
  date: "agDateColumnFilter",
};

const FILTERABLE_DATA_TYPES = ["text", "number", "boolean", "date", "dateString", "timestamp", "object", "custom"];

const ROW_HEIGHT_TO_VERTICAL_PADDING_SCALE = {
  small: 0.5,
  medium: 1,
  large: 2,
};

export default {
  components: {
    AgGridVue,
    ActionButtonCellComponent,
    CellComponent,
    CellLayoutComponent,
    ServerSidePaginatorComponent,
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
  },
  emits: ["trigger-event", "update:content", "update:content:effect"],
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
      type: "Object",
      defaultValue: {
        pageSize: 0,
        currentPage: 0,
        totalPages: 1,
        totalElements: 0,
        isLastPage: true,
      },
    });
    const { value: sortState, setValue: setSortState } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "sortState",
      type: "Array",
      defaultValue: [],
    });
    const { value: filterState, setValue: setFilterState } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "filterState",
      type: "Object",
      defaultValue: {},
    });
    const { createElement } = wwLib.wwElement.useCreate();

    return {
      createElement,
      selectedRows,
      setSelectedRows,
      paginationState,
      setPaginationState,
      sortState,
      setSortState,
      filterState,
      setFilterState,
    };
  },
  computed: {
    theme() {
      const rowHeight = this.content?.row?.rowHeight ?? "small";
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
          menuTextColor: this.content.header.textColor ?? this.content.color.text,
          oddRowBackgroundColor: this.content.color.backgroundActive,
          textColor: this.content.color.text,
          rowBorder: true,
          rowHoverColor: this.content.color.foreground,
          rowVerticalPaddingScale: ROW_HEIGHT_TO_VERTICAL_PADDING_SCALE[rowHeight],
          selectedRowBackgroundColor: this.content.color.foreground,
          sidePanelBorder: true,
          wrapperBorder: true,
          wrapperBorderRadius: this.content.border.radius,
        }),
      };
    },
    domLayout() {
      return this.content?.dimension?.layout ?? "normal";
    },
    styleObject() {
      const height = this.content?.dimension?.height ?? "400px";
      return {
        height: this.domLayout === "normal" ? height : "auto",
      };
    },
    columnDefs() {
      if (!this.isArrayPropDefined(this.content.columnConfig)) return [];

      const dataColumns = this.content.columnConfig
        .filter(({ visible }) => visible)
        .map((column) => {
          const dataPath = this.parseLibraryPathIntoGrid(column.path);
          const customLayoutConfig = this.content.cellLayouts[`layout-${column.id}`] ? {
            autoHeight: true,
            cellRenderer: "CellLayoutComponent",
            cellRendererParams: {
              layoutPath: `cellLayouts.layout-${column.id}`,
              dataPath,
              componentContent: {
                cellLayouts: this.content.cellLayouts,
              }
            },
          } : null;
          const customCellConfig = this.content.cellElements[column.id] && !customLayoutConfig ? {
            autoHeight: true,
            cellRenderer: "CellComponent",
            cellRendererParams: {
              dataType: column.dataType,
              wwElement: this.content.cellElements[column.id],
              dataPath,
            },
          } : null;
          const filterColumnConfig = this.buildFilterColumnConfig(column, dataPath);
          const width = column.width ? Number.parseInt(column.width.split('px')[0]) : undefined;
          return {
            field: dataPath,
            headerName: column.label,
            sortable: column.sortable,
            wrapText: true,
            cellDataType: column.dataType ?? true,
            valueGetter: column.dataType === "custom" ? this.buildValueGetter(column.valueGetter) : undefined,
            width,
            ...filterColumnConfig,
            ...customCellConfig,
            ...customLayoutConfig,
          };
        });
      return [...dataColumns, ...this.actionButtons];
    },
    rowData() {
      return Array.isArray(this.content.dataSource) ? this.content.dataSource : [];
    },
    rowSelection() {
      if (!this.content.rowConfig?.selectionMode) return undefined;

      return {
        mode: this.content.rowConfig.selectionMode,
      };
    },
    actionButtons() {
      if (!this.content.rowConfig?.actionButtons) return [];

      const buttons = this.content.rowConfig.actionButtons
        .filter(({ actionType, visible }) => actionType !== null && visible)
        .map(({ wwElementId, ...button}) => ({
          ...button,
          wwElement: this.content.actionButtonElements[wwElementId],
          onActionButtonClicked: this.onActionButtonClicked,
        }));

      return buttons.length > 0 ? [{
        headerName: "",
        field: "pinnedActionButtonsColumn",
        pinned: "right",
        cellRenderer: "ActionButtonCellComponent",
        cellRendererParams: {
          buttons
        },
      }] : [];
    },
    paginationType() {
      return this.content?.pagination?.type ?? "FE";
    },
    isFEPaginationEnabled() {
      return Boolean(this.content?.pagination?.enabled) && this.paginationType === "FE";
    },
    isBEPaginationEnabled() {
      return Boolean(this.content?.pagination?.enabled) && this.paginationType === "BE";
    },
    gridPagination() {
      return {
        enabled: this.isFEPaginationEnabled,
        pageSize: this.content?.pagination?.pageSize ?? 50,
        pageSizeSelector: this.isArrayPropDefined(this.content?.pagination?.pageSizeOptions)
            ? this.content?.pagination?.pageSizeOptions
            : [10, 25, 50, 100],
      };
    },
    serverSidePagination() {
      if (!this.isBEPaginationEnabled) {
        return {
          enabled: false,
          state: null,
        };
      }

      try {
        const state = this.content?.pagination?.customPagingStateObject;
        return state ? {
          enabled: true,
          state: {
            page_size: state.page_size,
            page: state.page,
            total_items: state.total_items,
            prev_page: state.prev_page,
            next_page: state.next_page,
            total_pages: state.total_pages,
          },
        } : {
          enabled: false,
          state: null,
        };
      } catch (error) {
        console.error("Table Component: Invalid Custom Paging State provided. Please check object schema in 'Expected format' section.")
        return {
          enabled: false,
          state: null,
        };
      }
    }
  },
  methods: {
    /* wwEditor:start */
    async addColumn() {
      const id = wwLib.wwUtils.getUid();
      const columnConfig = [...this.content.columnConfig, {
        id,
        dataType: null,
        sortable: true,
        visible: true,
      }];
      this.$emit("update:content", { columnConfig });
    },
    removeColumn({ index }) {
      const cellElementToRemove = this.content.columnConfig[index];
      const columnConfig = this.content.columnConfig.filter((column) => column.id !== cellElementToRemove.id);
      const cellElements = { ...this.content.cellElements };
      delete cellElements[cellElementToRemove.id];
      this.$emit("update:content", { columnConfig, cellElements });
    },
    async addActionButton() {
      const rowConfig = {...this.content.rowConfig};
      const id = wwLib.wwUtils.getUid();
      rowConfig.actionButtons.push({
        actionType: null,
        customActionName: null,
        visible: true,
        wwElementId: id,
      });
      const actionButtonElements = { ...this.content.actionButtonElements };
      actionButtonElements[id] = await this.createElement(
          "ww-icon",
          {
            _state: {
              name: `Action Button Element ${rowConfig.actionButtons.length}`,
              style: {
                default: {
                  cursor: "pointer",
                },
              },
            },
            content: {
              icon: this.getActionButtonInitialConfig(null).icon,
            },
          },
      );
      this.$emit("update:content", { rowConfig, actionButtonElements });
    },
    removeActionButton({ index }) {
      const actionButtonToRemove = this.content.rowConfig.actionButtons[index];
      const rowConfig = {
        ...this.content.rowConfig,
        actionButtons: this.content.rowConfig.actionButtons.filter(item => item.wwElementId !== actionButtonToRemove?.wwElementId),
      };
      const actionButtonElements = { ...this.content.actionButtonElements };
      delete actionButtonElements[actionButtonToRemove?.wwElementId];
      this.$emit("update:content", { rowConfig, actionButtonElements });
    },
    /* wwEditor:end */
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
    onModelUpdated({ api }) {
      this.displayedRowsCount = api.getDisplayedRowCount();
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
      this.setSortState(sortState);
      this.$emit("trigger-event", {
        name: "onSortChanged",
        event: {
          sortState,
        },
      });
    },
    onFilterChanged({ api }) {
      const filterState = api.getFilterModel();
      this.setFilterState(filterState);
      this.$emit("trigger-event", {
        name: "onFilterChanged",
        event: {
          filterState,
        },
      });
    },
    onRowClicked({ data, rowIndex }) {
      this.$emit("trigger-event", {
        name: "onRowClicked",
        event: {
          row: {
            data,
            index: rowIndex,
          }
        },
      });
    },
    onRowDoubleClicked({ data, rowIndex }) {
      this.$emit("trigger-event", {
        name: "onRowDoubleClicked",
        event: {
          row: {
            data,
            index: rowIndex,
          }
        },
      });
    },
    onCellClicked({ data, rowIndex, value, colDef }) {
      this.$emit("trigger-event", {
        name: "onCellClicked",
        event: {
          cell: {
            data: value,
            fieldName: colDef.field,
          },
          row: {
            data,
            index: rowIndex,
          },
        },
      });
    },
    onCellDoubleClicked({ data, rowIndex, value, colDef }) {
      this.$emit("trigger-event", {
        name: "onCellDoubleClicked",
        event: {
          cell: {
            data: value,
            fieldName: colDef.field,
          },
          row: {
            data,
            index: rowIndex,
          },
        },
      });
    },
    onColumnHeaderClicked({ column }) {
      this.$emit("trigger-event", {
        name: "onColumnHeaderClicked",
        event: {
          column: {
            fieldName: column.colDef.field,
          },
        },
      });
    },
    onServerSidePaginationPageChange(page) {
      this.$emit("trigger-event", {
        name: "onServerSidePaginationPageChange",
        event: {
          page,
        },
      });
    },
    onActionButtonClicked(eventName, eventPayload) {
      this.$emit("trigger-event", {
        name: eventName,
        event: {
          ...eventPayload,
        },
      });
    },
    parseLibraryPathIntoGrid(path) {
      if (!path) return '';

      return path
          .replace(/']\['/g, ".")
          .replace("['", "")
          .replace("']", "");
    },
    buildValueGetter(valueGetterConfig) {
      const code = valueGetterConfig?.code;
      if (!code) return undefined;

      try {
        return new Function("row", `try { ${code} } catch { return ''; }`);
      } catch {
        return undefined;
      }
    },
    getActionButtonInitialConfig(actionType) {
      switch (actionType) {
        case "Custom":
          return {
            textColor: this.content?.color?.text,
            icon: "apart-icons/cursor-click-02",
          };
        case "EditItem":
          return {
            textColor: this.content?.color?.text,
            icon: "apart-icons/pencil-01",
          };
        case "RemoveItem":
          return {
            textColor: this.content?.color?.destructive,
            icon: "apart-icons/trash-01",
          };
        default:
          return {
            textColor: this.content?.color?.text,
            icon: "apart-icons/cursor-click-02",
          };
      }
    },
    buildActionButtonInitialProps(buttonType, actionType) {
      const { textColor, icon } = this.getActionButtonInitialConfig(actionType);
      return buttonType === "ww-button" ? {
        _state: {
          name: "Action Button Element",
          style: {
            default: {
              backgroundColor: "transparent",
              height: "20px",
              padding: "0px",
              cursor: "pointer",
            },
          },
        },
        content: {
          buttonType: "button",
          "_ww-text_color": textColor,
          "_ww-text_fontSize": "14px",
          "_ww-text_fontWeight": 700,
          "_ww-text_lineHeight": "20px",
          "_ww-text_text": "Text",
        },
      } : {
        _state: {
          name: "Action Button Element",
          style: {
            default: {
              cursor: "pointer",
            },
          },
        },
        content: {
          icon,
        },
      };
    },
    detectColumnDataType(dataPath) {
      const sampleData = this.rowData[0]?.[dataPath] ?? null;
      if (!sampleData) return "text";

      switch (typeof sampleData) {
        case "string":
          return "text";
        case "bigint":
        case "number":
          return "number";
        case "boolean":
          return "boolean";
        case "object":
          if (sampleData instanceof Date) return "date";
          return "object";
        default:
          return "text";
      }
    },
    buildFilterColumnConfig(columnConfig, dataPath) {
      const { dataType, filterable } = columnConfig;
      const isDataTypeFilterable = dataType === null || FILTERABLE_DATA_TYPES.includes(dataType);
      if (!filterable || !isDataTypeFilterable) return null;

      const defaultFilterConfig = {
        filterParams: {
          buttons: ["apply", "clear", "reset", "cancel"],
          closeOnApply: true,
        },
      };
      const type = dataType === null ? this.detectColumnDataType(dataPath) : dataType;
      switch (type) {
        case "text":
          return {
            ...defaultFilterConfig,
            filter: FILTER_DATATYPE_TO_COMPARATOR_MAP["text"],
          };
        case "number":
          return {
            ...defaultFilterConfig,
            filter: FILTER_DATATYPE_TO_COMPARATOR_MAP["number"],
          };
        case "date":
        case "dateString":
        case "timestamp":
          return {
            ...defaultFilterConfig,
            filter: FILTER_DATATYPE_TO_COMPARATOR_MAP["date"],
          };
        default:
          return {
            ...defaultFilterConfig,
            filter: FILTER_DATATYPE_TO_COMPARATOR_MAP["text"],
          };
      }
    },
  },
  data() {
    return {
      modules: [ClientSideRowModelModule],
      api: null,
      displayedRowsCount: 0,
      dataTypeDefinitions: {
        timestamp: {
          baseDataType: "date",
          extendsDataType: "date",
          valueFormatter: ({ value }) => {
            let dateObject = null;

            if (typeof value === "number") {
              dateObject = !Number.isNaN(value) ? new Date(value) : null;
            } else if (typeof value === "string") {
              const numericValue = Number.parseInt(value);
              dateObject = !Number.isNaN(numericValue) ? new Date(numericValue) : null;
            }

            return [
              dateObject?.getDate(),
              dateObject?.getMonth() ? dateObject?.getMonth() + 1 : null,
              dateObject?.getFullYear(),
            ].filter(s => s).join("/");
          },
        }
      },
    };
  },
  watch: {
    /* wwEditor:start */
    "content.columnConfig": {
      deep: true,
      handler(columns) {
        if (!Array.isArray(columns)) return;

        const existingCellElementIds = Object.keys(this.content?.cellElements ?? []);
        const cellElementsToAdd = columns
          .map(({ id: columnId, dataType: columnDataType }) => ({
            columnId,
            columnDataType,
            wwElementType: DATATYPE_TO_WW_ELEMENT_MAP[columnDataType],
          }))
          .filter(({ columnId, wwElementType }) => wwElementType && !existingCellElementIds.includes(columnId));

        cellElementsToAdd.forEach(async ({ columnId: id, columnDataType, wwElementType }) => {
          const cellElement = await this.createElement(
            wwElementType,
            {
              _state: { name: `Cell Element - ${columnDataType}` },
            },
          );
          this.$emit("update:content:effect", {
            cellElements: {
              ...this.content.cellElements,
              [id]: cellElement,
            },
          });
        });

        const existingCellLayoutIds = Object.keys(this.content?.cellLayouts ?? {});
        const cellLayoutsToAdd = columns
          .map((column, index) => ({ ...column, index }))
          .filter(({ id: columnId, dataType }) => dataType === "custom-layout" && !existingCellLayoutIds.includes(`layout-${columnId}`));

        cellLayoutsToAdd.forEach(async ({ id: columnId, index }) => {
          const cellLayoutContainer = await this.createElement(
            "ww-flexbox",
            {
              _state: {
                name: `Cell Layout - ${index + 1}`,
                style: {
                  default: {
                    width: "100%",
                  },
                },
              },
            },
          );
          this.$emit("update:content:effect", {
            cellLayouts: {
              ...this.content.cellLayouts,
              [`layout-${columnId}`]: [cellLayoutContainer],
            },
          });
        });
      },
    },
    "content.rowConfig.actionButtons": {
      deep: true,
      handler(buttons) {
        if (!Array.isArray(buttons)) return;

        const existingActionButtonElementIds = Object.keys(this.content?.actionButtonElements ?? []);
        const actionButtonElementsToAdd = buttons.filter(({ wwElementId, buttonType }) => {
          if (!buttonType) return false;
          if (!existingActionButtonElementIds.includes(wwElementId)) return true;
          const existingElement = this.content.actionButtonElements[wwElementId];
          const wwObject = wwLib.wwObjectHelper.getWwObject(existingElement?.uid);
          return wwObject?.type !== wwLib.wwObjectHelper.typeAliases[buttonType];
        });
        actionButtonElementsToAdd.forEach(async ({ wwElementId: id, buttonType, actionType }) => {
          const props = this.buildActionButtonInitialProps(buttonType, actionType);
          const actionButtonElement = await this.createElement(
              buttonType,
              props,
          );
          this.$emit("update:content:effect", {
            actionButtonElements: {
              ...this.content.actionButtonElements,
              [id]: actionButtonElement,
            },
          });
        });
      },
    }
    /* wwEditor:end */
  },
};
</script>

<style lang="scss">
.mywork-custom-table {
  &--container {
    height: 100%;
    width: 100%;
  }
  .mywork-custom-table--grid-table--filled {
    .ag-layout-auto-height {
      .ag-center-cols-viewport {
        min-height: unset !important;
      }
    }
  }
}
</style>
