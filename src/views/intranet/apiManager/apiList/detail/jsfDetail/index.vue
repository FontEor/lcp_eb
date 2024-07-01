<template>
  <!-- JSF协议API详情 -->
  <div v-loading.lock="loading" class="jsf-detail">
    <!-- 顶栏 -->
    <HeaderInfo
      :imagePath="imagePath"
      :url="qualifiedName"
      :name="cnName"
      :createUser="createUser"
      :createTime="createTime"
      :statusInfo="jsfBtnStatus.statusInfo"
    >
      <el-tooltip placement="top">
        <div slot="content">
          如果控制台中的API文档/使用手册有变更，则需发布到前台，才会实际生效。
        </div>
        <el-button
          type="primary"
          @click="handleClickPublish"
          v-if="jsfBtnStatus.publish.visible"
          :disabled="jsfBtnStatus.publish.disabled"
          >发 布</el-button
        >
      </el-tooltip>
      <div
        slot="hintContent"
        v-if="status === 3 || status === 7 || status === 9"
      >
        <i class="el-icon-warning"></i>
        您可联系<a href="timline://chat/?topin=zhangjuzheng3">zhangjuzheng3</a
        >或<a href="timline://chat/?topin=dongguojun1">dongguojun1</a
        >提醒审批，审核通过后发布内容生效。
      </div>
    </HeaderInfo>
    <!-- 标签页 -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClickTab">
      <el-tab-pane label="基础数据" name="basic-data">
        <BasicData
          v-if="activeName === 'basic-data'"
          :status="status"
          @updateStatus="updateStatus"
          :jsfBasicEditBtnStatus="jsfBtnStatus.basicEdit"
        />
      </el-tab-pane>
      <el-tab-pane label="方法列表" name="method-list">
        <MethodList
          v-if="activeName === 'method-list'"
          :qualifiedName="qualifiedName"
          @updateStatus="updateStatus"
          :jsfAddBtnStatus="jsfBtnStatus.functionListAdd"
          :status="status"
          tabName="jsf"
        />
      </el-tab-pane>
      <el-tab-pane label="调用方" name="caller">
        <Caller v-if="activeName === 'caller'" />
      </el-tab-pane>
      <el-tab-pane label="别名列表" name="alias-list">
        <AliasList
          v-if="activeName === 'alias-list'"
          :jsfAliasAddBtnStatus="jsfBtnStatus.aliasAdd"
          :jsfAliasEditBtnStatus="jsfBtnStatus.aliasEdit"
          :jsfAliasDeleteBtnStatus="jsfBtnStatus.aliasDelete"
          @updateStatus="updateStatus"
        />
      </el-tab-pane>
      <el-tab-pane label="更新记录" name="update-records">
        <UpdateRecords v-if="activeName === 'update-records'" />
      </el-tab-pane>
      <el-tab-pane label="消息推送" name="push-message">
        <PushMessage v-if="activeName === 'push-message'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HeaderInfo from "@/views/intranet/apiManager/apiList/detail/components/HeaderInfo.vue";
import BasicData from "@/views/intranet/apiManager/apiList/detail/jsfDetail/basicData.vue";
import MethodList from "@/views/intranet/apiManager/apiList/detail/jsfDetail/methodList/index.vue";
import Caller from "@/views/intranet/apiManager/apiList/detail/jsfDetail/caller.vue";
import AliasList from "@/views/intranet/apiManager/apiList/detail/jsfDetail/aliasList.vue";
import UpdateRecords from "@/views/intranet/apiManager/apiList/detail/jsfDetail/updateRecords.vue";
import PushMessage from "@/views/intranet/apiManager/apiList/detail/jsfDetail/pushMessage.vue";
import imagePath from "@/assets/intranet/images/apiManager/detail/jsf.png";
import jsfDetail from "@/api/intranet/apiManager/jsfDetail/index.js";

export default {
  name: "JsfDetail",
  components: {
    HeaderInfo,
    BasicData,
    MethodList,
    Caller,
    AliasList,
    UpdateRecords,
    PushMessage,
  },
  computed: {
    jsfBtnStatus() {
      let basicEdit = {
        visible: true,
        disabled: false,
      };
      let functionListAdd = {
        visible: true,
        disabled: false,
      };
      let aliasAdd = {
        visible: true,
        disabled: false,
      };
      let aliasEdit = {
        visible: true,
        disabled: false,
      };
      let aliasDelete = {
        visible: true,
        disabled: false,
      };
      let publish = {
        visible: true,
        disabled: false,
      };
      let statusInfo = {
        text: "",
        className: "",
      };
      if (+this.isOnline === 0 && +this.status === 1) {
        //初始化：
        statusInfo.text = "初始化";
        statusInfo.className = "status status_init";
      } else if (+this.isOnline === 1 && +this.status === 1) {
        //编辑中：
        statusInfo.text = "编辑中";
        statusInfo.className = "status status_edit";
      } else if (
        +this.status === 3 ||
        +this.status === 9 ||
        +this.status === 7
      ) {
        // 审批中：
        statusInfo.text = "审批中";
        statusInfo.className = "status status_approve";
        basicEdit.disabled = true;
        functionListAdd.disabled = true;
        aliasAdd.disabled = true;
        aliasEdit.disabled = true;
        aliasDelete.disabled = true;
        publish.disabled = true;
      } else if (+this.status === 4) {
        // 已发布：
        statusInfo.text = "已发布";
        statusInfo.className = "status status_released";
        publish.disabled = true;
      } else if (this.status === 6) {
        // 已下线
        statusInfo.text = "已下线";
        statusInfo.className = "status status_offline";
        basicEdit.disabled = true;
        functionListAdd.disabled = true;
        aliasAdd.disabled = true;
        aliasEdit.disabled = true;
        aliasDelete.disabled = true;
        publish.disabled = false;
      }
      return {
        basicEdit,
        functionListAdd,
        aliasAdd,
        aliasEdit,
        aliasDelete,
        publish,
        statusInfo,
      };
    },
  },
  data() {
    const self = this;
    return {
      id: self.$route.params.id,
      type: self.$route.params.type,
      activeName: self.$route.query.tab || "basic-data",
      loading: true,
      imagePath,
      qualifiedName: "",
      cnName: "",
      createUser: "",
      createTime: "2021-01-01T09:00:00.000+0000",
      status: 1,
      isOnline: null,
    };
  },
  methods: {
    // API管理-选择JSF协议-点击管理进入JSF协议API详情-显示顶栏信息
    async findApiBaseInfo() {
      const { id } = this;
      const data = [{ id }];
      return await jsfDetail.findApiBaseInfo(data).catch((error) => {
        const { message } = error;
        message && this.$message.error(message);
        throw new Error("findApiBaseInfo");
      });
    },
    // API管理-选择JSF协议-点击管理进入JSF协议API详情-点击发布按钮校验
    async verifyApiSummaryFull() {
      const { id } = this;
      const params = { id };
      return await jsfDetail.verifyApiSummaryFull(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("verifyApiSummaryFull");
      });
    },
    // 点击标签操作，跳转路由
    handleClickTab() {
      const { type, id, activeName } = this;
      const tab = activeName;
      const name = "ApiManagerDetail";
      const params = { type, id };
      const query = { tab };
      this.$router.push({ name, params, query });
    },
    // 更新JSF类型API状态
    async updateStatus() {
      console.log("updateStatus");
      this.loading = true;
      const { data } = await this.findApiBaseInfo().catch(() => {
        throw new Error("updateStatus findApiBaseInfo");
      });
      const {
        qualifiedName,
        cnName,
        createUser,
        createTime,
        status,
        isOnline,
      } = data;
      this.qualifiedName = qualifiedName;
      this.cnName = cnName;
      this.createUser = createUser;
      this.createTime = createTime;
      this.status = status;
      this.loading = false;
      this.isOnline = isOnline;
    },
    // 点击发布按钮操作，校验API信息跳转至发布页面
    async handleClickPublish() {
      await this.verifyApiSummaryFull().catch(() => {
        throw new Error("handleClickPublish");
      });
      const { id, qualifiedName } = this;
      this.$router.push({
        name: "ApiManagerApiTabsPublishOne",
        params: { id },
        query: { qualifiedName },
      });
    },
  },
  created() {
    this.updateStatus();
  },
};
</script>

<style lang="scss" scoped>
.jsf-detail {
  .el-tabs {
    ::v-deep .el-tabs__header {
      background: #f5f5f5;
      border-bottom: none;
      margin: 0;
      position: -webkit-sticky;
      position: sticky;
      top: 60px;
      z-index: 1;
      .el-tabs__item {
        border: none;
      }
    }
    ::v-deep .el-tabs__content {
      padding: 16px;
      background: #fff;
      min-height: calc(100vh - 250px);
      // 底部粘性按钮生效条件
      position: static;
      overflow: visible;
    }
  }
}
</style>
