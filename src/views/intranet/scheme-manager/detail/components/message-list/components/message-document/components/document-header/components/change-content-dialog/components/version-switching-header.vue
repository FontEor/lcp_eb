<template>
  <section class="version-switching-header">
    <div class="version-switching-header__title-wrapper">
      <Title :text="upcomingVersionSwitch | formatTitleText" />
      <el-switch
        :value="upcomingVersionSwitch"
        @change="onChangeUpcomingVersionSwitch"
      />
      <el-tooltip
        content="你可以通过切换开关对比消息文档待更新版本、当前版本的差异。"
        effect="dark"
        placement="top"
        style="margin-left: 8px"
      >
        <i class="el-icon-info-empty" />
      </el-tooltip>
    </div>

    <div class="version-switching-header__explain-wrapper">
      <p>变更项说明：</p>
      <p
        v-for="{ text, className } in explainTextList"
        :key="text"
        :class="className | formatExplainClassName"
      >
        {{ text }}
      </p>
    </div>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";

export default {
  name: "VersionSwitchingHeader",
  components: { Title },
  props: {
    upcomingVersionSwitch: { type: Boolean, required: true },
    firstTipVisible: { type: Boolean, required: true },
  },
  data() {
    return {
      popoverVisible: true,

      explainTextList: [
        { text: "新增", className: "create" },
        { text: "修改", className: "update" },
        { text: "删除", className: "delete" },
      ],
    };
  },
  filters: {
    formatTitleText(value) {
      return value ? "待更新版本" : "当前版本";
    },
    formatExplainClassName(value) {
      return value
        ? `explain-wrapper__explain ${value}`
        : "explain-wrapper__explain";
    },
  },
  methods: {
    onChangeUpcomingVersionSwitch(value) {
      this.$emit("update:upcomingVersionSwitch", value);
      this.$emit("update:firstTipVisible", false);
      const { name } = this.$route;
      const direction = "internalCallExternal";
      const key = `${name}/${direction}/ChangeContentDialog/firstTipVisible`;
      localStorage.setItem(key, `${this.firstTipVisible}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.version-switching-header {
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  .version-switching-header__title-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .title {
      width: 88px;

      ::v-deep .title__text {
        margin-right: 4px;
        font-size: 14px;
        color: #333;
      }
    }
  }

  .version-switching-header__explain-wrapper {
    margin-right: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .explain-wrapper__explain {
      margin-left: 4px;
      padding: 0 8px;
      border-radius: 4px;

      &.create {
        color: #26a872;
        background-color: #e9f6f0;
      }

      &.update {
        color: #ff7700;
        background-color: #fdf1e6;
      }

      &.delete {
        text-decoration: line-through;
        color: #e1251b;
        background-color: #fce9e8;
      }
    }
  }
}
</style>