<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：电极设计与CNC编程
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            待处理零件：
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
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrElectrodeProductionOrderId }" v-show="isShowList" @click="handleSelect(item, 'mrElectrodeProductionOrderId')">
            <div class="dflex">
              <div>
                <div>
                  <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
                </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">模具号：<span>{{ item.mouldNo | filterNull }}</span></p>
                  <p class="flex ellipsis">交期：<span>{{ item.requireDeliveryDate | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">零件号：<span>{{item.components | concatString('componentNo')}}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">数量：{{item.components | concatString('quantity')}}</span></el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="handle.design.dialogVisible = true">设计完成</a>
                <a href="javascript: void(0);" @click="getOrderDetail(item)">下达电极生产订单</a>
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
        <page-wrapper @change="refresh">
          <template #pageName>零件信息明细</template>
          <div >
            <div class="main-content-title">
              <div>
                <i class="el-icon-lx-edit"></i> 零件号{{currentData.components | concatString('componentNo')}}电极设计与CNC编程任务信息
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <strong>零件及工艺信息</strong>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{ currentData.mouldNo | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：{{ currentData.name | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交期：{{ currentData.requireDeliveryDate | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">零件号码：{{currentData.components | concatString('componentNo')}}</el-col>
                <el-col :xs="24">
                  材料：{{ currentData.stuffNo | filterNull }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">工序及估工：</el-col>
                <el-col :span="24">
                  <table class="mrmj-table">
                    <thead>
                      <tr>
                        <th class="bge4e4e4">工序顺序</th>
                        <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.name}}</th>
                        <th class="bge4e4e4">工时合计</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="bge4e4e4">估工（H）</td>
                        <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                        <th class="bge4e4e4">
                          {{currentData.processes | sum('estimationWorkTime')}}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </el-col>
              </el-row>
              <el-row class="mgt10">
                <el-col :span="24"><strong>相关附件</strong></el-col>
                <el-col :span="24">
                  <el-table
                    :data="currentData.attachments"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip></el-table-column>
                    <el-table-column label="版本号" show-overflow-tooltip>
                      <template slot-scope="scope">
                        -
                      </template>
                    </el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>电极设计任务</strong>
                  <el-button type="primary" class="mgl10" @click="applySpareParts" v-if="currentData.isElectrodeShow">申领</el-button>
                </el-col>
                <el-col :span="24">
                  <span>设计人员：Chen</span>
                  <span>完成时间：进行中</span>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>ELE编程任务</strong>
                  <el-button type="primary" class="mgl10" v-if="currentData.isElectrodeShow">申领</el-button>
                </el-col>
                <el-col :span="24">
                  <span>设计人员：Chen</span>
                  <span>完成时间：进行中</span>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>CNCV编程任务</strong>
                  <el-button type="primary" class="mgl10" v-if="currentData.isCNCShow">申领</el-button>
                </el-col>
                <el-col :span="24">
                  <span>设计人员：Chen</span>
                  <span>完成时间：进行中</span>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>CNCH编程任务</strong>
                  <el-button type="primary" class="mgl10" v-if="currentData.isCNCShow">申领</el-button>
                </el-col>
                <el-col :span="24">
                  <span>设计人员：Chen</span>
                  <span>完成时间：进行中</span>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="电极生产订单下达对话框" class="dialog-gray" :visible.sync="handle.add.dialogVisible">
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

    <el-dialog title="零件电极设计与CNC编程任务完成确认" width="500px" :visible.sync="handle.design.dialogVisible">
      <div v-loading="handle.design.isLoading">
        <el-row>
          <el-col :span="24">
            <strong>零件信息</strong>
          </el-col>
          <el-col :span="12">
            模具号：M-1901
          </el-col>
          <el-col :span="12">
            客户：测试测试测试测试公司
          </el-col>
          <el-col :span="24">
            交期：2019.04.31
          </el-col>
          <el-col :span="24">
            零件号码：212/213/214/215
          </el-col>
          <el-col :span="24" class="mgt10">
            <strong>电极设计与CNC编程是否已经完成？</strong>
          </el-col>
          <el-col :span="24">
            <el-checkbox-group v-model="handle.design.form.type">
              <el-checkbox label="查修筋"></el-checkbox>
              <el-checkbox label="查是否漏设计"></el-checkbox>
              <el-checkbox label="查粗打齿"></el-checkbox>
              <el-checkbox label="单向公差"></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer tr mgt30">
          <el-button type="primary" @click="handle.design.dialogVisible = false">完成</el-button>
          <el-button type="primary" @click="handle.design.dialogVisible = false">返回</el-button>
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
        defaultImg: require('../../../assets/img/spareParts.svg'),
        left: {
          list: [
            {}
          ]
        },
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
          },
          design: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {
              type: ''
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

        this.getData(this.$utils.CONFIG.api.queryNoDealEleOrCNC, params, 'mrElectrodeProductionOrderId', loadingKey);
      },
      handleSelect(item, idKey = 'id') {
      
        this.left.activeId = item[idKey];
        this.currentData= item;
      },
      getOrderDetail(item) {

        this.handle.add.dialogVisible = true;

        let params = {
          mrSaleOrderId: item.mrSaleOrderId
        }

        this.$utils.getJson(this.$utils.CONFIG.api.queryProductionOrderInfo, (res) => {

          this.handle.add.isLoading = false;
          this.handle.add.data = res.data || {};
        }, () => this.handle.add.isLoading = false, params);
      },
      addProductionOrder() {  //下达生产订单

        let params = {
          mrSaleOrderId: ''
        }

        this.$utils.getJson(this.$utils.CONFIG.api.releasedProductionOrder, (res) => { 

          this.handle.add.isLoading = false;
          this.showTip('success', 'success', '102');
          this.search();
        }, () => this.handle.add.isLoading = false, params);
      },
      applySpareParts() {
        
        this.$router.push(`/product/designElectrode`)
      },
      refresh() {}
    },
    computed: {
      componentNo() {

        return (components) => {

          let arr = [];
          components.forEach(item => {

            arr.push(item.componentNo);
          })
          
          return arr.join('/');
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
  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
  }
</style>