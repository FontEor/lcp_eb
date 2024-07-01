<template>
  <div class="text-style">
    <div class="header_contain">
      <img class="header_img" src="@/assets/sandbox/iconHeader.png" alt="" />
      <span class="header_span">运单信息</span>
    </div>
    <div class="common-info-contain-info-other">
      <!-- <p class="common-info-contain-info-other-p">
        请输入沙箱环境调用快递<a
          href="https://cloud.jdl.com/#/open-business-document/api-doc/267/841"
          >下单接口</a
        >后获取的单号用于后续业务联调
      </p>
      <p class="common-info-contain-info-other-p p-text-style">
        注：每组单号仅能输入一次，单号重置后无法再次填入
      </p> -->
      <div class="waybill-order-info">
        <span>运单号：{{ wayBillCode }}</span>
        <span class="waybill-order-info_span">订单号：{{ orderCode }}</span>
      </div>
      <el-button
        class="waybill-order-reset"
        type="primary"
        plain
        @click="resetWaybill"
        :clstag="clstag('','SandBoxTool_1693313320392|10')"
        >重置运单</el-button
      >
    </div>
    <div class="header_contain">
      <img class="header_img" src="@/assets/sandbox/iconHeader.png" alt="" />
      <span class="header_span">分拣验货</span>
    </div>
    <div class="common-info-contain-info-other">
      <p class="common-info-contain-info-other-p">
        分拣中心收货：分拣中心A已收箱，箱号BC12345678901234567890
      </p>
      <p class="common-info-contain-info-other-p">
        分拣验货：分拣中心A已验货，箱号
      </p>
      <p class="common-info-contain-info-other-p">
        包裹称重：包裹称重，长宽高：XX.XXCM*XX.XXCM*X.XXCM
      </p>
      <p class="common-info-contain-info-other-p">包裹称重：重量是X.XXKG</p>
      <p class="common-info-contain-info-other-p">
        复重抽查：重量体积抽检：重量X.XXkg，体积XXXX.X立方厘米
      </p>
    </div>
  </div>
</template>

<script>
import sandboxStore from "@/store/national/extranet/modules/sandbox";
import basicInfo from "@/api/extranet/sandbox/index.js";
import pageClick from "@/utils/pageClick.js";

export default {
  name: "sortingInspection",
  components: {},
  data() {
    return {};
  },
  computed: {
    wayBillCode() {
      return sandboxStore.state.wayBillCode;
    },
    orderCode() {
      return sandboxStore.state.orderCode;
    },
  },
  created() {},
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    resetWaybill() {
      this.$confirm(
        `请确认是否清空运单${this.wayBillCode}的沙箱联调信息？（清空后才可输入新的运单号进行联调）`,
        "重置运单提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          await this.cancelBindByWayBillCode();
          await this.$parent.findBySceneCode();
          this.$message({
            type: "success",
            message: "重置成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 商家控制台-解绑运单号
    async cancelBindByWayBillCode() {
      const data = {
        wayBillCode: this.wayBillCode, //"abc"
      };
      await basicInfo
        .cancelBindByWayBillCode(data)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          throw new Error(error, "cancelBindByWayBillCode");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.text-style {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
}
.header_contain {
  display: flex;
  align-items: center;
  // width: 120px;
  height: 16px;
  margin-bottom: 16px;
  .header_img {
    width: 12px;
    height: 14px;
    background: linear-gradient(
      130.13deg,
      rgba(60, 110, 240, 1) 0%,
      rgba(88, 134, 255, 1) 100%
    );
    border-radius: 2px;
    margin-right: 8px;
  }
  .header_span {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
  }
}
.common-info-contain-info-other {
  margin-top: 16px;
  .common-info-contain-info-other-p {
    // height: 32px;
    line-height: 32px;
  }
  .p-text-style {
    color: rgba(255, 9, 9, 1);
  }
  .waybill-order-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    margin: 16px auto;
    color: rgba(102, 102, 102, 1);
    .waybill-order-info_span {
      padding-right: 37%;
    }
  }
  .waybill-order-reset {
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(60, 110, 240, 1);
    border-radius: 4px;
    color: rgba(60, 110, 240, 1);
  }
}
</style>
