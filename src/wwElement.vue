<template>
  <div class="my-element">
    <p :style="textStyle">I am a custom element !</p>
    <span>{{ rowData.length }}</span>
    <!-- The AG Grid component -->
<!--    <ag-grid-vue-->
<!--        :rowData="[]"-->
<!--        :columnDefs="[]"-->
<!--        style="height: 500px"-->
<!--    >-->
<!--    </ag-grid-vue>-->
    <ag-grid-vue
        class="ag-theme-quartz"
        :rowData="rowData"
        :columnDefs="colDefs"
        style="height: 500px"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { ref } from "vue";
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default {
  components: {
    AgGridVue,
  },
  props: {
    content: { type: Object, required: true },
  },
  computed: {
    textStyle() {
      return {
        color: this.content.textColor,
      };
    },
  },
  setup() {
    // Row Data: The data to be displayed.
    const rowData = ref([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    // Column Definitions: Defines the columns to be displayed.
    const colDefs = ref([
      { field: "make" },
      { field: "model" },
      { field: "price" },
      { field: "electric" }
    ]);

    return {
      rowData,
      colDefs,
    };
  },
  // setup() {
  //   ModuleRegistry.registerModules([AllCommunityModule]);
  // }
};
</script>

<style lang="scss" scoped>
.my-element {
  p {
    font-size: 18px;
  }
}
</style>
