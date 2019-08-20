<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 零件工艺设计->制定工艺卡
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="msg">
        <h4>订单信息</h4>
        <div class="msg-wrapper">
          <span class="mgr20">模具号：M-1901</span>
          <span class="mgr20">零件号：407/408</span>
          <span class="mgr20">客户：测试测试测试测试测试公司</span>
          <span class="mgr20">要求交期：2019.04.31</span>
          <span class="mgr20">数量：3</span>
          <span>客户PO.号：123123123123</span>
        </div>
      </div>
      <div class="content">
        <h5 class="content-left-title">零件工艺版本列表</h5>
        <div class="content-left">
          <div class="list tc">
            <div class="list-head dflex">
              <div class="flex">工艺版本号</div>
              <div class="flex">图纸名称版本</div>
            </div>
            <div class="list-body">
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本图纸名称版本图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
              <div class="dflex">
                <div class="flex">工艺版本号</div>
                <div class="flex">图纸名称版本</div>
              </div>
            </div>
          </div>
        </div>
        <h5 class="content-right-title">工艺信息明细</h5>
        <div class="content-right">
          
        </div>
      </div>
      <div class="handle pdtb10 tr">
        <el-button type="primary" @click="handle.update.dialogVisible = false">保 存</el-button>
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
        
      };
    },
    methods: {
      
      refresh() {}
    },
    
    created() {
      
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
            top: 15px;
            right: 0;
            left: 0;
            background: rgba(228, 228, 228, 1);
            & > div {
              border-right: 1px solid #ddd;
            }
          }
          .list-body {
            position: absolute;
            top: 40px;
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
        overflow: auto;
        border: 1px solid #ddd;
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