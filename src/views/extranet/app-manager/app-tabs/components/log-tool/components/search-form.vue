<template>
  <div class="search-form">
    <el-form
      :model="searchFormData"
      label-width="25%"
      :rules="searchFormRules"
      ref="searchFormData"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            :label="$t('logTool.searchForm.5izjb7us5b80')"
            prop="bizUnit"
          >
            <el-select v-model="searchFormData.bizUnit" style="width: 100%">
              <el-option
                v-for="item in bizUnitOptions"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('logTool.searchForm.5izjb7us67c0')"
            prop="env"
          >
            <el-select
              v-model="searchFormData.env"
              :placeholder="$t('logTool.searchForm.5izjb7us6s00')"
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
        <el-col :span="8">
          <el-form-item
            prop="url"
            :label="$t('logTool.searchForm.5izjb7usad01')"
          >
            <el-select
              v-model="searchFormData.url"
              filterable
              clearable
              :placeholder="$t('logTool.searchForm.5izjb7us6v80')"
              style="width: 100%"
              @change="handleSearch"
            >
              <el-option
                v-for="item in uriList"
                :key="item.id"
                :label="item.apiUrl"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('logTool.searchForm.5izjb7us6zs0')">
            <el-input
              v-model="searchFormData.resquestParameter"
              :placeholder="$t('logTool.searchForm.5izjb7us8200')"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('logTool.searchForm.5izjb7us8600')">
            <el-input
              v-model="searchFormData.responseParameter"
              :placeholder="$t('logTool.searchForm.5izjb7us8200')"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('logTool.searchForm.5izjb7us88s0')">
            <el-input
              v-model="searchFormData.statusCode"
              :placeholder="$t('logTool.searchForm.5izjb7us8bs0')"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('logTool.searchForm.5izjb7us8ic0')">
            <el-radio-group
              v-model="searchFormData.timeFrame"
              size="mini"
              style="width: 100%"
            >
              <el-radio-button
                :label="$t('logTool.searchForm.5izjb7usad02')"
              ></el-radio-button>
              <el-radio-button
                :label="$t('logTool.searchForm.5izjb7usad03')"
              ></el-radio-button>
              <el-radio-button
                :label="$t('logTool.searchForm.5izjb7usad04')"
              ></el-radio-button>
              <el-radio-button
                :label="$t('logTool.searchForm.5izjb7usad05')"
              ></el-radio-button>
              <el-radio-button
                :label="$t('logTool.searchForm.5izjb7usad06')"
              ></el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-row>
            <el-col :span="24">
              <el-collapse-transition>
                <div v-show="advanced">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item
                        :label="$t('logTool.searchForm.5izjb7us8kw0')"
                      >
                        <el-select
                          v-model="searchFormData.status"
                          clearable
                          style="width: 100%"
                        >
                          <el-option
                            :label="$t('logTool.searchForm.5izjb7us8sk0')"
                            value="Succeed"
                          ></el-option>
                          <el-option
                            :label="$t('logTool.searchForm.5izjb7us9780')"
                            value="Failed"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        :label="$t('logTool.searchForm.5izjb7us9ao0')"
                      >
                        <el-input
                          v-model="searchFormData.pin"
                          :placeholder="$t('logTool.searchForm.5izjb7us9dc0')"
                          style="width: 100%"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-transition>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="form-button">
                <el-button
                  type="primary"
                  :loading="loading"
                  :clstag="clstag('', 'log_1655708143199|2')"
                  @click="handleSearch"
                  >{{ $t("logTool.searchForm.5izjb7us9fo0") }}</el-button
                >
                <a style="margin-left: 8px" @click="advanced = !advanced">
                  {{
                    advanced
                      ? $t("logTool.searchForm.5izjb7us9lk0")
                      : $t("logTool.searchForm.5izjb7us9wk0")
                  }}
                  <i
                    :class="
                      advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                    "
                  />
                </a>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import buriedPoint from "@/mixins/buriedPoint.js";
import lcp from "@/api/extranet/lcp/index.js";

export default {
  name: "LogSearchForm",
  mixins: [buriedPoint],
  props: {
    bizUnitOptions: {
      type: Array,
      required: true
    },
    handleSearch: {
      type: Function,
      required: true
    },
    searchFormData: {
      type: Object,
      required: true
    },
    appCode: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    async "searchFormData.bizUnit"(value) {
      const { baseEnv } = window.env;
      const hashMap = {
        test: [
          { label: this.$t("logTool.searchForm.5izjb7us9z80"), value: "test" }
        ],
        uat: {
          0: [
            {
              label: this.$t("logTool.searchForm.5izjb7usa9c0"),
              value: "prod"
            }
          ],
          1: [
            {
              label: this.$t("logTool.searchForm.5izjb7usa9c0"),
              value: "prod"
            },
            { label: this.$t("logTool.searchForm.5izjb7usa5c0"), value: "uat" }
          ]
        },
        prod: {
          0: [
            {
              label: this.$t("logTool.searchForm.5izjb7usa9c0"),
              value: "prod"
            }
          ],
          1: [
            {
              label: this.$t("logTool.searchForm.5izjb7usa9c0"),
              value: "prod"
            },
            { label: this.$t("logTool.searchForm.5izjb7usa5c0"), value: "uat" }
          ]
        }
      };
      if (baseEnv === "uat" || baseEnv === "prod") {
        const index = this.bizUnitOptions.find(item => +item.unitId === +value)
          .hasUat;
        this.envOptions = hashMap[baseEnv][index] || [];
      } else {
        this.envOptions = hashMap[baseEnv] || [];
      }
      this.searchFormData.env = this.envOptions[0].value;
      this.searchFormData.url = "";
      this.getUriList();
    }
  },
  data() {
    return {
      advanced: false,
      searchFormRules: {
        bizUnit: [
          {
            required: true,
            message: this.$t("logTool.searchForm.5izjb7usad00")
          }
        ],
        env: [
          {
            required: true,
            message: this.$t("logTool.searchForm.5izjb7us6s00")
          }
        ],
        url: [{ required: true, message: "请选择API的URI", trigger: "change" }]
      },
      envOptions: [],
      uriList: []
    };
  },
  methods: {
    // 查询API的URI
    async queryApiList() {
      // const callDirection = 1;
      // const appCode = this.appCode;
      // const pageNumb = 1;
      // const pageSize = 10;
      // const data = new URLSearchParams();
      // data.append("unitCode", unitCode);
      // data.append("callDirection", callDirection);
      // data.append("appCode", appCode);
      // data.append("pageNumb", pageNumb);
      // data.append("pageSize", pageSize);
      const unitId = this.searchFormData.bizUnit;
      const data = {
        appCode: this.appCode,
        unitId,
      };
      return await lcp.unit.queryApiList(data);
    },
    async getUriList() {
      const { data } = await this.queryApiList().catch(() => {
        throw new Error("getUriList queryApiList");
      });
      // this.uriList =
      //   data.list && data.list.length > 0
      //     ? data.list.map((item) => {
      //         const { apiCode, apiUrl } = item;
      //         return { apiCode, apiUrl };
      //       })
      //     : [];
      this.uriList = (data && data) || [];
    }
  }
};
</script>
<style lang="scss" scoped>
.search-form {
  padding-bottom: 10px;

  .form-button {
    float: right;
  }
}
</style>
