<script>
export default {
  setup(props) {
    const { value: buttons } = props.params.colDef;
    const { id: rowId } = props.params.node;
    const { data } = props.params;
    return {
      buttons,
      rowId,
      data,
    };
  },
  methods: {
    getEventName(button) {
      if (button.actionType === "Custom") return "onRowCustomActionButtonClicked";
      return button.actionType === "RemoveItem" ? "onRowRemove" : "onRowEdit";
    },
    getEventPayload(button) {
      if (button.actionType === "Custom") {
        return {
          actionName: button.customActionName,
          row: {
            data: this.data,
          },
        }
      }

      return {
        row: {
          data: this.data,
        },
      };
    },
    onClick(button) {
      button.onActionButtonClicked(this.getEventName(button), this.getEventPayload(button));
    }
  }
}
</script>

<template>
  <div class="custom-table--action-buttons--container">
    <div
        v-for="button in buttons"
        :key="`${rowId}-action-button-${button.actionType}-${button.customActionName}`"
        class="custom-table--action-button"
    >
      <wwElement
          @click="onClick(button)"
          v-bind="button.wwElement"
          :ww-props="{ isFixed: true }"
      ></wwElement>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-table--action-buttons--container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.custom-table--action-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 24px;
}
</style>
