<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：工艺设计与估工
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            待处理订单：
            <el-input v-model="form.text" style="width: 130px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            
            <el-dropdown ref="sort" :hide-on-click="false">
              <el-button type="primary" icon="el-icon-sort" class="mgl10"></el-button>
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
        </div>
        <div class="list" ref="list" style="top: 65px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrSaleOrderId }" v-show="isShowList" @click="handleSelect(item, 'mrSaleOrderId')">
            <div class="dflex">
              <div>
                <div>
                  <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
                </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">来源：<span>{{ item.saleOrderOrigin | filterNull }}</span></p>
                  <p class="flex ellipsis">模具号：<span>{{ item.mouldNo | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">客户：<span>{{ item.name | filterNull }}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">交期：{{ item.completionDate | filterNull }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click.stop="getOrderDetail(item)">下达生产订单</a>
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
                    <i class="el-icon-lx-edit"></i> 订单{{ right.page1.mrSaleOrderId }}信息
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{ right.page1.mouldNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{ right.page1.saleOrderType | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{ right.page1.customerPoNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{ right.page1.name | filterNull }}</el-col>
                    <el-col :xs="24">
                      <p>订单说明</p>
                      <p>{{ right.page1.remark | filterNull }}</p>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">订单零件列表：</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page1.componentOrders"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="componentNo" label="零件号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerNo" label="客户编号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requirementQuantity" label="数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="issuedOrderDate" label="下单日期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requireDeliveryDate" label="要求交期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">订单附件：</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page1.attachments"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
                            <a :href="`$utils.CONFIG.api.download/${scope.row.fileId}`" style="color: #3375AB;">下载</a>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </el-carousel-item>
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 制定零件工艺
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row v-show="right.page2.noMakeCraftList && right.page2.noMakeCraftList.length">
                    <el-col :span="24" class="mgb10 mgt10">
                      <strong>待制定订单零件列表</strong>
                      <el-button type="primary" class="mgl10" @click="jump">选择下表零件，点我制定工艺</el-button>
                      <span>（选择多个零件，表示选择多个工艺相同零件一齐制定工艺）</span>
                    </el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page2.noMakeCraftList"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column
                        type="selection"
                        width="50">
                        </el-table-column>
                        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="componentNo" label="零件号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerNo" label="客户编号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requirementQuantity" label="要求数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="issuedOrderDate" label="下单日期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requireDeliveryDate" label="要求交期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="mgtb10"><strong>已制定工艺卡列表</strong></el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page2.haveMakeCraftList"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column label="零件号" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{scope.row.components | concatString('componentNo')}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="craftMakePerson" label="工艺制定人员" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="completionDate" label="完成日期" show-overflow-tooltip></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
                            <el-button type="text" @click="">编辑</el-button>
                            <el-button type="text" @click="deleteCraft(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </el-carousel-item>
            </el-carousel>
         
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="下达生产订单" class="dialog-gray" :visible.sync="handle.add.dialogVisible">
      <div v-loading="handle.add.isLoading">
        <el-form :model="handle.add.form" label-width="100px">
          <el-row class="pdtb10 borb">
            <el-col :span="8">模具号：{{handle.add.order && handle.add.order.mouldNo}}</el-col>
            <el-col :span="8">客户：{{handle.add.order && handle.add.order.name}}</el-col>
            <el-col :span="8">交期：{{handle.add.order && handle.add.order.mouldNo}}</el-col>
          </el-row>
          <div class="dialog-content pdt10 pdlr10 mglr10 bgfff">
            <div class="mgb10" :class="{borb: handle.add.data && (index != handle.add.data.length - 1)}" v-for="(item, index) in handle.add.data" :key="index" >
              <el-row>
                <el-col :span="24" class="mgb10">
                  <span class="mgr40">序号：{{item.processSequence}}</span>
                  <span class="mgr40">零件号码：{{item.components | concatString('componentNo')}}</span></span>
                  <span>数量：{{item.components | concatString('quantity')}}</span>
                </el-col>
                <el-col :span="24" class="mgb10">
                  <span class="mgr40">版本：
                    <el-select style="width: 100px;" v-model="item.versionNo">
                      <el-option v-for="(itemc, index) in item.versions" :key="index" :label="itemc.versionNo" :value="itemc.versionNo"></el-option>
                    </el-select>
                  </span>
                  <span>材料：{{item.versions && item.versions.length && item.versions[0].stuffName}}</span>
                </el-col>
              </el-row>
              <div class="mgb20">
                <p>工序及估工：</p>
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th class="bge4e4e4">工序顺序</th>
                      <th v-for="(itemc, index) in item.processes" :key="index">{{itemc.name}}</th>
                      <th class="bge4e4e4">工时合计</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="bge4e4e4">估工（H）</td>
                      <th v-for="(itemc, index) in item.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                      <th class="bge4e4e4">
                        {{item.processes | sum('estimationWorkTime')}}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="addOrder(false)">下达生产订单</el-button>
          <el-button type="primary" @click="addOrder(true)">保存草稿</el-button>
          <el-button type="primary" @click="handle.add.dialogVisible = false">返回</el-button>
        </div>
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
        right: {
          page1: {},
          page2: {
            selections: [],
            noMakeCraftList: [],
            haveMakeCraftList: []
          },
          list: []
        },
        handle: {
          add: {
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
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        let params = {
          parameter: '',
          type: this.filter.selectedValue,
          sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`,
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        }
        if(this.form.text) params.parameter = this.form.text;

        this.getData(this.$utils.CONFIG.api.queryPendingSaleOrder, params, 'mrSaleOrderId', loadingKey, this.getDetail);
      },
      getDetail(id) {

        let params = {
          mrSaleOrderId: id
        }

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPendingSaleOrderDetail, (res) => { //订单详情 

          this.right.page1 = res.data[0] || {};
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);

        this.$utils.getJson(this.$utils.CONFIG.api.queryNoMakeCraft, (res) => { //待制定订单零件列表

          this.right.page2.noMakeCraftList = res.data;
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);

        this.$utils.getJson(this.$utils.CONFIG.api.queryHaveMakeCraftComponent, (res) => { //已制定工艺卡列表

          this.right.page2.haveMakeCraftList = res.data;
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);
      },
      handleSelect(item, idKey = 'id') {
      
        this.left.activeId = item[idKey];
        this.currentData= item;
        this.getDetail(this.left.activeId);
      },
      getOrderDetail(item) {  //生产订单详情

        this.handle.add.order = item;
        this.handle.add.dialogVisible = true;

        let params = {
          mrSaleOrderId: item.mrSaleOrderId
        }
        
        this.$utils.getJson(this.$utils.CONFIG.api.queryProductionOrderInfo, (res) => {

          this.handle.add.isLoading = false;
          if(res.data && res.data.length) {

            this.handle.add.data = res.data;
          }else {

            this.handle.add.data = [];
            this.handle.add.dialogVisible = false;
            this.$utils.showTip('warning', 'error', '-1041');
          }
        }, () => this.handle.add.isLoading = false, params);
      },
      addOrder(saveAsDraft = false) {  //下达生产订单, saveAsDraft=false为下达生产订单;saveAsDraft=true为保存为草稿

        let params = {
          mrSaleOrderId: this.handle.add.order.mrSaleOrderId,
          versions: []
        }

        this.handle.add.data.map(item => {  //取得选中的版本，如没选中则默认选中第一个

          params.versions.push({
            mrCraftRouteLineId: item.mrCraftRouteLineId,
            versionNo: item.versionNo || 'A'
          })
        })
        
        let url = saveAsDraft ? this.$utils.CONFIG.api.saveAsDraft : this.$utils.CONFIG.api.releasedProductionOrder;
        this.handle.add.isLoading = true;
        this.$utils.getJson(url, (res) => {

          this.handle.add.isLoading = false;
          this.handle.add.dialogVisible = false;
          !saveAsDraft && this.search();
        }, () => this.handle.add.isLoading = false, params);
      },
      addProductionOrder() {  //下达生产订单

        let params = {
          mrSaleOrderId: '',

        }

        this.$utils.getJson(this.$utils.CONFIG.api.releasedProductionOrder, (res) => { 

          this.handle.add.isLoading = false;
          this.showTip('success', 'success', '102');
          this.search();
        }, () => this.handle.add.isLoading = false, params);
      },
      handleSelectionChange(val) {

        this.right.page2.selections = val;
      },
      jump() {

        if(!this.right.page2.selections.length) {
          this.$utils.showTip('warning', 'error', '-1040');
          return;
        }
        let obj = {
          mrSaleOrderId: this.currentData.mrSaleOrderId,
          customerId: this.currentData.customerId,
          componentNos: '',
          requirementQuantitys: '',
          mouldNo: this.currentData.mouldNo,
          name: this.currentData.name,
          completionDate: this.currentData.completionDate,
          customerPoNo: this.currentData.customerPoNo,
          selections: this.right.page2.selections
        };
        let time = new Date().getTime();
        this.right.page2.selections.map((item, index) => {

          obj.componentNos += item.componentNo;
          obj.requirementQuantitys += item.requirementQuantity;
          if(index != this.right.page2.selections.length - 1) {
            obj.componentNos+= '/';
            obj.requirementQuantitys += '/';
          }
        });
        localStorage.setItem(time, JSON.stringify(obj));
        this.$router.push(`/product/processCard/${time}`);
      },
      deleteCraft(row) {  //删除工艺卡
        
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.deleteCraftInfoById, (res) => {  

          this.right.isLoading = false;
          this.right.page2.haveMakeCraftList = this.right.page2.haveMakeCraftList.filter(item => item.mrCraftRouteLineId != row.mrCraftRouteLineId);
        }, () => this.right.isLoading = false, {mrCraftRouteLineId: row.mrCraftRouteLineId});
      },
      refresh() {}
    },
    created() {
      this.filter.typeList = this.filter.listType.product;
      this.getLeftList();
    }
  };
</script>


<style scoped lang="scss">
  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
  }
</style>