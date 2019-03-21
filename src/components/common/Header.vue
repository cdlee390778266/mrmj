<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <!-- <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div> -->
        <div class="logo mgl10">
            <img src="../../assets/img/logo.png" height="32">
            <img src="../../assets/img/LogoText.svg" height="30" class="mgl10">
        </div>
        <div class="header-right">
            <div class="header-user-con">
                欢迎您使用系统，今天是<span class="fc9EB900">2019-03-06</span>
                <!-- 个人设置 -->
                <div class="btn-bell mgl10">
                    <el-tooltip effect="dark" content="个人设置" placement="bottom">
                        <router-link to="/tabs">
                            <img src="../../assets/img/personal.svg" height="20">
                        </router-link>
                    </el-tooltip>
                </div>
                <!-- 部门设置 -->
                <div class="btn-bell mgr20">
                    <el-tooltip effect="dark" content="部门设置" placement="bottom">
                        <router-link to="/tabs">
                            <img src="../../assets/img/setting.svg" height="20">
                        </router-link>
                    </el-tooltip>
                </div>
                <!-- 退出 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" content="退出" placement="bottom">
                        <router-link to="/tabs">
                            <img src="../../assets/img/loginout.svg" height="20">
                        </router-link>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: 'linxin',
                message: 2
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        border-bottom: 3px solid #a3bf1f;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 50px;
    }
    .header .logo{
        position: relative;
        top: 8px;
        float: left;
        width:250px;
        line-height: 50px;
    }
    .header-right{
        float: right;
        padding-right: 20px;
    }
    .header-user-con{
        display: flex;
        height: 50px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
    }
    .btn-bell .el-icon-bell{
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
