<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：质量检验
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="left.isLoading">
      <div class="main-left" style="width: 190px;">
        <div class="list" ref="list" style="top: 0px;">
          <div class="list-item pd10" :class="{ active: left.activeId == item.key }" v-for="item in left.tabs" :key="item.key" @click="handleSelect(item)">
            <div class="dflex" style="align-items: center;">
              <div>
                <img :src="item.icon" width="32">
              </div>
              <div class="flex"><span class="mgl5">{{item.name}}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="refresh" :hidePageName="true">
          <div v-show="left.activeId == left.tabs[0].key">
            <div class="main-content-title">
              <div>
                <img :src="currentData.icon" width="22px" style="position: relative;top: 5px;"> {{currentData.name}}
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24" class="mgb10 mgt10">
                  <div>
                    <el-button type="primary" @click="$router.push('/quality/registerArrivalRejects')">不良品处置</el-button>
                  </div>
                  <div class="mgt10 ">
                    <div class="filter-item">
                      <span>供应商名称：</span> 
                      <el-select size="mini" v-model="left.tabs[0].form.name" placeholder="请选择客户" style="width: 100px;">
                        <el-option v-for="(item, index) in filter.supplier" :key="index" :label="item.name" :value="item.name"></el-option>
                      </el-select> 
                    </div>
                    <div class="filter-item">
                      <span>模具号：</span> 
                      <el-select size="mini" v-model="left.tabs[0].form.moulde" value-key="mouldNo" placeholder="请选择模具号" style="width: 100px;" @change="(module) => { left.tabs[0].form.componentNo = ''; }">
                        <el-option v-for="(item, index) in $dict.mouldNoList" :key="item.mouldNo" :label="item.mouldNo" :value="item"></el-option>
                      </el-select> 
                    </div>
                    <div class="filter-item">
                      <span>零件号：</span> 
                      <el-select size="mini" v-model="left.tabs[0].form.componentNo" placeholder="请选择模具号" style="width: 120px;">
                      <template v-if="left.tabs[0].form.moulde">
                          <el-option v-for="(item, index) in left.tabs[0].form.moulde.componentOrders" :key="index" :label="item.componentNo" :value="item.componentNo"></el-option>
                        </template>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      <span>检验日期：</span> 
                      <el-date-picker
                        v-model="left.tabs[0].form.inspectionDate"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div class="filter-item">
                      <span>外协工序：</span> 
                      <el-select style="width: 100px;" v-model="left.tabs[0].form.processName">
                        <el-option v-for="(item, index) in filter.processes" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      检验结果：
                      <el-checkbox-group v-model="left.tabs[0].form.inspectionResult" style="display: inline-block;">
                        <el-checkbox label="接受" :value="10"></el-checkbox>
                        <el-checkbox label="返工" :value="20"></el-checkbox>
                        <el-checkbox label="报废" :value="50"></el-checkbox>
                        <el-checkbox label="特采"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <el-button type="primary" class="mgl40" @click="queryOrder">搜 索</el-button>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[0].list"
                    border
                    size="mini"
                    class="content-table">
                    <el-table-column label="状态" width="88" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div :class="{'table-td-red': scope.row.dealStatusValue == 10}">{{scope.row.dealStatusText}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="purchaseOrderNo" label="采购单号" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="供应商名称" sortable  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="arrivalGoodsDateString" label="到货日期" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="inspectionDateString" label="检验日期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="mouldNo" label="模具号" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column label="零件号" width="120"  show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('componentNo')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="processName" label="外协工序" sortable width="120" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="数量" width="100" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('quantity')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="inspectionResultText" label="检测结果" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abnormalQuantity" label="异常数量" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abnormalOverview" label="异常概况" sortable min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dealWayText" label="处理方式" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dealIllustrate" label="处理说明" sortable min-width="120" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
          <div v-show="left.activeId == left.tabs[1].key">
            <div class="main-content-title">
              <div>
                <img :src="currentData.icon" width="22px" style="position: relative;top: 5px;"> {{currentData.name}}
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24" class="mgb10 mgt10">
                  <div>
                    <el-button type="primary" @click="$router.push('/quality/registerFinishedRejects')">不良品处置</el-button>
                  </div>
                  <div class="mgt10 ">
                    <div class="filter-item">
                      <span>模具号：</span> 
                      <el-select size="mini" v-model="left.tabs[1].form.moulde" value-key="mouldNo" placeholder="请选择模具号" style="width: 100px;" @change="(module) => { left.tabs[1].form.componentNo = ''; }">
                        <el-option v-for="(item, index) in $dict.mouldNoList" :key="item.mouldNo" :label="item.mouldNo" :value="item"></el-option>
                      </el-select> 
                    </div>
                    <div class="filter-item">
                      <span>零件号：</span> 
                      <el-select size="mini" v-model="left.tabs[1].form.componentNo" placeholder="请选择模具号" style="width: 120px;">
                      <template v-if="left.tabs[1].form.moulde">
                          <el-option v-for="(item, index) in left.tabs[1].form.moulde.componentOrders" :key="index" :label="item.componentNo" :value="item.componentNo"></el-option>
                        </template>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      <span>加工工序：</span> 
                      <el-select style="width: 100px;" v-model="left.tabs[1].form.processName">
                        <el-option v-for="(item, index) in filter.processes" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      <span>检验日期：</span> 
                      <el-date-picker
                        v-model="left.tabs[1].form.inspectionDate"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div class="filter-item">
                      检验结果：
                      <el-checkbox-group v-model="left.tabs[1].form.inspectionResult" style="display: inline-block;">
                        <el-checkbox label="接受"></el-checkbox>
                        <el-checkbox label="返工"></el-checkbox>
                        <el-checkbox label="报废"></el-checkbox>
                        <el-checkbox label="特采"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <el-button type="primary" class="mgl40" @click="queryProcesses">搜 索</el-button>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[1].list"
                    border
                    size="mini"
                    class="content-table">
                    <el-table-column label="状态" width="88" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div :class="{'table-td-red': scope.row.dealStatusValue == 10}">{{scope.row.dealStatusText}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="mouldNo" label="模具号" sortable width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column label="零件号"   show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('componentNo')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="processName" label="工序" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="inspectionDateString" label="检验日期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column label="数量" width="120" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('quantity')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="inspectionResultText" label="检测结果" sortable width="120"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abnormalQuantity" label="异常数量" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abnormalOverview" label="异常概况" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dealWayText" label="处理方式" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dealIllustrate" label="处理说明" min-width="120" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
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
        filter: {
          supplier: [],
          processes: []
        },
        left: {
          isLoading: false,
          tabs: [
            {
              key:  'page1',
              name: '采购到货不良品处置',
              icon: require('../../../assets/img/icon11.svg'),
              form: {
                dealStatus: 10,
                name: '',
                mouldNo: '',
                componentNo: '',
                inspectionDate: [],
                inspectionDate_from: '',
                inspectionDate_to: '',
                processName: '',
                inspectionResult: [],
              },
              list: []
            },
            {
              key:  'page2',
              name: '工序完工不良品处置',
              icon: require('../../../assets/img/icon12.svg'),
              form: {
                name: '',
                mouldNo: '',
                componentNo: '',
                inspectionDate: [],
                inspectionDate_from: '',
                inspectionDate_to: '',
                processName: '',
                inspectionResult: [],
              }
            }
          ]
        }
      };
    },
    methods: {
      queryOrder() { //采购到货不良品查询

        let params = {
          dealStatus: 10,
          name: this.left.tabs[0].form.name || '',
          mouldNo: this.left.tabs[0].form.mouldNo || '',
          componentNo: this.left.tabs[0].form.componentNo || '',
          inspectionDate_from: this.left.tabs[0].form.inspectionDate[0] || '',
          inspectionDate_to: this.left.tabs[0].form.inspectionDate[1] || '',
          processName: this.left.tabs[0].form.processName || '',
          inspectionResult: '',//this.left.tabs[0].form.inspectionResult
        };

        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryGoodsInspectInfo, (res) =>  {

          this.left.isLoading = false;
          this.left.tabs[0].list = res.data || [];
        }, () => this.left.isLoading = false, params)
      },
      queryProcesses() { //工序完工不良品查询

        let params = {
          dealStatus: 10,
          name: this.left.tabs[1].form.name,
          inspectionDate_from: this.left.tabs[1].form.inspectionDate[0] || '',
          inspectionDate_to: this.left.tabs[1].form.inspectionDate[1] || '',
          mouldNo: '', //this.left.tabs[1].form.moulde.mouldNo 
          comonentNo: this.left.tabs[1].form.comonentNo,
          processName: this.left.tabs[1].form.processName || '',
          inspectionResult: '' //this.left.tabs[1].form.inspectionResult
        };
        
        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryProcessInspectInfo, (res) =>  {

          this.left.isLoading = false;
          this.left.tabs[1].list = res.data || [];
        }, () => this.left.isLoading = false, params)
      },
      handleSelect(item) {
      
        this.left.activeId = item.key;
        this.currentData= item;
      },
      getDropDownList() { //供应商

        this.getList(this.$utils.CONFIG.api.customerQcip, this.filter, 'supplier', {customerType: 20}, (res) => {

          this.filter.supplier = res.content || [];
        }); //获取供应商
      },
      refresh() {}
    },
    created() {

      this.getDropDownList();
      this.handleSelect(this.left.tabs[0]);
      this.queryOrder();
      this.queryProcesses();
    }
  };
</script>


<style scoped lang="scss">
  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
  }
  .filter-item {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
  }
</style>