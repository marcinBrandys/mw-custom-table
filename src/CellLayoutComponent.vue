<script>
import { provide } from "vue";

export default {
  setup(props) {
    const { id: rowId, rowIndex } = props.params.node;
    const { data, dataPath, layoutPath, componentContent } = props.params;
    provide("componentContent", componentContent);
    provide("bindingContext", {
      parent: null,
      data: {
        ...data,
      },
      index: rowIndex,
      repeatIndex: 0,
      isACopy: false,
      repeatedItems: null,
    });
    return {
      rowId,
      data,
      dataPath,
      layoutPath,
    };
  },
}
</script>

<template>
  <wwLayout :path="layoutPath" direction="column">
    <template #default="{ item }">
      <wwElement v-bind="item" />
    </template>
  </wwLayout>
</template>

<style scoped lang="scss">
</style>
