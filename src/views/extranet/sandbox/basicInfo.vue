<template>
  <div>
    <div class="tit-view">
      <h2 class="big-tit">{{ name }}</h2>
      <p class="tip">{{ remark }}</p>
    </div>
    <div class="my-tabs">
      <div class="header_contain">
        <img class="header_img" src="@/assets/sandbox/iconHeader.png" alt />
        <span class="header_span">可联调流程</span>
      </div>
      <div class="flow-box" v-for="item in flowData" :key="item.processCode">
        <div class="flow-box-hd">
          <h3 class="tit">{{item.processName}}</h3>
          <el-button type="text" class="text-btn" @click="handleStart(item.processCode)" :clstag="clstag('', clstags[item.processCode])">开始联调</el-button>
        </div>
        <div class="flow-box-bd">
          <flowchartReadOnly :processCode="item.processCode"></flowchartReadOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sandboxStore from "@/store/national/extranet/modules/sandbox";
import store from "@/store/national/index.js";
import basicInfo from "@/api/extranet/sandbox/index.js";
import Cookies from "js-cookie";
import flowchartReadOnly from "./components/flowComponents/flowchartReadOnly.vue";
import pageClick from "@/utils/pageClick.js";

export default {
  components: { flowchartReadOnly },
  mixins: [],
  data() {
    return {
      name: sandboxStore.state.sandboxTableData["name"],
      remark: sandboxStore.state.sandboxTableData["remark"],
      sceneCode: sandboxStore.state.sandboxTableData["code"],
      unitCode: sandboxStore.state.sandboxTableData["unitCode"],
      user_pin: store.getters.user_pin,
      flowData: [],
      clstags: {
        'sandbox_kuaidi_all' : 'SandBoxTool_1693313320392|5',
        'sandbox_kuaidi_child1' : 'SandBoxTool_1693313320392|6',
        'sandbox_kuaidi_child2' : 'SandBoxTool_1693313320392|7',
        'sandbox_kuaidi_child3' : 'SandBoxTool_1693313320392|8',
      },
    };
  },
  created() {
    this.findBySceneCode();
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    // 开始联调
    handleStart(code) {
      this.$router.push({
        name: "commonInfo",
        query: {process: code}
      });
    },

    // 联调场景维护页面-查询全部
    async findBySceneCode() {
      const data = {
        sceneCode: this.sceneCode,
        bindIdaasPin: this.user_pin,
        bindSupplierCode: Cookies.get("groupCode"),
        unitCode: this.unitCode
      };
      await basicInfo
        .findBySceneCode(data)
        .then(res => {
          if (res.isBindWayBillCode) {
            // 有绑定直接跳转详情
            this.$router.push({
              name: "commonInfo",
              query: {process: res.bindProcessCode}
            });
          } else {
            this.flowData = res.sandboxSceneSupplierData;
          }
          sandboxStore.commit("setWayBillCode", res.bindWaybillCode);
          sandboxStore.commit("setOrderCode", res.bindOrderCode);
        })
        .catch(error => {
          throw new Error(error, "findBySceneCode");
        });
    }
  }
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
.header_contain {
  display: flex;
  align-items: center;
  width: 120px;
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

.flow-box {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(226, 226, 226, 1);
  border-radius: 4px;
  padding: 16px 24px 0 16px;
  & + .flow-box {
    margin-top: 16px;
  }
  .flow-box-hd {
    display: flex;
    line-height: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(228,233,240,1);
    .tit {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
    }
    .text-btn {
      padding: 0;
      text-align: right;
    }
  }
}
</style>
