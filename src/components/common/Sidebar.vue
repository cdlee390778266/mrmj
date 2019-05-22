<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#000"
            text-color="#fff" active-text-color="#20a0ff" unique-opened router>
            <el-menu-item v-for="item in menu[type]" :index="`/${type}${item.path}`" :key="item.path">
                <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import MENU from '../../js/menu.js';
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                type: this.$utils.CONFIG.activeMenuType,
                menu: MENU
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path;
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        right: 0;
        top: 50px;
        bottom:23px;
        overflow-y: scroll;
        z-index: 1000;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
