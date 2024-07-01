<template>
  <div>
    <el-dialog
      title="《京东物流开放平台开发者注册协议》"
      :visible="JDXY"
      width="900px"
      @close="JDXY = false"
    >
      <div
        style="height: 500px; overflow-y: scroll; overflow-x: hidden"
        id="write"
        class="is-node"
      >
        <blockquote>
          <p>
            在使用京东物流开放平台服务之前，您应当认真阅读并遵守本协议的全部内容。如果您对本协议的条款有疑问的，请通过我们的服务邮箱（<a
              href="mailto:gateway_service@jd.com"
              target="_blank"
              class="url"
              >gateway_service@jd.com</a
            >）和我们沟通。如果您不同意本协议的任意内容，或者无法准确理解京东物流对条款的解释，请不要进行任何后续操作。否则，表示您已接受了以下所述的条款和条件，同意受本协议约束。届时您不应以未阅读本协议的内容或者未获得京东物流对您问询的解答等理由，主张本协议无效，或要求撤销本协议。
          </p>
        </blockquote>
        <h1>
          <a name="header-n1231" class="md-header-anchor"></a
          >京东物流合作开发协议
        </h1>
        <p>更新日期：2020年5月7日</p>
        <h4>
          <a name="header-n1233" class="md-header-anchor"></a>第一条：立约背景
        </h4>
        <p>
          为了规范京东物流开放平台合作伙伴(以下简称“开发者”或“商家”)通过京东物流开放平台进行的各项行为，包括但不限于通过京东物流开放平台调用应用数据接口（即API）、数据推送服务，明确开发者的权利义务，营造规范、有序、安全的京东物流开放平台环境，保障开发者及用户的合法权益，故拟定本协议。
        </p>
        <h4>
          <a name="header-n1235" class="md-header-anchor"></a>第二条：签约主体
        </h4>
        <p>本协议由北京京东振世信息技术有限公司（京东物流）与开发者签署。</p>
        <h4>
          <a name="header-n1237" class="md-header-anchor"></a
          >第三条、协议生效和适用范围
        </h4>
        <p>
          3.1、您通过网络页面点击确认或以其他方式选择接受本协议，包括但不限于未点击确认本协议但使用了京东物流京东物流开放平台的服务，即表示您与京东物流已达成一致并同意接受本协议的全部约定内容。本协议自您确认接受之时起或自您使用京东物流京东物流开放平台服务的行为发生之时起（以时间在先者为准）生效。
        </p>
        <p>
          3.2、本协议内容包括协议正文以及所有京东物流已经发布的或将来可能发布的各类规则（含业务规范，以下同）、通知、公告等（以下合称“规则”）。所有规则为协议不可分割的组成部分，与协议正文具有同等法律效力。京东物流有权根据需要不时地制定、修改本协议和/或各类规则，如有任何变更，京东物流将以网站公示的方式进行公告，而不再单独通知您。变更后的协议和规则一经公布即自动生效，成为本协议的一部分。如您不同意相关变更，应当立即停止使用京东物流京东物流开放平台服务；如您继续使用京东物流京东物流开放平台服务的，则视为您对修改后的协议和规则不持异议并同意遵守。
        </p>
        <h4>
          <a name="header-n1240" class="md-header-anchor"></a>第四条：定义
        </h4>
        <p>
          4.1、京东物流开放平台（以下简称“京东物流开放平台”）：指基于此平台将京东物流相关业务对外开放，由京东物流提供一些软件和支持材料，开发者通过这些软件和支持材料开发应用以便服务于自身或服务于其他商家。开发者可以通过京东物流开放平台应用编程接口调用指定的功能服务，访问由京东物流提供的或用户授权的与用户相关的数据，或者由京东物流开放平台向用户推送回传消息。京东物流开放平台可能包括但不限于一个或多个API、编程工具和文档。
        </p>
        <p>
          4.2、开发者：指京东用户中通过有效申请并通过验证的可以基于京东物流开放平台进行应用开发的单位或者个人。
        </p>
        <p>
          4.3、应用：指开发者基于京东物流开放平台所开发的软件或服务，包括自用型应用和他用型应用两种类型。
        </p>
        <p>
          4.4、App key &amp; App
          secret：指开发者在申请开发新应用时获得的由京东物流授予的应用程序接入账户和密钥。App
          key是应用的唯一标识，京东物流通过App key来识别应用开发者的身份。App
          secret是京东物流给应用分配的密钥，该密钥在一定技术条件下可保证应用来源的可靠性。
        </p>
        <p>
          4.5、API：指对所有业务开放、开发者无需申请即可自由使用的京东物流开放平台数据接口。
        </p>
        <p>4.6、Access token：商家对App授权，访问商家数据。</p>
        <p>4.7、数据推送：京东物流开放平台推送数据给开发者，如入库单状态等。</p>
        <h4>
          <a name="header-n1248" class="md-header-anchor"></a
          >第五条：京东物流开放平台服务使用规范
        </h4>
        <p>
          5.1、开发者成功入驻京东物流开放平台后，京东物流将根据您的登录账户和密码确认您的身份；开通京东物流开放平台服务的账户仅限于开发者自身使用，开发者不得将该账户以任何形式向任何第三方转让、出租、出借、泄露、披露等。您应妥善保管账户和密码，并对使用该账户和密码所进行的一切行为承担全部责任。您承诺在密码或账户遭到未获授权的使用，或者发生其他安全问题时，将立即通知京东物流，且您同意并确认，除非因京东物流过错导致账户被盗，京东物流不对上述情形产生的任何直接或间接的遗失或损害承担责任。
        </p>
        <p>5.2、开发者同意接收来自京东物流发出的邮件、信息。</p>
        <p>
          5.3、开发者一旦在京东物流开放平台申请成功，成为开发者，并在申请发布一个新应用时，开发者将得到一个针对该应用的唯一的App
          key 和App secret
          。开发者同意通过京东物流开放平台提供的途径合法获取应用标识（App
          key）及密钥（App secret）。开发者对App key 和App
          secret的机密负完全责任。开发者同意任何时候都不使用其他开发者的App key
          和App secret，也不将自身的App key 和App
          secret透露给任何第三方。开发者同意在发现或怀疑他人未经授权就使用其App
          key 和App secret时立即通知京东物流。京东物流对开发者的App key 和App
          secret的所有使用情况，包括但不限于任何未经授权的访问、更改或者删除、破坏、损害、丢失或未能存储均不承担任何责任。
        </p>
        <p>
          5.4、开发者同意不能将App key、App secret、access
          token发布在公共网络上，包括但不限于github、知乎、简书等。
        </p>
        <h4>
          <a name="header-n1254" class="md-header-anchor"></a
          >第六条：用户行为规范
        </h4>
        <p>
          6.1、<strong
            >您同意严格遵守法律法规规章规定，依法遵守以下义务：</strong
          >
        </p>
        <p>
          （1）不得制作、传输或发表以下违法信息资料：反对宪法所确定的基本原则，煽动抗拒、破坏宪法和法律法规实施的；危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的，煽动推翻社会主义制度的；损害国家荣誉和利益的；歪曲、丑化、亵渎、否定英雄烈士事迹和精神，侵害英雄烈士的姓名、肖像、名誉、荣誉的；宣扬或煽动实施恐怖主义、极端主义及其活动的；煽动民族仇恨、民族歧视、破坏民族团结的言论；破坏国家宗教政策，宣扬邪教和封建迷信的；散布谣言，扰乱经济秩序和社会秩序的；散布淫秽、色情、暴力或者教唆犯罪的；侮辱或者诽谤他人，侵害他人名誉、隐私和其他合法权益的；法律、行政法规禁止的其他内容。
        </p>
        <p>
          （2）防范和抵制制作、复制、发布含有下列内容的不良信息资料：不当评述自然灾害、重大事故等灾难的；煽动人群歧视、地域歧视等的；宣扬低俗、庸俗、媚俗内容的；违反社会公德行为等的；其他对网络生态造成不良影响的内容。
        </p>
        <p>
          6.2、
          <strong
            >本协议依据国家相关法律法规规章制定，您亦同意严格遵守以下义务：</strong
          >
        </p>
        <p>（1）从中国大陆向境外传输资料信息时必须符合中国有关法规；</p>
        <p>
          （2）不得利用本网站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；
        </p>
        <p>
          （3）不得干扰本网站的正常运转，不得侵入本网站及国家计算机信息系统；
        </p>
        <p>
          （4）不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的、淫秽的、不文明的等信息资料；
        </p>
        <p>（5）不得教唆他人从事违法违规或本协议、平台规则所禁止的行为；</p>
        <p>（6）不得利用在本网站注册的账户进行牟利性经营活动；</p>
        <p>
          （7）不得发布任何侵犯他人个人信息、著作权、商标权等知识产权或合法权利的内容；
        </p>
        <p>
          6.3、<strong
            >您须对自己在网上的言论和行为承担法律责任，您若在本网站上散布和传播反动、色情或其它违反国家法律的信息，本网站的系统记录有可能作为您违反法律的证据。</strong
          >
        </p>
        <p></p>
        <h4>
          <a name="header-n1260" class="md-header-anchor"></a>第七条：违约责任
        </h4>
        <p>
          7.1、您明确理解并同意京东物流有权以普通或非专业人员的知识水平标准对您的行为进行单方认定，并根据单方认定结果适用规则予以处理或中止、终止向您提供服务（包括中止或终止京东物流开放平台API的调用，以下同），且无须征得您的同意或提前通知予您。京东物流根据相关规则对您进行处理后，不免除您应当承担的法律责任。
        </p>
        <p>
          7.2、如因您违反有关法律法规或者本协议、相关规则之规定，使京东物流遭受任何损失、受到用户、任何第三方的索赔或任何行政管理部门的处罚，您应对京东物流、用户或相关第三方的实际损失进行全额赔偿，包括合理的律师费用。
        </p>
        <h4>
          <a name="header-n1264" class="md-header-anchor"></a
          >第八条：免责和有限责任
        </h4>
        <p>
          对于开发、运营、支持和维护开发者应用，开发者同意独立承担所有的风险和后果。京东物流没有责任和义务对于发布在京东物流京东物流开放平台上的任何不准确或不正确的内容承担任何责任，无论该等不准确是由用户所造成的，还是由于应用所使用的或与应用相连接的任何设备或程序所造成的。
        </p>
        <h4>
          <a name="header-n1266" class="md-header-anchor"></a
          >第九条：协议终止与转让
        </h4>
        <p>9.1、<strong>本协议在符合以下任意一项情形时终止：</strong></p>
        <p>
          9.1.1、通知解除：京东物流可提前15天以书面通知的方式终止本协议而无须承担违约责任；
        </p>
        <p>
          9.1.2、单方解除权：出现下列情况之一的，京东物流有权立刻终止本协议，且按有关规则对您进行处罚：
        </p>
        <p>
          （1）您违反本协议中的任何承诺或保证，包括但不限于本协议项下的任何约定；
        </p>
        <p>
          （2）您违反京东物流平台的相关条款、协议、规则、通告等相关规定，而被京东物流平台终止提供服务的；
        </p>
        <p>
          9.1.3、如开发者在本协议终止后再一次直接或间接或以他人名义注册并登录京东物流京东物流开放平台的，京东物流有权直接单方面终止向该开发者提供服务。
        </p>
        <p>
          9.1.4、如京东物流通过开发者提供的信息与开发者联系时，发现开发者在注册时填写的电子邮箱已不存在或无法接收电子邮件的，经京东物流以其他联系方式通知开发者更改而开发者在三个工作日内仍未能提供新的电子邮箱地址的，京东物流有权终止向该开发者提供服务。
        </p>
        <p>9.1.5、本协议规定的其他协议终止条件发生或实现，导致本协议终止。</p>
        <p>9.2、<strong>协议终止后的处理：</strong></p>
        <p>
          9.2.1、服务终止后，京东物流没有义务为开发者保留原账户中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给开发者或用户或第三方，亦不就终止服务而对开发者或用户或任何第三方承担任何责任。
        </p>
        <p>
          9.2.2、不论京东物流与开发者之间的服务因任何原因以任何方式终止，京东物流仍有权：
        </p>
        <p>
          （1）对于开发者在服务终止前实施的违法或违约行为所导致的任何赔偿和责任，开发者必须完全独立地承担，京东物流有追索权；
        </p>
        <p>
          （2）要求开发者立即删除其从京东物流开放平台中获得的全部数据，包括但不限于用户数据、京东物流开放平台运营数据；且京东物流有权基于数据安全的考虑不经通知径行做出删除相关数据的处理措施。
        </p>
        <p>
          9.3、<strong
            >无论本协议因何原因终止，在协议终止前的行为所导致的任何责任，您必须完全且独立地承担；协议终止后，京东物流无需继续向您提供服务。</strong
          >
        </p>
        <h4>
          <a name="header-n1279" class="md-header-anchor"></a>第十条：通知和送达
        </h4>
        <p>
          10.1、京东物流对于开发者所有的通知均可通过网页公告、电子邮件、手机短信或常规的信件传送等方式进行；该等通知于发送之日视为已送达收件人。
        </p>
        <p>
          10.2、开发者对于京东物流的通知应当通过京东物流对外正式公布的通信地址、传真号码、电子邮件地址等联系信息进行送达。
        </p>
        <h4>
          <a name="header-n1282" class="md-header-anchor"></a
          >第十一条：法律适用与管辖
        </h4>
        <p>
          11.1、本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国大陆地区法律。
        </p>
        <p>
          11.2、因京东物流与您就本协议的签订、履行或解释发生争议，双方应努力友好协商解决。如协商不成，京东物流和您均同意由被告住所地人民法院作为第一审管辖法院。
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="JDXY = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      JDXY: false,
    };
  },
  methods: {
    showJDXY() {
      this.JDXY = true;
    },
  },
};
</script>
<style scoped>
html {
  overflow-x: initial !important;
}
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --select-text-bg-color: #b5d6fc;
  --select-text-font-color: auto;
  --monospace: "Lucida Console", Consolas, "Courier", monospace;
}
html {
  font-size: 14px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
body {
  margin: 0px;
  padding: 0px;
  height: auto;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  font-size: 1rem;
  line-height: 1.42857;
  overflow-x: hidden;
  background: inherit;
  tab-size: 4;
}
iframe {
  margin: auto;
}
a.url {
  word-break: break-all;
}
a:active,
a:hover {
  outline: 0px;
}
.in-text-selection,
::selection {
  text-shadow: none;
  background: var(--select-text-bg-color);
  color: var(--select-text-font-color);
}
#write {
  margin: 0px auto;
  height: auto;
  width: inherit;
  word-break: normal;
  word-wrap: break-word;
  position: relative;
  white-space: normal;
  overflow-x: visible;
  padding-top: 40px;
}
#write.first-line-indent p {
  text-indent: 2em;
}
#write.first-line-indent li p,
#write.first-line-indent p * {
  text-indent: 0px;
}
#write.first-line-indent li {
  margin-left: 2em;
}
.for-image #write {
  padding-left: 8px;
  padding-right: 8px;
}
body.typora-export {
  padding-left: 30px;
  padding-right: 30px;
}
.typora-export .footnote-line,
.typora-export li,
.typora-export p {
  white-space: pre-wrap;
}
@media screen and (max-width: 500px) {
  body.typora-export {
    padding-left: 0px;
    padding-right: 0px;
  }
  #write {
    padding-left: 20px;
    padding-right: 20px;
  }
  .CodeMirror-sizer {
    margin-left: 0px !important;
  }
  .CodeMirror-gutters {
    display: none !important;
  }
}
#write li > figure:first-child {
  margin-top: -20px;
}
#write ol,
#write ul {
  position: relative;
}
img {
  max-width: 100%;
  vertical-align: middle;
}
input,
select,
textarea {
  color: inherit;
  font-style: inherit;
  font-variant: inherit;
  font-weight: inherit;
  font-stretch: inherit;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
}
input[type="checkbox"],
input[type="radio"] {
  line-height: normal;
  padding: 0px;
}
*,
::after,
::before {
  box-sizing: border-box;
}
#write h1,
#write h2,
#write h3,
#write h4,
#write h5,
#write h6,
#write p,
#write pre {
  width: inherit;
}
#write h1,
#write h2,
#write h3,
#write h4,
#write h5,
#write h6,
#write p {
  position: relative;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  break-after: avoid-page;
  break-inside: avoid;
  orphans: 2;
}
p {
  orphans: 4;
}
h1 {
  font-size: 2rem;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
h2 {
  font-size: 1.8rem;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
h3 {
  font-size: 1.6rem;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
h4 {
  font-size: 1.4rem;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
h5 {
  font-size: 1.2rem;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
h6 {
  font-size: 1rem;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
.md-math-block,
.md-rawblock,
h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.hidden {
  display: none;
}
.md-blockmeta {
  color: rgb(204, 204, 204);
  font-weight: 700;
  font-style: italic;
}
a {
  cursor: pointer;
}
sup.md-footnote {
  padding: 2px 4px;
  background-color: rgba(238, 238, 238, 0.7);
  color: rgb(85, 85, 85);
  border-radius: 4px;
  cursor: pointer;
}
sup.md-footnote a,
sup.md-footnote a:hover {
  color: inherit;
  text-transform: inherit;
  text-decoration: inherit;
}
#write input[type="checkbox"] {
  cursor: pointer;
  width: inherit;
  height: inherit;
}
figure {
  overflow-x: auto;
  margin: 1.2em 0px;
  max-width: calc(100% + 16px);
  padding: 0px;
}
figure > table {
  margin: 0px !important;
}
tr {
  break-inside: avoid;
  break-after: auto;
}
thead {
  display: table-header-group;
}
table {
  border-collapse: collapse;
  border-spacing: 0px;
  width: 100%;
  overflow: auto;
  break-inside: auto;
  text-align: left;
}
table.md-table td {
  min-width: 32px;
}
.CodeMirror-gutters {
  border-right: 0px;
  background-color: inherit;
}
.CodeMirror-linenumber {
  user-select: none;
}
.CodeMirror {
  text-align: left;
}
.CodeMirror-placeholder {
  opacity: 0.3;
}
.CodeMirror pre {
  padding: 0px 4px;
}
.CodeMirror-lines {
  padding: 0px;
}
div.hr:focus {
  cursor: none;
}
#write pre {
  white-space: pre-wrap;
}
#write.fences-no-line-wrapping pre {
  white-space: pre;
}
#write pre.ty-contain-cm {
  white-space: normal;
}
.CodeMirror-gutters {
  margin-right: 4px;
}
.md-fences {
  font-size: 0.9rem;
  display: block;
  break-inside: avoid;
  text-align: left;
  overflow: visible;
  white-space: pre;
  background: inherit;
  position: relative !important;
}
.md-diagram-panel {
  width: 100%;
  margin-top: 10px;
  text-align: center;
  padding-top: 0px;
  padding-bottom: 8px;
  overflow-x: auto;
}
#write .md-fences.mock-cm {
  white-space: pre-wrap;
}
.md-fences.md-fences-with-lineno {
  padding-left: 0px;
}
#write.fences-no-line-wrapping .md-fences.mock-cm {
  white-space: pre;
  overflow-x: auto;
}
.md-fences.mock-cm.md-fences-with-lineno {
  padding-left: 8px;
}
.CodeMirror-line,
twitterwidget {
  break-inside: avoid;
}
.footnotes {
  opacity: 0.8;
  font-size: 0.9rem;
  margin-top: 1em;
  margin-bottom: 1em;
}
.footnotes + .footnotes {
  margin-top: 0px;
}
.md-reset {
  margin: 0px;
  padding: 0px;
  border: 0px;
  outline: 0px;
  vertical-align: top;
  background: 0px 0px;
  text-decoration: none;
  text-shadow: none;
  float: none;
  position: static;
  width: auto;
  height: auto;
  white-space: nowrap;
  cursor: inherit;
  -webkit-tap-highlight-color: transparent;
  line-height: normal;
  font-weight: 400;
  text-align: left;
  box-sizing: content-box;
  direction: ltr;
}
li div {
  padding-top: 0px;
}
blockquote {
  margin: 1rem 0px;
}
li .mathjax-block,
li p {
  margin: 0.5rem 0px;
}
li {
  margin: 0px;
  position: relative;
}
blockquote > :last-child {
  margin-bottom: 0px;
}
blockquote > :first-child,
li > :first-child {
  margin-top: 0px;
}
.footnotes-area {
  color: rgb(136, 136, 136);
  margin-top: 0.714rem;
  padding-bottom: 0.143rem;
  white-space: normal;
}
#write .footnote-line {
  white-space: pre-wrap;
}
@media print {
  body,
  html {
    border: 1px solid transparent;
    height: 99%;
    break-after: avoid;
    break-before: avoid;
  }
  #write {
    margin-top: 0px;
    padding-top: 0px;
    border-color: transparent !important;
  }
  .typora-export * {
    -webkit-print-color-adjust: exact;
  }
  html.blink-to-pdf {
    font-size: 13px;
  }
  .typora-export #write {
    padding-left: 32px;
    padding-right: 32px;
    padding-bottom: 0px;
    break-after: avoid;
  }
  .typora-export #write::after {
    height: 0px;
  }
  @page {
    margin: 20mm 0px;
  }
}
.footnote-line {
  margin-top: 0.714em;
  font-size: 0.7em;
}
a img,
img a {
  cursor: pointer;
}
pre.md-meta-block {
  font-size: 0.8rem;
  min-height: 0.8rem;
  white-space: pre-wrap;
  background: rgb(204, 204, 204);
  display: block;
  overflow-x: hidden;
}
p > .md-image:only-child:not(.md-img-error) img,
p > img:only-child {
  display: block;
  margin: auto;
}
p > .md-image:only-child {
  display: inline-block;
  width: 100%;
}
#write .MathJax_Display {
  margin: 0.8em 0px 0px;
}
.md-math-block {
  width: 100%;
}
.md-math-block:not(:empty)::after {
  display: none;
}
[contenteditable="true"]:active,
[contenteditable="true"]:focus {
  outline: 0px;
  box-shadow: none;
}
.md-task-list-item {
  position: relative;
  list-style-type: none;
}
.task-list-item.md-task-list-item {
  padding-left: 0px;
}
.md-task-list-item > input {
  position: absolute;
  top: 0px;
  left: 0px;
  margin-left: -1.2em;
  margin-top: calc(1em - 10px);
  border: none;
}
.math {
  font-size: 1rem;
}
.md-toc {
  min-height: 3.58rem;
  position: relative;
  font-size: 0.9rem;
  border-radius: 10px;
}
.md-toc-content {
  position: relative;
  margin-left: 0px;
}
.md-toc-content::after,
.md-toc::after {
  display: none;
}
.md-toc-item {
  display: block;
  color: rgb(65, 131, 196);
}
.md-toc-item a {
  text-decoration: none;
}
.md-toc-inner:hover {
  text-decoration: underline;
}
.md-toc-inner {
  display: inline-block;
  cursor: pointer;
}
.md-toc-h1 .md-toc-inner {
  margin-left: 0px;
  font-weight: 700;
}
.md-toc-h2 .md-toc-inner {
  margin-left: 2em;
}
.md-toc-h3 .md-toc-inner {
  margin-left: 4em;
}
.md-toc-h4 .md-toc-inner {
  margin-left: 6em;
}
.md-toc-h5 .md-toc-inner {
  margin-left: 8em;
}
.md-toc-h6 .md-toc-inner {
  margin-left: 10em;
}
@media screen and (max-width: 48em) {
  .md-toc-h3 .md-toc-inner {
    margin-left: 3.5em;
  }
  .md-toc-h4 .md-toc-inner {
    margin-left: 5em;
  }
  .md-toc-h5 .md-toc-inner {
    margin-left: 6.5em;
  }
  .md-toc-h6 .md-toc-inner {
    margin-left: 8em;
  }
}
a.md-toc-inner {
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
}
.footnote-line a:not(.reversefootnote) {
  color: inherit;
}
.md-attr {
  display: none;
}
.md-fn-count::after {
  content: ".";
}
code,
pre,
samp,
tt {
  font-family: var(--monospace);
}
kbd {
  margin: 0px 0.1em;
  padding: 0.1em 0.6em;
  font-size: 0.8em;
  color: rgb(36, 39, 41);
  background: rgb(255, 255, 255);
  border: 1px solid rgb(173, 179, 185);
  border-radius: 3px;
  box-shadow: rgba(12, 13, 14, 0.2) 0px 1px 0px,
    rgb(255, 255, 255) 0px 0px 0px 2px inset;
  white-space: nowrap;
  vertical-align: middle;
}
.md-comment {
  color: rgb(162, 127, 3);
  opacity: 0.8;
  font-family: var(--monospace);
}
code {
  text-align: left;
  vertical-align: initial;
}
a.md-print-anchor {
  white-space: pre !important;
  border-width: initial !important;
  border-style: none !important;
  border-color: initial !important;
  display: inline-block !important;
  position: absolute !important;
  width: 1px !important;
  right: 0px !important;
  outline: 0px !important;
  background: 0px 0px !important;
  text-decoration: initial !important;
  text-shadow: initial !important;
}
.md-inline-math .MathJax_SVG .noError {
  display: none !important;
}
.html-for-mac .inline-math-svg .MathJax_SVG {
  vertical-align: 0.2px;
}
.md-math-block .MathJax_SVG_Display {
  text-align: center;
  margin: 0px;
  position: relative;
  text-indent: 0px;
  max-width: none;
  max-height: none;
  min-height: 0px;
  min-width: 100%;
  width: auto;
  overflow-y: hidden;
  display: block !important;
}
.MathJax_SVG_Display,
.md-inline-math .MathJax_SVG_Display {
  width: auto;
  margin: inherit;
  display: inline-block !important;
}
.MathJax_SVG .MJX-monospace {
  font-family: var(--monospace);
}
.MathJax_SVG .MJX-sans-serif {
  font-family: sans-serif;
}
.MathJax_SVG {
  display: inline;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  zoom: 90%;
  text-indent: 0px;
  text-align: left;
  text-transform: none;
  letter-spacing: normal;
  word-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  float: none;
  direction: ltr;
  max-width: none;
  max-height: none;
  min-width: 0px;
  min-height: 0px;
  border: 0px;
  padding: 0px;
  margin: 0px;
}
.MathJax_SVG * {
  transition: none;
}
.MathJax_SVG_Display svg {
  vertical-align: middle !important;
  margin-bottom: 0px !important;
}
.os-windows.monocolor-emoji .md-emoji {
  font-family: "Segoe UI Symbol", sans-serif;
}
.md-diagram-panel > svg {
  max-width: 100%;
}
[lang="mermaid"] svg,
[lang="flow"] svg {
  max-width: 100%;
}
[lang="mermaid"] .node text {
  font-size: 1rem;
}
table tr th {
  border-bottom: 0px;
}
video {
  max-width: 100%;
  display: block;
  margin: 0px auto;
}
iframe {
  max-width: 100%;
  width: 100%;
  border: none;
}
.highlight td,
.highlight tr {
  border: 0px;
}

:root {
  --side-bar-bg-color: #fafafa;
  --control-text-color: #777;
}
html {
  font-size: 16px;
}
body {
  font-family: "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  color: rgb(51, 51, 51);
  line-height: 1.6;
}
#write {
  max-width: 860px;
  margin: 0px auto;
  padding: 0px 10px 10px 10px;
}
#write > ul:first-child,
#write > ol:first-child {
  margin-top: 30px;
}
a {
  color: rgb(65, 131, 196);
}
h1,
h2,
h3,
h4,
h5,
h6 {
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  line-height: 1.4;
  cursor: text;
}
h1:hover a.anchor,
h2:hover a.anchor,
h3:hover a.anchor,
h4:hover a.anchor,
h5:hover a.anchor,
h6:hover a.anchor {
  text-decoration: none;
}
h1 tt,
h1 code {
  font-size: inherit;
}
h2 tt,
h2 code {
  font-size: inherit;
}
h3 tt,
h3 code {
  font-size: inherit;
}
h4 tt,
h4 code {
  font-size: inherit;
}
h5 tt,
h5 code {
  font-size: inherit;
}
h6 tt,
h6 code {
  font-size: inherit;
}
h1 {
  padding-bottom: 0.3em;
  font-size: 2.25em;
  line-height: 1.2;
  border-bottom: 1px solid rgb(238, 238, 238);
}
h2 {
  padding-bottom: 0.3em;
  font-size: 1.75em;
  line-height: 1.225;
  border-bottom: 1px solid rgb(238, 238, 238);
}
h3 {
  font-size: 1.5em;
  line-height: 1.43;
}
h4 {
  font-size: 1.25em;
}
h5 {
  font-size: 1em;
}
h6 {
  font-size: 1em;
  color: rgb(119, 119, 119);
}
p,
blockquote,
ul,
ol,
dl,
table {
  margin: 0.8em 0px;
}
li > ol,
li > ul {
  margin: 0px;
}
hr {
  height: 2px;
  padding: 0px;
  margin: 16px 0px;
  background-color: rgb(231, 231, 231);
  border: 0px none;
  overflow: hidden;
  box-sizing: content-box;
}
li p.first {
  display: inline-block;
}
ul,
ol {
  padding-left: 30px;
}
ul:first-child,
ol:first-child {
  margin-top: 0px;
}
ul:last-child,
ol:last-child {
  margin-bottom: 0px;
}
blockquote {
  border-left: 4px solid rgb(223, 226, 229);
  padding: 0px 15px;
  color: rgb(119, 119, 119);
}
blockquote blockquote {
  padding-right: 0px;
}
table {
  padding: 0px;
  word-break: initial;
}
table tr {
  border-top: 1px solid rgb(223, 226, 229);
  margin: 0px;
  padding: 0px;
}
table tr:nth-child(2n),
thead {
  background-color: rgb(248, 248, 248);
}
table tr th {
  font-weight: bold;
  border-width: 1px 1px 0px;
  border-top-style: solid;
  border-right-style: solid;
  border-left-style: solid;
  border-top-color: rgb(223, 226, 229);
  border-right-color: rgb(223, 226, 229);
  border-left-color: rgb(223, 226, 229);
  border-image: initial;
  border-bottom-style: initial;
  border-bottom-color: initial;
  text-align: left;
  margin: 0px;
  padding: 6px 13px;
}
table tr td {
  border: 1px solid rgb(223, 226, 229);
  text-align: left;
  margin: 0px;
  padding: 6px 13px;
}
table tr th:first-child,
table tr td:first-child {
  margin-top: 0px;
}
table tr th:last-child,
table tr td:last-child {
  margin-bottom: 0px;
}
.CodeMirror-lines {
  padding-left: 4px;
}
.code-tooltip {
  box-shadow: rgba(0, 28, 36, 0.3) 0px 1px 1px 0px;
  border-top: 1px solid rgb(238, 242, 242);
}
.md-fences,
code,
tt {
  border: 1px solid rgb(231, 234, 237);
  background-color: rgb(248, 248, 248);
  border-radius: 3px;
  padding: 2px 4px 0px;
  font-size: 0.9em;
}
code {
  background-color: rgb(243, 244, 244);
  padding: 0px 2px;
}
.md-fences {
  margin-bottom: 15px;
  margin-top: 15px;
  padding-top: 8px;
  padding-bottom: 6px;
}
.md-task-list-item > input {
  margin-left: -1.3em;
}
@media print {
  html {
    font-size: 13px;
  }
  table,
  pre {
    break-inside: avoid;
  }
  pre {
    word-wrap: break-word;
  }
}
.md-fences {
  background-color: rgb(248, 248, 248);
}
#write pre.md-meta-block {
  padding: 1rem;
  font-size: 85%;
  line-height: 1.45;
  background-color: rgb(247, 247, 247);
  border: 0px;
  border-radius: 3px;
  color: rgb(119, 119, 119);
  margin-top: 0px !important;
}
.mathjax-block > .code-tooltip {
  bottom: 0.375rem;
}
.md-mathjax-midline {
  background: rgb(250, 250, 250);
}
#write > h3.md-focus::before {
  left: -1.5625rem;
  top: 0.375rem;
}
#write > h4.md-focus::before {
  left: -1.5625rem;
  top: 0.285714rem;
}
#write > h5.md-focus::before {
  left: -1.5625rem;
  top: 0.285714rem;
}
#write > h6.md-focus::before {
  left: -1.5625rem;
  top: 0.285714rem;
}
.md-image > .md-meta {
  border-radius: 3px;
  padding: 2px 0px 0px 4px;
  font-size: 0.9em;
  color: inherit;
}
.md-tag {
  color: rgb(167, 167, 167);
  opacity: 1;
}
.md-toc {
  margin-top: 20px;
  padding-bottom: 20px;
}
.sidebar-tabs {
  border-bottom: none;
}
#typora-quick-open {
  border: 1px solid rgb(221, 221, 221);
  background-color: rgb(248, 248, 248);
}
#typora-quick-open-item {
  background-color: rgb(250, 250, 250);
  border-color: rgb(254, 254, 254) rgb(229, 229, 229) rgb(229, 229, 229)
    rgb(238, 238, 238);
  border-style: solid;
  border-width: 1px;
}
.on-focus-mode blockquote {
  border-left-color: rgba(85, 85, 85, 0.12);
}
header,
.context-menu,
.megamenu-content,
footer {
  font-family: "Segoe UI", Arial, sans-serif;
}
.file-node-content:hover .file-node-icon,
.file-node-content:hover .file-node-open-state {
  visibility: visible;
}
.mac-seamless-mode #typora-sidebar {
  background-color: var(--side-bar-bg-color);
}
.md-lang {
  color: rgb(180, 101, 77);
}
.html-for-mac .context-menu {
  --item-hover-bg-color: #e6f0fe;
}
#md-notification .btn {
  border: 0px;
}
.dropdown-menu .divider {
  border-color: rgb(229, 229, 229);
}
.typora-export li,
.typora-export p,
.typora-export,
.footnote-line {
  white-space: normal;
}
</style>