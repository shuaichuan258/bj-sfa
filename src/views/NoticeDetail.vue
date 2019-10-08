<template>
  <div class="NoticeDetial">
    <TopHead title="公告信息"><div slot="r"></div></TopHead>
    <h3>{{ Notice.title }}</h3>
    <p>{{ Notice.to }}</p>
    <div>{{ Notice.text }}</div>
    <p>{{ Notice.date }}</p>
    <p>{{ Notice.address }}</p>
  </div>
</template>

<script>
import TopHead from '../components/TopHead';
import { mapState, mapMutations } from 'vuex';
import service from '../service/index';
export default {
  name: 'NoticceDetial',
  components: {
    TopHead
  },
  data() {
    return {
      Notice: null
    };
  },
  methods: {
    ...mapMutations(['setNoticeReaded'])
  },
  computed: {
    ...mapState(['getnoticeslist'])
  },
  created() {
    const routeId = this.$route.params.id;
    this.Notice = this.getnoticeslist.find(item => item.id == routeId);
    // 从后台发送消息 设置已读
    service.setNoticereaded(routeId);
    this.setNoticeReaded(routeId);
  }
};
</script>

<style lang="scss" scoped>
.NoticeDetial {
  color: #000;
  font-size: px2rem(28);
  line-height: 1.5;

  h3 {
    font-size: px2rem(30);
  }
}
</style>
