(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-1da3979a"],{"04d3":function(e,t,a){},"2f6a":function(e,t,a){},"3d85":function(e,t,a){"use strict";var r=(a("c5f6"),{name:"Steps",props:{titleList:{type:Array,default:function(){return[]}},active:{type:Number,required:!0}}}),n=(a("e75f"),a("2877")),i=Object(n.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-steps",{staticClass:"steps",attrs:{active:e.active,"align-center":!0,"finish-status":"success"}},e._l(e.titleList,(function(e,t){return a("el-step",{key:t,attrs:{title:e}})})),1)}),[],!1,null,"443b202a",null);t.a=i.exports},"43b3":function(e,t,a){"use strict";var r={name:"Title",props:{text:{type:String,default:""}}},n=(a("b61a"),a("2877")),i=Object(n.a)(r,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"title"},[a("div",{staticClass:"title__icon"}),a("div",{staticClass:"title__text"},[e._v(e._s(e.text))])])}),[],!1,null,"3d118947",null);t.a=i.exports},"7b29":function(e,t,a){"use strict";a("fd21")},"9bd9":function(e,t,a){"use strict";a("dc61")},"9f9e":function(e,t,a){},b4aa:function(e,t,a){"use strict";a.r(t);var r=a("43b3"),n=a("3d85"),i=(a("7f7f"),a("c7eb")),s=(a("96cf"),a("1da1")),o=(a("c5f6"),a("96e0")),c=a("fd48"),u={name:"BasicInfo",props:{active:{type:Number,required:!0},id:{type:Number,required:!0}},data:function(){return{passBackFormData:{domain:{}},passBackFormRules:{name:[{required:!0,message:"请输入API中文名称"},{min:2,max:30,message:"请输入2-30个字符"},{pattern:/^\S*$/,message:"API中文名称要求不允许输入空格、换行"}],app:[{required:!0,message:"请输入API所属应用"}],domain:[{required:!0,message:"请输入API所属分组",trigger:"blur"}],url:[{required:!0,message:"请输入URL"},{pattern:/^\//,message:"URL要求以“/”开头"},{pattern:/^\/[a-zA-Z0-9_\{\}\.\/-]*$/,message:"请输入英文字母、数字、'/'、'_'、'-'、'.'、'{'、'}'"},{min:2,max:50,message:"请输入2-50个字符"}]},appOptionList:[],domainOptionList:[],domainLoading:!1,confirmRegisterLoading:!1,confirmRegisterDebounceTimer:null,createGroupDialogVisible:!1,createGroupFormData:{},createGroupFormList:[{label:"分组英文名称",prop:"domain",placeholder:"输入API分组英文名称",maxLength:"30"},{label:"分组中文名称",prop:"name",placeholder:"输入API分组中文名称",maxLength:"30"},{label:"分组描述",prop:"intr",placeholder:"输API分组使用场景的描述",type:"textarea",maxLength:"100"}],createGroupFormRules:{name:[{required:!0,message:"请输入分组中文名称"},{pattern:/^\S*$/,message:"分组中文名称要求不允许输入空格、换行"}],domain:[{required:!0,message:"请输入分组英文名称"},{pattern:/^[a-zA-Z0-9_\.\{\}-]*$/,message:"请输入英文字母、数字、'_'、'-'、'.'"},{min:2,max:30,message:"请输入2-30个字符"}],intr:[{required:!0,message:"请输入分组描述"},{min:5,max:100,message:"请输入5-100个字符"}]},confirmCreateGroupLoading:!1,confirmCreateGroupDebounceTimer:null}},methods:{findAppListForSelect:function(){var e=Object(s.a)(Object(i.a)().mark((function e(){return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.a.select.findAppListForSelect();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),query:function(){var e=Object(s.a)(Object(i.a)().mark((function e(t){var a;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=[{queryLike:t}],e.next=3,c.a.OuterDomainService.query(a);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),create:function(){var e=Object(s.a)(Object(i.a)().mark((function e(){var t,a,r,n,s;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.createGroupFormData,a=t.name,r=t.domain,n=t.intr,"LCP",s=[{name:a,domain:r,intr:n,source:"LCP",sceneType:1}],e.next=5,c.a.OuterDomainService.create(s);case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),saveOuterApi:function(){var e=Object(s.a)(Object(i.a)().mark((function e(){var t,a,r,n,s,o,u,p,l,m;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.passBackFormData,a=t.name,r=t.app,n=r.appKey,s=r.appName,o=t.domain,u=o.domainId,p=o.domain,l=t.url,"LCP",m=[{name:a,appKey:n,appName:s,domainId:u,domain:p,url:l,source:"LCP",sceneType:1}],e.next=5,c.a.ApiManagerService.saveOuterApi(m);case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),handleGetAppOptionList:function(){var e=Object(s.a)(Object(i.a)().mark((function e(){var t,a;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.findAppListForSelect().catch((function(){throw new Error("handleGetAppOptionList findAppListForSelect")}));case 2:t=e.sent,a=t.data,this.appOptionList=a&&a.length>0?a.map((function(e){return{appId:e.value,appKey:e.code,appName:e.label}})):[];case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),remoteMethodDomain:function(){var e=Object(s.a)(Object(i.a)().mark((function e(t){var a,r,n=this;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(""===t){e.next=10;break}return this.domainLoading=!0,e.next=4,this.query(t).catch((function(){throw n.domainLoading=!1,new Error("remoteMethodDomain query")}));case 4:a=e.sent,r=a.data,this.domainOptionList=r&&r.length>0?r.map((function(e){return{domainId:e.id,domain:e.domain,name:e.name}})):[],this.domainLoading=!1,e.next=11;break;case 10:this.domainOptionList=[];case 11:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),handleConfirmCreateGroup:function(){var e=this;clearTimeout(this.confirmCreateGroupDebounceTimer),this.confirmCreateGroupDebounceTimer=setTimeout((function(){e.$refs.createGroupForm.validate(function(){var t=Object(s.a)(Object(i.a)().mark((function t(a){var r,n,s,o;return Object(i.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!a){t.next=14;break}return e.confirmCreateGroupLoading=!0,t.next=4,e.create().catch((function(t){throw e.confirmCreateGroupLoading=!1,new Error("handleConfirmCreateGroup create",t)}));case 4:r=t.sent,e.createGroupDialogVisible=!1,e.$message.success("操作成功！"),e.$nextTick((function(){e.confirmCreateGroupLoading=!1})),e.remoteMethodDomain(),n=e.createGroupFormData,s=n.name,o=n.domain,r.data,e.passBackFormData.domain={name:s,domain:o,domainId:r.data},t.next=15;break;case 14:return t.abrupt("return",!1);case 15:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}),300)},handleConfirmRegister:function(){var e=this;clearTimeout(this.confirmRegisterDebounceTimer),this.confirmRegisterDebounceTimer=setTimeout((function(){e.$refs.passBackForm.validate(function(){var t=Object(s.a)(Object(i.a)().mark((function t(a){var r,n;return Object(i.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!a){t.next=11;break}return e.confirmRegisterLoading=!0,t.next=4,e.saveOuterApi().catch((function(){throw e.confirmRegisterLoading=!1,new Error("register saveOuterApi")}));case 4:r=t.sent,n=r.data,e.$emit("update:id",n),e.$emit("update:active",e.active+1),e.confirmRegisterLoading=!1,t.next=12;break;case 11:return t.abrupt("return",!1);case 12:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}),300)}},created:function(){this.handleGetAppOptionList(),this.remoteMethodDomain()}},p=u,l=(a("7b29"),a("2877")),m=Object(l.a)(p,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"basic-info"},[a("div",{staticClass:"basic-info__step-form"},[a("el-form",{ref:"passBackForm",staticClass:"pass-back-form",attrs:{"label-width":"90px",model:e.passBackFormData,rules:e.passBackFormRules}},[a("el-form-item",{attrs:{prop:"name",label:"中文名称"}},[a("el-input",{staticStyle:{width:"80%"},attrs:{maxlength:"30","show-word-limit":"",placeholder:"输入API中文名称"},model:{value:e.passBackFormData.name,callback:function(t){e.$set(e.passBackFormData,"name","string"==typeof t?t.trim():t)},expression:"passBackFormData.name"}})],1),a("el-form-item",{attrs:{prop:"app",label:"所属应用"}},[a("el-select",{staticStyle:{width:"80%"},attrs:{"value-key":"appId",placeholder:"选择API所属应用",filterable:!0},model:{value:e.passBackFormData.app,callback:function(t){e.$set(e.passBackFormData,"app",t)},expression:"passBackFormData.app"}},e._l(e.appOptionList,(function(e){return a("el-option",{key:e.appId,attrs:{label:e.appName,value:e}})})),1)],1),a("el-form-item",{attrs:{prop:"domain",label:"所属分组"}},[a("div",{staticClass:"content__domain"},[a("el-select",{staticStyle:{width:"80%"},attrs:{"value-key":"domainId",placeholder:"选择API所属分组",filterable:!0,loading:e.domainLoading},model:{value:e.passBackFormData.domain,callback:function(t){e.$set(e.passBackFormData,"domain",t)},expression:"passBackFormData.domain"}},e._l(e.domainOptionList,(function(t){return a("el-option",{key:t.domainId,attrs:{label:t.name+"("+t.domain+")",value:t}},[a("span",{staticStyle:{float:"left"}},[e._v(e._s(t.name))]),a("span",{staticStyle:{color:"#999"}},[e._v(e._s("("+t.domain+")"))])])})),1),a("el-button",{attrs:{type:"text"},on:{click:function(t){e.createGroupDialogVisible=!0}}},[e._v("+创建分组")])],1)]),a("el-form-item",{attrs:{prop:"url",label:"URI"}},[a("el-input",{staticStyle:{width:"80%"},attrs:{maxlength:"50","show-word-limit":"",placeholder:"输入API的URL，如/update/order"},model:{value:e.passBackFormData.url,callback:function(t){e.$set(e.passBackFormData,"url","string"==typeof t?t.trim():t)},expression:"passBackFormData.url"}})],1)],1),a("el-button",{attrs:{type:"primary",loading:e.confirmRegisterLoading},on:{click:e.handleConfirmRegister}},[e._v("确认注册")])],1),a("el-dialog",{attrs:{title:"创建分组",width:"500px",visible:e.createGroupDialogVisible,"close-on-click-modal":!1},on:{"update:visible":function(t){e.createGroupDialogVisible=t},close:function(t){return e.$refs.createGroupForm.resetFields()}}},[a("el-form",{ref:"createGroupForm",attrs:{"label-width":"110px",model:e.createGroupFormData,rules:e.createGroupFormRules}},e._l(e.createGroupFormList,(function(t){return a("el-form-item",{key:t.prop,attrs:{label:t.label,prop:t.prop}},[a("el-input",{attrs:{type:t.type,placeholder:t.placeholder,maxlength:t.maxLength,"show-word-limit":""},model:{value:e.createGroupFormData[t.prop],callback:function(a){e.$set(e.createGroupFormData,t.prop,"string"==typeof a?a.trim():a)},expression:"createGroupFormData[item.prop]"}})],1)})),1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.createGroupDialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary",loading:e.confirmCreateGroupLoading},on:{click:e.handleConfirmCreateGroup}},[e._v("确认创建")])],1)],1)],1)}),[],!1,null,"15f32082",null),d=m.exports,f={name:"RegisterSuccess",props:{active:{type:Number,required:!0},id:{type:Number,required:!0}}},b=(a("bdcd"),Object(l.a)(f,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"register-success"},[e._m(0),a("p",{staticClass:"register-success__title"},[e._v("注册成功")]),a("p",{staticClass:"register-success__tip"},[e._v(" 快去完善API基础数据吧，完善后发布即可对外生效 ")]),a("el-button",{on:{click:function(t){return e.$emit("update:active",0)}}},[e._v("继续注册API")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.$router.push({name:"ApiManagerPassBackDetail",params:{id:e.id}})}}},[e._v("去完善API基础数据")])],1)}),[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"register-success__icon"},[t("i",{staticClass:"el-icon-success"})])}],!1,null,"148c4e8c",null)),h=b.exports,v={name:"Register",components:{Title:r.a,Steps:n.a,BasicInfo:d,RegisterSuccess:h},data:function(){return{active:0,titleList:["填写API基本信息","注册成功"],id:0}}},g=(a("9bd9"),Object(l.a)(v,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"register"},[a("Title",{attrs:{text:"注册API"}}),a("Steps",{attrs:{active:e.active,titleList:e.titleList}}),0===e.active?a("BasicInfo",{attrs:{active:e.active,id:e.id},on:{"update:active":function(t){e.active=t},"update:id":function(t){e.id=t}}}):1===e.active?a("RegisterSuccess",{attrs:{active:e.active,id:e.id},on:{"update:active":function(t){e.active=t}}}):e._e()],1)}),[],!1,null,"799377ac",null));t.default=g.exports},b61a:function(e,t,a){"use strict";a("2f6a")},bdcd:function(e,t,a){"use strict";a("04d3")},dc61:function(e,t,a){},e75f:function(e,t,a){"use strict";a("9f9e")},fd21:function(e,t,a){}}]);