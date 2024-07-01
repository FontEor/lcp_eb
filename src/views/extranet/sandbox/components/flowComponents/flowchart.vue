<template>
  <div class="flowchart-wrap">
    <div class="flowchart" ref="flowchart"></div>
  </div>
</template>

<script>
import {
  templateAll,
  templateChild1,
  templateChild2,
  templateChild3
} from "./flowchartData";
import { Graph, Shape } from "@antv/x6";

export default {
  name: "flowchart",
  props: ["currentProcess"],
  watch: {
    currentProcess: {
      handler(newVal) {
        this.graphInit();
      }
    }
  },
  data() {
    return {
      templateAll,
      templateChild1,
      templateChild2,
      templateChild3,
      templateData: {},
      outgoingNodes: [],
      incomingNodes: [],
      graph: {},
      currentNode: "node_1"
    };
  },
  computed: {},
  methods: {
    // 流程模板
    handleTemplate(code) {
      this.templateData = {};
      switch (code) {
        case "sandbox_kuaidi_all": // 全部流程
          this.templateData = this.templateAll;
          break;
        case "sandbox_kuaidi_child1": // 子流程1
          this.templateData = this.templateChild1;
          break;
        case "sandbox_kuaidi_child2": // 子流程2
          this.templateData = this.templateChild2;
          break;
        case "sandbox_kuaidi_child3": // 子流程3
          this.templateData = this.templateChild3;
          break;
      }
    },

    // 整合节点状态
    mergeNodes() {
      this.templateData &&
        this.templateData.nodeList &&
        this.templateData.nodeList.map(item1 => {
          this.currentProcess.sandboxSceneNodeDtoList.map(item2 => {
            if (item1.node_code === item2.nodeCode) {
              let tempNew = {
                state: item2.state
              };
              Object.assign(item1, tempNew);
              return item1;
            }
          });
        });
    },

    // 整合线状态
    mergeEdges() {
      this.templateData &&
        this.templateData.edgesList &&
        this.templateData.edgesList.map(item1 => {
          this.templateData &&
            this.templateData.nodeList &&
            this.templateData.nodeList.map(item2 => {
              if (item1.target === item2.id && item2.state === 0) {
                let tempNew = {
                  state: item2.state
                };
                Object.assign(item1, tempNew);
              } else if (item1.source === item2.id && item2.state === 1) {
                let tempNew = {
                  state: item2.state
                };
                Object.assign(item1, tempNew);
              }
              return item1;
            });
        });
    },

    // 遍历节点
    // handleNodes(nodes) {
    //   let tempNodes = [];
    //   // 节点配置 状态0
    //   const options = {
    //     width: 90,
    //     height: 40,
    //     shape: "image",
    //     imageUrl: require("@/assets/img/sandbox/node_2.png"),
    //     attrs: {
    //       label: {
    //         fill: "#B1BBD2",
    //         fontSize: 13,
    //       }
    //     },
    //     zIndex: 5
    //   };
    //   // 节点配置 状态1
    //   const options1 = {
    //     width: 90,
    //     height: 40,
    //     shape: "image",
    //     imageUrl: require("@/assets/img/sandbox/node_1.png"),
    //     attrs: {
    //       label: {
    //         fill: "#3C6EF0",
    //         fontSize: 13,
    //       }
    //     },
    //     zIndex: 5
    //   };
    //   // 选中节点配置 状态2
    //   const options2 = {
    //     width: 90,
    //     height: 40,
    //     shape: "image",
    //     imageUrl: require("@/assets/img/sandbox/node_3.png"),
    //     attrs: {
    //       label: {
    //         fill: "#ffffff",
    //         fontSize: 13,
    //       }
    //     },
    //     zIndex: 5
    //   };
    //   // 节点配置 状态0 宽图片
    //   const options_2 = {
    //     width: 116,
    //     height: 40,
    //     shape: "image",
    //     imageUrl: require("@/assets/img/sandbox/node_2_2.png"),
    //     attrs: {
    //       label: {
    //         fill: "#B1BBD2",
    //         fontSize: 13,
    //       }
    //     },
    //     zIndex: 5
    //   };
    //   // 节点配置 状态1 宽图片
    //   const options1_2 = {
    //     width: 116,
    //     height: 40,
    //     shape: "image",
    //     imageUrl: require("@/assets/img/sandbox/node_1_2.png"),
    //     attrs: {
    //       label: {
    //         fill: "#3C6EF0",
    //         fontSize: 13,
    //       }
    //     },
    //     zIndex: 5
    //   };
    //   // 选中节点配置 状态2 宽图片
    //   const options2_2 = {
    //     width: 116,
    //     height: 40,
    //     shape: "image",
    //     imageUrl: require("@/assets/img/sandbox/node_3_2.png"),
    //     attrs: {
    //       label: {
    //         fill: "#ffffff",
    //         fontSize: 13,
    //       }
    //     },
    //     zIndex: 5
    //   };
    //   if(nodes){
    //   nodes.forEach(item => {
    //     if (item.state === 2) {
    //       this.currentNode = item.id;
    //       if (item.bgState === 1){
    //         Object.assign(item, options2_2);
    //       }else{
    //         Object.assign(item, options2);
    //       }
    //     } else if (item.state === 1) {
    //       if (item.bgState === 1){
    //         Object.assign(item, options1_2);
    //       }else{
    //         Object.assign(item, options1);
    //       }
    //     } else {
    //       if (item.bgState === 1){
    //         Object.assign(item, options_2);
    //       }else{
    //         Object.assign(item, options);
    //       }
    //     }
    //     tempNodes.push(item);
    //   });
    //   return tempNodes;
    //   }
    // },
    handleNodes(nodes) {
      const nodeOptions = {
        '0': {
          width: 90,
          height: 40,
          shape: "image",
          imageUrl: require("@/assets/img/sandbox/node_2.png"),
          attrs: {
            label: {
              fill: "#B1BBD2",
              fontSize: 13,
            }
          },
          zIndex: 5
        },
        '1': {
          width: 90,
          height: 40,
          shape: "image",
          imageUrl: require("@/assets/img/sandbox/node_1.png"),
          attrs: {
            label: {
              fill: "#3C6EF0",
              fontSize: 13,
            }
          },
          zIndex: 5
        },
        '2': {
          width: 90,
          height: 40,
          shape: "image",
          imageUrl: require("@/assets/img/sandbox/node_3.png"),
          attrs: {
            label: {
              fill: "#ffffff",
              fontSize: 13,
            }
          },
          zIndex: 5
        }
      };

      const nodeOptions_2 = {
        width: 116,
        height: 40,
        shape: "image",
        imageUrl: require("@/assets/img/sandbox/node_2_2.png"),
        attrs: {
          label: {
            fill: "#B1BBD2",
            fontSize: 13,
          }
        },
        zIndex: 5
      };

      const nodeOptions1_2 = {
        width: 116,
        height: 40,
        shape: "image",
        imageUrl: require("@/assets/img/sandbox/node_1_2.png"),
        attrs: {
          label: {
            fill: "#3C6EF0",
            fontSize: 13,
          }
        },
        zIndex: 5
      };

      const nodeOptions2_2 = {
        width: 116,
        height: 40,
        shape: "image",
        imageUrl: require("@/assets/img/sandbox/node_3_2.png"),
        attrs: {
          label: {
            fill: "#ffffff",
            fontSize: 13,
          }
        },
        zIndex: 5
      };

      if (nodes) {
        return nodes.map(item => {
          const options = item.bgState === 1 ? nodeOptions_2 : nodeOptions[item.state];
          const options2 = item.bgState === 1 ? nodeOptions2_2 : nodeOptions[item.state];
          const options1 = item.bgState === 1 ? nodeOptions1_2 : nodeOptions[item.state];

          if (item.state === 2) {
            this.currentNode = item.id;
            Object.assign(item, options2);
          } else if (item.state === 1) {
            Object.assign(item, options1);
          } else {
            Object.assign(item, options);
          }

          return item;
        });
      }
    },

    // 遍历线
    handleEdges(edges) {
      let tempEdges = [];
      // 状态0 无状态
      const options = {
        connector: {
          name: "rounded"
        },
        markup: [
          {
            tagName: "path",
            selector: "stroke"
          },
          {
            tagName: "path",
            selector: "fill"
          }
        ],
        attrs: {
          fill: {
            connection: true,
            strokeWidth: 6,
            strokeLinecap: "round",
            fill: "none",
            stroke: {
              type: "linearGradient",
              stops: [
                {
                  offset: "0%",
                  color: "#E2E9F4"
                },
                {
                  offset: "100%",
                  color: "#C2C7D4"
                }
              ]
            }
          },
          stroke: {
            fill: "none",
            stroke: "#c9d0e0",
            connection: true,
            strokeWidth: 1,
            strokeLinecap: "round"
          }
        }
      };
      // 状态1 成功
      const options1 = {
        connector: {
          name: "rounded"
        },
        markup: [
          {
            tagName: "path",
            selector: "stroke"
          },
          {
            tagName: "path",
            selector: "fill"
          }
        ],
        attrs: {
          fill: {
            connection: true,
            strokeWidth: 6,
            strokeLinecap: "round",
            fill: "none",
            stroke: {
              type: "linearGradient",
              stops: [
                {
                  offset: "0%",
                  color: "#B7D0FF"
                },
                {
                  offset: "100%",
                  color: "#80A4FF"
                }
              ]
            }
          },
          stroke: {
            fill: "none",
            stroke: "#9fbaf8",
            connection: true,
            strokeWidth: 1,
            strokeLinecap: "round"
          }
        }
      };

      // 状态1 成功 子节点红色
      const options1_2 = {
        connector: {
          name: "rounded"
        },
        markup: [
          {
            tagName: "path",
            selector: "stroke"
          },
          {
            tagName: "path",
            selector: "fill"
          }
        ],
        attrs: {
          fill: {
            connection: true,
            strokeWidth: 6,
            strokeLinecap: "round",
            fill: "none",
            stroke: {
              type: "linearGradient",
              stops: [
                {
                  offset: "0%",
                  color: "#FFB7D6"
                },
                {
                  offset: "100%",
                  color: "#FF80A4"
                }
              ]
            }
          },
          stroke: {
            fill: "none",
            stroke: "#FB4C8D",
            connection: true,
            strokeWidth: 1,
            strokeLinecap: "round"
          }
        }
      };
      if(edges){
      edges.forEach(item => {
        if (item.state === 1) {
          if (item.style === 1) {
            Object.assign(item, options1_2);
          } else {
            Object.assign(item, options1);
          }
        } else {
          Object.assign(item, options);
        }
        tempEdges.push(item);
      });
      return tempEdges;
      }
    },

    // 当前节点的输出节点
    fnGetOutgoingEdges() {
      this.outgoingNodes = [];
      if (this.graph.getOutgoingEdges(this.currentNode)) {
        this.graph.getOutgoingEdges(this.currentNode).forEach(item => {
          let nodeDetails = this.graph.getCellById(item.store.data.target.cell);
          this.outgoingNodes.push(nodeDetails);
        });
      }
    },

    // 当前节点的输入节点
    fnGetIncomingEdges() {
      this.incomingNodes = [];
      if (this.graph.getIncomingEdges(this.currentNode)) {
        this.graph.getIncomingEdges(this.currentNode).forEach(item => {
          let nodeDetails = this.graph.getCellById(item.store.data.source.cell);
          this.incomingNodes.push(nodeDetails);
        });
      }
    },

    // flowchart子节点全删除
    empty(e) {
      while (e.firstChild) {
        e.removeChild(e.firstChild);
      }
    },

    // 生成流程图
    graphInit() {
      this.handleTemplate(this.currentProcess.processCode);
      this.mergeNodes();
      this.mergeEdges();
      this.empty(this.$refs.flowchart);
      // this.graph.clearCells;
      this.graph = new Graph({
        container: this.$refs.flowchart,
        height: this.$refs.flowchart.clientHeight,
        panning: false, //是否支持拖拽平移
        autoResize: true,
        scaling: { min: 0, max: 1 },
        interacting: function(cellView) {
          nodeMovable: false;
        }
      });

      const data = {
        // 节点
        nodes: this.handleNodes(
          this.templateData && this.templateData.nodeList
        ),
        // 边
        edges: this.handleEdges(
          this.templateData && this.templateData.edgesList
        )
      };
      this.graph.fromJSON(data);
      // 输出边线
      this.fnGetOutgoingEdges();
      // 输入边线
      this.fnGetIncomingEdges();

      // 自适应流程图
      this.graph.on("resize", ({ width, height }) => {
        // this.graph.scale(width / 1640 + 0.06);
        this.graph.scaleContentToFit();
        this.graph.positionContent('center');
      }); 
      this.graph.scaleContentToFit();
      this.graph.positionContent('center');

      this.$emit(
        "change",
        this.graph.getCellById(this.currentNode),
        this.outgoingNodes,
        this.incomingNodes
      );
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.flowchart-wrap {
  width: 100%;
  height: 100%;
}
.flowchart {
  height: 228px;
}
</style>
