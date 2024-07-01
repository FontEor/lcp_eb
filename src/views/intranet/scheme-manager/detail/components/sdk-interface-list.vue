<template>
  <div class="app-container">
    <el-row class="filter-container">
      <el-col :span="12">
        <el-form style="height:45px" :inline="true" :model="listQuery">
          <el-form-item>
            <el-button size="small" @click="goback"> &lt; 返回</el-button>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入关键词搜索"
              v-model="listQuery.searchKeyWord"
              size="small"
              v-on:input="onSearchChange"
              style="width:350px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
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
        <div>
          经查询，无符合搜索条件的结果
        </div>
      </template>
      <el-table-column label="序号" prop="id" align="center" min-width="3%" />
      <el-table-column
        label="接口"
        prop="interfaceName"
        align="center"
        min-width="10%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="中文名称"
        prop="apiName"
        align="center"
        min-width="8%"
        :show-tooltip-when-overflow="true"
      />
      <!--      <el-table-column label="接口描述" prop="apiRemark" min-width="15%" align="center"/>-->
      <el-table-column
        label="URL"
        prop="apiUrl"
        min-width="15%"
        align="center"
      />
      <el-table-column
        label="用户授权"
        prop="isAuthorize"
        min-width="10%"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.isAuthorize | parseAuthfilter() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        min-width="10%"
        align="center"
      >
        <template slot-scope="scope">
          <span class="initColor">{{
            scope.row.status === 1 ? "初始化" : ""
          }}</span>
          <span class="normalColor">{{
            scope.row.status === 5 ? "已发布" : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="createUser"
        align="center"
        min-width="8%"
      />
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        min-width="10%"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" min-width="10%" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-on:click="downloadInterfaceSrcCode(scope.row.id)"
            >下载源文件</el-button
          >
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
          style="margin:0px;float:right"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import { parseTime } from "@/utils";
import axios from "axios";

export default {
  name: "sdkInterfaceList",
  components: { Pagination },
  data() {
    return {
      sdkId: "",
      tableDatas: [],
      listQuery: {
        searchKeyWord: "",
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60]
      },
      interfaceForm: {
        sdkId: ""
      },
      loading: true
    };
  },
  created() {
    this.sdkId = this.$route.query.sdkId;
    this.interfaceForm.sdkId = this.$route.query.sdkId;
    this.querySdkInterfaceList();
  },
  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    },
    parseAuthfilter(obj) {
      if (obj === true) {
        return "需要";
      }
      return "不需要";
    },
    parseStatusfilter(obj) {
      if (obj === 1) {
        return "初始化";
      }
      return "已发布";
    }
  },
  methods: {
    goback() {
      this.$emit("showSdkEvent");
      this.$router.push({
        // path: '/openBiz/openBizDetail',
        name: "OpenBizOpenBizDetail",
        params: { id: this.$route.params.id },
        query: { tag: "sdkList" }
      });
    },
    querySdkInterfaceList() {
      this.loading = true;
      let _this = this;
      let params = {
        pageSize: _this.listQuery.pageSize,
        pageNumb: _this.listQuery.pageNumb,
        orderBy: "update_time",
        sdkId: this.sdkId,
        queryLike: this.listQuery.searchKeyWord
      };
      request({
        url: "/sdk/findBizApiPreListBySdk",
        method: "get",
        params: params
      })
        .then(rsp => {
          console.log(rsp);
          if (rsp.data) {
            _this.tableDatas = rsp.data.list;
            _this.listQuery.total = rsp.data.total;
            this.loading = false;
          }
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    search() {
      this.querySdkInterfaceList();
    },
    onSearchChange() {
      if (this.listQuery.searchKeyWord.trim().length === 0)
        this.querySdkInterfaceList();
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
    downloadInterfaceSrcCode(apiId) {
      this.downloadDialogVisible = true;
      let _this = this;
      let url = "/sdk/createSdkApiFile";
      _this.loading = true;
      let params = { apiId: String(apiId), sdkId: this.$route.query.sdkId };
      request({
        url: url,
        method: "post",
        data: params
      })
        .then(rsp => {
          let fileName = rsp.data.jssKey;
          if (rsp.data.isSuccess == 1) {
            let gwUploadRequest = axios.create({
              // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
              baseURL: window.env.gatewayFileBaseApi, // url = base url + request url
              withCredentials: true, // send cookies when cross-domain requests
              timeout: 100000, // request timeout
              headers: {
                "LOP-DN": window.env.gatewayUploadLopDn,
                fileName: fileName
              },
              responseType: "blob"
            });
            gwUploadRequest({
              url: "/lop/file/download",
              method: "get"
            })
              .then(drsp => {
                const blob = new Blob([drsp.data], {
                  type: "application/octet-stream"
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
              .catch(de => {
                console.log(de);
              });
          } else {
            this.$message({
              type: "error",
              message: rsp.data.failCause
            });
          }
          _this.loading = false;
        })
        .catch(e => {
          console.log(e);
          _this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.inline-block {
  display: inline-block;
}

.el-link {
  padding-left: 5px;
  padding-right: 5px;
}

.dialog-row.el-row {
  text-align: center;
  margin: 10px auto;
}

.process-dialog >>> .el-dialog__header {
  display: none;
}
</style>