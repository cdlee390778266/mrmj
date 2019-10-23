<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：下达采购订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="left.isLoading">
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
                <i class="el-icon-lx-edit"></i> {{currentData.name}}
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24" class="mgb10 mgt10">
                  <p><strong>待采购申请</strong></p>
                  <p class="mgt10">
                    <el-button type="primary" @click="addOrder">下达采购订单</el-button>
                    <span>（勾选下表需要外协的零件，点击按钮，生成采购订单）</span>
                  </p>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[0].list"
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
                    <el-table-column prop="mouldNo" sortable label="模具号" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column label="零件号" width="180" show-overflow-tooltip>
                      <template scope="scope">
                        {{scope.row.components | concatString('componentNo')}}
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" show-overflow-tooltip>
                      <template scope="scope">
                        {{scope.row.components | concatString('quantity')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" sortable label="外协工序" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="applyDateString" sortable label="申请交期" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip>
                      <template scope="scope">
                        <el-button type="text" @click="deleteNoReleasedPurchase(scope.row, scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
          <div v-show="left.activeId == left.tabs[1].key">
            <div class="main-content-title">
              <div>
                <i class="el-icon-lx-edit"></i> {{currentData.name}}
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24" class="mgb10 mgt10">
                  <div><strong>采购订单列表</strong></div>
                  <div class="mgt10 ">
                    <div class="filter-item">
                      <span>供应商名称：</span> 
                      <el-select style="width: 100px;" v-model="left.tabs[1].form.supplier">
                        <el-option v-for="(item, index) in left.tabs[1].filter.supplier" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      <span>下单日期：</span> 
                      <el-date-picker
                        v-model="left.tabs[1].form.makeOrderDaterange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div class="filter-item">
                      <span>要求交期：</span> 
                      <el-date-picker
                        v-model="left.tabs[1].form.requireDaterange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div class="filter-item">
                      <span>总金额：</span> 
                      <el-input v-model="left.tabs[1].form.minPrice" style="width: 60px" />
                      元
                      <span class="mglr10">至</span>
                      <el-input v-model="left.tabs[1].form.maxPrice" style="width: 60px" />
                      元
                    </div>
                    <el-button type="primary" class="mgl40" @click="queryOrder">搜 索</el-button>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[1].list"
                    border
                    size="mini"
                    class="content-table">
                    <el-table-column prop="purchaseOrderNo" label="采购订单编号" sortable width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="purchaseOrderNo" label="供应商"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="releasedOrderDate" label="下单日期" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="earliestDeliveryDate" label="最近要求交期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="totalPrice" label="总金额(CNY)" sortable width="120"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="description" label="操作" width="200">
                      <template scope="scope">
                        <el-button type="text" @click="$router.push('/plan/register/1')">到货</el-button>
                        <el-button type="text" @click="$router.push('/plan/order/1')">查看</el-button>
                        <el-button type="text" @click="$router.push('/plan/placeOrder/1')">编辑</el-button>
                        <el-button type="text"  @click="$router.push('/plan/order/1')">完成</el-button>
                        <el-button type="text" @click="deleteOrder(scope.row, scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
          <div v-show="left.activeId == left.tabs[2].key">
            <div class="main-content-title">
              <div>
                <i class="el-icon-lx-edit"></i> {{currentData.name}}
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24" class="mgb10 mgt10">
                  <p class="mgt10">
                    <el-button type="primary" @click="showDialog('add', {})">添加供应商</el-button>
                  </p>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[2].list"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%">
                    <el-table-column prop="a" label="供应商名称" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="b" label="供应商简称" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="c" label="详细地址" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="d" label="联系电话" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="e" label="传真" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="f" label="电子邮件" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="description" label="操作" show-overflow-tooltip>
                      <template scope="scope">
                        <el-button type="text" @click="showDialog('edit', scope.row)">编辑</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="供应商信息" class="dialog-gray tc" :visible.sync="handle.supplier.dialogVisible">
      <div v-loading="handle.supplier.isLoading">
        <el-form ref="supplierForm" :model="handle.supplier.form" :rules="handle.supplier.rules" label-width="100px">
          <div class="dialog-content pdt10 pdlr10 mglr10">
            <el-form-item label="供应商名称" prop="a">
              <el-input v-model="handle.supplier.form.a" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="供应商简称" prop="b">
              <el-input v-model="handle.supplier.form.b" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="c">
              <el-input v-model="handle.supplier.form.c" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="d">
              <el-input v-model="handle.supplier.form.d" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="e">
              <el-input v-model="handle.supplier.form.e" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="f">
              <el-input v-model="handle.supplier.form.f" auto-complete="off"></el-input>
            </el-form-item>
            <div class="tl">
              <p>业务联系人：</p>
              <el-table :data="handle.supplier.form.liaisonManList" border size="mini" style="width: 100%" class="edit-table">
                <el-table-column prop="liaisonManName" label="联系人姓名"  width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonManList, scope.$index, 'liaisonManNameEdit')">
                        <el-input size="mini" v-model="scope.row.liaisonManName" @focus="showInput(handle.supplier.form.liaisonManList, scope.$index, 'liaisonManNameEdit')" @blur="scope.row.liaisonManNameEdit = false" :style="{opacity: scope.row.liaisonManNameEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.liaisonManName }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="性别" width="88" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonManList, scope.$index, 'genderEdit')">
                        <el-input size="mini" v-model="scope.row.gender" @focus="showInput(handle.supplier.form.liaisonManList, scope.$index, 'genderEdit')" @blur="scope.row.genderEdit = false" :style="{opacity: scope.row.genderEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.gender }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="职位" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonManList, scope.$index, 'positionEdit')">
                        <el-input size="mini" v-model="scope.row.position" @focus="showInput(handle.supplier.form.liaisonManList, scope.$index, 'positionEdit')" @blur="scope.row.positionEdit = false" :style="{opacity: scope.row.positionEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.position }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="联系电话" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonManList, scope.$index, 'phoneEdit')">
                        <el-input size="mini" v-model="scope.row.phone" @focus="showInput(handle.supplier.form.liaisonManList, scope.$index, 'phoneEdit')" @blur="scope.row.phoneEdit = false" :style="{opacity: scope.row.phoneEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.phone }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="电子邮件" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonManList, scope.$index, 'emailEdit')">
                        <el-input size="mini" v-model="scope.row.email" @focus="showInput(handle.supplier.form.liaisonManList, scope.$index, 'emailEdit')" @blur="scope.row.emailEdit = false" :style="{opacity: scope.row.emailEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.email }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="备注" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonManList, scope.$index, 'remarkEdit')">
                        <el-input size="mini" v-model="scope.row.remark" @focus="showInput(handle.supplier.form.liaisonManList, scope.$index, 'remarkEdit')" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.remark }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="addUser">保存</el-button>
          <el-button type="primary" @click="handle.supplier.dialogVisible = false">取消</el-button>
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
        left: {
          isLoading: false,
          tabs: [
            {
              key:  'page1',
              name: '下达采购订单',
              icon: require('../../../assets/img/icon8.svg'),
              selections: [],
              list: []
            },
            {
              key:  'page2',
              name: '采购订单跟踪',
              icon: require('../../../assets/img/icon9.svg'),
              filter: {
                supplier: [
                  {
                    stuffNo: 'A公司'
                  },
                  {
                    stuffNo: 'B公司'
                  },
                ]
              },
              form: {
                supplier: '',
                makeOrderDaterange: '',
                requireDaterange: '',
                minPrice: '',
                maxPrice: ''
              },
              list: []
            },
            {
              key:  'page3',
              name: '供应商管理',
              icon: require('../../../assets/img/icon10.svg'),
              list: []
            },
          ]
        },
        handle: {
          supplier: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {
              a: '',
              b: '',
              c: '',
              d: '',
              e: '',
              f: '',
              liaisonManList: [{}]
            },
            rules: {
              a: [
                { required: true, message: '请输入供应商名称'}
              ]
            }
          }
        }
      };
    },
    methods: {
      queryNoReleasedPurchase() { //获取下达采购订单列表

        let params = {
          offset: 0,
          limit: 1000,
          sorting: '_MrOutsourcePurchaseApply.applyDate'
        }
        
        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryNoReleasedPurchase, (res) => {
   
          this.left.isLoading = false;
          this.left.tabs[0].list = res.data || [];
        }, () => {

          this.left.isLoading = false;
          this.left.tabs[0].list = [];
        }, params)
      },
      deleteNoReleasedPurchase(item, index) {

        let params = {
          mrOutsourcePurchaseApplyId: item.mrOutsourcePurchaseApplyId
        };
      
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.deletePurchaseApply, (res) =>  {

          this.right.isLoading = false;
          this.$utils.showTip('success', 'success', '104');
          this.queryNoReleasedPurchase();
        }, () => this.right.isLoading = false, params)
      },
      queryOrder() { //获取采购订单跟踪列表

        let params = {
          name: '',
          releasedOrderDate_from: '',
          releasedOrderDate_to: '',
          earliestDeliveryDate_from: '',
          earliestDeliveryDate_to: '',
          minTotalPrice: '',
          maxTotalPrice: ''
        };
    
        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPurchaseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.tabs[1].list = res.data || [];
        }, () => this.left.isLoading = false, params)
      },
      deleteOrder(item, index) {

        let params = {

        };
      
        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.$utils.showTip('success', 'success', '104');
          this.left.tabs[1].list.splice(index, 1);
        }, () => this.right.isLoading = false, params)
      },
      queryUser() { //获取供应商列表

        let params = {

        };
        let mock = [
          {
            id: '',
            a: 'A公司',
            b: 'A',
            c: '四川成都高新区',
            d: '12312312312',
            e: '12312312312',
            f: '12313@123123.com'
          },
          {
            a: 'B公司',
            b: 'B',
            c: '北京',
            d: '12312312312',
            e: '12312312312',
            f: '12313@qq.com'
          }
        ]

        this.left.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.tabs[2].list = res.data || [];
        }, () => this.left.isLoading = false, params, mock)
      },
      
      addOrder() {

        if(!this.left.tabs[0].selections.length) {
          this.$utils.showTip('warning', 'error', '-1060');
          return;
        }

        let time = new Date().getTime();
        let ids = [];
        this.left.tabs[0].selections.map(item => ids.push(item.mrOutsourcePurchaseApplyId ? item.mrOutsourcePurchaseApplyId : item.productionPlanProcessId))
        this.$utils.setSessionStorage(time, JSON.stringify(ids));
        this.$router.push(`/plan/placeOrder/${time}`);
      },
      showDialog(type, row) {

        this.handle.supplier.type = type;
        if(type == 'add') { //新增

          this.$refs.supplierForm && this.$refs.supplierForm.resetFields();
          this.handle.supplier.dialogVisible = true;
          this.handle.supplier.form.liaisonManList = [{}];
        }else { //编辑

          let params = {

          };
          let mock = Object.assign({}, row, {liaisonManList: [{}]})

          this.handle.supplier.dialogVisible = true;
          this.handle.supplier.isLoading = true;
          this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

            this.handle.supplier.isLoading = false;
            this.handle.supplier.form = res.data || {};
          }, () => this.handle.supplier.isLoading = false, params, mock)
        }
      },
      addUser() {

        let params = {

        };
       
        this.handle.supplier.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.supplier.isLoading = false;
          this.handle.supplier.dialogVisible = false;
          this.$utils.showTip('success', 'success', '102');console.log(this.handle.supplier.type)
          if(this.handle.supplier.type == 'add') {  //如果新增
            
            this.left.tabs[2].list.push(Object.assign({}, this.handle.supplier.form));
          }else { //如果编辑

          }
        }, () => this.handle.supplier.isLoading = false, params)
      },
      handleSelect(item) {
      
        this.left.activeId = item.key;
        this.currentData= item;
      },
      handleSelectionChange(val) {

        this.left.tabs[0].selections = val;
      },
      refresh() {}
    },
    created() {

      this.handleSelect(this.left.tabs[0]);
      this.queryNoReleasedPurchase();
      this.queryOrder();
      this.queryUser();
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