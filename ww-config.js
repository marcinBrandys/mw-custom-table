const isDataSourceDefined = (content) => {
  if (!content.dataSource) return false;

  return Array.isArray(content.dataSource) ? content.dataSource.length > 0 : false;
};

const generateDataSourceObjectPaths = (content) => {
  if (!isDataSourceDefined(content)) return {};

  return content.dataSource[0];
}

export default {
  inherit: {
    type: 'ww-text',
  },
  editor: {
    label: {
      en: "Custom Table",
    },
  },
  properties: {
    /* Settings - data */
    dataSource: {
      label: {
        en: "Data source",
      },
      section: "settings",
      type: "Array",
      defaultValue: [],
      bindable: true,
      options: {
        item: {
          type: "Object",
          properties: {
            value: {
              label: {
                en: "Value",
              },
              type: "String",
            },
            label: {
              label: {
                en: "Label",
              },
              type: "String",
            }
          },
        }
      },
    },

    /* Settings - columns */
    columnConfig: {
      label: {
        en: "Columns",
      },
      section: "settings",
      type: "Array",
      defaultValue: [],
      hidden: content => !isDataSourceDefined(content),
      options: {
        item: {
          type: "Object",
          defaultValue: {
            dataType: null,
            sortable: true,
            visible: true,
          },
          options: {
            item: {
              path: {
                label: {
                  en: "Path",
                },
                type: "ObjectPropertyPath",
                options: (content) => ({
                  object: generateDataSourceObjectPaths(content),
                }),
              },
              label: {
                label: {
                  en: "Label",
                },
                type: "Text",
              },
              dataType: {
                label: { en: "Data Type" },
                type: "TextSelect",
                options: {
                  options: [
                    { value: null, label: "Automatic detection" },
                    { value: "text", label: "Text" },
                    { value: "number", label: "Number" },
                    { value: "boolean", label: "True/False" },
                    { value: "date", label: "Date" },
                    { value: "dateString", label: "Date String" },
                    { value: "object", label: "Object" },
                  ],
                },
              },
              sortable: {
                label: {
                  en: "Sortable",
                },
                bindable: true,
                type: "OnOff",
              },
              visible: {
                label: {
                  en: "Visible",
                },
                bindable: true,
                type: "OnOff",
              },
            },
          },
        },
        movable: true,
        expandable: true,
        getItemLabel(item, index) {
          return item.label ? `Column: ${item.label}` : `Column: ${index + 1}`;
        },
      },
    },

    /* Settings - row */
    rowConfig: {
      label: {
        en: "Row configuration",
      },
      section: "settings",
      type: "Object",
      defaultValue: {
        selectionMode: null,
      },
      options: {
        item: {
          selectionMode: {
            label: {
              en: "Selection mode",
            },
            type: "TextSelect",
            bindable: true,
            options: {
              options: [
                {
                  value: null,
                  label: {
                    en: "None",
                  },
                },
                {
                  value: "singleRow",
                  label: {
                    en: "Single selection",
                  },
                },
                {
                  value: "multiRow",
                  label: {
                    en: "Multi selection",
                  },
                }
              ],
            },
          },
        },
      },
    },

    /* Settings - pagination */
    pagination: {
      label: {
        en: "Pagination",
      },
      section: "settings",
      type: "Object",
      defaultValue: {
        enabled: true,
        pageSize: 50,
        pageSizeOptions: [10, 25, 50, 100],
      },
      options: {
        item: {
          enabled: {
            label: {
              en: "Enabled",
            },
            type: "OnOff",
            defaultValue: true,
            bindable: true,
          },
          pageSize: {
            label: {
              en: "Default page size",
            },
            type: "Number",
            defaultValue: 50,
            bindable: true,
            options: {
              min: 1,
              max: 1000,
              step: 1,
            }
          },
          pageSizeOptions: {
            label: {
              en: "Page size options"
            },
            type: "Array",
            defaultValue: [10, 25, 50, 100],
            bindable: true,
            options: {
              fixed: false,
              item: {
                label: {
                  en: "Page size option",
                },
                type: "Number",
                options: {
                  min: 1,
                  max: 1000,
                  step: 1,
                },
              },
            },
          },
        },
      },
    },

    /* Styles - colors */
    colorSectionInfo: {
      label: {
        en: "Colors",
      },
      type: "Info",
      options: {
        text: {
          en: "Colors",
        },
      },
    },
    color: {
      type: "Object",
      defaultValue: {
        brand: "#FC8C59",
        foreground: "#D5D7DA",
        background: "#FFFFFF",
        backgroundActive: "#FAFAFA",
        text: "#181D27"
      },
      options: {
        item: {
          brand: {
            label: {
              en: "Brand color",
            },
            type: "Color",
            bindable: true,
          },
          foreground: {
            label: {
              en: "Foreground color",
            },
            type: "Color",
            bindable: true,
          },
          background: {
            label: {
              en: "Background color",
            },
            type: "Color",
            bindable: true,
          },
          backgroundActive: {
            label: {
              en: "Active Background color",
            },
            type: "Color",
            bindable: true,
          },
          text: {
            label: {
              en: "Default text color",
            },
            type: "Color",
            bindable: true,
          },
        },
      },
    },

    /* Styles - fonts */
    fontSectionInfo: {
      label: {
        en: "Font Styles",
      },
      type: "Info",
      options: {
        text: {
          en: "Font Styles",
        },
      },
    },
    font: {
      type: "Object",
      defaultValue: {
        fontSize: "14px",
        fontFamily: "Inter",
      },
      options: {
        item: {
          fontSize: {
            label: {
              en: "Font - Font size",
            },
            type: "Length",
            bindable: true,
            options: {
              unitChoices: [
                {
                  value: "px",
                  label: "px",
                  min: 1,
                  max: 100
                },
              ],
            },
          },
          fontFamily: {
            type: "FontFamily",
            label: {
              en: "Font - Font Family",
            },
          },
        },
      },
    },

    /* Styles - border */
    borderSectionInfo: {
      label: {
        en: "Border Styles",
      },
      type: "Info",
      options: {
        text: {
          en: "Border Styles",
        },
      },
    },
    border: {
      type: "Object",
      defaultValue: {
        color: "#E9EAEB",
        radius: "8px",
      },
      options: {
        item: {
          color: {
            label: {
              en: "Border - color",
            },
            type: "Color",
            defaultValue: "#E9EAEB",
            bindable: true,
          },
          radius: {
            label: {
              en: "Border - radius",
            },
            type: "Length",
            bindable: true,
            options: {
              unitChoices: [
                {
                  value: "px",
                  label: "px",
                  min: 0,
                  max: 100
                },
              ]
            }
          },
        }
      },
    },

    /* Styles - header */
    headerSectionInfo: {
      label: {
        en: "Header Styles",
      },
      type: "Info",
      options: {
        text: {
          en: "Header Styles",
        },
      },
    },
    header: {
      type: "Object",
      defaultValue: {
        backgroundColor: "#FAFAFA",
        textColor: "#717680",
        fontSize: "12px",
      },
      options: {
        item: {
          backgroundColor: {
            label: {
              en: "Header - Background color",
            },
            type: "Color",
            bindable: true,
          },
          textColor: {
            label: {
              en: "Header - Text color",
            },
            type: "Color",
            bindable: true,
          },
          fontSize: {
            label: {
              en: "Header - Font size",
            },
            type: "Length",
            bindable: true,
            options: {
              unitChoices: [
                {
                  value: "px",
                  label: "px",
                  min: 1,
                  max: 100
                },
              ]
            }
          }
        },
      },
    },
  },
  triggerEvents: [
    {
      name: "onTableReady",
      label: {
        en: "onTableReady: The table has initialised and is ready for most api calls, but may not be fully rendered yet",
      },
    },
    {
      name: "onFirstDataRendered",
      label: {
        en: "onFirstDataRendered: Fired the first time data is rendered into the table",
      },
    },
    {
      name: "onModelUpdated",
      label: {
        en: "onModelUpdated: Displayed rows have changed. Triggered after sort, filter or tree expand / collapse events.",
      },
    },
    {
      name: "onSelectionChanged",
      label: {
        en: "onSelectionChanged: Triggered after selection changed. Pass selected rows array",
      },
      event: {
        selectedRows: [],
      },
    },
    {
      name: "onPaginationChanged",
      label: {
        en: "onPaginationChanged: Triggered every time the paging state changes. Pass current pagination state",
      },
      event: {
        pageSize: 10,
        currentPage: 1,
        totalPages: 5,
        totalElements: 50,
        isLastPage: false,
      },
    },
    {
      name: "onSortChanged",
      label: {
        en: "onSortChanged: Triggered every time the sort state changes. Pass current sort state",
      },
      event: {
        sortState: [
          {
            field: "id",
            sortDirection: "desc",
          },
          {
            field: "name",
            sortDirection: null,
          },
        ],
      },
    },
    {
      name: "onRowClicked",
      label: {
        en: "onRowClicked",
      },
      event: {
        row: {
          data: {},
          index: 0,
        },
      },
    },
    {
      name: "onRowDoubleClicked",
      label: {
        en: "onRowDoubleClicked",
      },
      event: {
        row: {
          data: {},
          index: 0,
        },
      },
    },
    {
      name: "onCellClicked",
      label: {
        en: "onCellClicked",
      },
      event: {
        cell: {
          data: "data",
          fieldName: "field",
        },
        row: {
          data: {},
          index: 0,
        },
      },
    },
    {
      name: "onCellDoubleClicked",
      label: {
        en: "onCellDoubleClicked",
      },
      event: {
        cell: {
          data: "data",
          fieldName: "field",
        },
        row: {
          data: {},
          index: 0,
        },
      },
    },
    {
      name: "onColumnHeaderClicked",
      label: {
        en: "onColumnHeaderClicked",
      },
      event: {
        column: {
          fieldName: "field",
        },
      },
    },
  ],
};
