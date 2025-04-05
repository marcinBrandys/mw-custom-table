<script>
import { computed, toRefs } from "vue";
const BOUNDARY_COUNT = 2;
const SIBLING_COUNT = 2;
export default {
  props: {
    state: { type: Object, required: true },
    colorConfig: { type: Object, required: true },
    borderConfig: { type: Object, required: true },
    pagingElementsConfig: { type: Object, required: true },
  },
  emits: ["onPageChange"],
  setup(props, { emit }) {
    const { state, borderConfig, pagingElementsConfig } = toRefs(props);
    const pages = computed(() => {
      return [...Array(state.value.total_pages).keys()].map((i) => {
        return {
          index: i + 1,
          isActive: i + 1 === state.value.page,
          isSkipped: false,
        };
      }).filter(({ index: pageIndex }, iterationIndex, { length }) => {
        if (iterationIndex < BOUNDARY_COUNT || iterationIndex >= length - BOUNDARY_COUNT) return true;

        const activePage = state.value.page;
        return pageIndex > activePage - SIBLING_COUNT - 1 && pageIndex < activePage + SIBLING_COUNT + 1;
      }).reduce((acc, value) => {
        const lastItem = acc[acc.length - 1];
        return lastItem?.index !== undefined && lastItem.index !== value.index - 1
            ? [...acc, { index: -1, isActive: false, isSkipped: true }, value]
            : [...acc, value];
      }, []);
    });
    const prevPage = computed(() => {
      return state.value.prev_page ?? null;
    });
    const nextPage = computed(() => {
      return state.value.next_page ?? null;
    });
    const changePage = (page) => {
      emit("onPageChange", page);
    };
    return {
      prevPage,
      nextPage,
      pages,
      changePage,
    };
  },
}
</script>

<template>
  <div class="custom-table--server-side-paginator--wrapper" :style="{ borderColor: borderConfig?.color, borderRadius: borderConfig?.radius }">
    <div>
      <div
        v-if="prevPage !== null && pagingElementsConfig?.PrevPageButtonElement"
        class="custom-table--server-side-paginator--nav-button"
        @click="changePage(prevPage)"
        :style="{ borderColor: borderConfig?.color }"
      >
        <wwElement
          v-bind="pagingElementsConfig.PrevPageButtonElement"
        ></wwElement>
      </div>
    </div>
    <div class="custom-table--server-side-paginator--page-picker">
      <button
        v-for="page in pages"
        :key="page.index"
        @click="changePage(page.index)"
        class="custom-table--server-side-paginator--page-button"
        :class="{'custom-table--server-side-paginator--page-button--active': page.isActive, 'custom-table--server-side-paginator--page-button--skipped': page.isSkipped}"
        :disabled="page.isSkipped || page < 0"
        :style="{ color: page.isActive ? colorConfig?.text : colorConfig?.tertiary, backgroundColor: page.isActive ? colorConfig?.backgroundActive : 'inherit' }"
      >{{ !page.isSkipped ? page.index : "..." }}</button>
    </div>
    <div>
      <div
        v-if="nextPage !== null && pagingElementsConfig?.NextPageButtonElement"
        class="custom-table--server-side-paginator--nav-button"
        @click="changePage(nextPage)"
        :style="{ borderColor: borderConfig?.color }"
      >
        <wwElement
          v-bind="pagingElementsConfig.NextPageButtonElement"
        ></wwElement>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-table--server-side-paginator--wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 24px;
  border: 1px solid;
}
.custom-table--server-side-paginator--page-picker {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
}
.custom-table--server-side-paginator--page-button {
  display: block;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  padding: 10px 8px 10px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  margin: 0 2px;
  &--skipped {
    cursor: default;
    pointer-events: none;
    &:hover {
      cursor: default;
    }
  }
}
.custom-table--server-side-paginator--nav-button {
  display: block;
  height: 40px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid;
  border-radius: 8px;
}
</style>
