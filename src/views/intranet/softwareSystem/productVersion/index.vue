<template>
  <div class="product-version">
    <TagTip :closable="false">
      您可在列表中维护该软件全部版本。了解更多请看
      <a :href="hrefHelpDocument" target="_blank">新手帮助文档</a>
    </TagTip>

    <el-button
      type="primary"
      style="margin-bottom: 8px; float: right"
      @click="onClickCreateVersionButton"
      >创建版本</el-button
    >

    <el-table :data="tableData" :hide-empty-img="true" style="width: 100%">
      <el-table-column
        v-for="{
          label,
          prop,
          width,
          minWidth,
          showOverflowTooltip,
          type,
          fixed,
        } in tableColumnList"
        :key="label"
        :label="label"
        :prop="prop"
        :width="width"
        :min-width="minWidth"
        :show-overflow-tooltip="showOverflowTooltip"
        :type="type"
        :fixed="fixed"
      >
        <template
          #default="{ row, row: { price }, column: { property }, $index }"
        >
          <template v-if="label === '序号'">
            {{ $index + 1 }}
          </template>
          <template v-else-if="property === 'price'">
            <span>{{ price | formatTableColumnPriceText }}</span>
          </template>
          <template v-else-if="label === '操作'">
            <el-button type="text" @click="onClickViewResources(row)"
              >查看资源</el-button
            >
            <el-button type="text" @click="onClickDistributeButton(row)"
              >下发</el-button
            >
            <el-button type="text" @click="onClickEditButton(row)"
              >编辑</el-button
            >
            <el-button type="text" @click="onClickConfigureApiButton(row)"
              >配置API</el-button
            >
            <el-button type="text" @click="onClickConfigureExtensionButton(row)"
              >配置扩展点</el-button
            >
            <el-popover
              :ref="`popover-${$index}`"
              width="200"
              placement="top-end"
              trigger="manual"
              v-model="row.isOpen"
            >
              <div v-show="hasSubscription">
                <p>
                  当前版本已开通给租户，请先在[订阅]中关闭该租户版本再删除！
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="row.isOpen = false"
                    >我知道了</el-button
                  >
                </div>
              </div>
              <div v-show="!hasSubscription">
                <p>
                  删除后，无法再创建相同【版本编码】的产品版本，确认删除吗？
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" size="mini" @click="row.isOpen = false"
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="onClickConfirmDeleteButton(row)"
                    >删除</el-button
                  >
                </div>
              </div>

              <el-button
                type="text"
                slot="reference"
                style="margin-left: 8px; color: #e1251b"
                @click="onClickDeleteButton(row, `popover-${$index}`)"
                >删除</el-button
              >
            </el-popover>
          </template>
          <template v-else>
            <span>{{ row[property] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :currentPage.sync="pageNum"
      :pageSize.sync="pageSize"
      :total="total"
      :reloadTableData="handleQueryVersionList"
    />

    <CreateVersionDialog
      :dialogVisible.sync="createVersionDialogVisible"
      :extendedList="extendedList"
      @clickISeeButton="handleQueryVersionList"
      @updateStatus="$emit('updateStatus')"
    />
    <ViewResourcesDialog
      :dialogVisible.sync="viewResourcesDialogVisible"
      :extendedList="extendedList"
      :lopResourceId="currentRow.lopResourceId"
    />
    <!-- 下发资源抽屉 -->
    <DistributeDrawer
      v-if="showDistributeDrawer"
      :showDistributeDrawer.sync="showDistributeDrawer"
      :showDrawerVisible.sync="showDrawerVisible"
      :currentRow="currentRow"
    />
    <!-- 编辑版本弹窗 -->
    <EditVersionDialog
      v-if="showEditVersionDialog"
      :showEditVersionDialog.sync="showEditVersionDialog"
      :currentRow="currentRow"
      @queryVersionList="handleQueryVersionList"
    />
    <!-- 配置 -->
    <ConfigurationDialog
      v-if="productInfo"
      :showConfigurationDialog.sync="showConfigurationDialog"
      :title="title"
      :configureType="configureType"
      :productInfo="productInfo"
      :associateIdList="associateIdList"
      :currentRow="currentRow"
      @updateStatus="$emit('updateStatus')"
    />
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import Pagination from "@/components/Pagination.vue";
import CreateVersionDialog from "./components/CreateVersionDialog/index.vue";
import ViewResourcesDialog from "./components/ViewResourcesDialog/index.vue";
import ConfigurationDialog from "@/views/intranet/softwareSystem/productVersion/ConfigurationDialog.vue";
import DistributeDrawer from "@/views/intranet/softwareSystem/productVersion/components/DistributeDrawer.vue";
import EditVersionDialog from "@/views/intranet/softwareSystem/productVersion/components/EditVersionDialog.vue";
import sysVersion from "@/api/intranet/lcp/sysVersion.js";
import sysResourcesExtendedField from "@/api/intranet/lcp/sysResourcesExtendedField";

export default {
  name: "ProductVersion",
  components: {
    TagTip,
    Pagination,
    CreateVersionDialog,
    ViewResourcesDialog,
    ConfigurationDialog,
    EditVersionDialog,
    DistributeDrawer,
  },
  props: {
    productInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      productId: parseInt(this.$route.params.id),

      hrefHelpDocument: "//lcp.jdl.com/#/newHand/53054",

      tableData: [],
      tableColumnList: [
        { label: "序号", type: "index", width: "60" },
        {
          label: "版本名称",
          prop: "versionName",
          minWidth: "180",
          showOverflowTooltip: true,
        },
        {
          label: "版本编码",
          prop: "versionCode",
          minWidth: "180",
          showOverflowTooltip: true,
        },
        {
          label: "版本描述",
          prop: "detail",
          minWidth: "240",
          showOverflowTooltip: true,
        },
        { label: "版本金额", prop: "price", minWidth: "120" },
        { label: "创建人", prop: "createUser", minWidth: "160" },
        { label: "创建时间", prop: "createTime", minWidth: "180" },
        { label: "操作", minWidth: "360", fixed: "right" },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      currentRow: {},

      createVersionDialogVisible: false,
      extendedList: [],
      viewResourcesDialogVisible: false,

      showEditVersionDialog: false,
      showDrawerVisible: false,
      showDistributeDrawer: false,

      versionId: 0,
      loading: false,
      hasSubscription: false,
      showConfigurationDialog: false,
      title: "",
      configureType: 2,
      associateIdList: [],
    };
  },
  filters: {
    formatTableColumnPriceText(value) {
      return typeof value === "number"
        ? `${parseFloat(value / 100).toFixed(2)}`
        : "";
    },
  },
  methods: {
    // 根据软件系统ID与资源类别查询软件系统版本列表
    async queryVersionList() {
      const { productId, pageNum, pageSize } = this;
      const category = "MENUTREE";
      const params = { productId, category, pageNum, pageSize };
      return await sysVersion.queryVersionList(params).catch((error) => {
        throw new Error(`queryVersionList, ${error}`);
      });
    },
    //查询系统资源扩展字段配置
    async queryConfig() {
      const { productId } = this;
      const category = "MENUTREE";
      const params = { productId, category };
      return await sysResourcesExtendedField
        .queryConfig(params)
        .catch((error) => {
          throw new Error(`queryConfig, ${error}`);
        });
    },
    // 根据版本ID、系统版本类型与产品编码查询关联资源
    async query(sysVersionRefType) {
      const { id } = this.currentRow;
      const versionId = id;
      const { code } = this.productInfo;
      const productCode = code;
      const params = { versionId, sysVersionRefType, productCode };
      return await sysVersion.ref.query(params).catch((error) => {
        throw new Error(`query, ${error}`);
      });
    },
    // 根据版本ID判断是否有租户订阅当前版本（包含开通中、已开通）
    async checkVersionOpenStatus() {
      const { id } = this.currentRow;
      const params = { id };
      return await sysVersion.checkVersionOpenStatus(params).catch((error) => {
        throw new Error(`checkVersionOpenStatus, ${error}`);
      });
    },
    // 根据根据软件系统ID、资源类别与版本ID删除产品版本
    async deleteVersion() {
      const { id } = this.currentRow;
      const category = "MENUTREE";
      const data = { id, category };
      return await sysVersion.deleteVersion(data).catch((error) => {
        throw new Error(`deleteVersion, ${error}`);
      });
    },

    // 根据软件系统ID与资源类别查询软件系统版本列表
    async handleQueryVersionList() {
      this.loading = true;
      const {
        data: { list, total },
      } = await this.queryVersionList().catch((error) => {
        throw new Error(`handleQueryVersionList, ${error}`);
      });
      this.tableData = Array.isArray(list)
        ? list.map((item) => {
            const isOpen = false;
            return { ...item, isOpen };
          })
        : [];
      this.total = total || 0;
      this.loading = false;
    },
    //查询系统资源扩展字段配置
    async handleQueryConfig() {
      const { data } = await this.queryConfig().catch((error) => {
        throw new Error(`handleQueryConfig, ${error}`);
      });
      this.extendedList = Array.isArray(data) ? data : [];
    },
    // 根据版本ID、系统版本类型与产品编码查询关联资源
    async handleQuery(sysVersionRefType) {
      const { data } = await this.query(sysVersionRefType).catch((error) => {
        throw new Error(`handleQuery, ${error}`);
      });
      this.associateIdList = Array.isArray(data)
        ? data.map((item) => {
            const { id } = item;
            return id;
          })
        : [];
      const hashMap = new Map().set(2, "配置API").set(3, "配置扩展点");
      this.showConfigurationDialog = true;
      this.title = hashMap.get(sysVersionRefType) || "";
      this.configureType = sysVersionRefType;
    },
    // 根据版本ID判断是否有租户订阅当前版本（包含开通中、已开通）
    async handleCheckVersionOpenStatus() {
      const { data } = await this.checkVersionOpenStatus().catch((error) => {
        throw new Error(`handleCheckVersionOpenStatus, ${error}`);
      });
      this.hasSubscription = data || false;
    },
    // 根据根据软件系统ID、资源类别与版本ID删除产品版本
    async handleDeleteVersion() {
      await this.deleteVersion().catch((error) => {
        throw new Error(`handleDeleteVersion, ${error}`);
      });
      this.$message.success("版本删除成功！");
    },

    async onClickCreateVersionButton() {
      this.createVersionDialogVisible = true;
      this.addVersionForm = {};
      this.active = 0;
      await this.handleQueryConfig().catch((error) => {
        throw new Error(`onClickCreateVersionButton, ${error}`);
      });
    },
    onClickViewResources(row) {
      this.currentRow = row;
      this.viewResourcesDialogVisible = true;
    },
    // 下发资源
    onClickDistributeButton(row) {
      // v-if与visible绑定的变量不能是同一个，否则会造成渲染抽屉组件闪屏
      this.showDistributeDrawer = true;
      this.$nextTick(() => {
        this.showDrawerVisible = true;
      });
      this.currentRow = row;
    },
    onClickEditButton(row) {
      this.showEditVersionDialog = true;
      this.currentRow = row;
    },
    //配置API
    async onClickConfigureApiButton(row) {
      this.currentRow = row;
      await this.handleQuery(2).catch((error) => {
        throw new Error(`onClickConfigureApiButton, ${error}`);
      });
    },
    //配置扩展点
    async onClickConfigureExtensionButton(row) {
      this.currentRow = row;
      await this.handleQuery(3).catch((error) => {
        throw new Error(`onClickConfigureApiButton, ${error}`);
      });
    },
    async onClickConfirmDeleteButton(row) {
      this.currentRow = row;
      row.isOpen = false;
      await this.handleDeleteVersion().catch((error) => {
        throw new Error(`onClickConfirmDeleteButton, ${error}`);
      });
      this.$emit("updateStatus");
      await this.handleQueryVersionList().catch((error) => {
        throw new Error(`onClickConfirmDeleteButton, ${error}`);
      });
    },
    async onClickDeleteButton(row, popoverRefName) {
      this.currentRow = row;
      await this.handleCheckVersionOpenStatus().catch((error) => {
        throw new Error(`onClickDeleteButton, ${error}`);
      });
      row.isOpen = true;
      this.$nextTick(() => {
        this.$refs[popoverRefName][1].$refs.popper.previousSibling.remove();
      });
      this.tableData = JSON.parse(JSON.stringify(this.tableData));
    },
  },
  async created() {
    await this.handleQueryVersionList().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
// .product-version {
// }
</style>