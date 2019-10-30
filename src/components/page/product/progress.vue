<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：在产订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="left.isLoading">
      <div class="main-left">
        <div class="main-left-search pd10">
          <div class="mgb10">
            在产订单：
            <el-input v-model="form.text" style="width: 150px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            <el-dropdown ref="sort" :hide-on-click="false">
              <el-button type="primary" icon="el-icon-sort" class="mgl10" style="width: auto;"></el-button>
              <el-dropdown-menu slot="dropdown" class="sort">
                <el-dropdown-item>
                  <el-button type="text" class="fs14" :class="{active: filter.sort.sortType == ''}" @click="checkSort('')">升序</el-button>
                  <el-button type="text" class="fr fs14" :class="{active: filter.sort.sortType == 'desc'}" @click="checkSort('desc')">降序</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided v-for="(item, index) in filter.sort.listType.product" :key="index">
                  <el-radio v-model="filter.sort.sortField" :label="item.value">{{item.label}}</el-radio>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-button type="primary" @click="$router.push('/product/remanufacture')" style="width: 130px;">下达重制订单</el-button>
            <el-button type="primary" class="fr" @click="$router.push(`/product/detail`)" style="width: 130px;">查看当前计划</el-button>
          </div>
        </div>
        <div class="list" ref="list">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.saleOrderNo }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
              </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">模具号：<span>{{ item.mouldNo | filterNull }}</span></p>
                  <p class="flex ellipsis">类型：<span>{{ item.orderTypeText | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">客户：<span>{{ item.name | filterNull }}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">进度：<el-progress :percentage="item | cpercentage('haveCompletionTotalTime', 'estimateTotalTime')" color="rgba(0, 255, 0, 1)" style="width: 210px;display: inline-block;"></el-progress></el-col>
              <el-col :span="11">状态：{{ item.orderStatusText | filterNull }}</el-col>
              <el-col :span="13">延误时间累计(H)：{{ item.delayTotalTime | filterNull(0) }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click.stop="getOrderDetail(item)">编辑</a>
              </el-col>
            </el-row>
          </div>
          <div class="tc pd10" v-show="isShowList && left.isLoadingMore">
            加载中<i class="el-icon-loading"></i>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="selectType(item)"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="refresh" :haveCarousel="true">
          <template #pageName>订单明细</template>
            <el-carousel
              direction="vertical"
              :autoplay="false"
              :loop="false"
              trigger="click"
              ref="carousel"
            >
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 订单{{currentData.mouldNo}}生产进度
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{ currentData.mouldNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{ currentData.orderTypeText | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{ currentData.customerPoNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{ currentData.name | filterNull }}</el-col>
                  </el-row>
                  <el-row v-if="left.list && left.list.length">
                    <el-col :span="24">
                      <el-button type="primary" @click="orderDetail">查看相关销售订单</el-button>
                    </el-col>
                  </el-row>
                  <div class="progress-list">
                    <div class="progress-item" v-for="(item, index) in currentData.trackMessages">
                      <div class="process-left">
                        <p class="ellipsis">
                          <span>零件：
                            <el-tooltip class="item" effect="dark" :content="item.components | concatString('componentNo')" placement="top">
                              <span>{{item.components | concatString('componentNo')}}</span>
                            </el-tooltip>
                          </span>
                        </p>
                        <p class="ellipsis">
                          <span>数量：
                            <el-tooltip class="item" effect="dark" :content="item.components | concatString('quantity')" placement="top">
                              <span>{{item.components | concatString('quantity')}}</span>
                            </el-tooltip>
                          </span>
                        </p>
                        <p class="ellipsis">
                          <span>备货数量：
                            <el-tooltip class="item" effect="dark" :content="item.components | concatString('stockingQuantity')" placement="top">
                              <span>{{item.components | concatString('stockingQuantity')}}</span>
                            </el-tooltip>
                          </span>
                        </p>
                        <p class="ellipsis">
                            <span>
                              生产订单下达时间：
                              <el-tooltip class="item" effect="dark" :content="item.issuedOrderDate | filterNull" placement="top">
                                <span>{{item.issuedOrderDate | filterNull}}</span>
                              </el-tooltip>
                          </span>
                        </p>
                        <p class="ellipsis">
                          <span>计划时间：
                            <el-tooltip class="item" effect="dark" :content="item.planStartDate + '至' + item.planEndDate" placement="top">
                              <span>{{item.planStartDate }} 至 {{ item.planEndDate }}</span>
                            </el-tooltip>
                          </span>
                        </p>
                        <p class="ellipsis"><span>当前成本累计：{{ total(item) }}元</span></p>
                        <p>
                          <el-button type="text" @click="jump(item)">编辑 查看 打印工艺卡</el-button>
                        </p>
                      </div>
                      <div class="process-right">
                        <!-- 不整体外协 -->
                        <table class="mrmj-table" v-if="!item.buy">  
                          <thead>
                            <tr>
                              <th class="tr">工序</th>
                              <th v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                                <span>{{itemc.processName}}</span>
                                <img :src="itemc.statusDescription == '已完成' ? progressImg1 : progressImg2" class="mgl5" v-if="index != item.processes.length - 1">
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">估工</span></td>
                              <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                                <span>{{itemc.estimationWorkTime}}</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">开始</span></td>
                              <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                                <span>{{itemc.startTimeString}}</span>
                              </td>
                            </tr>
                            <!-- <tr>
                              <td class="tr"><span class="bg-green fcfff">结束</span></td>
                              <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                                <span>
                                  {{itemc.endTimeString || (itemc.statusDescription == '进行中' && item.isOutsource ? '外协中' : itemc.statusDescription)}}</span>
                              </td>
                            </tr> -->
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">耗时</span></td>
                              <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                                <span>{{itemc.consumeTime}}</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">人工成本</span></td>
                              <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                                <span>{{itemc.consumeTime ? `${(itemc.consumeTime * itemc.processPrice).toFixed(2)}元` : ''}}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!-- 整体外协 -->
                        <table class="mrmj-table" v-else>  
                          <thead>
                            <tr>
                              <th class="tl">工序</th>
                              <th v-for="(itemc, index) in item.processes" :key="index">
                                <span>{{itemc.processName}}</span>
                                <img :src="progressImg2" class="mgl5" v-if="index != item.processes.length - 1">
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="tl" :colspan="item.processes.length"><span>{{item.buyText | filterNull}}</span></td>
                            </tr>
                            <tr>
                              <td class="tl ellipsis" width="130px" :colspan="item.processes.length">
                                <span>外协订单下达时间：{{item.issuedPurchaseOrderDate | filterNull}}</span>
                                <span class="mgl20">要求到货日期：{{item.requireArrivalDate | filterNull}}</span>
                                <span class="mgl20">实际到货日期：{{item.arrivalDate | filterNull}}</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="tl" :colspan="item.processes.length"><span>外协价格(RMB)：{{item.outsourceTotalPrice | filterNull}}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </el-carousel-item>
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 不合格品情况
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <div>不合格品检测结果</div>
                  <div class="progress-list unqualified-list" style="margin-top: 10px;" v-for="(item, index) in currentData.processInspections" :key="index">
                    <div class="progress-item">
                      <div class="progress-top">
                        <p>
                          <span>时间：{{item.inspectionDate | filterNull}}</span>
                          <span class="mgl20">加工工序：<strong class="fc-red">{{item.processName}}</strong></span>
                          <span class="mgl20">零件号：{{item.components | concatString('componentNo')}}</span>
                          <span class="mgl20">数量：{{item.components | concatString('quantity')}}</span>
                          <span class="mgl20">备货数量：{{item.components | concatString('stockingQuantity')}}</span>
                          <span class="mgl20">检测结果：<strong class="fc-red">{{item.inspectionResultText | filterNull}}</strong></span>
                          <span class="mgl20">异常数量：{{item.abnormalQuantity | filterNull}}</span>
                        </p>
                        <p class="ellipsis">
                          异常概况：{{item.abnormalOverview | filterNull}}
                        </p>
                        <p class="ellipsis">
                          处理方式：{{item.dealWayText | filterNull}}
                        </p>
                      </div>
                      <div class="progress-bottom tr">
                        <el-button type="text" @click="removeWarning(item)">消除警告</el-button>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </el-carousel-item>
            </el-carousel>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="生产订单信息查看修改" class="dialog-gray" :visible.sync="handle.edit.dialogVisible" width="800px">
      <div v-loading="handle.edit.isLoading">
        <el-form :model="handle.edit.form" label-width="100px">
          <el-row class="pdtb10 borb">
            <el-col :span="8">模具号：{{handle.edit.order && handle.edit.order.mouldNo}}</el-col>
            <el-col :span="8">客户：{{handle.edit.order && handle.edit.order.name}}</el-col>
            <el-col :span="8">交期：{{handle.edit.order && handle.edit.order.completionDate}}</el-col>
          </el-row>
          <div class="dialog-content pd10 mglr10 bgfff">
            <div class="mgb10" :class="{borb: handle.edit.data && (index != handle.edit.data.length - 1)}" v-for="(item, index) in handle.edit.data" :key="index" >
              <el-row>
                <el-col :span="24" class="mgb10">
                  <span class="mgr40">序号：{{index + 1}}</span>
                  <span class="mgr40">零件号码：{{item.components | concatString('componentNo')}}</span></span>
                  <span class="mgr40">版本：
                    <el-select size="mini" style="width: 100px;" v-model="item.selectedVersionNo">
                      <el-option v-for="(itemc, index) in item.versions" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                    </el-select>
                  </span>
                  <span>材料：{{getSelectedVersionStuffNo(item.versions, item.selectedVersionNo)}}</span>
                </el-col>
                <el-col :span="24">
                  <p v-for="(itemc, index) in item.components" :key="index" class="mgb5">
                    <span>零件号码：{{itemc.componentNo}}</span>
                    <span class="mgl20">数量： 
                    <el-input size="mini" v-model="itemc.quantity" style="width: 100px" /></span>
                    <span class="mgl20">备货数量： 
                    <el-input size="mini" v-model="itemc.stockingQuantity" style="width: 100px" /></span>
                  </p>
                </el-col>
              </el-row>
              <div class="mgb20">
                <p>工序及估工：</p>
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th class="bge4e4e4">工序顺序</th>
                      <th v-for="(itemc, index) in getSelectedProcesses(item.versions, item.selectedVersionNo)" :key="index">{{itemc.name}}</th>
                      <th class="bge4e4e4">工时合计</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="bge4e4e4">估工（H）</td>
                      <th v-for="(itemc, index) in getSelectedProcesses(item.versions, item.selectedVersionNo)" :key="index">{{itemc.estimationWorkTime}}</th>
                      <th class="bge4e4e4">
                        {{getSelectedProcesses(item.versions, item.selectedVersionNo) | sum('estimationWorkTime')}}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="editOrder">保存</el-button>
          <el-button type="primary" @click="handle.edit.dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="查看销售订单信息" center :visible.sync="handle.orderInfo.dialogVisible" width="800px">
      <el-form :model="handle.orderInfo.data" v-loading="handle.orderInfo.isLoading" label-width="100px" ref="updateForm">
        <el-row>
          <el-col :span="8">
            客户名称：{{handle.orderInfo.data.name}}
          </el-col>
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="8">
            客户PO.号：{{handle.orderInfo.data.customerPoNo}}
          </el-col>
          <el-col :span="8">
            模具号：{{handle.orderInfo.data.mouldNo}}
          </el-col>
          <el-col :span="8">
            订单类型：{{handle.orderInfo.data.saleOrderType}}
          </el-col>
          <el-col :span="8">
            订单状态：{{'-'}}
          </el-col>
          <el-col :span="24">
            <p class="mgt10">订单零件列表：</p>
            <el-table :data="handle.orderInfo.data.componentOrders" border size="mini" style="width: 100%">
              <el-table-column type="index" label="序号"  width="50" show-overflow-tooltip></el-table-column>
              <el-table-column prop="componentNo" label="零件号"  width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="customerNo" label="客户编号"  width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="componentNum" label="数量" width="88" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="" label="下单日期" width="140" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="deliveryDate" label="要求交期" width="140" show-overflow-tooltip></el-table-column>
              <el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <p class="mgt10">订单附件：</p>
            <el-table :data="handle.orderInfo.data.attachments" border size="mini" style="width: 100%" class="edit-table">
              <el-table-column type="index" label="序号"  width="50" show-overflow-tooltip></el-table-column>
              <el-table-column prop="fileName" label="附件名称"  show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" class="mgt10">
            说明：
            <el-input type="textarea" v-model="handle.orderInfo.data.remark" auto-complete="off" disabled />
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer tr">
        <el-button @click="handle.orderInfo.dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        defaultImg: require('../../../assets/img/order.svg'),
        progressImg1: require('../../../assets/img/progress-1.png'),
        progressImg2: require('../../../assets/img/progress-2.png'),
        left: {
          list: []
        },
        right: {
          activeIndex: 0,
          list: []
        },
        handle: {
          edit: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {
              mouldNo: "",
              name: "",
              type: "0",
              id: "",
              dsc: "",
            }
          },
          orderInfo: {
            dialogVisible: false,
            isLoading: false,
            data: {}
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading', isSetCurrentData = false) { //获取左侧列表数据

        let params = {
          parameter: '',
          type: this.filter.selectedValue,
          sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`,
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize
        }
        if(this.form.text) params.name = this.form.text;

        this.getData(this.$utils.CONFIG.api.trackProductionOrder, params, 'saleOrderNo', loadingKey, null, isSetCurrentData);
      },
      handleSelect(item) {

        this.left.activeId = item.saleOrderNo;
        this.currentData = item;
      },
      getOrderDetail(item) {  //生产订单详情
        
        let params = {
          mrSaleOrderId: item.mrSaleOrderId
        }

        this.handle.edit.order = item;
        this.handle.edit.dialogVisible = true;
        this.handle.edit.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryProductionOrderInfo, (res) => {

          this.handle.edit.isLoading = false;
          this.handle.edit.data = res.data;
        }, () => this.handle.edit.isLoading = false, params);
      },
      editOrder() { //编辑保存

        console.log(this.handle.edit.data)
        let params = [];

        
        if(!this.handle.edit.data && !this.handle.edit.data.length) {

          this.showTip('warning', 'error', '-1079');
          return;
        }

        this.handle.edit.data.map(item => {

          item.components && item.components.map(itemc => params.push({
            mrComponentCraftId: itemc.mrComponentCraftId,
            quantity: itemc.quantity,
            stockingQuantity: itemc.stockingQuantity
          }))
        })

        this.handle.edit.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.editProductionTrack, (res) => {

          this.handle.edit.isLoading = false;
          this.handle.edit.dialogVisible = false;
          this.$utils.showTip('success', 'success', '102');
          this.search();
        }, () => this.handle.edit.isLoading = false, params);
      },
      orderDetail() {

        this.handle.orderInfo.dialogVisible = true;
        this.handle.orderInfo.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.querySaleOrderInfo, (res) => {

          this.handle.orderInfo.isLoading = false;
          this.handle.orderInfo.data = res.data || {};
        }, () => this.handle.orderInfo.isLoading = false, {mrSaleOrderId: this.currentData.mrSaleOrderId});
      },
      removeWarning(item) {  //消除报警

        let params = {

        };
  
        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '107');
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params)
      },
      jump(row) {
        console.log(row)
        let obj = {
          type: 'edit',
          mrSaleOrderId: this.currentData.mrSaleOrderId,
          customerId: this.currentData.customerId,
          mouldNo: this.currentData.mouldNo,
          name: this.currentData.name,
          componentNos: '',
          requirementQuantitys: '',
          completionDate: this.currentData.completionDate,
          customerPoNo: this.currentData.customerPoNo,
          components: row.components,
        };
        
        row.components && row.components.length && row.components.map((item, index) => {

            obj.componentNos += item.componentNo;
            obj.requirementQuantitys += item.quantity;
            if(index != row.components.length - 1) {
              obj.componentNos+= '/';
              obj.requirementQuantitys += '/';
            }
          })

        let time = new Date().getTime();
        localStorage.setItem(time, JSON.stringify(obj));
        this.$router.push(`/product/processCard/${time}`);
      },
      refresh() {}
    },
    computed: {
      total() {

        return function(item) {

          let total = 0;
          item && item.processes.map(itemc => {
            total += (itemc.consumeTime || 0) * itemc.processPrice;
          })
          return total || '-'
        }
      }
    },
    created() {
      this.filter.typeList = this.filter.listType.product;
      this.getLeftList();
    }
  };
</script>


<style scoped lang="scss">
  .progress-list {
    margin-top: 20px;
    .progress-item {
      position: relative;
      display: table;
      min-width: 100%;
      box-sizing: border-box;
      .process-left {
        position: absolute;
        left: 10px;
        bottom: 10px;
        top: 10px;
        width: 200px;
        padding-top: 5px;
        line-height: 27px;
        border-right: 1px solid #ddd;
        .el-button {
          font-size: 14px;
        }
      }
      .process-right {
        height: 193px;
        padding: 10px;
        padding-left: 210px;
        border-top: 1px solid rgba(188, 188, 188, 1);
        background: rgba(242, 242, 242, 1);
        .mrmj-table {
          border: none;
          margin-bottom: 10px;
          background: transparent;
          th {
            border: none;
            min-width: 66px;
            img {
              position: relative;
              top: 3px;
            }
          }
          td {
            border: none;
          }
        }
      }
      &:nth-child(even) .process-right {
        background: rgba(228, 228, 228, 1);
      }
    }
    &.unqualified-list {
      .progress-item {
        padding: 10px;
        background: rgba(242, 242, 242, 1);
        &:nth-child(even) {
          background: rgba(228, 228, 228, 1);
        }
      }
    }
  }
  .mrmj-table {
    td {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>