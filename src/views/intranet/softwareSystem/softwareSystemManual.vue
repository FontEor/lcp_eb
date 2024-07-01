<template>
  <div class="software-system-manual">
    <div class="mod-overview">
      <span v-if="this.nodata === 'no'" key="1">
        <el-table
          :data="tableData"
          :row-key="handleRowId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          v-if="tableData.length > 0"
          ref="tableDom"
        >
          <el-table-column prop="title" label="名称" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.docType === 2">
                <i class="el-icon-document-empty"
                  >&nbsp;{{ scope.row.title }}</i
                >
              </span>
              <span v-else-if="scope.row.docType === 1">
                <i class="icon iconfont icon-defaultfolder"
                  >&nbsp;{{ scope.row.title }}</i
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="updateUser" label="更新人" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.updateTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <span class="initColor">{{
                scope.row.status === 1 ? "初始化" : ""
              }}</span>
              <span class="normalColor">{{
                scope.row.status === 2 ? "已发布" : ""
              }}</span>
              <span class="updateColor">{{
                scope.row.status === 6 ? "编辑中" : ""
              }}</span>
              <span class="deadColor">{{
                scope.row.status === 3 ? "已下线" : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.docType == 2"
                disabled
                type="text"
                size="small"
                >新建</el-button
              >
              <el-button
                v-else
                type="text"
                size="small"
                @click="add(scope.row.id)"
                >新建</el-button
              >
              <el-button
                v-if="scope.row.docType == 2"
                type="text"
                size="small"
                @click="editDoc(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                v-else
                type="text"
                size="small"
                @click="edit(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                v-if="scope.row.status == 2"
                disabled
                type="text"
                size="small"
                >发布</el-button
              >
              <el-button
                v-else
                type="text"
                size="small"
                @click="publish(scope.row.id, scope.row.docType)"
                >发布</el-button
              >
              <el-button
                v-if="scope.row.status == 2"
                type="text"
                size="small"
                @click="down(scope.row.id, scope.row.docType)"
              >
                下线
              </el-button>
              <el-button v-else type="text" size="small" disabled
                >下线</el-button
              >
              <el-button
                v-if="
                  (scope.row.status == 1 || scope.row.status == 3) &&
                  scope.row.parentId != 0
                "
                type="text"
                size="small"
                @click="del(scope.row.id, scope.row.docType)"
                >删除</el-button
              >
              <el-button v-else type="text" size="small" disabled
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :title="dialogTitle"
          :visible.sync="docDialogVisible"
          :before-close="handleCloseDocDialog"
          width="400px"
          :close-on-click-modal="false"
        >
          <el-row>
            <el-col :span="24">
              <el-form
                label-width="100px"
                :model="formData"
                :rules="productDocRules"
                ref="productDocForm"
                style="width: 100%"
              >
                <el-form-item label="id" prop="id" hidden>
                  <el-input v-model="formData.id"></el-input>
                </el-form-item>
                <el-form-item label="objId" prop="objId" hidden>
                  <el-input v-model="formData.objId"></el-input>
                </el-form-item>
                <el-form-item label="parentId" prop="parentId" hidden>
                  <el-input v-model="formData.parentId"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="docType">
                  <el-radio-group
                    v-model="formData.docType"
                    @change="changeDocType"
                  >
                    <el-radio
                      v-if="formData.id != 0 && formData.docType == 1"
                      disabled
                      :label="1"
                      >子目录</el-radio
                    >
                    <el-radio v-else :label="1">子目录</el-radio>
                    <el-radio v-if="formData.id != 0" disabled :label="2"
                      >文档</el-radio
                    >
                    <el-radio v-else :label="2">文档</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="title">
                  <el-input
                    v-model="formData.title"
                    placeholder="请输入名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input
                    type="textarea"
                    v-model="formData.remark"
                    placeholder="请输入备注"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="handleCloseDocDialog">关闭</el-button>
                  <el-button type="primary" @click="saveProductDoc"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-dialog>

        <el-dialog
          fullscreen
          title="编辑文档"
          v-if="docEditDialogVisible"
          :visible.sync="docEditDialogVisible"
          :before-close="handleCloseDocEditDialog"
          :close-on-click-modal="false"
        >
          <el-row>
            <el-col :span="24">
              <el-form
                class="productDocument"
                label-width="100px"
                :model="formData"
                :rules="productDocEditRules"
                ref="productDocEditForm"
                style="width: 100%"
              >
                <el-form-item label="id" prop="id" hidden>
                  <el-input v-model="formData.id"></el-input>
                </el-form-item>
                <el-form-item label="objId" prop="objId" hidden>
                  <el-input v-model="formData.objId"></el-input>
                </el-form-item>
                <el-form-item label="parentId" prop="parentId" hidden>
                  <el-input v-model="formData.parentId"></el-input>
                </el-form-item>
                <el-form-item label="docType" prop="docType" hidden>
                  <el-input v-model="formData.docType"></el-input>
                </el-form-item>
                <el-form-item label="文档名称" prop="title">
                  <el-input
                    v-model="formData.title"
                    placeholder="请输入文档名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input
                    type="textarea"
                    v-model="formData.remark"
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
                      ref="MarkdownEditor"
                      v-model="formData.content"
                      class="markdown-editor"
                    />
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <div
            class="button-wrapper"
            style="
              display: flex;
              justify-content: flex-end;
              align-items: center;
            "
          >
            <el-button @click="handleCloseDocEditDialog">取消</el-button>
            <el-button type="primary" @click="saveProductDocEdit"
              >保存</el-button
            >
          </div>
        </el-dialog>
      </span>
      <span style="display: none" id="displayNoDocInfo">
        <div style="margin-top: 0px; text-align: center">
          <img
            src="@/assets/img/noData.png"
            style="width: 316px; height: 200px"
          />
        </div>
        <div class="noDataMessage">暂无文档~</div>
      </span>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import request from "@/utils/request";
import { Message } from "@lui/lui-ui";
import { parseTime } from "@/utils";
import MarkdownEditor from "@/components/MarkdownEditor/index.vue";

export default {
  name: "SoftwareSystemManual",
  components: {
    Sortable,
    MarkdownEditor,
  },
  data() {
    return {
      tableData: [],
      sortTableData: [],
      dialogTitle: "新增",
      formData: {
        id: 0,
        parentId: 0,
        objId: this.$route.params.id,
        docType: 1,
        title: "",
        remark: "",
        content: "",
      },
      productDocRules: {
        docType: [{ required: true, message: "请选择类型", trigger: "blur" }],
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
      docDialogVisible: false,
      docEditDialogVisible: false,
      languageTypeList: {
        en: "en_US",
        zh: "zh_CN",
        es: "es_ES",
      },
      nodata: "yes",
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
  created() {},
  mounted() {
    this.fetchProdDocTree();
  },
  updated() {
    this.$nextTick(() => {
      this.dropRow();
    });
  },
  computed: {
    language() {
      return this.languageTypeList["zh"];
    },
  },
  methods: {
    handleRowId(row) {
      return row.id + "" + row.index;
    },
    //拖动行进行排序
    dropRow() {
      if (this.tableData.length > 0) {
        const tbody = document.querySelector(".el-table__body-wrapper tbody");
        const self = this;
        Sortable.create(tbody, {
          async onEnd({ newIndex, oldIndex }) {
            let tData = JSON.parse(JSON.stringify(self.tableData));
            self.sortTableData = [];
            self.treeConvertToList(tData);
            const oldNode = self.sortTableData[oldIndex];
            const newNode = self.sortTableData[newIndex];
            if (oldNode.parentId !== newNode.parentId) {
              Message.error("只能移动同一层级下的目录或文档");
            } else {
              let sortStr = [
                oldNode.id,
                ":",
                newNode.seq,
                ",",
                newNode.id,
                ":",
                oldNode.seq,
              ].join("");
              await self.setSort(sortStr);
            }
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
    //更改文档类型
    changeDocType(value) {
      this.formData.docType = value;
    },
    // 为数组添加index的属性
    addIndexProperty(data, indexPropName) {
      if (Array.isArray(data)) {
        // 遍历数组中的每个元素并递归调用 addIndexProperty 函数
        data.forEach((item, index) => {
          // 在对象上添加索引属性
          item[indexPropName] = index;
          this.addIndexProperty(item, indexPropName);
        });
      } else if (typeof data === "object" && data !== null) {
        // 遍历对象的所有属性值并递归调用 addIndexProperty 函数
        Object.values(data).forEach((value) => {
          this.addIndexProperty(value, indexPropName);
        });
      }
    },
    //获取产品文档树
    fetchProdDocTree() {
      let url = "/doc/getProductDocTree";
      request({
        url: url,
        method: "get",
        params: { productId: this.$route.params.id },
      })
        .then((rsp) => {
          this.tableData = rsp.data;
          this.addIndexProperty(this.tableData, "index");
          if (this.tableData.length === 0) {
            document.getElementById("displayNoDocInfo").style.display = "";
            this.nodata = "yes";
          } else {
            document.getElementById("displayNoDocInfo").style.display = "none";
            this.nodata = "no";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //获取产品文档
    fetchProdDoc(docId) {
      let url = "/doc/getProductDoc";
      request({
        url: url,
        method: "get",
        params: { docId: docId },
      })
        .then((rsp) => {
          for (var key in rsp.data) {
            if (this.formData.hasOwnProperty(key)) {
              this.formData[key] = rsp.data[key];
            }
          }
          this.$refs.MarkdownEditor.setValue(rsp.data.content);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //打开添加窗口
    add(parentId) {
      this.formData.id = 0;
      this.formData.parentId = parentId;
      this.docDialogVisible = true;
    },
    //打开编辑目录窗口
    edit(id) {
      this.dialogTitle = "编辑";
      this.fetchProdDoc(id);
      this.docDialogVisible = true;
    },
    //打开编辑文档窗口
    editDoc(id) {
      this.fetchProdDoc(id);
      this.docEditDialogVisible = true;
    },
    //设置排序
    setSort(sortStr) {
      let url = "/doc/sortProductDoc";
      request({
        url: url,
        method: "post",
        params: { sortStr: sortStr },
      })
        .then((rsp) => {
          this.fetchProdDocTree();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //发布
    publish(docId, docType) {
      let confirmMessage = "";
      if (docType == 1) {
        confirmMessage =
          "文件夹发布成功后，用户即可在物流开放平台查看该文件夹（及其所有的子文件夹和文档），确认发布？";
      } else {
        confirmMessage =
          "文档发布成功后，用户即可在物流开放平台查看该文档，确认发布？";
      }
      this.$confirm(confirmMessage, "提示")
        .then((_) => {
          let url = "/doc/publishProductDoc";
          request({
            url: url,
            method: "post",
            params: { docId: docId, productId: this.$route.params.id },
          })
            .then((rsp) => {
              Message.success("发布成功");
              this.fetchProdDocTree();
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((_) => {
          console.log(_);
        });
    },
    //下线
    down(docId, docType) {
      let confirmMessage = "";
      if (docType == 1) {
        confirmMessage =
          "文件夹下线成功后，用户将无法在物流开放平台查看该文件夹（及其所有的子文件夹和文档），确认下线？";
      } else {
        confirmMessage =
          "文档下线成功后，用户将无法在物流开放平台查看该文档，确认下线？";
      }
      this.$confirm(confirmMessage, "提示")
        .then((_) => {
          let url = "/doc/downProductDoc";
          request({
            url: url,
            method: "post",
            params: { docId: docId, productId: this.$route.params.id },
          })
            .then((rsp) => {
              Message.success("下线成功");
              this.fetchProdDocTree();
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((_) => {
          console.log(_);
        });
    },
    //删除
    del(docId, docType) {
      let confirmMessage = "";
      if (docType == 1) {
        confirmMessage =
          "您将删除该目录及其下的所有文档，删除后用户无法在物流开放平台查看到该目录及其下的文档，确认删除？";
      } else {
        confirmMessage =
          "删除后，用户将无法在物流开放平台查看到该文档，确认删除？";
      }
      this.$confirm(confirmMessage, "提示")
        .then((_) => {
          let url = "/doc/deleteProductDoc";
          request({
            url: url,
            method: "post",
            params: { docId: docId },
          })
            .then((rsp) => {
              Message.success("删除成功");
              this.fetchProdDocTree();
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((_) => {
          console.log(_);
        });
    },
    //关闭窗口
    handleCloseDocDialog() {
      this.clearFormData();
      this.docDialogVisible = false;
    },
    //关闭文档编辑窗口
    handleCloseDocEditDialog() {
      this.clearEditFormData();
      this.docEditDialogVisible = false;
    },
    //保存
    saveProductDoc() {
      console.log("this.formData", this.formData);
      this.$refs["productDocForm"].validate((valid) => {
        if (valid) {
          request({
            url: "/doc/addProductDoc",
            method: "post",
            data: this.formData,
          })
            .then((resp) => {
              this.docDialogVisible = false;
              Message.success("保存成功");
              this.fetchProdDocTree();
              this.clearFormData();
            })
            .catch((error) => {
              Message.error("添加文档错误");
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    //保存文档
    saveProductDocEdit() {
      this.formData.content = this.$refs.MarkdownEditor.getValue();
      this.$refs["productDocEditForm"].validate((valid) => {
        if (valid) {
          request({
            url: "/doc/addProductDoc",
            method: "post",
            data: this.formData,
          })
            .then((resp) => {
              this.docEditDialogVisible = false;
              Message.success("保存成功");
              this.fetchProdDocTree();
              this.clearEditFormData();
            })
            .catch((error) => {
              Message.error("添加文档错误");
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    //清除formData的数据
    clearFormData() {
      this.formData.id = 0;
      this.formData.parentId = 0;
      (this.formData.objId = this.$route.params.id),
        (this.formData.docType = 1),
        (this.formData.title = ""),
        (this.formData.remark = "");
      this.$refs["productDocForm"].resetFields();
    },
    //清除formData的数据
    clearEditFormData() {
      this.formData.id = 0;
      this.formData.parentId = 0;
      (this.formData.objId = this.$route.params.id),
        (this.formData.docType = 1),
        (this.formData.title = ""),
        (this.formData.remark = "");
      this.formData.content = "";
      this.$refs["productDocEditForm"].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.noDataMessage {
  width: 100%;
  margin: 0 auto;
  margin-top: 0px;
  text-align: center;
  vertical-align: middle;
}
.productDocument ::v-deep .el-form-item__content {
  line-height: normal;
  position: relative;
}
.software-system-manual {
  .editor-container {
    ::v-deep .vditor {
      height: calc(100vh - 308px) !important;
    }
    ::v-deep .vditor--fullscreen {
      height: 100vh !important;
    }
  }
}
</style>
