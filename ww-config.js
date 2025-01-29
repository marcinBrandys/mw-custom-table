export default {
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
        foreground: "#FAFAFA",
        background: "#FFFFFF",
        text: "#181D27"
      },
      options: {
        item: {
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
};
