<template>
  <div class="signin">
    <TopHead title="店铺活动">
      <div slot="r" @click="submitSign">
        <span><i class="icon iconfont icon-duihao"></i></span>
      </div>
    </TopHead>
    <input
      @change="uploadImg"
      type="file"
      class="input-file"
      accept="image/*"
      ref="file"
    />
    <div class="img-box-wrap">
      <ImgBtn
        @click="$refs.file.click()"
        :isred="false"
        class="img-box"
        iconclass="icon-xiangji"
        val="拍摄照片"
      ></ImgBtn>
      <!-- <div class="img-box">2</div>
      <div class="img-box">3</div>
      <div class="img-box">4</div>
      <div class="img-box">5</div> -->
      <div
        @click="img.checked = !img.checked"
        class="img-box"
        v-for="img in imgs"
        :key="img.url"
      >
        <div v-if="img.checked" class="check-hover">
          <i class="icon iconfont icon-duihao"></i>
        </div>
        <img :src="img.url" width="100%" height="100%" />
      </div>
      <ImgBtn
        @click="removeImg"
        :isred="true"
        class="img-box"
        iconclass="icon-shanchudange"
        val="删除照片"
      ></ImgBtn>
    </div>
  </div>
</template>

<script>
console.log(process.env);
import ImgBtn from '../components/imgBtn';
import service from '../service/index';
import canvasResize from 'canvas-resize';
import Utility from '../common/Utility';
import { Toast } from 'mint-ui';
export default {
  name: 'signin',
  data() {
    return {
      imgs: []
    };
  },
  components: {
    ImgBtn
  },
  created() {},
  methods: {
    submitSign() {
      // console.log(this.$route.params.id);
      service
        .submitSigin({
          id: Date.now(),
          shopId: this.$route.params.id,
          SubOn: new Date().toLocaleDateString(),
          imgs: this.imgs.map(item => item.url)
        })
        .then(() => {
          Toast({
            message: '签到!',
            position: 'center',
            duration: 5000
          });
        })
        .catch(() => {
          Toast({
            message: '签到失败!',
            position: 'center',
            duration: 5000
          });
        });
    },
    removeImg() {
      this.imgs = this.imgs.filter(item => item.checked === false);
    },
    uploadImg() {
      // console.log(this.$refs.file.files[0]);
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
              console.log(res);
              this.imgs.push({
                checked: false,
                url: `${process.env.VUE_APP_BASEURL}${res.data.img}`
              });
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
i {
  font-size: px2rem(20);
}
.signin {
  height: 100%;
  background-color: #fff;

  .check-hover {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    background-color: rgba(125, 125, 125, 0.5);
    i {
      position: absolute;
      right: px2rem(28);
      top: px2rem(28);
      font-size: px2rem(28);
      color: red;
    }
  }
}
.img-box-wrap {
  padding: px2rem(28);
  overflow: hidden;
  padding-bottom: 0;
  .img-box {
    border: px2rem(1) solid #ccc;
    height: px2rem(220);
    width: px2rem(220);
    box-sizing: border-box;
    float: left;
    margin-right: px2rem(11);
    margin-bottom: px2rem(28);
    position: relative;
  }
  .img-box:nth-child(3n) {
    margin-right: 0;
  }
}
</style>
