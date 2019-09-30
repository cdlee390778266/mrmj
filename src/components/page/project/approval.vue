<template>
  <div class="posFull" style="top: 36px; padding-left: 10px;" v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 待立项订单->整体模具立项
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 36px;">
      <div class="calc mgt10">
        <div class="main">
          <div class="content">
            <div class="content-left pd10" v-loading="left.isLoading">
              <div class="borb pdb10 tc">
                <i class="el-icon-lx-edit"></i> 订单{{left.data.c | filterNull}}基础信息
              </div>
              <el-row class="mgt20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  客户名称：{{left.data.a | filterNull}}
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  客户PO.号：{{left.data.b | filterNull}}
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  模具号：{{left.data.c | filterNull}}
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  要求交期号：{{left.data.d | filterNull}}
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  订单总价：{{left.data.e | filterNull}}
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  交易货币：{{left.data.f | filterNull}}
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  汇率：{{left.data.g | filterNull}}
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  订单总价(RMB)：{{left.data.h | filterNull}}
                </el-col>
                <el-col :span="24">
                  <p class="mgt20 mgb5">订单附件</p>
                  <el-table
                    :data="left.data.i"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  > 
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip></el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="scope">
                        <a href="javascript:void(0);" style="color: #3375AB;" @click="down(scope.row.fileId)">下载</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="24">
                  <p class="mgt20">订单附件</p>
                  <p>{{left.data.j | filterNull}}</p>
                </el-col>
              </el-row>
            </div>
            <div class="content-right pd10" v-loading="right.isLoading">
              <el-form ref="form" :model="form" label-width="130px" class="flex pd10">
                <div class="dflex">
                  <div class="flex pd10">
                    <el-form-item label="产品名称">
                      <el-input v-model="form.aa"/>
                    </el-form-item>
                    <el-form-item label="产品编号">
                      <el-input v-model="form.bb"/>
                    </el-form-item>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="版本号">
                          <el-input v-model="form.cc"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="穴数">
                          <el-input v-model="form.dd"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="模具尺寸">
                      <div class="dflex">
                        <el-input v-model="form.ee" class="flex"/>
                        <span class="mglr5">x</span>
                        <el-input v-model="form.ff" class="flex"/>
                        <span class="mglr5">x</span>
                        <el-input v-model="form.gg" class="flex"/>
                      </div>
                    </el-form-item>
                    <el-form-item label="模具结构">
                      <el-select v-model="form.hh" placeholder="请选择模具结构" style="width: 100%;">
                        <el-option :label="item.label" :value="item.value" v-for="(item, index) in filter.structure" :key="index"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="塑料名称">
                      <el-input v-model="form.ii"/>
                    </el-form-item>
                  </div>
                  <el-upload
                    class="avatar-uploader"
                    name="files"
                    ref="upload"
                    :action="$utils.CONFIG.api.uploadFiles"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="form.userFace" :src="form.userFace" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <el-row class="mgt10">
                  <el-col :span="12">
                    <el-form-item label="样品需求数量">
                      <el-input v-model="form.jj"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="模具状态">
                      <el-select v-model="form.kk" placeholder="请选择模具状态" style="width: 100%;">
                        <el-option :label="item.label" :value="item.value" v-for="(item, index) in filter.status" :key="index"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :spna="24">
                    <el-form-item label="特殊要求">
                      <el-input type="textarea" v-model="form.ll" row="4"/>
                    </el-form-item>
                  </el-col>
                  <el-col :spna="24">
                    <p class="mgb10">
                      上传特殊要求相关附件：
                      <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                        <el-button size="mini" type="primary">选择上传附件</el-button>
                        <input type="file" name="file" ref="file" class="posFull opacity0" @change="uploadFile">
                      </span>
                    </p>
                    <el-table
                      :data="currentData.mm"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%">
                      <el-table-column
                        prop="fileName"
                        label="资料名称"
                        show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column
                        prop="operator"
                        label="操作"
                        width="120"
                        align="center"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-button type="text" @click="deleteFiles(scope.row.fileId, scope.row)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                  <el-col :spna="24">
                    <p class="mgt20">项目节点计划：</p>
                    <el-form-item label="设计完成日期">
                      <el-date-picker
                        v-model="form.nn"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="标件到货日期">
                      <el-date-picker
                        v-model="form.oo"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="标件到货日期">
                      <el-date-picker
                        v-model="form.pp"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="模板到货日期">
                      <el-date-picker
                        v-model="form.qq"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="零件加工完成日期">
                      <el-date-picker
                        v-model="form.rr"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="塑料到货日期">
                      <el-date-picker
                        v-model="form.ss"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="装模完成日期">
                      <el-date-picker
                        v-model="form.tt"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="T0 试模日期">
                      <el-date-picker
                        v-model="form.uu"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="FA测量完成日期">
                      <el-date-picker
                        v-model="form.vv"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="T0样品提交日期">
                      <el-date-picker
                        v-model="form.ww"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="移模日期">
                      <el-date-picker
                        v-model="form.xx"
                        type="date"
                        placeholder="年/月/日">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">立项</el-button>
      <el-button type="primary" @click="save(true)">保存草稿</el-button>
      <el-button type="primary" @click="back">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        defaultFace: require('../../../assets/img/defaultFace.svg'),
        handleType: '',
        id: '',
        isLoading: false,
        filter: {
          structure: [
            {
              label: '2板模',
              value: '0'
            },
            {
              label: '3板模',
              value: '1'
            },
            {
              label: '2板模+热流道',
              value: '2'
            },
            {
              label: '2板模+浮动',
              value: '3'
            }
          ],
          status: [
            {
              label: '新模',
              value: '0'
            },
            {
              label: '修模',
              value: '1'
            },
            {
              label: '待移模',
              value: '2'
            },
            {
              label: '已移模',
              value: '3'
            },
            {
              label: '内部生产',
              value: '4'
            }
          ]
        },
        left: {
          data: {

          }
        },
        form: {

        }
      }
    },
    methods: {
      getLeftData() { //获取列表
        
        let params = {

        };
        let mock = {
          a: 'A公司',
          b: '12334567',
          c: 'T-0034',
          d: '2019.03.31',
          e: '12301.00',
          f: '欧元',
          g: '7.0',
          h: '12301.00',
          i: [
            {
              fileName: '172988图纸',
              fileId: 'crQhc2flTyetPwbJ'
            },
            {
              fileName: '172986图纸',
              fileId: 'crQhc2flTyetPwbJ'
            },
            {
              fileName: '832071图纸',
              fileId: 'crQhc2flTyetPwbJ'
            }
          ],
          j: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.'
        }
  
        this.left.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.data = res.data || {};
          this.getRight();
        }, () => this.left.isLoading = false, params, mock)
      },
      getRight() {

        let params = {

        };
        let mock = {
          a: 100
        };
  
        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.form = res.data || {};
        }, () => this.right.isLoading = false, params, mock)
      },
      handleAvatarSuccess(res, file) {

        this.$set(this.form, 'userFace', URL.createObjectURL(file.raw));
        this.form.fileId = res.data[0].fileId;
      },
      save(isSabeAsDraft) { //isSabeAsDraft 是否保存为草稿

        let params = {

        };
    
        this.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.isLoading = false;
          this.back();
        }, () => this.isLoading = false, params)
      }
    },
    
    created() {

      if(!this.$route.params.id) return;
      this.getLeftData();
    }
  };
</script>


<style scoped lang="scss">
  .main {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: none;
    box-shadow: none;
    .content {
      position: absolute;
      top: 0px;
      right: 0;
      bottom: 0px;
      left: 0;
      height: auto;
      visibility: visible;
      .content-left {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 0;
        width: 440px;
        overflow: auto;
        border-right: 1px solid #ddd;
      }
      .content-right {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 450px;
        right: 0;
        padding: 10px;
        overflow: auto;
      }
    }
    .handle {
      left: 0;
      right: 0;
    }
  }
</style>