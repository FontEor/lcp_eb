<template>
  <div class="messageList">
    <!-- 顶部tag信息 -->
    <div class="tagTip">
      <el-tag :disable-transitions="true" type="info" class="tagTip__tag">
        <p class="tagTip__content">
          <i class="el-icon-info"></i>&nbsp;
          <slot
            >{{ $t("app.MessageList.5izjptik9tw1") }}
            <a
              class="anchor initColor"
              :href="toBlankAccessGuideDoc"
              target="_blank"
              >{{ $t("app.MessageList.5izjptik9tw0") }}</a
            >
            {{ $t("app.MessageList.5izjptik9tw2") }}</slot
          >
        </p>
      </el-tag>
    </div>
    <!-- 消息表格 -->
    <div class="messageTableArea">
      <div class="tableAreaHeader">
        <div class="inputWrapper">
          <el-select
            v-model="table.selectValue"
            :clearable="true"
            :placeholder="$t('app.MessageList.5izjptikabc0')"
          >
            <el-option
              v-for="(item, index) in table.optionList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model.trim="table.inputValue"
            :placeholder="$t('app.MessageList.5izjptikafw0')"
            @keyup.native.enter="requestTableData"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="requestTableData"
            >{{ $t("app.MessageList.5izjptikaj80") }}</el-button
          >
        </div>
      </div>
      <el-table
        v-if="pagination.total"
        :data="table.data"
        :show-overflow-tooltip="true"
        v-loading="table.loading"
      >
        <el-table-column
          type="index"
          :label="$t('app.MessageList.5izjptikam40')"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          v-for="(column, index) in table.columnList"
          :key="index"
          :label="column.label"
          :prop="column.prop"
          align="center"
        >
          <template slot-scope="{ row }">
            <a
              v-if="column.prop === 'name'"
              :href="`//${host}/#/open-business-document/message-doc/${row.unitId}/${row.id}`"
              class="anchor"
              >{{ row[column.prop] }}</a
            >
            <span v-else :class="judgeStatus(row, column.prop)">{{
              formatTableText(row, column.prop)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('app.MessageList.5izjptikapc0')"
          align="center"
          width="180"
        >
          <template
            #default="{
              row,
              row: { id, isSub, otherSubscribed, otherUnitName },
            }"
          >
            <!-- 已订阅状态显示取消订阅按钮 -->
            <template v-if="isSub === 1">
              <el-button
                type="text"
                @click="onClickSubscribeOrCancelSubscribeButton(id, isSub)"
                >{{ $t("app.MessageList.5izjptikcr40") }}</el-button
              >
            </template>
            <!-- 未订阅状态显示订阅按钮 -->
            <template v-else-if="isSub === 0">
              <!-- 该消息在其他对接方案已订阅 -->
              <template v-if="otherSubscribed">
                <el-tooltip
                  :content="`该消息已在「${
                    otherUnitName || ''
                  }」对接方案下订阅，请勿重复订阅！`"
                  placement="top"
                >
                  <el-button
                    type="text"
                    style="
                      margin-right: 4px;
                      color: #c4c4c4;
                      cursor: not-allowed;
                    "
                    >{{ $t("app.MessageList.5izjptikcog0") }}</el-button
                  >
                </el-tooltip>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="onClickSubscribeOrCancelSubscribeButton(id, isSub)"
                  >{{ $t("app.MessageList.5izjptikcog0") }}</el-button
                >
              </template>
            </template>
            <el-button
              v-if="isSub"
              type="text"
              @click="onClickConfigButton(row)"
              >{{ $t("app.MessageList.5izjptikaso0") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="noData">
        <img src="@/assets/img/noData.png" />
        <p>{{ $t("app.MessageList.5izjptikavw0") }}</p>
      </div>
      <!-- 订阅消息/取消订阅消息对话框 -->
      <el-dialog
        :title="computeDialogTitle"
        :close-on-click-modal="false"
        :visible.sync="table.dialogVisible"
        width="32%"
      >
        <p>{{ computeDialogContent }}</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="table.dialogVisible = false"
            >{{ $t("app.MessageList.5izjptikaz40") }}
            {{ $t("app.MessageList.5izjptikb300") }}</el-button
          >
          <el-button
            :loading="confirmButtonLoading"
            type="primary"
            @click="onClickConfirmButton"
            >{{ $t("app.MessageList.5izjptikb5w0") }}
            {{ $t("app.MessageList.5izjptikb940") }}</el-button
          >
        </div>
      </el-dialog>
      <!-- 配置消息接收方式对话框 -->
      <el-dialog
        :title="$t('app.MessageList.5izjptikaso0')"
        :visible.sync="table.dialogEditVisible"
        :close-on-click-modal="false"
        width="720px"
      >
        <el-form ref="form" :model="form.data" label-width="120px">
          <el-form-item
            :label="$t('app.MessageList.5izjptikbcc0')"
            prop="receiveType"
          >
            <el-radio-group v-model="form.data.receiveType">
              <el-radio :label="1">WebSocket</el-radio>
              <el-radio :label="2">HTTP</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="form.data.receiveType === 2">
            <el-form-item
              :label="$t('app.MessageList.5izjptikbfc0')"
              prop="callbackUrl"
            >
            </el-form-item>
            <el-table
              :data="form.urlList"
              class="table-call-back"
              style="width: 90%"
            >
              <el-table-column
                prop="appGroupName"
                :label="$t('app.MessageList.5izjptikbiw0')"
              >
              </el-table-column>
              <el-table-column prop="url">
                <template #header>
                  <span>{{ formatTableUrlHeader(env) }}</span>
                </template>
                <template #default="{ row, $index }">
                  <el-form
                    :ref="`formCallback${$index}`"
                    :model="row"
                    :rules="{
                      url: [
                        {
                          pattern:
                            /^http(s)?:\/\/([\w-]+\.)+[\w-]+(:\d+)?(\/[\w-./?%&=]*)?$/,
                          message: $t('app.MessageList.5izjptikbls1'),
                        },
                      ],
                    }"
                  >
                    <el-form-item label="" prop="url">
                      <el-input
                        v-model.trim="row.url"
                        :placeholder="$t('app.MessageList.5izjptikbow0')"
                        style="margin-top: 22px; width: 100%"
                      />
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                v-if="(env === 'uat' || env === 'prod') && enableShadowbox"
                prop="shadowboxUrl"
                :label="$t('app.MessageList.5izjptikbls2')"
              >
                <template #default="{ row, $index }">
                  <el-form
                    :ref="`formShadowboxCallback${$index}`"
                    :model="row"
                    :rules="{
                      shadowboxUrl: [
                        {
                          pattern:
                            /^http(s)?:\/\/([\w-]+\.)+[\w-]+(:\d+)?(\/[\w-./?%&=]*)?$/,
                          message: $t('app.MessageList.5izjptikbls1'),
                        },
                      ],
                    }"
                  >
                    <el-form-item label="" prop="shadowboxUrl">
                      <el-input
                        v-model.trim="row.shadowboxUrl"
                        :placeholder="$t('app.MessageList.5izjptikbow0')"
                        style="margin-top: 22px; width: 100%"
                      />
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="table.dialogEditVisible = false"
            >{{ $t("app.MessageList.5izjptikaz40") }}
            {{ $t("app.MessageList.5izjptikb300") }}</el-button
          >
          <el-button type="primary" @click="handleSave"
            >{{ $t("app.MessageList.5izjptikb5w0") }}
            {{ $t("app.MessageList.5izjptikb940") }}</el-button
          >
        </div>
      </el-dialog>
      <el-pagination
        v-show="pagination.total"
        :current-page.sync="pagination.page"
        :page-size.sync="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="requestTableData"
        @size-change="requestTableData"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";
import parseTime from "@/utils/parseTime.js";

export default {
  name: "MessageList",
  components: { TagTip: () => import("@/components/common/TagTip.vue") },
  props: {
    currentRow: {
      type: Object,
      default() {
        return {};
      },
    },
    appKey: String,
  },
  data() {
    return {
      env: window.env.baseEnv,
      host: window.location.host,
      tagText: this.$t("app.MessageList.5izjptikbs80"),
      row: {},
      table: {
        loading: false,
        selectValue: null,
        optionList: [
          { label: this.$t("app.MessageList.5izjptikbv00"), value: 0 },
          { label: this.$t("app.MessageList.5izjptikby00"), value: 1 },
        ],
        inputValue: "",
        dialogVisible: false,
        dialogEditVisible: false,
        data: [],
        columnList: [
          { label: this.$t("app.MessageList.5izjptikc2c0"), prop: "unitName" },
          { label: "TOPIC", prop: "name" },
          {
            label: this.$t("app.MessageList.5izjptikc500"),
            prop: "chineseName",
          },
          { label: this.$t("app.MessageList.5izjptikc7o0"), prop: "descr" },
          { label: this.$t("app.MessageList.5izjptikca00"), prop: "isSub" },
          {
            label: this.$t("app.MessageList.5izjptikccg0"),
            prop: "receiveType",
          },
          {
            label: this.$t("app.MessageList.5izjptikcew0"),
            prop: "updateUser",
          },
          {
            label: this.$t("app.MessageList.5izjptikchc0"),
            prop: "updateTime",
          },
        ],
        statusClassTable: ["notSubscribed", "subscribed"],
        statusTable: [
          this.$t("app.MessageList.5izjptikbv00"),
          this.$t("app.MessageList.5izjptikby00"),
        ],
        receiveTypeTable: [, "WebSocket", "HTTP"],
        currentId: 0,
        currentIsSub: 0,
        statusDialogTitleTable: [
          this.$t("app.MessageList.5izjptikctg0"),
          this.$t("app.MessageList.5izjptikcw00"),
        ],
        statusDialogContentTable: [
          this.$t("app.MessageList.5izjptikcyk0"),
          this.$t("app.MessageList.5izjptikd0s0"),
        ],
      },
      enableShadowbox: false,
      form: {
        data: {},
        urlList: [],
      },

      pagination: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
        total: 0,
      },
      confirmButtonLoading: false,
      confirmButtonDebounceTimer: null,
    };
  },
  computed: {
    computeDialogTitle() {
      return this.table.statusDialogTitleTable[this.table.currentIsSub];
    },
    computeDialogContent() {
      return this.table.statusDialogContentTable[this.table.currentIsSub];
    },
    toBlankAccessGuideDoc() {
      const url = `${window.location.origin}/#/open-business-document/access-guide/${this.currentRow.unitId}`;
      return url;
    },
  },
  watch: {
    "form.data.receiveType": {
      async handler(val) {
        if (val === 2) {
          const { unitId } = this.currentRow;
          const appCode = this.appKey;
          const msgName = this.form.data.name;
          const params = { unitId, appCode, msgName };
          const response = await api.appManager
            .getCustomerGroupMessageCallbackInfoData(params)
            .catch((error) => {
              throw error;
            });
          this.form.urlList = response.data.messageCallbackInfoList || [];
          this.enableShadowbox = response.data.enableShadowbox || false;
        }
      },
      deep: true,
    },
  },
  methods: {
    formatTableUrlHeader(env) {
      const hashMap = new Map()
        .set("test", this.$t("app.MessageList.5izjptikbls0"))
        .set("uat", this.$t("app.MessageList.5izjptikbls3"))
        .set("prod", this.$t("app.MessageList.5izjptikbls3"));
      return hashMap.get(env) || "-";
    },
    judgeStatus(row, prop) {
      if (prop === "isSub") {
        return this.table.statusClassTable[row[prop]];
      } else {
        return "";
      }
    },
    formatTableText(row, prop) {
      if (prop === "isSub") {
        return this.getStaus(row, prop);
      } else if (prop === "receiveType") {
        return this.table.receiveTypeTable[row[prop]];
      } else if (prop === "updateTime") {
        return parseTime.timeInTable(row[prop]);
      } else {
        return row[prop];
      }
    },
    getStaus(row, prop) {
      return this.table.statusTable[row[prop]];
    },
    onClickSubscribeOrCancelSubscribeButton(id, isSub) {
      this.table.currentId = id;
      this.table.currentIsSub = isSub;
      this.table.dialogVisible = true;
    },
    onClickConfigButton(row) {
      this.form.data = { ...row };
      this.table.dialogEditVisible = true;
    },
    onClickConfirmButton() {
      clearTimeout(this.confirmButtonDebounceTimer);
      this.confirmButtonDebounceTimer = setTimeout(() => {
        const appKey = this.appKey;
        const messageId = this.table.currentId;
        const data = { appKey, messageId };
        const handleTable = [
          () => {
            this.confirmButtonLoading = true;
            api.message
              .postSubscribeData(data)
              .then((response) => {
                this.$message.success(this.$t("app.MessageList.5izjptikd5k0"));
                this.requestTableData();
                this.table.dialogVisible = false;
                this.confirmButtonLoading = false;
              })
              .catch((error) => {
                this.requestTableData();
                this.table.dialogVisible = false;
                this.confirmButtonLoading = false;
              });
          },
          () => {
            this.confirmButtonLoading = true;
            api.message
              .postUnsubscribeData(data)
              .then((response) => {
                this.$message.success(this.$t("app.MessageList.5izjptikd800"));
                this.requestTableData();
                this.table.dialogVisible = false;
                this.confirmButtonLoading = false;
              })
              .catch((error) => {
                this.requestTableData();
                this.table.dialogVisible = false;
                this.confirmButtonLoading = false;
              });
          },
        ];
        handleTable[this.table.currentIsSub]();
      }, 300);
    },
    // 保存配置
    async handleSave() {
      const urlList = this.form.urlList.map((_, index) =>
        this.$refs[`formCallback${index}`].validate()
      );
      const shadowboxUrlList =
        (this.env === "uat" || this.env === "prod") && this.enableShadowbox
          ? this.form.urlList.map((_, index) =>
              this.$refs[`formShadowboxCallback${index}`].validate()
            )
          : [];
      await Promise.all(urlList.concat(shadowboxUrlList)).catch(() => {
        throw new Error(this.$t("app.MessageList.5izjptikd801"));
      });
      const { unitId } = this.currentRow;
      const appCode = this.appKey;
      const msgName = this.form.data.name;
      const receiveType = this.form.data.receiveType;
      const messageCallbackInfoList = this.form.urlList.map(
        ({ appGroupId, appGroupName, url, shadowboxUrl }) => ({
          appGroupId,
          appGroupName,
          url,
          shadowboxUrl,
        })
      );
      const data = {
        unitId,
        appCode,
        msgName,
        receiveType,
        messageCallbackInfoList,
      };
      await api.appManager
        .postCustomerGroupMessageCallbackInfoSaveData(data)
        .catch((error) => {
          throw error;
        });
      this.$message.success(this.$t("app.MessageList.5izjptikdag0"));
      this.$refs["form"].resetFields();
      this.table.dialogEditVisible = false;
      this.requestTableData();
    },
    // 查询消息表格
    requestTableData() {
      this.table.loading = true;
      const { appKey } = this;
      const { unitId } = this.currentRow;
      const { page, pageSize } = this.pagination;
      const { selectValue, inputValue } = this.table;
      const isSub = selectValue;
      const queryLike = inputValue;
      const data = { appKey, unitId, page, pageSize, isSub, queryLike };
      api.message
        .postFindByAppKeyData(data)
        .then((response) => {
          const { list, total } = response.data;
          this.table.data = list;
          this.pagination.total = total;
          this.table.loading = false;
        })
        .catch((error) => {
          this.table.loading = false;
        });
    },
  },
  mounted() {
    this.requestTableData();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.messageList {
  .messageTableArea {
    .table-call-back {
      margin: 0 auto;
    }
    .tableAreaHeader {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .inputWrapper {
        // width: 500px;
        .el-select {
          margin-right: 10px;
          width: 180px;
        }
        .el-input {
          margin-right: 10px;
          width: 300px;
        }
      }
    }
    .el-table {
      .anchor {
        color: #3c6ef0;
        text-decoration: underline;
      }
      ::v-deep .el-dialog__header,
      ::v-deep .el-dialog__body {
        text-align: left;
      }
      .notSubscribed {
        color: $initColor;
      }
      .subscribed {
        color: $normalColor;
      }
    }
    .inputWrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      .el-input {
        width: 60%;
      }
    }
    .el-pagination {
      display: flex;
      justify-content: flex-end;
    }
  }

  .noData {
    text-align: center;
  }
}
.tagTip {
  .tagTip__tag {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: small;
    border-color: #f5f5f5;
    .tagTip__content {
      color: #999;
    }
  }
}
</style>