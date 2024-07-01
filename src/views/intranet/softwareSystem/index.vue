<template>
  <div class="software-system">
    <div class="app-container">
      <div
        v-if="systemTableData && systemTableData.length === 0 && !searchStatus"
      >
        <div class="vbox">
          <img src="@/assets/createapp.png" />
        </div>
        <div style="text-align: center">
          <el-button type="primary" @click="newProd"
            >开始创建第一个系统</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-row class="filter-container">
          <el-col :span="12">
            <el-form
              :inline="true"
              :model="prodSearchForm"
              @submit.native.prevent
            >
              <el-form-item>
                <el-input
                  v-model="prodSearchForm.queryName"
                  placeholder="搜索系统名称"
                  style="width: 350px"
                  :clstag="clstag('productManager_1618992837521|1', '')"
                  @keyup.enter.native="searchProducts"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="searchProducts"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-button
              style="float: right"
              icon="el-icon-plus"
              type="primary"
              :clstag="clstag('productManager_1618992837521|2', '')"
              @click="newProd"
              >创建系统</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="systemTableData">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="64"
          />
          <el-table-column label="系统名称" prop="name" align="center" />
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <span class="initColor">{{
                scope.row.status == 0 ? "初始化" : ""
              }}</span>
              <span class="normalColor">{{
                scope.row.status == 1 ? "已发布" : ""
              }}</span>
              <span class="updateColor">{{
                scope.row.status == 2 ? "编辑中" : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="createUser" align="center" />
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.createTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="id" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="prodManager(scope.row.id)"
                >管理</el-button
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
              @pagination="paginationChange"
              style="margin: 0px; float: right"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 创建系统对话框 -->
      <el-dialog
        title="创建系统"
        width="680px"
        top="8vh"
        :visible.sync="createSystemDialogVisible"
        :before-close="closeCreateSystemDialog"
        :close-on-click-modal="false"
      >
        <!-- 创建系统表单 -->
        <el-form
          :model="createSystemForm"
          :rules="rules"
          label-width="160px"
          ref="createSystemForm"
        >
          <el-form-item
            v-for="(item, index) in createSystemFormList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
          >
            <!-- 选择框 发布范围 -->
            <template v-if="item.optionList">
              <el-select
                v-model="createSystemForm[item.prop]"
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="optionItem in item.optionList"
                  :key="optionItem.value"
                  :label="optionItem.label"
                  :value="optionItem.value"
                >
                </el-option>
              </el-select>
            </template>
            <!-- 单选框组 是否支持二次开发 -->
            <template v-else-if="item.radioList">
              <el-radio-group v-model="createSystemForm[item.prop]">
                <el-radio
                  v-for="radioItem in item.radioList"
                  :key="radioItem.label"
                  :label="radioItem.label"
                >
                  {{ radioItem.text }}
                </el-radio>
              </el-radio-group>
            </template>
            <!-- 输入框 -->
            <template v-else>
              <el-input
                v-model.trim="createSystemForm[item.prop]"
                :placeholder="item.placeholder"
              ></el-input>
            </template>
          </el-form-item>
        </el-form>

        <div class="dialog-footer" slot="footer">
          <el-button @click="onCancel" type="default">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmCreateSystem('createSystemForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import softwareSystem from "@/api/intranet/softwareSystem/index.js";
import { parseTime } from "@/utils";
import pageClick from "@/utils/pageClick.js";
import regExp from "@/constants/regExp.js";

export default {
  name: "SoftwareSystem",
  components: { Pagination },
  data() {
    return {
      env: window.env.buildEnv,
      prodSearchForm: {
        queryName: "",
      },
      createSystemDialogVisible: false,
      createSystemForm: {
        name: "",
        code: "",
        description: "",
        scope: "",
        uatDomainName: "",
        domainName: "",
        secondaryDevelopment: "1",
      },
      createSystemFormList: [
        {
          label: "系统名称：",
          prop: "name",
          placeholder: "请输入系统名称，长度在 2 到 20 个字符",
        },
        {
          label: "系统编码：",
          prop: "code",
          placeholder:
            "请输入系统编码，长度在 2 到 20 个字符，仅支持英文字母、数字、下划线",
        },
        {
          label: "发布范围：",
          prop: "scope",
          placeholder: "请选择发布范围",
          optionList: [
            { label: "外网", value: 1 },
            { label: "内网", value: 2 },
          ],
        },
        {
          label: "系统描述：",
          prop: "description",
          placeholder: "请输入系统描述，长度在 2 到 255 个字符",
        },
        {
          label: "预发环境域名：",
          prop: "uatDomainName",
          placeholder: "请输入域名，长度不超过3到45字符，请勿填写http://",
        },
        {
          label: "生产环境域名：",
          prop: "domainName",
          placeholder: "请输入域名，长度不超过3到45字符，请勿填写http://",
        },
        {
          label: "是否支持二次开发：",
          prop: "secondaryDevelopment",
          radioList: [
            { label: "1", text: "支持" },
            { label: "0", text: "不支持" },
          ],
        },
      ],
      rules: {
        name: [
          { required: true, message: "请输入系统名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
          },
        ],
        code: [
          { required: true, message: "请输入系统编码", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
          },
          {
            pattern: regExp.engNumUnder,
            message: "只能输入字母、数字、下划线",
          },
        ],
        scope: [
          {
            required: true,
            message: "请选择当前软件系统发布范围",
          },
        ],
        description: [
          { required: true, message: "请输入系统描述", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
          },
        ],
        uatDomainName: [
          {
            required: true,
            message: "域名不能为空",
          },
          {
            pattern: /^[\w-]+(\.[\w-]+)+([\w.-]*[\w-])?$/,
            message:
              "只允许输入英文字母、数字、“-”和“.”，且“-”和“.”不能出现在开头或者结尾",
            trigger: "blur",
          },
          {
            min: 3,
            max: 45,
            message: "长度在 3 到 45 个字符",
          },
        ],
        domainName: [
          {
            required: true,
            message: "域名不能为空",
          },
          {
            pattern: /^[\w-]+(\.[\w-]+)+([\w.-]*[\w-])?$/,
            message:
              "只允许输入英文字母、数字、“-”和“.”，且“-”和“.”不能出现在开头或者结尾",
            trigger: "blur",
          },
          {
            min: 3,
            max: 45,
            message: "长度在 3 到 45 个字符",
          },
        ],
        secondaryDevelopment: [
          {
            required: true,
            message: "请选择是否支持二次开发",
          },
        ],
      },
      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      systemTableData: [],
      searchStatus: false,
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
    // 创建软件系统
    async register() {
      let {
        name,
        code,
        description,
        scope,
        uatDomainName,
        domainName,
        secondaryDevelopment,
      } = this.createSystemForm;
      const { env } = this;
      // 非预发、生产环境补全字段
      if (env !== "uat" && env !== "prod") {
        uatDomainName = domainName;
      }
      const params = {
        name,
        code,
        description,
        scope,
        uatDomainName,
        domainName,
        secondaryDevelopment,
      };
      return await softwareSystem.register(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("register");
      });
    },

    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    queryProducts() {
      let url = "/product/list";
      request({
        url: url,
        method: "get",
        params: {
          pageSize: this.listQuery.pageSize,
          pageNumb: this.listQuery.pageNumb,
        },
      })
        .then((rsp) => {
          this.listQuery.total = rsp.data.total;
          this.systemTableData = rsp.data.list;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      if (this.prodSearchForm.queryName.trim().length === 0)
        this.queryProducts();
      else this.searchProducts();
    },

    searchProducts() {
      this.searchStatus = true;
      if (this.prodSearchForm.queryName.trim().length === 0) {
        this.queryProducts();
      } else {
        request({
          url: "/product/search",
          method: "get",
          params: {
            pageSize: this.listQuery.pageSize,
            pageNumb: this.listQuery.pageNumb,
            name: this.prodSearchForm.queryName,
          },
        })
          .then((rsp) => {
            this.listQuery.total = rsp.data.total;
            this.systemTableData = rsp.data.list;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    newProd() {
      this.createSystemDialogVisible = true;
    },

    onSearch() {
      this.searchStatus = true;
      this.queryProducts();
    },

    confirmCreateSystem(prodForm) {
      this.$refs[prodForm].validate(async (valid) => {
        if (valid) {
          const response = await this.register();
          const { data } = response.data;
          const id = data;
          this.$message.success("软件系统添加成功");
          this.createSystemForm.name = "";
          this.createSystemForm.description = "";
          this.createSystemDialogVisible = false;
          this.$router.push({
            name: "SoftwareSystemDetail",
            params: { id },
          });
        }
      });
    },

    prodManager(prodId) {
      this.$router.push({
        // path: `/softwareSystem/detail`,
        name: "SoftwareSystemDetail",
        params: { id: prodId },
      });
    },

    onCancel() {
      this.$refs["createSystemForm"].resetFields();
      this.createSystemForm.name = "";
      this.createSystemForm.code = "";
      this.createSystemForm.description = "";
      this.createSystemDialogVisible = false;
    },

    closeCreateSystemDialog(done) {
      this.$refs["createSystemForm"].resetFields();
      this.createSystemForm.name = "";
      this.createSystemForm.description = "";
      this.createSystemForm.code = "";
      done();
    },
  },
  created() {
    const { env } = this;
    if (env === "local" || env === "devtest" || env === "publictest") {
      this.createSystemFormList = this.createSystemFormList
        .map((item) => {
          const { prop } = item;
          return prop === "domainName"
            ? { ...item, label: "测试环境域名" }
            : item;
        })
        .filter((item) => item.prop !== "uatDomainName");
    }
  },
  mounted() {
    this.queryProducts();
  },
};
</script>

<style lang="scss" scoped>
.software-system {
}
</style>