<template>
  <div class="Subcart">
    <div class="subcart-bd">
      <TopHead title="提交订单">
        <div slot="r">
          编辑
        </div>
      </TopHead>
      <div class="shopinfo-wrap">
        <div class="recevier-wrap">
          <span class="recevier fl">收货人:{{ curOrderShop.bossName }}</span>
          <span class="phone fr">电话:{{ curOrderShop.phone }}</span>
        </div>
        <div class="address-wrap">
          <i class="icon iconfont icon-dingwei"></i>
          {{ curOrderShop.address }}
        </div>
      </div>
      <div
        v-for="warehouse in getCurCartShop.warehouse"
        :key="warehouse.warehouseId"
      >
        <div
          class="goods-wrap"
          v-for="goods in warehouse.goods"
          :key="goods.goodsInfo.id"
        >
          <img
            class="goods-img"
            :src="goods.goodsInfo.img"
            :alt="goods.goodsInfo.title"
          />
          <div class="goods-desc-wrap">
            <h3>{{ goods.goodsInfo.title }}</h3>
            <p class="warehouse-name">{{ warehouse.warehouseName }}</p>
            <div class="price-wrap">
              <div class="price fl">
                价格:<span class="number">{{
                  goods.goodsInfo.monery * goods.count
                }}</span>
              </div>
              <div class="count fr">
                数量:<span class="count">{{ goods.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="remark-wrap">备注{{ warehouse.remark }}</div>
      </div>
    </div>
    <div class="subcart-bt">
      <div class="fl">
        合计:<span class="number">{{ getCurShopTotal }}</span
        >元
      </div>
      <div @click="subOrder" class="fr ok-btn">确认</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import service from '../service/index';
import { Toast } from 'mint-ui';
export default {
  name: 'Subcart',
  data() {
    return {};
  },
  methods: {
    subOrder() {
      service.subOrder(this.getCurCartShop).then(() => {
        // 清理已经添加的订单的数据
        this.$store.commit('subOrderClear');
        Toast('提交订单成功');
        this.$router.push('/home');
      });
    }
  },
  computed: {
    ...mapState(['curOrderShop']),
    ...mapGetters(['getCurCartShop']),
    getCurShopTotal() {
      let total = 0;
      this.getCurCartShop.warehouse.forEach(w => {
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
  }
};
</script>

<style lang="scss" scoped>
.Subcart {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  background-color: #fff;
  i {
    font-size: px2rem(28);
    color: #000;
  }
  .subcart-bd {
    flex: 1;
    .shopinfo-wrap {
      height: px2rem(170);
      background-color: #fff;
      border-bottom: px2rem(1) solid #ccc;
      .recevier-wrap {
        color: #000;
        font-size: px2rem(28);
        height: px2rem(80);
        line-height: px2rem(80);
        padding: 0 px2rem(28);
      }
      .address-wrap {
        padding: 0 px2rem(28);
        font-size: px2rem(24);
        color: #757575;
      }
    }
    .goods-wrap {
      margin-left: px2rem(28);
      border-bottom: px2rem(1) solid #ccc;
      overflow: hidden;
      padding: px2rem(28) 0;
      .goods-img {
        float: left;
        height: px2rem(124);
        width: px2rem(124);
        box-sizing: border-box;
        border: px2rem(1) solid #ccc;
      }
      .goods-desc-wrap {
        margin-left: px2rem(124);
        padding: 0 px2rem(28);
        font-size: px2rem(24);
        color: #000;
        h3 {
          height: px2rem(24);
          line-height: px2rem(24);
        }
        .warehouse-name {
          color: #757575;
          line-height: px2rem(54);
          height: px2rem(54);
        }
        .price-wrap {
          line-height: px2rem(47);
          height: px2rem(47);
        }
        .number {
          color: #f00;
        }
      }
    }
    .remark-wrap {
      height: px2rem(80);
      line-height: px2rem(80);
      font-size: px2rem(20);
      color: #000;
      padding: 0 px2rem(28);
      border-bottom: px2rem(1) solid #ccc;
    }
  }
  .subcart-bt {
    flex: 0 0 px2rem(110);
    border-top: px2rem(1) solid #ccc;
    line-height: px2rem(110);
    padding: 0 px2rem(28);
    color: #000;
    font-size: px2rem(28);
    .number {
      color: #f00;
    }
    .ok-btn {
      height: px2rem(70);
      line-height: px2rem(70);
      width: px2rem(168);
      border-radius: 5%;
      color: #fff;
      background-color: #10903d;
      margin-top: px2rem(28);
      text-align: center;
    }
  }
}
</style>
