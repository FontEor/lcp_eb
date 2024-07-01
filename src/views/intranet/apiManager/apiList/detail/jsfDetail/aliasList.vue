<template type="ElementUI">
  <div style="padding: 0px" meta="x:216.0,y:81.0,width:600.0,height:321.0">
    <span v-if="this.nodata === 'no'" key="1">
      <el-row class="filter-container" style="margin-bottom: 0px">
        <el-col :span="12">
          <el-form style="height: 45px" :inline="true">
            <el-form-item label=""> </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            icon="el-icon-plus"
            v-on:click="
              queryAliasInJsf();
              aliasDialogVisible = true;
            "
            style="margin: 5px; float: right"
            v-if="jsfAliasAddBtnStatus.visible"
            :disabled="jsfAliasAddBtnStatus.disabled"
            >添加别名
          </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableDatas"
        :row-class-name="rowClassName"
        class="my-table mb2"
      >
        <el-table-column
          label="序号"
          prop="number"
          align="center"
          min-width="7.36%"
        />
        <el-table-column
          label="别名"
          prop="alias"
          align="center"
          min-width="23.08%"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="功能描述"
          prop="remark"
          align="center"
          min-width="62.88%"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="操作"
          prop="id"
          align="center"
          min-width="10.02%"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-on:click="onModify(scope.row)"
              v-if="jsfAliasEditBtnStatus.visible"
              :disabled="jsfAliasEditBtnStatus.disabled"
              >编辑
            </el-button>
            <el-button
              type="text"
              v-on:click="onDelete(scope.row.id)"
              v-if="jsfAliasDeleteBtnStatus.visible"
              :disabled="jsfAliasDeleteBtnStatus.disabled"
              >删除
            </el-button>
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
      <el-dialog
        title="编辑别名"
        :visible.sync="aliasRemarkDialogVisible"
        :before-close="this.handleRemarkClose"
        width="680px"
        :close-on-click-modal="false"
      >
        <el-form
          :model="aliasRemarkForm"
          :rules="aliasRules"
          label-width="100px"
          ref="aliasRemarkForm"
          :inline="false"
        >
          <el-form-item prop="alias" label="别名:">
            {{ aliasRemarkForm.alias }}
          </el-form-item>
          <el-form-item prop="remark" label="功能描述:">
            <el-input
              v-model="aliasRemarkForm.remark"
              placeholder="请输入功能描述"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-on:click="onRemarkChangeCancel('aliasRemarkForm')"
            >取消
          </el-button>
          <el-button
            type="primary"
            v-on:click="onRemarkChangeSubmit('aliasRemarkForm')"
            >确定
          </el-button>
        </span>
      </el-dialog>
    </span>
    <span style="display: none" id="displayalias">
      <!--    <span v-if="this.nodata==='yes'" key="2">-->
      <div style="margin-top: 0px; text-align: center">
        <img
          src="@/assets/img/noData.png"
          style="width: 316px; height: 200px"
        />
        <el-row>
          <el-col :span="24">
            <div style="margin-top: 0px; text-align: center">
              <span>
                <a
                  style="color: #3c6ef0"
                  v-on:click="
                    queryAliasInJsf();
                    aliasDialogVisible = true;
                  "
                  >点此添加别名, </a
                >以确保调用方可正常申请调用您的API
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </span>

    <!--别名添加弹出框定义-->
    <el-dialog
      title="别名添加"
      :visible.sync="aliasDialogVisible"
      :before-close="this.handleClose"
      width="680px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="aliasForm"
        :rules="aliasRules"
        label-width="100px"
        ref="aliasForm"
        :inline="false"
      >
        <el-form-item prop="alias" label="别名:">
          <!--          <el-autocomplete class="el-input"-->
          <!--                           v-model="aliasForm.alias"-->
          <!--                           :fetch-suggestions="this.queryAliasByQualifiedName"-->
          <!--                           :trigger-on-focus="false"-->
          <!--                           v-on:select="((alias)=>this.onSelectAlias(alias))"-->
          <!--                           placeholder="请输入别名">-->
          <!--          </el-autocomplete>-->
          <el-select v-model="aliasForm.alias" placeholder="请选择别名">
            <el-option
              v-for="item in aliases"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="功能描述:">
          <el-input
            v-model="aliasForm.remark"
            placeholder="请输入功能描述"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-on:click="onCancel('aliasForm')">取消 </el-button>
        <el-button type="primary" v-on:click="addServiceAlias('aliasForm')"
          >确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import { Message } from "@lui/lui-ui";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  props: {
    jsfAliasAddBtnStatus: {
      type: Object,
      default: () => {}
    },
    jsfAliasEditBtnStatus: {
      type: Object,
      default: () => {}
    },
    jsfAliasDeleteBtnStatus: {
      type: Object,
      default: () => {}
    }
  },
  components: { Pagination },
  data() {
    return {
      tableDatas: [],

      aliasForm: {
        id: "",
        alias: "",
        remark: "",
        qualifiedName: "",
        instanceId: this.$route.params.id
      },

      aliasRemarkForm: {
        id: "",
        alias: "",
        remark: "",
        qualifiedName: "",
        instanceId: this.$route.params.id
      },

      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60]
      },

      aliasDialogVisible: false,

      aliasRemarkDialogVisible: false,

      aliasOptions: [],
      aliases: [],
      nodata: "yes",

      aliasRules: {
        alias: [
          { required: true, message: "请选择别名名称", trigger: "change" }
          // {min: 2, max: 200, message: "长度在2到200个字符", trigger: "blur"}
          // {pattern: /^[0-9a-zA-Z\-]*$/, message: '别名仅支持英文及数字'}
        ],
        remark: [
          { required: true, message: "请输入功能描述", trigger: "blur" },
          { min: 2, max: 200, message: "长度在2到200个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async findApiBaseInfo() {
      const url = "/ApiManagerService/findApiBaseInfo";
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    //--获取服务别名列表
    queryServiceAlias() {
      gwApiRequest({
        url: "/ApiManagerService/queryAlias",
        method: "post",
        data: JSON.stringify([
          {
            pageSize: this.listQuery.pageSize,
            pageNumb: this.listQuery.pageNumb
          },
          {
            id: this.$route.params.id
          }
        ])
      })
        .then(rsp => {
          let total = rsp.data.total;
          if (total === 0) {
            document.getElementById("displayalias").style.display = "";
            this.nodata = "yes";
          } else {
            document.getElementById("displayalias").style.display = "none";
            this.nodata = "no";
            this.listQuery.total = rsp.data.total;
            this.tableDatas = rsp.data.list;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    //--2020-05-15
    //--事先根据ID获取完全限定名
    async fetchApiInstance() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        throw new Error("fetchApiInstance findApiBaseInfo");
      });
      this.qualifiedName = data.qualifiedName;
    },

    queryAliasInJsf() {
      gwApiRequest({
        url: "/JsfApiMetaService/queryAliasByInterface",
        method: "post",
        data: JSON.stringify([
          {
            qualifiedName: this.qualifiedName
          }
        ])
      })
        .then(resp => {
          const aliases = resp.data;
          this.aliases = aliases;
        })
        .catch(error => {
          console.log(error);
        });
    },

    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryServiceAlias();
    },

    // queryAliasByQualifiedName(queryString, callback) {
    //   let list = [];
    //   request({
    //     url: "/serviceAlias/aliasInJsf",
    //     method: 'get',
    //     params: {qualifiedName: this.qualifiedName}
    //   }).then(resp => {
    //     const aliases = resp.data;
    //     if (aliases) {
    //       for (let i = 0; i < aliases.length; i++) {
    //         const aliasObject = {};
    //         aliasObject["value"] = aliases[i]
    //         list.push(aliasObject)
    //       }
    //       //--过滤结果
    //       let filterList = queryString ? list.filter(this.onFilterAlias(queryString)) : list
    //       clearTimeout(this.timeout)
    //       this.timeout = setTimeout(() => {
    //         callback(filterList);
    //       }, 200)
    //     } else {
    //       callback(list)
    //     }
    //
    //   }).catch((error) => {
    //     console.log(error);
    //   });
    // },

    // onFilterAlias(queryString) {
    //   return (aliasObject) => {
    //     return aliasObject.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
    //   }
    // },

    // onSelectAlias(alias) {
    //   this.aliasForm.alias = alias.value
    // },

    addServiceAlias(aliasForm) {
      this.$refs[aliasForm].validate(valid => {
        if (valid) {
          this.aliasForm.qualifiedName = this.qualifiedName;
          gwApiRequest({
            url: "/ApiManagerService/addAlias",
            method: "post",
            data: JSON.stringify([this.aliasForm])
          })
            .then(resp => {
              Message.success("别名添加成功");
              this.aliasForm.alias = "";
              this.aliasForm.remark = "";
              this.aliasDialogVisible = false;
              this.queryServiceAlias();
              this.$emit("updateStatus");
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },

    handleClose(done) {
      //this.$confirm('确认关闭？')
      //.then(_ => {
      this.aliasForm.alias = "";
      this.aliasForm.remark = "";
      this.$refs["aliasForm"].resetFields();
      done();
      // })
      // .catch(_ => {
      // });
    },

    onCancel(fromName) {
      this.aliasForm.alias = "";
      this.aliasForm.remark = "";
      this.$refs[fromName].resetFields();
      this.aliasDialogVisible = false;
    },

    onRemarkChangeCancel(fromName) {
      this.aliasForm.remark = "";
      this.$refs[fromName].resetFields();
      this.aliasRemarkDialogVisible = false;
    },

    handleRemarkClose(done) {
      this.aliasRemarkForm.remark = "";
      this.$refs["aliasRemarkForm"].resetFields();
      done();
    },

    onDelete(aliasId) {
      this.$confirm("确认删除？", "提示")
        .then(_ => {
          let url = "/serviceAlias/deleteAlias";
          gwApiRequest({
            url: "/ApiManagerService/deleteAlias",
            method: "post",
            data: JSON.stringify([
              {
                id: aliasId
              }
            ])
          })
            .then(rsp => {
              Message.success("删除成功");
              this.queryServiceAlias();
              this.$emit("updateStatus");
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(_ => {});
    },

    onModify(alias) {
      this.aliasRemarkDialogVisible = true;
      this.aliasRemarkForm.id = alias.id;
      this.aliasRemarkForm.alias = alias.alias;
      this.aliasRemarkForm.remark = alias.remark;
    },

    onRemarkChangeSubmit(aliasRemarkForm) {
      this.$refs[aliasRemarkForm].validate(valid => {
        if (valid) {
          gwApiRequest({
            method: "post",
            url: "/ApiManagerService/updateAlias",
            data: JSON.stringify([
              {
                id: this.aliasRemarkForm.id,
                remark: this.aliasRemarkForm.remark
              }
            ])
          })
            .then(resp => {
              Message.success("别名描述修改成功");
              this.aliasRemarkForm.alias = "";
              this.aliasRemarkForm.remark = "";
              this.$refs["aliasRemarkForm"].resetFields();
              this.aliasRemarkDialogVisible = false;
              this.queryServiceAlias();
              this.$emit("updateStatus");
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    }
  },
  created() {
    //--获取服务别名列表
    this.queryServiceAlias(1, this.listQuery.limit);
    //--2020-05-15,为了满足单给页面存在唯一URL的需求,增加fetchApiInstance方法主动获取限定名
    this.fetchApiInstance();
  }
};
</script>
