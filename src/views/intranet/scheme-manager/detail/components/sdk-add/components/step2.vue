<template>
  <div class="myFormBox">
    <h3>请选择SDK包含的接口</h3>
    <p>SDK中的接口以对接方案中维护的接口文档为准，不包含隐藏的字段</p>
    <p style="margin-bottom: 20px"></p>
    <el-row style="margin-bottom: 10px; text-align: center">
      <el-col :span="24">
        <el-transfer
          class="transfer-class"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入关键词过滤"
          :titles="[showInfoName + '的所有接口(不包含隐藏接口)', 'SDK中包含的接口']"
          v-model="rightData"
          :data="leftData"
        >
        </el-transfer>
      </el-col>
    </el-row>
    <el-form
      ref="form"
      :model="sdkApiInfo"
      label-width="0px"
      size="medium"
      style="width: 80%; margin: 30px auto"
    >
      <el-form-item style="text-align: center; margin-left: 0">
        <el-button class="last" style="" @click="lastStep">上一步</el-button>
        <el-button
          :disabled="openIsDisabled"
          type="primary"
          style=""
          @click="submitForm('sdkApiInfo')"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
import { Message } from "@lui/lui-ui";

export default {
  name: "sdkAddStep2",
  props: {
    showInfoName: String,
  },
  data() {
    return {
      openIsDisabled: false,
      type: 1, //服务类型，1为JSF，2为http
      sdkApiInfo: {
        sdkId: "",
        unitId: "",
        apiId: "",
      },
      leftData: [],
      pinyin: [],
      rightData: [],
      filterMethod(query, item) {
        return item.pinyin.toLowerCase().indexOf(query.toLowerCase()) > -1;
      },
    };
  },
  async created() {
    this.sdkApiInfo.unitId = this.$route.params.id;
    this.sdkApiInfo.sdkId = this.$route.query.sdkId;
    await this.getType();
    if (this.type === 2) {
      this.listHttpBizApiPre();
    } else {
      this.listBizApiPre();
    }
    this.listBizSdkApiPre();
  },
  methods: {
    listHttpBizApiPre() {
      let _this = this;
      _this.loading = true;
      request({
        url: "/sdk/getBizApiPreListByUnit",
        method: "post",
        data: { unitId: _this.sdkApiInfo.unitId, callDirection: 1 },
      })
        .then((rsp) => {
          // console.log("listHttpBizApiPre->", rsp);
          if (rsp.data) {
            rsp.data.forEach(function (c, index) {
              _this.pinyin.push(c.apiName + "-" + c.apiCode);
              _this.leftData.push({
                key: c.id,
                label: c.apiName + "-" + c.apiCode,
                // disabled: i % 4 === 0
                pinyin: _this.pinyin[index], //添加数据时设置pinyin的索引
              });
            });
            _this.loading = false;
          }
        })
        .catch((e) => {
          console.log(e);
          _this.loading = false;
        });
    },
    listBizApiPre: function () {
      let _this = this;
      _this.loading = true;
      request({
        url: "/sdk/getBizApiPreListByUnit",
        method: "post",
        data: { unitId: _this.sdkApiInfo.unitId, callDirection: 1 },
      })
        .then((rsp) => {
          // console.log("listBizApiPre->", rsp);
          if (rsp.data) {
            rsp.data.forEach(function (c, index) {
              //_this.pinyin.push(c.interfaceName + "-" + c.interfaceMethod);
              _this.pinyin.push(c.apiName + " " + c.apiUrl);
              _this.leftData.push({
                key: c.id,
                label: c.apiName + " " + c.apiUrl,//c.interfaceName + "-" + c.interfaceMethod,
                // disabled: i % 4 === 0
                pinyin: _this.pinyin[index], //添加数据时设置pinyin的索引
              });
            });
            _this.loading = false;
          }
        })
        .catch((e) => {
          console.log(e);
          _this.loading = false;
        });
    },
    listBizSdkApiPre: function () {
      let _this = this;
      _this.loading = true;
      request({
        url: "/sdk/getBizSdkApiListBySdk",
        method: "post",
        data: { sdkId: _this.sdkApiInfo.sdkId },
      })
        .then((rsp) => {
          // console.log("listBizSdkApiPre->", rsp);
          if (rsp.data) {
            rsp.data.forEach(function (c, index) {
              _this.rightData.push(c.apiId);
            });
          }
          _this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          _this.loading = false;
        });
    },
    lastStep: function () {
      this.$parent.stepsObj.active--;
      this.$router.push({
        // path: '/openBiz/openBizDetail',
        name: "OpenBizOpenBizDetail",
        params: { id: this.$route.params.id },
        query: {
          tag: "sdkAdd",
          sdkId: this.$route.query.sdkId,
          addStep: this.$parent.stepsObj.active,
        },
      });
    },
    submitForm: function () {
      let _this = this;
      if (_this.rightData.length <= 0) {
        Message.error("SDK至少包含一个API");
        return;
      }
      _this.loading = true;
      let red = [];
      for (let i = 0, len = _this.rightData.length; i < len; i++) {
        let param = {
          sdkId: _this.sdkApiInfo.sdkId,
          apiId: _this.rightData[i],
        };
        red.push(param);
      }
      // console.log("params", JSON.stringify(red));
      request({
        url: "/sdk/saveBizSdkApi",
        method: "post",
        data: red,
      })
        .then((rsp) => {
          if (rsp.code == 20000) {
            this.$parent.stepsObj.active++;
            this.$router.push({
              // path: '/openBiz/openBizDetail',
              name: "OpenBizOpenBizDetail",
              params: { id: this.$route.params.id },
              query: {
                tag: "sdkAdd",
                sdkId: this.$route.query.sdkId,
                addStep: this.$parent.stepsObj.active,
              },
            });
            _this.loading = false;
          }
        })
        .catch((e) => {
          console.log(e);
          Message.error("操作失败");
          _this.loading = false;
        });
    },
    async getType() {
      const url = "/bizunit/getOverview";
      await request({
        url: url,
        method: "get",
        params: { id: this.$route.params.id },
      })
        .then((res) => {
          this.type = res.data.domainType;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.myFormBox {
  width: 100%;
  margin: 0 auto;

  h3 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
    color: #333333;
  }

  p {
    text-align: center;
    margin-bottom: 0;
  }
}
.transfer-class >>> .el-transfer-panel {
  border-radius: 0px;
  width: 40%;
  text-align: left;
}
</style>
