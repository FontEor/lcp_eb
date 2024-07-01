<template>
  <article class="right-document">
    <section v-if="emptyImageVisible" class="right-document__empty-image">
      <p class="empty-image__text">暂无版本记录</p>
    </section>
    <div v-else class="right-document__content">
      <HeaderDocument
        :currentVersionName="currentVersionName"
        @recoverDocument="() => $emit('recoverDocument')"
      />
      <FormDocument :form="form" :categoryList="categoryList" />
      <TableDocument
        :tableData="requestParamsTableData"
        :tableColumnList="inParamsTableColumnList"
        title="请求参数"
      />
      <TableDocument
        :tableData="responseParamsTableData"
        :tableColumnList="outParamsTableColumnList"
        title="响应参数"
      />
      <ExampleDocument
        title="请求报文示例"
        :tabVisible="true"
        :tabList="requestDemo"
      />
      <ExampleDocument
        title="响应报文示例"
        :tabVisible="true"
        :tabList="responseDemo"
      />
      <ExampleDocument title="异常示例" :demo="computeExceptionDemo" />
      <TableDocument
        :tableData="errorCodesTableData"
        :tableColumnList="errorCodesTableColumnList"
        title="错误码"
      />
    </div>
  </article>
</template>

<script>
import HeaderDocument from "./components/header-document.vue";
import FormDocument from "./components/form-document.vue";
import TableDocument from "./components/table-document.vue";
import ExampleDocument from "./components/example-document.vue";

export default {
  name: "RightDocument",
  components: { HeaderDocument, FormDocument, TableDocument, ExampleDocument },
  props: {
    emptyImageVisible: { type: Boolean, required: true },
    currentVersionName: { type: String, required: true },
    form: { type: Object, required: true },
    categoryList: { type: Array, required: true },
    requestParamsTableData: { type: Array, required: true },
    responseParamsTableData: { type: Array, required: true },
    errorCodesTableData: { type: Array, required: true },
    requestDemo: { type: Array, default: () => [] },
    responseDemo: { type: Array, default: () => [] },
    exceptionDemo: { type: Array, default: () => [] },
  },
  data() {
    return {
      inParamsTableColumnList: [
        {
          label: "名称",
          prop: "name",
          minWidth: "30%",
        },
        {
          label: "类型",
          prop: "oldType",
          minWidth: "25%",
          showOverflowTooltip: true,
        },
        {
          label: "是否必填",
          prop: "required",
          minWidth: "15%",
        },
        {
          label: "示例",
          prop: "exampleValue",
          minWidth: "25%",
          showOverflowTooltip: true,
        },
        {
          label: "描述",
          prop: "remark",
          minWidth: "25%",
        },
      ],
      outParamsTableColumnList: [
        {
          label: "名称",
          prop: "name",
          minWidth: "30%",
        },
        {
          label: "类型",
          prop: "oldType",
          minWidth: "30%",
          showOverflowTooltip: true,
        },
        {
          label: "示例",
          prop: "exampleValue",
          minWidth: "25%",
          showOverflowTooltip: true,
        },
        {
          label: "描述",
          prop: "remark",
          minWidth: "25%",
        },
      ],
      errorCodesTableColumnList: [
        {
          label: "错误码",
          prop: "errorCode",
          minWidth: "35%",
        },
        {
          label: "错误消息",
          prop: "errorMsg",
          minWidth: "60%",
          showOverflowTooltip: true,
        },
        {
          label: "处理建议",
          prop: "prescription",
          minWidth: "60%",
          showOverflowTooltip: true,
        },
      ],
    };
  },
  computed: {
    computeExceptionDemo() {
      const { exceptionDemo } = this;
      const [exceptionDemoFirst] = exceptionDemo;
      const { content } = exceptionDemoFirst || {};
      return content || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.right-document {
  position: relative;
  width: 1000px;
  height: 480px;
  overflow: auto;

  .right-document__empty-image {
    position: absolute;
    top: 0;
    right: 0;
    width: 1200px;
    height: 480px;
    background-color: #fff;
    background-image: url("~@/assets/intranet/images/dockingScheme/versionEmpty.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 30%;

    .empty-image__text {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .right-document__content {
    padding: 8px 16px;
  }
}
</style>