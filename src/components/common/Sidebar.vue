<template>
  <div class="sidebar">
    <el-scrollbar>
      <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        background-color="#fff"
        text-color="#000"
        active-text-color="#1d9ce5"
        router
      >
        <el-submenu :index="item.orgCode" v-for="(item, key) in menu">
          <template slot="title">{{item.name}}</template>
          <el-menu-item v-for="(itemc, key) in item.list" :index="`/${type}${itemc.path}`" :key="itemc.path" v-if="!itemc.isSubPage">
          <span slot="title">{{ itemc.name }}</span>
        </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
	import MENU from "../../js/menu.js";
	import bus from "../common/bus";
	export default {
		data() {
			return {
				collapse: false,
				type: this.$utils.CONFIG.activeMenuType,
				menu: MENU
			};
		},
		computed: {
			onRoutes() {
				
				return this.$route.path;
			}
		},
		created() {

			this.type = 'sale';
		}
	};
</script>

<style lang="scss">
	.sidebar{
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom:0;
    width: 200px;
    overflow-y: scroll;
    z-index: 999;
  }
  .sidebar::-webkit-scrollbar{
      width: 0;
  }
  .sidebar > ul {
      height:100%;
  }
  .el-menu-item, .el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
  .sidebar-el-menu {
    margin: 0px 15px 15px 0;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow-x: hidden;
    .el-submenu__title, .el-menu-item {
      border-bottom: 1px solid #e0e0e0;
      border-bottom-color: #e0e0e0 !important;
      &:hover {
        background-color: #eee !important;
      }
    }
  }
</style>
