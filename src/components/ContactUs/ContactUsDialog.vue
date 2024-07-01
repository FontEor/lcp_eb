
<template>
  <div class="contact-us-box">
    <div class="contact-us-box-content">
      <p class="contact-title">物流开放平台技术支持</p>
      <div class="contact-content">
        <div class="wechat-qrcode">
          <img class src="~@/assets/img/aboutUs/wechat-qrcode.png" alt="#" />
          <p class="qrcode-text">
            <img src="~@/assets/img/aboutUs/wechat-icon.png" alt="#" />微信扫码
          </p>
        </div>
        <div class="line"></div>
        <div class="text">
          <p>
            <img
              class="advisory"
              src="~@/assets/img/aboutUs/phone-icon.png"
              alt="#"
            />免费咨询电话
          </p>
          <p class="contact-phone">
            <a href="tel: 13366320890">13366320890</a>
          </p>
          <p>
            <img
              class="advisory"
              src="~@/assets/img/aboutUs/email-icon.png"
              alt="#"
            />免费咨询邮箱
          </p>
          <p class="contact-email">
            <a href="mailto:jdlcloud@jd.com">jdlcloud@jd.com</a>
          </p>
          <p class="desc">周一至周五 9:00-18:00</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactUsDialog",
};
</script>
<style lang="scss" scoped>
.contact-us-box {
  .contact-us-box-content {
    height: 180px;
    width: 354px;
    left: 0;
    top: 0;
    background: #ffffff;
    z-index: 100;
    .contact-title {
      text-align: center;
      line-height: 22px;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      margin: 12px 0;
    }
    .contact-content {
      display: flex;
      flex-flow: row;
      .wechat-qrcode {
        margin-left: 38px;
        margin-right: 20px;
        .qrcode-text {
          text-align: center;
          font-size: 12px;
        }
      }
      .line {
        width: 1px;
        height: 118px;
        background: rgba(217, 217, 217, 1);
        margin-left: 22px;
      }
      .text {
        color: #000;
        .advisory {
          width: 16px;
          height: 16px;
          margin: 2px 10px;
        }
        .contact-phone {
          color: #3c6ef0;
          margin: 6px 0px 6px 44px;
        }
        .contact-email {
          color: #3c6ef0;
          margin: 6px 0px 6px 44px;
        }
        .desc {
          font-size: 12px;
          color: #666666;
          margin-left: 20px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
