<template>
  <div class="home">
    <tophead title="SFA"
      ><router-link
        to="/user"
        slot="r"
        class="icon iconfont icon-user"
      ></router-link
    ></tophead>
    <div class="main-bd">
      <div class="date-wrap">{{ getYearMonth }}</div>
      <div class="mp-wrap">
        <mp title="当前月进度" :val="getDayOfMonth" :percent="true"></mp>
        <mp title="月销售完成度" :val="DivSalesPercenta" :percent="true"></mp>
        <mp title="有效商店数" :val="MonthSalesa" :percent="false"></mp>
      </div>
    </div>
    <!-- <div id="pie" ref="pie_wrap"></div> -->
    <div class="main-nav">
      <div class="nav-cell" v-for="i in 9" :key="i">
        <template v-if="i <= menuList.length">
          <menu-cell
            :url="menuList[i - 1].url"
            :img-url="menuList[i - 1].imgUrl"
            :menu-name="menuList[i - 1].menuName"
          ></menu-cell>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HeadTop from '../components/TopHead';
import progress from '../components/pergress';
import service from '../service';
import menuCell from '../components/MenuCell';

const menuList = [
  {
    menuName: '公司通告',
    imgUrl: require('@/assets/img/gstg.png'),
    url: '/notice'
  },
  {
    menuName: '进店拜访',
    imgUrl: require('@/assets/img/jbdf.png'),
    url: '/visitshop'
  },
  {
    menuName: '电话订单',
    imgUrl: require('@/assets/img/dhdd.png'),
    url: '/phoneorder'
  },
  {
    menuName: '订单状态',
    imgUrl: require('@/assets/img/ddzt.png'),
    url: '/orders'
  },
  {
    menuName: '培训资料',
    imgUrl: require('@/assets/img/pxzl.png'),
    url: '/traning'
  },
  {
    menuName: '消息中心',
    imgUrl: require('@/assets/img/xxzx.png'),
    url: '/message'
  },
  {
    menuName: '新增门店',
    imgUrl: require('@/assets/img/xzmd.png'),
    url: '/addedshop'
  },
  {
    menuName: '数据同步',
    imgUrl: require('@/assets/img/sjtb.png'),
    url: '/asyncdata'
  }
];

export default {
  name: 'home',
  components: {
    tophead: HeadTop,
    mp: progress,
    menuCell: menuCell
  },
  data() {
    return {
      DivSalesPercenta: 0,
      MonthSalesa: 0,
      menuList
    };
  },
  created() {
    service.getUserProgress().then(res => {
      this.DivSalesPercenta = res.data.DivSalesPercent;
      this.MonthSalesa = res.data.MonthSales;
    });
  },
  computed: {
    getYearMonth() {
      let t = new Date();
      return `${t.getFullYear()}年${t.getMonth() + 1}月`;
    },
    getDayOfMonth() {
      let t = new Date();
      return parseInt((t.getDate() / 30) * 100);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .main-nav {
    flex: 1;
    padding: 0 px2rem(30);
    display: flex;
    flex-flow: row wrap;
    align-content: stretch;
    align-items: stretch;
    border-top: 1px solid #ccc;
    .nav-cell {
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      flex: 1 1 30%;
    }

    .nav-cell:nth-child(3n) {
      border-right: none;
    }
  }
}
.main-bd {
  background-color: #fff;

  .date-wrap {
    padding: px2rem(40) 0 px2rem(22);
    color: #000;
    font-size: $text-size-mid;
    text-align: center;
  }

  .mp-wrap {
    display: flex;
    justify-content: space-around;
  }
}

#pie {
  width: px2rem(500);
  height: px2rem(500);
}
</style>
