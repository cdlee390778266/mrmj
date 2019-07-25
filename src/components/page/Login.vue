<template>
    <div class="login-wrap" v-loading="isLoading">
        <div class="ms-login">
            <div class="ms-title">明锐模具生产过程执行管理系统</div>
            <el-form :model="form" :rules="rules" ref="form" label-width="0px" class="ms-content">
                <el-form-item prop="userAccount">
                    <el-input v-model="form.userAccount" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userPass">
                    <el-input type="password" placeholder="密码" maxlength="20" v-model="form.userPass" @keyup.enter.native="submitForm('form')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <!-- <div class="forget">
                    <router-link to="/"><small>忘记密码</small></router-link>
                </div> -->
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('form')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                isLoading: false,
                form: {
                    userAccount: '',
                    userPass: ''
                },
                rules: {
                    userAccount: [
                        { required: true, message: this.$utils.getTipText('error', '-1030')}
                    ],
                    userPass: [
                        { required: true, message: this.$utils.getTipText('error', '-1031')},
                        // { min: 6, message: this.$utils.getTipText('error', '-1032')},
                        // { max: 20, message: this.$utils.getTipText('error', '-1032')}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    
                    if (valid) {
                        this.isLoading = true;
                        this.$utils.getJson(this.$utils.CONFIG.api.login, (res) => {
                            this.isLoading = false;
                            localStorage.setItem('token',res.data.token);
                            localStorage.setItem('userId',res.data.userId);
                            localStorage.setItem('userName',res.data.userName);
                            this.$router.push('/sale/home');
                        }, () => this.isLoading = false, this.form) 
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: url(../../assets/img/login-bg.jpg) no-repeat center;
        background-size: cover;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .forget {
        position: relative;
        top: -10px;
        color: #fff;
        text-align: right;
    }
    .forget a {
        color: #fff;
    }
</style>