<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：售后反馈
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="right.isLoading">
      <div class="main-right">
        <div class="pdt10 mgt10">
          <el-scrollbar class="main-content-scorll pdt10">
            <el-row>
              <el-col :span="24"><strong>客诉信息</strong></el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：{{right.page1.a | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：{{right.page1.b | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：{{right.page1.c | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：{{right.page1.d | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：{{right.page1.e | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{right.page1.f | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">投诉单号：{{right.page1.g | filterNull}}</el-col>
            </el-row>
            <div v-for="(item, index) in right.page1.h">
              <el-divider class="mgtb20"></el-divider>
              <el-row>
                <el-col :span="24"><strong>客诉零件</strong></el-col>
                <el-col :span="24">
                  <span>零件号：{{item.a | filterNull}}</span>
                  <span class="mgl10">投诉类型：{{item.b | filterNull}}</span>
                  <span class="mgl10">存在问题：{{item.c | filterNull}}</span>
                </el-col>
                <el-col :span="24">
                  <div class="dflex">
                    <div>情况说明：</div>
                    <div class="flex">
                      {{item.d | filterNull}}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><strong>内部处置信息</strong></el-col>
                <el-col :span="24">
                  <span>责任部门：{{item.e | filterNull}}</span>
                  <span class="mgl10">投诉类别：{{item.f | filterNull}}</span>
                  <span class="mgl10">检测人员：{{item.g | filterNull}}</span>
                </el-col>
                <el-col :span="24">
                  <div class="dflex">
                    <div>情解决改善方案：</div>
                    <div class="flex">
                      {{item.h | filterNull}}
                    </div>
                  </div>
                  <div>改善效果：{{item.i | filterNull}}</div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="handle pdtb10 tr">
      <el-form :model="handle.comment.form" label-width="100px" class="pdt10 pdlr10">
        <el-form-item label="回复客户内容">
          <el-input type="textarea" v-model="handle.comment.form.content" auto-complete="off" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="客户接受态度">
          <el-select v-model="handle.comment.form.type" style="width: 100%;">
            <el-option label="接受" value="0"></el-option>
            <el-option label="不接受" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div class="handle-btns pdtb10">
          <el-button type="primary" @click="save">完 成</el-button>
          <el-button @click="back">返 回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        handle: {
          comment: {
            form: {
              content: '',
              type: '0'
            }
          }
        }
      };
    },
    methods: {
      getDetail() {

        let params = {

        };
        let mock = {
          a: 'XXXXXXXXXXXXXXX公司',
          b: 'YYYYYY',
          c: '采购经理',
          d: '123123123123123',
          e: 'fasdfasdf@xxxxxxxx.com',
          f: '12345678',
          g: '123123123123',
          h: [
            {
              a: '406',
              b: '投诉',
              c: '质量',
              d: '。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.',
              e: 'XXXX部',
              f: '外观',
              g: 'ZZZZ',
              h: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget'
            },
            {
              a: '407',
              b: '投诉',
              c: '质量',
              d: '。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.',
              e: 'XXXX部',
              f: '外观',
              g: 'ZZZZ',
              h: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget',
              i: '改善'
            }
          ]
        }

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page1 = res.data || [];
        }, () => this.right.isLoading = false, params, mock)
      },
      save() {

        let params = {

        };
        
        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.right.isLoading = false;
          this.back();
        }, () => this.right.isLoading = false, params)
      },
    },
    created() {

      this.getDetail();
    }
  };
</script>


<style scoped lang="scss">
  .el-row {
    margin-bottom: 20px;
  }
  .main-content-scorll {
    top: 0px !important;
    right: 0px !important;
    bottom: 180px !important;
  }
  .handle {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    background: #fff;
    .handle-btns {
      border-top: 1px solid #a3bf1f;
    }
  }
</style>