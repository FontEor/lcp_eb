<template>
  <article class="external-call-internal">
    <InterfaceList
      v-if="activeView === 'interfaceList'"
      :activeView.sync="activeView"
      :currentRowData.sync="currentRowData"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <ExternalDocument
      v-else-if="activeView === 'externalDocument'"
      :activeView.sync="activeView"
      :currentTableRowData="currentRowData"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <HttpAddOrEditInterface
      v-else-if="activeView === 'httpAddOrEditInterface'"
      :activeView.sync="activeView"
      :interfaceInfo="currentRowData"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <JsfAddOrEditInterface
      v-else-if="activeView === 'jsfAddOrEditInterface'"
      :activeView.sync="activeView"
      :interfaceInfo="currentRowData"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
  </article>
</template>

<script>
import InterfaceList from "./components/interface-list.vue";
import ExternalDocument from "./components/external-document/index.vue";
import HttpAddOrEditInterface from "./components/http-add-or-edit-interface.vue";
import JsfAddOrEditInterface from "./components/jsf-add-or-edit-interface/index.vue";

export default {
  name: "ExternalCallInternal",
  components: {
    InterfaceList,
    ExternalDocument,
    HttpAddOrEditInterface,
    JsfAddOrEditInterface,
  },
  data() {
    return {
      activeView: "interfaceList",
      currentRowData: {},
    };
  },
};
</script>

<style lang="scss" scoped>
// .external-call-internal {
// }
</style>
