<template>
  <section class="step-search">
    <Title text="物流信息" />
    <el-form
      class="logistics-info-form"
      label-width="80px"
      :model="logisticsInfo"
    >
      <el-row>
        <el-col
          v-for="{ label, prop, span } in logisticsInfoList"
          :key="prop"
          :span="span"
        >
          <el-form-item :label="`${label}:`">
            <span>{{ logisticsInfo[prop] }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <div class="step-search__track-wrapper">
      <el-row
        v-for="({ operateTime, operateMessage }, index) in trackList"
        :key="index"
        class="track-wrapper__track"
        type="flex"
        justify="start"
      >
        <p class="track__operate-time">
          {{ operateTime | formatOperateTimeText }}
        </p>
        <p class="track__operate-message">{{ operateMessage }}</p>
      </el-row>
      <el-button
        class="track-wrapper__refresh"
        type="text"
        icon="el-icon-refresh"
        :loading="refreshLoading"
        :clstag="clstag('', 'sandboxDebugging_1654841119615|5')"
        @click="onClickRefreshButton"
        >刷新</el-button
      >
    </div>

    <el-row type="flex" justify="center" style="margin-top: 24px">
      <el-button
        type="primary"
        :loading="finishLoading"
        :clstag="clstag('', 'sandboxDebugging_1654841119615|4')"
        @click="onClickFinish"
        >完 成</el-button
      >
    </el-row>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";
import buriedPoint from "@/mixins/buriedPoint.js";
import { mapState } from "vuex";
import lcp from "@/api/extranet/lcp/index.js";

export default {
  name: "StepSearch",
  components: { Title },
  mixins: [buriedPoint],
  props: {
    waybillCode: { type: String, required: true },
    active: { type: Number, required: true },
  },
  data() {
    return {
      logisticsInfo: { waybillCode: "", recipient: "", address: "" },
      logisticsInfoList: [
        { label: "运单号", prop: "waybillCode", span: 12 },
        { label: "收件人", prop: "recipient", span: 12 },
        { label: "收件地址", prop: "address", span: 24 },
      ],
      trackList: [],
      finishLoading: false,
      finishDebounceTimer: null,
      refreshLoading: false,
      refreshDebounceTimer: null,
    };
  },
  filters: {
    formatOperateTimeText(operateTime) {
      return operateTime ? new Date(operateTime).toLocaleString() : "-";
    },
  },
  computed: { ...mapState("sandboxDebugging", ["sandboxDebuggingTableData"]) },
  methods: {
    // 沙箱联调-业务联调-轨迹查询
    async trackQuery() {
      const { waybillCode, sandboxDebuggingTableData } = this;
      const { scene } = this.$route.params;
      const { bizCode, sceneName } = sandboxDebuggingTableData.find(
        (item) => item.scene === scene
      );
      const params = { waybillCode, bizCode, sceneName };
      return await lcp.sandbox.trackQuery(params).catch((error) => {
        throw new Error(`trackQuery, ${error}`);
      });
    },

    async handleTrackQuery() {
      const {
        data: { recipient = "", address = "", trackList = [] },
      } = await this.trackQuery().catch((error) => {
        throw new Error(`handleTrackQuery, ${error}`);
      });
      const { waybillCode = "" } = this;
      this.logisticsInfo = { waybillCode, recipient, address };
      this.trackList = trackList;
    },
    onClickFinish() {
      clearTimeout(this.finishDebounceTimer);
      this.finishDebounceTimer = setTimeout(() => {
        this.finishLoading = true;
        this.$emit("update:active", this.active + 1);
        this.finishLoading = false;
      }, 300);
    },
    onClickRefreshButton() {
      clearTimeout(this.refreshDebounceTimer);
      this.refreshDebounceTimer = setTimeout(async () => {
        this.refreshLoading = true;
        await this.handleTrackQuery().catch((error) => {
          this.refreshLoading = false;
          throw new Error(`onClickRefreshButton, ${error}`);
        });
        this.refreshLoading = false;
      }, 300);
    },
  },
  async created() {
    await this.handleTrackQuery().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.step-search {
  margin: 0 auto;
  width: 800px;

  .title {
    margin: 26px 0 16px 0;
  }

  .logistics-info-form {
    .el-form-item {
      margin-bottom: 0px;
    }
  }

  .el-divider--horizontal {
    margin-top: 16px;
  }

  .step-search__track-wrapper {
    position: relative;
    min-height: 24px;

    .track-wrapper__track {
      margin: 8px 0;
      padding-right: 80px;

      .track__operate-time {
        min-width: 160px;
        color: #999;
      }

      .track__operate-message {
        color: #666;
      }
    }

    .track-wrapper__refresh {
      position: absolute;
      top: -6px;
      right: 0;
      vertical-align: baseline;
    }
  }
}
</style>