<template>
  <div class="submit-xml">
    <div class="xml-way">
      <span class="xml-way-label">请选择API文档生成方式:</span>
      <el-radio v-model="registerType" label="1" @change="updateRegisterType()"
        ><span>IDEA插件</span></el-radio
      >
      <el-radio v-model="registerType" label="2" @change="updateRegisterType()">
        <span> 拉取JSF元数据</span>
        <el-tooltip
          class="item"
          effect="dark"
          content="若方法中含有泛型参数，不建议使用此种方式"
          placement="bottom"
        >
          <i class="el-icon-help-solid"></i>
        </el-tooltip>
      </el-radio>
    </div>
    <div v-if="registerType == 1">
      <el-upload
        drag
        class="entrySuccess dlk-inline"
        action="upload"
        :auto-upload="false"
        :on-change="imageOnChange"
        :file-list="fileList"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将IDEA插件生成的API描述文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div style="color: blue" slot="tip">
          <a :href="this.registerPath" target="_blank">如何获取API描述文件?</a>
        </div>
      </el-upload>
    </div>
    <div v-if="registerType == 2">
      <p class="xml-desc">
        填写以下信息之前，请确保JSF服务已按
        <a :href="this.apiPublishPath" style="color: #3c6ef0" target="_blank"
          >《API部署手册》</a
        >
        部署完成
      </p>
      <el-form
        :model="jsfDate"
        :rules="rules"
        ref="jsfDate"
        :show-message="false"
        label-width="130px"
      >
        <el-form-item label="JSF接口名" prop="qualifiedName">
          <el-input
            v-model.trim="jsfDate.qualifiedName"
            placeholder="示例：com.jd.lcp.xxx.api.xxx"
            maxlength="500"
            @change="updateQualifiedName()"
          />
        </el-form-item>
        <el-form-item label="JSF别名" prop="jsfAlias">
          <el-select
            v-model="jsfDate.jsfAlias"
            filterable
            placeholder="请选择"
            class="inline-input"
            @change="updatejsfAlias()"
          >
            <el-option
              v-for="item in this.jsfAliasList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="JSF方法名" prop="methodList">
          <el-select
            v-model="jsfDate.methodList"
            multiple
            placeholder="请选择"
            filterable
            :remote="true"
            :reserve-keyword="true"
            :remote-method="querySearch"
            @visible-change="onMethodListVisibleChange"
            class="inline-input"
          >
            <el-option
              v-for="item in methodMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="xml-button">
        <el-button @click="previous()">上一步</el-button>
        <el-button type="primary" @click="next()">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import gwApiRequest from "@/utils/gwApiRequest.js";
import { gwUploadXmlRequest } from "@/utils/gw-request.js";

export default {
  props: {
    apiMessage: Object,
  },
  data() {
    return {
      fileList: [],
      registerPath: "",
      registerType: "1",
      apiPublishPath: "",
      jsfDate: {
        qualifiedName: "",
        methodList: [],
        jsfAlias: "",
      },
      //后端返回的方法的列表
      methodMap: [],
      methodName: "",
      jsfAliasList: [],
      rules: {
        qualifiedName: [{ required: true, message: "请填写【JSF接口名】" }],
        methodList: [{ required: true, message: "请填写【JSF方法名】" }],
        jsfAlias: [{ required: true, message: "请选择【JSF别名】" }],
      },
    };
  },
  methods: {
    async queryAliasByInterface() {
      const url = "/JsfApiMetaService/queryAliasByInterface";
      let { qualifiedName } = this.jsfDate;
      qualifiedName = qualifiedName.trim();
      const data = [{ qualifiedName }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async queryMethodByCondition(keyWords = undefined) {
      const url = "/JsfApiMetaService/queryMethodByCondition";
      const { qualifiedName, jsfAlias } = this.jsfDate;
      const data = [{ qualifiedName, jsfAlias, keyWords }];
      keyWords === undefined && delete data[0].keyWords;
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async findApiXmlDoc() {
      const url = "/JsfApiMetaService/findApiXmlDoc";
      const { qualifiedName, jsfAlias, methodList } = this.jsfDate;
      const data = [{ qualifiedName, jsfAlias, methodList }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async queryApiByCondition() {
      const url = "/ApiManagerService/queryApiByCondition";
      const [pageSize, pageNumb, searchKeyWord, businessCategoryId] = [
        1,
        1,
        null,
        null,
      ];
      const data = [
        { pageSize, pageNumb },
        { searchKeyWord, businessCategoryId, sceneType: 1 },
      ];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async upload(data) {
      const params = {
        "LOP-DN": window.env.gatewayUploadLopDnXml,
      };
      return await gwUploadXmlRequest
        .post("/lop/mulfile/upload", data, {
          params,
        })
        .catch((error) => {
          console.log("upload", error);
          this.fileList = [];
          this.$message.error("上传失败，请重新上传");
          throw new Error("upload");
        });
    },
    async verifyApi(jssKey) {
      const data = [jssKey];
      return await gwApiRequest.post(
        "/ApiManagerService/verifyApi",
        JSON.stringify(data)
      );
    },
    onMethodListVisibleChange(visible) {
      if (!visible) {
        this.getBlurryMethodList("");
      }
    },
    initRegisterType() {
      if (
        this.apiMessage.registerType === null ||
        this.apiMessage.registerType === undefined ||
        this.apiMessage.registerType === ""
      ) {
        this.getRegisterType();
      } else {
        this.registerType = this.apiMessage.registerType;
      }
      //初始化接口名，别名和方法列表
      this.initQualifiedName();
    },
    async getRegisterType() {
      const response = await this.queryApiByCondition().catch(() => {
        throw new Error("getRegisterType queryApiByCondition");
      });
      const { data } = response;
      const { list } = data;
      if (list && list.length > 0) {
        this.registerType = JSON.stringify(list[0].registerType);
      }
      this.apiMessage.registerType = this.registerType;
    },
    initQualifiedName() {
      if (
        this.apiMessage.jsfDate.qualifiedName !== null &&
        this.apiMessage.jsfDate.qualifiedName !== undefined
      ) {
        this.jsfDate.qualifiedName = this.apiMessage.jsfDate.qualifiedName;
        //初始话别名
        this.initJsfAlias();
      }
    },
    initJsfAlias() {
      if (
        this.apiMessage.jsfDate.jsfAlias !== null &&
        this.apiMessage.jsfDate.jsfAlias !== undefined
      ) {
        this.getJsfAliasList();
      }
    },
    initMethodList() {
      if (
        this.apiMessage.jsfDate.methodList !== null &&
        this.apiMessage.jsfDate.methodList !== undefined
      ) {
        this.getAllMethodList();
        this.fillJsfDateMethodList();
      }
    },
    async imageOnChange(file, fileList) {
      if (file.raw.type !== "text/xml") {
        this.$message.error("只支持xml格式的文件！");
        this.fileList = [];
        return false;
      }
      const formData = new FormData();
      formData.append("file", file.raw);
      const response = await this.upload(formData).catch(() => {
        throw new Error("imageOnChange upload");
      });
      const [jssKey] = response.data.fileName;
      const { data } = await this.verifyApi(jssKey).catch(() => {
        this.fileList = [];
        throw new Error("imageOnChange verifyApi");
      });
      const { qualifiedName, apiXml } = data;
      if (qualifiedName.length >= 255) {
        this.fileList = [];
        this.$message.error("服务名称必须小于255个字符!");
      } else {
        this.$message({
          duration: 2000,
          message: "上传API文件成功",
          type: "success",
        });
        sessionStorage.removeItem("apiXml");
        sessionStorage.setItem("apiXml", escape(apiXml));
        this.apiMessage.qualifiedName = qualifiedName;
        this.apiMessage.registerType = this.registerType;
        this.$emit("next");
      }
    },
    updateRegisterType() {
      sessionStorage.removeItem("apiXml");
      this.apiMessage.qualifiedName = "";
      this.apiMessage.cnName = "";
      this.apiMessage.registerType = "";
      this.apiMessage.jsfDate = new Object();
      this.methodMap = [];
      this.methodName = "";
      this.jsfAliasList = [];
      this.jsfDate.qualifiedName = "";
      this.jsfDate.methodList = [];
      this.jsfDate.jsfAlias = "";
    },
    /**
     * 当接口名称有改变时，会清空别名和方法列表
     */
    updateQualifiedName() {
      console.log(this.jsfDate.qualifiedName);

      this.methodMap = [];
      this.jsfDate.methodList = [];
      this.methodName = "";
      this.jsfDate.jsfAlias = "";
      this.jsfAliasList = [];
      // 重新获取jsf别名
      this.getJsfAliasList();
    },
    //获得jsf别名列表
    async getJsfAliasList() {
      if (
        this.jsfDate.qualifiedName === undefined ||
        this.jsfDate.qualifiedName.trim() === ""
      ) {
        this.$message.error("请填写【JSF接口名】");
        return;
      }
      const response = await this.queryAliasByInterface().catch(() => {
        throw new Error("getJsfAliasList queryAliasByInterface");
      });
      const { data } = response;
      if (data && data.length > 0) {
        this.jsfAliasList = data;
        if (
          this.jsfAliasList.indexOf(this.apiMessage.jsfDate.jsfAlias) !== -1
        ) {
          this.jsfDate.jsfAlias = this.apiMessage.jsfDate.jsfAlias;
          //初始化方法列表
          this.initMethodList();
        } else {
          this.apiMessage.jsfDate.jsfAlias = "";
        }
      }
    },
    //当修改jsf别名时，清空方法名和方法列表，重新获得方法列表
    updatejsfAlias() {
      // this.methodMap = [];
      // this.jsfDate.methodList = [];
      this.methodName = "";
      console.log(this.jsfDate.methodList);
      // 重新获得方法列表
      this.getAllMethodList();
    },
    async getAllMethodList() {
      const response = await this.queryMethodByCondition().catch(() => {
        throw new Error("getAllMethodList queryMethodByCondition");
      });
      const { data } = response;
      this.methodMap =
        data.map((item) => {
          const value = item;
          return { label: value, value: value };
        }) || [];
      if (!(data && data.length > 0)) {
        this.apiMessage.jsfDate.methodList = [];
      }
    },
    //给jsfDate.MethodList赋值
    fillJsfDateMethodList() {
      this.jsfDate.methodList = [];
      for (
        let index = 0;
        index < this.apiMessage.jsfDate.methodList.length;
        index++
      ) {
        this.jsfDate.methodList.push(this.apiMessage.jsfDate.methodList[index]);
      }
    },

    /**
     * 方法名查询,这里模糊查询，需要访问后端
     */
    querySearch(queryString) {
      //联调下面注释打开
      this.getBlurryMethodList(queryString);
    },
    //获得模糊匹配的方法的集合
    async getBlurryMethodList(queryString) {
      if (
        this.jsfDate.qualifiedName === undefined ||
        this.jsfDate.qualifiedName.trim() === ""
      ) {
        this.$message.error("请填写【JSF接口名】");
        return;
      }
      if (this.jsfDate.jsfAlias === undefined || this.jsfDate.jsfAlias === "") {
        this.$message.error("请选择【JSF别名】");
        return;
      }
      const response = await this.queryMethodByCondition(queryString).catch(
        () => {
          throw new Error("getBlurryMethodList queryMethodByCondition");
        }
      );
      const { data } = response;
      this.putMethodMap(data);
    },
    //后端返回的方法List填充到methodMap中
    putMethodMap(methodList) {
      let methodMap = [];
      for (let index = 0; index < methodList.length; index++) {
        methodMap.push({ value: methodList[index] });
      }
      this.$set(this, "methodMap", methodMap);
    },
    handleSelect(item) {
      console.log(item);
      if (this.jsfDate.methodList.indexOf(item.value) < 0) {
        this.jsfDate.methodList.push(item.value);
      }
      this.methodName = "";
    },
    handleClose(tag) {
      this.jsfDate.methodList.splice(this.jsfDate.methodList.indexOf(tag), 1);
    },
    previous() {
      this.$emit("previous");
    },
    next() {
      if (
        this.jsfDate.qualifiedName === undefined ||
        this.jsfDate.qualifiedName.trim() === ""
      ) {
        this.$message.error("请填写【JSF接口名】");
        return;
      }
      if (this.jsfDate.jsfAlias === undefined || this.jsfDate.jsfAlias === "") {
        this.$message.error("请选择【JSF别名】");
        return;
      }
      if (
        this.jsfDate.methodList === undefined ||
        this.jsfDate.methodList.length < 1
      ) {
        this.$message.error("请填写【JSF方法名】");
        return;
      }
      sessionStorage.removeItem("apiXml");
      this.getApiXml();
    },
    async getApiXml() {
      const response = await this.findApiXmlDoc().catch(() => {
        throw new Error("getApiXml findApiXmlDoc");
      });
      const { data } = response;
      sessionStorage.removeItem("apiXml");
      sessionStorage.setItem("apiXml", escape(data));
      this.apiMessage.registerType = this.registerType;
      this.apiMessage.qualifiedName = this.jsfDate.qualifiedName;
      this.apiMessage.jsfDate = this.jsfDate;
      console.log(this.jsfDate);
      this.$emit("next");
    },
  },
  mounted() {
    sessionStorage.removeItem("apiXml");
    this.registerPath =
      window.location.protocol +
      "//" +
      `${window.location.host}/#` +
      `${window.env.docDescription}`;

    this.apiPublishPath =
      window.location.protocol +
      "//" +
      `${window.location.host}/#` +
      `${window.env.docApiPublish}`;

    // 初始化注册类型
    this.initRegisterType();
  },
};
</script>

<style lang="scss" scoped>
.submit-xml {
  width: 500px;
  margin: 20px auto;

  .inline-input {
    width: 100%;
  }
  .xml-way {
    margin: 30px auto;
    .xml-way-label {
      margin-right: 20px;
      font-weight: 700;
      color: #666;
    }
  }
  .xml-desc {
    margin: 20px auto;
    color: #b5b5b5;
  }
  .xml-button {
    margin: 30px auto;
  }
  .el-icon-help-solid {
    margin-left: 5px;
  }
}
</style>
