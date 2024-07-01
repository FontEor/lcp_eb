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
      <span class="header_span">揽收任务分配</span>
    </div>
    <div class="common-info-contain-info-other">
      <p class="common-info-contain-info-other-p">
        模拟快递员揽收是对包裹的称重量方
      </p>
      <p class="common-info-contain-info-other-p p-text-style">
        注：此处仅模拟，输入数据与后续接口调用无关
      </p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="包裹高" prop="heightInfo">
              <el-input
                v-model.trim="ruleForm.heightInfo"
                placeholder="请输入包裹高"
                disabled
              >
                <template slot="append">cm</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包裹长" prop="lengthInfo">
              <el-input
                v-model.trim="ruleForm.lengthInfo"
                placeholder="请输入包裹长"
                disabled
                ><template slot="append">cm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="包裹宽" prop="widthInfo">
              <el-input
                v-model.trim="ruleForm.widthInfo"
                placeholder="请输入包裹宽"
                disabled
                ><template slot="append">cm</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包裹数量" prop="countInfo">
              <el-input
                v-model.trim="ruleForm.countInfo"
                placeholder="请输入包裹数量"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="重量" prop="weightInfo">
              <el-input
                v-model.trim="ruleForm.weightInfo"
                placeholder="请输入重量"
                disabled
                ><template slot="append">kg</template></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物品类型" prop="typeInfo">
              <el-input
                v-model.trim="ruleForm.typeInfo"
                placeholder="请输入物品类型"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import sandboxStore from "@/store/national/extranet/modules/sandbox";
import basicInfo from "@/api/extranet/sandbox/index.js";
import pageClick from "@/utils/pageClick.js";

export default {
  name: "collectionTasks",
  components: {},
  data() {
    return {
      ruleForm: {
        heightInfo: "23",
        lengthInfo: "23",
        widthInfo: "23",
        countInfo: "1",
        weightInfo: "1",
        typeInfo: "文件",
      },
      rules: {
        heightInfo: [
          { required: true, message: "请输入包裹高", trigger: "blur" },
        ],
        lengthInfo: [
          { required: true, message: "请输入包裹长", trigger: "blur" },
        ],
        widthInfo: [
          { required: true, message: "请输入包裹宽", trigger: "blur" },
        ],
        countInfo: [
          { required: true, message: "请输入包裹数量", trigger: "blur" },
        ],
        weightInfo: [
          { required: true, message: "请输入重量", trigger: "blur" },
        ],
        typeInfo: [
          { required: true, message: "请输入物品类型", trigger: "blur" },
        ],
      },
    };
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
