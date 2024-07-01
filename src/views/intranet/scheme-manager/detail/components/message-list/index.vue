<template>
  <article class="message-list">
    <MessageTable
      v-if="currentDisplayComponentName === 'MessageTable'"
      :currentDisplayComponentName.sync="currentDisplayComponentName"
      :currentTableRowData.sync="currentTableRowData"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <MessageAddition
      v-else-if="currentDisplayComponentName === 'MessageAddition'"
      :currentDisplayComponentName.sync="currentDisplayComponentName"
      :currentTableRowData.sync="currentTableRowData"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
    <MessageDocument
      v-else-if="currentDisplayComponentName === 'MessageDocument'"
      :currentDisplayComponentName.sync="currentDisplayComponentName"
      :currentTableRowData.sync="currentTableRowData"
      @updateDetailHeaderInfo="$emit('updateDetailHeaderInfo')"
    />
  </article>
</template>

<script>
import MessageTable from "./components/message-table/index.vue";
import MessageAddition from "./components/message-addition/index.vue";
import MessageDocument from "./components/message-document/index.vue";

export default {
  name: "MessageList",
  components: { MessageTable, MessageAddition, MessageDocument },
  data() {
    return {
      currentDisplayComponentName: "MessageTable",
      currentTableRowData: {},
    };
  },
};
</script>

<style lang="scss" scoped>
// .message-list {
// }
</style>
