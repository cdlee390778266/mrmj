<template>
  <div>
    <div class="main-right-title" v-if="!hidePageName"><slot name="pageName">需求明细</slot></div>
    <div class="tc up" v-if="haveCarousel">
      <img src="../../../assets/img/up.png" height="12" width="60" class="pointer" @click="prev">
    </div>
    <div class="main-content" :style="{top: hidePageName ? '0' : '50px'}">
      <slot></slot>
    </div>
    <div class="tc down" v-if="haveCarousel">
      <img src="../../../assets/img/down.png" height="12" width="60" class="pointer" @click="next">
    </div>
  </div>
</template>

<script>
  export default {
    props: ['rightList', 'haveCarousel', 'hidePageName'],
    data() {
      return {
        height: 300
      };
    },
    methods: {
      prev() {
        this.$parent.$refs.carousel.prev();
        this.$emit('change');
      },
      next() {
        this.$parent.$refs.carousel.next();
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
