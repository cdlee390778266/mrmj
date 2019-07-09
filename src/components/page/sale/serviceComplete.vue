<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：售后反馈
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-right">
        <div class="pdt10 mgt10">
          <el-scrollbar class="main-content-scorll pdt10">
            <el-row>
              <el-col :span="24"><strong>客诉信息</strong></el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：XXXXXX公司</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：12312323123</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：REQ1901</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：模具零件</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：已报价</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：12301.00</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">投诉单号：欧元</el-col>
            </el-row>
            <div>
              <el-divider class="mgtb20"></el-divider>
              <el-row>
                <el-col :span="24"><strong>客诉零件</strong></el-col>
                <el-col :span="24">
                  <span>零件号：406</span>
                  <span class="mgl10">投诉类型：投诉</span>
                  <span class="mgl10">存在问题：质量</span>
                </el-col>
                <el-col :span="24">
                  <div class="dflex">
                    <div>情况说明：</div>
                    <div class="flex">
                      这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><strong>内部处置信息</strong></el-col>
                <el-col :span="24">
                  <span>责任部门：XXXX部</span>
                  <span class="mgl10">投诉类别：外观</span>
                  <span class="mgl10">检测人员：ZZZZ</span>
                </el-col>
                <el-col :span="24">
                  <div class="dflex">
                    <div>情解决改善方案：</div>
                    <div class="flex">
                      这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                    </div>
                  </div>
                  <div>改善效果：已改善</div>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-divider class="mgtb20"></el-divider>
              <el-row>
                <el-col :span="24"><strong>客诉零件</strong></el-col>
                <el-col :span="24">
                  <span>零件号：406</span>
                  <span class="mgl10">投诉类型：投诉</span>
                  <span class="mgl10">存在问题：质量</span>
                </el-col>
                <el-col :span="24">
                  <div class="dflex">
                    <div>情况说明：</div>
                    <div class="flex">
                      这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><strong>内部处置信息</strong></el-col>
                <el-col :span="24">
                  <span>责任部门：XXXX部</span>
                  <span class="mgl10">投诉类别：外观</span>
                  <span class="mgl10">检测人员：ZZZZ</span>
                </el-col>
                <el-col :span="24">
                  <div class="dflex">
                    <div>情解决改善方案：</div>
                    <div class="flex">
                      这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                    </div>
                  </div>
                  <div>改善效果：已改善</div>
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
          <el-button type="primary" @click="handle.update.dialogVisible = false">完 成</el-button>
          <el-button>返 回</el-button>
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
        right: {
         
        },
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
     
    },
    created() {}
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