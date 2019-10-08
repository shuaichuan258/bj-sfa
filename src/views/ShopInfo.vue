<template>
  <div class="shop-info">
    <TopHead title="店铺活动">
      <div slot="r">
        <span @click="stopVisit">结束拜访</span>
      </div>
    </TopHead>
    <div class="shop-info-bd">
      <h3 class="shop-name">{{ shopInfo.name }}</h3>
      <div class="shop-progress-wrap">
        <div class="shop-sales">
          <div class="fl">
            <i class="icon iconfont icon-xiaoliangzuigao"></i
            >过往半年的平均销售量
          </div>
          <div class="fr">
            {{ sailes.MonthSales.toFixed(0) }}
          </div>
        </div>
        <div class="shop-sales">
          <div class="fl">
            <i class="icon iconfont icon-xiaoliangpaixu"></i>本月至今的销售量
          </div>
          <div class="fr">
            {{ sailes.MonthAvgSales.toFixed(0) }}
          </div>
        </div>
        <div class="progress-wrap pdr28">
          <div class="progress-hd">
            <div class="fl">
              <i class="icon iconfont icon-baifenhao"></i>核心分销完成率
            </div>
            <div class="fr">{{ sailes.DivSalesPercent.toFixed(0) }}%</div>
          </div>
          <div class="progress-bar">
            <div
              class="progress-bar-val"
              :style="{ width: `${sailes.DivSalesPercent}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="history-remark-wrap">
      <div class="history-remark-hd pdl28">
        历史拜访备注：
      </div>
      <textarea placeholder="点击填写历史备注" class="history-txt-remark pdl28">
      </textarea>
    </div>
    <div class="btn-wrap">
      <div class="btn" @click="$router.push('/order/' + $route.params.id)">
        下单
      </div>
      <div class="btn act">
        <router-link :to="`/shopsignin/${$route.params.id}`">
          签到
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../service/index';
import { mapState } from 'vuex';
export default {
  name: 'ShopInfo',
  data() {
    return {
      shopInfo: null,
      sailes: {
        id: 0,
        MonthSales: 0,
        MonthAvgSales: 0,
        DivSalesPercent: 0
      }
    };
  },
  computed: {
    ...mapState(['Shops'])
  },
  created() {
    // 拿到店铺的销售进度
    service.getShopInfo(this.$route.params.id).then(res => {
      // console.log(res.data);
      // this.sailes = res.data;
      //eslint-disable-next-line
      TweenLite.to(this.sailes, 1, res.data);
    });
    // 从vuex的store中获取拿到当前店铺的信息
    this.shopInfo = this.Shops.find(item => item.id == this.$route.params.id);
    // 把当前下订单得店铺信息放到vuex中
    this.$store.commit('initcurOrderShop', { ...this.shopInfo });
  },
  methods: {
    stopVisit() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.pdr28 {
  padding-right: px2rem(28);
}
.pdl28 {
  padding-left: px2rem(28);
}
.shop-info {
  height: 100%;
  font-size: px2rem(28);
  color: #000;
  background-color: #fff;
  .shop-name {
    height: px2rem(84);
    line-height: px2rem(84);
    background-color: #fafafa;
    border-bottom: px2rem(1) solid #ccc;
    padding-left: px2rem(28);
  }
  .shop-progress-wrap {
    background-color: #fff;
    padding-left: px2rem(28);
    i {
      font-size: px2rem(28);
      padding-right: px2rem(28);
    }
    .shop-sales {
      line-height: px2rem(110);
      height: px2rem(110);
      padding: 0 px2rem(28) 0 0;
      border-bottom: px2rem(1) solid #ccc;
      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
    }
    .progress-wrap {
      padding-bottom: px2rem(32);
      .progress-hd {
        line-height: px2rem(96);
        height: px2rem(96);
        border-bottom: px2rem(1) solid #ccc;
        .fl {
          float: left;
        }
        .fr {
          float: right;
        }
      }
      .progress-bar {
        height: px2rem(12);
        border-radius: px2rem(6);
        background-color: #e4e4e4;

        .progress-bar-val {
          height: px2rem(12);
          border-radius: px2rem(6);
          background: linear-gradient(to right, #868ce4, #57c988);
          width: px2rem(300);
        }
      }
    }
  }
  .history-remark-wrap {
    .history-remark-hd {
      height: px2rem(66);
      line-height: px2rem(66);
      background-color: #fafafa;
      border: px2rem(1) solid #ccc;
    }
    .history-txt-remark {
      box-sizing: border-box;
      line-height: px2rem(28);
      padding-top: px2rem(20);
      font-size: px2rem(28);
      width: 100%;
      // display: block;
      height: px2rem(200);
      background-color: #fff;
      border: none;
      border-bottom: px2rem(1) solid #ccc;
    }
  }
  .btn-wrap {
    padding-top: px2rem(168);
    .btn {
      width: px2rem(480);
      height: px2rem(84);
      line-height: px2rem(84);
      margin: 0 auto px2rem(54);
      font-size: px2rem(36);
      color: #10903d;
      border: px2rem(2) solid #10903d;
      text-align: center;
      height: px2rem(84);
      border-radius: px2rem(5);
      // margin-bottom: px2rem(54);
    }
    .btn.act {
      color: #fff;
      background-color: #10903d;
    }
  }
}
</style>
