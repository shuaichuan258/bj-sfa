<template>
  <div class="search-btn">
    <i class="icon iconfont icon-sousuo" @click="$emit('search')"></i>
    <input
      @input="$emit('input', $event.target.value)"
      placeholder="请输入搜索内容"
      @keydown.enter="$emit('search')"
      type="text"
    />
  </div>
</template>

<script>
export default {
  name: 'search-btn',
  props: ['value'],
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.search-btn {
  display: flex;
  height: px2rem(64);
  background-color: #fff;
  i,
  input {
    font-size: px2rem(28);
  }
  i {
    height: px2rem(64);
    line-height: px2rem(64);
    flex: 0 0 px2rem(40);
  }
  input {
    flex: 1;
    border: none;
  }
}
</style>
