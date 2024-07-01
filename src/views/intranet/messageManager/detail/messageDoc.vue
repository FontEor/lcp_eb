<template>
  <div v-loading="loading" class="api-doc">
    <div class="content__title">
      <Title text="消息体" />
      <QuickMaintain
        v-if="editable"
        :qualifiedName="qualifiedName"
        :methodId="methodId"
        :methodName="methodName"
        :alias="alias"
        :isRequest="true"
        :handleUpdateParamList="handleUpdateParamList"
        :importTypes="['importJson']"
        :pQuickMaintainDocByJson="quickMaintainDocByJson"
      />
    </div>
    <div class="tab_wrap">
      <el-radio-group v-model="curTabName">
        <el-tooltip
          class="item"
          :disabled="!editXml"
          effect="dark"
          content="编辑中无法切换编辑模式，请保存后再切换。"
          placement="top-start"
        >
          <el-radio
            :disabled="editXml"
            :class="`button-radio button-radio-left ${
              curTabName === 'xml' && 'no-checked-left-radio'
            }`"
            border
            label="form"
            >表单编辑</el-radio
          >
        </el-tooltip>
        <el-tooltip
          class="item"
          :disabled="!editable"
          effect="dark"
          content="编辑中无法切换编辑模式，请保存后再切换。"
          placement="top-start"
        >
          <el-radio
            :disabled="editable"
            :class="`button-radio button-radio-right ${
              curTabName === 'form' && 'no-checked-right-radio'
            }`"
            border
            label="xml"
            >XML编辑</el-radio
          >
        </el-tooltip>
      </el-radio-group>
      <p class="warn" v-if="curTabName === 'xml'">
        请勿修改已存在参数的参数ID！新增的参数ID请维护为负数且不能重复!
      </p>
    </div>
    <div v-if="curTabName === 'form'">
      <ParamTable
        :editable="editable"
        :isRequest="true"
        :paramTableData.sync="messageTableData"
        :paramTableEditedData.sync="messageTableEditedData"
        ref="messageTable"
        :status="paramTableUseStatus"
        switchValueType="Number"
      />
      <StickyWrapper>
        <el-button
          class="button-wrapper"
          v-if="!editable"
          type="primary"
          @click="editable = true"
          :disabled="+status === 2 || +status === 4"
          >编 辑</el-button
        >
        <div v-else class="button-wrapper">
          <el-button @click="handleClickCancel">取 消</el-button>
          <el-button
            type="primary"
            :loading="saveLoading"
            @click="handleClickSave"
            >保 存</el-button
          >
        </div>
      </StickyWrapper>
    </div>
    <div v-show="curTabName === 'xml'">
      <MonacoEditor ref="MonacoEditor" :code="xmlCode" :editXml="editXml"></MonacoEditor>
      <StickyWrapper>
        <el-button type="primary" v-if="!editXml" @click="handleEditXml">编辑</el-button>
        <template v-else>
          <el-button @click="handleCancelMonacoEdit">取消</el-button>
          <el-button type="primary" @click="handleSaveXml">保存</el-button>
        </template>
      </StickyWrapper>
    </div>
  </div>
</template>

<script>
import StickyWrapper from "@/components/StickyWrapper.vue";
import Title from "@/components/Title.vue";
import ParamTable from "@/views/intranet/apiManager/apiList/detail/components/paramTable.vue";
import QuickMaintain from "@/views/intranet/messageManager/components/quickMaintain.vue";
import gateway from "@/api/intranet/gateway/index.js";
import MonacoEditor from "../components/MonacoEditor.vue";

let orgMessageTableData = null;
let orgXmlCode = '';
const exampleXml = `<!--请按照下方消息XML示例的格式维护消息-->
<params>
    <element id="-3657" elemType="object" type="java.lang.object" name="vbbvch" exampleValue="" required="0" comment="请替换为恰当的中文描述">
      <element id="-3658" elemType="single" type="java.lang.String" name="userName" exampleValue="" required="0" comment="请替换为恰当的中文描述"/>
      <element id="-3659" elemType="object" type="java.util.Listjava.lang.String" name="addressList" exampleValue="" required="0" comment="请替换为恰当的中文描述">
        <element id="-3660" elemType="object" type="com.jd.lcp.migrate.Address" name="address" exampleValue="" required="0" comment="请替换为恰当的中文描述">
          <element id="-3661" elemType="single" type="java.lang.String" name="addressName" exampleValue="" required="0" comment="请替换为恰当的中文描述"/>
          <element id="-3662" elemType="single" type="java.lang.String" name="remark" exampleValue="" required="0" comment="请替换为恰当的中文描述"/>
        </element>
      </element>
    </element>
  </params>
`;
export default {
  name: "messageManagerMessageDoc",
  components: {
    StickyWrapper,
    Title,
    ParamTable,
    QuickMaintain,
    MonacoEditor
  },
  props: {
    status: {
      // 0-初始化，1-编辑中，2-审批中，3-已发布，4-已下线;
      type: Number,
      required: true
    }
  },
  computed: {
    paramTableUseStatus() {
      /**
       * 将消息状态与api列表中的状态对应
       * api列表中的状态值：
       * 初始化：isOnline === 0 && +this.status === 1
       * 编辑中： +this.isOnline === 1 && +this.status === 1
       * 审批中： +this.status === 3 || +this.status === 9 || +this.status === 7
       * 已发布：+this.status === 4
       * 已下线：this.status === 6
       */
      const statusMap = [1, 1, 3, 4, 6];
      return statusMap[this.status] || NaN;
    }
  },
  data() {
    return {
      loading: true,
      editable: false,
      // 请求参数表格
      messageTableData: [],
      messageTableEditedData: [],
      saveLoading: false,
      // 提供API的方式
      qualifiedName: "",
      methodId: 0,
      methodName: "",
      alias: "",
      curTabName: "form",
      editXml: false,
      xmlCode: ''
    };
  },
  watch: {
    messageTableData: {
      // 监听请求参数数据变化时，更新编辑态请求参数表格数据
      handler(newValue) {
        this.messageTableEditedData = JSON.parse(JSON.stringify(newValue));
      }
    },
    curTabName: {
      async handler(newValue) {
        newValue === 'form' && this.queryDoc();
        newValue === 'xml' && this.fetchXmlDetail();
      },
      immediate: true,
    }
  },
  mounted() {
    // this.queryDoc();
  },
  methods: {
    handleEditXml() {
      this.editXml = true;
      if (!this.xmlCode) {
        this.xmlCode = exampleXml;
      }
    },
    handleCancelMonacoEdit() {
      this.editXml = false;
      this.xmlCode = orgXmlCode;
      this.$refs.MonacoEditor.setNewValue(this.xmlCode);
    },
    async handleSaveXml () {
      const param = [{topic: this.$route.params.topic, paramXml: this.$refs.MonacoEditor.getValue()}];
      const response = await gateway.messageAccessService.saveDocByXml(param)
      .catch(err => console.log(err));
      const {code} = response || {};
      if (+code === 20000) {
        this.editXml = false;
        this.fetchXmlDetail();
        this.$emit("reloadBasicInfo");
      }
    },
    async fetchXmlDetail() {
      const param = [{topic: this.$route.params.topic}];
      const response = await gateway.messageAccessService.queryMessageDocXml(param)
      .catch(err => console.log(err));
      const {code, data} = response || {};
      if (+code === 20000) {
        this.xmlCode = '';
        this.$nextTick(() => {
          this.xmlCode = data;
          orgXmlCode = this.xmlCode;
        })
      }
    },

    // 保存文档操作
    async saveDoc() {
      const data = [
        {
          topic: this.$route.params.topic,
          paramList: this.messageTableEditedData
        }
      ];
      return await gateway.messageAccessService.saveDoc(data);
    },
    // 加载API方法数据
    async queryDoc() {
      this.loading = true;
      const param = [{ topic: this.$route.params.topic }];
      const response = await gateway.messageAccessService
        .queryDoc(param)
        .catch(error => {
          this.loading = false;
        });
      const { code, data } = response || {};
      if (+code === 20000) {
        const { paramList, id } = data || {};
        const { baseEnv } = window.env;
        this.messageTableData = this.initTableData(paramList);
        orgMessageTableData = this.initTableData(paramList);
        this.methodId = id;
        this.methodName = (data && data[`${baseEnv}Method`]) || "";
        this.alias = (data && data[`${baseEnv}Alias`]) || "";
      }
      this.loading = false;
    },
    // 初始化表格数据，为children字段添加保底值
    initTableData(tableData) {
      return tableData.map(item => {
        let { children } = item;
        if (children && children.length > 0) {
          children = this.initTableData(children);
        } else {
          children = [];
        }
        return { ...item, children };
      });
    },
    // 更新参数列表操作
    handleUpdateParamList(newParamList) {
      this.messageTableData = this.initTableData(newParamList);
    },
    handleClickCancel() {
      this.messageTableData = JSON.parse(JSON.stringify(orgMessageTableData));
      this.editable = false;
    },
    // 保存文档操作
    async handleClickSave() {
      this.saveLoading = true;
      await Promise.all([this.$refs.messageTable.validateTable()])
        .catch(err => {
          this.saveLoading = false;
          this.$message.error({ message: "请将必填项填写完整" });
        })
        .then(async validator => {
          this.saveLoading = false;
          if (!validator) return;
          const saveResponse = await this.saveDoc().catch(err => {
            console.log("err", err);
          });
          if (saveResponse && +saveResponse.code === 20000) {
            this.editable = false;
            this.$message.success("保存成功！");
            this.queryDoc();
            this.$emit("reloadBasicInfo");
          }
        });
    },
    // 快速维护消息文档
    async quickMaintainDocByJson(param) {
      return await gateway.messageAccessService.quickMaintainDocByJson(param);
    }
  }
};
</script>

<style lang="scss" scoped>
.api-doc {
  margin-top: 8px;
  .content__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    padding: 8px 0;
  }
  .button-wrapper {
    margin-top: 22px;
  }
}
.tab_wrap {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .warn {
    color: red;
    font-weight: 600;
    font-size: 16px;
    padding-left: 10px;
  }
  .button-radio {
    margin: 0 !important;
    ::v-deep {
      .el-radio__inner {
        display: none;
      }
      .el-radio__label {
        padding-left: 0;
      }
    }
  }
  .button-radio-left {
    border-radius: 4px 0 0 4px;
  }
  .button-radio-right {
    border-radius: 0 4px 4px 0;
  }
  .no-checked-left-radio {
    border-right: none;
  }
  .no-checked-right-radio {
    border-left: none;
  }
}
</style>
