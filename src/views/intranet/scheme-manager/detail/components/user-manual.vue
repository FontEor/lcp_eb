<template>
  <div class="user-manual">
    <el-table
      :data="tableData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      v-if="tableData.length > 0"
    >
      <el-table-column prop="title" label="名称">
        <template slot-scope="scope">
          <span v-if="scope.row.docType === 2">
            <i class="el-icon-document-empty">&nbsp;{{ scope.row.title }}</i>
          </span>
          <span v-else-if="scope.row.docType === 1">
            <i class="icon iconfont icon-defaultfolder"
              >&nbsp;{{ scope.row.title }}</i
            >
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="updateUser" label="更新人"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间">
        <template slot-scope="scope">
          <span>{{
            scope.row.updateTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span class="initialization-color">{{
            scope.row.status === 1 ? "初始化" : ""
          }}</span>
          <span class="publish-color">{{
            scope.row.status === 2 ? "已发布" : ""
          }}</span>
          <span class="offline-color">{{
            scope.row.status === 3 ? "已下线" : ""
          }}</span>
          <span class="edit-color">{{
            scope.row.status === 6 ? "编辑中" : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.docType === 2" disabled
            >新建</el-button
          >
          <el-button type="text" v-else @click="addOrEdit('新建', scope.row)"
            >新建</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.docType === 1"
            @click="addOrEdit('编辑', scope.row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-else-if="scope.row.docType === 2"
            @click="editDoc(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.status !== 2"
            @click="handleOperation(scope.row, 'publish')"
            >发布</el-button
          >
          <el-button type="text" v-else-if="scope.row.status === 2" disabled
            >发布</el-button
          >
          <el-button
            type="text"
            v-if="!scope.row.parentId || scope.row.status !== 2"
            disabled
            >下线</el-button
          >
          <el-button
            type="text"
            v-else-if="scope.row.status === 2"
            @click="handleOperation(scope.row, 'offline')"
            >下线</el-button
          >
          <el-button
            type="text"
            v-if="!scope.row.parentId || ![1, 3].includes(scope.row.status)"
            disabled
            >删除</el-button
          >
          <el-button
            type="text"
            v-else-if="[1, 3].includes(scope.row.status)"
            @click="handleOperation(scope.row, 'delete')"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <span v-if="!this.tableData.length">
      <div class="noDataImage">
        <img src="@/assets/img/noData.png" />
      </div>
      <div class="noDataMessage">抱歉，没有查询到结果～</div>
    </span>
    <el-dialog
      :title="addOrEditTitle"
      :visible.sync="addOrEditVisible"
      width="30%"
    >
      <el-form
        v-if="addOrEditVisible"
        :model="addOrEditForm"
        label-width="80px"
        ref="addOrEditForm"
        :rules="addOrEditFormRules"
      >
        <el-form-item label="类型" prop="docType">
          <el-radio-group v-model="addOrEditForm.docType">
            <el-radio :label="1" v-if="!isEdit" disabled>子目录</el-radio>
            <el-radio :label="1" v-else>子目录</el-radio>
            <el-radio :label="2" v-if="!isEdit" disabled>文档</el-radio>
            <el-radio :label="2" v-else>文档</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input
            v-model="addOrEditForm.title"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addOrEditForm.remark"
            placeholder="请输入备注"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddOrEdit">关 闭</el-button>
        <el-button type="primary" @click="saveAddorEdit">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      fullscreen
      title="编辑文档"
      v-if="docEditDialogVisible"
      :visible.sync="docEditDialogVisible"
      :before-close="handleCloseDocEditDialog"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="100px"
        :model="productDocEditForm"
        :rules="productDocEditRules"
        ref="productDocEditForm"
        style="width: 100%"
      >
        <el-form-item label="文档名称" prop="title">
          <el-input
            v-model="productDocEditForm.title"
            placeholder="请输入文档名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="productDocEditForm.remark"
            placeholder="请输入备注"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-alert
            title="注：文档中如果需要包含图片，请用工具栏中的图片上传工具上传，否则可能无法正常展示图片、下载文档"
            type="error"
            :closable="false"
          />
          <div class="editor-container">
            <MarkdownEditor
              :height="markdownEditorHeight"
              :placeholder="placeholder"
              ref="MarkdownEditor"
              v-model="productDocEditForm.content"
              class="markdown-editor"
            />
          </div>
        </el-form-item>
      </el-form>
      <div
        class="button-wrapper"
        style="display: flex; justify-content: flex-end; align-items: center"
      >
        <el-button @click="handleCloseDocEditDialog">取消</el-button>
        <el-button type="primary" @click="saveProductDocEdit">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="operationVisible" width="30%">
      <span>{{ operationContent }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operationVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmOperation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "@lui/lui-ui";
import Sortable from "sortablejs";
import openBiz from "@/api/intranet/openBiz/index.js";
import { parseTime } from "@/utils";
import MarkdownEditor from "@/components/MarkdownEditor/index.vue";
export default {
  name: "UserManual",
  props: {
    basicId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    MarkdownEditor,
  },
  data() {
    return {
      tableData: [],
      sortTableData: [],
      addOrEditTitle: "",
      addOrEditVisible: false,
      addOrEditForm: {
        docType: "",
        title: "",
        remark: "",
      },
      addOrEditFormRules: {
        docType: [{ required: true, message: "请选择类型" }],
        title: [
          { required: true, message: "请输入名称" },
          { min: 2, max: 15, message: "请输入2-15个字符" },
        ],
        remark: [{ required: false, max: 30, message: "最多输入30个字符" }],
      },
      docEditDialogVisible: false,
      productDocEditForm: {
        title: "",
        remark: "",
        content: "",
      },
      productDocEditRules: {
        title: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 150,
            message: "名称长度2-150个字符",
            trigger: ["blur", "change"],
          },
        ],
        remark: [
          {
            min: 0,
            max: 255,
            message: "备注长度超过255个字符",
            trigger: ["blur", "change"],
          },
        ],
        content: [
          { required: true, message: "请输入文档内容", trigger: "blur" },
        ],
      },
      publishVisible: false,
      offlineVisible: false,
      deleteVisible: false,
      docId: 0,
      operationContent: "",
      operationVisible: false,
      parentId: 0,
      id: "",
      operationType: "",
      isEdit: true,
      placeholder: "",
      markdownEditorHeight: window.innerHeight - 308,
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      if (obj) {
        return parseTime(obj, fomart);
      } else {
        return "";
      }
    },
  },
  methods: {
    initTableDrag() {
      if (this.tableData.length > 0) {
        const that = this;
        const tbody = document.querySelector(
          ".user-manual .el-table__body-wrapper tbody"
        );
        Sortable.create(tbody, {
          async onEnd({ oldIndex, newIndex }) {
            (async () => {
              let tableData = JSON.parse(JSON.stringify(that.tableData));
              that.sortTableData = [];
              that.treeConvertToList(tableData);
              const oldNode = that.sortTableData[oldIndex];
              const newNode = that.sortTableData[newIndex];
              const id = oldNode.id;
              const objId = that.basicId;
              const parentId = newNode.parentId;
              const seq = newNode.seq;
              const data = { id, objId, parentId, seq };
              await openBiz.userManual
                .updateDocSeq(data)
                .catch((e) => {
                  throw new Error("initTableDrag updateDocSeq");
                })
                .finally(() => {
                  that.tableData = [];
                  that.fetchUserManualTree();
                });
            })();
          },
        });
      }
    },
    //把树形数据结构转为LIST数据结构
    treeConvertToList(tree) {
      for (let i in tree) {
        const node = tree[i];
        this.sortTableData.push({
          id: node.id,
          seq: node.seq,
          parentId: node.parentId,
        });
        let children = node.children;
        if (
          children !== null &&
          children !== undefined &&
          children.length > 0
        ) {
          this.recurrenceFun(children, this.sortTableData, node.id);
        }
      }
    },
    //递归
    recurrenceFun(tree, list, parentId) {
      for (let i in tree) {
        const node = tree[i];
        list.push({
          id: node.id,
          seq: node.seq,
          parentId: parentId,
        });
        let children = node.children;
        if (
          children !== null &&
          children !== undefined &&
          children.length > 0
        ) {
          this.recurrenceFun(children, list, node.id);
        }
      }
    },
    async fetchUserManualTree() {
      const params = { unitId: this.basicId };
      const response = await openBiz.userManual
        .getBusinessUnitDocByUnitId(params)
        .catch(() => {
          throw new Error("fetchUserManualTree getBusinessUnitDocByUnitId");
        });
      this.tableData = response.data;
      this.$nextTick(() => {
        this.initTableDrag();
      });
    },
    addOrEdit(title, docDetail) {
      this.addOrEditTitle = title;
      this.addOrEditVisible = true;
      if (title == "编辑") {
        this.isEdit = false;
        this.addOrEditForm.docType = docDetail.docType;
        this.addOrEditForm.title = docDetail.title;
        this.addOrEditForm.remark = docDetail.remark;
      } else if (title == "新建") {
        this.isEdit = true;
      }
      this.id = docDetail.id;
      this.parentId = docDetail.parentId;
    },
    closeAddOrEdit() {
      this.addOrEditVisible = false;
      this.$refs["addOrEditForm"].clearValidate();
      this.addOrEditForm.docType = "";
      this.addOrEditForm.title = "";
      this.addOrEditForm.content = "";
      this.addOrEditForm.remark = "";
    },
    saveAddorEdit() {
      this.$refs["addOrEditForm"].validate(async (valid) => {
        if (valid) {
          const { docType, title, remark } = this.addOrEditForm;
          const objId = this.$route.params.id;
          const type = 3;
          const parentId = this.parentId;
          const id = this.id;
          if (this.addOrEditTitle === "编辑") {
            await openBiz.userManual
              .saveBusinessUnitDoc({
                objId,
                type,
                docType,
                title,
                remark,
                parentId,
                id,
              })
              .catch((error) => {
                throw new Error("saveAddorEdit saveBusinessUnitDoc");
              });
            Message.success("编辑成功");
          } else {
            await openBiz.userManual
              .createBusinessUnitDoc({
                objId,
                type,
                docType,
                title,
                remark,
                parentId: id,
              })
              .catch((error) => {
                throw new Error("saveAddorEdit createBusinessUnitDoc");
              });
            Message.success("新建成功");
          }
          this.closeAddOrEdit();
          this.fetchUserManualTree();
        }
      });
    },
    async editDoc(docDetail) {
      const hashMap = {
        业务介绍: "说明服务简介、名词解释、业务流程、接入前准备",
        开发说明: "说明业务相关接口调用场景、系统交互流程、接口对接时序图",
        联调指南: "说明联调场景及其对应的联调用例",
      };
      const { id } = docDetail;
      this.docId = id;
      const { data } = await openBiz.userManual
        .getDocById({ id: docDetail.id })
        .catch(() => {
          throw new Error("fetchUserManualTree getDocById");
        });
      this.productDocEditForm.title = docDetail.title;
      this.productDocEditForm.content = data.content;
      this.productDocEditForm.remark = docDetail.remark;
      const rootParentTitle = docDetail.rootParentTitle;
      this.placeholder = hashMap[rootParentTitle];
      this.docEditDialogVisible = true;
    },
    handleCloseDocEditDialog() {
      this.$refs["productDocEditForm"].resetFields();
      this.docEditDialogVisible = false;
    },
    saveProductDocEdit() {
      this.productDocEditForm.content = this.$refs.MarkdownEditor.getValue();
      this.$refs["productDocEditForm"].validate(async (valid) => {
        if (valid) {
          const { title, remark, content } = this.productDocEditForm;
          const id = this.docId;
          const objId = this.$route.params.id;
          const data = {
            id,
            objId,
            title,
            remark,
            content,
          };
          await openBiz.userManual.saveBusinessUnitDoc(data).catch((error) => {
            throw new Error("saveProductDocEdit saveBusinessUnitDoc");
          });
          this.docEditDialogVisible = false;
          Message.success("保存成功");
          this.fetchUserManualTree();
        }
      });
    },
    // 发布下线删除
    handleOperation(bizDetail, type) {
      const hashMap = {
        publishContent:
          "文档发布成功后，用户即可在物流开放平台查看该文档，确认发布？",
        offlineContent:
          "文件夹下线成功后，用户将无法在物流开放平台查看该文件夹（及其所有的子文件夹和文档），确认下线？",
        offlineRootContent:
          "文档下线成功后，用户将无法在物流开放平台查看该文档，确认下线？",
        deleteContent:
          "删除后，用户将无法在物流开放平台查看到该文档，确认删除？",
      };
      this.operationType = type;
      if (bizDetail.docType === 2 && type === "offline") {
        this.operationContent = hashMap[type.concat("RootContent")];
      } else {
        this.operationContent = hashMap[type.concat("Content")];
      }
      this.docId = bizDetail.id;
      this.operationVisible = true;
    },
    async confirmOperation() {
      const id = this.docId;
      const objId = this.$route.params.id;
      if (this.operationType === "publish") {
        // 发布
        const data = { objId, id };
        await openBiz.userManual
          .publishBusinessUnitDocById(data)
          .catch((error) => {
            throw new Error("confirmOperation publishBusinessUnitDocById");
          });
        Message.success("发布成功");
      } else if (this.operationType === "offline") {
        // 下线
        const params = { id };
        await openBiz.userManual.downDoc(params).catch((error) => {
          throw new Error("confirmOperation downDoc");
        });
        Message.success("下线成功");
      } else if (this.operationType === "delete") {
        // 删除
        const data = { id };
        await openBiz.userManual.deleteApiCategoryById(data).catch((error) => {
          throw new Error("confirmOperation deleteApiCategoryById");
        });
        Message.success("删除成功");
      }
      this.operationVisible = false;
      this.fetchUserManualTree();
    },
  },
  created() {
    this.fetchUserManualTree();
  },
};
</script>

<style lang="scss" scoped>
.user-manual {
  ::v-deep .el-table__row:not([class*="el-table__row--level-"]) {
    td:first-child {
      padding-left: 24px;
    }
  }
  .editor-container {
    ::v-deep .vditor {
      height: calc(100vh - 308px) !important;
    }
    ::v-deep .vditor--fullscreen {
      height: 100vh !important;
    }
  }
  ::v-deep.el-table__placeholder {
    margin-right: 3px;
  }
  .initialization-color {
    color: #3c6ef0;
  }
  .publish-color {
    color: #26a872;
  }
  .offline-color {
    color: #666666;
  }
  .edit-color {
    color: #ea730b;
  }
  .noDataImage {
    margin-top: 0px;
    text-align: center;
  }
  .noDataMessage {
    width: 100%;
    margin: 0 auto;
    margin-top: 0px;
    text-align: center;
    vertical-align: middle;
  }
}
</style>