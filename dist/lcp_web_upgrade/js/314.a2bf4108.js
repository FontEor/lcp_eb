"use strict";(self["webpackChunklcp_web_upgrade"]=self["webpackChunklcp_web_upgrade"]||[]).push([[314],{1314:function(e,a,t){t.r(a),t.d(a,{default:function(){return y}});t(7658);var l=t(3396),r=t(9242),u=t(4870),n=t(2483),s=t(8137);const o=e=>((0,l.dD)("data-v-27cf8517"),e=e(),(0,l.Cn)(),e),c={class:"left-search"},d={class:"left-search__header"},p={class:"header__heading"},i=o((()=>(0,l._)("h2",{class:"heading__text"},"工单管理",-1))),m={class:"left-search__controls"},h={class:"controls__upper-layer"},v={class:"controls__under-layer"};var _=(0,l.aZ)({__name:"index",props:{workOrderNumber:null,status:null,workOrderTypeCode:null,timeRange:null},emits:["update:workOrderNumber","update:status","update:workOrderTypeCode","update:timeRange","fetchList"],setup(e,{emit:a}){const t=e,o=(0,n.tv)(),_=[{label:"全部",value:0},{label:"待处理",value:1},{label:"处理中",value:2},{label:"已关闭",value:3}],f={label:"typeName",value:"code",emitPath:!1},w=[{text:"最近一周",value:()=>{const e=new Date,a=new Date;return a.setTime(a.getTime()-6048e5),[a,e]}},{text:"最近一个月",value:()=>{const e=new Date,a=new Date;return a.setTime(a.getTime()-2592e6),[a,e]}},{text:"最近三个月",value:()=>{const e=new Date,a=new Date;return a.setTime(a.getTime()-7776e6),[a,e]}}],y=(0,u.iH)([]),b=(0,u.iH)(["",""]);async function k(){return await s.i.fetchTypeList()}async function g(){const e=await k().catch((e=>{throw console.error("handleFetchWorkOrderTypeList"),e}));y.value=Array.isArray(e)?e:[]}function C(){const e="NewWorkOrder";o.push({name:e})}function D(){a("fetchList",1)}function T(e){a("update:status",e),a("fetchList",1)}function O(e){a("update:workOrderTypeCode",e),a("fetchList",1)}function W(e){a("update:timeRange",e),a("fetchList",1)}return(0,l.bv)((async()=>{await g()})),(e,a)=>{const u=(0,l.up)("List"),n=(0,l.up)("el-icon"),s=(0,l.up)("el-button"),o=(0,l.up)("el-input"),k=(0,l.up)("el-option"),g=(0,l.up)("el-select"),L=(0,l.up)("el-cascader"),x=(0,l.up)("el-date-picker");return(0,l.wg)(),(0,l.iD)("div",c,[(0,l._)("header",d,[(0,l._)("div",p,[(0,l.Wm)(n,{size:16,color:"#3c6ef0"},{default:(0,l.w5)((()=>[(0,l.Wm)(u)])),_:1}),i]),(0,l.Wm)(s,{type:"primary",onClick:C},{default:(0,l.w5)((()=>[(0,l.Uk)("新建工单")])),_:1})]),(0,l._)("div",m,[(0,l._)("div",h,[(0,l.Wm)(o,{"model-value":t.workOrderNumber,clearable:"",placeholder:"请输入工单号","prefix-icon":"Search",onInput:a[0]||(a[0]=a=>e.$emit("update:workOrderNumber",a)),onKeyup:(0,r.D2)(D,["enter"])},null,8,["model-value","onKeyup"]),(0,l.Wm)(g,{"model-value":t.status,clearable:"",placeholder:"状态",class:"upper-layer__status-select",onClear:a[1]||(a[1]=a=>e.$emit("update:status")),onChange:T},{default:(0,l.w5)((()=>[((0,l.wg)(),(0,l.iD)(l.HY,null,(0,l.Ko)(_,(({label:e,value:a})=>(0,l.Wm)(k,{key:a,label:e,value:a},null,8,["label","value"]))),64))])),_:1},8,["model-value"]),(0,l.Wm)(L,{"model-value":t.workOrderTypeCode,options:y.value,props:f,"show-all-levels":!1,filterable:"",clearable:"",placeholder:"类型",class:"upper-layer__word-order-type-code-cascader",onChange:O},null,8,["model-value","options"])]),(0,l._)("div",v,[(0,l.Wm)(x,{modelValue:b.value,"onUpdate:modelValue":a[2]||(a[2]=e=>b.value=e),shortcuts:w,clearable:"",type:"daterange","value-format":"YYYY-MM-DD HH:mm:ss","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",class:"under-layer__time-range-date-picker",onChange:W},null,8,["modelValue"])])])])}}}),f=t(89);const w=(0,f.Z)(_,[["__scopeId","data-v-27cf8517"]]);var y=w}}]);
//# sourceMappingURL=314.a2bf4108.js.map