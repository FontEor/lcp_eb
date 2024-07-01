<template>
  <div class="interface-list">
    <el-row type="flex" justify="space-between" style="margin-bottom: 16px">
      <el-col>
        <el-input
          v-model.trim="queryLike"
          :clearable="true"
          placeholder="请输入编码/名称/描述以搜索"
          style="margin-right: 8px; width: 320px"
          @keyup.enter.native="handleSearchTableData(1)"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSearchTableData(1)"
          >查询</el-button
        >
      </el-col>

      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="handleClickAddInterfaceButton"
        >添加接口</el-button
      >
    </el-row>

    <el-table
      v-loading="tableLoading"
      class="interface-list__table"
      row-key="id"
      :data="tableData"
      :hide-empty-img="true"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        v-for="item in tableList"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.showOverflowTooltip"
      >
        <template
          slot-scope="{
            row,
            row: { apiCode, isAuthorize, categoryCode },
            column,
          }"
        >
          <template v-if="column.property === 'apiCode'">
            <el-link type="primary" @click="handleLinkToApiCodeUrl(row)">{{
              apiCode
            }}</el-link>
          </template>
          <template v-else-if="column.property === 'isAuthorize'">
            <span>{{ isAuthorize | formatIsAuthorizeText }}</span>
          </template>
          <template v-else-if="column.property === 'categoryCode'">
            <span>{{
              categoryCode | formatCategoryCodeText(categoryList)
            }}</span>
          </template>
          <template v-else-if="column.property === 'status'">
            <span :class="row | formatStatusClassName">{{
              row | formatStatusText
            }}</span>
          </template>
          <template v-else>
            <span>{{ row[column.property] }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="200">
        <template slot-scope="{ row, row: { id, status, hide } }">
          <el-button
            v-if="judgeEditButtonVisible(hide, status)"
            type="text"
            @click="handleClickEditButton(row)"
            >编辑</el-button
          >

          <el-badge :is-dot="row.outOfDate" class="table__badge"
            ><el-button
              type="text"
              class="badge__button"
              @click="handleClickExternalDocumentButton(row)"
              >对外文档</el-button
            ></el-badge
          >

          <el-button
            v-if="status !== 1"
            type="text"
            @click="handleClickHideOrCancelHideButton(row)"
            >{{ hide | formatHideOrCancelHideButtonText }}</el-button
          >

          <el-popover
            v-if="judgeDeletePopoverVisible(hide, status)"
            placement="left-start"
            width="240"
            trigger="click"
            style="display: inline-block; margin-left: 10px"
          >
            <p>若接口已经被发布过，则不可删除。确认删除此接口？</p>
            <div style="text-align: center; margin-top: 8px">
              <el-button
                type="danger"
                style="width: 100%"
                @click="handleClickDeleteButton(id)"
                >确认删除</el-button
              >
            </div>
            <el-button slot="reference" type="text" style="color: #e1251b"
              >删除</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :currentPage.sync="pageNumb"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="handleSearchTableData"
    />

    <el-dialog
      class="interface-list__hide-or-cancel-hide-dialog"
      :title="currentRowData.hide | formatHideOrCancelHideDialogTitleText"
      :visible.sync="hideOrCancelHideDialogVisible"
      width="480px"
    >
      <Steps :active="active" :titleList="['确认', '完成']" />
      <div class="hide-or-cancel-hide-dialog__image-wrapper">
        <img
          class="image-wrapper__warning"
          :src="active | formatHideOrCancelHideDialogImageSource"
          style="margin: 8px auto; width: 36px"
        />
      </div>

      <div class="hide-or-cancel-hide-dialog__text-wrapper">
        <template v-if="currentRowData.hide === 0">
          <template v-if="active === 0">
            <p>接口隐藏会立即生效</p>
            <p>
              前台将不再展示
              {{ currentRowData.apiCode }} 接口，但不影响已接入用户的调用
            </p>
            <p>确认隐藏？</p>
          </template>
          <template v-else-if="active === 1">
            <p style="font-size: 24px; font-weight: 600">隐藏成功</p>
            <p>前台将不再展示 {{ currentRowData.apiCode }} 接口</p>
          </template>
        </template>

        <template v-else-if="currentRowData.hide === 1">
          <template v-if="active === 0">
            <p>接口取消隐藏会立即生效</p>
            <p>
              前台将展示
              {{ currentRowData.apiCode }} 接口，可能会有新用户接入并调用接口
            </p>
            <p>确认取消隐藏？</p>
          </template>
          <template v-else-if="active === 1">
            <p style="font-size: 24px; font-weight: 600">取消隐藏成功</p>
            <p>前台将展示 {{ currentRowData.apiCode }} 接口</p>
          </template>
        </template>
      </div>

      <div slot="footer">
        <el-button @click="hideOrCancelHideDialogVisible = false">{{
          active | formatHideOrCancelHideDialogCancelButtonText
        }}</el-button>
        <el-button
          v-if="active === 0"
          type="primary"
          @click="handleConfirmHideOrCancelHide"
          >确 定</el-button
        >
        <el-button
          v-else-if="active === 1"
          type="primary"
          @click="handleLinkToPortalUrl"
          >前往前台查看</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import Steps from "@/components/Steps.vue";
import Sortable from "sortablejs";
import bizapinterface from "@/api/intranet/lcp/bizapinterface.js";
import bizunit from "@/api/intranet/lcp/bizunit.js";
import words from "@/assets/words.png";
import publishFinish from "@/assets/img/publishFinish.png";

export default {
  name: "InterfaceList",
  components: { Pagination, Steps },
  props: {
    // 接口列表激活视图
    activeView: {
      type: String,
      required: true,
    },
    // 当前选中的行数据
    currentRowData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // 对接方案ID
      unitId: parseInt(this.$route.params.id),
      // 接口服务类型 1:JSF 2:HTTP
      domainType: 0,
      // 查询关键词
      queryLike: "",
      // 接口列表表格
      tableLoading: true,
      tableData: [],
      tableList: [
        {
          prop: "apiCode",
          label: "接口",
          minWidth: "300",
          showOverflowTooltip: true,
        },
        {
          prop: "apiName",
          label: "中文名称",
          minWidth: "180",
          showOverflowTooltip: true,
        },
        {
          prop: "apiRemark",
          label: "接口描述",
          minWidth: "180",
          showOverflowTooltip: true,
        },
        {
          prop: "apiUrl",
          label: "URL",
          minWidth: "300",
          showOverflowTooltip: true,
        },
        {
          prop: "alias",
          label: "测试环境JSF别名",
          minWidth: "180",
          showOverflowTooltip: true,
        },
        {
          prop: "isAuthorize",
          label: "用户授权",
          minWidth: "100",
          showOverflowTooltip: false,
        },
        {
          prop: "categoryCode",
          label: "所属分类",
          minWidth: "80",
          showOverflowTooltip: false,
        },
        {
          prop: "status",
          label: "状态",
          minWidth: "80",
          showOverflowTooltip: false,
        },
        {
          prop: "createUser",
          label: "创建人",
          minWidth: "100",
          showOverflowTooltip: false,
        },
        {
          prop: "updateUser",
          label: "更新人",
          minWidth: "100",
          showOverflowTooltip: false,
        },
      ],
      // 对接方案分类列表
      categoryList: [],
      // 分页器
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      // 隐藏/取消隐藏对话框
      hideOrCancelHideDialogVisible: false,
      // 隐藏/取消隐藏激活步骤
      active: 0,
    };
  },
  filters: {
    formatIsAuthorizeText(isAuthorize) {
      const hashMap = ["不需要", "需要"];
      return hashMap[isAuthorize] || "";
    },
    formatCategoryCodeText(categoryCode, categoryList) {
      const category = categoryList.find(({ code }) => code === categoryCode);
      return category ? category.name : "";
    },
    formatStatusText(row) {
      const { hide, status } = row;
      const hashMap = {
        1: "初始化",
        2: "审核中",
        4: "审核通过",
        5: "已发布",
        9: "审核未通过",
        10: "编辑中",
      };
      return hide ? "已隐藏" : hashMap[status] || "";
    },
    formatStatusClassName(row) {
      const { hide, status } = row;
      const hashMap = {
        1: "initColor",
        2: "updateColor",
        4: "normalColor",
        5: "normalColor",
        9: "deadColor",
        10: "updateColor",
      };
      return hide ? "deadColor" : hashMap[status] || "";
    },
    formatHideOrCancelHideButtonText(hide) {
      const hashMap = ["隐藏", "取消隐藏"];
      return hashMap[hide] || "";
    },
    formatHideOrCancelHideDialogTitleText(hide) {
      const hashMap = ["接口隐藏", "接口取消隐藏"];
      return hashMap[hide] || "";
    },
    formatHideOrCancelHideDialogImageSource(active) {
      const hashMap = [words, publishFinish];
      return hashMap[active] || "";
    },
    formatHideOrCancelHideDialogCancelButtonText(active) {
      const hashMap = ["取 消", "关 闭"];
      return hashMap[active] || "";
    },
  },
  methods: {
    // 根据对接方案ID查询其下所有的分类
    async getApiCategory() {
      const { unitId } = this;
      const params = { unitId };
      return await bizapinterface.getApiCategory(params);
    },
    // 根据对接方案ID查询概览数据
    async getOverview() {
      const { unitId } = this;
      const id = unitId;
      const params = { id };
      return await bizunit.getOverview(params);
    },
    // 调整对接方案接口列表表格顺序
    async updateApiSeq(apiId, seq) {
      const data = { apiId, seq };
      return await bizapinterface.updateApiSeq(data);
    },
    // 查询对接方案外调内接口列表表格数据
    async queryInterfaceList() {
      const { unitId, pageNumb, pageSize, queryLike } = this;
      const callDirection = 1;
      const orderBy = "seq";
      const orderType = "asc";
      const params = {
        unitId,
        callDirection,
        pageNumb,
        pageSize,
        orderBy,
        orderType,
        queryLike,
      };
      return await bizapinterface.queryInterfaceList(params);
    },
    // 根据对接方案ID判断当前用户是否为该对接方案的产品负责人或研发负责人
    async checkPrincipal() {
      const { unitId } = this;
      const id = unitId;
      const params = { id };
      return await bizunit.checkPrincipal(params);
    },
    // 根据接口ID隐藏对接方案API
    async hiddenApi() {
      const { id } = this.currentRowData;
      const params = { id };
      return await bizapinterface.hiddenApi(params);
    },
    // 根据接口ID取消隐藏对接方案API
    async hiddenCancelApi() {
      const { id } = this.currentRowData;
      const params = { id };
      return await bizapinterface.hiddenCancelApi(params);
    },
    // 根据接口ID删除对接方案API
    async deleteInterface(id) {
      const params = { id };
      return await bizapinterface.deleteInterface(params);
    },

    // 根据接口服务类型与当前环境初始化表格配置项
    initializeTableList() {
      const { baseEnv } = window.env;
      const { domainType } = this;
      const aliasIndex = this.tableList.findIndex(
        ({ prop }) => prop === "alias"
      );
      const jsfMap = {
        test: () => {
          this.tableList.splice(aliasIndex, 1, {
            prop: "alias",
            label: "测试环境JSF别名",
            minWidth: "180",
            showOverflowTooltip: true,
          });
        },
        uat: () => {
          this.tableList.splice(
            aliasIndex,
            1,
            {
              prop: "shadowboxAlias",
              label: "预发环境JSF别名",
              minWidth: "180",
              showOverflowTooltip: true,
            },
            {
              prop: "alias",
              label: "生产环境JSF别名",
              minWidth: "180",
              showOverflowTooltip: true,
            }
          );
        },
        prod: () => {
          this.tableList.splice(
            aliasIndex,
            1,
            {
              prop: "shadowboxAlias",
              label: "预发环境JSF别名",
              minWidth: "180",
              showOverflowTooltip: true,
            },
            {
              prop: "alias",
              label: "生产环境JSF别名",
              minWidth: "180",
              showOverflowTooltip: true,
            }
          );
        },
      };
      const domainTypeMap = {
        1: () => {
          jsfMap[baseEnv] && jsfMap[baseEnv]();
        },
        2: () => {
          this.tableList.splice(aliasIndex, 1);
        },
      };
      domainTypeMap[domainType] && domainTypeMap[domainType]();
    },
    // 查询对接方案分类列表操作
    async handleSearchCategoryList() {
      const { data } = await this.getApiCategory().catch((error) => {
        throw new Error(`handleSearchCategoryList getApiCategory, ${error}`);
      });
      this.categoryList = data || [];
    },
    // 查询对接方案接口服务类型操作
    async handleSearchDomainType() {
      const {
        data: { domainType },
      } = await this.getOverview().catch((error) => {
        throw new Error(`handleSearchDomainType getOverview, ${error}`);
      });
      this.domainType = domainType || 0;
    },
    // 查询表格数据操作，点击查询按钮时需重置当前页码
    async handleSearchTableData(pageNumb = 0) {
      this.tableLoading = true;
      this.pageNumb = pageNumb || this.pageNumb;
      await this.handleSearchCategoryList().catch((error) => {
        throw new Error(
          `handleSearchTableData handleSearchCategoryList, ${error}`
        );
      });
      const {
        data: { list, total },
      } = await this.queryInterfaceList().catch((error) => {
        throw new Error(`handleSearchTableData queryInterfaceList, ${error}`);
      });
      this.tableData = list || [];
      this.total = total || 0;
      this.tableLoading = false;
      this.$nextTick(() => {
        this.initializeTableDrag();
      });
      this.$emit("updateDetailHeaderInfo");
    },
    // 初始化表格拖动排序
    initializeTableDrag() {
      const that = this;
      const tbody = document.querySelector(
        ".interface-list__table .el-table__body-wrapper tbody"
      );
      Sortable.create(tbody, {
        async onEnd(event) {
          const { oldIndex, newIndex } = event;
          const apiId = that.tableData[oldIndex].id;
          const seq = that.tableData[newIndex].seq;
          await that.updateApiSeq(apiId, seq).catch((error) => {
            that.tableData = [];
            throw new Error(`initializeTableDrag updateApiSeq, ${error}`);
          });
          await that.handleSearchTableData().catch((error) => {
            throw new Error(
              `initializeTableDrag handleSearchTableData, ${error}`
            );
          });
        },
        delay: 500,
      });
    },
    // 点击添加接口按钮操作,根据接口服务类型展示添加接口步骤
    handleClickAddInterfaceButton() {
      const { domainType } = this;
      const hashMap = {
        1: "jsfAddOrEditInterface",
        2: "httpAddOrEditInterface",
      };
      this.$emit("update:currentRowData", {});
      this.$emit("update:activeView", hashMap[domainType] || "interfaceList");
    },
    // 链接跳转apiCodeURL操作
    handleLinkToApiCodeUrl(row) {
      const { interfaceName, interfaceMethod, methodId } = row;
      const { domainType } = this;
      const { origin } = window.location;
      const hashMap = {
        1: () => {
          window.open(
            `${origin}/#/apiMethodList?qualifiedName=${interfaceName}&methodName=${interfaceMethod}`,
            "_blank"
          );
        },
        2: () => {
          window.open(`${origin}/#/httpApiDetail?id=${methodId}`, "_blank");
        },
      };
      hashMap[domainType] && hashMap[domainType]();
    },
    // 判断编辑按钮可见性
    judgeEditButtonVisible(hide, status) {
      const hashMap = { 1: true, 5: true, 10: true };
      return hide ? false : hashMap[status];
    },
    // 点击编辑按钮操作，根据接口服务类型展示编辑接口步骤
    handleClickEditButton(row) {
      const { domainType } = this;
      const hashMap = {
        1: "jsfAddOrEditInterface",
        2: "httpAddOrEditInterface",
      };
      this.$emit("update:currentRowData", row);
      this.$emit("update:activeView", hashMap[domainType] || "interfaceList");
    },
    // 点击对外文档按钮
    handleClickExternalDocumentButton(row) {
      this.$emit("update:currentRowData", row);
      this.$emit("update:activeView", "externalDocument");
    },
    // 点击隐藏/取消隐藏按钮操作
    async handleClickHideOrCancelHideButton(row) {
      this.$emit("update:currentRowData", row);
      await this.checkPrincipal().catch((error) => {
        throw new Error(
          `handleClickHideOrCancelHideButton checkPrincipal, ${error}`
        );
      });
      this.active = 0;
      this.hideOrCancelHideDialogVisible = true;
    },
    // 确定隐藏/取消隐藏操作
    handleConfirmHideOrCancelHide() {
      const { hide } = this.currentRowData;
      const hashMap = [() => this.hiddenApi(), () => this.hiddenCancelApi()];
      hashMap[hide] &&
        hashMap[hide]()
          .then(async () => {
            this.active = 1;
            await this.handleSearchTableData().catch((error) => {
              throw new Error(
                `handleConfirmHideOrCancelHide handleSearchTableData, ${error}`
              );
            });
          })
          .catch((error) => {
            throw new Error(`handleConfirmHideOrCancelHide, ${error}`);
          });
    },
    // 链接跳转前台文档URL操作
    handleLinkToPortalUrl() {
      const { extranetHost } = window.env;
      const { unitId } = this.currentRowData;
      window.open(`//${extranetHost}/#/quick?id=${unitId}`, "_blank");
    },
    // 判断删除按钮可见性
    judgeDeletePopoverVisible(hide, status) {
      return status === 1 ? true : !!hide;
    },
    // 点击删除按钮操作
    async handleClickDeleteButton(id) {
      await this.deleteInterface(id).catch((error) => {
        throw new Error(`handleClickDeleteButton deleteInterface, ${error}`);
      });
      this.$message.success("删除成功");
      await this.handleSearchTableData().catch((error) => {
        throw new Error(
          `handleClickDeleteButton handleSearchTableData, ${error}`
        );
      });
    },
  },
  async created() {
    await this.handleSearchDomainType().catch((error) => {
      throw new Error(`created handleSearchDomainType, ${error}`);
    });
    this.initializeTableList();
    await this.handleSearchTableData().catch((error) => {
      throw new Error(`created handleSearchTableData, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.interface-list {
  .interface-list__table {
    ::v-deep .sortable-chosen {
      cursor: grabbing;
    }
    .table__badge {
      vertical-align: baseline;

      ::v-deep .el-badge__content {
        top: 6px;
        margin-right: 4px;
      }
      .badge__button {
        margin: 0 8px;
      }
    }
  }

  .interface-list__hide-or-cancel-hide-dialog {
    .hide-or-cancel-hide-dialog__image-wrapper {
      margin: 8px auto;
      width: 36px;

      .image-wrapper__warning {
        width: 100%;
      }
    }

    .hide-or-cancel-hide-dialog__text-wrapper {
      margin-bottom: 16px;
      text-align: center;
    }
  }
}
</style>