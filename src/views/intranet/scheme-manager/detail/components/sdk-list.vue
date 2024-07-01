<template>
  <div>
    <el-row class="filter-container">
      <el-col :span="12">
        <el-form style="height: 45px" :inline="true" :model="listQuery">
          <el-form-item>
            <el-input
              placeholder="请输入关键词搜索"
              v-model="listQuery.searchKeyWord"
              v-on:input="onSearchChange"
              style="width: 350px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-on:click="addSdk"
          style="margin: 5px; float: right"
          >创建SDK
        </el-button>
      </el-col>
    </el-row>

    <span v-if="this.nodata === 'no'">
      <el-table
        :data="tableDatas"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        meta="x:37.0,y:57.0,width:901.0,height:216.0"
        :row-class-name="rowClassName"
        class="my-table mb2"
      >
        <template slot="empty">
          <div>经查询，无符合搜索条件的结果</div>
        </template>
        <el-table-column label="序号" prop="number" align="center" width="80" />
        <el-table-column
          label="SDK名称"
          prop="name"
          align="center"
          min-width="200"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="语言"
          prop="language"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.language | parseLanguagefilter() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="版本"
          prop="version"
          align="center"
          width="80"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="描述"
          prop="remark"
          width="100"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template slot-scope="{ row }">
            <span :class="judgeStatusClass(row)">{{
              formatStatusText(row)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="SDK文件"
          prop="fileName"
          width="100"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.fileName | parseFileNamefilter() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createUser"
          align="center"
          width="180"
        />
        <el-table-column
          label="更新时间"
          prop="updateTime"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="id"
          fixed="right"
          min-width="150"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="isShowEditButton(row)"
              type="text"
              v-on:click="modifySdk(row.id)"
              >编辑</el-button
            >
            <!-- <el-dropdown @command="downloadSdkCommand">
              <span class="el-dropdown-link">
                下载SDK源码<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="beforeDownloadSdkCommand(row.id, 'all')"
                  >下载完整SDK工程</el-dropdown-item
                >
                <el-dropdown-item
                  :command="
                    beforeDownloadSdkCommand(row.id, 'interfaceIncrement')
                  "
                  >按接口增量下載</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown> -->
            <!-- <el-tooltip
              effect="dark"
              content="下载完整的工程文件（SDK创建时包含的所有API）"
              placement="top"
            >
              <el-button type="text" @click="downloadSdkProject(row.id)"
                >下载</el-button
              >
            </el-tooltip> -->
            <!-- <el-upload
              :action="uploadUrl"
              class="inline-block"
              name="file"
              :before-upload="beforeUploadHandle"
              :on-success="uploadSuccessHandle"
              :on-error="uploadErrorHandle"
              :file-list="uploadFile.fileList"
            >
              <el-tooltip
                effect="dark"
                content="上传SDK文件，供外网前台用户下载"
                placement="top"
              >
                <el-button type="text" @click="uploadSdk(row.id)"
                  >上传</el-button
                >
              </el-tooltip>
            </el-upload> -->
            <!-- <el-button
              v-if="row.status === 11"
              class="normalColor"
              type="text"
              style="width: 100%"
              @click="postOnlineSdkData(row.id)"
              >上线</el-button
            >
            <el-button
              v-if="row.status === 5 || row.status === 10"
              class="unknownColor"
              type="text"
              style="width: 100%"
              :disabled="buttonDisabled"
              @click="postOfflineSdkData(row.id)"
              >下线</el-button
            > -->
            <el-button
              v-if="row.status !== 1"
              class="inline-block"
              type="text"
              @click="showDialogHide(row)"
              >{{ formatDialogHideButtonText(row.hide) }}</el-button
            >
            <el-popover
              v-if="isShowRemoveButton(row)"
              class="inline-block"
              placement="bottom"
              width="220"
              trigger="click"
            >
              <p>
                已下载SDK的用户仍可通过SDK调用接口。删除SDK后，用户无法再下载该SDK。确认删除该SDK？
              </p>
              <div style="margin-top: 10px">
                <el-button
                  type="danger"
                  size="small"
                  style="width: 100%"
                  @click="deleteSdk(row.id)"
                  >确认删除</el-button
                >
              </div>
              <el-button type="text" style="color: red" slot="reference"
                >删除</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <pagination
            v-show="listQuery.total"
            :total="listQuery.total"
            :pageSizes.sync="listQuery.pageSizes"
            :page.sync="listQuery.pageNumb"
            :limit.sync="listQuery.pageSize"
            v-on:pagination="paginationChange"
            style="margin: 0px; float: right"
          />
        </el-col>
      </el-row>
    </span>
    <span v-if="this.nodata === 'yes'">
      <div style="margin-top: 0px; text-align: center">
        <img src="@/assets/img/noData.png" />
      </div>
      <div class="noDataMessage">抱歉，没有查询到结果～</div>
    </span>

    <el-dialog
      class="process-dialog"
      :visible.sync="downloadDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <el-progress
        :percentage="percentage"
        :format="format"
        :color="colors"
      ></el-progress>
      <el-row class="dialog-row">
        <span v-if="percentage < 100 && recordSdk.failNum == 0"
          >正在生成工程文件...</span
        >
        <span v-else-if="percentage >= 100 && recordSdk.failNum == 0"
          >SDK生成完毕,请下载SDK工程文件...</span
        >
        <span v-else-if="recordSdk.failNum > 0" style="color: #f56c6c"
          >发生错误:{{ recordSdk.failCause }}
        </span>
      </el-row>
      <el-row class="dialog-row">
        <el-button @click="cancelDownloadDialogVisible">取 消</el-button>
        <el-button
          @click="downloadSdk"
          v-if="this.percentage >= 100 && this.recordSdk.failNum == 0"
          type="primary"
          >下 载</el-button
        >
      </el-row>
      <el-row class="dialog-row">
        <el-link
          type="primary"
          :underline="false"
          @click="gotoDownloadInterface"
          >按接口增量下载源文件</el-link
        >
      </el-row>
    </el-dialog>
    <el-dialog
      :title="computeDialogHideTitle"
      :visible.sync="dialogSDKHideVisible"
      width="480px"
    >
      <Steps :active="active" :tiptitle="['确认', '完成']"></Steps>
      <div class="warningImg">
        <img :src="computeDialogHideImage" style="width: 100%" />
      </div>
      <div v-if="row.hide === 0" class="dialogHideText">
        <div v-if="active === 0">
          <p>SDK隐藏会立即生效</p>
          <p>
            前台将不再展示
            {{ row.name }} SDK，但不影响已使用SDK的用户调用接口
          </p>
          <p>确认隐藏？</p>
        </div>
        <div v-if="active === 1">
          <p style="font-size: 24px; font-weight: 600">隐藏成功</p>
          <p>前台将不再展示 {{ row.name }} SDK</p>
        </div>
      </div>
      <div v-else-if="row.hide === 1" class="dialogHideText">
        <div v-if="active === 0">
          <p>SDK取消隐藏会立即生效</p>
          <p>前台将展示 {{ row.name }} SDK，可能会有新用户下载使用SDK</p>
          <p>确认取消隐藏？</p>
        </div>
        <div v-if="active === 1">
          <p style="font-size: 24px; font-weight: 600">取消隐藏成功</p>
          <p>前台将展示 {{ row.name }} SDK</p>
        </div>
      </div>
      <div slot="footer" class="dialog-hide-footer">
        <el-button @click="dialogSDKHideVisible = false">{{
          computeDialogHideCancelButtonText
        }}</el-button>
        <el-button
          v-if="active === 0"
          type="primary"
          @click="handleConfirmDialogHide"
          >确 定</el-button
        >
        <el-button
          v-if="active === 1"
          type="primary"
          @click="handleLinkToTarget"
          >前往前台查看</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import Steps from "@/components/steps/index.vue";
import parseTime from "@/utils/parseTime.js";
import axios from "axios";
import words from "@/assets/words.png";
import publishFinish from "@/assets/img/publishFinish.png";
import api from "@/api/index.js";
import request from "@/utils/request";

export default {
  name: "SdkList",
  components: { Pagination, Steps },
  props: {
    baseInfoStatus: Number,
  },
  data() {
    return {
      statusTextTable: {
        1: "初始化",
        // 2: "审核中",
        // 4: "审核通过",
        5: "已发布",
        // 7: "已下线",
        // 9: "审核未通过",
        10: "编辑中",
        // 11: "下线中",
      },
      statusClassTable: {
        1: "initColor",
        // 2: "updateColor",
        // 4: "normalColor",
        5: "normalColor",
        // 7: "deadColor",
        // 9: "deadColor",
        10: "updateColor",
        // 11: "updateColor",
      },
      row: {},
      active: 0,
      dialogSDKHideVisible: false,
      imageTable: [words, publishFinish],
      percentage: 0,
      visible: false,
      deleteSdkPopoverVisible: false,
      uploadUrl:
        window.env.gatewayFileBaseApi +
        "lop/mulfile/upload?LOP-DN=" +
        window.env.gatewayUploadLopDn,
      downloadDialogVisible: false,
      unitId: "",
      sdkId: "",
      tableDatas: [],
      uploadFile: {
        uploadSdkId: "",
        uploadSdkFile: "",
        fileList: [],
      },
      recordSdk: {
        finishPct: "",
        finishNum: "",
        fileName: "",
        failNum: "",
        failCause: "",
        jssKey: "",
      },
      listQuery: {
        searchKeyWord: "",
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      timer: null,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#1989fa", percentage: 60 },
        { color: "#6f7ad3", percentage: 80 },
        { color: "#5cb87a", percentage: 100 },
      ],
      loading: true,
      nodata: "yes",
      buttonDisabled: false,
    };
  },
  computed: {
    computeDialogHideTitle() {
      const dialogHideTitleTable = { 0: "SDK隐藏", 1: "SDK取消隐藏" };
      return dialogHideTitleTable[this.row.hide];
    },
    computeDialogHideCancelButtonText() {
      const cancelButtonTextTable = ["取 消", "关 闭"];
      return cancelButtonTextTable[this.active];
    },
    computeDialogHideImage() {
      return this.imageTable[this.active];
    },
  },
  filters: {
    parseFileNamefilter(obj) {
      if (obj) {
        return obj;
      } else {
        return "-";
      }
    },
    parseLanguagefilter(obj) {
      if (obj === 1) {
        return "JAVA";
      }
      if (obj === 2) {
        return ".NET";
      }
      if (obj === 3) {
        return "PHP";
      }
    },
  },
  methods: {
    judgeStatusClass(row) {
      return row.hide ? "deadColor" : this.statusClassTable[row.status];
    },
    formatStatusText(row) {
      return row.hide ? "已隐藏" : this.statusTextTable[row.status];
    },
    isShowEditButton(row) {
      const statusTable = { 1: true, 5: true, 10: true };
      return row.hide ? false : statusTable[row.status];
    },
    isShowRemoveButton(row) {
      if (row.status === 1) {
        return true;
      } else {
        return row.hide ? true : false;
      }
    },
    handleLinkToTarget() {
      window.open(
        `//${window.env.extranetHost}:${window.location.port}/#/quick?id=${this.$route.params.id}&tab=sdk`,
        "_blank"
      );
    },
    handleConfirmDialogHide() {
      const id = this.row.id;
      const data = id;
      const statusTable = {
        0: () => api.openBiz.postSdkHideData(data),
        1: () => api.openBiz.postSdkHideCancelData(data),
      };
      statusTable[this.row.hide]()
        .then((response) => {
          const { code } = response;
          if (code === 20000) {
            this.active += 1;
            this.querySdkList();
          }
        })
        .catch((error) => {
          throw error;
        });
    },
    formatDialogHideButtonText(hide) {
      const statusTable = { 0: "隐藏", 1: "取消隐藏" };
      return statusTable[hide];
    },
    async showDialogHide(row) {
      this.row = row;
      const params = parseInt(this.$route.params.id);
      const response = await api.openBiz
        .postUnitCheckPrincipalData([params])
        .catch((error) => {
          throw error;
        });
      const { code } = response;
      if (code === 20000) {
        this.active = 0;
        this.dialogSDKHideVisible = true;
      } else {
        const { message } = response;
        const productOwner = message.split("#")[0];
        const developmentOwner = message.split("#")[1];
        const statusTable = { 0: "", 1: "取消" };
        const tip = `只有对接方案的产品负责人 ${productOwner} 、研发负责人 ${developmentOwner} 能操作${
          statusTable[this.row.hide]
        }SDK隐藏`;
        this.$message.warning(tip);
      }
    },
    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
    // 上线操作 切换SDK状态为更新中
    // postOnlineSdkData(rowId) {
    //   gwRequest({
    //     url: "/onlineBizSdkPre",
    //     method: "post",
    //     data: [rowId],
    //   })
    //     .then((resolve) => {
    //       console.log("postOnlineSdkData 请求成功", resolve);
    //       if (resolve.data.code === 1) {
    //         this.$message({
    //           type: "success",
    //           message: "操作成功",
    //         });
    //         this.$emit("update:baseInfoStatus", 1);
    //         this.querySdkList();
    //       } else {
    //         this.$message({
    //           type: "error",
    //           message: resolve.data.message,
    //         });
    //       }
    //     })
    //     .catch((reject) => {
    //       console.log("postOnlineSdkData 请求失败", reject);
    //       this.$message({
    //         type: "error",
    //         message: "操作失败",
    //       });
    //     });
    // },
    // 下线操作 切换SDK状态为下线中
    // postOfflineSdkData(rowId) {
    //   gwRequest({
    //     url: "/offlineBizSdkPre",
    //     method: "post",
    //     data: [rowId],
    //   })
    //     .then((resolve) => {
    //       console.log("postOfflineSdkData 请求成功", resolve);
    //       if (resolve.data.code === 1) {
    //         this.$message({
    //           type: "success",
    //           message: "操作成功",
    //         });
    //         this.$emit("update:baseInfoStatus", 1);
    //         this.querySdkList();
    //       } else {
    //         this.$message({
    //           type: "error",
    //           message: resolve.data.message,
    //         });
    //       }
    //     })
    //     .catch((reject) => {
    //       console.log("postOfflineSdkData 请求失败", reject);
    //       this.$message({
    //         type: "error",
    //         message: "操作失败",
    //       });
    //     });
    // },
    format(percentage) {
      return percentage >= 100 ? "完成" : `${percentage}%`;
    },
    querySdkList() {
      let _this = this;
      _this.loading = true;
      request({
        url: "/sdk/getBizSdkPreList",
        method: "get",
        params: {
            pageSize: _this.listQuery.pageSize,
            page: _this.listQuery.pageNumb,
            orderBy: "update_time",
            unitId: this.unitId,
            queryLike: _this.listQuery.searchKeyWord,
          }
      }).then((rsp) => {
          if (rsp.data) {
            _this.tableDatas = rsp.data.list;
            _this.listQuery.total = rsp.data.total;
            this.loading = false;

            if (_this.tableDatas.length == 0 && this.nodata === "yes") {
              this.nodata = "yes";
            } else {
              this.nodata = "no";
            }
          }
        }).catch((e) => {
          console.log(e);
          this.loading = false;
          this.nodata = "yes";
        });
    },
    search() {
      this.querySdkList();
    },
    onSearchChange() {
      if (this.listQuery.searchKeyWord.trim().length === 0) this.querySdkList();
    },
    addSdk() {
      this.$emit("addSdkEvent");
      this.$router.push({
        name:"OpenBizOpenBizDetail",
        params:{ id:this.$route.params.id},
        query: { tag: "sdkAdd"},
      });
    },
    // 为每一行加一个class 可以用来加样式
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.querySdkList();
    },
    modifySdk(sdkId) {
      this.$emit("addSdkEvent", sdkId);
      this.$router.push({
        name:"OpenBizOpenBizDetail",
        params:{ id:this.$route.params.id},
        query: { sdkId: sdkId, tag: "sdkAdd"},
      });
    },
    // 上传之前
    beforeUploadHandle(file) {
      const isLtM = file.size / 1024 / 1024 < 100;
      if (!isLtM) {
        this.$message.error("上传SDK大小不能超过 100MB!");
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
            sdkId: this.uploadFile.uploadSdkId,
            jssMd5: response.data[0],
          },
      })
        .then((rsp) => {
          this.$message({
            type: "success",
            message: "上传成功",
          });
          this.querySdkList();
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
    deleteSdk(id) {
      request({
        url: "/sdk/deleteBizSdkPre",
        method: "get",
        params: {id:id},
      })
        .then((rsp) => {
            console.log(rsp);
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.querySdkList();
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            type: "error",
            message: "操作失败",
          });
        });
    },
    uploadSdk(sdkId) {
      this.uploadFile.uploadSdkId = sdkId;
    },
    gotoDownloadInterface() {
      this.$emit("sdkInterfaceList");
      this.$router.push({
        name:"OpenBizOpenBizDetail",
        params:{ id:this.$route.params.id},
        query: {
          tag: "sdkInterfaceList",
          sdkId: this.sdkId
        },
      });
    },
    beforeDownloadSdkCommand(sdkId, command) {
      return {
        sdkId: sdkId,
        command: command,
      };
    },
    downloadSdkCommand(command) {
      switch (command.command) {
        case "all": //编辑
          this.downloadSdkProject(command.sdkId);
          break;
        case "interfaceIncrement": //删除
          this.gotoDownloadInterfaceIncrement(command.sdkId);
          break;
      }
    },
    downloadSdkProject(id) {
      this.downloadDialogVisible = true;
      this.sdkId = id;
      let _this = this;
       request({
        url: "/sdk/createSdkPreFile",
        method: 'get',
        params:{sdkId:this.sdkId}
      }).then((rsp) => {
          if (rsp.data > 0) {
            const timer = setInterval(() => {
               request({
                url: '/sdk/getLastBizSdkRecordPercentage',
                method: 'get',
                params:{recordId:rsp.data}
              }).then((prsp) => {
                  console.log(prsp);
                  this.percentage = prsp.data.finishPct;
                  this.recordSdk.failNum = prsp.data.failNum;
                  if (this.recordSdk.failNum > 0) {
                    this.recordSdk.failCause = prsp.data.failCause;
                    clearInterval(this.timer);
                  }
                  if (this.percentage >= 100) {
                    if (this.recordSdk.failNum == 0) {
                      this.recordSdk.jssKey = prsp.data.jssKey;
                    }
                    clearInterval(this.timer);
                  }
                })
                .catch((pe) => {
                  console.log(pe);
                  this.percentage = 10;
                });
            }, 500);
            this.timer = timer;
            this.$once("hook:beforeDestroy", () => {
              clearInterval(this.timer);
              this.loading = false;
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.percentage = 0;
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
    gotoDownloadInterfaceIncrement(id) {
      this.$emit("sdkInterfaceList");
      this.$router.push({
        name:"OpenBizOpenBizDetail",
        params:{ id:this.$route.params.id},
        query: { tag: "sdkInterfaceList", sdkId: id},
      });
    },
  },
  created() {
    this.unitId = this.$route.params.id;
    this.querySdkList();
    if (this.baseInfoStatus === 3) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .my-step-bar {
  margin: 8px auto;
}
.warningImg {
  width: 36px;
  margin: 8px auto;
}
.dialogHideText {
  margin-bottom: 16px;
  text-align: center;
}
.dialog-hide-footer {
  display: flex;
  justify-content: space-around;
}

.inline-block {
  display: inline-block;
  margin-left: 10px;
}

.el-link {
  padding-left: 5px;
  padding-right: 5px;
}
.dialog-row.el-row {
  text-align: center;
  margin: 10px auto;
}
.el-dropdown-link {
  cursor: pointer;
  color: #3c6ef0;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.process-dialog .el-dialog__header {
  display: none;
}

// 设置下拉菜单中的上传SDK宽度`
::v-deep .el-upload {
  width: 100%;
}
.noDataMessage {
  text-align: center;
}
</style>
