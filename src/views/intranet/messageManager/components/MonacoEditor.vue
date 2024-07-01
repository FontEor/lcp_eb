<template>
  <div id="mxlContainer"></div>
</template>
<script>
import * as monaco from "monaco-editor";
import loader from "@monaco-editor/loader";
let timerOut = null;
export default {
  name: "MonacoEditor",
  props: {
    code: {
      type: String,
      default: "",
    },
    editXml: {
      type: Boolean,
      default: false,
    },
    autoFormate: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    code: {
      handler(newValue) {
        if (this.monacoModel) {
          this.monacoModel.setValue(newValue);
          this.setMoncao();
        }
      },
    },
    editXml: {
      handler(newValue) {
        if (!this.monacoInstance) return;
        if (this.autoFormate && !newValue) {
          this.formateCode();
          return;
        }
        this.monacoInstance.updateOptions({
          readOnly: !newValue,
        });
      },
    },
  },
  data() {
    return {
      monacoInstance: null,
      monacoState: null,
      monacoModel: null,
      monacoLoader: null,
    };
  },
  mounted() {
    this.setMoncao();
  },
  beforeDestroy() {
    this.monacoInstance && this.monacoInstance.dispose();
    this.monacoInstance = null;
    this.monacoState = null;
    this.monacoModel = null;
    this.monacoLoader.cancel();
    this.monacoLoader = null;
  },
  methods: {
    setMoncao() {
      if (this.monacoInstance) {
        this.monacoInstance.setModel(this.monacoModel);
        this.monacoInstance.restoreViewState(this.monacoState);
        this.formateCode();
        return;
      }
      const dom = document.querySelector("#mxlContainer");
      if (dom) {
        loader.config({ monaco });
        loader.config({ "vs/nls": { availableLanguages: { "*": "zh-cn" } } });
        this.monacoLoader = loader.init();
        this.monacoLoader.then((Monaco) => {
          this.monacoInstance = Monaco.editor.create(dom, {
            value: this.code,
            language: "xml",
            scrollBeyondLastLine: false,
            readOnly: true,
            automaticLayout: true,
            minimap: {
              enabled: false,
            },
            formatOnPaste: true,
          });
          this.monacoState = this.monacoInstance.saveViewState();
          this.monacoModel = this.monacoInstance.getModel();
          this.formateCode();
        });
      }
    },
    formateCode() {
      if (!this.monacoInstance || !this.autoFormate) return;
      this.monacoInstance.updateOptions({
        readOnly: false,
      });
      this.monacoInstance.getAction("editor.action.formatDocument").run();
      this.monacoInstance.setValue(this.monacoInstance.getValue());
      timerOut = setTimeout(() => {
        this.monacoInstance.updateOptions({
          readOnly: true,
        });
        clearTimeout(timerOut);
      }, 500);
    },
    setNewValue(newValue) {
      if (this.monacoModel) {
        this.monacoModel.setValue(newValue);
      }
    },
    getValue() {
      if (this.monacoInstance) {
        return this.monacoInstance.getValue();
      }
    },
  },
};
</script>
<style scoped lang="scss">
#mxlContainer {
  height: 60vh;
  border: 1px solid rgba(153, 153, 153, 0.5);
}
</style>
<style lang="scss">
#mxlContainer {
  .monaco-editor .margin-view-overlays .codicon-folding-collapsed,
  .monaco-editor .margin-view-overlays .codicon-folding-expanded {
    opacity: 1;
  }
}
</style>
