<template>
  <div class="subscribe-docking-scheme">
    <div class="app-container">
      <h2 class="menuTitle">
        {{ $t("appManager.subscribeDockingScheme.5izk54nwgl00") }}
      </h2>

      <Steps
        class="subscribe-steps"
        :active="steps.active"
        :tiptitle="steps.tiptitle"
      />
      <div class="stepForm">
        <!-- 第一步选择对接方案表格table -->
        <div v-show="steps.active === 0" class="step-form-table">
          <div class="table-search">
            <el-input
              class="search-input"
              :placeholder="
                $t('appManager.subscribeDockingScheme.5izk54nwhdc0')
              "
              v-model.trim="unitName"
              :clearable="true"
              @input="findBizUnitVoListByPage(1)"
              @keyup.enter.native="findBizUnitVoListByPage(1)"
              suffix-icon="el-icon-search"
            >
            </el-input>
          </div>
          <el-table v-loading="loading" :data="table.data">
            <el-table-column
              type="index"
              :label="$t('appManager.subscribeDockingScheme.5izk54nwhmg0')"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              v-for="(item, index) in table.itemList"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              :label="$t('appManager.subscribeDockingScheme.5izk54nwhpk0')"
              prop="orderStatus"
              width="140"
              align="center"
            >
              <template slot-scope="{ row }">
                <!-- orderStatus：0为审核中，1为申请成功 -->
                <el-button
                  :disabled="row.orderStatus === 0 || row.orderStatus === 1"
                  type="text"
                  @click="applyToUse(row)"
                  >{{
                    $t("appManager.subscribeDockingScheme.5izk54nwht40")
                  }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :currentPage.sync="pageNumb"
            :pageSize.sync="pageSize"
            :total.sync="total"
            :reloadTableData="findBizUnitVoListByPage"
          />
        </div>

        <!-- 第二步申请理由表单form -->
        <el-form
          v-show="steps.active === 1"
          :model="form.data"
          :rules="form.rules"
          ref="form"
        >
          <el-form-item
            v-for="(item, index) in form.itemList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            label-width="120px"
          >
            <el-input
              v-model="form.data[item.prop]"
              :type="item.type"
              :disabled="item.disabled"
              :rows="item.rows"
              resize="vertical"
            ></el-input>
          </el-form-item>
        </el-form>

        <!-- 订阅成功 -->
        <div v-show="steps.active === 2" class="successWrapper">
          <i class="el-icon-success"></i>
          <p class="successTitle">
            {{ $t("appManager.subscribeDockingScheme.5izk54nwhw40") }}
          </p>
          <p class="successTip">
            {{ $t("appManager.subscribeDockingScheme.5izk54nwhw41") }},{{ time
            }}{{ $t("appManager.subscribeDockingScheme.5izk54nwhw42") }}
          </p>
        </div>

        <!-- 后两步显示的按钮 -->
        <div v-if="steps.active > 0" class="buttonWrapper">
          <el-button v-if="steps.active === 1" @click="previousStep">{{
            $t("appManager.subscribeDockingScheme.5izk54nwhz80")
          }}</el-button>
          <el-button
            v-if="steps.active === 1"
            :loading="submitButtonLoading"
            type="primary"
            @click="onClickSubmitButton"
            >{{
              $t("appManager.subscribeDockingScheme.5izk54nwi340")
            }}</el-button
          >
          <el-button
            v-if="steps.active === 2"
            type="primary"
            @click="goToRoute"
            >{{
              $t("appManager.subscribeDockingScheme.5izk54nwi6c0")
            }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from "@/components/steps/index.vue";
import api from "@/api/index.js";
import Pagination from "@/components/Pagination.vue";
import pageClick from "@/utils/pageClick.js";

export default {
  name: "SubscribeDockingScheme",
  components: { Steps, Pagination },
  data() {
    return {
      loading: true,
      intervalId: null,
      time: 5,
      unitId: 0,
      unitName: "",
      appKey: "",
      appName: "",
      appType: 0,
      bizName: "",
      typeToAppTypeTable: [, 2, 2, 2, 2, 4],
      appTypeTextTable: [
        ,
        ,
        this.$t("appManager.subscribeDockingScheme.5izk54nwi9k1"),
        ,
        this.$t("appManager.subscribeDockingScheme.5izk54nwi9k0"),
      ],
      steps: {
        active: 0,
        tiptitle: [
          this.$t("appManager.subscribeDockingScheme.5izk54nwid00"),
          this.$t("appManager.subscribeDockingScheme.5izk54nwigo0"),
          this.$t("appManager.subscribeDockingScheme.5izk54nwik00"),
        ],
      },
      table: {
        data: [],
        itemList: [
          {
            label: this.$t("appManager.subscribeDockingScheme.5izk54nwinc0"),
            prop: "name",
          },
          {
            label: this.$t("appManager.subscribeDockingScheme.5izk54nwiqg0"),
            prop: "remark",
          },
          // { label: "可接入的应用种类", prop: "appType" },
        ],
      },
      form: {
        data: {
          bizName: "",
          appName: "",
          remark: "",
        },
        itemList: [
          {
            label: this.$t("appManager.subscribeDockingScheme.5izk54nwits0"),
            prop: "bizName",
            disabled: true,
          },
          {
            label: this.$t("appManager.subscribeDockingScheme.5izk54nwix80"),
            prop: "appName",
            disabled: true,
          },
          {
            label: this.$t("appManager.subscribeDockingScheme.5izk54nwj040"),
            prop: "remark",
            type: "textarea",
            rows: 2,
          },
        ],
        rules: {
          bizName: [
            {
              required: true,
              message: this.$t(
                "appManager.subscribeDockingScheme.5izk54nwhdc0"
              ),
            },
          ],
          appName: [
            {
              required: true,
              message: this.$t(
                "appManager.subscribeDockingScheme.5izk54nwj3k0"
              ),
            },
          ],
          remark: [
            {
              required: true,
              message: this.$t(
                "appManager.subscribeDockingScheme.5izk54nwj8c0"
              ),
            },
            {
              min: 10,
              max: 200,
              message: this.$t(
                "appManager.subscribeDockingScheme.5izk54nwjb00"
              ),
            },
          ],
        },
      },
      // 分页器
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      submitButtonLoading: false,
      submitButtonDebounceTimer: null,
    };
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    previousStep() {
      this.steps.active -= 1;
      this.$refs["form"].resetFields();
    },
    onClickSubmitButton() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          clearTimeout(this.submitButtonDebounceTimer);
          this.submitButtonDebounceTimer = setTimeout(() => {
            this.submitButtonLoading = true;
            // 提交申请订阅的对接方案单元表单
            const unitId = this.unitId;
            const appKey = this.appKey;
            const appName = this.appName;
            const remark = this.form.data.remark;
            const data = [{ unitId, appKey, appName, remark }];
            api.appManager
              .postSubscribeBizData(data)
              .then((response) => {
                if (response.code === 20000) {
                  this.$message.success(
                    this.$t("appManager.subscribeDockingScheme.5izk54nwjeg0")
                  );
                  this.steps.active += 1;
                  const that = this;
                  this.intervalId = window.setInterval(() => {
                    that.time -= 1;
                    if (that.time <= 0) {
                      that.goToRoute();
                    }
                  }, 1000);
                } else {
                  this.$message.error(response.data.message);
                }
                this.submitButtonLoading = false;
              })
              .catch((error) => {
                console.log(error);
                this.submitButtonLoading = false;
              });
          }, 300);
        } else {
          return false;
        }
      });
    },
    applyToUse(row) {
      this.unitId = row.unitId;
      this.form.data.bizName = row.name;
      this.form.data.appName = this.appName;
      this.steps.active += 1;
    },
    goToRoute() {
      const intervalId = this.intervalId;
      const id = parseInt(this.$route.params.id);
      window.clearInterval(intervalId);
      this.$router.push({
        // path: "/appManager/appTabs",
        name: "AppManagerAppTabs",
        params: { id },
        query: { id, tabName: "302" },
      });
    },
    findBizUnitVoListByPage(page) {
      // 根据应用KEY与应用类型查询应用可申请订阅的对接方案单元
      this.pageNumb = page || this.pageNumb;
      const { pageNumb, pageSize, appKey, unitName } = this;
      const params = { appKey, unitName, pageNumb, pageSize };
      api.appManager
        .findBizUnitVoListByPage(params)
        .then((response) => {
          const { list, total } = response.data;
          const tableData = [];
          list.forEach((item) => {
            item.appType = this.appTypeTextTable[this.appType];
            tableData.push(item);
          });
          this.table.data = tableData;
          this.total = total;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    // 根据应用ID获取应用信息
    const params = { id: parseInt(this.$route.params.id) };
    api.appManager
      .getAppData(params)
      .then((response) => {
        // /getApp中出参type 1:"内网应用", 2:"外网应用", 3:"ISV应用", 4:"商家自研应用", 5:"合作伙伴应用"
        // /findBizUnitVoList中入参appType 2:"ISV/商家应用" 4:"合作伙伴应用"
        this.appKey = response.data.code;
        this.appName = response.data.name;
        this.appType = this.typeToAppTypeTable[response.data.type];
        this.findBizUnitVoListByPage();
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss" scoped>
.subscribe-docking-scheme {
  .menuTitle {
    padding: 0 12px;
    font-size: 16px;
    font-weight: 600;
    position: relative;
    &::before {
      content: "";
      display: block;
      width: 3px;
      height: 100%;
      background: #3c6ef0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .subscribe-steps {
    ::v-deep .my-step-bar {
      margin: 25px auto;
    }
  }
  .stepForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .step-form-table {
      width: 75%;
      .table-search {
        display: flex;
        align-items: baseline;
        .search-input {
          width: 300px;
          margin: 0 12px 12px 0;
        }
        .search-advice {
          color: #b5b5b5;
          cursor: pointer;
        }
        .search-advice:hover {
          color: #3c6ef0;
        }
      }
    }
    .el-form {
      width: 50%;
    }
    .buttonWrapper {
      margin-top: 12px;
    }
    .successWrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .el-icon-success {
        font-size: 48px;
        color: #26a872;
      }
      .successTitle {
        margin: 16px;
        font-size: 24px;
      }
    }
  }
  ::v-deep .el-textarea__inner {
    padding: 5px 10px;
  }
}
</style>
