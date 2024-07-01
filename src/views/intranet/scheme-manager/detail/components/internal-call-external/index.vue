<template>
  <article class="internal-call-external">
    <InterfaceTableList
      v-if="showComponent === 'InterfaceTableList'"
      :showComponent.sync="showComponent"
      :currentRowId.sync="currentRowId"
      :outOfDate.sync="outOfDate"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <AddInterfaceSteps
      v-if="showComponent === 'AddInterfaceSteps'"
      :showComponent.sync="showComponent"
      :currentRowId.sync="currentRowId"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <ExternalDocuments
      v-if="showComponent === 'ExternalDocuments'"
      :showComponent.sync="showComponent"
      :currentRowId.sync="currentRowId"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
  </article>
</template>

<script>
import InterfaceTableList from "./components/interface-table-list/index.vue";
import AddInterfaceSteps from "./components/add-interface-steps.vue";
import ExternalDocuments from "./components/external-documents/index.vue";

export default {
  name: "InternalCallInterfaceList",
  components: {
    InterfaceTableList,
    AddInterfaceSteps,
    ExternalDocuments,
  },
  data() {
    return {
      showComponent: "InterfaceTableList",
      currentRowId: null,
      outOfDate: false,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>