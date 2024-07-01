<template>
  <div class="partner-message-list">
    <el-table ref="partnerTable" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" min-width="80">
      </el-table-column>
      <el-table-column prop="name" label="TOPIC" min-width="200">
      </el-table-column>
      <el-table-column prop="chineseName" label="中文名称" min-width="200">
      </el-table-column>
      <el-table-column prop="descr" label="描述" min-width="200">
      </el-table-column>
      <el-table-column prop="receiveType" label="接收方式" min-width="200">
        <template slot-scope="scope">
          {{ formatReceiveType(scope.row.receiveType) }}
        </template>
      </el-table-column>
      <el-table-column prop="callUrl" min-width="200">
        <template #header>
          <span>{{ env | formatInternalCallExternalCallUrlHeader }}</span>
        </template>
        <template #default="{ row: { callUrl } }">
          {{ formatTableData(callUrl) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="env === 'uat' || env === 'prod'"
        prop="shadowboxCallUrl"
        label="预发环境回调URL"
        min-width="200"
      >
        <template #default="{ row: { shadowboxCallUrl } }">
          <span>{{
            hasUat
              | formatInternalCallExternalShadowboxCallUrlText(shadowboxCallUrl)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="订阅时间" min-width="200">
        <template slot-scope="scope">
          {{ formatParseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="routeCode" min-width="160">
        <template slot="header">
          <span>业务编码</span>
          <el-tooltip
            placement="top"
            content="业务系统用于区分客户的编码，用于平台将业务系统推送的消息转发至正确的开发商应用"
          >
            <i class="el-icon-help-solid"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          {{ formatTableData(scope.row.routeCode) }}
        </template>
      </el-table-column>
      <el-table-column prop="ediDtfileName" min-width="220">
        <template slot="header">
          <span>字段转换xml文件</span>
          <el-tooltip
            placement="top"
            content="适用场景：1、消息报文格式在“JSON”和“XML”之间转换；2、消息报文参数名称映射为其他名称"
          >
            <i class="el-icon-help-solid"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-upload
            accept=".xml"
            :action="uploadUrl"
            :headers="myheader"
            class="el-upload"
            :before-upload="beforeUploadHandle"
            :on-success="
              (response, file, fileList) =>
                uploadSuccessHandle(response, file, fileList, scope.row)
            "
            :on-error="uploadErrorHandle"
            :on-preview="handlePreview"
            :on-remove="
              (file, fileList) => handleRemove(file, fileList, scope.row)
            "
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="formatFileList(scope.row)"
          >
            <el-button v-if="!scope.row.ediDtfileName" type="text"
              >上传xml文件</el-button
            >
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="setBusinessCode(scope)"
            >设置业务编码</el-button
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
      :reloadTableData="findSubMsgByAppKey"
    />
    <!-- 设置业务编码对话框 -->
    <el-dialog
      title="设置业务编码"
      :visible.sync="dialogVisible"
      :before-close="beforeClose"
      width="460px"
    >
      <div class="dialog-text">请注意：保存后，无需发布对接方案即可生效</div>
      <el-form
        ref="routeCodeForm"
        :model="routeCodeFormData"
        :rules="routeCodeFormRules"
        label-width="100px"
      >
        <el-form-item label="业务编码" prop="routeCode">
          <el-input
            v-model.trim="routeCodeFormData.routeCode"
            placeholder="010K132209"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="saveRouteCode">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import openBusinese from "@/api/intranet/openBusinese/index.js";
import parseTime from "@/utils/parseTime.js";
import axios from "axios";

export default {
  name: "PartnerMessageList",
  components: {
    Pagination,
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
      env: window.env.baseEnv,
      tableData: [],
      dialogVisible: false,
      routeCodeFormData: {},
      routeCodeFormRules: {
        routeCode: [
          { required: true, message: "请输入业务编码" },
          { max: 50, message: "请输入1-50个字符" },
        ],
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      myheader: {
        bucket: window.env.gatewayPartnerMessageXmlBucket,
      },
      uploadUrl:
        window.env.gatewayFileBaseApi +
        "lop/mulfile/upload?LOP-DN=" +
        window.env.gatewayPartnerMessageLopDn,
      fileList: [],
    };
  },
  filters: {
    formatInternalCallExternalCallUrlHeader(env) {
      const hashMap = new Map()
        .set("test", "测试环境回调URL")
        .set("uat", "生产环境回调URL")
        .set("prod", "生产环境回调URL");
      return hashMap.get(env) || "-";
    },
    formatInternalCallExternalShadowboxCallUrlText(hasUat, shadowboxCallUrl) {
      return (hasUat && shadowboxCallUrl) || "-";
    },
  },
  methods: {
    formatTableData(val) {
      return val || "-";
    },

    formatFileList(row) {
      if (row.ediDtfile && row.ediDtfileName) {
        return [{ name: row.ediDtfileName, jssKey: row.ediDtfile }];
      } else {
        return [];
      }
    },
    formatReceiveType(receiveType) {
      const receiveTypeMap = [, "WebSocket", "HTTP"];
      return receiveTypeMap[receiveType];
    },
    //转换时间戳
    formatParseTime(time) {
      return parseTime.timeInTable(time);
    },
    setBusinessCode(scope) {
      this.dialogVisible = true;
      const rowCopy = JSON.parse(JSON.stringify(scope.row));
      this.routeCodeFormData = rowCopy;
    },
    //取消按钮
    handleCancle() {
      this.resetForm();
      this.dialogVisible = false;
    },
    // 关闭对话框
    beforeClose(done) {
      this.resetForm();
      done();
    },
    // 重置表单内容
    resetForm() {
      this.$nextTick(() => {
        this.$refs["routeCodeForm"].resetFields();
      });
    },
    async findSubMsgByAppKey() {
      const data = {
        page: this.pageNum,
        pageSize: this.pageSize,
        appKey: this.currentRowData.appKey,
        unitId: Number(this.$route.params.id),
      };
      const response = await openBusinese.subscriptionRecord.findSubMsgByAppKey(
        data
      );
      this.tableData = response.data.list;
      this.total = response.data.total;
      this.$nextTick(() => {
        this.$refs.partnerTable.doLayout();
      });
    },

    async savePartnerRouteConfig(data) {
      const response =
        await openBusinese.subscriptionRecord.savePartnerRouteConfig(data);
      return response;
    },

    // 保存业务编码
    async saveRouteCode() {
      await this.$refs.routeCodeForm
        .validate()
        .then(async () => {
          const msgName = this.routeCodeFormData.name;
          const appKey = this.currentRowData.appKey;
          const {
            id,
            unitId,
            name,
            ediDtfileName,
            ediDtfile,
            routeCode,
          } = this.routeCodeFormData;
          const partnerMessageRouteConfigList = [
            {
              routeCode,
              msgName: msgName,
              ediDtfileName: ediDtfileName,
              ediDtfile: ediDtfile,
            },
          ];
          const data = {
            id,
            unitId,
            name,
            appKey,
            partnerMessageRouteConfigList,
          };
          const response = await this.savePartnerRouteConfig(data);
          if (response) {
            this.resetForm();
            this.dialogVisible = false;
            this.findSubMsgByAppKey();
          }
        })
        .catch(() => {});
    },
    //文件删除时触发
    async handleRemove(file, fileList, row) {
      this.fileList = [];
      const ediDtfileName = "";
      const ediDtfile = "";
      const appKey = this.currentRowData.appKey;
      const msgName = row.name;
      const {
        id,
        unitId,
        name,
        routeCode,
      } = row;
      const partnerMessageRouteConfigList = [
        {
          routeCode,
          msgName: msgName,
          ediDtfileName: ediDtfileName,
          ediDtfile: ediDtfile,
        },
      ];
      const data = {
        id,
        unitId,
        name,
        appKey,
        partnerMessageRouteConfigList,
      };
      const res = await this.savePartnerRouteConfig(data);
      if (res) {
        this.findSubMsgByAppKey();
      }
    },
    //点击文件列表
    handlePreview(file) {
      console.log("点击已经上传的文件时触发", file);
      let jssKey = file.jssKey;
      if (jssKey != null) {
        let gwUploadRequest = axios.create({
          // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
          baseURL: window.env.gatewayFileBaseApi, // url = base url + request url
          withCredentials: true, // send cookies when cross-domain requests
          timeout: 100000, // request timeout
          headers: {
            "LOP-DN": window.env.gatewayPartnerMessageLopDn,
            fileName: jssKey,
            bucket: window.env.gatewayPartnerMessageXmlBucket,
          },
          responseType: "blob",
        });
        gwUploadRequest({
          url: "/lop/file/download",
          method: "get",
        })
          .then((drsp) => {
            const blob = new Blob([drsp.data], {
              type: "application/octet-stream",
            });
            if (typeof window.navigator.msSaveBlob !== "undefined") {
              // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件,文件重命名
              window.navigator.msSaveBlob(blob, decodeURI(file.name));
            } else {
              // 创建新的URL并指向File对象或者Blob对象的地址
              const blobURL = window.URL.createObjectURL(blob);
              // 创建a标签，用于跳转至下载链接
              const tempLink = document.createElement("a");
              tempLink.style.display = "none";
              tempLink.href = blobURL;
              //文件重命名
              tempLink.setAttribute("download", decodeURI(file.name));
              // 兼容：某些浏览器不支持HTML5的download属性
              if (typeof tempLink.download === "undefined") {
                tempLink.setAttribute("target", "_blank");
              }
              // 挂载a标签
              document.body.appendChild(tempLink);
              tempLink.click();
              document.body.removeChild(tempLink);
              // 释放blob URL地址
              window.URL.revokeObjectURL(blobURL);
            }
          })
          .catch((de) => {
            console.log(de);
          });
      } else {
        this.$message.error("文件不存在!");
      }
    },
    //上传文件数量超过1
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 上传之前
    beforeUploadHandle(file) {
      const isLtM = file.size / 1024 / 1024 < 10;
      if (!isLtM) {
        this.$message.error("字段转换xml文件大小不能超过 10MB!");
        return false;
      }
      let str = file.name;

      if (
        str.length < 5 &&
        str.substring(file.name.length - 4) !== ".xml" &&
        str.substring(file.name.length - 4) !== ".XML"
      ) {
        this.$message({
          message: "只支持上传xml文件",
          type: "error",
          center: true,
        });
        return false;
      }
      var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;

      if (patrn.exec(file.name)) {
        this.$message({
          message: "上传的文件名不能包含中文",
          type: "error",
          center: true,
        });
        return false;
      }

      this.myheader.fileName = this.getUUID();
      return isLtM;
    },
    //获得UUID编码做文件的前缀
    getUUID() {
      var s = [];
      var hexDigits = "0123456789abcdefghjklmnopqrstuvwxyz";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      var uuid = "" + new Date().getTime() + s.join("");
      return uuid;
    },
    //上传成功后触发
    async uploadSuccessHandle(response, file, fileList, row) {
      console.log(row, "row");
      console.log(file, "file");
      console.log(fileList, "fileList");
      console.log(response, "response");
      const ediDtfileName = file.name;
      const ediDtfile = response.fileName[0];
      const appKey = this.currentRowData.appKey;
      const msgName = row.name;
      const {
        id,
        unitId,
        name,
        routeCode,
      } = row;
      const partnerMessageRouteConfigList = [
        {
          routeCode,
          msgName: msgName,
          ediDtfileName: ediDtfileName,
          ediDtfile: ediDtfile,
        },
      ];
      const data = {
        id,
        unitId,
        name,
        appKey,
        partnerMessageRouteConfigList,
      };
      const res = await this.savePartnerRouteConfig(data);
      if (res) {
        this.findSubMsgByAppKey();
      }
    },
    //上传失败后触发
    uploadErrorHandle() {
      this.$message.error("上传失败，请重新上传");
    },
  },
  mounted() {
    this.findSubMsgByAppKey();
  },
};
</script>

<style lang="scss" scoped>
.partner-message-list {
  .dialog-text {
    color: red;
    margin-bottom: 14px;
  }
  ::v-deep .el-upload {
    display: block;
    text-align: left;
  }
  // 去除上传时的动画效果，避免撑开表格行高
  ::v-deep .el-upload-list__item {
    transition: none;
  }
  // 去除文件删除时的文字提示
  ::v-deep .el-upload-list__item.is-success.focusing .el-icon-close-tip {
    display: none;
  }
}
</style>