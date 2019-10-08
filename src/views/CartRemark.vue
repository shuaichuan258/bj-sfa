<template>
  <div class="cart-remark">
    <div class="remark-bd">
      <TopHead :title="$store.state.curOrderShop.name">
        <div slot="r" class="edit-btn"></div>
      </TopHead>
      <textarea
        v-model="remark"
        @input="changeremark"
        placeholder="请填写备注信息"
        class="txt-remark"
        type="text"
      ></textarea>
      <span class="txt-len">字数：({{ getLen }} / 20)</span>
    </div>
    <div @click="submitRemark" class="remark-bottom">确定</div>
  </div>
</template>

<script>
export default {
  name: 'CartRemark',
  created() {
    this.$store.getters.getRemarkByWarehouseId(this.$route.params.id);
  },
  data() {
    return {
      remark: ''
    };
  },
  computed: {
    getLen() {
      return this.remark.length;
    }
  },
  methods: {
    submitRemark() {
      this.$store.commit('addRemarkToWarehouse', {
        remark: this.remark,
        warehouseId: this.$route.params.id
      });
    },
    changeremark(e) {
      let txt = e.target.value;
      if (txt.length > 20) {
        this.remark = txt.slice(0, 20);
      }
    }
  }
};
</script>

<style lang="scss">
.cart-remark {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  font-size: px2rem(28);
  line-height: 1.5;
  .remark-bd,
  .remark-bottom {
    background-color: #fff;
  }
  .remark-bd {
    flex: 1;
    .txt-remark {
      width: 100%;
      border: none;
      line-height: 1.5;
      background-color: #fafafa;
      box-sizing: border-box;
      height: px2rem(380);
      font-size: px2rem(28);
      padding-left: px2rem(28);
      border-bottom: px2rem(1) solid #ccc;
    }
    .txt-len {
      float: right;
      margin-right: px2rem(1) solid #ccc;
    }
  }
  .remark-bottom {
    flex: 0 0 px2rem(110);
    line-height: px2rem(110);
    font-size: px2rem(36);
    color: #10903d;
    text-align: center;
    border-top: px2rem(1) solid #ccc;
  }
}
</style>
