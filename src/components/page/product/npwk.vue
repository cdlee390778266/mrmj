<template>
  <div class="posFull" style="top: 36px; padding-left: 10px;" v-loading="isLoading">
    <div class="crumbs borb-green pdb10">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 工序生产->生产报工
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 68px;" v-loading="right.isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg" style="width: 100%;">
            <div class="msg-wrapper">
              <h2 class="tc pdtb10">G工序报工</h2>
              <p>
                <span class="mgr20">报工日期：</span>
                <el-date-picker
                  v-model="right.page1.date"
                  type="date"
                  size="mini"
                  placeholder="选择日期"
                  style="width: 140px;">
                </el-date-picker>
                <span class="mgl20">报工人员：</span>
                <el-select size="mini" style="width: 140px;" v-model="right.page1.data">
                  <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                </el-select>
              </p>
              <p class="mgt10">
                <span>估工工时合计(H)：463</span>
                <span class="mgl20">实际工时合计(H)：463</span>
                <span class="mgl20">准时交货率：85%</span>
                <span class="mgl20">报废率：5%</span>
              </p>
            </div>
          </div>
          <div class="content">
            <div class="content-right">
              <el-table
                :data="currentData.processes"
                border
                size="mini"
                class="content-table edit-table"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="工作类型"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="工序"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="模具号"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="数量"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="估工工时(H)"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="开始时间"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="要求完成日期"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="加工人人员"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="实际加工工时(H)"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="备  注"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="$router.go(-1)">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        isLoading: false
      }
    },
    methods: {
      getLeftList() { //获取列表
        
        let params = {

        };
  
        this.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.isLoading = false;
        }, () => this.isLoading = false, params)
      },
      save() {

        let params = {

        };
  
        this.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.isLoading = false;
        }, () => this.isLoading = false, params)
      }
    },
    
    created() {

      if(!this.$route.params.id) return;
      this.getLeftList();
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
    .msg {
      h4 {

      }
      .msg-wrapper {
        span {
          display: inline-block;
        }
      }
    }
    .content {
      position: absolute;
      top: 105px;
      right: 0;
      bottom: 0px;
      left: 0;
      height: auto;
      visibility: visible;
      .content-left-title {
        position: absolute;
        top: 0px;
        left: 10px;
        font-weight: normal;
        font-size: 14px;
        background: #fff;
        z-index: 8;
      }
      .content-right {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 0px;
        right: 0;
        padding: 10px;
        overflow: auto;
        border: 1px solid #ddd;
        p {
          margin-bottom: 10px;
        }
      }
    }
    .handle {
      left: 0;
      right: 0;
    }
  }
</style>