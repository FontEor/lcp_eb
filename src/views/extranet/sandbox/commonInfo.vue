<template>
  <div v-loading="loading">
    <div class="tit-view">
      <h2 class="big-tit">{{ name }}</h2>
      <p class="tip">
        {{ remark }}
      </p>
    </div>
    <div class="my-tabs">
      <div class="header_contain">
        <img class="header_img" src="@/assets/sandbox/iconHeader.png" alt />
        <span class="header_span">{{ currentProcess.processName }} 联调</span>
      </div>
      <div class="my-tabs-flow-contain">
        <flowchart
          v-if="currentProcess != null"
          :currentProcess="currentProcess"
          @change="changeFlowchart"
        ></flowchart>
      </div>
      <div class="my-tabs-commonInfo">
        <div class="my-tabs-commonInfo-left">
          <!-- 商家下单 -->
          <merchant-order
            ref="merchantOrder"
            v-if="nodeCode === 'merchantOrder'"
          ></merchant-order>
          <!-- 揽收任务分配 -->
          <collection-tasks
            v-else-if="nodeCode === 'receiveTaskAssignment'"
          ></collection-tasks>
          <!-- 终止揽收 -->
          <terminate-solicitation
            v-else-if="nodeCode === 'terminationOfCollection'"
          ></terminate-solicitation>
          <!-- 揽收完成 -->
          <collection-completed
            v-else-if="nodeCode === 'collectionCompleted'"
          ></collection-completed>
          <!-- 上门接货退货完成 -->
          <return-completed
            v-else-if="nodeCode === 'pickupAndReturnCompleted'"
          ></return-completed>
          <!-- 站点发货 -->
          <site-delivery
            v-else-if="nodeCode === 'siteDelivery'"
          ></site-delivery>
          <!-- 分拣验货 -->
          <sorting-inspection
            v-else-if="nodeCode === 'sortAndInspectGoods'"
          ></sorting-inspection>
          <!-- 分拣发货 -->
          <sorting-shipping
            v-else-if="nodeCode === 'sortingAndShipping'"
          ></sorting-shipping>
          <!-- 站点验货 -->
          <site-inspection
            v-else-if="nodeCode === 'siteInspection'"
          ></site-inspection>
          <!-- 派件 -->
          <dispatch-vue v-else-if="nodeCode === 'delivery'"></dispatch-vue>
          <!-- 妥投 -->
          <duly-delivered
            v-else-if="nodeCode === 'dulyDelivered'"
          ></duly-delivered>
          <!-- 发起协商再投 -->
          <negotiate-before-investing
            v-else-if="nodeCode === 'negotiatedResubmission'"
          ></negotiate-before-investing>
          <!-- 站点再投 -->
          <site-resubmission
            v-else-if="nodeCode === 'siteReprojection'"
          ></site-resubmission>
        </div>
        <div class="my-tabs-commonInfo-right">
          <information :nodeCode="nodeCode"></information>
        </div>
      </div>
    </div>
    <div class="footer-contain">
      <div class="footer-contain_button">
        <el-button @click="resetWaybill" :clstag="clstag('','SandBoxTool_1693313320392|11')">退出联调</el-button>
        <el-button
          v-for="item in prevButtons"
          :key="item.id"
          @click="handlePrev(item)"
          :disabled="nodeCode === 'receiveTaskAssignment'"
          >上一步：{{ item.store.data.node_name }}</el-button
        >
        <el-button
          type="primary"
          v-for="item in nextButtons"
          :key="item.id"
          @click="handleNext(item)"
          :clstag="clstag('',btnClstags[item.store.data.node_code])"
          >下一步：{{ item.store.data.node_name }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import sandboxStore from "@/store/national/extranet/modules/sandbox";
import store from "@/store/national/index.js";
import basicInfo from "@/api/extranet/sandbox/index.js";
import Cookies from "js-cookie";
import information from "./components/infomation.vue";
import flowchart from "./components/flowComponents/flowchart.vue";
import merchantOrder from "./components/flowComponents/merchantOrder.vue";
import collectionTasks from "./components/flowComponents/collectionTasks.vue";
import collectionCompleted from "./components/flowComponents/collectionCompleted.vue";
import terminateSolicitation from "./components/flowComponents/terminateSolicitation.vue";
import returnCompleted from "./components/flowComponents/returnCompleted.vue";
import siteDelivery from "./components/flowComponents/siteDelivery.vue";
import sortingInspection from "./components/flowComponents/sortingInspection.vue";
import sortingShipping from "./components/flowComponents/sortingShipping.vue";
import siteInspection from "./components/flowComponents/siteInspection.vue";
import dispatchVue from "./components/flowComponents/dispatch.vue";
import negotiateBeforeInvesting from "./components/flowComponents/negotiateBeforeInvesting.vue";
import siteResubmission from "./components/flowComponents/siteResubmission.vue";
import dulyDelivered from "./components/flowComponents/dulyDelivered.vue";
import pageClick from "@/utils/pageClick.js";

export default {
  components: {
    information,
    flowchart,
    merchantOrder,
    collectionTasks,
    collectionCompleted,
    terminateSolicitation,
    returnCompleted,
    siteDelivery,
    sortingInspection,
    sortingShipping,
    siteInspection,
    dispatchVue,
    negotiateBeforeInvesting,
    siteResubmission,
    dulyDelivered,
  },
  mixins: [],
  data() {
    return {
      name: sandboxStore.state.sandboxTableData["name"],
      remark: sandboxStore.state.sandboxTableData["remark"],
      sceneCode: sandboxStore.state.sandboxTableData["code"],
      unitCode: sandboxStore.state.sandboxTableData["unitCode"],
      user_pin: store.getters.user_pin,
      processCode: this.$route.query.process,
      currentProcess: {},
      flowData: [],
      nextButtons: [],
      prevButtons: [],
      currentNode: {},
      loading: false,
      btnClstags: {
        'receiveTaskAssignment' : 'SandBoxTool_1693313320392|12', 
        'terminationOfCollection' : 'SandBoxTool_1693313320392|13',
        'collectionCompleted' : 'SandBoxTool_1693313320392|14',
        'pickupAndReturnCompleted' : 'SandBoxTool_1693313320392|15',
        'siteDelivery' : 'SandBoxTool_1693313320392|16',
        'sortAndInspectGoods' : 'SandBoxTool_1693313320392|17',
        'sortingAndShipping' : 'SandBoxTool_1693313320392|18',
        'siteInspection' : 'SandBoxTool_1693313320392|19',
        'delivery' : 'SandBoxTool_1693313320392|20',
        'negotiatedResubmission' : 'SandBoxTool_1693313320392|21',
        'siteReprojection' : 'SandBoxTool_1693313320392|22',
        'dulyDelivered' : 'SandBoxTool_1693313320392|23',
      },
    };
  },
  computed: {
    nodeCode: () => sandboxStore.state.nodeCode,
    wayBillCode: () => sandboxStore.state.wayBillCode,
    orderCode: () => sandboxStore.state.orderCode,
  },
  created() {
    this.findBySceneCode();
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    // 组件flowchart传值，当前节点， 输出节点， 输入节点
    changeFlowchart(currentNode, outgoingNodes, incomingNodes) {
      this.currentNode =
        currentNode && currentNode.store && currentNode.store.data;
      this.nextButtons = outgoingNodes;
      this.prevButtons = incomingNodes;
      sandboxStore.commit(
        "setNodeCode",
        this.currentNode && this.currentNode.node_code
      );
      // console.log("this.currentNode>>", this.currentNode);
      // console.log("this.nextButtons>>", this.nextButtons);
      // console.log("this.prevButtons>>", this.prevButtons);
    },

    // 按钮上一步
    handlePrev(item) {
      // console.log("上一步", item);
      this.opertorNextNode(item.store.data, "prev");
    },

    // 按钮下一步
    async handleNext(item) {
      // 商家下单
      if (this.currentNode.node_code === "merchantOrder") {
        const childFormValid = await this.$refs.merchantOrder.validateForm();
        if (childFormValid) {
          // 子组件表单验证通过
          this.opertorNextNode(item.store.data, "next");
        } else {
          // 子组件表单验证不通过
          return;
        }
      } else {
        this.opertorNextNode(item.store.data, "next");
      }
    },
    // 商家控制台-节点操作
    async opertorNextNode(button, state) {
      this.loading = true;
      const data = {
        waybillCode: this.wayBillCode,
        orderCode: this.orderCode,
        opNodeVoList: [
          {
            state: state === "next" ? 1 : 0,
            nodeCode: this.currentNode.node_code,
          },
          {
            state: 2,
            nodeCode: button.node_code,
          },
        ],
        bindIdaasPin: this.user_pin,
        bindSupplierCode: Cookies.get("groupCode"),
        operatorProcessCode: this.currentProcess.processCode,
        mainSceneCode: this.sceneCode,
        unitCode: this.unitCode,
      };
      await basicInfo
        .opertorNextNode(data)
        .then((res) => {
          this.findBySceneCode();
          // if (res.code === -1) {
          //   sandboxStore.commit("setWayBillCode", "");
          //   sandboxStore.commit("setOrderCode", "");
            
          // }
          this.loading = false;
        })
        .catch((error) => {
          if(error.code === -1) {
            sandboxStore.commit("setWayBillCode", "");
            sandboxStore.commit("setOrderCode", "");
          }
          this.loading = false;
          // throw new Error(error, "cancelBindByWayBillCode");
        });
    },
    // 查询全部（查询流程数据）
    async findBySceneCode() {
      this.currentProcess = {};
      const data = {
        sceneCode: this.sceneCode,
        bindIdaasPin: this.user_pin,
        bindSupplierCode: Cookies.get("groupCode"),
        unitCode: this.unitCode,
      };
      await basicInfo
        .findBySceneCode(data)
        .then((res) => {
          res.sandboxSceneSupplierData.forEach((item) => {
            if (item.processCode === this.$route.query.process) {
              this.currentProcess = item;
            }
          });
          sandboxStore.commit("setWayBillCode", res.bindWaybillCode);
          sandboxStore.commit("setOrderCode", res.bindOrderCode);
          // console.log("res>>>", res);
          // console.log("info page this.currentProcess>>>", this.currentProcess);
        })
        .catch((error) => {
          throw new Error(error, "findBySceneCode");
        });
    },
    // 退出联调
    resetWaybill() {
      let text =
        this.nodeCode === "merchantOrder"
          ? "请确认是否结束沙箱联调？（退出后才可输入新的运单号进行联调）"
          : `请确认是否结束运单${this.wayBillCode}的沙箱联调？（退出后才可输入新的运单号进行联调）`;
      this.$confirm(text, "退出联调提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          if (this.nodeCode !== "merchantOrder") {
            await this.cancelBindByWayBillCode();
          }
          this.$router.push({
            name: "basicInfo",
          });
          this.$message({
            type: "success",
            message: "退出成功!",
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
.tit-view {
  background: #fff;
  padding: 10px 20px 10px 32px;
  margin: 0 20px 20px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 20px;
    width: 4px;
    height: 45px;
    background: #3c6ef0;
    transform: translateY(-50%);
  }
}
.big-tit {
  line-height: 26px;
  position: relative;
  font-size: 16px;
  font-weight: 600;
  font-family: PingFang SC;
  color: rgba(0, 0, 0, 1);
}
.tip {
  line-height: 24px;
  margin-top: 5px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: normal;
  color: rgba(153, 153, 153, 1);
}
.my-tabs {
  background: #fff;
  padding: 20px;
  margin: 20px;
  margin-bottom: 0;
  min-height: calc(100vh - 215px);
}
.my-tabs-flow-contain {
  background: rgba(244, 247, 250, 1);
  padding: 0 24px;
  margin-bottom: 24px;
  border-radius: 4px;
}
.my-tabs-commonInfo {
  display: flex;
  justify-content: space-between;
  .my-tabs-commonInfo-left {
    flex: 1;
    margin-right: 24px;
  }
  .my-tabs-commonInfo-right {
    width: 541px;
    height: 479px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(226, 226, 226, 1);
    border-radius: 4px;
  }
}
.footer-contain {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 72px;
  margin: auto 20px;
  margin-top: 17px;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.08);
  .footer-contain_button {
    margin-right: 16px;
  }
}
.header_contain {
  display: flex;
  align-items: center;
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
</style>
