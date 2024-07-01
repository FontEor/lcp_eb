<template>
  <div class="user-manager app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 8px; float: right"
      :clstag="clstag('userManager_1618992977139|1', '')"
      @click="addNewUserDialog"
      >添加成员
    </el-button>

    <el-button type="primary" style="margin-bottom: 8px;margin-right: 10px; float: right" @click="showTeamDialog" v-if="customizeTeamFlag">修改团队名称</el-button>

    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column label="序号" type="index" min-width="60" />
      <el-table-column
        v-for="{
          label,
          prop,
          minWidth,
          showOverflowTooltip,
        } in tableColumnList"
        :key="prop"
        :label="label"
        :prop="prop"
        :min-width="minWidth"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="{ row }">
          <span v-if="prop === 'role'">{{
            row[prop] | formatTableColumnRoleText
          }}</span>
          <span v-else-if="prop === 'createTime'">{{
            row[prop] | parseTimefilter("{y}-{m}-{d} {h}:{i}")
          }}</span>
          <span v-else>{{ row[prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="show && userRole === 1"
        label="操作"
        min-width="100"
        fixed="right"
      >
        <template slot-scope="{ row, row: { role } }">
          <el-button
            v-if="role === 0"
            type="text"
            @click="onClickDeleteButton(row)"
            >删除</el-button
          >
          <el-tooltip v-else-if="role === 1" placement="top">
            <p slot="content">管理员不能删除</p>
            <el-button type="text" style="color: #b5b5b5; cursor: not-allowed"
              >删除</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="!show && userRole === 1" label="操作" width="100">
        <template slot-scope="scope">
          <el-popconfirm
            width="200"
            title="账号冻结后，该成员将无法进去该团队，如需进入，重新解冻即可。确认冻结吗?"
            @onConfirm="freezeUser(scope.row.pin, scope.row.isDelete)"
            v-if="user_pin != scope.row.pin && scope.row.isDelete === 0"
          >
            <template slot="title">
              账号冻结后,该成员将无法进去该团队,如需进入，重新解冻即可。确认冻结么?
            </template>
            <el-button type="text" slot="reference">冻结</el-button>
          </el-popconfirm>
          <el-popconfirm
            width="200"
            title="取消冻结后，该成员可正常进入该团队，确认取消冻结吗?"
            @onConfirm="freezeUser(scope.row.pin, scope.row.isDelete)"
            v-if="user_pin != scope.row.pin && scope.row.isDelete === 1"
          >
            <el-button type="text" slot="reference">取消冻结</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col :span="24">
        <pagination
          v-show="listQuery.total"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.pageNumb"
          :limit.sync="listQuery.pageSize"
          style="margin: 0px; float: right"
          @pagination="paginationChange"
        />
      </el-col>
    </el-row>

    <el-dialog
      title="添加成员"
      :visible="addUserDialogVisible"
      width="700px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addUserDialogData"
        :rules="addUserRules"
        ref="addUserForm"
        label-width="100px"
      >
        <el-form-item label="账号" prop="value">
          <el-select
            style="width: 100%"
            v-model="addUserDialogData.value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="searchUsers"
            @change="userSelectChange"
            :loading="addUserDialogData.loading"
          >
            <el-option
              v-for="user in addUserDialogData.zhanghaos"
              :key="user.userName"
              :label="user.userName"
              :value="user.userName"
            >
              <div class="j-v-center">
                <div
                  class="avatar__wrapper"
                  style="display: inline-flex; height: 34px"
                >
                  <div
                    :style="{
                      display: 'inlineFlex',
                      margin: '2px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      lineHeight: '31px',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      background:
                        'url(' +
                        user.headImg +
                        ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent',
                    }"
                  ></div>
                </div>
                <div class="inputUsers__input__autocomplete--info">
                  <span>{{ user.userName }} ({{ user.realName }})</span>
                  <span>{{ user.organizationFullName }}</span>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input
            v-model="addUserDialogData.realName"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="addUserDialogData.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addUserDialogData.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button
          :loading="confirmButtonLoading"
          type="primary"
          @click="onClickConfirmButton"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="添加成员"
      :visible="addOuterUserDialogVisible"
      width="320px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form label-width="110px">
        <el-form-item label="添加成员的数量">
          <el-radio-group v-model="inviteRegCount">
            <el-radio :label="10">10</el-radio>
            <el-radio :label="500">500</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center" class="dialog-footer">
        <el-button type="primary" plain @click="saveUserNum">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加成员"
      :visible="inviteLinkDialog"
      width="760px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      @close="inviteLinkDialog = false"
    >
      <el-form label-width="100px">
        <div class="imgWarning">
          <img class="imgWords" src="@/assets/words.png" alt="" />
        </div>
        <div class="words">
          提示：您团队的编码为【{{
            tenantCode
          }}】，请告知被邀请的用户在登录时输入。
        </div>
        <el-form-item label="链接地址">
          <span class="message">{{ message }}</span>
          <el-button
            type="primary"
            v-clipboard:copy="message"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            >复制链接</el-button
          >
        </el-form-item>
        <el-form-item>
          <span class="f13 c-999"
            >分享链接邀请用户，邀请链接有效期24h，该链接仅能在PC端访问。</span
          >
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center" class="dialog-footer">
        <el-button type="plain" @click="inviteLinkDialog = false"
          >关 闭</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :visible="messageVisible"
      width="380px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <p>尊敬的用户，</p>
      <p style="text-indent: 2em">
        您好，目前仅支持管理员添加成员。添加成员请联系您所属团队的管理员进行操作。
      </p>
      <div slot="footer" style="text-align: center" class="dialog-footer">
        <el-button type="primary" @click="messageVisible = false"
          >关 闭</el-button
        >
      </div>
    </el-dialog>


    <el-dialog
      title="修改团队名称"
      :visible="updateTeamDialogVisible"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      @close="updateTeamDialogVisible = false"
    >
      <el-form
        :model="updateTeamDialogData"
        :rules="updateTeamRules"
        ref="updateTeamForm"
        label-width="120px"
      >
        <el-form-item label="原团队名称：">
          <el-input
            v-model="curTeamName"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="新团队名称：" prop="name">
          <el-input
            v-model="updateTeamDialogData.name"
            placeholder="请输入新的团队名称"
          ></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateTeamDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateTeamName('updateTeamForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>



  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination/index.vue";
import { parseTime } from "@/utils";
import { Message } from "@lui/lui-ui";
import {
  saveSupplierUser,
  deleteSuppliersUser,
  getSupplierUsersByUserPin,
  updateIdaasYnByOther,
} from "@/api/business/lcpUser/lcp-user";
import { hrFindUser } from "@/api/user";
import request from "@/utils/request";
import pageClick from "@/utils/pageClick.js";
import isIntranet from "@/utils/isIntranet.js";

import lcp from "@/api/intranet/lcp/index.js";
import Cookies from "js-cookie";

export default {
  name: "UserManager",
  components: { Pagination },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      const reg = /^1[3456789]\d{9}$/;
      console.log(reg.test(value));
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("手机格式有误"));
      }
    };

    return {
      tableLoading: true,
      tableData: [],
      tableColumnList: isIntranet()
        ? [
            { label: "角色", prop: "role", minWidth: "100" },
            {
              label: "账号",
              prop: "pin",
              minWidth: "120",
              showOverflowTooltip: true,
            },
            { label: "姓名", prop: "username", minWidth: "80" },
            {
              label: "手机号",
              prop: "phone",
              minWidth: "100",
              showOverflowTooltip: true,
            },
            {
              label: "所属开发商",
              prop: "supplierName",
              minWidth: "260",
              showOverflowTooltip: true,
            },
            {
              label: "创建时间",
              prop: "createTime",
              minWidth: "160",
              showOverflowTooltip: true,
            },
          ]
        : [
            { label: "角色", prop: "role", minWidth: "100" },
            {
              label: "账号",
              prop: "pin",
              minWidth: "120",
              showOverflowTooltip: true,
            },
            { label: "姓名", prop: "username", minWidth: "80" },
            {
              label: "手机号",
              prop: "phone",
              minWidth: "100",
              showOverflowTooltip: true,
            },
            {
              label: "创建时间",
              prop: "createTime",
              minWidth: "160",
              showOverflowTooltip: true,
            },
          ],

      addUserDialogVisible: false,
      addOuterUserDialogVisible: false,
      inviteLinkDialog: false,
      deleteDialogVisible: false,
      messageVisible: false,
      addUserDialogData: {
        zhanghaos: [],
        loading: false,
        value: "",
        realName: "",
        mobile: "",
        email: "",
        outerValue: "",
      },
      addUserRules: {
        outerValue: [
          { required: true, message: "请输入京东账号", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "change",
          },
        ],
        value: [{ required: true, message: "请输入账号", trigger: "blur" }],
        realName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "change",
          },
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern:
              /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            message: "请输入有效的邮箱地址",
          },
        ],
        //email: [{ required: true, message: '请输入邮箱', min: 3, trigger: 'blur' }]
      },
      listQuery: {
        total: 0,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      show: true,
      userRole: 0,
      inviteRegCount: 10,
      message: "",
      tenantCode: "",
      confirmButtonLoading: false,
      confirmButtonDebounceTimer: null,

      updateTeamDialogVisible: false,
      updateTeamDialogData:{
        name:'',
      },
      updateTeamRules: {
        name: [
          { required: true, message: "请输入新的团队名称", trigger: "blur" },
          { min: 2, max: 30, message: "长度在2到30个字符", trigger: "blur" }
        ],
      },
      customizeTeamFlag: false,
      curTeamName: ''
    };
  },
  filters: {
    formatTableColumnRoleText(role) {
      const hashMap = new Map().set(0, "普通用户").set(1, "管理员");
      return hashMap.get(role) || "-";
    },
    parseTimefilter(obj, fomart) {
      if (obj === null) {
        return "——";
      } else {
        return parseTime(obj, fomart);
      }
    },
  },
  computed: {
    ...mapGetters(["user_pin"]),
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    handleClose(done) {
      this.addUserDialogVisible = false;
      this.addOuterUserDialogVisible = false;
      done();
    },

    fetchUser() {
      let url = "/user/getUserRole";
      request({
        url: url,
        method: "get",
      })
        .then((rsp) => {
          this.userRole = rsp.data;
          console.log("用户角色", this.userRole);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onClickConfirmButton() {
      if (isIntranet()) {
        this.$refs["addUserForm"].validate((valid) => {
          if (valid) {
            clearTimeout(this.confirmButtonDebounceTimer);
            this.confirmButtonDebounceTimer = setTimeout(() => {
              this.confirmButtonLoading = true;
              saveSupplierUser(
                this.addUserDialogData.value,
                this.addUserDialogData.email,
                this.addUserDialogData.mobile,
                this.addUserDialogData.realName
              )
                .then((rsp) => {
                  Message.success("添加成功");
                  this.addUserDialogVisible = false;
                  this.queryUsers(1, this.listQuery.limit);
                  this.confirmButtonLoading = false;
                })
                .catch((e) => {
                  this.confirmButtonLoading = false;
                });
            }, 300);
          } else {
            return false;
          }
        });
      } else {
        this.$refs["addOuterUserForm"].validate((valid) => {
          if (valid) {
            clearTimeout(this.confirmButtonDebounceTimer);
            this.confirmButtonDebounceTimer = setTimeout(() => {
              this.confirmButtonLoading = true;
              saveSupplierUser(
                this.addUserDialogData.outerValue,
                this.addUserDialogData.email,
                this.addUserDialogData.mobile,
                this.addUserDialogData.realName
              )
                .then((rsp) => {
                  Message.success("添加成功");
                  this.addOuterUserDialogVisible = false;
                  this.queryUsers(1, this.listQuery.limit);
                  this.confirmButtonLoading = false;
                })
                .catch((e) => {
                  this.confirmButtonLoading = false;
                });
            }, 300);
          } else {
            return false;
          }
        });
      }
    },
    userSelectChange(value) {
      this.addUserDialogData.zhanghaos.forEach((val, index) => {
        if (value === val.userName) {
          if (val.realName) {
            this.addUserDialogData.realName = val.realName;
          }
          if (val.mobile) {
            this.addUserDialogData.mobile = val.mobile;
          }
          if (val.email) {
            this.addUserDialogData.email = val.email;
          }
        }
      });
    },
    searchUsers(key) {
      if (key !== "") {
        this.addUserDialogData.loading = true;
        setTimeout(() => {
          hrFindUser(key)
            .then((rsp) => {
              this.addUserDialogData.loading = false;
              this.addUserDialogData.zhanghaos = rsp.data;
            })
            .catch((e) => {});
        }, 200);
      } else {
        this.addUserDialogData.zhanghaos = [];
      }
    },
    addNewUserDialog() {
      if (isIntranet()) {
        this.addUserDialogVisible = true;
        this.addUserDialogData.zhanghaos = [];
        this.addUserDialogData.value = "";
        this.addUserDialogData.realName = "";
        this.addUserDialogData.mobile = "";
        this.addUserDialogData.email = "";
      } else {
        if (this.userRole === 0) {
          this.messageVisible = true;
        } else if (this.userRole === 1) {
          this.addOuterUserDialogVisible = true;
        }
        // this.addUserDialogData.outerValue = ''
        // this.addUserDialogData.realName = ''
        // this.addUserDialogData.mobile = ''
        // this.addUserDialogData.email = ''
        // this.addOuterUserDialogVisible=true
      }
    },
    saveUserNum() {
      this.addOuterUserDialogVisible = false;
      let url = "/user/getInviteLoginUrl";
      request({
        url: url,
        method: "post",
        data: { inviteRegCount: this.inviteRegCount },
      })
        .then((rsp) => {
          this.message = rsp.data.url;
          this.tenantCode = rsp.data.tenantCode;
        })
        .catch((e) => {
          console.log(e);
        });
      this.inviteLinkDialog = true;
      this.inviteRegCount = 10;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    onClickDeleteButton(index, row) {
      this.$confirm("确认将该用户在您的团队里删除?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "不删除",
      })
        .then((_) => {
          this.deleteUser(index.pin);
        })
        .catch((_) => {});
    },
    /**
     * 冻结用户
     */
    freezeUser(pin, yn) {
      updateIdaasYnByOther(pin, yn)
        .then((res) => {
          let msg = yn == 0 ? "冻结成功" : "取消冻结成功";
          Message.success(pin + "账号" + msg);
          this.queryUsers(1, this.listQuery.limit);
        })
        .catch((e) => {});
    },
    deleteUser(pin) {
      deleteSuppliersUser(pin)
        .then((res) => {
          console.log(res, "res");
          Message.success("删除成功");
          this.queryUsers(1, this.listQuery.limit);
        })
        .catch((e) => {});
    },
    queryUsers() {
      getSupplierUsersByUserPin({
        pageSize: this.listQuery.pageSize,
        pageNumb: this.listQuery.pageNumb,
      })
        .then((rsp) => {
          this.listQuery.total = rsp.data.total;
          this.tableData = rsp.data.list;
          console.log(this.tableData);
          this.tableLoading = false;
        })
        .catch((e) => {
          this.tableLoading = false;
        });
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryUsers();
    },
    onCopy: function (e) {
      this.$message({
        type: "success",
        message: "复制成功!",
      });
    },
    onError: function (e) {
      this.$message({
        type: "error",
        message: "复制失败!",
      });
    },

    // 显示修改团队名称
    async showTeamDialog(){
      this.updateTeamDialogVisible = true;
      try { 
        const res = await lcp.user.getTeamListInfo(); 
        const supplierId = Cookies.get('supplierId');
        this.curTeamName = res.data.find(team => team.id == supplierId).name;
    
      } 
      catch (error) { 
        console.log(error); 
      } 
    },


    async checkCustomizeTeamEditingRights() { 
      try { 
        const res = await lcp.supplier.checkCustomizeTeamEditingRights(); 
        this.customizeTeamFlag = res.data
      } 
      catch (error) {
        throw new Error(`checkCustomizeTeamEditingRights, ${error}`);
      } 
    },

    async updateTeamName(updateTeamForm) {
      this.$refs[updateTeamForm].validate(async (valid) => {
        if (valid) {
          if(this.curTeamName == this.updateTeamDialogData.name){
            Message.error("团队名称重复");
            return;
          }
          try { 
            const res = await lcp.supplier.updateTeamName(this.updateTeamDialogData);
            this.updateTeamDialogVisible = false;
            Message.success("修改成功");
            this.$refs.updateTeamForm.resetFields();
            this.queryUsers(1, this.listQuery.limit);
          } 
          catch (error) {
            throw new Error(`updateTeamName, ${error}`);
          } 
        }
      })
    }
    
    

  },
  created() {
    console.log("用户PIN码:" + this.user_pin);
    if (!isIntranet()) {
      this.show = false;
    }
    this.fetchUser();
    this.queryUsers(1, this.listQuery.limit);
    this.checkCustomizeTeamEditingRights();
  },
};
</script>

<style lang="scss" scoped>
.user-manager {
}

.el-tag.el-tag--info {
  height: 26px;
  background-color: #ecf5ff;
  border-color: #e9e9eb;
  color: #409eff;
}

.el-select .el-tag__close.el-icon-close {
  background-color: #ecf5ff;
  color: #409eff;
}

.el-select .el-tag__close.el-icon-close:hover {
  background-color: #409eff;
  color: white;
}

.j-v-center {
  display: flex;
  align-items: center;
}

.inputUsers__input__autocomplete--info {
  margin-left: 10px;
  line-height: 1.5;
}

.inputUsers__input__autocomplete--info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.inputUsers__input__autocomplete--info span:last-child {
  font-size: 12px;
  color: #8f9399;
  display: inline-block;
}

.el-select-dropdown__item {
  height: 100%;
}

.el-select-dropdown {
  z-index: 2050 !important;
}
.message {
  display: inline-block;
  width: 516px;
}
.imgWarning {
  display: flex;
  justify-content: center;
}
.imgWords {
  width: 60px;
  height: 60px;
}
.words {
  color: #d81e06;
  font-weight: bold;
  text-align: center;
  margin: 22px;
}
</style>