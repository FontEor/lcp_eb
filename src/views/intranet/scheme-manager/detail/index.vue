<template>
  <div class="detail">
    <div class="com-view-dep com-tit-view">
      <div class="dock-plan-header">
        <div class="tit-wrap" style="width: 70%; padding-right: 0">
          <h2 class="tit">{{ baseInfo.name }}（{{ baseInfo.code }}）</h2>
          <div v-if="baseInfo.status === 1" class="com-tag updateBtnColor">
            编辑中
          </div>
          <div v-if="baseInfo.status === 3" class="com-tag updateBtnColor">
            审核中
          </div>
          <div v-if="baseInfo.status === 4" class="com-tag normalBtnColor">
            审核通过
          </div>
          <div v-if="baseInfo.status === 5" class="com-tag normalBtnColor">
            已发布
          </div>
          <div v-if="baseInfo.status === 9" class="com-tag unknownBtnColor">
            审核未通过
          </div>
          <p class="tip">
            {{ baseInfo.createUser }} 创建于
            {{ baseInfo.createTime | parseTimefilter("{y}-{m}-{d} {h}:{i}") }}
          </p>
        </div>
        <div style="width: 30%; text-align: right">
          <span style="margin-right: 10px"
            >最近发布时间：{{ publishTimeStr }}</span
          >
          <el-tooltip
            v-if="!publishButtonDisable"
            content="提交审核通过后，才可将对接方案发布给ISV调用"
            placement="top"
          >
            <el-button
              type="primary"
              :disabled="baseInfo.status === 3"
              @click="onSubmit"
              >提交审核</el-button
            >
          </el-tooltip>
          <el-tooltip v-if="publishButtonDisable" placement="top">
            <div slot="content">发布对接方案内容到前台</div>
            <el-button type="primary" @click="onPublish">发布</el-button>
          </el-tooltip>
        </div>
      </div>
      <div
        v-if="baseInfo.status === 3"
        class="prompt-text"
        style="margin-top: 0.5rem"
      >
        <p>
          <i class="el-icon-warning"></i>
          您可以前往京me—流程中心(PC端为<a
            href="http://oa.jd.com/"
            target="_blank"
            >oa.jd.com</a
          >)—我的申请，查看对接方案审批进度。注：审核通过后，需要手动点击【发布】按钮，才会将对接方案更新至前台。
        </p>
      </div>
    </div>

    <el-tabs
      v-model="activeName"
      class="detail__tabs"
      :before-leave="beforeLeave"
      @tab-click="tabClick"
    >
      <el-tab-pane label="概览" name="overview">
        <keep-alive>
          <Overview
            v-if="activeName == 'overview'"
            ref="refFirstChild"
            @overviewEditEvent="overviewEditEvent"
            :publishStatus="baseInfo.publishStatus"
          />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="接口列表" name="interfaceList">
        <el-radio-group v-model="selectedRadio">
          <el-radio-button label="外部调用京东物流" />
          <el-radio-button label="京东物流调用外部" />
        </el-radio-group>
        <TagTip
          :text="baseInfo.domainType | formatDomainTypeTagTipText"
          :closable="false"
        />
        <!-- 外部调用京东物流 -->
        <ExternalCallInternal
          v-show="selectedRadio === '外部调用京东物流'"
          @updateDetailHeaderInfo="handleGetBizUnitPreById"
        />
        <!-- 京东物流调用外部 -->
        <InternalCallExternal
          v-show="selectedRadio === '京东物流调用外部'"
          @updateDetailHeaderInfo="handleGetBizUnitPreById"
        />
      </el-tab-pane>
      <el-tab-pane label="SDK信息" name="sdkInfo" :lazy="true">
        <SdkList
          v-if="sdkInfo == 'sdkList'"
          :baseInfoStatus.sync="baseInfo.status"
          @addSdkEvent="addSdkEvent"
          @sdkInterfaceList="downloadInterfaceEvent"
        />
        <SdkAdd
          v-if="sdkInfo == 'sdkAdd'"
          :sdkId="sdkId"
          :showInfoName="baseInfo.name"
          @showSdkEvent="showSdkEvent"
        />
        <SdkInterfaceList
          v-if="sdkInfo == 'sdkInterfaceList'"
          @showSdkEvent="showSdkEvent"
        />
      </el-tab-pane>
      <el-tab-pane label="消息列表" name="messageList">
        <MessageList
          v-if="activeName == 'messageList'"
          @updateDetailHeaderInfo="handleGetBizUnitPreById"
        />
      </el-tab-pane>
      <el-tab-pane label="使用手册" name="userManual">
        <UserManual v-if="activeName == 'userManual'" :basicId="baseInfo.id" />
      </el-tab-pane>
      <el-tab-pane label="订阅记录" name="orderRecord">
        <SubscriptionRecord v-if="activeName == 'orderRecord'" />
      </el-tab-pane>
      <el-tab-pane label="发布记录" name="ReleaseRecords">
        <ReleaseRecords v-if="activeName == 'ReleaseRecords'" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{ showDialogInfo }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="接口参数映射变更提醒" :visible.sync="riskDialogVisible">
      <p class="risk-title">
        以下接口的参数映射值已变更，为不影响运行时调用，请前往「接口列表-编辑-设置参数映射」调整参数！
      </p>
      <el-table :data="riskApiList" height="242" class="risk-table">
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">
            {{ +scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          label="中文名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="url"
          label="URL"
          width="250"
        ></el-table-column>
        <el-table-column
          property="risks"
          label="变更的参数映射项"
        ></el-table-column>
      </el-table>
      <p class="risk-btn-wrap">
        <el-button
          class="risk-btn"
          type="primary"
          @click="riskDialogVisible = false"
          >我知道了</el-button
        >
      </p>
    </el-dialog>
  </div>
</template>

<script>
import Overview from "./components/overview.vue";
import TagTip from "@/components/common/TagTip.vue";
import ExternalCallInternal from "./components/external-call-internal/index.vue";
import InternalCallExternal from "./components/internal-call-external/index.vue";
import SdkList from "./components/sdk-list.vue";
import SdkAdd from "./components/sdk-add/index.vue";
import SdkInterfaceList from "./components/sdk-interface-list.vue";
import MessageList from "./components/message-list/index.vue";
import UserManual from "./components/user-manual.vue";
import SubscriptionRecord from "@/views/intranet/scheme-manager/detail/components/subscription-record/index.vue";
import ReleaseRecords from "./components/release-records.vue";
import { parseTime } from "@/utils";
import api from "@/api/index.js";
import request from "@/utils/request.js";
import bizunit from "@/api/intranet/lcp/bizunit.js";

export default {
  name: "Detail",
  components: {
    Overview,
    TagTip,
    ExternalCallInternal,
    InternalCallExternal,
    SdkList,
    SdkAdd,
    SdkInterfaceList,
    MessageList,
    UserManual,
    SubscriptionRecord,
    ReleaseRecords,
  },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),
      baseInfo: {},
      submitVisible: false,
      activeName: "overview",
      selectedRadio: "外部调用京东物流",
      sdkInfo: "sdkList",
      applicationInfo: {
        code: "",
        name: "",
        interfaceNum: 0,
        sdkNum: 0,
        userType: 1,
        tempUrl: 1,
      },
      submitAlready: false,
      sdkId: null,
      appType: 0,
      id: 0,
      env: window.env.baseEnv,
      dialogVisible: false,
      showDialogInfo: "",
      riskDialogVisible: false,
      riskApiList: [
        // {
        //   name: '查询字段数据',
        //   url: '/lcpdictservice/querydictbyban',
        //   risks: 'PIN、APPKEY'
        // },
        //         {
        //   name: 'name1',
        //   url: 'url1',
        //   risks: 'risks1111'
        // },
        //         {
        //   name: 'name1',
        //   url: 'url1',
        //   risks: 'risks1111'
        // },
        //         {
        //   name: 'name1',
        //   url: 'url1',
        //   risks: 'risks1111'
        // },
        //         {
        //   name: 'name1',
        //   url: 'url1',
        //   risks: 'risks1111'
        // },
        //         {
        //   name: 'name1',
        //   url: 'url1',
        //   risks: 'risks1111'
        // },
      ],
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    },
    parseTaskStatusfilter(obj) {
      let statusStr = ["创建", "准备执行", "执行中", "执行成功", "执行失败"];
      return statusStr[obj];
    },
    formatDomainTypeTagTipText(domainType) {
      const hashMap = new Map().set(1, "JSF").set(2, "HTTP");
      const domainTypeText = hashMap.get(domainType) || "-";
      return `当前对接方案下仅支持添加${domainTypeText}类型的接口`;
    },
  },
  computed: {
    publishTimeStr() {
      if (this.baseInfo.publishTime) {
        return parseTime(this.baseInfo.publishTime, "{y}-{m}-{d} {h}:{i}");
      } else {
        if (this.baseInfo.status === 1) {
          return "未发布";
        }
        if (this.baseInfo.status === 3) {
          return "审核中";
        }
        if (
          this.baseInfo.status === 4 ||
          this.baseInfo.status === 5 ||
          this.baseInfo.status === 9
        ) {
          return "-";
        }
      }
    },
    publishButtonDisable() {
      // 只有在发布中 4 的时候才能发布
      if (this.baseInfo.status === 4) {
        return true;
      }
      return false;
    },
  },
  methods: {
    // 根据对接方案ID查询对接方案详情
    async getBizUnitPreById() {
      const { unitId } = this;
      const id = unitId;
      const params = { id };
      return await bizunit.getBizUnitPreById(params).catch((error) => {
        throw new Error(`getBizUnitPreById, ${error}`);
      });
    },

    // 根据对接方案ID查询对接方案详情
    async handleGetBizUnitPreById() {
      const { data } = await this.getBizUnitPreById().catch((error) => {
        throw new Error(`handleGetBizUnitPreById, ${error}`);
      });
      this.baseInfo = data || {};
    },

    tabClick(e) {
      // tab切换 修改url
      let target = e.name;
      if (e.name === "sdkInfo") {
        target = this.sdkInfo;
      } else if (e.name === "interfaceList") {
        this.selectedRadio = "外部调用京东物流";
      }
      this.$router.push({
        // path: '/openBiz/openBizDetail',
        name: "OpenBizOpenBizDetail",
        params: { id: this.baseInfo.id },
        query: { tag: target },
      });
    },
    beforeLeave(activeName, oldActiveName) {
      if (
        oldActiveName === "overview" &&
        this.$refs.refFirstChild.editor.status
      ) {
        this.$message.error("保存完概览数据才能切换!");
        return false;
      }
    },
    addSdkEvent(sdkId) {
      this.sdkInfo = "sdkAdd";
      if (sdkId) {
        this.sdkId = sdkId;
      }
    },
    showSdkEvent() {
      this.sdkInfo = "sdkList";
      //这里需要把sdkId清空，变成null，否则编辑后再创建，会把编辑的信息回显到创建上
      this.sdkId = null;
    },
    downloadInterfaceEvent() {
      this.sdkInfo = "sdkInterfaceList";
    },
    overviewEditEvent(hasUat) {
      this.baseInfo.hasUat = hasUat;
      this.baseInfo.status = 1;
      this.init();
    },
    async onSubmit() {
      this.submitVisible = false;
      if (
        this.activeName === "overview" &&
        this.$refs.refFirstChild.editor.status
      ) {
        this.$message.error("保存完概览数据才能提交申请!");
        return false;
      }
      const hasRisk = await this.preSubmitCheck();
      if (hasRisk) return;
      request({
        url: "/bizapinterface/queryInterfaceList",
        method: "get",
        params: {
          pageSize: 9999,
          pageNumb: 1,
          orderBy: "update_time",
          orderType: "desc",
          unitId: this.baseInfo.id,
          callDirection: 1,
        },
      })
        .then((resolve) => {
          /**
           * 线上并且是jsf类型并且有uat环境选择，判断是否可以提交
           */
          if (
            (this.env == "uat" || this.env == "prod") &&
            this.baseInfo.domainType == 1 &&
            this.baseInfo.hasUat == 1
          ) {
            //判断接口是否填写Uat别名和UatToken
            let printShowInfo = [];
            if (resolve.data && resolve.data.list) {
              for (let i = 0; i < resolve.data.list.length; i++) {
                let apiObj = resolve.data.list[i];
                if (!apiObj.shadowboxAlias || apiObj.shadowboxAlias == "") {
                  printShowInfo.push(
                    apiObj.apiCode + "(" + apiObj.apiName + ")"
                  );
                }
              }
              this.showDialogInfo =
                "当前对接方案配置了【对接环境】支持“预发环境”，以下接口必须配置“预发环境JSF别名”才能提交审核（操作位置：方案管理详情-接口列表-编辑）。";
              if (printShowInfo.length > 0) {
                this.showDialogInfo =
                  this.showDialogInfo + printShowInfo.join("、");
                this.dialogVisible = true;
                return false;
              }
            }
            this.jmpPublish();
          } else {
            this.jmpPublish();
          }
        })
        .catch((error) => {
          console.log("postInterfaceListData 请求错误", error);
        });
    },
    jmpPublish() {
      let url = "/bizunit/canPublish";
      let params = { id: this.baseInfo.id };
      request({
        url: url,
        method: "get",
        params: params,
      })
        .then((rsp) => {
          console.log("rsp", rsp);
          if (rsp.code === 20000) {
            this.$router.push({
              name: "OpenBizOpenBizDetailSubmitReview",
              params: { id: this.baseInfo.id },
            });
          }
        })
        .catch((e) => {});
    },
    preSubmitCheck() {
      return new Promise(async (res) => {
        const { data } = await bizunit
          .warnRisk(this.baseInfo.id)
          .catch((err) => {
            console.log("err", err);
          });
        const { risk, apiList } = data || {};
        this.riskDialogVisible = risk;
        this.riskApiList = apiList || [];
        res(risk);
      });
    },
    onPublish() {
      if (
        this.activeName === "overview" &&
        this.$refs.refFirstChild.editor.status
      ) {
        this.$message.error("请保存正在编辑的信息，或取消编辑");
        return false;
      }
      this.$router.push({
        name: "OpenBizOpenBizDetailPublishBizUnit",
        params: { id: this.baseInfo.id },
      });
    },
    onModifyEvent() {
      this.baseInfo.status = 1;
      this.submitAlready = false;
    },
    async init(){
      this.baseInfo.id = parseInt(this.$route.params.id);
      let tabName = this.$route.query.tag;
      if (
        tabName === "sdkList" ||
        tabName === "sdkAdd" ||
        tabName === "sdkInterfaceList"
      ) {
        this.activeName = "sdkInfo";
        this.sdkInfo = tabName;
      } else if (tabName != null) {
        this.activeName = tabName;
      } else {
        this.activeName = "overview";
      }
      await this.handleGetBizUnitPreById().catch((error) => {
        throw new Error(`created, ${error}`);
      });
      // 获取对接方案的访问控制配置
      const data = [this.baseInfo.id];
      api.openBiz
        .postBizUnitAccessData(data)
        .then((response) => {
          if (response.data) {
            this.appType = response.data.appType;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  async created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.detail {
  .prompt-text {
    margin-top: 0.5rem;
    background-color: #f5f5f5;
  }
  .dock-plan-header {
    display: flex;
    align-items: center;
  }
  .detail__tabs {
    margin: 20px;
    margin-bottom: 0;
    padding: 10px 20px 20px;
    min-height: calc(100vh - 220px);
    background: #fff;

    // 使用底部粘性组件需要将父元素overflow设为visible
    ::v-deep.el-tabs__content {
      position: static;
      overflow: visible;
    }
    .el-radio-group {
      padding: 16px;
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
  }
}
.risk-table {
  margin: 12px 0 30px 0;
}
.risk-btn-wrap {
  text-align: right;
}
.risk-title {
  color: rgba(102, 102, 102, 0.8);
}
</style>
