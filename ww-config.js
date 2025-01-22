export default {
  editor: {
    label: {
      en: "Custom Table",
    },
  },
  properties: {
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
      defaultValue: null,
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
    cellTextColor: {
      label: {
        en: "Cell text color",
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
  },
};
