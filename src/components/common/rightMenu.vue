<template>
  <div class="right-menu" >
    <a href="javascript:;" @click="">复制</a>
    <a href="javascript:;" @click="">引用</a>
    <a href="javascript:;" @click="">删除</a>
  </div>
</template>

<script>
export default {
  props: ['top', 'left', 'cell'],
  methods: {
      
  }
}
</script>


<style scoped>
    .right-menu {
      border: 1px solid #eee;
      box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
      border-radius: 1px;
      display: block;
      font-family: Microsoft Yahei,Avenir,Helvetica,Arial,sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      position: fixed;
      background: #fff;
      border: 1px solid rgba(0,0,0,.2);
      border-radius: 3px;
      z-index: 999;
      display: block;
      a {
        padding: 2px 15px;
        width: 120px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        display: block;
        color: #1a1a1a;
      }
      user agent stylesheet
      a:-webkit-any-link {
        color: -webkit-link;
        cursor: pointer;
        text-decoration: underline;
      }
      a:hover {
        background: #42b983;
        background: #42b983;
        color: #fff;
      }
  }

</style>
