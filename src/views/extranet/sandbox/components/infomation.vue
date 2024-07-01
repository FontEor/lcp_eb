<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="B2C开发信息" name="first">
      <div class="common-info-contain-title">应用信息</div>
      <div class="common-info-contain-info common-info-contain-info-other">
        <span class="common-info-contain-info-key">AppKey：</span>
        <span>{{ appKey }}</span>
        <el-tooltip content="复制AppKey" effect="dark" placement="top">
          <el-button
            v-clipboard="appKey"
            v-clipboard:success="onCopySuccess"
            type="text"
            class="el-icon-document-copy"
          />
        </el-tooltip>
      </div>
      <div class="common-info-contain-info">
        <span class="common-info-contain-info-key">AppSecret：</span>
        <span v-if="appSecretVisible">
          <span>{{ appSecretText }}</span>
          <el-tooltip content="复制AppSecret" effect="dark" placement="top">
            <el-button
              v-clipboard="appSecretText"
              v-clipboard:success="onCopySuccess"
              type="text"
              style="margin-left: 4px"
              class="el-icon-document-copy"
            />
          </el-tooltip>
          <el-button type="text" @click="onClickViewAppSecretButton(false)"
            >隐藏</el-button
          >
        </span>
        <el-button v-else type="text" @click="onClickViewAppSecretButton(true)"
          >查看</el-button
        >
      </div>

      <div class="common-info-contain-title common-info-contain-info-other">
        调用信息
      </div>
      <div class="common-info-contain-info common-info-contain-info-other">
        <span class="common-info-contain-info-key">沙箱环境调用地址：</span>
        <span>https://test-api.jdl.com</span>
      </div>
      <div class="common-info-contain-info">
        <span class="common-info-contain-info-key">AccessToken：</span>
        <span>{{ AccessToken }}</span>
        <el-tooltip content="复制AccessToken" effect="dark" placement="top">
          <el-button
            v-clipboard="AccessToken"
            v-clipboard:success="onCopySuccess"
            type="text"
            class="el-icon-document-copy"
          />
        </el-tooltip>
      </div>
      <div class="common-info-contain-info">
        <span class="common-info-contain-info-key">customerCode：</span>
        <span>{{ customerCode }}</span>
        <el-tooltip content="复制customerCode" effect="dark" placement="top">
          <el-button
            v-clipboard="customerCode"
            v-clipboard:success="onCopySuccess"
            type="text"
            class="el-icon-document-copy"
          />
        </el-tooltip>
      </div>
      <div class="common-info-contain-info">
        <span class="common-info-contain-info-key">LOP-DN：</span>
        <span>{{ LOPDN }}</span>
        <el-tooltip content="复制LOP-DN" effect="dark" placement="top">
          <el-button
            v-clipboard="LOPDN"
            v-clipboard:success="onCopySuccess"
            type="text"
            class="el-icon-document-copy"
          />
        </el-tooltip>
        <el-tooltip
          content="非SDK调用接口时使用此参数"
          effect="dark"
          placement="top"
        >
          <el-button type="text" class="el-icon-warning" />
        </el-tooltip>
      </div>
      <div
        class="common-info-contain-title common-info-contain-info-other logistics-track-push"
      >
        物流轨迹推送
        <el-switch v-model="isPush" @change="handleSwitchChange" :clstag="clstag('','SandBoxTool_1693313320392|9')"> </el-switch>
      </div>
      <div
        v-if="isPush"
        class="common-info-contain-info-other logistics-track-push-edit-contain"
      >
        <el-form
          label-position="left"
          ref="form"
          :model="form"
          label-width="250px"
        >
          <el-form-item
            v-for="(item, index) in form.bizApiDtoList"
            :key="index"
            :prop="`bizApiDtoList[${index}].callBackUrl`"
            :rules="{
              required: true,
              message: '请输入沙箱回调地址',
              trigger: 'blur',
            }"
          >
            <template #label>
              <a
                href="https://cloud.jdl.com/#/open-business-document/api-doc/267/1033"
                target="_blank"
                >{{ item.apiName }}</a
              >沙箱回调地址：
            </template>
            <el-input
              v-if="editable"
              v-model="item.callBackUrl"
              placeholder="请输入地址链接"
            ></el-input>
            <span v-else>{{ item.callBackUrl || "未填写" }}</span>
          </el-form-item>
        </el-form>
        <div v-if="form.bizApiDtoList.length">
          <div class="button_style" v-if="editable">
            <el-button @click="onClickCancelButton">取消</el-button>
            <el-button type="primary" @click="onClickSaveButton('form')"
              >保存</el-button
            >
          </div>
          <div class="button_style" v-else>
            <el-button type="primary" @click="onClickEditButton"
              >编辑</el-button
            >
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="C2C开发信息" name="second">
      <div class="common-info-contain-title">应用信息</div>
      <div class="common-info-contain-info common-info-contain-info-other">
        <span class="common-info-contain-info-key">AppKey：</span>
        <span>{{ c2cAppKey }}</span>
        <el-tooltip content="复制AppKey" effect="dark" placement="top">
          <el-button
            v-clipboard="c2cAppKey"
            v-clipboard:success="onCopySuccess"
            type="text"
            class="el-icon-document-copy"
          />
        </el-tooltip>
      </div>
      <div class="common-info-contain-info">
        <span class="common-info-contain-info-key">AppSecret：</span>
        <span v-if="appSecretVisible">
          <span>{{ c2cAppSecretText }}</span>
          <el-tooltip content="复制AppSecret" effect="dark" placement="top">
            <el-button
              v-clipboard="c2cAppSecretText"
              v-clipboard:success="onCopySuccess"
              type="text"
              style="margin-left: 4px"
              class="el-icon-document-copy"
            />
          </el-tooltip>
          <el-button type="text" @click="onClickViewAppSecretButton(false)"
            >隐藏</el-button
          >
        </span>
        <el-button v-else type="text" @click="onClickViewAppSecretButton(true)"
          >查看</el-button
        >
      </div>

      <div class="common-info-contain-title common-info-contain-info-other">
        调用信息
      </div>
      <div class="common-info-contain-info common-info-contain-info-other">
        <span class="common-info-contain-info-key">沙箱环境调用地址：</span>
        <span>https://test-api.jdl.com</span>
      </div>
      <div class="common-info-contain-info">
        <span class="common-info-contain-info-key">LOP-DN：</span>
        <span>{{ LOPDN }}</span>
        <el-tooltip content="复制LOP-DN" effect="dark" placement="top">
          <el-button
            v-clipboard="LOPDN"
            v-clipboard:success="onCopySuccess"
            type="text"
            class="el-icon-document-copy"
          />
        </el-tooltip>
        <el-tooltip
          content="非SDK调用接口时使用此参数"
          effect="dark"
          placement="top"
        >
          <el-button type="text" class="el-icon-warning" />
        </el-tooltip>
      </div>
      <div
        class="common-info-contain-title common-info-contain-info-other logistics-track-push"
      >
        物流轨迹推送
        <el-switch v-model="isPush" @change="handleSwitchChange" :clstag="clstag('','SandBoxTool_1693313320392|9')"> </el-switch>
      </div>
      <div
        v-if="isPush"
        class="common-info-contain-info-other logistics-track-push-edit-contain"
      >
        <el-form
          label-position="left"
          ref="form"
          :model="form"
          label-width="250px"
        >
          <el-form-item
            v-for="(item, index) in form.bizApiDtoList"
            :key="index"
            :prop="`bizApiDtoList[${index}].callBackUrl`"
            :rules="{
              required: true,
              message: '请输入沙箱回调地址',
              trigger: 'blur',
            }"
          >
            <template #label>
              <a
                href="https://cloud.jdl.com/#/open-business-document/api-doc/267/1033"
                target="_blank"
                >{{ item.apiName }}</a
              >沙箱回调地址：
            </template>
            <el-input
              v-if="editable"
              v-model="item.callBackUrl"
              placeholder="请输入地址链接"
            ></el-input>
            <span v-else>{{ item.callBackUrl || "未填写" }}</span>
          </el-form-item>
        </el-form>
        <div v-if="form.bizApiDtoList.length">
          <div class="button_style" v-if="editable">
            <el-button @click="onClickCancelButton">取消</el-button>
            <el-button type="primary" @click="onClickSaveButton('form')"
              >保存</el-button
            >
          </div>
          <div class="button_style" v-else>
            <el-button type="primary" @click="onClickEditButton"
              >编辑</el-button
            >
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="联调信息" name="third">
      <!-- 商家下单 -->
      <merchant-order-info
        v-if="nodeCode === 'merchantOrder'"
      ></merchant-order-info>
      <!-- 揽收任务分配 -->
      <collection-tasks-info
        v-else-if="nodeCode === 'receiveTaskAssignment'"
      ></collection-tasks-info>
      <!-- 终止揽收 -->
      <terminate-solicitation-info
        v-else-if="nodeCode === 'terminationOfCollection'"
      ></terminate-solicitation-info>
      <!-- 揽收完成 -->
      <collection-completed-info
        v-else-if="nodeCode === 'collectionCompleted'"
      ></collection-completed-info>
      <!-- 上门接货退货完成 -->
      <return-completed-info
        v-else-if="nodeCode === 'pickupAndReturnCompleted'"
      ></return-completed-info>
      <!-- 站点发货 -->
      <site-delivery-info
        v-else-if="nodeCode === 'siteDelivery'"
      ></site-delivery-info>
      <!-- 分拣验货 -->
      <sorting-inspection-info
        v-else-if="nodeCode === 'sortAndInspectGoods'"
      ></sorting-inspection-info>
      <!-- 分拣发货 -->
      <sorting-shipping-info
        v-else-if="nodeCode === 'sortingAndShipping'"
      ></sorting-shipping-info>
      <!-- 站点验货 -->
      <site-inspection-info
        v-else-if="nodeCode === 'siteInspection'"
      ></site-inspection-info>
      <!-- 派件 -->
      <dispatch-vue-info
        v-else-if="nodeCode === 'delivery'"
      ></dispatch-vue-info>
      <!-- 妥投 -->
      <duly-delivered-info
        v-else-if="nodeCode === 'dulyDelivered'"
      ></duly-delivered-info>
      <!-- 发起协商再投 -->
      <negotiate-before-investing-info
        v-else-if="nodeCode === 'negotiatedResubmission'"
      ></negotiate-before-investing-info>
      <!-- 站点再投 -->
      <site-resubmission-info
        v-else-if="nodeCode === 'siteReprojection'"
      ></site-resubmission-info>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import sandboxStore from "@/store/national/extranet/modules/sandbox";
import store from "@/store/national/index.js";
import Cookies from "js-cookie";
import basicInfo from "@/api/extranet/sandbox/index.js";
import merchantOrderInfo from "./infoComponents/merchantOrderInfo.vue";
import collectionTasksInfo from "./infoComponents/collectionTaskInfo.vue";
import collectionCompletedInfo from "./infoComponents/collectionCompletedInfo.vue";
import terminateSolicitationInfo from "./infoComponents/terminateSolicitationInfo.vue";
import returnCompletedInfo from "./infoComponents/returnCompletedInfo.vue";
import siteDeliveryInfo from "./infoComponents/siteDeliveryInfo.vue";
import sortingInspectionInfo from "./infoComponents/sortingAndInspectionInfo.vue";
import sortingShippingInfo from "./infoComponents/sortingAndShippingInfo.vue";
import siteInspectionInfo from "./infoComponents/siteInspectionInfo.vue";
import dispatchVueInfo from "./infoComponents/dispatchInfo.vue";
import negotiateBeforeInvestingInfo from "./infoComponents/initiateNegotiationReinvestInfo.vue";
import siteResubmissionInfo from "./infoComponents/siteResubmissionInfo.vue";
import dulyDeliveredInfo from "./infoComponents/dulyDeliveredInfo.vue";
import pageClick from "@/utils/pageClick.js";

export default {
  components: {
    merchantOrderInfo,
    collectionTasksInfo,
    collectionCompletedInfo,
    terminateSolicitationInfo,
    returnCompletedInfo,
    siteDeliveryInfo,
    sortingInspectionInfo,
    sortingShippingInfo,
    siteInspectionInfo,
    dispatchVueInfo,
    negotiateBeforeInvestingInfo,
    siteResubmissionInfo,
    dulyDeliveredInfo,
  },
  data() {
    return {
      appKey: "62d07644754843cc882fca7c01476c4f",
      appSecretText: "0c2c8b6b7c10481ea639f6daa09ac02e",
      appSecretVisible: false,
      AccessToken: "78c246c0ab564e67add6296a9eaf04a1",
      customerCode: "27K1234912",
      LOPDN: "ECAP",
      c2cAppKey: "1ba0d4a0750b46ca8788db40b8dc31d4",
      c2cAppSecretText: "eae09039d8aa46fd858063472efb9af3",
      isPush: false,
      editable: false,
      sceneCode: sandboxStore.state.sandboxTableData["code"],
      unitCode: sandboxStore.state.sandboxTableData["unitCode"],
      user_pin: store.getters.user_pin,
      form: {
        bizApiDtoList: [
          // {
          //   apiName: "物流轨迹推送",
          //   apiUrl: "test-cloud.jdl.com",
          //   callBackUrl: "",
          //   unitCode: "testtestliuliu",
          // },
        ],
      },
    };
  },
  props: {},
  computed: {
    nodeCode() {
      return sandboxStore.state.nodeCode;
    },
    activeName: {
      get() {
        return sandboxStore.state.nodeCode === "merchantOrder"
          ? "first"
          : "third";
      },
      set(tab) {
        console.log(tab); // 触发父组件的更新事件
      },
    },
  },
  watch: {},
  created() {
    this.findIsOpen();
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    async handleSwitchChange(val) {
      if (val) {
        await this.findInnerCallOuter();
        await this.saveCallBackUrl();
      } else {
        this.saveCallBackUrl(false);
      }
    },
    // 商家控制台-查询对接方案下面所以内调外接口-TODO:待测试
    async findInnerCallOuter() {
      const data = {
        unitCode: this.unitCode, //"ss_http",//this.unitCode,
        bindIdaasPin: this.user_pin, //"zhangqingfeng14",//this.user_pin,
        bindSupplierCode: Cookies.get("groupCode"), // "suppliercode1",//Cookies.get("groupCode"),
        sceneCode: this.sceneCode, //'sandbox_kuaidi',//this.sceneCode,
      };
      await basicInfo
        .findInnerCallOuter(data)
        .then((res) => {
          if (res.length) {
            this.form.bizApiDtoList = res;
          }
        })
        .catch((error) => {
          throw new Error(error, "findInnerCallOuter");
        });
    },
    // 商家控制台-查看是否开启
    async findIsOpen() {
      const data = {
        sceneCode: this.sceneCode,
        unitCode: this.unitCode,
        bindIdaasPin: this.user_pin,
        bindSupplierCode: Cookies.get("groupCode"),
      };
      await basicInfo
        .findIsOpen(data)
        .then((res) => {
          this.isPush = res;
          if (this.isPush) {
            this.findInnerCallOuter();
          }
        })
        .catch((error) => {
          throw new Error(error, "findIsOpen");
        });
    },
    // 商家控制台-保存回调地址
    async saveCallBackUrl(openEnable = true) {
      const data = {
        sceneCode: this.sceneCode,
        unitCode: this.unitCode,
        bizApiDtoList: this.form.bizApiDtoList,
        bindIdaasPin: this.user_pin,
        bindSupplierCode: Cookies.get("groupCode"),
        openEnable: openEnable,
      };
      await basicInfo
        .saveCallBackUrl(data)
        .then((res) => {
          console.log("保存成功！");
          // this.$message.success("保存成功！");
        })
        .catch((error) => {
          throw new Error(error, "saveCallBackUrl");
        });
    },
    onCopySuccess() {
      this.$message.success("复制成功！");
    },
    async onClickViewAppSecretButton(value = true) {
      if (!value) {
        this.appSecretVisible = value;
        return;
      }
      this.appSecretVisible = value;
    },
    onClickCancelButton() {
      this.$refs["form"].resetFields();
      this.editable = false;
    },
    onClickSaveButton(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.editable = false;
          // console.log(this.form)
          await this.saveCallBackUrl();
          await this.findInnerCallOuter();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onClickEditButton() {
      this.editable = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.common-info-contain-title {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}
.common-info-contain-info {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  .common-info-contain-info-key {
    color: rgba(102, 102, 102, 1);
  }
}
.common-info-contain-info-other {
  margin-top: 16px;
}

.logistics-track-push-edit-contain {
  margin-right: 16px;
}

.logistics-track-push {
  margin-top: 5px;
}

.button_style {
  text-align: right;
}

::v-deep .el-tabs__nav {
  margin-left: 16px;
}
::v-deep .el-tabs__content {
  padding-left: 16px;
}
::v-deep .el-tab-pane {
  height: 415px;
  overflow: auto;
}

::v-deep .el-tab-pane::-webkit-scrollbar {
  width: 4px;
}

::v-deep .el-tab-pane::-webkit-scrollbar-thumb {
  height: 20px;
  background: rgba(35, 37, 43, 1);
  border-radius: 3px;
  opacity: 30;
}

::v-deep .el-form-item {
  margin-bottom: 16px;
}
</style>
