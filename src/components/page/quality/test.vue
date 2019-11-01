<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：质量检验
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="isLoading">
      <div class="main-left" style="width: 148px;">
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
                    <el-button type="primary" @click="$router.push('/quality/registerArrival')">质量检验</el-button>
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
                      <el-input v-model="left.tabs[0].form.mouldNo" style="width: 100px" />
                    </div>
                    <div class="filter-item">
                      <span>零件号：</span> 
                      <el-input v-model="left.tabs[0].form.componentNo" style="width: 100px" />
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
                      <el-select style="width: 100px;" v-model="left.tabs[0].form.processes">
                        <el-option v-for="(item, index) in left.tabs[1].filter.processes" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      检验结果：
                      <el-checkbox-group v-model="left.tabs[0].form.inspectionResult" style="display: inline-block;">
                        <el-checkbox label="接受" :value="10"></el-checkbox>
                        <el-checkbox label="返工" :value="20"></el-checkbox>
                        <el-checkbox label="报废" :value="50"></el-checkbox>
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
                    <el-table-column prop="purchaseOrderNo" label="采购单号" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="供应商名称" sortable  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="arrivalGoodsDate" label="到货日期" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="inspectionDate" label="检验日期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="mouldNo" label="模具号" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="f" label="零件号" sortable width="120"  show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('componentNo')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="processName" label="外协工序" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="h" label="数量" sortable width="100" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('quantity')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="inspectionResultText" label="检测结果" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abnormalQuantity" label="异常数量" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abnormalOverview" label="异常概况" min-width="120" show-overflow-tooltip></el-table-column>
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
                    <el-button type="primary" @click="$router.push('/quality/registerFinished')">质量检验</el-button>
                  </div>
                  <div class="mgt10 ">
                    <div class="filter-item">
                      <span>模具号：</span> 
                      <el-input v-model="left.tabs[1].form.mouldNo" style="width: 100px" />
                    </div>
                    <div class="filter-item">
                      <span>零件号：</span> 
                      <el-input v-model="left.tabs[1].form.componentNo" style="width: 100px" />
                    </div>
                    <div class="filter-item">
                      <span>加工工序：</span> 
                      <el-select style="width: 100px;" v-model="left.tabs[1].form.processId">
                        <el-option v-for="(item, index) in left.tabs[1].filter.processes" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
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
                        <el-checkbox label="接受" :value="10"></el-checkbox>
                        <el-checkbox label="返工" :value="20"></el-checkbox>
                        <el-checkbox label="报废" :value="50"></el-checkbox>
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
                    <el-table-column prop="mouldNo" label="模具号" sortable width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column label="零件号" sortable  show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('componentNo')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="processName" label="工序" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="inspectionDate" label="检验日期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column label="数量" sortable width="120" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{scope.row.components | concatString('quality')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="inspectionResultText" label="检测结果" sortable width="120"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="g" label="异常数量" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abnormalQuantity" label="异常概况" show-overflow-tooltip></el-table-column>
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
          tabs: [
            {
              key:  'page1',
              name: '采购到货检验',
              icon: require('../../../assets/img/icon11.svg'),
              filter: {
                supplier: [
                  {
                    stuffNo: 'A公司'
                  },
                  {
                    stuffNo: 'B公司'
                  },
                ],
                processes: [
                  {
                    stuffNo: 'A'
                  },
                  {
                    stuffNo: 'G'
                  },
                ]
              },
              form: {
                name: '',
                mouldNo: '',
                componentNo: '',
                processName: '',
                inspectionDate: '',
                inspectionResult: ''
              },
              list: []
            },
            {
              key:  'page2',
              name: '工序完工检验',
              icon: require('../../../assets/img/icon12.svg'),
              filter: {
                processes: [
                  {
                    stuffNo: 'A'
                  },
                  {
                    stuffNo: 'G'
                  },
                ]
              },
              form: {
                name: '',
                mouldNo: '',
                componentNo: '',
                processId: '',
                inspectionDate: '',
                inspectionResult: ''
              },
              list: []
            }
          ]
        }
      };
    },
    methods: {
      queryOrder() { //获取采购到货检验列表

        let params = {
          name: this.left.tabs[0].form.name,
          inspectionDate_from: this.left.tabs[0].form.inspectionDate[0] || '',
          inspectionDate_to: this.left.tabs[0].form.inspectionDate[1] || '',
          mouldNo: this.left.tabs[0].form.mouldNo,
          comonentNo: this.left.tabs[0].form.comonentNo,
          processName: this.left.tabs[0].form.processName,
          inspectionResult: this.left.tabs[0].form.inspectionResult,
          sorting: '_MrCustomer.name'
        };
  
        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryGoodsInspectInfo, (res) =>  {

          this.isLoading = false;
          this.left.tabs[0].list = res.data || [];
        }, () => this.isLoading = false, params)
      },
      queryProcesses() { //获取工序完工检验列表

        let params = {
          name: this.left.tabs[1].form.name,
          inspectionDate_from: this.left.tabs[1].form.inspectionDate[0] || '',
          inspectionDate_to: this.left.tabs[1].form.inspectionDate[1] || '',
          mouldNo: this.left.tabs[1].form.mouldNo,
          comonentNo: this.left.tabs[1].form.comonentNo,
          processId: this.left.tabs[1].form.processId,
          inspectionResult: this.left.tabs[1].form.inspectionResult
        };
    
        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryProcessInspectInfo, (res) =>  {

          this.isLoading = false;
          this.left.tabs[1].list = res.data || [];
        }, () => this.isLoading = false, params)
      },
      handleSelect(item) {
      
        this.left.activeId = item.key;
        this.currentData= item;
      },
      getDropDownList() { //供应商、模具号、零件号下拉列表

        this.getList(this.$utils.CONFIG.api.customerQcip, this.filter, 'supplier', {customerType: 20, type: 0}, (res) => {

          this.filter.supplier = res.content || [];
        }); //获取客户列表
        //this.getList(this.$utils.CONFIG.api.qwm, this.filter, 'qwm'); //获取模具与零件号联动列表
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