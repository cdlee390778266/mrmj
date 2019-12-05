<template>
    <div class="header">
        <div class="logo mgl10">
            <img src="../../assets/img/logo.png" height="28">
            <img src="../../assets/img/LogoText.svg" height="24" class="mgl10">
        </div>
        <div class="header-right">
            <div class="header-user-con">
                欢迎您使用系统，今天是<span class="fc9EB900">{{ this.date }}</span>
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
                      <img src="../../assets/img/loginout.svg" height="20" @click="loginOut">
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
                date: new Date().Format('yyyy-MM-dd')
            }
        },
        methods:{
          loginOut() {  //退出

            this.$utils.removeUserStorage();
            this.$router.push('/login');
          }
        },
        mounted(){
            
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
        top: 6px;
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
