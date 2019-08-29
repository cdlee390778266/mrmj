<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 电极设计任务->完成电极设计任务
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="msg">
        <h4>电极对应零件信息</h4>
        <div class="msg-wrapper">
          <span class="mgr20">模具号：M-1901</span>
          <span class="mgr20">零件号：407/408</span>
          <span class="mgr20">要求交期：2019.04.31</span>
          <span class="mgr20">数量：3</span>
        </div>
      </div>
      <div class="content">
        <h5 class="content-left-title">零件工艺版本列表</h5>
        <div class="content-left" v-loading="left.isLoading">
          <div class="tr mgt20">
            <el-button type="primary">增加电极</el-button>
          </div>
          <div class="list tc">
            <div class="list-head dflex">
              <div class="flex">电极号</div>
              <div class="flex">数量</div>
              <div class="flex">操作</div>
            </div>
            <div class="list-body">
              <div class="dflex" v-for="(item, index) in left.list" :key="index" :class="{active: left.activeId == `${item.mrCraftRouteLineVersionId}_${item.versionNo}`}">
                <div class="flex">{{item.componentVersionNo}}</div>
                <div class="flex">{{item.drawingVersionNo}}</div>
                <div class="flex">
                  <a href="">删除</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h5 class="content-right-title">工艺信息明细</h5>
        <div class="content-right" v-loading="right.isLoading">
          <p><strong>基本信息</strong></p>
          <p>
            <span>电极号：</span> 
            <el-input size="mini" v-model="right.page1.componentVersionNo" style="width: 100px" />
            <span class="mgl20">数量：</span> 
            <el-input size="mini" v-model="right.page1.componentVersionNo" style="width: 100px" />
          </p>
          <p v-for="(item, index) in right.page1.components" :key="index">
            <span>零件号码：{{item.componentNo}}</span>
            <span class="mgl20">数量： 
            <el-input size="mini" v-model="item.quantity" style="width: 100px" /></span>
            <span class="mgl20">备货数量： 
            <el-input size="mini" v-model="item.stockingQuantity" style="width: 100px" /></span>
          </p>
          <p>
            <strong>电极工序与估工</strong>
            <el-table
              :data="right.page1.processes"
              border
              size="mini"
              class="content-table"
              style="width: 100%">
              <el-table-column
                prop="processSequence"
                label="工序序号"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="name"
                label="工序名称"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="estimationWorkTime"
                label="估工(H)"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </p>
          <p>
            工艺说明：
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="right.page1.processDescription">
            </el-input>
          </p>
          <p><strong>电极设计附件</strong></p>
          <p>
            上传附件： <el-button size="mini" type="primary">上传附件</el-button>
          </p>
            <el-table
              :data="right.page1.a"
              border
              size="mini"
              class="content-table"
              style="width: 100%">
              <el-table-column
                prop="date"
                label="资料名称"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <a href style="color: #3375AB;">删除</a>
                </template>
              </el-table-column>
            </el-table>
          </p>
        </div>
      </div>
      <div class="handle pdtb10 tr">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="handle.update.dialogVisible = false">返 回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        form: {

        },
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    },
    methods: {
      getLeftList() { //获取版本列表

        let params = {
          componentNo: ''
        }

        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryComponentVersion, (res) => {

          this.left.list = res.data.content;
         
          if(this.left.list.length) {

            this.left.activeId = `${this.left.list[0].mrCraftRouteLineVersionId}_${this.left.list[0].versionNo}`;
            this.currentData = this.left.list[0];
            this.getDetail(this.currentData);
          }
          this.left.isLoading = false;
        }, () => this.left.isLoading = false, params)
      },
      getDetail(currentData) {

        let params = {
          mrCraftRouteLineId: currentData.mrCraftRouteLineVersionId,
          versionNo: currentData.componentVersionNo,
        }

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryVersionDetail, (res) => { //版本详情 

          this.right.page1 = res.data || {};
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);
      },
      save() {

        let params = {
          saleOrderId: '',
          customerId: '',
          versionNo: '',
          stuffId: '',
          length: '',
          width: '',
          height: '',
          remark: '',
          processDescription: '',
          components: [],
          processes: [],
          isOutsource: '',
          estimationWorkTime: '',
          operator: ''
        }

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.designCraftRouteLine, (res) => { //版本详情 

          this.right.isLoading = false;
          this.showTip('success', 'success', '102');
        }, () => this.right.isLoading = false, params);
      },
      refresh() {}
    },
    
    created() {
      
      this.getLeftList();
    }
  };
</script>


<style scoped lang="scss">
  .main {
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
      top: 40px;
      right: 0;
      bottom: 60px;
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
      .content-left {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 0;
        width: 210px;
        overflow: auto;
        border: 1px solid #ddd;
        .list {
          .list-head {
            position: absolute;
            top: 60px;
            right: 0;
            left: 0;
            background: rgba(228, 228, 228, 1);
            & > div {
              border-right: 1px solid #ddd;
            }
          }
          .list-body {
            position: absolute;
            top: 80px;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            .dflex{
              cursor: pointer;
              &:hover, &.active {
                background: #e8e8e8;
              }
            }
            .flex {
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .content-right-title {
        position: absolute;
        top: 0px;
        left: 230px;
        font-weight: normal;
        font-size: 14px;
        background: #fff;
        z-index: 8;
      }
      .content-right {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 220px;
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
  .crumbs {
    padding-bottom: 10px;
    border-bottom: 1px solid #a3bf1f;
  }
</style>