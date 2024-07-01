<template>
  <div class="product-introduction-table">
    <!-- 非编辑态表格 -->
    <template v-if="!editable">
      <p class="form-row-title">{{ title }}</p>
      <template v-if="productShowType === '2'">
        <img
          v-if="tableData[0].imgUrl"
          :src="tableData[0].imgUrl"
          class="banner"
          style="margin-bottom: 22px"
          :onerror="`this.src='${require('@/assets/seatImg.png')}'`"
        />
        <p v-else style="color: #999; margin-bottom: 22px">暂无图片</p>
      </template>

      <el-table
        v-else
        :data="tableData"
        :hideEmptyImg="true"
        style="margin-bottom: 22px"
      >
        <el-table-column
          v-for="(item, index) in tableList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item['min-width']"
        >
          <template slot-scope="{ row, column }">
            <template v-if="column.property === 'imgConfigCode'">
              <img
                v-if="row[column.property]"
                :src="`${row.imgUrl}`"
                style="height: 32px"
              />
              <span v-else>未{{ formatSelectButtonText(column.label) }}</span>
            </template>
            <template v-else>
              <span>{{ row[column.property] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 编辑态表格 -->
    <template v-else>
      <p class="form-row-title">{{ title }}</p>
      <el-upload
        v-if="productShowType === '2'"
        class="banner-uploader"
        action=""
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleBannerChange"
      >
        <template v-if="editableTableData[0].imgUrl">
          <img
            class="banner"
            :src="editableTableData[0].imgUrl"
            :onerror="`this.src='${require('@/assets/seatImg.png')}'`"
          />
        </template>
        <i v-else class="el-icon-plus banner-uploader-icon">添加图片</i>
        <p slot="tip" style="color: #8c939d">建议上传图片宽度不小于1000px</p>
      </el-upload>
      <template v-else>
        <el-table :data="editableTableData" :hideEmptyImg="true">
          <el-table-column
            v-for="(item, index) in tableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item['min-width']"
          >
            <template slot-scope="{ row, column, $index }">
              <template v-if="column.property === 'imgConfigCode'">
                <img
                  v-if="row[column.property]"
                  :src="`${row.imgUrl}`"
                  style="cursor: pointer; height: 32px"
                  @click="handleSelectIconOrImage(column.label, $index)"
                />
                <el-button
                  v-else
                  type="text"
                  icon="el-icon-plus"
                  @click="handleSelectIconOrImage(column.label, $index)"
                  >{{ formatSelectButtonText(column.label) }}</el-button
                >
              </template>
              <template v-else>
                <!-- 输入框 -->
                <el-input
                  v-model.trim="row[column.property]"
                  style="width: 100%"
                  :maxlength="judgeMaxlength(column.property)"
                ></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="handle" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDeleteRowData(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加表格行数据按钮 -->
        <div class="button-wrapper">
          <el-button icon="el-icon-square-add" plain @click="handleAddRowData"
            >添加</el-button
          >
        </div>
      </template>
    </template>

    <!-- 选择图标对话框 -->
    <el-dialog
      width="500px"
      :title="computeDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @close="closeDialog"
    >
      <div class="dialog-content">
        <p>请选择展示图标：</p>
        <el-radio-group
          v-if="computeDialogTitle === '选择图标'"
          v-model="iconItem"
        >
          <el-radio
            v-for="(item, index) in iconList"
            :key="index"
            :label="JSON.stringify([item.code, item.url])"
            :border="true"
            :class="computeRadioClass"
          >
            <img :src="`${item.url}`" class="icon-radio__image" />
          </el-radio>
        </el-radio-group>

        <el-radio-group
          v-else-if="computeDialogTitle === '选择配图'"
          v-model="imageItem"
        >
          <el-radio
            v-for="(item, index) in imageList"
            :key="index"
            :label="JSON.stringify([item.code, item.url])"
            border
            class="image-radio"
          >
            <img :src="`${item.url}`" class="image-radio__image" />
          </el-radio>
        </el-radio-group>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectIconOrImage"
          >保 存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import overview from "@/api/intranet/softwareSystem/overview/index.js";

export default {
  name: "ProductIntroductionTable",
  props: {
    editable: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    editableTableData: {
      type: Array,
      required: true,
    },
    tableList: {
      type: Array,
      required: true,
    },
    productShowType: {
      type: String,
      required: true,
    },
    iconList: {
      type: Array,
    },
    imageList: {
      type: Array,
    },
  },
  data() {
    return {
      dialogVisible: false,
      iconItem: "",
      imageItem: "",
      currentLabel: "",
      dataIndex: null,
    };
  },
  computed: {
    // 计算选择图标/配图对话框标题
    computeDialogTitle() {
      const hashMap = { 展示图标: "选择图标", 展示配图: "选择配图" };
      return hashMap[this.currentLabel];
    },
    // 计算图标/配图单选框类名
    computeRadioClass() {
      const hashMap = { 展示图标: "icon-radio", 展示配图: "image-radio" };
      return hashMap[this.currentLabel];
    },
  },
  methods: {
    // 软件系统-配置产品介绍页-图片配置查询
    async query(imgType) {
      const imgUseScenes = "1";
      const params = { imgUseScenes, imgType };
      return await overview.query(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("load");
      });
    },
    // 软件系统-配置产品介绍页-产品架构 上传图片
    async imageUpload(raw) {
      const data = new FormData();
      data.append("imageFile", raw);
      return await overview.imageUpload(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("imageUpload");
      });
    },

    // 格式化选择按钮文本
    formatSelectButtonText(label) {
      const hashMap = { 展示图标: "选择图标", 展示配图: "选择配图" };
      return hashMap[label];
    },
    // 计算输入框最大长度
    judgeMaxlength(prop) {
      const hashMap = { title: 10, describe: 100 };
      return hashMap[prop];
    },

    // 关闭对话框时候
    closeDialog() {
      this.currentLabel = "";
      this.iconItem = "";
      this.imageItem = "";
      this.dataIndex = null;
    },
    // 更换产品架构图
    async handleBannerChange(file, fileList) {
      fileList = [];
      fileList.push(file);
      const response = await this.imageUpload(file.raw);
      const { data } = response.data;
      this.$message.success("上传图片成功！");
      this.editableTableData[0].imgUrl = data;
    },
    // 添加表格行数据操作
    handleAddRowData() {
      const rowData = this.tableList.reduce((sum, item) => {
        const { prop } = item;
        sum[prop] = "";
        sum.productShowType = this.productShowType;
        return sum;
      }, {});
      this.$emit("update:tableData", "add", rowData);
    },
    // 删除表格行数据操作
    handleDeleteRowData(index) {
      this.$emit("update:tableData", "delete", index);
    },
    // 选择图标或配图
    handleSelectIconOrImage(label, index) {
      this.currentLabel = label;
      this.dataIndex = index;
      this.dialogVisible = true;
    },
    // 保存所选图标或配图
    handleSaveSelectIconOrImage() {
      const item = this.iconItem || this.imageItem;
      const [imgConfigCode, imgUrl] = JSON.parse(item);
      this.editableTableData[this.dataIndex].imgConfigCode = imgConfigCode;
      this.editableTableData[this.dataIndex].imgUrl = imgUrl;
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-introduction-table {
  // 标题
  .form-row-title {
    margin-bottom: 22px;
    padding: 0 8px;
    border-left: 4px solid #3c6ef0;
    font-size: 16px;
    font-weight: 600;
  }
  // 产品架构图
  .banner {
    width: 200px;
    height: 144px;
    display: block;
  }
  .banner-uploader {
    margin-bottom: 22px;
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #3c6ef0;
      }
      .banner-uploader-icon {
        font-size: 16px;
        color: #8c939d;
        width: 200px;
        height: 144px;
        line-height: 144px;
        text-align: center;
      }
    }
  }
  // 数据表格
  .el-table {
    width: 100%;
  }
  // 添加行数据按钮
  .button-wrapper {
    margin-top: 8px;
    margin-bottom: 22px;
    display: flex;
    justify-content: center;
    .el-button {
      width: 100%;
      border: 1px dashed #d9d9d9;
      color: #666;
      transition: all 0.3s;
      &:hover {
        border: 1px dashed #3c6ef0;
        color: #3c6ef0;
      }
    }
  }
  // 选择图标、配图对话框内容区域
  .dialog-content {
    max-height: 50vh;
    .el-radio-group {
      ::v-deep .el-radio__input {
        display: none;
      }
      .el-radio {
        &.icon-radio {
          margin: 2px;
          position: relative;
          height: 42px;
          width: 38px;
          .icon-radio__image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 38px;
            width: 38px;
          }
        }
        &.image-radio {
          margin: 2px;
          position: relative;
          height: 70px;
          width: 112px;
          .image-radio__image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 64px;
            width: 112px;
          }
        }
      }
    }
  }
}
</style>