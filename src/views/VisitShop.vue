<template>
  <div class="visit-shop">
    <TopHead title="进店拜访">
      <div slot="r"></div>
    </TopHead>
    <MTab :hd-titles="['计划内', '计划外']">
      <div class="tab-bd" slot="s1">
        <div class="search-box" :class="{ active: (serchI = 1) }">
          <i @click="searchShop(false)" class="icon iconfont icon-sousuo"></i>
          <input
            type="text"
            placeholder="点击进行搜索"
            v-model="q"
            class="search"
            @focus="serchI = 1"
            @keydown.enter="searchShop(false)"
          />
        </div>
        <Loadmore
          ref="loadmore"
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
        >
          <ul class="shop-list">
            <li class="shop-item" v-for="item in Shops" :key="item.id">
              <router-link class="shop-item-link" :to="`/visitShop/${item.id}`">
                <div class="left-desc">
                  <div class="desc-hd">
                    <h3 class="shop-name">
                      {{ item.name }}
                    </h3>
                    <div class="shop-location">
                      <i class="icon iconfont icon-ding_wei"></i>
                      <span>&lt;{{ item.distance }}米</span>
                    </div>
                  </div>
                  <div class="shop-id-wrap">
                    <span class="shop-id">ID:{{ item.id }}</span>
                    <span>创建时间:{{ item.subon | formatDate }}</span>
                  </div>
                  <div class="boss-wrap">
                    <span class="boss">{{ item.bossName }}</span>
                    <span class="phone">
                      <i class="icon iconfont icon-shoujihao"></i>
                      {{ item.phone }}</span
                    >
                  </div>
                </div>
                <div class="go-gt-btn">
                  <i class="icon iconfont icon-youjiantou"></i>
                </div>
              </router-link>
            </li>
          </ul>
        </Loadmore>
      </div>
      <div class="tab-bd" slot="s2">
        <h3>没有数据</h3>
      </div>
    </MTab>
  </div>
</template>

<script>
import MTab from '../components/MTab';
import { Indicator, Loadmore } from 'mint-ui';
import { mapMutations, mapState } from 'vuex';
import service from '../service/index';
// import _ from 'loadsh';
// import { resolve } from 'dns';
export default {
  name: 'VisitShop',
  created() {
    this.getLocation()
      .then(() => {
        this.searchShop();
      })
      .catch(() => {
        this.searchShop();
      });
  },
  computed: {
    ...mapState(['Shops'])
  },
  data() {
    return {
      q: '',
      lat: '',
      lng: '',
      // shops: [],
      page: 1,
      allLoaded: false
    };
  },
  methods: {
    ...mapMutations(['initShops', 'appendShops']),
    loadBottom() {
      this.page += 1; //加载下一页的数据
      this.searchShop(true).then(() => {
        // 重新计算位置
        this.$refs.loadmore.onBottomLoaded();
      });
    },
    getLocation() {
      Indicator.open({
        text: '正在加载',
        spinnerType: 'fading-circle'
      });
      return new Promise((resolve, reject) => {
        //eslint-disable-next-line
         var geolocation = new qq.maps.Geolocation(
          'V6EBZ-VGUKU-7HHV4-4SGXW-LVBS2-XWBPG',
          'myapp'
        );
        geolocation.getLocation(
          position => {
            console.log('position:', position);
            this.lat = position.lat;
            this.lng = position.lng;
            // 发送ajax请求，获取当前的店铺信息
            resolve(position);
            Indicator.close();
          },
          err => {
            console.log('定位失败！！', err);
            reject('定位失败');
            Indicator.close();
          },
          {}
        );
      });
    },
    searchShop(isAppend) {
      Indicator.open({
        text: '请求商铺数据中',
        spinnerType: 'fading-circle'
      });
      if (isAppend) {
        this.page = 1;
      }
      return service
        .getShops({
          lat: this.lat,
          lng: this.lng,
          name_like: this.q,
          _page: this.page
        })
        .then(res => {
          if (isAppend) {
            // this.shops.push(...res.data);
            // let arr = [...this.shops, ...res.data];
            // this.shops = _.uniqBy(arr, 'id');
            this.appendShops(res.data);
          } else {
            // 如果是搜索查询，直接把shops数组进行替换
            // this.shops = res.data;
            this.initShops(res.data);
          }

          // 如果是加载更多(shops里面添加商铺信息)
          // console.log(this.shops);
          Indicator.close();
        });
    }
  },
  components: {
    MTab,
    Loadmore
  },
  filters: {
    formatDate(val) {
      let date = new Date(val);
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-bd {
  background-color: #fff;

  .search-box {
    padding: 0 px2rem(28);
    background-color: #fafafa;
    position: relative;
    font-size: px2rem(35);
    line-height: px2rem(106);
    border-bottom: px2rem(2) solid #cbcbcb;
    i {
      font-size: px2rem(35);
      position: absolute;
      left: px2rem(28);
      top: 0;
      margin-right: px2rem(15);
      cursor: pointer;
    }

    .search {
      background-color: #fafafa;
      display: block;
      font-size: px2rem(35);
      border: none;
      width: px2rem(645);
      height: px2rem(106);
      line-height: px2rem(106);
      padding-left: 1.5rem !important;
    }
  }

  .shop-list {
    padding: 0 px2rem(28);
    background-color: #fff;

    .shop-item-link {
      display: flex;
      justify-content: space-between;
      border-bottom: px2rem(1) solid #ccc;

      .left-desc {
        flex: 1;

        .desc-hd {
          display: flex;
          justify-content: space-between;
          line-height: px2rem(80);
          font-size: px2rem(28);
          color: #000;

          .shop-location {
            i {
              font-size: px2rem(25);
            }
          }
        }

        .shop-id-wrap {
          height: px2rem(24);
          font-size: px2rem(24);
          line-height: px2rem(24);

          .shop-id {
            padding-right: px2rem(47);
          }
        }

        .boss-wrap {
          overflow: hidden;
          line-height: px2rem(72);
          font-size: px2rem(24);
          height: px2rem(72);

          .boss {
            float: left;
          }

          .phone {
            float: right;
            color: #10903d;

            i {
              font-size: px2rem(24);
              color: #000;
            }
          }
        }
      }

      .go-gt-btn {
        flex: 0 0 px2rem(62-28);
        line-height: px2rem(174);
        height: px2rem(174);

        i {
          font-size: px2rem(28);
        }
      }
    }
  }
}
</style>
