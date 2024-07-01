<template>
  <div class="flowchart-wrap">
    <div
      class="flowchart"
      :class="processCode!=='sandbox_kuaidi_all'?'small-height':''"
      ref="flowchart"
    ></div>
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
  name: "flowchartReadOnly",
  props: ["processCode"],
  data() {
    return {
      templateAll,
      templateChild1,
      templateChild2,
      templateChild3,
      templateData: {},
      graph: {}
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
    // 遍历节点
    handleNodes(nodes) {
      let tempNodes = [];
      // 默认节点配置
      const templateNodeOptions = {
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
      };
      // 默认节点配置 宽度
      const templateNodeOptions2 = {
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
      nodes.forEach(item => {
        if(item.bgState === 1){
          Object.assign(item, templateNodeOptions2);
        }else{
          Object.assign(item, templateNodeOptions);
        }
        tempNodes.push(item);
      });
      return tempNodes;
    },

    // 遍历线
    handleEdges(edges) {
      let tempEdges = [];
      // 默认xian配置
      const templateEdgesOptions = {
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

      // 红线配置
      const styleEdgesOptions = {
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

      edges.forEach(item => {
        if (item.style === 1) {
          Object.assign(item, styleEdgesOptions);
        } else {
          Object.assign(item, templateEdgesOptions);
        }
        tempEdges.push(item);
      });
      return tempEdges;
    },

    // 生成流程图
    graphInit() {
      this.handleTemplate(this.processCode);
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
        nodes: this.handleNodes(this.templateData.nodeList),
        // 边
        edges: this.handleEdges(this.templateData.edgesList)
      };
      this.graph.fromJSON(data);

      // 自适应流程图
      this.graph.on("resize", ({ width, height }) => {
        this.graph.scale(width / 1640 + 0.05);
        this.graph.positionContent('left');
      }); 
      this.graph.positionContent('left');


    }
  },
  mounted() {
    this.graphInit();
  }
};
</script>

<style lang="scss" scoped>
.flowchart-wrap {
  width: 100%;
  height: 100%;
}
.flowchart {
  height: 228px;
  &.small-height {
    height: 88px;
  }
  ::v-deep & > svg{
    padding-left:20px;
  }
}
</style>
