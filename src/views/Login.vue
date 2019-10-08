<template>
  <div class="login">
    <h1>欢迎登录SFA系统</h1>
    <div class="top_hat"></div>
    <div class="login-box">
      <!-- logo -->
      <div class="logo-wrap">
        <div class="logo-box"></div>
      </div>
      <!-- 登陆的表单 -->
      <div
        class="input-group"
        :class="{ active: act_index === 1, error: errors.has('cno') }"
      >
        <label for="cm_code">公司编号:</label>
        <input
          @focus="act_index = 1"
          name="cno"
          v-validate="{ required: true, max: 6, min: 4 }"
          type="number"
          id="cm_code"
          v-model="cm_code"
        />
      </div>
      <div
        class="input-group"
        :class="{ active: act_index === 2, error: errors.has('pno') }"
      >
        <label for="PNO">员工编号:</label>
        <input
          @focus="act_index = 2"
          type="number"
          id="PNO"
          name="pno"
          v-validate="{ required: true, max: 12, min: 4 }"
          v-model="PNO"
        />
      </div>
      <div
        class="input-group"
        :class="{ active: act_index === 3, error: errors.has('pwd') }"
      >
        <label for="Passwd">用户密码:</label>
        <input
          @focus="act_index = 3"
          type="password"
          id="Passwd"
          name="pwd"
          v-validate="{ required: true, max: 12, min: 4 }"
          v-model="passwd"
        />
      </div>
      <div class="ck-row">
        <div class="ckbox_wrap" @click="remembSet" :class="{ active: rememb }">
          <i
            class="iconfont"
            :class="{ ' icon-check-square': rememb, 'icon-border': !rememb }"
          ></i>
          <span>记住密码</span>
        </div>
        <div
          @click="autoLoginSet"
          class="ckbox_wrap"
          :class="{ active: autologin }"
        >
          <i
            class="iconfont"
            :class="{
              ' icon-check-square': autologin,
              'icon-border': !autologin
            }"
          ></i>
          <span>自动登录</span>
        </div>
      </div>
    </div>
    <div class="btn-wrap" @click="loginBtnClick">
      <p>登录</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { Indicator, Toast } from 'mint-ui';
import services from '../service/index';
import '../assets/font/iconfont.css';
export default {
  name: 'login',
  data() {
    return {
      act_index: 1,
      cm_code: '',
      PNO: '',
      passwd: '',
      rememb: false,
      autologin: false
    };
  },
  mounted() {
    let data = JSON.parse(localStorage.getItem('Login_data'));
    if (data) {
      this.cm_code = data.CNO;
      this.PNO = data.PNO;
      this.passwd = data.Passwd;
      this.autologin = data.autologin;
      this.rememb = data.rememb;
    } else {
      this.PNO = this.$route.query.PNO;
      this.cm_code = this.$route.query.CNO;
    }
    // 强制进行校验
    this.$validator.validate();
    if (this.autologin) {
      this.loginBtnClick(); //方法就是登录
    }
  },
  methods: {
    ...mapMutations(['initUser']),
    remembSet() {
      this.rememb = !this.rememb;
      this.rememb || (this.autologin = false);
    },
    autoLoginSet() {
      // 设置当前的autologin为true或者false
      this.autologin = !this.autologin;
      // 另外设置rememb的值
      this.autologin && (this.rememb = true);
    },
    loginBtnClick() {
      // this.errors.any()//boolean 如果有错误返回true 如果没有返回false
      if (this.errors.any()) {
        return;
      }
      // 弹出等待的遮造层，防止二次点击
      Indicator.open('加载中');
      // setTimeout(() => {
      //   Indicator.close();
      // }, 2000);
      // 发送ajax请求;
      services
        .login({
          CNO: this.cm_code,
          PNO: this.PNO,
          Passwd: this.passwd
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.code == 1) {
            // 登录成功
            // 记住用户密码
            localStorage.setItem(
              'Login_data',
              JSON.stringify({
                rememb: this.rememb,
                autologin: this.autologin,
                PNO: this.rememb ? this.PNO : '',
                CNO: this.rememb ? this.cm_code : '',
                Passwd: this.rememb ? this.passwd : ''
              })
            );
            // 把当前登录的用户信息放到sesstionStorage里面一份
            sessionStorage.setItem('LoginUser', JSON.stringify(res.data.user));
            sessionStorage.setItem(
              'LoginToken',
              JSON.stringify(res.data.token)
            );

            // 把当前用户的信息放到vuex
            // this.$store.commit("initUser", res.data.user);
            this.initUser(res.data.user);

            // 跳转到home页面
            this.$router.push('/home');
          } else {
            // 登录失败
            Toast({
              message: '用户名或者密码不正确',
              duration: 5000
            });
          }
          Indicator.close();
        })
        .catch(() => {
          // console.log("登录异常！", e);
          Toast({
            message: '登陆异常，失败',
            duration: 2000
          });
          Indicator.close();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "../lib/px2rem.scss";
@import '../assets/style/main.scss';
.mint-indicator >>> .mint-indicator-wrapper {
  width: px2rem(100);
  height: px2rem(100);
}
h1 {
  text-align: center;
  font-size: px2rem(36);
  height: px2rem(36);
  padding: px2rem(148-36-44) 0 px2rem(44) 0;
  line-height: px2rem(36);
  color: white;
}

@mixin login_wrap {
  width: px2rem(600);
  height: px2rem(836);
  margin: 0 auto;
  background-color: #fff;
  border-radius: px2rem(20);
}

.login {
  background-color: #2ade69;
  height: 100%;

  .top_hat {
    width: px2rem(537);
    height: px2rem(18);
    background-color: #eee;
    margin: 0 auto;
    border-radius: px2rem(18) px2rem(18) 0 0;
  }

  .login-box {
    @include login_wrap;
    height: px2rem(836);

    .logo-wrap {
      padding: px2rem(80) 0;

      .logo-box {
        width: px2rem(190);
        height: px2rem(190);
        margin: 0 auto;
        background: url(../assets/logo.png);
        background-size: cover;
      }
    }

    @mixin rowStyle {
      padding: 0 px2rem(36);
      color: $text-color;
      width: px2rem(401);
    }
    .input-group {
      border: 2px solid #e2e2e2;
      border-radius: px2rem(45);
      font-size: $text-size-mid;
      line-height: px2rem(90);
      @include rowStyle;
      margin: 0 auto px2rem(30);

      input {
        border: 0 none;
        font-size: $text-size-mid;
        line-height: px2rem(90);
        width: px2rem(200);
        padding-left: 1em;
      }
    }
    .input-group.active {
      color: $act-color;
      border: 2px solid $act-color;
    }

    .input-group.error {
      color: red;
      border: 2px solid red;
    }

    .ck-row {
      @include rowStyle;
      font-size: $text-size;
      display: flex;
      justify-content: space-around;

      .ckbox_wrap {
        padding-top: px2rem(8);
        padding-left: px2rem(36);

        i {
          display: inline-block;
          height: px2rem(32);
          width: px2rem(32);
          font-size: px2rem(32);
        }
      }

      .ckbox_wrap.active {
        color: $act-color;
      }
    }
  }

  .btn-wrap {
    @include login_wrap;
    height: px2rem(100);
    font-weight: bold;
    letter-spacing: px2rem(10);
    line-height: px2rem(100);
    text-align: center;
    margin-top: px2rem(20);
    font-size: $text-size-imp;
    color: $act-color;
  }
}
</style>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}
.mint-indicator-wrapper {
  width: px2rem(100);
  height: px2rem(120);
}
</style>
