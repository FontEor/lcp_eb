<template>
  <div class="input-textarea-description">
    <!-- 描述文本域输入框 -->
    <div
      class="input-textarea-description__input-wrapper"
      @mouseover="onMouseoverInput"
      @mouseout="onMouseoutInput"
    >
      <el-input
        :value="value"
        :placeholder="placeholder"
        :rows="1"
        type="textarea"
        resize="none"
        class="input-wrapper__input"
        @input="onInputValue"
      />
      <el-tooltip :content="tooltipContent" effect="dark" placement="top">
        <div
          v-show="inputIconVisible"
          class="input-wrapper__icon"
          @click="onClickInputIcon"
        >
          <i class="el-icon-full-screen" />
        </div>
      </el-tooltip>
    </div>

    <!-- 描述详情对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :max-height="400"
      width="720px"
      class="input-textarea-description__dialog"
      @open="onOpenDialog"
      @opened="onOpenedDialog"
      @close="onCloseDialog"
    >
      <div class="dialog__dialog-wrapper">
        <div class="dialog-wrapper__top-bar">
          <i
            :class="{ 'el-icon-link': true, disabled: linkIconDisabled }"
            @click="onClickLinkIcon"
          />
        </div>
        <!-- 可编辑内容区域 -->
        <div
          v-html="dialogContentInnerHtml"
          ref="dialogContent"
          contenteditable="true"
          class="dialog-wrapper__content"
        ></div>
        <p class="dialog-wrapper__tip">选中文字即可设置跳转链接</p>
        <!-- 超链接弹出框 -->
        <transition name="fade">
          <div
            v-show="dialogPopoverVisible"
            :style="{
              '--current-anchor-offset-left': `${currentAnchorOffsetLeft}px`,
              '--current-anchor-offset-top': `${currentAnchorOffsetTop}px`,
            }"
            class="dialog-wrapper__popover"
            @mouseover="onMouseoverDialogPopover"
            @mouseout="onMouseoutDialogPopover"
          >
            <div class="popover__text">{{ dialogPopoverText }}</div>
            <div class="popover__icon-wrapper">
              <i
                class="el-icon-edit icon-wrapper__icon"
                @click="onClickPopoverEditIcon"
              />
              <i
                class="el-icon-delete icon-wrapper__icon"
                @click="onClickPopoverDeleteIcon"
              />
            </div>
          </div>
        </transition>
      </div>
      <template #footer>
        <el-button type="primary" @click="onClickDialogSaveButton"
          >保 存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InputTextareaDescription",
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    tooltipContent: {
      type: String,
      default: "放大编辑",
    },
    dialogTitle: {
      type: String,
      default: "参数描述",
    },
  },
  data() {
    return {
      inputIconVisible: false,
      dialogVisible: false,
      dialogContentInnerHtml: "",
      selectionchangeDocumentDebounceTimer: null,
      clickDialogContentAnchorDebounceTimer: null,
      mouseoverDialogContentAnchorDebounceTimer: null,
      mouseoutDialogContentAnchorDebounceTimer: null,
      mouseoverDialogPopoverDebounceTimer: null,
      mouseoutDialogPopoverDebounceTimer: null,

      selectionString: "",
      selectionRange: null,
      dialogPromptInputValue: "",
      linkIconDisabled: true,
      promptHrefDebounceTimer: null,

      dialogPopoverVisible: false,
      currentAnchorOffsetLeft: 0,
      currentAnchorOffsetTop: 0,
      currentAnchorElement: null,
      dialogPopoverText: "",
    };
  },
  methods: {
    onInputValue(value) {
      this.$emit("update:value", value);
    },
    onMouseoverInput() {
      this.inputIconVisible = true;
    },
    onMouseoutInput() {
      this.inputIconVisible = false;
    },
    onClickInputIcon() {
      this.dialogVisible = true;
    },
    // 文档选区改变时
    onSelectionchangeDocument() {
      clearTimeout(this.selectionchangeDocumentDebounceTimer);
      this.selectionchangeDocumentDebounceTimer = setTimeout(() => {
        const selection = window.getSelection();
        const { anchorNode, focusNode, rangeCount } = selection;
        if (rangeCount < 1) {
          return;
        }
        const selectionString = selection.toString();
        const selectionRange = selection.getRangeAt(0);
        // 当选区文本内容不为空，选区文本内容前后去空白符后不为空
        // 且选区起点节点与选区终点节点均包含于对话框内容元素时
        const condition =
          selectionString &&
          selectionString.trim() &&
          this.$refs["dialogContent"].contains(anchorNode) &&
          this.$refs["dialogContent"].contains(focusNode) &&
          anchorNode.parentNode === focusNode.parentNode;
        if (condition) {
          this.selectionString = selectionString;
          this.selectionRange = selectionRange;
          this.linkIconDisabled = false;
          // this.openPromptHref();
        }
      }, 800);
    },
    // 描述详情对话框打开时
    onOpenDialog() {
      const { onSelectionchangeDocument } = this;
      this.initDialogContentInnerHtml();
      document.addEventListener("selectionchange", onSelectionchangeDocument);
    },
    // 点击对话框内容中锚标签时
    onClickDialogContentAnchor(event) {
      clearTimeout(this.clickDialogContentAnchorDebounceTimer);
      this.clickDialogContentAnchorDebounceTimer = setTimeout(() => {
        const { target } = event;
        if (target.nodeName === "A") {
          const {
            dataset: { selection },
          } = target;
          window.open(selection, "_blank");
        }
      }, 300);
    },
    // 鼠标移入对话框内容中锚标签时
    onMouseoverDialogContentAnchor(event) {
      clearTimeout(this.mouseoverDialogContentAnchorDebounceTimer);
      this.mouseoverDialogContentAnchorDebounceTimer = setTimeout(() => {
        const { target } = event;
        if (target.nodeName === "A") {
          const {
            dataset: { selection },
            offsetTop,
            offsetLeft,
          } = target;
          this.currentAnchorOffsetLeft = offsetLeft;
          this.currentAnchorOffsetTop = offsetTop;
          this.dialogPopoverText = selection;
          this.currentAnchorElement = target;
          this.dialogPopoverVisible = true;
        }
      }, 300);
    },
    // 鼠标移出对话框内容中锚标签时
    onMouseoutDialogContentAnchor(event) {
      clearTimeout(this.mouseoutDialogContentAnchorDebounceTimer);
      this.mouseoutDialogContentAnchorDebounceTimer = setTimeout(() => {
        const { target } = event;
        if (target.nodeName === "A") {
          this.dialogPopoverVisible = false;
          this.dialogPopoverText = "";
        }
      }, 300);
    },
    // 描述详情对话框打开动画完成时
    onOpenedDialog() {
      const {
        onClickDialogContentAnchor,
        onMouseoverDialogContentAnchor,
        onMouseoutDialogContentAnchor,
      } = this;
      this.$refs["dialogContent"].addEventListener(
        "click",
        onClickDialogContentAnchor
      );
      this.$refs["dialogContent"].addEventListener(
        "mouseover",
        onMouseoverDialogContentAnchor
      );
      this.$refs["dialogContent"].addEventListener(
        "mouseout",
        onMouseoutDialogContentAnchor
      );
    },
    // 描述详情对话框关闭时
    onCloseDialog() {
      const {
        onSelectionchangeDocument,
        onClickDialogContentAnchor,
        onMouseoverDialogContentAnchor,
        onMouseoutDialogContentAnchor,
      } = this;
      this.linkIconDisabled = true;
      this.dialogContentInnerHtml = "";
      document.removeEventListener(
        "selectionchange",
        onSelectionchangeDocument
      );
      this.$refs["dialogContent"].removeEventListener(
        "click",
        onClickDialogContentAnchor
      );
      this.$refs["dialogContent"].removeEventListener(
        "mouseover",
        onMouseoverDialogContentAnchor
      );
      this.$refs["dialogContent"].removeEventListener(
        "mouseout",
        onMouseoutDialogContentAnchor
      );
    },
    onClickDialogSaveButton() {
      this.dialogContentInnerHtml = this.$refs["dialogContent"].innerHTML;
      this.parseDialogContentInnerHtml();
      this.dialogVisible = false;
    },
    onClickLinkIcon() {
      clearTimeout(this.promptHrefDebounceTimer);
      this.promptHrefDebounceTimer = setTimeout(() => {
        if (this.linkIconDisabled) {
          return;
        }
        this.linkIconDisabled = true;
        this.openPromptHref();
      }, 30);
    },
    onMouseoverDialogPopover() {
      clearTimeout(this.mouseoutDialogContentAnchorDebounceTimer);
      clearTimeout(this.mouseoverDialogPopoverDebounceTimer);
      this.mouseoverDialogPopoverDebounceTimer = setTimeout(() => {
        this.dialogPopoverVisible = true;
      }, 300);
    },
    onMouseoutDialogPopover() {
      clearTimeout(this.mouseoverDialogContentAnchorDebounceTimer);
      clearTimeout(this.mouseoutDialogPopoverDebounceTimer);
      this.mouseoverDialogPopoverDebounceTimer = setTimeout(() => {
        this.dialogPopoverVisible = false;
      }, 300);
    },
    // 点击超链接弹出框编辑图标时
    async onClickPopoverEditIcon() {
      this.dialogPopoverVisible = false;
      window.getSelection().removeAllRanges();
      const {
        currentAnchorElement: {
          childNodes,
          dataset: { selection },
        },
      } = this;
      const [anchorTextNode] = childNodes;
      const newRange = document.createRange();
      newRange.setStart(anchorTextNode, 0);
      newRange.setEnd(anchorTextNode, anchorTextNode.textContent.length);
      window.getSelection().addRange(newRange);
      this.dialogPromptInputValue = selection;

      const newSelection = window.getSelection();
      this.selectionString = newSelection.toString();
      this.selectionRange = newSelection.getRangeAt(0);
      this.openPromptHref();
    },
    // 点击超链接弹出框删除图标时
    onClickPopoverDeleteIcon() {
      const {
        currentAnchorElement,
        currentAnchorElement: {
          textContent,
          parentNode,
          previousSibling,
          nextSibling,
        },
      } = this;
      let newTextContent = textContent;
      if (previousSibling && previousSibling.nodeName === "#text") {
        newTextContent = previousSibling.textContent + newTextContent;
        parentNode.removeChild(previousSibling);
      }
      if (nextSibling && nextSibling.nodeName === "#text") {
        newTextContent += nextSibling.textContent;
        parentNode.removeChild(nextSibling);
      }
      const newTextNode = document.createTextNode(newTextContent);
      parentNode.replaceChild(newTextNode, currentAnchorElement);
      this.dialogPopoverVisible = false;
    },

    initDialogContentInnerHtml() {
      const { value } = this;
      const dialogContentInnerHtml = value
        .split("\n")
        .map((item) =>
          item
            ? `<div>${item
                .replace(/\s/g, "&nbsp;")
                .replace(/<a&nbsp;data-selection/g, `<a data-selection`)}</div>`
            : "<div><br></div>"
        )
        .join("");
      this.dialogContentInnerHtml = dialogContentInnerHtml;
    },
    parseDialogContentInnerHtml() {
      const { dialogContentInnerHtml } = this;
      // 处理换行符
      let value = dialogContentInnerHtml
        .replace(/<div><br><\/div>/g, "\n")
        .replace(/<br>/g, "");
      // 手动输入时第一行文本可能没有在div标签中，此时需要在第一个div起始标签换行
      if (!value.startsWith("<div>")) {
        value = value.replace("<div>", "\n");
      }
      // 若以div标签结尾说明最后不换行，此时需要将其终止标签去掉
      if (value.endsWith("</div>")) {
        value = value.replace(/<\/div>$/, "");
      }
      value = value
        .replace(/<div>/g, "")
        .replace(/<\/div>/g, "\n")
        .replace(/&nbsp;/g, " ");
      this.$emit("update:value", value);
    },
    formatPromptHrefConfirmValue(value) {
      if (!/^http(s)?:\/\//.test(value)) {
        value = `https://${value}`;
      }
      return value;
    },
    parseConfirmValueToInnerHtml(value) {
      console.log(value);
      const {
        startOffset,
        endOffset,
        startContainer,
        endContainer,
        commonAncestorContainer,
      } = this.selectionRange;
      const { selectionString } = this;
      const commonAncestorElement =
        commonAncestorContainer.nodeName === "#text"
          ? commonAncestorContainer.parentNode
          : commonAncestorContainer;
      const commonAncestorChildNodes = commonAncestorElement.childNodes;

      let selectionFlag = false;
      const commonAncestorElementInnerHtml = Array.from(
        commonAncestorChildNodes,
        (node) => {
          // 判断当前节点是否为选区起始点
          if (node === startContainer) {
            selectionFlag = true;
          }
          const { nodeName } = node;
          let nodeInnerHtml = "";
          // 判断当前节点是否在选区中
          if (selectionFlag) {
            // 判断选区起止点是否为同一节点
            if (startContainer === endContainer) {
              const frontZone = node.textContent
                .slice(0, startOffset)
                .replace(/\s/g, "&nbsp;");
              const backZone = node.textContent
                .slice(endOffset)
                .replace(/\s/g, "&nbsp;");
              nodeInnerHtml = `${frontZone}<a data-selection="${value}">${selectionString}</a>${backZone}`;
              console.log("if", nodeInnerHtml);
            } else {
              // 判断当前节点是否为选区起始点、中间点或终止点
              if (node === startContainer) {
                const frontZone = node.textContent
                  .slice(0, startOffset)
                  .replace(/\s/g, "&nbsp;");
                const backZone = node.textContent
                  .slice(startOffset)
                  .replace(/\s/g, "&nbsp;");
                nodeInnerHtml = `${frontZone}<a data-selection="${value}">${backZone}`;
              } else if (node === endContainer) {
                const frontZone = node.textContent
                  .slice(0, endOffset)
                  .replace(/\s/g, "&nbsp;");
                const backZone = node.textContent
                  .slice(endOffset)
                  .replace(/\s/g, "&nbsp;");
                nodeInnerHtml = `${frontZone}</a>${backZone}`;
              } else {
                nodeInnerHtml = node.textContent.replace(/\s/g, "&nbsp;");
              }
              console.log("value", nodeInnerHtml);
            }
          } else {
            nodeInnerHtml =
              nodeName === "#text"
                ? node.textContent.replace(/\s/g, "&nbsp;")
                : `<a data-selection="${node.dataset.selection}">${node.innerHTML}</a>`;
          }
          // 判断当前节点是否为选区终止点
          if (node === endContainer) {
            selectionFlag = false;
          }
          return nodeInnerHtml;
        }
      ).join("");
      commonAncestorElement.innerHTML = commonAncestorElementInnerHtml;
    },
    async openPromptHref() {
      const message = "链接";
      const customClass = "dialog-content-prompt";
      const inputPlaceholder = "请输入链接";
      const inputValue = this.dialogPromptInputValue;
      const modal = false;
      const showClose = false;
      const showCancelButton = false;
      const options = {
        customClass,
        inputPlaceholder,
        inputValue,
        showClose,
        showCancelButton,
        modal,
      };

      await this.$prompt(message, options)
        .then(({ value }) => {
          value = value.trim();
          if (!value) {
            return;
          }
          value = this.formatPromptHrefConfirmValue(value);
          this.parseConfirmValueToInnerHtml(value);
        })
        .catch(() => {});
      this.dialogPromptInputValue = "";
    },
  },
};
</script>

<style lang="scss">
.dialog-content-prompt {
  .el-message-box__header {
    display: none;
  }

  .el-message-box__content {
    margin-top: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;

    .el-message-box__container {
      margin-bottom: 18px;
      width: 48px;
    }

    .el-input__inner {
      user-select: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.input-textarea-description {
  .input-textarea-description__input-wrapper {
    position: relative;

    .input-wrapper__input {
      width: 100%;

      ::v-deep .el-textarea__inner {
        height: 1em;
      }
    }

    .input-wrapper__icon {
      position: absolute;
      bottom: 4px;
      right: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
    }
  }

  .input-textarea-description__dialog {
    .dialog__dialog-wrapper {
      position: relative;

      .dialog-wrapper__top-bar {
        padding: 0 8px;
        border: 1px solid #dcdfe6;
        border-bottom: none;
        border-radius: 4px 4px 0 0;

        .el-icon-link {
          cursor: pointer;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;

          &.disabled {
            cursor: not-allowed;
          }
        }
      }

      .dialog-wrapper__content {
        margin-bottom: 4px;
        padding: 4px 8px;
        height: 240px;
        overflow: auto;
        border: 1px solid #dcdfe6;
        border-radius: 0 0 4px 4px;

        ::v-deep a[data-selection] {
          border-bottom: 1px solid #3c6ef0;
        }
      }

      .dialog-wrapper__tip {
        color: #666;
      }

      .dialog-wrapper__popover {
        position: absolute;
        // 超链接弹出框顶部定位保底值
        top: 0;
        top: calc(16px + var(--current-anchor-offset-top));
        // 超链接弹出框左侧定位保底值
        left: 0;
        left: var(--current-anchor-offset-left);
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 320px;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 2, 0.12);

        & .popover__text {
          padding: 0 4px;
          width: 240px;
          height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: default;
        }

        .popover__icon-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 40px;

          .icon-wrapper__icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>