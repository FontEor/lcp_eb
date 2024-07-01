<template>
  <div class="method-list">
    <!-- 编辑文档 -->
    <EditApiDoc
      v-if="editApiDocVisible"
      :editApiDocVisible.sync="editApiDocVisible"
      :methodId.sync="methodId"
      @updateStatus="$emit('updateStatus')"
      :status="status"
      :tabName="tabName"
    />
    <!-- 方法表格 -->
    <MethodTable
      v-else-if="!editApiDocVisible && qualifiedName"
      :qualifiedName="qualifiedName"
      :editApiDocVisible.sync="editApiDocVisible"
      :methodId.sync="methodId"
      @updateStatus="$emit('updateStatus')"
      :jsfAddBtnStatus="jsfAddBtnStatus"
    />
  </div>
</template>

<script>
import EditApiDoc from "@/views/intranet/apiManager/apiList/detail/jsfDetail/methodList/editApiDoc/index.vue";
import MethodTable from "@/views/intranet/apiManager/apiList/detail/jsfDetail/methodList/methodTable/index.vue";

export default {
  name: "MethodList",
  components: { EditApiDoc, MethodTable },
  props: {
    qualifiedName: {
      type: String,
      required: true
    },
    jsfAddBtnStatus: {
      type: Object,
      default: () => {
        return {
          visible: true,
          disabled: false,
        }
      }
    },
    status: {
      type: Number,
      required: true,
    },
    tabName: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      editApiDocVisible: false,
      methodId: 0
    };
  }
};
</script>

<style lang="scss" scoped></style>