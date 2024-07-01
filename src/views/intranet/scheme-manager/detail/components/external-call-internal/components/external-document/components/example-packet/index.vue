<template>
  <div>
    <RadioTags
      :dynTabList.sync="tabInfo"
      :currentTabName.sync="currentTabName"
      :editAble="editable"
      @setCurrentTabName="setCurrentTabName"
    ></RadioTags>
    <el-input
      type="textarea"
      :autosize="{ minRows: 10, maxRows: 35 }"
      v-model="textAreaValue"
      :disabled="!editTextArea"
      :placeholder="placeholder"
    ></el-input>
  </div>
</template>
<script>
import RadioTags from "./components/radio-tags.vue";
export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    tabList: {
      type: Array,
      default: () => [],
      /**
       * sync
       * tabList:[{
       * tag: String, tag名称 必填
       * content: String, tag对应的报文示例 必填
       * order: Number, 当前tag在所有tag中的顺序 选填（不填默认按照同级别的数组顺序, 如果没有指定放在最后边的值，则将tag为‘模板示例’的值放在最后，order优先级大于tag）
       * tooltipInfo:{ 当前tag hover时的tooltip信息 选填（默认没有）
       *    content: String, tooltip提示信息 必填
       *    placement: String, 展示位置 选填（默认 Top Center）
       *    effect: String, 主题 选填（默认dark）
       *
       *  }
       * }]
       *
       */
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  computed: {
    editTextArea() {
      return this.editable && this.currentTabName !== '模板示例';
    },
    textAreaValue: {
      set(newVal) {
        const itemObj =
          this.tabList.find(
            (item) => item.tag === this.currentTabName
          ) || {};
        itemObj.content = newVal;
        this.$emit("update:tabList", this.tabList);
      },
      get() {
        return (
          this.tabList.find(
            (item) => item.tag === this.currentTabName
          ) || { content: "" }
        ).content;
      },
    },

    tabInfo: {
      set(newVal) {
        this.$emit("update:tabList", newVal);
      },
      get() {
        const len = this.tabList.length;
        return this.tabList
          .map((itemObj) => {
            if (itemObj.tag === "模板示例") {
              itemObj.order = len;
            }
            return itemObj;
          })
          .sort((a, b) => {
            return (a.order || 0) - (b.order || 0);
          });
      },
    },
  },
  data() {
    return {
      currentTabName: "",
    };
  },
  watch: {
    tabList(newList) {
      this.currentTabName = (newList[0] || {})['tag'] || "";
    },
  },
  methods: {
    setCurrentTabName(newVal) {
      this.$nextTick(() => {
        this.currentTabName = newVal;
      })
    }
  },
  components: {
    RadioTags,
  },
  name: "ExamplePacket",
};
</script>
