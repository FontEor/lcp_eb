<template>
  <div style="padding: 0px" meta="x:216.0,y:81.0,width:600.0,height:321.0">
    <el-table
      :data="tableDatas"
      :row-class-name="rowClassName"
      class="my-table mb2"
      empty-text="暂无审批通过的API"
    >
      <el-table-column
        label="序号"
        prop="number"
        align="center"
        min-width="13.21%"
      />
      <el-table-column
        label="API"
        prop="qualifiedName"
        align="left"
        min-width="32.61%"
        :show-tooltip-when-overflow="true"
      >
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            v-on:click="onGotoApiOverView(scope.row.qualifiedName)"
            class="link"
            style="color: rgb(60, 110, 240)"
            target="_blank"
          >
            {{ scope.row.qualifiedName }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="中文名称"
        prop="apiCnName"
        align="left"
        min-width="39.47%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column align="left" label="Maven坐标" prop="mvn">
        <template slot-scope="scope">
          <a
            href="javascript:void(0)"
            style="color: #3c6ef0"
            type="primary"
            @click="displayMvnDialog(scope.row.mvn)"
            >查看</a
          >&nbsp;
          <a
            href="javascript:void(0)"
            style="color: #3c6ef0"
            type="primary"
            @click="copyMvnDependency(scope.row.mvn)"
            >一键复制</a
          >
        </template>
      </el-table-column>
      <el-table-column label="别名" prop="id" align="center" min-width="14.21%">
        <template slot-scope="scope">
          <el-button
            icon="document"
            type="text"
            v-on:click="onShowAlias(scope.row)"
          >
            查看别名
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" :push="17">
        <pagination
          v-show="listQuery.total"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.pageNumb"
          :limit.sync="listQuery.pageSize"
          v-on:pagination="paginationChange"
          style="margin: 0px"
        />
      </el-col>
    </el-row>

    <!--  maven坐标弹窗  -->
    <el-dialog :visible.sync="mvnDialogDisplay" title="Maven坐标" width="30%">
      <pre>{{ mvnDialogText }}</pre>
    </el-dialog>

    <!--别名信息弹出框定义-->
    <el-dialog
      title="别名信息"
      :visible.sync="this.aliasDialogListVisible"
      :before-close="this.handleCloseAliasDialog"
      width="850px"
      :close-on-click-modal="false"
    >
      <el-table
        :data="aliasTableDatas"
        :empty-text="emptyAliasText"
        :row-class-name="rowClassName"
        class="my-table mb2"
      >
        <el-table-column
          label="序号"
          prop="number"
          align="center"
          min-width="13.21%"
        />
        <el-table-column
          label="别名"
          prop="alias"
          align="center"
          min-width="32.61%"
          :show-tooltip-when-overflow="true"
        >
        </el-table-column>
        <el-table-column
          label="别名描述"
          prop="remark"
          align="center"
          min-width="35%"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="操作"
          prop="id"
          align="center"
          min-width="20.21%"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="document"
              v-on:click="displayJSFConfig(scope.row)"
              >查看JSF配置信息</el-button
            >
          </template>
        </el-table-column>
        <el-dialog
          width="37%"
          title="JSF配置信息"
          :visible.sync="jsfConfigInnerDialogVisible"
          append-to-body
          :close-on-click-modal="false"
        >
          <div
            v-loading="loading"
            :before-close="this.handleCloseJSFConfigDialog"
          >
            <el-input
              type="textarea"
              :rows="5"
              v-model="currentJsfConfig"
              resize="none"
              spellcheck="false"
              :readonly="true"
            >
            </el-input>
          </div>
        </el-dialog>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/components/Pagination/index.vue";
import gwApiRequest from "@/utils/gwApiRequest.js";
import { Message } from "@lui/lui-ui";

export default {
  components: { pagination },
  props: {
    appKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tableDatas: [],
      aliasTableDatas: [],
      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      aliasDialogListVisible: false,
      jsfConfigInnerDialogVisible: false,
      currentJsfConfig: "",
      loading: true,
      emptyAliasText: "",
      qualifiedName: "",
      mvnDialogText: "",
      mvnDialogDisplay: false,
    };
  },
  methods: {
    // 调用的API列表
    async queryConsumerApiInApp() {
      const url = "/ApiDepotService/queryConsumerApiInApp";
      const { pageSize, pageNumb } = this.listQuery;
      const { appKey } = this;
      const data = [{ pageSize, pageNumb }, { appKey }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async findPrincipalByQualifiedName() {
      const url = "/ApiManagerService/findPrincipalByQualifiedName";
      const { qualifiedName } = this;
      const data = [{ qualifiedName }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async findJsfApiConfig(apiApplyId, alias) {
      const url = "/ApiManagerService/findJsfApiConfig";
      const data = [{ apiApplyId, alias }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    async queryApiOfCallee() {
      const response = await this.queryConsumerApiInApp().catch(() => {
        throw new Error("queryApiOfCallee queryConsumerApiInApp");
      });
      const { data } = response;
      const { total, list } = data;
      this.listQuery.total = total;
      this.tableDatas = list;
      this.qualifiedName = list[0].qualifiedName;
    },

    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryApiOfCallee();
      // this.queryServiceAlias()
    },

    async copyJSFConfig(aliasWithInterface) {
      const { applyInterfaceInfoId, alias } = aliasWithInterface;
      const { data } = await this.findJsfApiConfig(
        applyInterfaceInfoId,
        alias
      ).catch(() => {
        throw new Error("copyJSFConfig findJsfApiConfig");
      });
      let jsfConfig = data;
      let configInput = document.createElement("textarea");
      configInput.value = jsfConfig;
      document.body.appendChild(configInput);
      configInput.select();
      if (document.execCommand("Copy") === true) {
        configInput.className = "configInput";
        configInput.style.display = "none";
        Message.success("已经成功复制");
      } else {
        Message.error("复制失败");
      }
    },

    async displayJSFConfig(aliasWithInterface) {
      this.jsfConfigInnerDialogVisible = true;
      const { applyInterfaceInfoId, alias } = aliasWithInterface;
      const { data } = await this.findJsfApiConfig(
        applyInterfaceInfoId,
        alias
      ).catch(() => {
        this.loading = false;
        Message.error("获取JSF配置信息失败");
        throw new Error("displayJSFConfig findJsfApiConfig");
      });
      let jsfConfig = data;
      if (jsfConfig) {
        this.currentJsfConfig = jsfConfig;
      }
      this.loading = false;
    },

    onGotoApiOverView(qualifiedName) {
      //this.$router.push({path: '/apiMethodList', query: {'qualifiedName': qualifiedName}})
      window.open(
        window.location.protocol +
          "//" +
          `${window.location.host}/#/apiMethodList?qualifiedName=` +
          qualifiedName
      );
    },

    onShowAlias(apiInfo) {
      this.aliasDialogListVisible = true;
      this.aliasTableDatas = apiInfo.applyInterfaceAliasList;
      this.handleFindPrincipalByQualifiedName();
    },

    //查看别名数据为空时，查找API研发负责人pin
    async handleFindPrincipalByQualifiedName() {
      const response = await this.findPrincipalByQualifiedName().catch(() => {
        throw new Error(
          "handleFindPrincipalByQualifiedName findPrincipalByQualifiedName"
        );
      });
      const { data } = response;
      this.emptyAliasText = `当前API的研发负责人【${
        data.pin || ""
      }】还没为您分配别名`;
    },

    handleCloseAliasDialog() {
      this.aliasDialogListVisible = false;
    },

    handleCloseJSFConfigDialog() {
      this.currentJsfConfig = "";
      this.aliasDialogListVisible = false;
    },
    displayMvnDialog(mvn) {
      this.mvnDialogText = mvn;
      this.mvnDialogDisplay = true;
    },
    copyMvnDependency(mvn) {
      this.$copyText(mvn).then(() => {
        Message.success("复制成功");
      });
    },
  },
  created() {
    this.queryApiOfCallee();
  },
};
</script>

