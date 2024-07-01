<template>
  <div :class="{ 'is-empty': emptyImageVisible }" class="left-version-list">
    <ul
      v-infinite-scroll="scrollLoad"
      :infinite-scroll-disabled="computeInfiniteScrollDisabled"
      :infinite-scroll-immediate="false"
      class="left-version-list__list"
    >
      <li
        v-for="{ id, version } in list"
        :key="id"
        :class="{ 'is-active': judgeListItemIsActiveClassName(id) }"
        ref="listItem"
        class="list__item"
        @click="onClickListItem(id, version)"
      >
        {{ version }}
      </li>
    </ul>
    <p v-if="loadingTextVisible" class="left-version-list__loading-text">
      加载中...
    </p>
    <p v-if="computeNoMoreVisible" class="left-version-list__no-more-text">
      没有更多了
    </p>
  </div>
</template>

<script>
export default {
  name: "LeftVersionList",
  props: {
    emptyImageVisible: { type: Boolean, required: true },
    list: { type: Array, required: true },
    pageNum: { type: Number, required: true },
    total: { type: Number, required: true },
    currentVersionId: { type: Number, required: true },
    currentVersionName: { type: String, required: true },
    loadingTextVisible: { type: Boolean, required: true },
  },
  computed: {
    computeInfiniteScrollDisabled() {
      const { loadingTextVisible, computeNoMoreVisible } = this;
      return loadingTextVisible || computeNoMoreVisible;
    },
    computeNoMoreVisible() {
      const {
        list: { length },
        total,
      } = this;
      return length > 30 && total <= length;
    },
  },
  methods: {
    scrollLoad() {
      this.$emit("scrollLoad");
    },
    judgeListItemIsActiveClassName(id) {
      const { currentVersionId } = this;
      return id === currentVersionId;
    },
    onClickListItem(id, version) {
      this.$emit("update:currentVersionId", id);
      this.$emit("update:currentVersionName", version);
      this.$emit("clickLeftVersionListItem");
    },
  },
};
</script>

<style lang="scss" scoped>
.left-version-list {
  width: 200px;
  height: 480px;
  overflow: auto;
  background-color: #f5f5f5;

  &.is-empty {
    background-color: #fff;
  }

  .left-version-list__list {
    .list__item {
      line-height: 32px;
      text-align: center;
      cursor: pointer;

      &.is-active {
        color: #3c6ef0;
        font-weight: 600;
      }
    }
  }

  .left-version-list__loading-text,
  .left-version-list__no-more-text {
    line-height: 32px;
    text-align: center;
    cursor: default;
  }
}
</style>