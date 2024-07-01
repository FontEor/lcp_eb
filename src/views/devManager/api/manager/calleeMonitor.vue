<template type="ElementUI">
  <div>
    <div class="filter-container">
      <el-row style="margin-bottom: 20px">
        <el-col :span="24">
          <el-radio-group v-model="timesRadio" @change="onQueryByTimeCode()">
            <el-radio-button
              v-for="item in timesCode"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}
            </el-radio-button>
          </el-radio-group>
          <el-date-picker
            style="margin-left: 20px"
            v-if="this.customTime === 'true'"
            v-model="customTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover" style="padding: 0px">
          <!--          <el-alert-->
          <!--            title="TOP10调用方"-->
          <!--            type="info"-->
          <!--            :closable="false" style="margin-bottom:5px">-->
          <!--          </el-alert>-->
          <li
            style="height: 40px; background-color: #ecf1fe; padding: 8px 16px"
          >
            <el-row :gutter="20">
              <el-col :span="12" style="float: left"> TOP10调用方 </el-col>
              <el-col :span="12">
                <div style="display: inline-block; float: right">
                  <el-radio-group
                    v-model="top10ChartRadio"
                    size="mini"
                    @change="onQueryTop10DataWithChart()"
                  >
                    <el-radio-button
                      v-for="item in top10ChartCode"
                      :key="item.value"
                      :label="item.value"
                      >{{ item.label }}
                    </el-radio-button>
                  </el-radio-group>
                  <el-button
                    type="text"
                    style="padding-left: 10px; padding-top: 2px"
                    size="mini"
                    v-on:click="onQueryAllAppData()"
                  >
                    查看全部
                    <i class="el-icon-full-screen el-icon--right" />
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </li>
          <HorizontalBarChart
            v-loading="topBarLoading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            v-if="calleeOfTop10Monitor === 'online' && top10ChartRadio == '1'"
            :data="calleeOfTop10Data"
            :options="calleeOfTop10Options"
            :styles="{ height: '300px', position: 'relative' }"
          ></HorizontalBarChart>
          <DoughnutChart
            v-loading="topPieLoading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            v-if="
              calleeOfTop10PieMonitor === 'online' && top10ChartRadio == '2'
            "
            :data="calleeOfTop10PieData"
            :options="calleeOfTop10PieOptions"
            :styles="{ height: '300px', position: 'relative' }"
          ></DoughnutChart>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <li
            style="height: 40px; background-color: #ecf1fe; padding: 8px 16px"
          >
            <el-row :gutter="20">
              <el-col :span="12" style="float: left">
                <span v-if="methodOrAppRadio == '1'">方法调用占比</span>
                <span v-else-if="methodOrAppRadio == '2'"
                  >{{ currentMethodName }}方法(应用调用量)</span
                >
              </el-col>
              <el-col :span="12">
                <div style="display: inline-block; float: right">
                  <el-button
                    type="text"
                    class="el-icon-back"
                    v-if="methodOrAppRadio == '2'"
                    style="padding-left: 10px; padding-top: 2px"
                    size="mini"
                    v-on:click="onQueryTop10AppDataOfMethod()"
                  >
                    返回方法调用占比
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </li>
          <DoughnutChart
            v-loading="methodPieLoading"
            element-loading-text="数据加载中..."
            element-loading-spinner="el-icon-loading"
            v-if="calleeOfMethodMonitor === 'online' && methodOrAppRadio == '1'"
            :data="calleeOfMethodData"
            :options="calleeOfMethodOptions"
            :styles="{ height: '300px', position: 'relative' }"
          ></DoughnutChart>
          <HorizontalBarChart
            v-loading="methodBarLoading"
            element-loading-text="数据加载中..."
            element-loading-spinner="el-icon-loading"
            v-if="
              calleeOfMethodBarMonitor === 'online' && methodOrAppRadio == '2'
            "
            :data="calleeOfMethodBarData"
            :options="calleeOfMethodBarOptions"
            :styles="{ height: '300px', position: 'relative' }"
          ></HorizontalBarChart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24">
        <el-card shadow="hover">
          <!--          <el-alert-->
          <!--            title="调用量"-->
          <!--            type="info"-->
          <!--            :closable="false" style="margin-bottom:5px">-->
          <!--          </el-alert>-->
          <li
            style="height: 40px; background-color: #ecf1fe; padding: 8px 16px"
          >
            <el-row :gutter="20">
              <el-col :span="12" style="float: left"> 调用量 </el-col>
            </el-row>
          </li>
          <line-chart
            v-loading="lineLoading"
            element-loading-text="数据加载中..."
            element-loading-spinner="el-icon-loading"
            v-if="calleeMonitor === 'online'"
            :data="calleeData"
            :options="calleeOptions"
            :styles="{ height: '300px', position: 'relative' }"
          ></line-chart>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="topAppDialogVisible"
      title="调用方"
      :close-on-click-modal="false"
      style="padding: 0px"
      :before-close="onCloseAllAppDialog"
    >
      <HorizontalBarChart
        v-loading="topAllBarLoading"
        element-loading-text="数据加载中..."
        element-loading-spinner="el-icon-loading"
        v-if="calleeOfTopAllMonitor === 'online' && top10ChartRadio == '1'"
        :data="calleeOfTopAllData"
        :options="calleeOfTopAllOptions"
        :styles="{ height: calleeOfTopTotalPx, position: 'relative' }"
      ></HorizontalBarChart>

      <DoughnutChart
        v-loading="topAllPieLoading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        v-if="calleeOfTopAllPieMonitor === 'online' && top10ChartRadio == '2'"
        :data="calleeOfTopAllPieData"
        :options="calleeOfTopAllPieOptions"
        :styles="{ height: '100%', position: 'relative' }"
      ></DoughnutChart>
    </el-dialog>
  </div>
</template>

<script>
import LineChart from "./components/charts/linechart.js";
import HorizontalBarChart from "./components/charts/horizontalbarchart.js";
import DoughnutChart from "./components/charts/doughnutchart.js";
import request from "@/utils/request.js";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  components: { LineChart, HorizontalBarChart, DoughnutChart },
  data() {
    let _minTime = null;
    let _maxTime = null;
    return {
      //--TOP10调用方
      calleeOfTop10Data: [],
      calleeOfTop10Options: [],
      calleeOfTop10Monitor: "online",

      //--所有调用方数据
      calleeOfTopAllData: [],
      calleeOfTopAllOptions: [],
      calleeOfTopAllMonitor: "online",

      topBarLoading: true,
      topPieLoading: true,
      lineLoading: true,
      methodPieLoading: true,
      methodBarLoading: true,

      //--对话框加载状态
      topAllPieLoading: true,
      topAllBarLoading: true,
      calleeOfTopTotalPx: "300px",

      calleeOfTop10PieData: [],
      calleeOfTop10PieOptions: [],
      calleeOfTop10PieMonitor: "online",

      calleeOfTopAllPieData: [],
      calleeOfTopAllPieOptions: [],
      calleeOfTopAllPieMonitor: "online",

      topAppDialogVisible: false,

      //--调用量
      calleeData: [],
      calleeOptions: [],
      calleeMonitor: "online",

      //--方法调用
      calleeOfMethodData: [],
      calleeOfMethodOptions: [],
      calleeOfMethodMonitor: "online",

      //--方法调用应用比例对象
      calleeOfMethodBarData: [],
      calleeOfMethodBarOptions: [],
      calleeOfMethodBarMonitor: "online",

      //--TOP10调用方图形切换
      top10ChartRadio: "1",
      top10ChartCode: [
        { value: "1", label: "柱状图" },
        { value: "2", label: "环形图" },
      ],

      //--方法调用占比切换
      methodOrAppRadio: "1",

      currentMethodName: "",

      //--时间切换
      timesRadio: "7",
      timesCode: [
        { value: "7", label: "近7天" },
        { value: "30", label: "近30天" },
        {
          value: "365",
          label: "近365天",
        },
        { value: "-1", label: "自定义时间" },
      ],

      //--自定义时间范围
      customTimeRange: "",
      startTime: "",
      endTime: "",
      customTime: "false",

      //--2020-5-15主动拉取完全限定名称
      qualifiedName: "",

      baseBarBackgroundColor: [
        "#628EFF",
        "#70A7FF",
        "#FEC949",
        "#6CE0B9",
        "#80BBFF",
        "#FEE549",
        "#79D5FF",
        "#3248E1",
        "#6F49FF",
        "#C2E986",
        "#7C74B5",
        "#FFBC29",
        "#B93CFF",
        "#61A5DC",
        "#6F6EFB",
        "#FF6D6E",
        "#45D4DA",
        "#9BE945",
        "#70A7FF",
        "#FF3282",
        "#D13030",
        "#B411AC",
        "#3E62FF",
      ],

      pickerOptions: {
        onPick(time) {
          if (!time.maxDate) {
            let timeRange = 365 * 24 * 60 * 60 * 1000;
            _minTime = time.minDate.getTime() - timeRange;
            _maxTime = time.minDate.getTime();
          } else {
            _minTime = _maxTime = null;
          }
        },
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  watch: {
    customTimeRange: {
      handler(val) {
        this.startTime = val[0];
        this.endTime = val[1];
        if (this.startTime && this.endTime) {
          this.timesRadio = "-1";
          this.getAllMonitorDatas();
        }
      },
    },
  },
  methods: {
    async findApiBaseInfo() {
      const url = "/ApiManagerService/findApiBaseInfo";
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    getAllMonitorDatas() {
      //--2020-05-15,为了满足单给页面存在唯一URL的需求,增加fetchApiInstance方法主动获取限定名
      //this.loading = true
      this.fetchApiInstance();
    },
    //--2020-05-15
    //--事先根据ID获取完全限定名
    async fetchApiInstance() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        this.topBarLoading = false;
        this.topPieLoading = false;
        this.methodPieLoading = false;
        this.lineLoading = false;
        throw new Error("fetchApiInstance findApiBaseInfo");
      });
      this.qualifiedName = data.qualifiedName;
      //--TOP10调用方横向柱状图数据
      if (this.top10ChartRadio == "1") {
        this.topBarLoading = true;
        this.getCalleeOfTop10Data();
      }
      //--TOP10调用方横向环形图数据
      if (this.top10ChartRadio == "2") {
        this.topPieLoading = true;
        this.getCalleeOfTop10DataWithPieChart();
      }

      //--调用方法饼图数据
      if (this.methodOrAppRadio == "1") {
        this.methodPieLoading = true;
        this.getCalleeOfMethodData();
      }
      //--调用方法柱状图数据
      if (this.methodOrAppRadio == "2") {
        if (this.currentMethodName) {
          this.getTop10BarCalleeOfMethodWithApp(this.currentMethodName);
        } else {
          this.methodOrAppRadio = "1";
          this.getCalleeOfMethodData();
        }
      }
      this.lineLoading = true;
      //--调用量折线图数据
      this.getCalleeData();
    },

    onQueryByTimeCode() {
      if (this.timesRadio === "-1") {
        this.customTime = "true";
        if (!(this.startTime === "" && this.endTime === "")) {
          this.getAllMonitorDatas();
        }
      } else {
        this.customTime = "false";
        this.getAllMonitorDatas();
      }
    },

    onQueryTop10DataWithChart() {
      if (this.timesRadio === "-1") {
        if (!(this.startTime === "" && this.endTime === "")) {
          if (this.top10ChartRadio === "1") {
            this.topBarLoading = true;
            this.getCalleeOfTop10Data();
          } else if (this.top10ChartRadio === "2") {
            this.topAllPieLoading = true;
            this.getCalleeOfTop10DataWithPieChart();
          }
        }
      } else {
        if (this.top10ChartRadio === "1") {
          this.topBarLoading = true;
          this.getCalleeOfTop10Data();
        } else if (this.top10ChartRadio === "2") {
          this.topAllPieLoading = true;
          this.getCalleeOfTop10DataWithPieChart();
        }
      }
    },

    getCalleeOfTopAllDataWithPieChart() {
      let params = {
        qualifiedName: this.qualifiedName,
        days: this.timesRadio,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.timesRadio === "-1") {
        params = {
          qualifiedName: this.qualifiedName,
          startTime: this.startTime,
          endTime: this.endTime,
        };
      }
      request({
        url: "/apiCallCollection/selectCallData",
        params: params,
        method: "get",
      }).then((rsp) => {
        this.topAllPieLoading = false;
        let appNames = rsp.data.appNames;
        this.calleeOfTopAllPieMonitor = "online";
        let length = appNames.length;
        let backgroundColor = [];
        for (let i = 0; i < length; i++) {
          if (i < 10) {
            backgroundColor[i] = this.baseBarBackgroundColor[i];
          } else {
            backgroundColor[i] =
              this.baseBarBackgroundColor[Math.floor(Math.random() * 23)];
          }
        }
        this.calleeOfTopAllPieData = {
          //--应用名称
          labels: rsp.data.appNames,
          datasets: [
            {
              data: rsp.data.data,
              backgroundColor: backgroundColor,
              borderWidth: 2,
            },
          ],
          //--开发商
          supplierNames: rsp.data.supplierNames,
          //--开发商编码
          supplierCodes: rsp.data.supplierCodes,
          //--应用编码
          appCodes: rsp.data.labels,
        };
        this.calleeOfTopAllPieOptions = {
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          pieceLabel: {
            mode: "percentage",
            precision: 1,
          },
          legend: {
            position: "right",
          },
          cutoutPercentage: 70,

          tooltips: {
            enabled: true,
            callbacks: {
              // beforeTitle: function (tooltipItems, data) {
              //   const beforeTitleIndex = tooltipItems[0].index
              //   const appName = data.supplierNames[beforeTitleIndex]
              //   let beforeTitleToolTip = ''
              //   if (appName) {
              //     beforeTitleToolTip = beforeTitleToolTip.concat("开发商名称: ", appName)
              //   }
              //   return beforeTitleToolTip
              // },
              //
              // title: ((tooltipItems, data) => {
              //   const titleIndex = tooltipItems[0].index
              //   const appCode = data.supplierCodes[titleIndex]
              //   let titleToolTip = ''
              //   if (appCode) {
              //     titleToolTip = titleToolTip.concat("开发商编码: ", appCode)
              //   }
              //   return titleToolTip
              // }),
              //
              // afterTitle: ((tooltipItems, data) => {
              //   const afterTitleIndex = tooltipItems[0].index
              //   const afterTitle = data.appCodes[afterTitleIndex]
              //   let afterTitleToolTip = ''
              //   if (afterTitle) {
              //     afterTitleToolTip = afterTitleToolTip.concat("应用编码: ", afterTitle)
              //   }
              //   return afterTitleToolTip
              // }),
              beforeTitle: function (tooltipItems, data) {
                const beforeTitleIndex = tooltipItems[0].index;
                const appName = data.labels[beforeTitleIndex];
                let beforeTitleToolTip = "";
                if (appName) {
                  beforeTitleToolTip = beforeTitleToolTip.concat(
                    "应用名称: ",
                    appName
                  );
                }
                return beforeTitleToolTip;
              },
              title: (tooltipItems, data) => {
                const titleIndex = tooltipItems[0].index;
                const title = data.appCodes[titleIndex];
                let titleToolTip = "";
                if (title) {
                  titleToolTip = titleToolTip.concat("应用编码: ", title);
                }
                return titleToolTip;
              },
              afterTitle: (tooltipItems, data) => {
                const afterTitleIndex = tooltipItems[0].index;
                const supplierName = data.supplierNames[afterTitleIndex];
                let afterTitleToolTip = "";
                if (supplierName) {
                  afterTitleToolTip = afterTitleToolTip.concat(
                    "开发商名称: ",
                    supplierName
                  );
                }
                return afterTitleToolTip;
              },

              label: (tooltipItems, data) => {
                const index = tooltipItems.index;
                let toolTip = "";
                const dataset = data["datasets"][0];
                // const label = data.labels[index]
                const label = dataset["data"][tooltipItems["index"]];
                let sum = 0;
                for (let i = 0; i < dataset.data.length; i++) {
                  sum += Number(dataset.data[i]);
                }
                const percent = Math.round(
                  (dataset["data"][tooltipItems["index"]] / sum) * 100000
                );
                if (label) {
                  toolTip = toolTip.concat(label, " (" + percent / 1000 + "%)");
                }
                return toolTip;
              },
            },
          },
        };
      });
    },

    getCalleeOfTop10DataWithPieChart() {
      let params = {
        qualifiedName: this.qualifiedName,
        days: this.timesRadio,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.timesRadio === "-1") {
        params = {
          qualifiedName: this.qualifiedName,
          startTime: this.startTime,
          endTime: this.endTime,
        };
      }
      request({
        url: "/apiCallCollection/top10Datas",
        params: params,
        method: "get",
      }).then((rsp) => {
        this.topPieLoading = false;
        let appNames = rsp.data.appNames;
        this.calleeOfTop10PieMonitor = "online";
        let length = appNames.length;
        let backgroundColor = [];
        for (let i = 0; i < length; i++) {
          if (i < 10) {
            backgroundColor[i] = this.baseBarBackgroundColor[i];
          } else {
            backgroundColor[i] =
              this.baseBarBackgroundColor[Math.floor(Math.random() * 23)];
          }
        }
        this.calleeOfTop10PieData = {
          //--应用名称
          labels: rsp.data.appNames,
          datasets: [
            {
              data: rsp.data.data,
              backgroundColor: backgroundColor,
              borderWidth: 2,
            },
          ],
          //--开发商
          supplierNames: rsp.data.supplierNames,
          //--开发商编码
          supplierCodes: rsp.data.supplierCodes,
          //--应用编码
          appCodes: rsp.data.labels,
        };
        this.calleeOfTop10PieOptions = {
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          pieceLabel: {
            mode: "percentage",
            precision: 1,
          },
          legend: {
            position: "right",
          },
          cutoutPercentage: 70,
          tooltips: {
            enabled: true,
            callbacks: {
              // beforeTitle: function (tooltipItems, data) {
              //   const beforeTitleIndex = tooltipItems[0].index
              //   const appName = data.supplierNames[beforeTitleIndex]
              //   let beforeTitleToolTip = ''
              //   if (appName) {
              //     beforeTitleToolTip = beforeTitleToolTip.concat("开发商名称: ", appName)
              //   }
              //   return beforeTitleToolTip
              // },
              //
              // title: ((tooltipItems, data) => {
              //   const titleIndex = tooltipItems[0].index
              //   const appCode = data.supplierCodes[titleIndex]
              //   let titleToolTip = ''
              //   if (appCode) {
              //     titleToolTip = titleToolTip.concat("开发商编码: ", appCode)
              //   }
              //   return titleToolTip
              // }),
              //
              // afterTitle: ((tooltipItems, data) => {
              //   const afterTitleIndex = tooltipItems[0].index
              //   const afterTitle = data.appCodes[afterTitleIndex]
              //   let afterTitleToolTip = ''
              //   if (afterTitle) {
              //     afterTitleToolTip = afterTitleToolTip.concat("应用编码: ", afterTitle)
              //   }
              //   return afterTitleToolTip
              // }),
              beforeTitle: function (tooltipItems, data) {
                const beforeTitleIndex = tooltipItems[0].index;
                const appName = data.labels[beforeTitleIndex];
                let beforeTitleToolTip = "";
                if (appName) {
                  beforeTitleToolTip = beforeTitleToolTip.concat(
                    "应用名称: ",
                    appName
                  );
                }
                return beforeTitleToolTip;
              },
              title: (tooltipItems, data) => {
                const titleIndex = tooltipItems[0].index;
                const title = data.appCodes[titleIndex];
                let titleToolTip = "";
                if (title) {
                  titleToolTip = titleToolTip.concat("应用编码: ", title);
                }
                return titleToolTip;
              },
              afterTitle: (tooltipItems, data) => {
                const afterTitleIndex = tooltipItems[0].index;
                const supplierName = data.supplierNames[afterTitleIndex];
                let afterTitleToolTip = "";
                if (supplierName) {
                  afterTitleToolTip = afterTitleToolTip.concat(
                    "开发商名称: ",
                    supplierName
                  );
                }
                return afterTitleToolTip;
              },

              label: (tooltipItems, data) => {
                const index = tooltipItems.index;
                let toolTip = "";
                const dataset = data["datasets"][0];
                const label = dataset["data"][tooltipItems["index"]];
                let sum = 0;
                for (let i = 0; i < dataset.data.length; i++) {
                  sum += Number(dataset.data[i]);
                }
                const percent = Math.round(
                  (dataset["data"][tooltipItems["index"]] / sum) * 10000
                );
                if (label) {
                  toolTip = toolTip.concat(label, " (" + percent / 100 + "%)");
                }
                return toolTip;
              },
            },
          },
        };
      });
    },

    onQueryAllAppData() {
      this.customTime = "true";
      if (this.timesRadio === "-1") {
        if (!(this.startTime === "" && this.endTime === "")) {
          if (this.top10ChartRadio == 1) {
            this.topAllBarLoading = true;
            this.getCalleeOfTopAllData();
          } else if (this.top10ChartRadio == 2) {
            this.getCalleeOfTopAllDataWithPieChart();
          }
          this.topAppDialogVisible = true;
        }
      } else {
        if (this.top10ChartRadio == 1) {
          this.topAllBarLoading = true;
          this.getCalleeOfTopAllData();
        } else if (this.top10ChartRadio == 2) {
          this.getCalleeOfTopAllDataWithPieChart();
        }
        this.topAppDialogVisible = true;
      }
    },

    onCloseAllAppDialog() {
      this.topAppDialogVisible = false;
      this.calleeOfTopAllData = [];
      this.calleeOfTopAllOptions = [];
      this.calleeOfTopAllPieData = [];
      this.calleeOfTopAllPieOptions = [];
      this.calleeOfTopTotalPx = "300px";
    },

    resetTimeRange() {
      (this.startTime = ""), (this.endTime = "");
    },

    getCalleeOfTopAllData() {
      console.info(this.qualifiedName);
      let params = {
        qualifiedName: this.qualifiedName,
        days: this.timesRadio,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.timesRadio === "-1") {
        params = {
          qualifiedName: this.qualifiedName,
          startTime: this.startTime,
          endTime: this.endTime,
        };
      }
      request({
        url: "/apiCallCollection/selectCallData",
        params: params,
        method: "get",
      }).then((rsp) => {
        this.topAllBarLoading = false;
        let appNames = rsp.data.appNames;
        this.calleeOfTop10Options = "online";
        let length = appNames.length;
        let backgroundColor = [];
        let borderColor = [];
        for (let i = 0; i < length; i++) {
          backgroundColor[i] = "#628EFF";
          borderColor[i] = "#628EFF";
        }
        const height = 25 * length + 40;
        if (height > 300) {
          this.calleeOfTopTotalPx = height.toString() + "px";
        }
        this.calleeOfTopAllData = {
          labels: rsp.data.appNames,
          datasets: [
            {
              barBackground: "rgba(221, 224, 229, 1)",
              barThickness: 16,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              data: rsp.data.data,
            },
          ],
          //--开发商
          supplierNames: rsp.data.supplierNames,
          //--开发商编码
          supplierCodes: rsp.data.supplierCodes,
          //--应用编码
          appCodes: rsp.data.labels,
        };
        this.calleeOfTopAllOptions = {
          tooltips: {
            enabled: true,
            callbacks: {
              beforeTitle: function (tooltipItems, data) {
                const beforeTitleIndex = tooltipItems[0].index;
                const appName = data.labels[beforeTitleIndex];
                let beforeTitleToolTip = "";
                if (appName) {
                  beforeTitleToolTip = beforeTitleToolTip.concat(
                    "应用名称: ",
                    appName
                  );
                }
                return beforeTitleToolTip;
              },
              title: (tooltipItems, data) => {
                const titleIndex = tooltipItems[0].index;
                const title = data.appCodes[titleIndex];
                let titleToolTip = "";
                if (title) {
                  titleToolTip = titleToolTip.concat("应用编码: ", title);
                }
                return titleToolTip;
              },
              afterTitle: (tooltipItems, data) => {
                const afterTitleIndex = tooltipItems[0].index;
                const supplierName = data.supplierNames[afterTitleIndex];
                let afterTitleToolTip = "";
                if (supplierName) {
                  afterTitleToolTip = afterTitleToolTip.concat(
                    "开发商名称: ",
                    supplierName
                  );
                }
                return afterTitleToolTip;
              },
              // beforeTitle: function (tooltipItems, data) {
              //   const beforeTitleIndex = tooltipItems[0].index
              //   const appName = data.supplierNames[beforeTitleIndex]
              //   let beforeTitleToolTip = ''
              //   if (appName) {
              //     beforeTitleToolTip = beforeTitleToolTip.concat("开发商名称: ", appName)
              //   }
              //   return beforeTitleToolTip
              // },
              // title: ((tooltipItems, data) => {
              //   const titleIndex = tooltipItems[0].index
              //   const appCode = data.supplierCodes[titleIndex]
              //   let titleToolTip = ''
              //   if (appCode) {
              //     titleToolTip = titleToolTip.concat("开发商编码: ", appCode)
              //   }
              //   return titleToolTip
              // }),
              // afterTitle: ((tooltipItems, data) => {
              //   const afterTitleIndex = tooltipItems[0].index
              //   const afterTitle = data.appCodes[afterTitleIndex]
              //   let afterTitleToolTip = ''
              //   if (afterTitle) {
              //     afterTitleToolTip = afterTitleToolTip.concat("应用编码: ", afterTitle)
              //   }
              //   return afterTitleToolTip
              // }),
              // label: ((tooltipItems, data) => {
              //   const index = tooltipItems.index
              //   let toolTip = ''
              //   const label = data.labels[index]
              //   if (label) {
              //     toolTip = toolTip.concat(label)
              //   }
              //   return toolTip
              // })
            },
          },
          animation: false,
          scales: {
            yAxes: [
              {
                stacked: true,
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontSize: 14,
                },
              },
            ],
            xAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false,
                  offsetGridLines: false,
                },
                ticks: {
                  fontSize: 14,
                  display: false,
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          layout: {
            padding: {
              left: 0,
              right: 70,
              top: 0,
              bottom: 0,
            },
          },
        };
      });
    },

    getCalleeOfTop10Data() {
      console.info(this.qualifiedName);
      //--TOP10调用方数据样例
      let params = {
        qualifiedName: this.qualifiedName,
        days: this.timesRadio,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.timesRadio === "-1") {
        params = {
          qualifiedName: this.qualifiedName,
          startTime: this.startTime,
          endTime: this.endTime,
        };
      }
      request({
        url: "/apiCallCollection/top10Datas",
        params: params,
        method: "get",
      }).then((rsp) => {
        this.topBarLoading = false;
        this.calleeOfTop10Monitor = "online";
        this.calleeOfTop10Data = {
          //--2020.08.18修改为应用名称
          labels: rsp.data.appNames,
          datasets: [
            {
              barBackground: "rgba(221, 224, 229, 1)",
              barThickness: 16,
              backgroundColor: [
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
              ],
              borderColor: [
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
                "#628EFF",
              ],
              data: rsp.data.data,
            },
          ],
          //--开发商
          supplierNames: rsp.data.supplierNames,
          //--开发商编码
          supplierCodes: rsp.data.supplierCodes,
          //--应用编码
          appCodes: rsp.data.labels,
        };
        this.calleeOfTop10Options = {
          tooltips: {
            enabled: true,
            callbacks: {
              beforeTitle: function (tooltipItems, data) {
                const beforeTitleIndex = tooltipItems[0].index;
                const appName = data.labels[beforeTitleIndex];
                let beforeTitleToolTip = "";
                if (appName) {
                  beforeTitleToolTip = beforeTitleToolTip.concat(
                    "应用名称: ",
                    appName
                  );
                }
                return beforeTitleToolTip;
              },
              title: (tooltipItems, data) => {
                const titleIndex = tooltipItems[0].index;
                const title = data.appCodes[titleIndex];
                let titleToolTip = "";
                if (title) {
                  titleToolTip = titleToolTip.concat("应用编码: ", title);
                }
                return titleToolTip;
              },
              afterTitle: (tooltipItems, data) => {
                const afterTitleIndex = tooltipItems[0].index;
                const supplierName = data.supplierNames[afterTitleIndex];
                let afterTitleToolTip = "";
                if (supplierName) {
                  afterTitleToolTip = afterTitleToolTip.concat(
                    "开发商名称: ",
                    supplierName
                  );
                }
                return afterTitleToolTip;
              },
            },
          },
          animation: false,
          scales: {
            yAxes: [
              {
                stacked: true,
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontSize: 14,
                },
              },
            ],
            xAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false,
                  offsetGridLines: false,
                },
                ticks: {
                  fontSize: 14,
                  display: false,
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          layout: {
            padding: {
              left: 0,
              right: 70,
              top: 0,
              bottom: 0,
            },
          },
        };
      });
    },

    //--调用量折线图
    getCalleeData() {
      let params = {
        qualifiedName: this.qualifiedName,
        days: this.timesRadio,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.timesRadio === "-1") {
        params = {
          qualifiedName: this.qualifiedName,
          startTime: this.startTime,
          endTime: this.endTime,
        };
      }
      request({
        url: "/apiCallCollection/callOfTotalByDayData",
        params: params,
        method: "get",
      }).then((rsp) => {
        this.lineLoading = false;
        let calleeOfMethodData = rsp.data.data;
        let noData = true;
        for (let i = 0; i < calleeOfMethodData.length; i++) {
          if (calleeOfMethodData[i] !== "0") {
            noData = false;
            break;
          }
        }
        if (noData) {
          calleeOfMethodData = [];
        }
        let ctx = document.getElementById("line-chart").getContext("2d");
        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
        gradient.addColorStop(0.2, "rgba(255, 0, 0, 0.25)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
        this.calleeData = {
          labels: rsp.data.labels,
          datasets: [
            {
              backgroundColor: gradient,
              label: "调用量",
              pointBackgroundColor: "#FF6D6E",
              pointSize: 1,
              borderColor: "#FF6D6E",
              lineTension: 0.2,
              borderWidth: 3,
              data: calleeOfMethodData,
            },
          ],
        };
        this.calleeOptions = {
          animation: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  fontSize: 12,
                  display: true,
                },
                gridLines: {
                  display: false,
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontSize: 12,
                  //display:false
                },
              },
            ],
          },
          legend: {
            display: false,
          },
          responsive: true,
          maintainAspectRatio: false,
        };
        // }
      });
    },

    //--方法调用甜甜圈图
    getCalleeOfMethodData() {
      var _this = this;
      let params = {
        qualifiedName: this.qualifiedName,
        days: this.timesRadio,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.timesRadio === "-1") {
        params = {
          qualifiedName: this.qualifiedName,
          startTime: this.startTime,
          endTime: this.endTime,
        };
      }
      request({
        url: "/apiCallCollection/callOfMethodData",
        params: params,
        method: "get",
      }).then((rsp) => {
        this.methodPieLoading = false;
        let calleeOfMethodData = rsp.data.data;
        this.calleeOfMethodBarMonitor = "online";
        let length = calleeOfMethodData.length;
        let backgroundColor = [];
        for (let i = 0; i < length; i++) {
          if (i < 10) {
            backgroundColor[i] = this.baseBarBackgroundColor[i];
          } else {
            backgroundColor[i] =
              this.baseBarBackgroundColor[Math.floor(Math.random() * 8)];
          }
        }
        this.calleeOfMethodData = {
          labels: rsp.data.labels,
          datasets: [
            {
              data: rsp.data.data,
              backgroundColor: backgroundColor,
              borderWidth: 2,
            },
          ],
          //--应用名称
          appNames: rsp.data.appNames,
          //--应用编码
          appCodes: rsp.data.appCodes,
          //--方法中文名称
          methodNames: rsp.data.methodNames,
        };
        this.calleeOfMethodOptions = {
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          pieceLabel: {
            mode: "percentage",
            precision: 1,
          },
          legend: {
            position: "right",
          },
          cutoutPercentage: 70,
          onHover: function (e) {
            const point = this.getElementAtEvent(e);
            if (point.length) {
              e.target.style.cursor = "pointer";
            } else {
              e.target.style.cursor = "default";
            }
          },
          onClick: function (evt, item) {
            if (item && item[0]) {
              const methodName = item[0]["_model"].label;
              if (methodName) _this.getTop10CalleeOfMethodWithApp(methodName);
            }
          },
          tooltips: {
            enabled: true,
            callbacks: {
              beforeTitle: function (tooltipItems, data) {
                const beforeTitleIndex = tooltipItems[0].index;
                const methodName = data.labels[beforeTitleIndex];
                let beforeTitleToolTip = "";
                if (methodName) {
                  beforeTitleToolTip = beforeTitleToolTip.concat(
                    "方法名称: ",
                    methodName
                  );
                }
                return beforeTitleToolTip;
              },

              title: (tooltipItems, data) => {
                const titleIndex = tooltipItems[0].index;
                const title = data.methodNames[titleIndex];
                let titleToolTip = "";
                // if (title) {
                titleToolTip = titleToolTip.concat("方法中文名称: ", title);
                // }
                return titleToolTip;
              },

              afterTitle: (tooltipItems, data) => {
                const afterTitleIndex = tooltipItems[0].index;
                const afterTitle = data.appNames[afterTitleIndex];
                let afterTitleToolTip = "";
                afterTitleToolTip = afterTitleToolTip.concat(
                  "应用名称: ",
                  afterTitle
                );
                return afterTitleToolTip;
              },

              label: (tooltipItems, data) => {
                const index = tooltipItems.index;
                let toolTip = "";
                const label = data.labels[index];
                const dataset = data["datasets"][0];
                let sum = 0;
                for (let i = 0; i < dataset.data.length; i++) {
                  sum += Number(dataset.data[i]);
                }
                const percent = Math.round(
                  (dataset["data"][tooltipItems["index"]] / sum) * 10000
                );
                if (label) {
                  toolTip = toolTip.concat(label, " (" + percent / 100 + "%)");
                }
                return toolTip;
              },
            },
          },
        };
      });
    },

    getTop10CalleeOfMethodWithApp(val) {
      if (this.timesRadio === "-1") {
        if (!(this.startTime === "" && this.endTime === "")) {
          this.methodOrAppRadio = "2";
          this.currentMethodName = val;
          this.getTop10BarCalleeOfMethodWithApp(val);
        }
      } else {
        this.methodOrAppRadio = "2";
        this.currentMethodName = val;
        this.getTop10BarCalleeOfMethodWithApp(val);
      }
    },

    onQueryTop10AppDataOfMethod() {
      if (this.timesRadio === "-1") {
        if (!(this.startTime === "" && this.endTime === "")) {
          this.methodOrAppRadio = "1";
          this.methodPieLoading = true;
          this.methodBarLoading = true;
          //--调用方法饼图数据
          this.getCalleeOfMethodData();
        }
      } else {
        this.methodOrAppRadio = "1";
        this.methodPieLoading = true;
        this.methodBarLoading = true;
        //--调用方法饼图数据
        this.getCalleeOfMethodData();
      }
    },

    //--调用TOP10调用方法的App应用
    getTop10BarCalleeOfMethodWithApp(val) {
      console.info(this.qualifiedName);
      let params = {
        qualifiedName: this.qualifiedName,
        methodName: val,
        days: this.timesRadio,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      if (this.timesRadio === "-1") {
        params = {
          qualifiedName: this.qualifiedName,
          methodName: val,
          startTime: this.startTime,
          endTime: this.endTime,
        };
      }
      request({
        url: "/apiCallCollection/top10SelectMethodData",
        params: params,
        method: "get",
      }).then((rsp) => {
        this.methodBarLoading = false;
        let appNames = rsp.data.appNames;
        this.calleeOfMethodBarMonitor = "online";
        let length = appNames.length;
        let backgroundColor = [];
        let borderColor = [];
        for (let i = 0; i < length; i++) {
          backgroundColor[i] = "#628EFF";
          borderColor[i] = "#628EFF";
        }
        // const height = 25 * length + 40
        // if (height > 300) {
        //   this.calleeOfTopTotalPx = height.toString() + 'px'
        // }
        this.calleeOfMethodBarData = {
          labels: rsp.data.appNames,
          datasets: [
            {
              barBackground: "rgba(221, 224, 229, 1)",
              barThickness: 16,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              data: rsp.data.data,
            },
          ],
          //--开发商
          supplierNames: rsp.data.supplierNames,
          //--开发商编码
          supplierCodes: rsp.data.supplierCodes,
          //--应用编码
          appCodes: rsp.data.labels,
        };
        this.calleeOfMethodBarOptions = {
          tooltips: {
            enabled: true,
            callbacks: {
              // beforeTitle: function (tooltipItems, data) {
              //   const beforeTitleIndex = tooltipItems[0].index
              //   const appName = data.supplierNames[beforeTitleIndex]
              //   let beforeTitleToolTip = ''
              //   if (appName) {
              //     beforeTitleToolTip = beforeTitleToolTip.concat("开发商名称: ", appName)
              //   }
              //   return beforeTitleToolTip
              // },
              // title: ((tooltipItems, data) => {
              //   const titleIndex = tooltipItems[0].index
              //   const appCode = data.supplierCodes[titleIndex]
              //   let titleToolTip = ''
              //   if (appCode) {
              //     titleToolTip = titleToolTip.concat("开发商编码: ", appCode)
              //   }
              //   return titleToolTip
              // }),
              // afterTitle: ((tooltipItems, data) => {
              //   const afterTitleIndex = tooltipItems[0].index
              //   const afterTitle = data.appCodes[afterTitleIndex]
              //   let afterTitleToolTip = ''
              //   if (afterTitle) {
              //     afterTitleToolTip = afterTitleToolTip.concat("应用编码: ", afterTitle)
              //   }
              //   return afterTitleToolTip
              // }),
              // label: ((tooltipItems, data) => {
              //   const index = tooltipItems.index
              //   let toolTip = ''
              //   const label = data.labels[index]
              //   if (label) {
              //     toolTip = toolTip.concat(label)
              //   }
              //   return toolTip
              // })
              beforeTitle: function (tooltipItems, data) {
                const beforeTitleIndex = tooltipItems[0].index;
                const appName = data.labels[beforeTitleIndex];
                let beforeTitleToolTip = "";
                if (appName) {
                  beforeTitleToolTip = beforeTitleToolTip.concat(
                    "应用名称: ",
                    appName
                  );
                }
                return beforeTitleToolTip;
              },
              title: (tooltipItems, data) => {
                const titleIndex = tooltipItems[0].index;
                const title = data.appCodes[titleIndex];
                let titleToolTip = "";
                if (title) {
                  titleToolTip = titleToolTip.concat("应用编码: ", title);
                }
                return titleToolTip;
              },
              afterTitle: (tooltipItems, data) => {
                const afterTitleIndex = tooltipItems[0].index;
                const supplierName = data.supplierNames[afterTitleIndex];
                let afterTitleToolTip = "";
                if (supplierName) {
                  afterTitleToolTip = afterTitleToolTip.concat(
                    "开发商名称: ",
                    supplierName
                  );
                }
                return afterTitleToolTip;
              },
            },
          },
          animation: false,
          scales: {
            yAxes: [
              {
                stacked: true,
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontSize: 14,
                },
              },
            ],
            xAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false,
                  offsetGridLines: false,
                },
                ticks: {
                  fontSize: 14,
                  display: false,
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          layout: {
            padding: {
              left: 0,
              right: 70,
              top: 0,
              bottom: 0,
            },
          },
        };
      });
    },
  },
  mounted() {
    this.getAllMonitorDatas();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-row {
  margin-bottom: 20px;
}

::v-deep .el-card__body {
  padding: 0px;
}

::v-deep .el-dialog__body {
  overflow: auto;
  height: 600px;
  width: 100%;
}

::v-deep .el-radio-button__inner {
  font-weight: normal;
}
</style>
