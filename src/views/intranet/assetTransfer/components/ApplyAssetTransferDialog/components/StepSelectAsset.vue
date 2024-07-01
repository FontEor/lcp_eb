<template>
  <section class="step-select-asset">
    <el-transfer
      v-loading="transferLoading"
      class="step-select-asset__transfer"
      ref="stepSelectAssetTransfer"
      :filter-placeholder="computePlaceholder"
      :value="selectAssetData"
      :data="transferData"
      :titles="titleList"
      :props="transferProps"
      :filterable="true"
      :filter-method="filterMethod"
      :render-content="renderContent"
      @input="($event) => $emit('update:selectAssetData', $event)"
      @change="onChangeSelectAssetData"
    >
      <template #left-footer>
        <el-select
          v-model="assetBizType"
          class="transfer-footer__select"
          style="width: 190px"
          @change="onChangeAssetBizType"
        >
          <el-option
            v-for="{ label, value } in computeAssetBizTypeOptionList"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </template>
    </el-transfer>
  </section>
</template>

<script>
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "StepSelectAsset",
  props: {
    selectAssetData: { type: Array, required: true },
    transferData: { type: Array, required: true },
    transferType: { type: Number, required: true },
  },
  data() {
    return {
      transferLoading: true,
      titleList: ["当前用户负责的资产清单", "已选择的资产清单"],
      assetBizType: null,
      customFilter: false,
      transferProps: {
        key: "customId",
        label: "assetName",
      },
    };
  },
  computed: {
    computePlaceholder(){
      const { transferType } = this;
      const hashMap = new Map()
        .set(1, "请输入方案/API/API分组中文名称/回传API")
        .set(2, "请输入方案/API/API分组中文名称/消息");
      return hashMap.get(transferType) || [];
    },
    computeAssetBizTypeList() {
      const { transferType } = this;
      const erpAssetBizTypeList = [
        { label: "对接方案", value: 102 },
        { label: "API分组-外部调用京东", value: 232 },
        { label: "API-HTTP协议API", value: 231 },
        { label: "API-JSF服务API", value: 242 },
        { label: "API-回传API", value: 243 },
      ];
      const teamAssetBizTypeList = [
        { label: "对接方案", value: 102 },
        { label: "API分组-外部调用京东", value: 232 },
        { label: "内网应用", value: 103 },
        { label: "API-JSF服务API", value: 242 },
        { label: "消息", value: 244 },
      ];
      const hashMap = new Map()
        .set(1, erpAssetBizTypeList)
        .set(2, teamAssetBizTypeList);
      return hashMap.get(transferType) || [];
    },
    computeAssetBizTypeOptionList() {
      const { computeAssetBizTypeList } = this;
      return [{ label: "全部", value: null }, ...computeAssetBizTypeList];
    },
  },
  methods: {
    // 根据资产维度查询待交接资产列表数据
    async queryAssetList() {
      const { transferType } = this;
      const assetBelong = transferType;
      const data = { assetBelong };
      return await lcp.asset.queryAssetList(data).catch((error) => {
        throw new Error(`queryAssetList, ${error}`);
      });
    },

    async handleQueryAssetList() {
      const { selectAssetData } = this;
      this.transferLoading = true;
      const {
        data: { list = [] },
      } = await this.queryAssetList().catch((error) => {
        throw new Error(`handleQueryAssetList, ${error}`);
      });
      const sourceTransferData = list instanceof Array ? list : [];
      const transferData = sourceTransferData.map(
        ({ id, assetBizType, assetName, assetDesc, owner, locked }) => {
          const assetId = id;
          const customId = `${assetBizType}-${id}`;
          const onRight = selectAssetData.includes(customId);
          const disabled = Boolean(locked);
          return {
            assetId,
            assetBizType,
            assetName,
            assetDesc,
            owner,
            customId,
            onRight,
            disabled,
          };
        }
      );
      this.$emit("update:transferData", transferData);
      this.transferLoading = false;
    },

    filterMethod(query, item) {
      const { customFilter, assetBizType } = this;
      const { onRight } = item;
      const judgeOwnerAndAssetNameQuery =
        item.owner.indexOf(query) > -1 || item.assetName.indexOf(query) > -1;
      return customFilter
        ? onRight
          ? judgeOwnerAndAssetNameQuery
          : item.assetBizType === assetBizType && judgeOwnerAndAssetNameQuery
        : judgeOwnerAndAssetNameQuery;
    },
    renderContent(h, option) {
      const { assetBizType, assetName, owner } = option;
      const { computeAssetBizTypeList } = this;
      const assetBizName =
        computeAssetBizTypeList.find(({ value }) => value === assetBizType)
          .label || "";
      return (
        <span>
          【{assetBizName}】{owner} - {assetName}
        </span>
      );
    },
    onChangeAssetBizType(value) {
      // 若资产类型选项不为”全部“，则开启自定过滤规则
      this.customFilter = Boolean(value);
    },
    onChangeSelectAssetData(_, direction, movedKeyList) {
      const { transferData } = this;
      transferData.some((item) => {
        const { customId } = item;
        const movedKeyIndex = movedKeyList.findIndex(
          (item) => item === customId
        );
        if (movedKeyIndex > -1) {
          item.onRight = direction === "right";
          movedKeyList.splice(movedKeyIndex, 1);
          return movedKeyList.length === 0;
        }
      });
    },
  },
  async created() {
    await this.handleQueryAssetList().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.step-select-asset {
  .step-select-asset__transfer {
    display: flex;
    justify-content: center;
    align-items: center;

    ::v-deep .el-transfer-panel {
      width: 560px;

      .el-transfer-panel__body {
        .el-transfer-panel__item {
          display: inline-block !important;
        }
      }

      &:nth-child(1) {
        .el-transfer-panel__body {
          .el-input {
            display: flex;
            justify-content: flex-end;

            .el-input__inner {
              width: 320px;
            }
          }
        }

        .el-transfer-panel__footer {
          position: static;
          height: 0;
          border-top: none;

          .transfer-footer__select {
            position: absolute;
            top: 52px;
            left: 8px;
          }
        }
      }
    }

    ::v-deep .el-transfer__buttons {
      display: flex;
      flex-direction: column;

      .el-button {
        &:nth-last-child(1) {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
