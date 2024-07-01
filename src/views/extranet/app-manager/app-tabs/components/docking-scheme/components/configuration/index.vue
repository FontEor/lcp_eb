<template>
  <div class="configuration">
    <div class="configuration__header">
      <el-page-header @back="backToList" :content="currentRow.unitName" />
    </div>
    <div class="configuration__content">
      <el-radio-group v-model="selectedRadio">
        <el-radio-button
          :label="$t('openBusinessConfiguration.index.5izj77tvj9s0')"
        />
        <el-radio-button
          :label="$t('openBusinessConfiguration.index.5izj77tvjug0')"
        />
      </el-radio-group>
      <div class="content__table">
        <InterfaceList
          :currentRow.sync="currentRow"
          :appKey.sync="appKey"
          v-if="
            selectedRadio === $t('openBusinessConfiguration.index.5izj77tvj9s0')
          "
        />
        <MessageList
          :currentRow.sync="currentRow"
          :appKey.sync="appKey"
          v-if="
            selectedRadio === $t('openBusinessConfiguration.index.5izj77tvjug0')
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceList from "./components/interface-list.vue";
import MessageList from "./components/message-list.vue";

export default {
  name: "Configuration",
  components: {
    InterfaceList,
    MessageList,
  },
  props: {
    currentRow: {
      type: Object,
      default() {
        return {};
      },
    },
    appKey: {
      type: String,
      required: true,
    },
    appType: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectedRadio: this.$t("openBusinessConfiguration.index.5izj77tvj9s0"),
    };
  },
  methods: {
    backToList() {
      this.$emit("update:showComponent", "TableList");
    },
  },
};
</script>

<style lang="scss" scoped>
.configuration {
  .configuration__header {
    .el-page-header {
      ::v-deep .el-page-header__content {
        font-size: 16px;
      }
    }
  }
  .configuration__content {
    .el-radio-group {
      display: flex;
      justify-content: center;
      .el-radio-button {
        font-weight: normal;
        ::v-deep.el-radio-button__orig-radio:checked + .el-radio-button__inner {
          color: #3c6ef0;
          background: #fff;
        }
      }
    }
    .content__table {
      margin-top: 20px;
    }
  }
}
</style>
