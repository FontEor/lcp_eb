<template>
  <div>
    <div class="radio-container">
      <el-radio-group
        @change="selectChanged"
        v-model="callDirectionForm.callDirection"
      >
        <el-radio-button
          v-for="item in callDirectionOptions"
          :key="item.value"
          :label="item.value"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <!-- 顶部tag信息 -->
    <TagTip :closable="false" v-show="callDirectionForm.callDirection === 1">
      {{ showTips }}
    </TagTip>

    <!-- form表单-->
    <el-form :inline="true" style="height: 45px">
      <el-form-item>
        <el-input
          placeholder="请输入API中文名称、URI"
          v-model="callDirectionForm.queryLike"
          class="input-with-select"
          style="width: 230px"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" v-on:click="search"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 显示外调内列表 -->
    <el-table
      v-show="callDirectionForm.callDirection === 1"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="apiName" label="中文名称" width="140" />
      <el-table-column prop="apiUrl" label="URI" />
      <el-table-column prop="apiRemark" label="描述" width="200" />
      <el-table-column
        prop="alias"
        :label="envTable[env] + 'JSF别名'"
        width="160"
      >
        <template slot-scope="scope">
          {{ formatAlias(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateUser" label="更新人" width="120" />
      <el-table-column prop="updateTime" label="更新时间" width="160">
        <template slot-scope="scope">
          {{ formatParseTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="configurationAlias(scope.row)"
            >配置JSF别名</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 显示内调外列表 -->
    <el-table
      v-show="callDirectionForm.callDirection === 2"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="apiName" label="中文名称" width="140" />
      <el-table-column prop="apiUri" label="URI" />
      <el-table-column prop="apiRemark" label="描述" width="200" />
      <el-table-column prop="callDirection" label="调用方向" width="140">
        <template slot-scope="scope">
          {{ formatCallDirection(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="订阅时间" width="160">
        <template slot-scope="scope">
          {{ formatParseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="configurationBusinessCode(scope.row)"
            >配置业务编码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-if="total > 0"
      :currentPage.sync="pageNum"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="
        this.callDirectionForm.callDirection == 1
          ? queryOrderedInterfaceList
          : queryCallOutSubApiList
      "
    />

    <!--别名配置-->
    <el-dialog
      title="配置JSF别名"
      width="400px"
      :visible.sync="aliasDialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="aliasform"
        :model="aliasform"
        :rules="aliasRules"
        :inline="true"
        label-width="110px"
      >
        <el-form-item prop="currentAlias" :label="envTable[env] + '别名'">
          <el-select
            style="width: 200px"
            v-model="aliasform.currentAlias"
            :placeholder="selText"
            filterable
            allow-create
          >
            <el-option
              v-for="item in currentAliasList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAliasCancle">取 消</el-button>
        <el-button type="primary" @click="saveAlias">保 存</el-button>
      </div>
    </el-dialog>

    <DialogConfigCustomerCode
      :dialogVisible.sync="dialogConfigBusinessCodeVisible"
      :bizCalloutSubId="currentRowId"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import DialogConfigCustomerCode from "./components/dialog-config-customer-code.vue";
import openBusinese from "@/api/intranet/openBusinese/index.js";
import parseTime from "@/utils/parseTime.js";
import gwApiRequest from "@/utils/gwApiRequest.js";
import request from "@/utils/request";

export default {
  name: "JsfInterfaceList",
  components: {
    Pagination,
    DialogConfigCustomerCode,
    TagTip: () => import("@/components/common/TagTip.vue"),
  },
  props: {
    currentRowData: {
      type: Object,
      default: {},
    },
    hasUat: { type: Number, required: true },
  },
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      showTips:
        "可在此为外部应用配置外部调用京东物流API的JSF别名，配置京东物流调用外部API的业务编码，配置信息在对接方案发布后生效。",
      callDirectionOptions: [
        {
          value: 1,
          label: "外部调用京东物流",
        },
        {
          value: 2,
          label: "京东物流调用外部",
        },
      ],
      callDirectionForm: {
        callDirection: 1, //调用接口的方向1外调内，2内调外
        queryLike: "", //查询条件
      },
      envTable: {
        local: ["测试环境"],
        test: ["测试环境"],
        uat: ["生产环境"],
        prod: ["生产环境"],
      },
      env: window.env.baseEnv, //环境
      aliasform: {
        //别名dialogform
        currentAlias: "", //当前环境别名
        shadowboxAlias: "", //uat环境别名
        id: "", //接口ID
      },
      aliasRules: {
        currentAlias: [{ required: true, message: "请输入jsf别名" }],
      },
      aliasDialogFormVisible: false, //是否显示别名dialog
      currentAliasList: [], //当前环境别名

      currentRowId: 0,
      dialogConfigBusinessCodeVisible: false,
    };
  },
  filters: {
    formatInternalCallExternalCallBackUrlHeader(env) {
      const hashMap = new Map()
        .set("test", "测试环境回调URL")
        .set("uat", "生产环境回调URL")
        .set("prod", "生产环境回调URL");
      return hashMap.get(env) || "-";
    },
  },
  computed: {
    selText() {
      return "选择或填写" + this.envTable[this.env] + "JSF别名";
    },
  },
  methods: {
    // 查询内调外2
    async queryCallOutSubApiList() {
      const appCode = this.currentRowData.appKey;
      const { unitCode, supplierCode } = this.currentRowData;
      const queryLike = this.callDirectionForm.queryLike;
      const pageNumb = this.pageNum;
      const pageSize = this.pageSize;
      const data = {
        appCode,
        unitCode,
        supplierCode,
        queryLike,
        pageNumb,
        pageSize,
      };
      const response =
        await openBusinese.subscriptionRecord.queryCallOutSubApiList(data);
      this.tableData = response.data.list;
      this.total = response.data.total;
    },
    // 查询外调内1
    async queryOrderedInterfaceList() {
      await request({
        url: "/bizapinterface/queryOrderedInterfaceList",
        method: "get",
        params: {
          pageNumb: this.pageNum, //页码
          unitId: this.$route.params.id, //开放业务id
          pageSize: this.pageSize, //分页大小
          queryLike: this.callDirectionForm.queryLike, //模糊查询参数
          callDirection: 1,
          appKey: this.currentRowData.appKey, //appkey
        },
      })
        .then((response) => {
          if (response.code === 20000) {
            this.tableData = response.data.list;
            this.total = response.data.total;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //打开配置弹窗
    configurationBusinessCode(row) {
      this.dialogConfigBusinessCodeVisible = true;
      this.currentRowId = row.id;
    },
    //转换调用方向
    formatCallDirection(row) {
      const callDirectionMap = [, "外部调用京东物流", "京东物流调用外部"];
      return row.callDirection ? callDirectionMap[row.callDirection] : "-";
    },
    //转换时间戳
    formatParseTime(time) {
      return parseTime.timeInTable(time);
    },
    //别名转化
    formatAlias(row) {
      return row.alias;
    },
    //查询
    search() {
      const callDirection = this.callDirectionForm.callDirection;
      if (callDirection == 1) {
        //外调内
        this.queryOrderedInterfaceList();
      } else if (callDirection == 2) {
        //内调外
        this.queryCallOutSubApiList();
      }
    },
    //配置别名
    async configurationAlias(row) {
      this.aliasDialogFormVisible = true;
      this.aliasform.id = row.id;
      const response = await this.queryAliasByQualifiedName(
        row.interfaceName
      ).catch(() => {
        throw new Error("editData queryAliasByQualifiedName");
      });
      const { data } = response;
      if (data) {
        const aliasList = data.map((item) => {
          const name = item.alias;
          return { name };
        });
        this.currentAliasList = aliasList;
      }
      this.aliasform.currentAlias = row.alias;
      if (this.hasUat == 1) {
        this.aliasform.currentAlias = row.shadowboxAlias;
      }
    },
    //改变选择框
    selectChanged() {
      this.search();
    },
    //取消按钮
    handleAliasCancle() {
      this.aliasDialogFormVisible = false;
      this.$nextTick(() => {
        //置空
        this.aliasform.currentAlias = "";
        if (this.hasUat == 1) {
          this.aliasform.shadowboxAlias = "";
        }
      });
    },
    //保存别名
    saveAlias() {
      this.$refs["aliasform"].validate(async (valid) => {
        if (valid) {
          const appCode = this.currentRowData.appKey;
          const unitId = this.$route.params.id;
          const alias = this.aliasform.currentAlias;
          this.saveOrderedInterface({
            appKey: appCode,
            unitId: unitId,
            id: this.aliasform.id,
            alias,
          });
        } else {
          return false;
        }
      });
    },
    //根据api全路径查询杰夫别名
    async queryAliasByQualifiedName(qualifiedName) {
      return await gwApiRequest.post(
        "/ApiDepotService/queryAliasByQualifiedName",
        JSON.stringify([{ qualifiedName }])
      );
    },
    //保存别名腐乳
    saveOrderedInterface(data) {
      request({
        headers: {
          "Content-Type": "application/json",
        },
        url: "/bizapinterface/saveOrderedInterface",
        method: "post",
        data: data,
      })
        .then((response) => {
          if (response.code === 20000) {
            this.aliasDialogFormVisible = false;
            this.search();
          } else {
            this.$message.error("保存数据出错");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.queryOrderedInterfaceList();
  },
};
</script>

<style lang="scss" scoped>
.radio-container {
  text-align: center;
  margin-bottom: 20px;

  .el-radio-button {
    font-weight: normal;

    /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #3c6ef0;
      background: #fff;
    }
  }
}
</style>
