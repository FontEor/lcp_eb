<template>
  <div class="myFormBox">
    <el-button :class="{ autoGeneClass: isAutoGene }" @click="handleClick(true)"
      >自动生成SDK</el-button
    >
    <el-button
      @click="handleClick(false)"
      style="margin-left: 0"
      :class="{ autoGeneClass: !isAutoGene }"
      >手动生成SDK</el-button
    >

    <div v-if="isAutoGene">
      <p style="margin: 30px">
        （推荐使用）根据您上一步选择的接口，系统自动生成SDK
      </p>
      <el-button type="primary" @click="downloadProj">生成SDK</el-button>
    </div>
    <div v-else>
      <p style="margin: 30px">
        根据您上一步选择的接口，先下载SDK工程文件，然后按照<el-link
          type="primary"
          href="http://lcp.jdl.com/#/apiNewHand/53373"
          target="_blank"
          >文档</el-link
        >手动生成jar包并上传
      </p>
      <div>
        <el-button type="primary" @click="downloadProj"
          >下载SDK工程文件</el-button
        >
        <el-upload
          style="display: inline; margin-left: 1rem"
          :action="uploadUrl"
          :multiple="false"
          :before-upload="beforeUploadHandle"
          :on-success="uploadSuccessHandle"
          :on-error="uploadErrorHandle"
          :file-list="uploadFile.fileList"
        >
          <el-button size="medium" type="primary">上传SDK</el-button>
        </el-upload>
      </div>
    </div>

    <!-- <el-row style="text-align: center; margin-bottom: 10px">
      <el-link
        type="primary"
        :underline="false"
        :href="this.sdkCreateUrl"
        target="_blank"
        >如何打包生成SDK？</el-link
      >
    </el-row> -->

    <div v-if="uploading" style="text-align: center; margin-top: 1.7rem">
      <span @click="downloadSdk"
        ><i class="el-icon-link"></i>{{ recordSdk.fileName }}</span
      >
    </div>

    <el-dialog
      class="process-dialog"
      :visible.sync="downloadDialogVisible"
      width="50%"
      :show-close="recordSdk.failNum > 0"
      :close-on-click-modal="false"
      center
      :title="titleData"
    >
      <el-progress
        v-if="recordSdk.failNum == 0"
        :percentage="percentage"
        :format="format"
        :color="colors"
      ></el-progress>
      <el-row class="">
        <span v-if="percentage < 100 && recordSdk.failNum == 0">{{
          generateCopy
        }}</span>
        <span v-else-if="percentage >= 100 && recordSdk.failNum == 0">{{
          sdkMessage
        }}</span>
        <pre
          class="code"
          v-else-if="recordSdk.failNum > 0"
          style="color: #f56c6c"
          >{{ jsonData }}
          <p style="text-align:left">注意：仅展示1000字</p>
        </pre>
        <!-- <span v-else-if="recordSdk.failNum > 0" style="color: #f56c6c"
          >
          {{ recordSdk.failCause }}
        </span> -->
      </el-row>

      <el-row class="dialog-row">
        <el-button @click="cancelDownloadDialogVisible">关闭</el-button>
        <el-button
          @click="downloadSdk"
          v-if="this.percentage >= 100 && this.recordSdk.failNum == 0"
          type="primary"
          >下载</el-button
        >
      </el-row>
    </el-dialog>

    <el-form
      ref="form"
      label-width="0px"
      size="medium"
      style="width: 40%; margin: 30px auto"
    >
      <el-form-item style="text-align: center">
        <el-button class="last" style="" @click="lastStep">上一步</el-button>
        <el-button type="primary" style="" @click="nextStep()"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import request from "@/utils/request";

export default {
  name: "sdkAddStep4",
  data() {
    return {
      loading: false,
      timer: null,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#1989fa", percentage: 60 },
        { color: "#6f7ad3", percentage: 80 },
        { color: "#5cb87a", percentage: 100 },
      ],
      recordSdk: {
        finishPct: "",
        finishNum: "",
        fileName: "",
        failNum: "",
        failCause: "",
        jssKey: "",
      },
      percentage: 0,
      downloadDialogVisible: false,
      isAutoGene: true,
      sdkCreateUrl: "",
      uploadUrl:
        window.env.gatewayFileBaseApi +
        "lop/mulfile/upload?LOP-DN=" +
        window.env.gatewayUploadLopDn,
      uploading: false,
      uploadFile: {
        uploadSdkId: "",
        uploadSdkFile: "",
        fileList: [],
      },
      generateCopy: "正在生成SDK...",
      sdkMessage: "SDK生成完毕,请下载SDK工程文件",
    };
  },
  computed: {
    jsonData() {
      return this.formatText(this.recordSdk.failCause)
    },
    titleData() {
      if (this.isAutoGene && this.recordSdk.failNum > 0) {
        return "SDK生成失败提示";
      } else if (!this.isAutoGene && this.recordSdk.failNum > 0) {
        return "工程文件生成失败提示";
      }
      return "";
    },
  },
  created() {
    this.sdkCreateUrl =
      window.location.protocol +
      "//" +
      `${window.location.host}/#/` +
      `${window.env.docSdkCreate}`;
  },
  methods: {
    // 将无效json格式化json
    formatText(text) {
      let indent = 0;
      let result = "";
      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        if (char === "{" || char === "[") {
          result += char + "\n" + " ".repeat(indent + 2);
          indent += 2;
        } else if (char === "}" || char === "]") {
          indent -= 2;
          result += "\n" + " ".repeat(indent) + char;
        } else if (char === ",") {
          result += char + "\n" + " ".repeat(indent);
        } else {
          result += char;
        }
      }
      return result;
    },
    // 用于获取jar信息的
    getJarInfo() {
      request({
        url: "/sdk/getJarInfo",
        method: "get",
        params: { sdkRecordId: this.$route.query.sdkId },
      })
        .then((res) => {
          if (res.data) {
            this.recordSdk = { ...res.data };
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    format(percentage) {
      return percentage >= 100 ? "完成" : `${percentage}%`;
    },
    // 切换自动生成和手动生成sdk时
    handleClick(isAutoGene) {
      this.isAutoGene = isAutoGene;
      this.recordSdk = {
        finishPct: "",
        finishNum: "",
        fileName: "",
        failNum: "",
        failCause: "",
        jssKey: "",
      };
      this.uploading = false;
      if (this.isAutoGene) {
        this.generateCopy = "正在生成SDK...";
        this.sdkMessage = "SDK生成完毕,请下载SDK工程文件";
      } else {
        this.generateCopy = "正在生成工程文件...";
        this.sdkMessage = "工程文件生成完毕,请下载SDK工程文件";
      }
    },
    // 生成sdk和上传sdk以及下载工程文件调用
    downloadProj() {
      let sdkUrl = "";
      if (this.isAutoGene) {
        sdkUrl = "/sdk/createJarFile";
      } else {
        sdkUrl = "/sdk/createSdkPreFile";
      }
      this.downloadDialogVisible = true;
      let _this = this;
      _this.loading = true;
      request({
        url: sdkUrl,
        method: "get",
        params: { sdkId: this.$route.query.sdkId },
      })
        .then((rsp) => {
          if (rsp.data) {
            const timer = setInterval(() => {
              request({
                url: "/sdk/getLastBizSdkRecordPercentage",
                method: "get",
                params: { recordId: rsp.data },
              })
                .then(async (prsp) => {
                  this.percentage = parseInt(prsp.data.finishPct);
                  this.recordSdk.failNum = prsp.data.failNum;
                  if (this.recordSdk.failNum > 0) {
                    this.recordSdk.failCause = prsp.data.failCause;
                    clearInterval(this.timer);
                  }
                  if (this.percentage >= 100) {
                    if (this.recordSdk.failNum == 0) {
                      this.recordSdk.jssKey = prsp.data.jssKey;
                      this.recordSdk.fileName = prsp.data.fileName;
                    }
                    if (this.isAutoGene) {
                      this.downloadDialogVisible = false;
                      await this.getJarInfo();
                      this.uploading = true;
                    }
                    clearInterval(this.timer);
                  }
                })
                .catch((pe) => {
                  this.percentage = 10;
                  _this.loading = false;
                });
            }, 500);
            this.timer = timer;
            this.$once("hook:beforeDestroy", () => {
              clearInterval(this.timer);
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.percentage = 10;
          _this.loading = false;
        });
    },
    cancelDownloadDialogVisible: function () {
      clearInterval(this.timer);
      this.loading = false;
      this.downloadDialogVisible = false;
      this.percentage = 0;
      this.recordSdk.fileName = "";
      this.recordSdk.failNum = 0;
    },
    // 点击链接下载文件
    downloadSdk() {
      let fileName = this.recordSdk.jssKey;
      if (fileName != null) {
        let gwUploadRequest = axios.create({
          // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
          baseURL: window.env.gatewayFileBaseApi, // url = base url + request url
          withCredentials: true, // send cookies when cross-domain requests
          timeout: 100000, // request timeout
          headers: {
            "LOP-DN": window.env.gatewayUploadLopDn,
            fileName: fileName,
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
              // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
              window.navigator.msSaveBlob(blob, decodeURI(fileName));
            } else {
              // 创建新的URL并指向File对象或者Blob对象的地址
              const blobURL = window.URL.createObjectURL(blob);
              // 创建a标签，用于跳转至下载链接
              const tempLink = document.createElement("a");
              tempLink.style.display = "none";
              tempLink.href = blobURL;
              tempLink.setAttribute("download", decodeURI(fileName));
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
        this.$message.error("SDK文件不存在!");
      }
    },
    // 上传之前
    beforeUploadHandle(file) {
      const isLtM = file.size / 1024 / 1024 < 100;
      const allowedExtensions = /(\.jar)$/i;
      if (!isLtM) {
        this.$message.error("上传SDK大小不能超过 100MB!");
      }
      if (!allowedExtensions.test(file.name)) {
        this.$message.error("仅支持.jar格式");
        return false;
      }
      this.uploadFile.uploadSdkFile = file.name;
      return isLtM;
    },
    uploadSuccessHandle(response) {
      request({
        url: "/sdk/createSdkBusinessForUpload",
        method: "post",
        data: {
          fileName: this.uploadFile.uploadSdkFile,
          jssKey: this.uploadFile.uploadSdkFile,
          sdkId: this.$route.query.sdkId,
          jssMd5: response.data[0],
        },
      })
        .then(async (rsp) => {
          await this.getJarInfo();
          this.uploading = true;
          this.$message({
            type: "success",
            message: "上传成功",
          });
        })
        .catch((e) => {
          console.log(e);
        });
      this.uploadFile.fileList = [];
    },
    uploadErrorHandle() {
      this.$message.error("上传失败，请重新上传");
      this.uploadFile.fileList = [];
      this.uploadFile.uploadSdkId = "";
      this.uploadFile.uploadSdkFile = "";
    },
    // successHandle(response) {
    //   this.$message({
    //     type: "success",
    //     message: "下载SDK工程",
    //   });
    // },
    lastStep: function () {
      this.$parent.stepsObj.active--;
      this.$router.push({
        // path: '/openBiz/openBizDetail',
        name: "OpenBizOpenBizDetail",
        params: { id: this.$route.params.id },
        query: {
          tag: "sdkAdd",
          sdkId: this.$route.query.sdkId,
          addStep: this.$parent.stepsObj.active,
        },
      });
    },
    nextStep: function () {
      this.$parent.stepsObj.active++;
      this.$router.push({
        // path: '/openBiz/openBizDetail',
        name: "OpenBizOpenBizDetail",
        params: { id: this.$route.params.id },
        query: {
          tag: "sdkAdd",
          sdkId: this.$route.query.sdkId,
          addStep: this.$parent.stepsObj.active,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// .process-dialog >>> .el-dialog__header {
//   // display: none;
// }
::v-deep .el-dialog__body {
  overflow-y: auto;
  max-height: 700px;
}
.dialog-row.el-row {
  text-align: center;
  margin: 10px auto;
}
.myFormBox {
  width: 72%;
  margin: 0 auto;
  text-align: center;

  .autoGeneClass {
    border: 1px solid #3c6ef0;
    color: #3c6ef0;
  }

  h3 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
    color: #333333;
  }

  p {
    text-align: center;
    margin-bottom: 0;
  }
}
.code {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-y: auto;
}
</style>
