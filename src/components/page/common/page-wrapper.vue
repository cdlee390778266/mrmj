<template>
  <div>
    <div class="main-right-title"><slot name="pageName">需求明细</slot></div>
    <div class="tc up">
      <img src="../../../assets/img/up.png" height="12" width="60" class="pointer" @click="prev">
    </div>
    <div class="main-content-title">
      <div>
        <slot name="pageTitle"><i class="el-icon-lx-edit"></i> 模具零件需求信息</slot>
      </div>
    </div>
    <div class="main-content">
      <el-carousel
        direction="vertical"
        :height="height + 'px'"
        :autoplay="false"
        :loop="false"
        trigger="click"
        ref="carousel"
      >
        <el-carousel-item v-for="item in 3" :key="item">
          <slot></slot>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="tc down">
      <img src="../../../assets/img/down.png" height="12" width="60" class="pointer" @click="next">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        height: 300
      };
    },
    methods: {
      prev() {
        this.$refs.carousel.prev();
        this.$emit('change');
      },
      next() {
        this.$refs.carousel.next();
        this.$emit('change');
      }
    },
    mounted() {
      this.height = document.documentElement.clientHeight - 300;
      window.onresize = () => {
        this.height = document.documentElement.clientHeight - 300;
      }
    },
    destoryed() {
      window.onreset = null;
    }
  };
</script>

<style scoped lang="scss">
</style>
