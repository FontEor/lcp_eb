<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form
          :inline="true"
          :model="messageSearchForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              placeholder="搜索标题"
              v-model="messageSearchForm.queryName"
              style="width: 350px"
              v-on:input="onSearchChange"
              v-on:keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="search"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-on:click="newMessage"
          style="margin: 5px; float: right"
          >新建公告
        </el-button>
      </el-col>
    </el-row>
    <div>
      <el-table :data="messgeTableData" :row-class-name="rowClassName">
        <el-table-column label="序号" prop="number" align="center" />
        <el-table-column label="消息标题" prop="title" />
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span class="updateColor">{{
              scope.row.status === 0 ? "待发送" : ""
            }}</span>
            <span class="normalColor">{{
              scope.row.status === 1 ? "已发送" : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUser" />
        <el-table-column label="发布时间" prop="publisTime">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">{{
              formatTime(scope.row.createTime)
            }}</span>
            <span v-if="scope.row.status == 0">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="id">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">
              <el-button type="text" v-on:click="modifyInfo(scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                v-on:click="publishInfo(scope.row)"
                v-if="status != 1"
                >发布</el-button
              >
            </span>
            <span v-if="scope.row.status === 1">
              <el-button type="text" v-on:click="viewInfo(scope.row)"
                >查看</el-button
              >
            </span>
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
    </div>
    <el-dialog
      v-if="showCenterDialogVisible"
      :title="showTitle"
      :visible.sync="showCenterDialogVisible"
      width="30%"
      center
    >
      <div style="height: 300px; overflow-y: scroll">
        <MarkdownPreview
          v-if="showContent"
          v-model="showContent"
          class="markdown-preview"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCenterDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="editCenterDialogVisible"
      :visible.sync="editCenterDialogVisible"
      @close="handleClose"
      width="60%"
      center
    >
      <el-form :model="formData" ref="editorForm" :rules="editorRules">
        <el-form-item label-width="50px" label="标题" prop="editTitle">
          <el-input maxlength="100" v-model="formData.editTitle"></el-input>
        </el-form-item>
      </el-form>

      <div style="height: 300px; overflow-y: scroll">
        <MarkdownEditor
          ref="MarkdownEditor"
          v-model="formData.editContent"
          class="markdown-editor"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMsg()">保 存</el-button>
        <el-button @click="editCenterDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import { mapGetters } from "vuex";
import MarkdownEditor from "@/components/MarkdownEditor/index.vue";
import MarkdownPreview from "@/components/MarkdownPreview/index.vue";
import parseTime from "@/utils/parseTime.js";
import gwApiRequest from "@/utils/gwApiRequest.js";
import isIntranet from "@/utils/isIntranet.js";

export default {
  props: {
    msgType: "1",
  },
  components: { Pagination, MarkdownEditor, MarkdownPreview },
  data() {
    return {
      showCenterDialogVisible: false,
      editCenterDialogVisible: false,
      showTitle: "",
      showContent: "",
      qualifiedName: "",
      messgeTableData: [],
      messageSearchForm: {
        queryName: "",
      },
      listQuery: {
        searchKeyWord: "",
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      languageTypeList: {
        en: "en_US",
        zh: "zh_CN",
        es: "es_ES",
      },
      formData: {
        editContent: "",
        editTitle: "",
        id: "",
      },
      editorRules: {
        editTitle: [
          {
            required: true,
            message: "标题长度2-100位字符",
            min: 2,
            max: 100,
            trigger: "blur",
          },
        ],
      },
      status: "",
    };
  },
  computed: {
    ...mapGetters(["msgCount"]),
    language() {
      return this.languageTypeList["zh"];
    },
  },
  methods: {
    handleClose() {
      this.$refs.MarkdownEditor.setValue("");
    },
    async findApiBaseInfo() {
      const url = "/ApiManagerService/findApiBaseInfo";
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
    /**
     * 查询
     */
    search() {
      this.paginationChange();
    },
    /**
     * 分页修改查询
     */
    async paginationChange() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        this.loading = false;
        throw new Error("paginationChange findApiBaseInfo");
      });
      this.qualifiedName = data.qualifiedName;
      this.status = data.status;

      let url = "/message/getMsgList";
      let reqparams = {};
      if (isIntranet()) {
        reqparams.accountType = 0;
      } else {
        reqparams.accountType = 2;
      }
      reqparams.pageSize = this.listQuery.pageSize;
      reqparams.pageNumb = this.listQuery.pageNumb;
      reqparams.msgType = 2;
      reqparams.qualifiedName = data.qualifiedName;
      reqparams.title = this.messageSearchForm.queryName;
      request({
        url: url,
        method: "get",
        params: reqparams,
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.listQuery.total = rsp.data.total;
            this.messgeTableData = rsp.data.list;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    /**
     * 查看信息
     */
    viewInfo(row) {
      this.showTitle = row.title;
      let url = "/message/getMsgById";
      request({
        url: url,
        method: "get",
        params: { id: row.id, qualifiedName: this.qualifiedName },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            if (rsp.data) {
              if (rsp.data.content) {
                this.showCenterDialogVisible = true;
                this.showContent = rsp.data.content;
              }
              if (rsp.data.title) {
                this.showTitle = rsp.data.title;
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 行号
     */
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    /**
     * 判断是否为空
     */
    onSearchChange() {
      if (this.messageSearchForm.queryName.trim().length === 0) {
        this.search();
      }
    },
    /**
     * 新建公告
     */
    newMessage() {
      this.editCenterDialogVisible = true;
      this.formData.editTitle = "";
      this.formData.editContent = "";
    },
    /**
     * 保存数据
     */
    saveMsg() {
      this.$refs["editorForm"].validate((valid) => {
        this.formData.editContent = this.$refs.MarkdownEditor.getValue();
        if (valid) {
          if (this.formData.editContent.trim() == "") {
            this.$message.error("数据不能为空!");
          } else {
            let url = "/message/saveMsg";
            let reqparams = {};
            reqparams.title = this.formData.editTitle;
            reqparams.content = this.formData.editContent;
            reqparams.msgType = 2;
            reqparams.qualifiedName = this.qualifiedName;
            if (this.formData.id != "") {
              reqparams.id = this.formData.id;
            }
            request({
              headers: {
                "Content-Type": "application/json",
              },
              url: url,
              method: "post",
              data: reqparams,
            })
              .then((rsp) => {
                if (rsp.code === 20000) {
                  if (rsp.data) {
                    if (rsp.data.content) {
                      this.showContent = rsp.data.content;
                    }
                    if (rsp.data.title) {
                      this.showTitle = rsp.data.title;
                    }
                  }
                  this.$message.info("保存数据成功!");
                  this.paginationChange();
                  this.editCenterDialogVisible = false;
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 发布信息
     */
    publishInfo(row) {
      this.$confirm("确定将当前信息给当前API的所有调用方?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url = "/message/publishInfo";
          request({
            headers: {
              "Content-Type": "application/json",
            },
            url: url,
            method: "post",
            data: {
              id: row.id,
              qualifiedName: this.qualifiedName,
            },
          })
            .then((rsp) => {
              if (rsp.code === 20000) {
                this.$message({
                  type: "success",
                  message: "发布成功!",
                });
                this.paginationChange();
              } else {
                this.$message({
                  type: "info",
                  message: rsp.message,
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消发布",
          });
        });
    },
    /**
     * 修改信息
     */
    modifyInfo(row) {
      let url = "/message/getMsgById";
      request({
        url: url,
        method: "get",
        params: { id: row.id, qualifiedName: this.qualifiedName },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            if (rsp.data) {
              this.editCenterDialogVisible = true;
              if (rsp.data.content) {
                this.formData.editContent = rsp.data.content;
              }
              if (rsp.data.title) {
                this.formData.editTitle = rsp.data.title;
              }
              this.formData.id = rsp.data.id;
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.paginationChange();
  },
};
</script>
