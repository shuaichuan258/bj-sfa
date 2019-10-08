<template>
  <div class="notice">
    <TopHead title="公司公告"><div slot="r"></div></TopHead>
    <div class="notices-wrap">
      <Loadmore
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :auto-fill="false"
        ref="loadmore"
        id="load"
      >
        <ul class="notices-list">
          <li
            v-for="item in getnoticeslist"
            :key="item.id"
            class="notices-item"
          >
            <router-link :to="`/notice/${item.id}`">
              <div class="notices-wrap">
                <i
                  class="icon iconfont icon-dian"
                  :class="{ readed: item.isRead }"
                ></i>
                <div class="notice-bd">
                  <h3 class="notices-title">
                    {{ item.title }}
                  </h3>
                  <p class="notices-date">{{ item.SubDate | dateFormal }}</p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </Loadmore>
    </div>
  </div>
</template>

<script>
import service from '../service/index';
import { Loadmore } from 'mint-ui';
import TopHead from '../components/TopHead';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'notice',
  data() {
    return {
      // getnoticeslist: [],
      allLoaded: false,
      startDate: null,
      endDate: null
    };
  },
  components: {
    TopHead,
    Loadmore
  },
  computed: {
    ...mapState(['getnoticeslist'])
  },
  filters: {
    dateFormal(val) {
      let d = new Date(val);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
  },
  methods: {
    ...mapMutations([
      'initgetnoticeslist',
      'unshiftMoreNotice',
      'loadMoreNotice'
    ]),
    loadTop() {
      service.getNotices(this.startDate, 10, false).then(res => {
        // this.getnoticeslist.unshift(...res.data.data.messages);
        this.unshiftMoreNotice(res.data.data.messages);
        this.startDate = new Date(this.getnoticeslist[0].SubDate);
        this.$refs.loadmore.onTopLoaded();
      });
    },
    loadBottom() {
      service.getNotices(this.endDate, 10, true).then(res => {
        if (res.data.data.messages.length <= 0) {
          this.allLoaded = false; // if all data are loaded
          return;
        }
        // this.getnoticeslist.push(...res.data.data.messages);
        this.loadMoreNotice(res.data.data.messages);
        this.endDate = new Date(
          this.getnoticeslist[this.getnoticeslist.length - 1].SubDate
        );
        this.$refs.loadmore.onBottomLoaded();
      });
    }
  },
  created() {
    this.startDate = new Date();
    service.getNotices(new Date(), 10, true).then(res => {
      // this.getnoticeslist.push(...res.data.data.messages);//本地组件的状态维护notice
      this.initgetnoticeslist(res.data.data.messages); //vuex触发突变，修改vuex中的getnoticeslist
      this.endDate = this.getnoticeslist[
        this.getnoticeslist.length - 1
      ].SubDate;
    });
  }
};
</script>

<style lang="scss" scoped>
#load::v-deep .mint-loadmore-text {
  font-size: px2rem(23);
  color: #ca2a;
}
.notices-list {
  background-color: #fff;
  .notices-item {
    // line-height: px2rem(125);
    height: px2rem(125);
    padding: px2rem(32) 0 0 px2rem(48);
    border-bottom: px2rem(1) solid #ccc;
    .notices-title {
      font-size: px2rem(28);
      color: #000;
      line-height: px2rem(28);
    }

    .notices-date {
      font-size: px2rem(20);
      color: #666;
      line-height: px2rem(16+34);
    }

    .notices-wrap {
      display: flex;
      i {
        flex: 0 0 px2rem(43);
        color: red;
        line-height: px2rem(20);
        font-size: px2rem(40);
      }
      i.readed {
        color: #ccc;
      }
    }
  }
}
</style>
