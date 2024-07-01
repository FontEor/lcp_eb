<template>
  <div class="search-form">
    <el-form
      :model="searchFormData"
      label-width="140px"
      :rules="searchFormRules"
      ref="searchFormData"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="对接方案/API分组" prop="domain">
            <el-select
              v-model="searchFormData.domain"
              filterable
              :filter-method="filterMethod"
              clearable
              value-key="code"
              style="width: 100%"
              placeholder="输入对接方案/API分组名称或编码"
              @change="getApiUrI"
            >
              <el-option
                v-for="(item, idx) in filteredOptions"
                :key="item.code + idx"
                :label="item.name + '（' + item.code + '）'"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间范围" prop="timeRange">
            <el-date-picker
              style="width: 100%"
              v-model="searchFormData.timeRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运行环境" prop="env">
            <el-select
              v-model="searchFormData.env"
              placeholder="请选择运行环境"
              style="width: 100%"
            >
              <el-option
                v-for="item in envOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="appKey" label="调用方appKey">
            <el-input
              v-model="searchFormData.appKey"
              placeholder="输入调用api的appKey，如：dfasjhfjkads2wvsvavvvs"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="API的URI" prop="apiUrI">
            <el-select
              v-model="searchFormData.apiUrI"
              filterable
              reserve-keyword
              clearable
              value-key="apiUrl"
              placeholder="如：/openapi/queryExpressOrderTrace"
              style="width: 100%"
              @change="handleChangeApiUrI"
            >
              <el-option
                v-for="item in uriList"
                :key="item.apiUrl"
                :label="item.apiUrl"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item label="接收方appkey" prop="receiverAppKey">
            <!-- 1: 外调内API; 2: 回传API -->
            <el-input
              v-model="searchFormData.receiverAppKey"
              placeholder="请输入接收方appkey"
              style="width: 100%"
              :disabled="disableReceiverAppKey"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <div v-show="advanced">
          <el-row>
            <el-col :span="8">
              <el-form-item label="平台响应状态码">
                <el-input
                  v-model="searchFormData.statusCode"
                  placeholder="请输入错误码"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="pin">
                <el-input
                  v-model="searchFormData.pin"
                  placeholder="输入用户的京东pin，如：jd2313r_fqev22"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入参">
                <el-input
                  v-model="searchFormData.reqKeyWords"
                  placeholder="输入请求body中的关键字"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出参">
                <el-input
                  v-model="searchFormData.resKeyWords"
                  placeholder="输入响应body中的关键字"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="平台响应状态">
                <el-select
                  v-model="searchFormData.status"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="成功" value="Succeed"></el-option>
                  <el-option label="失败" value="Failed"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>

      <el-row>
        <el-col :span="24">
          <div class="form-search-button">
            <el-button
              type="primary"
              @click="handleSearch(1)"
              :loading="loading"
              >查询</el-button
            >
            <a style="margin-left: 8px" @click="advanced = !advanced">
              {{ advanced ? "收起" : "展开" }}
              <i
                :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              />
            </a>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import operationsManager from "@/api/intranet/operationsManager/index.js";

export default {
  name: "LogSearchForm",
  props: {
    bizUnitOptions: {
      type: Array,
      required: true,
    },
    handleSearch: {
      type: Function,
      required: true,
    },
    searchFormData: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    disableReceiverAppKey () {
      return this.searchFormData.apiUrI && +this.searchFormData.apiUrI.callDirection === 1;
    }
  },
  watch: {
    async "searchFormData.domain"(value) {
      // 对接方案/API分组变更，需要清除API的URI
      this.$emit('update:searchFormData', Object.assign(this.searchFormData, {apiUrI: ""}))
      const { baseEnv } = window.env;
      const hashMap = {
        test: [{ label: "测试环境", value: "test" }],
        uat: {
          0: [{ label: "线上环境", value: "prod" }],
          1: [
            { label: "线上环境", value: "prod" },
            { label: "预发环境", value: "uat" },
          ],
        },
        prod: {
          0: [{ label: "线上环境", value: "prod" }],
          1: [
            { label: "线上环境", value: "prod" },
            { label: "预发环境", value: "uat" },
          ],
        },
      };
      if (baseEnv === "uat" || baseEnv === "prod") {
        this.envOptions =
          (value.hasUat === 1 ? hashMap[baseEnv][1] : hashMap[baseEnv][0]) ||
          [];
      } else {
        this.envOptions = hashMap[baseEnv] || [];
      }
      // 选完对接方案后选中运行环境
      this.searchFormData.env = this.envOptions[0].value;
    },
  },
  data() {
    return {
      advanced: false,
      searchFormRules: {
        domain: [{ required: true, message: "请选择对接方案/API分组" }],
        env: [{ required: true, message: "请选择运行环境" }],
        timeRange: [{ required: true, message: "请选择时间范围" }],
        appKey: [{required: true, message: "请输入appKey"}],
        apiUrI: [{required: true, message: "请输入API的URI"}]
      },
      filteredOptions: [],
      envOptions: [],
      uriList: [],
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 7
          );
        },
        shortcuts: [
          {
            text: "最近15分钟",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 0.25);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近1小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近1天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  methods: {
    handleChangeApiUrI () {
      this.disableReceiverAppKey && this.$emit('update:searchFormData', Object.assign(this.searchFormData, {receiverAppKey: ''}));
      this.handleSearch(1);
    },
    // 筛选当前团队内的所有对接方案和API分组
    filterMethod(query) {
      if (query) {
        this.filteredOptions = this.bizUnitOptions.filter((option) => {
          return (
            option.code.indexOf(query) > -1 || option.name.indexOf(query) > -1
          );
        });
      } else {
        this.filteredOptions = [];
      }
    },
    // 查询API的URI
    async logUrlQuery(query) {
      const queryLike = query;
      const { domainType, code } = this.searchFormData.domain;
      const data = { domainType, domainCode: code, queryLike };
      return await operationsManager.logUrlQuery(data);
    },
    async getApiUrI (value) {
      if (value) {
        const {data} = await this.logUrlQuery(this.searchFormData.apiUrI && this.searchFormData.apiUrI.apiUrl).catch(() => {
              throw new Error("remoteApiUrlMethod logUrlQuery");
            });
        this.uriList = data || [];
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.search-form {
  padding-bottom: 10px;

  .form-search-button {
    float: right;
  }
}
</style>