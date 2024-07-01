<template>
  <div class="configure-product-introduction">
    <!-- 配置产品介绍页 -->
    <div
      v-for="(item, index) in computeFormRowList"
      :key="index"
      class="form-row"
    >
      <ProductIntroductionTable
        :editable="editable"
        :title="item.title"
        :tableData="totalTableData[index]"
        :editableTableData="editableTotalTableData[index]"
        :tableList="totalTableList[index]"
        :iconList="iconList"
        :imageList="imageList"
        :productShowType="`${index + 1}`"
        @update:tableData="updateTableData(arguments, index)"
      />
    </div>

    <StickyWrapper>
      <el-button
        v-if="!editable"
        type="primary"
        @click="$emit('update:editable', true)"
        >编辑</el-button
      >

      <div v-else class="button-wrapper">
        <el-button @click="handleCancelEditableTableData">取消</el-button>
        <el-button type="primary" @click="handleSaveEditableTableData"
          >保存</el-button
        >
      </div>
    </StickyWrapper>
  </div>
</template>

<script>
import StickyWrapper from "@/components/StickyWrapper.vue";
import ProductIntroductionTable from "@/views/intranet/softwareSystem/overview/components/productIntroductionTable.vue";
import overview from "@/api/intranet/softwareSystem/overview/index.js";

export default {
  name: "ConfigureProductIntroduction",
  components: { StickyWrapper, ProductIntroductionTable },
  props: {
    editable: {
      type: Boolean,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    secondaryDevelopment: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      totalTableData: [],
      editableTotalTableData: [],
      totalTableList: [
        [
          { label: "能力标题", prop: "title", "min-width": "160" },
          { label: "描述信息", prop: "describe", "min-width": "240" },
          { label: "展示图标", prop: "imgConfigCode", "min-width": "160" },
        ],
        [],
        [
          { label: "场景标题", prop: "title", "min-width": "160" },
          { label: "场景描述", prop: "describe", "min-width": "240" },
          { label: "详情链接", prop: "linkAddress", "min-width": "240" },
          { label: "展示配图", prop: "imgConfigCode", "min-width": "160" },
        ],
        [
          { label: "案例标题", prop: "title", "min-width": "160" },
          { label: "案例描述", prop: "describe", "min-width": "240" },
          { label: "详情链接", prop: "linkAddress", "min-width": "240" },
        ],
        [
          { label: "能力标题", prop: "title", "min-width": "160" },
          { label: "描述信息", prop: "describe", "min-width": "240" },
          { label: "展示图标", prop: "imgConfigCode", "min-width": "160" },
        ],
      ],
      imageUrl: "",
      iconList: [],
      imageList: [],
    };
  },
  computed: {
    // 计算展示列表
    computeFormRowList() {
      const showList = [
        { title: "产品能力" },
        { title: "产品架构" },
        { title: "应用场景" },
        { title: "合作案例" },
        { title: "提供二次开发能力" },
      ];
      // 支持二次开发 展示提供二次开发配置
      if (this.secondaryDevelopment === "1") {
        return showList;
      } else {
        return showList.slice(0, -1);
      }
    },
  },
  methods: {
    // 软件系统-配置产品介绍页-数据加载
    async load() {
      const params = this.productCode;
      return await overview.load(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("load");
      });
    },
    // 软件系统-配置产品介绍页-图片配置查询
    async query() {
      const imgUseScenes = "1";
      const params = { imgUseScenes };
      return await overview.query(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("query");
      });
    },
    // 软件系统-配置产品介绍页-保存
    async save(showList) {
      const { productCode } = this;
      const data = { productCode, showList };
      return await overview.save(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("save");
      });
    },

    // 更新表格数据
    updateTableData(args, index) {
      const [handle, data] = args;
      if (handle === "add") {
        this.editableTotalTableData[index].push(data);
      } else if (handle === "delete") {
        this.editableTotalTableData[index].splice(data, 1);
      }
    },

    // 保存前检查编辑态数据
    checkEditableTableData(editableTotalTableData) {
      return true;
    },
    // 保存配置产品介绍页数据
    async handleSaveEditableTableData() {
      const checkResult = this.checkEditableTableData(
        this.editableTotalTableData
      );
      // 数据校验通过
      if (checkResult) {
        const showList = this.editableTotalTableData.reduce((acc, item) => {
          return acc.concat(item);
        }, []);
        await this.save(showList).catch(() => {
          throw new Error("save");
        });
        this.$message.success("保存成功！");
        await this.reloadTableData();
        this.$emit("update:editable", false);
        // 出发更新软件系统状态事件
        this.$emit("updateStatus");
      }
    },
    // 取消编辑
    async handleCancelEditableTableData() {
      await this.reloadTableData();
      this.$emit("update:editable", false);
    },
    // 保存、取消后重新加载数据更新表格
    async reloadTableData() {
      this.totalTableData = Array.from({ length: 5 }, (_, index) => {
        const productShowType = `${index + 1}`;
        const imgUrl = "";
        return index === 1 ? [{ productShowType, imgUrl }] : [];
      });
      this.editableTotalTableData = Array.from({ length: 5 }, (_, index) => {
        const productShowType = `${index + 1}`;
        const imgUrl = "";
        return index === 1 ? [{ productShowType, imgUrl }] : [];
      });
      const response = await this.load().catch(() => {
        throw new Error("reloadTableData");
      });
      const { data } = response.data;
      data.forEach((item) => {
        const { productShowType } = item;
        if (productShowType) {
          const tableIndex = parseInt(productShowType) - 1;
          if (productShowType === "2") {
            this.totalTableData[tableIndex].splice(0, 1, item);
            this.editableTotalTableData[tableIndex].splice(0, 1, { ...item });
          } else {
            this.totalTableData[tableIndex].push(item);
            this.editableTotalTableData[tableIndex].push({ ...item });
          }
        }
      });
      (async () => {
        const { data } = await this.query().catch(() => {});
        this.iconList = data.data.filter((item) => {
          const { imgType } = item;
          return imgType === "1";
        });
        this.imageList = data.data.filter((item) => {
          const { imgType } = item;
          return imgType === "2";
        });
      })();
    },
  },
  async created() {
    await this.reloadTableData();
  },
};
</script>

<style lang="scss" scoped>
.configure-product-introduction {
}
</style>