<template>
  <div>
    <div class="crumbs" style="border: none;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 零件工艺设计->制定工艺卡
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="v-tabs">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">制定工艺卡</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >工艺卡预览</span>
    </div>
    <div class="detail-main" v-loading="right.isLoading">
      <div class="calc hide  mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="main">
          <div class="msg">
            <h4>订单信息</h4>
            <div class="msg-wrapper">
              <span class="mgr20">模具号：{{component.mouldNo}}</span>
              <span class="mgr20">零件号：{{component.componentNos}}</span>
              <span class="mgr20">客户：{{component.name}}</span>
              <span class="mgr20">要求交期：{{component.completionDate}}</span>
              <span class="mgr20">数量：{{component.requirementQuantitys}}</span>
              <span>客户PO.号：{{component.customerPoNo}}</span>
            </div>
          </div>
          <div class="content">
            <h5 class="content-left-title">零件工艺版本列表</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div class="list tc">
                <div class="list-head dflex">
                  <div class="flex">工艺版本号</div>
                  <div class="flex">图纸名称版本</div>
                </div>
                <div class="list-body">
                  <div class="dflex" v-for="(item, index) in left.list" :key="index" :class="{active: left.activeId == `${item.mrCraftRouteLineVersionId}_${item.versionNo}`}" @click="handleSelect(item)">
                    <div class="flex">{{item.componentVersionNo}}</div>
                    <div class="flex">{{item.drawingVersionNo}}</div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title">工艺信息明细</h5>
            <div class="content-right" v-loading="right.isLoading">
              <p><strong>工艺版本号</strong>（可输入新的版本号，保存后为零件增加新版本工艺路线）
              </p>
              <p>
                <span>工艺路线版本号：</span> 
                <el-input size="mini" v-model="right.page1.componentVersionNo" style="width: 100px" />
                <span class="mgl20">使用图纸版本号：</span> 
                <el-select size="mini" v-model="right.page1.drawingVersionNo" placeholder="请选择" style="width: 100px;">
                  <el-option v-for="(itemc, index) in left.list" :key="index" :label="itemc.drawingVersionNo" :value="itemc.drawingVersionNo"></el-option>
                </el-select>
              </p>
              <p v-for="(item, index) in right.page1.components" :key="index">
                <span>零件号码：{{item.componentNo}}</span>
                <span class="mgl20">数量： 
                <el-input size="mini" v-model="item.quantity" style="width: 100px" /></span>
                <span class="mgl20">备货数量： 
                <el-input size="mini" v-model="item.stockingQuantity" style="width: 100px" /></span>
              </p>
              <p><strong>下料清单</strong></p>
              <p>
                <span class="mgl20">材料：
                  <el-select size="mini" v-model="right.page1.stuffId" placeholder="请选择" style="width: 100px;">
                    <el-option v-for="(itemc, index) in right.stuff" :key="index" :label="itemc.stuffNo" :value="itemc.mrStuffId"></el-option>
                  </el-select>
                </span>
                <span class="mgl20">下料尺寸(净尺寸mm)：
                  <el-input size="mini" v-model="right.page1.length" style="width: 70px" placeholder="长"/>
                  X
                  <el-input size="mini" v-model="right.page1.width" style="width: 70px" placeholder="宽"/>
                  X
                  <el-input size="mini" v-model="right.page1.height" style="width: 70px" placeholder="高"/>
                </span>
              </p>
              <p>
                备注：
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  style="width: 600px;"
                  v-model="right.page1.remark">
                </el-input>
              </p>
              <p>
                <strong>加工工序</strong>
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
                    prop="processContent"
                    label="加工工序内容"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    label="是否委外"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.isOutsource ? '是' : '否'}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="estimationWorkTime"
                    label="估工(H)"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="operator"
                    label="操作者"
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
              <p><strong>工艺附件</strong></p>
              <p>
                上传工艺附件：
                <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                  <el-button size="mini" type="primary">上传图纸</el-button>
                  <input type="file" name="file" ref="file" class="posFull opacity0" @change="uploadFile">
                </span>
              </p>
                <el-table
                  :data="right.page1.attachments"
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
                    label="操作者"
                    width="120"
                    align="center"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" @click="deleteFiles(scope.row.fileId, scope.row)">删除</el-button>
                      <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
        <div class="preview-content">

        </div>
        <div class="preview-handle tc">
          <p class="mgt20"><el-button type="primary" style="width: 80px;">打印</el-button></p>
          <p class="mgt10"><el-button type="primary" style="width: 80px;">导出PDF</el-button></p>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="$router.push('/product/technology')">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        activeTab: "calc",
        component: {},
        form: {

        }
      }
    },
    methods: {
      getStuffList() { //获取材料列表

        this.$utils.getJson(this.$utils.CONFIG.api.stuff, (res) => {

          this.right.stuff = res.data || [];
        }, () => this.right.stuff = [], {})
      },
      getLeftList() { //获取版本列表

        let params = {
          componentNo: this.component.componentNos
        }

        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryComponentVersion, (res) => {

          this.left.list = res.data;
         
          if(this.left.list && this.left.list.length) {

            this.left.activeId = `${this.left.list[0].mrCraftRouteLineVersionId}_${this.left.list[0].versionNo}`;
            this.currentData = this.left.list[0];
            this.getDetail(this.currentData);
          }
          this.left.isLoading = false;
        }, () => this.left.isLoading = false, params)
      },
      getDetail(currentData) {

        let params = {
          mrCraftRouteLineId: currentData.mrCraftRouteLineId,
          versionNo: currentData.componentVersionNo,
        }

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryVersionDetail, (res) => { //版本详情 

          this.right.page1 = res.data ? res.data[0] : {};
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);
      },
      handleSelect(item) {
      
        this.left.activeId = `${item.mrCraftRouteLineVersionId}_${item.versionNo}`;
        this.currentData= item;
        this.getDetail(this.currentData);
      },
      uploadSuccess(res) {

        let params = [{
            fileId: res.data[0].fileId,
            mrCraftRouteLineVersionId: this.currentData.mrCraftRouteLineVersionId
          }]
        this.$utils.getJson(this.$utils.CONFIG.api.saveCraftAttachment, (response) => { //版本详情 

          this.right.page1.attachments.push({
            fileId: res.data[0].fileId,
            fileName: res.data[0].fileName,
            fileSize: res.data[0].fileSize,
            operator: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName)
          });
        }, () => this.right.isLoading = false, params);
      },
      deleteSuccess() {

        this.$utils.getJson(this.$utils.CONFIG.api.deleteCraftAttachment, (response) => { //版本详情 
          
          this.right.page1.attachments = this.right.page1.attachments.filter(item => this.deleteRow.fileId != item.fileId);
        }, () => this.right.isLoading = false, {fileId: this.deleteRow.fileId});
      },
      save() {

        let params = {
          saleOrderId: this.component.mrSaleOrderId,
          customerId: this.component.customerId,
          versionNo: this.currentData.componentVersionNo,
          drawingVersionNo: this.currentData.drawingVersionNo,
          stuffId: this.right.page1.stuffId,
          length: this.right.page1.length,
          width: this.right.page1.width,
          height: this.right.page1.height,
          remark: this.right.page1.remark,
          processDescription: this.right.page1.processDescription,
          components: [],
          processes: []
        }

        this.right.page1.components.map(item => { //零件列表

          params.components.push({
            componentNo: item.componentNo,
            quantity: item.quantity,
            stockingQuantity: item.stockingQuantity,
          })
        })

        this.right.page1.processes.map(item => { //工艺列表

          params.processes.push({
            processSequence: item.processSequence,
            processId: item.processId,
            processContent: item.processContent,
            isOutsource: item.isOutsource,
            estimationWorkTime: item.estimationWorkTime,
            operator: item.operator
          })
        })

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.designCraftRouteLine, (res) => { //版本详情 

          this.right.isLoading = false;
          this.showTip('success', 'success', '102');
        }, () => this.right.isLoading = false, params);
      },
      refresh() {}
    },
    
    created() {

      if(!this.$route.params.id) return;
      let component = localStorage.getItem(this.$route.params.id);
      if(!component) return;
      this.component = JSON.parse(component);

      this.getStuffList();
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
      top: 40px;
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