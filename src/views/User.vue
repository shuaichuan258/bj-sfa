<template>
  <div class="user">
    <div class="user-bd">
      <TopHead title="SFA">
        <div class="edit-pwd" slot="r">修改密码</div>
      </TopHead>
      <div class="img-box">
        <input
          @change="uploadImg"
          type="file"
          class="input-file"
          accept="image/*"
          ref="file"
        />
        <img
          @click="selectFile"
          class="img-round"
          :src="LoginUser.avatar"
          alt="用户头像"
        />
      </div>
      <div class="user-desc-wrap">
        <div class="row">
          <div class="fl">员工姓名:</div>
          <div class="fr">{{ LoginUser.name }}</div>
        </div>
        <div class="row">
          <div class="fl">手机号:</div>
          <div class="fr">{{ LoginUser.phone }}</div>
        </div>
        <div class="row">
          <div class="fl">部门:</div>
          <div class="fr">{{ LoginUser.department }}</div>
        </div>
      </div>
      <div class="last-login-wrap">上次登录时间:{{ LoginUser.lastLogin }}</div>
    </div>
    <div class="user-bt">
      <div @click="reLogin" class="btn-l">重新登录</div>
      <div @click="logout" class="btn-r">注销</div>
    </div>
  </div>
</template>

<script>
import TopHead from '../components/TopHead.vue';
import service from '../service/index';
import canvasResize from 'canvas-resize';
import Utility from '../common/Utility';
import { mapState } from 'vuex';
export default {
  name: 'user',
  data() {
    return {};
  },
  computed: {
    ...mapState(['LoginUser'])
  },
  components: {
    TopHead
  },
  methods: {
    reLogin() {
      let loginUser = { ...this.LoginUser };
      sessionStorage.clear();
      localStorage.clear();
      this.$store.commit('clearAll');
      this.$router.push(`/?CNO=${loginUser.CNO}&PNO=${loginUser.PNO}`);
    },
    logout() {
      // 清理sessionStorage,localStorage,vuex
      sessionStorage.clear();
      localStorage.clear();
      this.$store.commit('clearAll');
      this.$router.push('/');
    },
    selectFile() {
      this.$refs.file.click();
    },
    uploadImg() {
      let formData = new FormData();
      let file = this.$refs.file.files[0];
      //对当前上传的图片file，进行压缩后，callback返回一个base64的字符串
      canvasResize(file, {
        crop: false, // 是否裁剪
        quality: 0.7, // 压缩质量  0 - 1
        rotate: 0, // 旋转角度
        callback: baseStr => {
          // console.log(baseStr.length);
          let fileBlob = Utility.convertBase64UrlToBlob(baseStr, {
            type: file.type
          });
          formData.append('imgF', fileBlob);
          service
            .uploadImg(formData)
            .then(res => {
              // 完整的图片地址:`${process.env.VUE_APP_BASEURL}${res.data.img}`
              // 把当前图片的地址修改用户
              let newUser = { ...this.LoginUser };
              newUser.avatar = `${process.env.VUE_APP_BASEURL}${res.data.img}`;
              console.log(newUser.avator);
              this.$store.commit('updateLoginUserInfo', newUser);
              // 修改服务器上的图片地址
              service.updateUserInfo(newUser);
            })
            .catch(() => {
              console.log('上传失败！');
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .user-bd {
    flex: 1;
  }

  .img-box {
    margin: px2rem(56) auto;
    height: px2rem(220);
    width: px2rem(220);
    border: px2rem(1) solid #ccc;
  }
  .img-round {
    border-radius: 50%;
    height: px2rem(220);
    width: px2rem(220);
    vertical-align: top;
  }
  .user-desc-wrap {
    border-top: px2rem(1) solid #ccc;
    padding-left: px2rem(28);
    font-size: px2rem(28);
    .row {
      padding-right: px2rem(28);
      height: px2rem(110);
      line-height: px2rem(110);
      border-bottom: px2rem(1) solid #ccc;
      .fl {
        color: #757575;
      }
    }
    .row:last-child {
      border-bottom: none;
    }
  }
  .last-login-wrap {
    padding-left: px2rem(28);
    background-color: #f4f4f4;
    border-top: px2rem(1) solid #ccc;
    border-bottom: px2rem(1) solid #ccc;
    height: px2rem(84);
    line-height: px2rem(84);
    font-size: px2rem(24);
  }
  .user-bt {
    display: flex;
    font-size: $text-size-imp;
    flex: 0 0 px2rem(110);
    line-height: px2erm(110);
    border-top: px2rem(1) solid #ccc;
    .btn-l,
    .btn-r {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    .btn-l {
      border-right: px2rem(1) solid #ccc;
    }
  }
}

.edit-pwd {
  font-size: px2rem(24);
}
</style>
