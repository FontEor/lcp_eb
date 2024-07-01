<template>
  <div class="isv">
    <div class="isv-tit-view">
      <h2 class="big-tit">
        <span style="font-weight: 600">ISV资质</span>
        <div class="com-tag" :class="computeStatusClass">
          {{ computeStatusText }}
        </div>
      </h2>
      <p class="tip" v-if="isvForm.updateTime">
        认证状态更新于
        {{ isvForm.updateTime | parseTimefilter("{y}-{m}-{d} {h}:{i}") }}
      </p>
      <p class="tip" v-else>
        资质认证过程中遇到问题，您可以通过<a
          href="https://cloud.jdl.com/admin/#/upgrade/work-order"
          target="_blank"
          >提交工单</a
        >的方式获得帮助
      </p>
    </div>
    <div class="isv-container">
      <SubmitSuccess v-if="isSubmitSuccess" />
      <div v-else class="container-form">
        <!-- 企业信息 -->
        <div class="form-divider">
          <el-divider content-position="left"
            ><h2 class="divider-title">企业信息</h2></el-divider
          >
        </div>
        <el-form
          class="form-enterprise-information"
          ref="isvInfoForm"
          :model="isvForm"
          :rules="isvFormRules"
          label-width="180px"
        >
          <el-form-item label="上传工商执照" prop="businessLicenseJss">
            <div class="enterprise-information-update">
              <el-upload
                class="update-normal"
                action="upload"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="imageOnChange"
              >
                <img
                  v-if="this.isvForm.businessLicenseJss"
                  :src="this.isvForm.businessLicenseJss"
                  class="update-normal-avatar"
                />
                <i v-else class="el-icon-plus update-normal-icon"></i>
              </el-upload>
              <div class="upload-desc">
                <ul>
                  <li>支持JPG、JPEG、PNG格式，图片大小不超过2MB</li>
                  <li>营业执照中信息必须与工商信息一致</li>
                  <li>上传图片必须为实物图片，并且露出四个角</li>
                  <li>上传图片如果不够清晰，会审核不通过</li>
                </ul>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="营业执照有效日期" prop="businessValidityType">
            <el-radio-group
              v-model="isvForm.businessValidityType"
              @change="businessValidityTypeChange"
            >
              <el-radio :label="1">长期</el-radio>
              <el-radio :label="2">
                固定日期
                <span v-if="businessDataStatus === 1">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    style="margin-left: 20px"
                    v-model="isvForm.tmpBusinessDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input
              class="form-content"
              v-model="isvForm.productName"
              placeholder="如快递100、快递鸟"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业官网" prop="officialWebsite">
            <el-input
              class="form-content"
              v-model="isvForm.officialWebsite"
              placeholder='如 www.jdl.com,没有填"无"'
            ></el-input>
          </el-form-item>
          <el-form-item label="企业图标" prop="enterpriseLogoJss">
            <div class="enterprise-information-update">
              <div class="upload-inside-content">
                <el-upload
                  class="avatar-uploader"
                  action="imageOnChangeLogo"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="imageOnChangeLogo"
                >
                  <img
                    v-if="this.isvForm.enterpriseLogoJss"
                    :src="this.isvForm.enterpriseLogoJss"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                    >上传企业图标</i
                  >
                </el-upload>
              </div>
              <div class="upload-desc">
                <ul>
                  <li>上传您的企业图标便于我们更好的了解您</li>
                  <li>支持JPG、BMP、PNG、JPEG</li>
                  <li>图片大小不超过5MB</li>
                </ul>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="上传软件著作权" prop="softWareCopyRightUrl">
            <div class="enterprise-information-update">
              <div class="upload-inside-content">
                <el-upload
                  class="avatar-uploader"
                  action="imageOnChangeSoftware"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="imageOnChangeSoftware"
                >
                  <img
                    v-if="this.isvForm.softWareCopyRightUrl"
                    :src="this.isvForm.softWareCopyRightUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus update-normal-icon"></i>
                </el-upload>
              </div>
              <div class="upload-desc">
                <ul>
                  <li>上传您的软件著作权便于我们审核您的资质</li>
                  <li>支持JPG、BMP、PNG、JPEG格式，图片大小不超过2MB</li>
                  <li>上传图片如果不够清晰，会审核不通过，并且露出完整图片</li>
                </ul>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <!-- 法人信息 -->
        <div class="form-divider">
          <el-divider content-position="left"
            ><h2 class="divider-title">法人信息</h2></el-divider
          >
        </div>
        <div class="form-legal-person">
          <el-form
            ref="isvIdcardForm"
            :model="isvForm"
            :inline="true"
            :rules="isvFormRules"
            label-width="180px"
          >
            <el-form-item label="法人身份证件" prop="idCardFrontJss">
              <div class="upload-inside-content">
                <el-upload
                  class="avatar-uploader"
                  action="imageOnChangeFront"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="imageOnChangeFront"
                >
                  <img
                    v-if="isvForm.idCardFrontJss"
                    :src="isvForm.idCardFrontJss"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                    >上传人像面</i
                  >
                  <p v-if="isvForm.idCardFrontJss" class="avatar-tip">
                    上传完成仅用于身份验证
                  </p>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item prop="idCardReverseJss">
              <div class="upload-inside-content">
                <el-upload
                  class="avatar-uploader"
                  action="imageOnChangeBack"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="imageOnChangeBack"
                >
                  <img
                    v-if="isvForm.idCardReverseJss"
                    :src="isvForm.idCardReverseJss"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                    >上传国徽面</i
                  >
                  <p v-if="isvForm.idCardReverseJss" class="avatar-tip">
                    上传完成仅用于身份验证
                  </p>
                </el-upload>
              </div>
            </el-form-item>
            <el-button
              type="text"
              @click="dialogVisible = true"
              class="view-btn"
              >查看示意</el-button
            >
            <div class="id-card-desc">
              为了帮助我们更好地解决问题，请上传图片，每张不超过5M,<br />支持JPG、BMP、PNG、JPEG
            </div>
          </el-form>
          <el-form
            ref="isvIdInfoForm"
            :model="isvForm"
            :rules="isvFormRules"
            label-width="180px"
          >
            <el-form-item label="法人代表姓名" prop="legalPersonName">
              <el-input
                class="form-content"
                v-model="isvForm.legalPersonName"
                placeholder="法人代表姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="法人代表证件" prop="legalPersonIdCard">
              <div class="form-credential">
                <el-select
                  class="credential-select"
                  v-model="isvForm.credentialsType"
                  @change="handleCredentialChange"
                >
                  <el-option
                    v-for="item in credentialsTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-if="isvForm.credentialsType === 1"
                  v-model="isvForm.legalPersonIdCard"
                  placeholder="法人代表身份证号"
                ></el-input>
                <el-input
                  v-if="isvForm.credentialsType === 5"
                  v-model="isvForm.legalPersonIdCard"
                  placeholder="护照号"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="证件有效日期" prop="idCardValidityType">
              <el-radio-group
                v-model="isvForm.idCardValidityType"
                @change="idcardTypeChange"
              >
                <el-radio :label="1">长期</el-radio>
                <el-radio :label="2">
                  固定日期
                  <span v-if="idCardType === 1">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      style="margin-left: 20px"
                      v-model="isvForm.tmpCardDate"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-checkbox-group v-model="protocol" @change="accept">
                <el-checkbox name="protocol"
                  >我已阅读并接受<span
                    ><a @click="showJDXY" class="link"
                      >《京东物流开放平台开发者注册协议》</a
                    ></span
                  ></el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div class="submit-footer">
            <el-button
              :disabled="openIsDisabled"
              :loading="submitButtonLoading"
              type="primary"
              @click="onClickSubmitButton"
              >提交</el-button
            >
          </div>
        </div>
        <el-dialog title="注意事项" :visible.sync="dialogVisible" width="40%">
          <div>
            <p>1､上传的身份证件图片应清晰端正，信息完整；</p>
            <p>
              2､如上传身份证件复印件，正反面需加盖公章，勿进行任何软件处理；
            </p>
            <p>3､如上传护照图片，人像面与国徽面均上传资料页即可。</p>
          </div>
          <div style="margin-top: 20px">
            <img src="~@/assets/img/idnotice.svg" width="100%" />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <agreement ref="agreement" />
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { parseTime } from "@/utils";
import agreement from "@/views/isvManager/agreement.vue";
import SubmitSuccess from "@/views/extranet/applyQualification/submit-success.vue";

export default {
  name: "Isv",
  components: {
    agreement,
    SubmitSuccess,
  },
  data() {
    const validateLegalPersonIdCard = (rule, value, callback) => {
      if (this.isvForm.credentialsType === 1) {
        let pattern =
          /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
        if (!pattern.test(value)) {
          callback(new Error("请输入正确的法人代表证件号"));
        } else {
          callback();
        }
      } else if (this.isvForm.credentialsType === 5) {
        let pattern = /^.{9}$/;
        if (!pattern.test(value)) {
          callback(new Error("请输入正确的法人代表证件号"));
        } else {
          callback();
        }
      } else {
        callback(new Error("法人代表证件错误"));
      }
    };
    return {
      menuHeader: {
        statusTable: ["未认证", "审核中", "未通过", "已认证"],
        statusColor: [
          "initBtnColor",
          "updateBtnColor",
          "unknownBtnColor",
          "normalBtnColor",
        ],
      },
      protocol: [],
      isSubmitSuccess: false,
      /**
       * 提交按钮禁止设置
       */
      openIsDisabled: true,
      dialogVisible: false,
      credentialsTypeOptions: [
        {
          value: 1,
          label: "身份证",
        },
        {
          value: 5,
          label: "护照号",
        },
      ],
      isvForm: {
        id: "", //id
        name: "", //企业名称
        businessLicense: "", //营业执照
        contactsName: "", //联系人姓名
        contactsPhone: "", //联系人手机号
        contactsEmail: "", //联系人邮箱
        businessValidityType: 1, //营业执照类型
        businessStartDate: "", //营业执照开始日期
        businessEndDate: "", //营业执照结束日期
        tmpBusinessDate: "", //临时营业执照日期
        businessLicenseFileName: "", //营业执照文件名字
        businessLicenseJss: "", ///营业执照jss
        tmpCardDate: "", //临时身份证日期
        idCardValidityType: 1, //身份证证件类型
        legalPersonName: "", //法人代表姓名
        legalPersonIdCard: "", //法人代表身份证
        idCardStartDate: "", //身份证开始日期
        idCardEndDate: "", //身份证结束日期
        idCardFront: "", //身份证正面图片
        idCardReverse: "", //身份证反面图片
        idCardReverseJss: "", //身份证反面图片jss
        idCardFrontJss: "", //身份证正面图片jss
        idCardFrontFileName: "", //身份证正面图片名字
        idCardReverseFileName: "", //身份证背面图片名字
        cascaderLabel: [], //级联Label
        status: 0, //状态
        updateTime: "", //更新时间
        officialWebsite: "", //企业官网
        productName: "", //产品名称
        enterpriseLogo: "", //企业图片(filePath)
        enterpriseLogoFileName: "", //图片名称
        enterpriseLogoJss: "", //企业图片链接
        credentialsType: 1, //1为身份证,5为护照类型
        softWareCopyRightUrl: "", //软件著作权jss
        softWareCopyRightAuth: "", //软件著作权
        softWareCopyRightFileName: "", //软件著作权文件名
      },
      /**
       * 1:显示日期，2:不显示
       */
      businessDataStatus: 2,
      idCardType: 2,
      isvFormRules: {
        tmpBusinessDate: [
          //营业执照类型
          {
            required: true,
            message: "请填写固定日期",
            trigger: "change",
          },
        ],
        businessLicenseJss: [
          //工商执照
          { required: true, message: "工商执照不能为空" },
        ],
        idCardValidityType: [
          //证件有效日期
          {
            required: true,
            message: "请选择证件有效日期类型",
            trigger: "change",
          },
        ],
        idCardFrontJss: [
          //请选择法人身份证件
          {
            required: true,
            message: "请上传法人身份证件正面",
            trigger: "change",
          },
        ],
        idCardReverseJss: [
          //请选择法人身份证件
          {
            required: true,
            message: "请上传法人身份证件反面",
            trigger: "change",
          },
        ],
        legalPersonName: [
          //法人代表姓名
          { required: true, message: "请输入法人代表姓名" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
          },
        ],
        legalPersonIdCard: [
          //法人代表证件
          { required: true, message: "请输入法人代表证件号" },
          {
            validator: validateLegalPersonIdCard,
          },
        ],
        productName: [
          { required: true, message: "请输入产品名称" },
          { min: 1, max: 150, message: "长度在 1 到 150 个字符" },
        ],
        officialWebsite: [
          { required: true, message: "请输入企业官网" },
          { min: 1, max: 150, message: "长度在 1 到 150 个字符" },
        ],
        enterpriseLogoJss: [{ required: true, message: "请上传企业图标" }],
        softWareCopyRightUrl: [{ required: true, message: "请上传软件著作权" }],
      },
      submitButtonLoading: false,
      submitButtonDebounceTimer: null,
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      if (obj) {
        return parseTime(obj, fomart);
      } else {
        return "";
      }
    },
  },
  computed: {
    computeStatusText() {
      return this.menuHeader.statusTable[this.isvForm.status];
    },
    computeStatusClass() {
      return this.menuHeader.statusColor[this.isvForm.status];
    },
  },
  methods: {
    /**
     * 获取主子账号信息
     */
    async getUserRole() {
      return await request({
        url: "user/getUserRole",
        method: "get",
      })
        .then((res) => {
          if (res.data !== 1) {
            //子账号，跳转至资质管理界面
            this.$router.push({ path: "/qualificationManagement" });
          }
        })
        .catch((error) => {
          console.log(error);
          throw new Error(error);
        });
    },
    /**
     * 获取isv信息
     */
    getSupplierIsv() {
      request({
        url: "/supplierIsv/getClearSupplierIsv",
        method: "get",
      })
        .then((res) => {
          if (res.data.id) {
            //如果状态是审核中或已认证,则跳转到资质管理页面
            if (res.data.status === 1 || res.data.status === 3) {
              if (!this.isSubmitSuccess) {
                this.$router.push({ path: "/qualificationManagement" });
              }
            }
            this.isvForm.id = res.data.id; //id
            this.isvForm.name = res.data.name; //企业名称
            this.isvForm.businessLicense = res.data.businessLicense; //营业执照
            this.isvForm.businessValidityType = res.data.businessValidityType; //营业执照类型
            if (this.isvForm.businessValidityType === 0) {
              this.isvForm.businessValidityType = 1;
            }
            this.isvForm.businessStartDate = res.data.businessStartDate; //营业执照开始日期
            this.isvForm.businessEndDate = res.data.businessEndDate; //营业执照结束日期
            this.isvForm.tmpBusinessDate = [];
            if (res.data.businessStartDate) {
              this.isvForm.tmpBusinessDate.push(
                parseTime(res.data.businessStartDate, "{y}-{m}-{d}")
              );
            }
            if (res.data.businessEndDate) {
              this.isvForm.tmpBusinessDate.push(
                parseTime(res.data.businessEndDate, "{y}-{m}-{d}")
              );
            }
            this.isvForm.businessLicenseFileName =
              res.data.businessLicenseFileName; //营业执照文件名字
            this.isvForm.businessLicenseJss = res.data.businessLicenseJss; ///营业执照jss
            this.isvForm.idCardValidityType = res.data.idCardValidityType; //身份证证件类型
            if (this.isvForm.idCardValidityType === 0) {
              this.isvForm.idCardValidityType = 1;
            }
            this.isvForm.legalPersonName = res.data.legalPersonName; //法人代表姓名
            this.isvForm.legalPersonIdCard = res.data.legalPersonIdCard; //法人代表身份证
            this.isvForm.idCardStartDate = res.data.idCardStartDate; //身份证开始日期
            this.isvForm.idCardEndDate = res.data.idCardEndDate; //身份证结束日期
            this.isvForm.tmpCardDate = [];
            if (res.data.idCardStartDate) {
              this.isvForm.tmpCardDate.push(
                parseTime(res.data.idCardStartDate, "{y}-{m}-{d}")
              );
            }
            if (res.data.idCardEndDate) {
              this.isvForm.tmpCardDate.push(
                parseTime(res.data.idCardEndDate, "{y}-{m}-{d}")
              );
            }
            this.isvForm.idCardFront = res.data.idCardFront; //身份证正面图片
            this.isvForm.idCardReverse = res.data.idCardReverse; //身份证反面图片
            this.isvForm.idCardReverseJss = res.data.idCardReverseJss; //身份证反面图片jss
            this.isvForm.idCardFrontJss = res.data.idCardFrontJss; //身份证正面图片jss
            this.isvForm.idCardFrontFileName = res.data.idCardFrontFileName; //身份证正面图片名字
            this.isvForm.idCardReverseFileName = res.data.idCardReverseFileName; //身份证背面图片名字
            this.isvForm.status = res.data.status; //状态
            this.isvForm.updateTime = res.data.updateTime;
            this.isvForm.officialWebsite = res.data.officialWebsite; //企业官网
            this.isvForm.productName = res.data.productName; //产品名称
            this.isvForm.enterpriseLogo = res.data.enterpriseLogo; //企业图片(filePath)
            this.isvForm.enterpriseLogoFileName =
              res.data.enterpriseLogoFileName; //图片名称
            this.isvForm.enterpriseLogoJss = res.data.enterpriseLogoJss; //企业图片链接
            this.isvForm.softWareCopyRightUrl = res.data.softWareCopyRightUrl; //软件著作权图片链接
            this.isvForm.softWareCopyRightFileName =
              res.data.softWareCopyRightFileName;
            this.isvForm.softWareCopyRightAuth = res.data.softWareCopyRightAuth;
            this.isvForm.credentialsType = res.data.credentialsType; //1为身份证,5为护照类型
            this.idcardTypeChange();
            this.businessValidityTypeChange();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 图片状态改变时触发方法
     */
    imageOnChange(file, fileList) {
      const loading = this.$loading({
        // 声明一个loading对象
        lock: true, // 是否锁屏
        text: "正在上传...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.8)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      });
      //1.判断文件大小
      const isLt10M = file.size / 1024 / 1024 < 2;
      if (!isLt10M) {
        loading.close();
        this.$message.error("上传文件大小不能超过 2MB!");
        return;
      }
      //2.判断文件类型
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/bmp"
      ) {
        //符合类型
        const formData = new FormData();
        formData.append("fileImage", file.raw);
        formData.append("certificateType", 2);
        formData.append("operationType", 1);
        formData.append("imageType", "P");
        let url = "/supplierIsv/ocrProcess";
        request({
          url: url,
          method: "post",
          data: formData,
        })
          .then((rsp) => {
            loading.close();
            if (rsp.code === 20000) {
              let ret = rsp.data;
              this.isvForm.businessLicenseJss = ret.imageJss;
              this.isvForm.businessLicense = ret.filePath;
              this.isvForm.businessLicenseFileName = file.name;
            } else {
              this.$message.error("保存信息异常!");
            }
          })
          .catch((e) => {
            loading.close();
            console.log(e);
          });
        return;
      } else {
        //不符合文件类型
        loading.close();
        this.$message.error("不支持该格式的文件！");
        return;
      }
    },
    // 上传企业图标图片改变事件
    imageOnChangeLogo(file, fileList) {
      const loading = this.$loading({
        // 声明一个loading对象
        lock: true, // 是否锁屏
        text: "正在上传...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.8)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      });
      //1.判断文件大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        loading.close();
        this.$message.error("上传文件大小不能超过 5MB!");
        return;
      }
      //2.判断文件类型
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/bmp"
      ) {
        //符合类型
        const formData = new FormData();
        formData.append("fileImage", file.raw);
        formData.append("certificateType", 3);
        formData.append("operationType", 1);
        formData.append("imageType", "N");
        let url = "/supplierIsv/ocrProcess";
        request({
          url: url,
          method: "post",
          data: formData,
        })
          .then((rsp) => {
            if (rsp.code === 20000) {
              let ret = rsp.data;
              this.isvForm.enterpriseLogoJss = ret.imageJss;
              this.isvForm.enterpriseLogo = ret.filePath;
              this.isvForm.enterpriseLogoFileName = file.name;
              loading.close();
            } else {
              loading.close();
              this.$message.error("保存信息异常!");
            }
          })
          .catch((e) => {
            loading.close();
            console.log(e);
          });
        this.isvForm.idCardReverse = URL.createObjectURL(file.raw);
        return;
      } else {
        //不符合文件类型
        loading.close();
        this.$message.error("不支持该格式的文件！");
        return;
      }
    },
    // 上传软件著作权图片
    imageOnChangeSoftware(file, fileList) {
      const loading = this.$loading({
        // 声明一个loading对象
        lock: true, // 是否锁屏
        text: "正在上传...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.8)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      });
      //1.判断文件大小
      const isLt5M = file.size / 1024 / 1024 < 2;
      if (!isLt5M) {
        loading.close();
        this.$message.error("上传文件大小不能超过 2MB!");
        return;
      }
      //2.判断文件类型
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/bmp"
      ) {
        //符合类型
        const formData = new FormData();
        formData.append("fileImage", file.raw);
        formData.append("certificateType", 3);
        formData.append("operationType", 1);
        formData.append("imageType", "N");
        let url = "/supplierIsv/ocrProcess";
        request({
          url: url,
          method: "post",
          data: formData,
        })
          .then((rsp) => {
            if (rsp.code === 20000) {
              let ret = rsp.data;
              this.isvForm.softWareCopyRightUrl = ret.imageJss;
              this.isvForm.softWareCopyRightAuth = ret.filePath;
              this.isvForm.softWareCopyRightFileName = file.name;
              loading.close();
            } else {
              loading.close();
              this.$message.error("保存信息异常!");
            }
          })
          .catch((e) => {
            loading.close();
            console.log(e);
          });
        return;
      } else {
        //不符合文件类型
        loading.close();
        this.$message.error("不支持该格式的文件！");
        return;
      }
    },
    /**
     * 图片改变
     */
    imageOnChangeBack(file, fileList) {
      const loading = this.$loading({
        // 声明一个loading对象
        lock: true, // 是否锁屏
        text: "正在上传...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.8)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      });
      //1.判断文件大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        loading.close();
        this.$message.error("上传文件大小不能超过 5MB!");
        return;
      }
      //2.判断文件类型
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/bmp"
      ) {
        //符合类型
        const formData = new FormData();
        formData.append("fileImage", file.raw);
        formData.append("certificateType", 1);
        formData.append("operationType", 1);
        formData.append("imageType", "N");
        let url = "/supplierIsv/ocrProcess";
        request({
          url: url,
          method: "post",
          data: formData,
        })
          .then((rsp) => {
            if (rsp.code === 20000) {
              let ret = rsp.data;
              this.isvForm.idCardReverseJss = ret.imageJss;
              this.isvForm.idCardReverse = ret.filePath;
              this.isvForm.idCardReverseFileName = file.name;
              loading.close();
            } else {
              loading.close();
              this.$message.error("保存信息异常!");
            }
          })
          .catch((e) => {
            loading.close();
            console.log(e);
          });
        this.isvForm.idCardReverse = URL.createObjectURL(file.raw);
        return;
      } else {
        //不符合文件类型
        loading.close();
        this.$message.error("不支持该格式的文件！");
        return;
      }
    },
    /**
     * 接受选择事件
     */
    accept() {
      if (this.protocol.length === 1) {
        //选中
        this.openIsDisabled = false;
      } else if (this.protocol.length === 0) {
        //没选中
        this.openIsDisabled = true;
      }
    },
    /**
     * 图片改变
     */
    imageOnChangeFront(file, fileList) {
      const loading = this.$loading({
        // 声明一个loading对象
        lock: true, // 是否锁屏
        text: "正在上传...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.8)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      });
      //1.判断文件大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        loading.close();
        this.$message.error("上传文件大小不能超过 5MB!");
        return;
      }
      //2.判断文件类型
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/bmp"
      ) {
        //符合类型
        const formData = new FormData();
        formData.append("fileImage", file.raw);
        formData.append("certificateType", 1);
        formData.append("operationType", 1);
        formData.append("imageType", "P");
        let url = "/supplierIsv/ocrProcess";
        request({
          url: url,
          method: "post",
          data: formData,
        })
          .then((rsp) => {
            if (rsp.code === 20000) {
              let ret = rsp.data;
              this.isvForm.idCardFrontJss = ret.imageJss;
              this.isvForm.idCardFront = ret.filePath;
              this.isvForm.legalPersonName = ret.name;
              this.isvForm.legalPersonIdCard = ret.cardNo;
              this.isvForm.idCardFrontFileName = file.name;
              loading.close();
            } else {
              loading.close();
              this.$message.error("保存信息异常!");
            }
          })
          .catch((e) => {
            loading.close();
            console.log(e);
          });
        this.isvForm.idCardFront = URL.createObjectURL(file.raw);
        return;
      } else {
        //不符合文件类型
        loading.close();
        this.$message.error("不支持该格式的文件！");
        return;
      }
    },
    /**
     * 修改营业执照有效日期
     */
    businessValidityTypeChange() {
      if (this.isvForm.businessValidityType === 1) {
        this.businessDataStatus = 2;
        this.isvForm.businessStartDate = "";
        this.isvForm.businessEndDate = "";
        this.isvForm.tmpBusinessDate = "";
      } else if (this.isvForm.businessValidityType === 2) {
        this.businessDataStatus = 1;
      }
    },
    /**
     * 修改证件有效日期
     */
    idcardTypeChange() {
      if (this.isvForm.idCardValidityType === 1) {
        this.idCardType = 2;
        this.isvForm.idCardStartDate = "";
        this.isvForm.idCardEndDate = "";
        this.isvForm.tmpCardDate = "";
      } else if (this.isvForm.idCardValidityType === 2) {
        this.idCardType = 1;
      }
    },
    /**
     * 京东物流开发者注册协议
     */
    showJDXY() {
      this.$refs.agreement.showJDXY();
    },
    // 切换法人代表证件，清空legalPersonIdCard值
    handleCredentialChange() {
      this.isvForm.legalPersonIdCard = "";
    },
    /**
     * 提交
     */
    onClickSubmitButton() {
      let flag = true;
      //1.企业信息
      this.$refs["isvInfoForm"].validate((valid) => {
        if (!valid) {
          flag = false;
        }
      });
      //2.身份证信息
      this.$refs["isvIdcardForm"].validate((valid) => {
        if (!valid) {
          flag = false;
        }
      });
      //3.法人信息校验
      this.$refs["isvIdInfoForm"].validate((valid) => {
        if (!valid) {
          flag = false;
        }
      });

      //4.清除form表单验证
      if (this.isvForm.idCardReverse && this.isvForm.idCardFront) {
        this.$refs["isvIdcardForm"].clearValidate();
      }
      //5.校验日期
      if (
        this.isvForm.idCardValidityType === 2 &&
        this.isvForm.tmpCardDate == ""
      ) {
        this.$message.error("固定日期不能为空!");
        return;
      } else if (
        this.isvForm.idCardValidityType === 2 &&
        this.isvForm.tmpCardDate != ""
      ) {
        this.isvForm.idCardStartDate = this.isvForm.tmpCardDate[0];
        this.isvForm.idCardEndDate = this.isvForm.tmpCardDate[1];
      }
      if (
        this.isvForm.businessValidityType === 2 &&
        this.isvForm.tmpBusinessDate == ""
      ) {
        this.$message.error("固定日期不能为空!");
        return;
      } else if (
        this.isvForm.businessValidityType === 2 &&
        this.isvForm.tmpBusinessDate != ""
      ) {
        this.isvForm.businessStartDate = this.isvForm.tmpBusinessDate[0];
        this.isvForm.businessEndDate = this.isvForm.tmpBusinessDate[1];
      }
      if (flag) {
        clearTimeout(this.submitButtonDebounceTimer);
        this.submitButtonDebounceTimer = setTimeout(() => {
          this.submitButtonLoading = true;
          let url = "/supplierIsv/saveSupplierIsv";
          request({
            url: url,
            headers: { "Content-Type": "application/json" },
            method: "post",
            data: this.isvForm,
          })
            .then((rsp) => {
              if (rsp.code === 20000) {
                this.isSubmitSuccess = true;
                this.isvForm.status = 1;
                this.isvForm.updateTime = new Date().getTime();
                this.submitButtonLoading = false;
              } else {
                this.$message.error("保存信息异常!");
                this.submitButtonLoading = false;
              }
            })
            .catch((e) => {
              console.log(e);
              this.submitButtonLoading = false;
            });
        }, 300);
      }
    },
  },
  async mounted() {
    await this.getUserRole();
    this.getSupplierIsv();
  },
};
</script>

<style lang="scss" scoped>
.isv {
  .isv-tit-view {
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
    .big-tit {
      line-height: 26px;
      position: relative;
      font-size: 16px;
      .status-text {
        font-weight: 100;
      }
    }
    .tip {
      font-size: 14px;
      line-height: 24px;
      margin-top: 5px;
    }
  }

  .isv-container {
    background: #fff;
    margin: 20px;
    margin-bottom: 0;
    padding: 20px;
    min-height: calc(100vh - 218px);

    .container-form {
      width: 900px;
      margin: 0 auto;
      .form-divider {
        margin: 50px auto;
        .divider-title {
          font-size: 16px;
          color: #3c6ef0;
        }
      }
      .form-enterprise-information {
        .enterprise-information-update {
          display: flex;
          flex-direction: row;
          .upload-desc {
            margin-left: 40px;
            margin-top: 24px;
          }
          .upload-desc ul > li {
            list-style: disc;
            color: #7f7f7f;
          }
          ::v-deep .update-normal .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .update-normal .el-upload:hover {
            border-color: #3c6ef0;
          }
          .update-normal-icon {
            font-size: 28px;
            color: #8c939d;
            width: 250px;
            height: 178px;
            line-height: 178px;
            text-align: center;
          }
          .update-normal-avatar {
            width: 250px;
            height: 178px;
            display: block;
          }
        }
        .form-content {
          width: 65%;
        }
      }
      .form-legal-person {
        .form-content {
          width: 65%;
        }
        .form-credential {
          width: 65%;
          display: flex;
          justify-content: space-between;
          .credential-select {
            width: 140px;
            margin-right: 10px;
          }
        }
        .id-card-desc {
          color: rgba(153, 153, 153, 1);
          margin: 0 0 20px 178px;
        }
        .view-btn {
          padding-top: 152px;
        }
        .link {
          color: red;
        }
      }
      .submit-footer {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
      .upload-inside-content {
        ::v-deep .avatar-uploader {
          height: 170px;
          width: 250px;
          position: relative;
          .el-upload {
            width: 250px;
            height: 170px;
            border: 1px dashed #b1abab;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:hover {
              border-color: #409eff;
            }
          }
          .avatar-uploader-icon {
            font-size: 10px;
            color: #5289d6;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
          }
          .avatar {
            width: 250px;
            height: 178px;
            display: block;
          }
          .avatar-tip {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 20px;
            line-height: 20px;
            padding: 0 10px;
            font-size: 12px;
            color: #fff;
            background: #3c6ef0;
          }
        }
      }
    }
  }
}
</style>
