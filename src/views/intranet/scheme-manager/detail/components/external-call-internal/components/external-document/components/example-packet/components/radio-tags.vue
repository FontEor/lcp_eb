<template>
  <div
    :class="{
      'radio-tags_wrap': dynTabMap.length,
      'radio-tags-wrap_editAble': editAble,
      'radio-tags-wrap_editDisable': !editAble,
    }"
  >
    <template v-if="dynTabMap.length">
      <el-radio-group v-model="activeTabName">
        <el-radio
          :class="radioClassName(index, item.tag)"
          :label="item.tag"
          border
          v-for="(item, index) in dynTabMap"
          :key="item.tag"
        >
          <div @dblclick="handleChangeTabItemEditStatus(item)">
            <el-tooltip
              v-if="item.tooltipInfo && item.tooltipInfo.content"
              :content="item.tooltipInfo.content"
              :placement="item.tooltipInfo.placement || 'top'"
              :effect="item.tooltipInfo.effect || 'dark'"
            >
              <div>
                {{ item.tag }}
                <span
                  class="el-icon-close close"
                  v-if="editAble && index < dynTabMapLen - 1"
                  @click="handleDeleteTab(item.tag)"
                ></span>
              </div>
            </el-tooltip>
            <template v-else>
              {{ item.tag }}
              <span
                class="el-icon-close close"
                v-if="editAble && index < dynTabMapLen - 1"
                @click="handleDeleteTab(item.tag)"
              ></span>
            </template>
            <el-form
              class="tab-item-input"
              v-show="editAble && index < dynTabMapLen - 1 && item.edit"
            >
              <el-form-item :error="item.errorMessage">
                <el-input
                  v-model="item.tag"
                  @change="() => handleEditTabItem(item)"
                  @input="handleChangeTabName(item.tag, 'errorMessage', item)"
                  @blur="() => handleEditTabItem(item)"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-radio>
      </el-radio-group>
      <div v-if="editAble">
        <el-button
          v-show="!addNewTab"
          icon="el-icon-plus"
          class="radio-last"
          @click="addNewTab = true"
          >新增</el-button
        >
        <el-form v-show="addNewTab" @submit.native.prevent>
          <el-form-item :error="addNewTabErrorMessage">
            <el-input
              v-model="newTabName"
              @change="handleAddNewTab"
              @blur="handleAddNewTab"
              @input="handleChangeTabName"
              class="add-input"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>
<script>
const tabNameReg = /^[0-9a-zA-Z\u4e00-\u9fa5]{2,6}$/;
export default {
  props: {
    dynTabList: {
      type: Array,
      default: () => [],
      /**
       * sync
       * dynTabList:[{
       *  tag: String, tag名称 必填
       *  content: String, tag对应的报文示例 选填,
       *  tooltipInfo:{ 当前tag hover时的tooltip信息 选填（默认没有）
       *    content: String, tooltip提示信息 必填
       *    placement: String, 展示位置 选填（默认 Top Center）
       *    effect: String, 主题 选填（默认dark）
       *
       *  }
       *
       * }]
       */
    },
    currentTabName: {
      type: String,
      default: "",
    },
    editAble: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      addNewTab: false,
      newTabName: "",
      dynTabMap: [],
      addNewTabErrorMessage: "",
    };
  },
  computed: {
    dynTabMapLen() {
      return (this.dynTabMap || []).length;
    },
    activeTabName: {
      set(newVal) {
        this.$emit("update:currentTabName", newVal);
      },
      get() {
        return this.currentTabName;
      },
    },
  },
  watch: {
    activeTabName() {
      this.addNewTab = false;
      this.addNewTabErrorMessage = "";
    },
    dynTabList: {
      handler(newList) {
        this.dynTabMap = newList.map((itemObj) => {
          return {
            ...itemObj,
            edit: false,
          };
        });
      },
      immediate: true,
    },
  },
  methods: {
    radioClassName(index, tag) {
      const dynTabMapLen = (this.dynTabMap || []).length;
      let className = "";
      if (+index === 0) {
        if (!this.editAble && dynTabMapLen === 1) {
          className = "";
        } else {
          className += "radio-first ";
        }
      } else {
        if (+index === dynTabMapLen - 1 && !this.editAble) {
          className += "radio-last ";
        } else {
          className += "radio-middle ";
        }
      }
      tag === this.activeTabName && (className += "active-tab ");
      return className;
    },
    handleChangeTabItemEditStatus(itemObj) {
      this.editAble && (itemObj.edit = true);
    },
    handleChangeTabName(
      testValue = this.newTabName,
      errorMessageKey = "addNewTabErrorMessage",
      errorMessageObj = this
    ) {
      const pass = tabNameReg.test(testValue);
      if (!pass) {
        errorMessageObj[errorMessageKey] = "可输入数字、中文、英文字符，且长度为2-6";
      } else {
        errorMessageObj[errorMessageKey] = "";
      }
      return pass;
    },
    resetAddNewTabStatus() {
      this.addNewTab = false;
      this.newTabName = "";
    },
    handleAddNewTab() {
      if (!this.newTabName) {
        this.resetAddNewTabStatus();
        return;
      }
      if (!this.handleChangeTabName()) return;
      if (this.dynTabList.length >= 6) {
        this.$message({
          message: "最多6个标签",
          type: "warning",
        });
        this.resetAddNewTabStatus();
        return;
      }
      const isExist = this.dynTabList.find(
        (itemObj) => itemObj.tag === this.newTabName
      );
      if (isExist) {
        this.$message({
          message: "标签名称与其他名称重复，请输入新的标签名称",
          type: "warning",
        });
        this.newTabName = "";
        return;
      } else {
          if (this.newTabName) {
            const newTagItem = {
              tag: this.newTabName, 
              content: ""
            }
            const newList = this.dynTabList.concat();
            newList.splice(-1, 0, newTagItem);
            this.$emit(
              "update:dynTabList",
              newList
            );
            this.$emit('setCurrentTabName', this.newTabName);
          }
      }
      this.resetAddNewTabStatus();
      return false;
    },
    handleDeleteTab(deleteTabName) {
      this.$emit(
        "update:dynTabList",
        this.dynTabList.filter((itemObj) => itemObj.tag !== deleteTabName)
      );
    },
    handleEditTabItem(itemObj) {
      if (!this.handleChangeTabName(itemObj.tag, "errorMessage", itemObj)) {
        return;
      }
      itemObj.tag && this.$emit("update:dynTabList", this.dynTabMap.slice());
    },
  },
  name: "RadioTags",
};
</script>
<style lang="scss" scoped>
.radio-tags_wrap {
  display: flex;
  ::v-deep {
    .el-radio {
      margin-right: 0;
    }
    .is-bordered {
      margin-left: 0 !important;
      padding: 8px 10px;
      position: relative;
      &:hover {
        color: #3c6ef0;
        background: rgba(60, 110, 240, 0.1);
        border-color: rgba(60, 110, 240, 0.2);
        &::after {
          content: "";
          display: inline-block;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 1px;
          background: rgba(60, 110, 240, 0.2);
        }
      }
    }
    .el-radio__input {
      display: none;
    }
    .el-radio__label {
      padding-left: 0;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__error {
      white-space: nowrap;
    }
  }
  .close {
    border-radius: 50%;
    margin-left: 4px;
    font-size: 12px;
    height: 16px;
    width: 16px;
    display: inline-block;
    &:hover {
      background: #3c6ef0;
      color: #fff;
      line-height: 16px;
      text-align: center;
    }
  }
  .radio-first {
    border-right: none;
    border-radius: 4px 0 0 4px;
  }
  .radio-middle {
    border-right: none;
    border-radius: 0;
  }
  .radio-last {
    border-radius: 0 4px 4px 0;
  }
  .radio-middle.active-tab,
  .radio-first.active-tab {
    &::after {
      content: "";
      display: inline-block;
      width: 1px;
      background: #3c6ef0;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
    }
    &:hover {
      &::after {
        background: #3c6ef033;
      }
    }
  }
  .add-input {
    width: 81px;
  }
  .tab-item-input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    right: 0;
  }
}
.radio-tags-wrap_editAble {
  padding-bottom: 22px;
}
.radio-tags-wrap_editDisable {
  padding-bottom: 10px;
}
</style>
