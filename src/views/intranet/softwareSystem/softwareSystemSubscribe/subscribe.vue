<template>
  <div>
    <div v-if="subscribeTable.length < 1 && loading === false">
      <br />
      <br />
      <br />
      <br />
      <br />
      <el-row>
        <el-col :offset="4" :span="16">
          <img src="~@/assets/usfSass.png" width="100%" />
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :offset="11" :span="2" style="text-align: center">
          <el-button type="primary" v-on:click="createSubscribe"
            >创建订阅</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div v-if="subscribeTable.length > 0">
      <div>
        <!-- 顶部tag信息 -->
        <TagTip :closable="false">
          了解更多请看
          <a class="anchor initColor" :href="hrefHelpDocument" target="_blank"
            >新手帮助文档</a
          >
        </TagTip>
      </div>
      <el-row>
        <el-col :offset="12" :span="12">
          <el-button
            style="float: right"
            type="primary"
            v-on:click="createSubscribe"
            >创建订阅</el-button
          >
        </el-col>
      </el-row>
      <br />
      <el-table
        :data="subscribeTable"
        :row-class-name="rowClassName"
        v-loading="loading"
        :header-cell-style="{'text-align':'left'}"
      >
        <el-table-column label="序号" type="index" align="left" width="64" />
        <el-table-column label="租户名称" prop="tenementName" align="left" />
        <el-table-column label="租户编码" prop="tenementCode" align="left" />
        <el-table-column label="创建人" prop="createUser" align="left" />
        <el-table-column label="创建时间" prop="createTime" align="left">
          <template slot-scope="scope">
            <span>{{
              scope.row.createTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="id" align="left">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-on:click="
                searchVersion(
                  scope.row.id,
                  scope.row.tenementName,
                  scope.row.tenementCode
                )
              "
              >查看版本</el-button
            >
            <!-- <el-button type="text" v-on:click="deleteSubscribe(scope.row.id)"
              >删除</el-button
            > -->
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
    <div>
      <el-dialog
        width="40%"
        :visible.sync="dialog"
        title="创建订阅"
        :before-close="onClose"
      >
        <el-row>
          <el-col :offset="4" :span="16">
            <el-form
              :rules="rules"
              ref="subscribeForm"
              :model="subscribeForm"
              label-width="120px"
            >
              <el-form-item label="软件系统编码:" prop="code">
                <el-input disabled v-model="subscribeForm.code"></el-input>
              </el-form-item>
              <el-form-item label="软件系统名称:" prop="name">
                <el-input disabled v-model="subscribeForm.name"></el-input>
              </el-form-item>
              <el-form-item label="创建方式:" prop="createType">
                <el-radio-group
                  v-model="subscribeForm.createType"
                  @change="selectCreateType"
                >
                  <el-radio :label="1">选择物流开放平台租户</el-radio>
                  <!-- <el-radio :label="2">手工创建租户</el-radio> -->
                </el-radio-group>
              </el-form-item>
              <el-form-item label="租户名称:" prop="tenementName">
                <el-select
                  v-if="subscribeForm.createType === 1"
                  v-model="tenant"
                  filterable
                  remote
                  :remote-method="querySearch"
                  value-key="id"
                  @change="handleSelect"
                  style="width: 100%"
                  placeholder="请输入租户名称"
                >
                  <el-option
                    v-for="item in tenantOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  >
                    <span style="float: left">{{ item.name }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.code }}</span
                    >
                  </el-option>
                </el-select>
                <el-input
                  v-if="subscribeForm.createType === 2"
                  v-model="subscribeForm.tenementName"
                  placeholder="请输入租户名称"
                ></el-input>
              </el-form-item>
              <div v-if="subscribeForm.createType === 2">
                <el-form-item label="租户主账号名:" prop="pin">
                  <el-input v-model="subscribeForm.pin"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="passWord1">
                  <el-input
                    v-model="subscribeForm.passWord1"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item label="再次输入密码:" prop="passWord2">
                  <el-input
                    v-model="subscribeForm.passWord2"
                    show-password
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item label="备注:" prop="remark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3 }"
                  placeholder="请输入内容"
                  maxlength="120"
                  show-word-limit
                  v-model="subscribeForm.remark"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <span class="dialog-footer" slot="footer">
          <el-button v-on:click="onCancel" type="default">取消</el-button>
          <el-button type="primary" v-on:click="saveSubscribe">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination/index.vue";
import { Message } from "@lui/lui-ui";

export default {
  props: {
    tenementInfo: Object,
    systemMessage: Object,
  },
  components: {
    TagTip: () => import("@/components/common/TagTip.vue"),
    Pagination,
  },
  data() {
    var validatePassWord2 = (rule, value, callback) => {
      console.log(value, this.subscribeForm.passWord1);
      if (this.subscribeForm.passWord1 !== value) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      subscribeTable: [],
      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      dialog: false,
      subscribeForm: {
        //软件系统id
        productId: "",
        code: "",
        name: "",
        //创建方式
        createType: 1,
        supplierId: -1,
        tenementName: "",
        pin: "",
        passWord1: "",
        passWord2: "",
        remark: "",
      },
      tenant: {},
      //租户候选列表
      tenantOptions: [],
      rules: {
        tenementName: [{ required: true, message: "请输入租户名称" }],
        pin: [{ required: true, message: "请输入租户主账号名" }],
        passWord1: [
          { required: true, message: "请输入密码" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
          },
        ],
        passWord2: [
          { required: true, message: "请再次输入密码" },
          { validator: validatePassWord2 },
        ],
      },
      loading: true,
      hrefHelpDocument: "//lcp.jdl.com/#/newHand/53054",
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
    getSubscribeList() {
      console.log("getSubscribeList", this.systemMessage);
      let url = "/product/subscribe/list";
      request({
        url: url,
        method: "get",
        params: {
          productId: this.systemMessage.id,
          pageSize: this.listQuery.pageSize,
          pageNumb: this.listQuery.pageNumb,
        },
      })
        .then((rsp) => {
          console.log("订阅列表的结果", rsp);
          this.listQuery.total = rsp.data.total;
          this.subscribeTable = rsp.data.list;
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 表格上的序号规则
     */
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    /**
     * 创建订阅新关系
     */
    createSubscribe() {
      //这里需要初始化subscribeForm中的一些东西
      console.log("systemMessage", this.systemMessage);
      this.subscribeForm.productId = this.systemMessage.id;
      this.subscribeForm.code = this.systemMessage.code;
      this.subscribeForm.name = this.systemMessage.name;
      this.dialog = true;
    },
    /**
     * 查看订阅的版本页面
     */
    searchVersion(id, tenementName, tenementCode) {
      this.tenementInfo.id = id;
      this.tenementInfo.tenementName = tenementName;
      this.tenementInfo.tenementCode = tenementCode;
      this.$emit("next");
    },
    /**
     * 删除订阅关系
     */
    deleteSubscribe(id) {},
    /**
     * 表格换页
     */
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.getSubscribeList();
    },
    /*
     *dialog 关闭前的回调，会暂停 Dialog 的关闭
     */
    onClose(done) {
      this.cleanDialog();
      done();
    },
    /**
     * dialog 取消操作
     * */
    onCancel() {
      this.cleanDialog();
      this.dialog = false;
    },
    /**
     * 清理对话框旧记录
     */
    cleanDialog() {
      this.$refs["subscribeForm"].resetFields();
      this.tenant = {};
    },
    /*
     *选择创建方式触发
     */
    selectCreateType(value) {
      //需要把手工创建租户的填写的信息清空
      if (value === 1) {
        (this.subscribeForm.pin = ""),
          (this.subscribeForm.passWord1 = ""),
          (this.subscribeForm.passWord2 = "");
      }
      //租户名称和备注在创建方式修改时需要清空
      this.subscribeForm.tenementName = "";
      this.subscribeForm.remark = "";
    },
    /**
     * 保存新的订阅关系
     */
    saveSubscribe() {
      //选择物流开放平台租户
      if (this.subscribeForm.createType === 1) {
        this.$refs["subscribeForm"].validate((valid) => {
          if (valid) {
            let url = "/product/subscribe/create";
            let from = {
              productId: this.subscribeForm.productId,
              createType: this.subscribeForm.createType,
              supplierId: this.subscribeForm.supplierId,
              remark: this.subscribeForm.remark,
            };
            request({
              url: url,
              method: "post",
              data: from,
            })
              .then((rsp) => {
                if (rsp.code === 20000) {
                  Message.success("创建成功");
                  this.getSubscribeList();
                  //保存成功后关闭窗口
                  this.cleanDialog();
                  this.dialog = false;
                } else {
                  Message.error(rsp.message);
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        });
      }
      //手动创建租户
      if (this.subscribeForm.createType === 2) {
        this.$refs["subscribeForm"].validate((valid) => {
          if (valid) {
            //保存成功后关闭窗口
            this.$refs["subscribeForm"].resetFields();
            this.dialog = false;
          }
        });
      }
    },
    /**
     * 租户的模糊查询
     */
    querySearch(queryString) {
      // 调用 callback 返回建议列表的数据
      if (queryString !== null && queryString.trim() !== "") {
        this.getTenemenList(queryString);
      }
    },
    /**
     * 选择下拉框中的某个租户时触发
     */
    handleSelect(item) {
      console.log("item", item);
      console.log(
        "subscribeForm.tenementName",
        this.subscribeForm.tenementName
      );
      this.subscribeForm.tenementName = item.name;
      this.subscribeForm.supplierId = item.id;
    },
    /**
     * 获得租户列表
     */
    getTenemenList(queryString) {
      let url = "/user/fuzzy/queryOuterSupplier";
      request({
        url: url,
        method: "post",
        params: {
          supplierName: queryString,
        },
      })
        .then((rsp) => {
          console.log("租户模糊查询出来的结果", rsp);
          this.tenantOptions = [];
          for (let index = 0; index < rsp.data.length; index++) {
            this.tenantOptions.push({
              id: rsp.data[index].id,
              name: rsp.data[index].name,
              code: rsp.data[index].tenementCode,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  mounted() {
    this.getSubscribeList();
    console.log("subscribe", this.systemMessage);
  },
};
</script>

<style lang="scss" scoped>
.anchor.initColor {
  &:hover {
    color: #3c6ef0;
  }
}
</style>