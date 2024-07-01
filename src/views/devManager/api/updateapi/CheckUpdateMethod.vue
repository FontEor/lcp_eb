<template>
  <div class="my-wrap">
    <div v-if="!apiupdatecompare.publish" class="initializationStyle">
      <img src="@/assets/img/defaultPage/noTodoTask.png">
      <div>当前API还未发布，无法查看更新信息</div>
    </div>
    <div v-if="apiupdatecompare.publish">
      <div class="update-title">
        与已发布版本的区别
      </div>
      <div 
          v-if="
            JSON.stringify(apiupdatecompare.newModifyMethodMap) != '{}' ||
            JSON.stringify(apiupdatecompare.dropMethodMap) != '{}' ||
            JSON.stringify(apiupdatecompare.newMethodMap) != '{}'
          " 
          class="tip">注意：删除方法或更改方法可能导致原有调用方无法正常使用，请谨慎操作！</div>
      <div class="mycontent">
        <div class="contentleft">
          <div
            class="leftadd"
            v-if="JSON.stringify(apiupdatecompare.newMethodMap) != '{}'"
          >
            <div><el-divider direction="vertical"></el-divider>增加方法</div>
            <div class="leftaddcontent">
              <el-row
              class="left-content-index"
                :gutter="20"
                v-for="(item, index) in apiupdatecompare.newMethodMap"
                :key="index"
              >
                <el-col
                  >方法名:{{ index
                  }}<el-link
                    type="primary"
                    @click="addParamTableVisible(item)"
                    style="margin-left:20px;"
                    >详情</el-link
                  ></el-col
                >
              </el-row>
            </div>
          </div>
          <div
            class="leftmodify"
            v-if="JSON.stringify(apiupdatecompare.newModifyMethodMap) != '{}'"
          >
            <div><el-divider direction="vertical"></el-divider>更改方法</div>
            <div class="leftmodifycontent">
              <el-row
              class="leftmodify-index"
                :gutter="20"
                v-for="(item, index) in apiupdatecompare.newModifyMethodMap"
                :key="index"
              >
                <el-col
                  >方法名:{{ index }}
                  <el-link
                    type="primary"
                    @click="modifyParamTableVisible(index, item)"
                    style="margin-left:20px;"
                    >对比详情</el-link
                  ></el-col
                >
              </el-row>
            </div>
          </div>
        </div>
        <div
          class="contentright"
          v-if="JSON.stringify(apiupdatecompare.dropMethodMap) != '{}'"
        >
          <div class="rightdel">
            <div><el-divider direction="vertical"></el-divider>删除方法</div>
            <div class="rightdelcontent">
              <el-row
                class="del-content-index"
                :gutter="20"
                v-for="(item, index) in apiupdatecompare.dropMethodMap"
                :key="index"
              >
                <el-col>方法名:{{ index }}</el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="update-unchanged"
      v-if="
        JSON.stringify(apiupdatecompare.newModifyMethodMap) == '{}' &&
          JSON.stringify(apiupdatecompare.dropMethodMap) == '{}' &&
          JSON.stringify(apiupdatecompare.newMethodMap) == '{}'
      "
    >
      <img src="@/assets/img/defaultPage/noTodoTask.png">
      <div>系统检测到当前API没有变化</div>  
    </div>
    <div
      class="step-button"
    >
      <el-button type="default" @click="prestep">上一步</el-button>
      <el-button type="primary" @click="apinext">下一步</el-button>
    </div>

    <el-dialog
      :title="addMethodServiceName"
      :visible.sync="dialogAddTableVisible"
    >
      <h4 class="document-sub-title">请求参数</h4>
      <lcptables
        :tableData="
          this.methodAddObj.inParams == null
            ? new Array()
            : this.methodAddObj.inParams
        "
        :tableColumnInfo="columnsParams"
        :editer="true"
      ></lcptables>
      <h4 class="document-sub-title">返回参数</h4>
      <lcptables
        :tableData="
          this.methodAddObj.outParams == null
            ? new Array()
            : this.methodAddObj.outParams
        "
        :tableColumnInfo="columnsParams"
        :editer="true"
      ></lcptables>
    </el-dialog>
    <el-dialog :visible.sync="dialogModifyTableVisible">
      <div slot="title" class="header-title">
        <span>{{ modifyMethodServiceName }}</span>
        <span
          >(<span style="color:red;">注意:</span>修改用<span style="color:red;"
            >红色</span
          >表示，添加用<span style="color:green;">绿色</span>表示，删除用<span
            style="text-decoration:line-through;"
            >中划线</span
          >表示)</span
        >
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
        <el-tab-pane label="当前上传版本" name="first">
          <h4 class="document-sub-title">请求参数</h4>
          <lcptables
            :tableData="
              this.methodModifyObj.diffApiMethod.inParams == null
                ? new Array()
                : this.methodModifyObj.diffApiMethod.inParams
            "
            :tableColumnInfo="columnsModifyParams"
            :editer="true"
          ></lcptables>
          <h4 class="document-sub-title">返回参数</h4>
          <lcptables
            :tableData="
              this.methodModifyObj.diffApiMethod.outParams == null
                ? new Array()
                : this.methodModifyObj.diffApiMethod.outParams
            "
            :tableColumnInfo="columnsModifyParams"
            :editer="true"
          ></lcptables>
        </el-tab-pane>
        <el-tab-pane label="已发布版本" name="second">
          <h4 class="document-sub-title">请求参数</h4>
          <lcptables
            :tableData="
              this.methodModifyObj.apiMethod.inParams == null
                ? new Array()
                : this.methodModifyObj.apiMethod.inParams
            "
            :tableColumnInfo="columnsParams"
            :editer="true"
          ></lcptables>
          <h4 class="document-sub-title">返回参数</h4>
          <lcptables
            :tableData="
              this.methodModifyObj.apiMethod.outParams == null
                ? new Array()
                : this.methodModifyObj.apiMethod.outParams
            "
            :tableColumnInfo="columnsParams"
            :editer="true"
          ></lcptables>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import lcptables from "../manager/components/lcptables";
import request from "@/utils/request";
export default {
   props: {
    apiMessage: Object
  },
  components: {
    lcptables
  },
  data() {
    return {
      apiupdatecompare: "", //返回的对象
      addMethodServiceName: "", //显示增加方法详情弹出框标题
      modifyMethodServiceName: "", //显示更改方法对比详情框标题
      dialogAddTableVisible: false, //显示增加方法详情弹出框
      dialogModifyTableVisible: false, //显示更改方法对比详情框
      methodAddObj: "", //添加方法显示对象
      methodModifyObj: {
        diffApiMethod: {
          inParams: [],
          outParams: []
        },
        apiMethod: {
          nParams: [],
          outParams: []
        }
      }, //修改方法显示对象
      logcontent: "", //日志内容
      stepsObj: {
        active: 1,
        title: "更新API",
        tiptitle: [
          "上传API描述文件",
          "查看更新信息",
          "补充更新信息",
          "更新成功"
        ]
      },
      activeName: "first",
      columnsModifyParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "20%"
        },
        {
          prop: "type",
          label: "类型",
          min_width: "20%"
        },
        {
          prop: "modify",
          label: "变更类型",
          min_width: "7%"
        }
      ],
      columnsParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "20%"
        },
        {
          prop: "type",
          label: "类型",
          min_width: "20%"
        }
      ],
      count: 1
    };
  },
  mounted() {
    this.apiupdatecompare = this.apiMessage.apiupdatecompare;
  },
  methods: {
    getRowKey() {
      return Math.random();
    },
    /**
     * 添加方法弹出框
     */
    addParamTableVisible(item) {
      this.count = 1;
      this.methodAddObj = "";
      this.methodAddObj = item;
      if (this.methodAddObj.inParams) {
        this.paramsAddId(this.methodAddObj.inParams);
      }
      if (this.methodAddObj.outParams) {
        this.paramsAddId(this.methodAddObj.outParams);
      }
      this.addMethodServiceName = item.name;
      this.dialogAddTableVisible = true;
    },
    /**
     * 修改参数方法
     */
    modifyParamTableVisible(serviceName, methodParamId) {
      this.activeName = "first";
      this.count = 1;
      this.modifyMethodServiceName = serviceName;
      let url = "/api/diffApi";
      request({
        url: url,
        method: "post",
        data: { methodId: methodParamId, apiXml: this.apiupdatecompare.apiXml }
      })
        .then(rsp => {
          if (rsp.data) {
            if (rsp.data.diffApiMethod) {
              //对比的对象
              this.methodModifyObj.diffApiMethod.inParams =
                rsp.data.diffApiMethod.inParams;
              this.methodModifyObj.diffApiMethod.outParams =
                rsp.data.diffApiMethod.outParams;
              if (this.methodModifyObj.diffApiMethod.inParams) {
                this.paramsAddId(this.methodModifyObj.diffApiMethod.inParams);
              }
              if (this.methodModifyObj.diffApiMethod.outParams) {
                this.paramsAddId(this.methodModifyObj.diffApiMethod.outParams);
              }
            }
            if (rsp.data.apiMethod) {
              //输入输出参数的对象
              this.methodModifyObj.apiMethod.inParams =
                rsp.data.apiMethod.inParams;
              this.methodModifyObj.apiMethod.outParams =
                rsp.data.apiMethod.outParams;
            }
            this.dialogModifyTableVisible = true;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 给参数对象添加虚拟的id
     */
    paramsAddId(params) {
      if (params) {
        for (let param in params) {
          let paramObj = params[param];
          paramObj.id = this.count++;
          if (paramObj.children) {
            this.paramsAddId(paramObj.children);
          }
        }
      }
    },
    /**
     * 切换tab标签
     */
    handleClick(tab, event) {
      this.activeName = tab.name;
    },
    /**
     * 下一步
     */
    apinext() {
      this.apiMessage.apiupdatecompare=this.apiupdatecompare
      this.$emit("next")
    },
    /**
     * 上一步
     */
    prestep() {
      this.$emit("previous")
    }
  }
};
</script>
<style lang="scss" scoped>
.initializationStyle {
  text-align: center;
  margin: 70px auto;
}

.update-title {
  margin: 46px 0 0 0;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
}

.update-unchanged {
  text-align: center;
  font-size:16px;
  margin-bottom: 40px;
  margin-top: -20px;
}

.step-button{
  margin-top: 80px;
}

 .tip {
  color: red;
  margin: 20px auto;
  }

.mycontent {
  margin-top: 25px;
 
  .contentleft {
    > div {
      > div:first-child {
        font-weight: bold;
      }
    }
    .leftadd{
      margin: 12px auto;
      .left-content-index{
        margin: 10px auto;
      }
    }
    .leftmodify{
      margin: 12px auto;
      .leftmodify-index{
        margin: 10px auto;
      }
    }
  }
  .contentright {
    > div {
      > div:first-child {
        font-weight: bold;
      }
    }
    .rightdel{
      margin: 12px auto;
      .del-content-index{
        margin: 10px auto;
      }
    }
  }
}
</style>
