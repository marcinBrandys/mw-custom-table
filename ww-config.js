export default {
  editor: {
    label: {
      en: "Custom Table",
    },
  },
  properties: {
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
    columnConfig: {
      label: {
        en: "Columns config",
      },
      section: "settings",
      type: "Array",
      defaultValue: [],
      bindable: true,
      options: {
        item: {
          type: "Object",
          label: "Column config",
          options: {
            item: {
              field: {
                label: {
                  en: "Field name",
                },
                type: "Text",
              },
              headerName: {
                label: {
                  en: "Label",
                },
                type: "Text",
              },
              sortable: {
                label: {
                  en: "Sortable",
                },
                type: "OnOff",
                defaultValue: true,
              },
            },
          },
        },
        fixed: false,
      },
    },
    foregroundColor: {
      label: {
        en: "Foreground color",
      },
      type: "Color",
      defaultValue: "#FAFAFA",
      bindable: true,
    },
    backgroundColor: {
      label: {
        en: "Background color",
      },
      type: "Color",
      defaultValue: "#FFFFFF",
      bindable: true,
    },
    headerBackgroundColor: {
      label: {
        en: "Header background color",
      },
      type: "Color",
      defaultValue: "#FAFAFA",
      bindable: true,
    },
    borderColor: {
      label: {
        en: "Border color",
      },
      type: "Color",
      defaultValue: "#E9EAEB",
      bindable: true,
    },
    borderRadius: {
      label: {
        en: "Border radius",
      },
      type: "Number",
      defaultValue: 8,
      bindable: true,
      options: {
        min: 0,
        max: 100,
        step: 1,
      }
    },
    headerTextColor: {
      label: {
        en: "Header text color",
      },
      type: "Color",
      defaultValue: "#717680",
      bindable: true,
    },
    textColor: {
      label: {
        en: "Default text color",
      },
      type: "Color",
      defaultValue: "#181D27",
      bindable: true,
    },
    fontSize: {
      label: {
        en: "Font size",
      },
      type: "Number",
      defaultValue: 14,
      bindable: true,
      options: {
        min: 0,
        max: 100,
        step: 1,
      }
    },
    headerFontSize: {
      label: {
        en: "Header font size",
      },
      type: "Number",
      defaultValue: 12,
      bindable: true,
      options: {
        min: 0,
        max: 100,
        step: 1,
      }
    },
  },
};
