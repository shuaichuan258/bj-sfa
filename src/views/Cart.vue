<template>
  <div class="cart">
    <div class="cart-bd">
      <TopHead :title="shopName">
        <div slot="r" class="edit-btn">
          编辑
        </div>
      </TopHead>
      <Warehouse
        :warehouse="warehouse"
        v-for="warehouse in curShopCart.warehouse"
        :key="warehouse.warehouseId"
      ></Warehouse>
    </div>
    <div class="cart-bottom">
      <div class="checkbox-wrap fl">
        <CheckedBox @change="handlerCheckAll" v-model="checkAll"></CheckedBox>
        <span class="label">全选</span>
        <span>合计</span>
        <span class="number">{{ getTotal }}</span>
      </div>
      <div class="ok-btn-wrap fr">
        <router-link to="/subcart" href="javascript:" class="btn"
          >确定</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import Warehouse from '../components/Warehouse';
import { mapState } from 'vuex';
import CheckedBox from '../components/CheckBox';
export default {
  name: 'Cart',
  created() {
    this.shopName = this.$store.state.curOrderShop.name;
    this.curShopCart = this.Cart.find(
      item => item.shopId == this.curOrderShop.id
    );
  },
  computed: {
    ...mapState(['Cart', 'curOrderShop']),
    getTotal() {
      let total = 0;
      this.curShopCart.warehouse.forEach(w => {
        if (!w.checked) {
          return;
        }
        w.goods.forEach(goods => {
          if (!goods.checked) return;
          total += goods.count * goods.goodsInfo.monery;
        });
      });
      return total;
    }
  },
  methods: {
    handlerCheckAll(value) {
      this.$store.commit('selectAllCart', value);
    }
  },
  data() {
    return {
      shopName: '',
      curShopCart: null,
      checkAll: true
    };
  },
  components: {
    Warehouse,
    CheckedBox
  }
};
</script>

<style lang="scss" scoped>
.cart {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-flow: column nowrap;
  .edit-btn {
    color: #fff;
    font-size: px2rem(28);
  }
  .cart-bd {
    flex: 1;
  }
  .cart-bottom {
    flex: 0 0 px2rem(112);
    background-color: #fff;
    line-height: px2rem(112);
    font-size: px2rem(28);
    padding: 0 px2rem(28);
    .number {
      color: #f00;
    }
    .label {
      margin: 0 px2rem(66) 0 px2rem(16);
    }
    .btn {
      display: block;
      line-height: px2rem(70);
      background-color: #10903d;
      text-align: center;
      margin-top: px2rem(20);
      width: px2rem(168);
      height: px2rem(70);
      border-radius: 5%;
      color: #fff;
    }
  }
}
</style>
