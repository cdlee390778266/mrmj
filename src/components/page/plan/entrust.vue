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
                      <el-select style="width: 100px;" v-model="left.tabs[1].form.name">
                        <el-option v-for="(item, index) in left.tabs[1].filter.supplier" :key="index" :label="item.name" :value="item.name" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      <span>下单日期：</span> 
                      <el-date-picker
                        v-model="left.tabs[1].form.makeOrderDaterange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
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
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div class="filter-item">
                      <span>总金额：</span> 
                      <el-input v-model="left.tabs[1].form.minTotalPrice" style="width: 60px" />
                      元
                      <span class="mglr10">至</span>
                      <el-input v-model="left.tabs[1].form.maxTotalPrice" style="width: 60px" />
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
                    <el-table-column prop="name" label="供应商"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="releasedOrderDate" label="下单日期" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="earliestDeliveryDate" label="最近要求交期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="totalPrice" label="总金额(CNY)" sortable width="120"  show-overflow-tooltip></el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                      <template slot-scope="scope">
                        <div>
                          <el-button type="text" @click="$router.push(`/plan/register/${scope.row.mrPurchaseOrderId}`)">到货</el-button>
                          <el-button type="text" @click="$router.push(`/plan/order/${scope.row.mrPurchaseOrderId}`)">查看</el-button>
                          <el-button type="text" @click="$router.push(`/plan/placeOrder/${scope.row.mrPurchaseOrderId}`)">编辑</el-button>
                          <el-button type="text"  @click="$router.push(`/plan/order/${scope.row.mrPurchaseOrderId}`)">完成</el-button>
                          <el-button type="text" @click="deleteOrder(scope.row, scope.$index)">删除</el-button>
                        </div>
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
                    <el-table-column prop="name" label="供应商名称" sortable min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="abbreviation" label="供应商简称" sortable min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" label="详细地址" sortable min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="phone" label="联系电话" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="fax" label="传真" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="email" label="电子邮件" sortable min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="description" label="操作" width="100" align="center" fixed="right" show-overflow-tooltip>
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

    <el-dialog title="供应商信息" class="dialog-gray tc" :visible.sync="handle.supplier.dialogVisible" width="666px">
      <div v-loading="handle.supplier.isLoading">
        <el-form ref="supplierForm" :model="handle.supplier.form" :rules="handle.supplier.rules" label-width="100px">
          <div class="dialog-content pdt10 pdlr10 mglr10">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="handle.supplier.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="供应商简称" prop="abbreviation">
              <el-input v-model="handle.supplier.form.abbreviation" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="handle.supplier.form.address" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="handle.supplier.form.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="fax">
              <el-input v-model="handle.supplier.form.fax" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email">
              <el-input v-model="handle.supplier.form.email" auto-complete="off"></el-input>
            </el-form-item>
            <div class="tl">
              <p>业务联系人：</p>
              <el-table :data="handle.supplier.form.liaisonMens" border size="mini" style="width: 100%" class="edit-table">
                <el-table-column prop="name" label="联系人姓名"  min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonMens, scope.$index, 'nameEdit')">
                        <el-input size="mini" v-model="scope.row.name" @focus="showInput(handle.supplier.form.liaisonMens, scope.$index, 'nameEdit')" @blur="scope.row.nameEdit = false" :style="{opacity: scope.row.nameEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.name }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="88" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row, '', true)">
                      <div @click="showInput(handle.supplier.form.liaisonMens, scope.$index, 'genderEdit')">
                        <div class="ellipsis">
                          {{scope.row.gender}}
                        </div>
                        <el-select
                          v-model="scope.row.genderSelect"
                          placeholder="请选择"
                          :style="{opacity: scope.row.genderEdit ? 1 : 0}"
                          @focus="showInput(handle.supplier.form.liaisonMens, scope.$index, 'genderEdit')"
                          @blur="scope.row.genderEdit = false">
                          <el-option label="男" value="男">
                          </el-option>
                          <el-option label="女" value="女">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="position" label="职位" min-width="100"  show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonMens, scope.$index, 'positionEdit')">
                        <el-input size="mini" v-model="scope.row.position" @focus="showInput(handle.supplier.form.liaisonMens, scope.$index, 'positionEdit')" @blur="scope.row.positionEdit = false" :style="{opacity: scope.row.positionEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.position }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" min-width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonMens, scope.$index, 'phoneEdit')">
                        <el-input size="mini" v-model="scope.row.phone" @focus="showInput(handle.supplier.form.liaisonMens, scope.$index, 'phoneEdit')" @blur="scope.row.phoneEdit = false" :style="{opacity: scope.row.phoneEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.phone }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="email" label="电子邮件" min-width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonMens, scope.$index, 'emailEdit')">
                        <el-input size="mini" v-model="scope.row.email" @focus="showInput(handle.supplier.form.liaisonMens, scope.$index, 'emailEdit')" @blur="scope.row.emailEdit = false" :style="{opacity: scope.row.emailEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.email }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.supplier.form.liaisonMens, scope.$index, 'remarkEdit')">
                        <el-input size="mini" v-model="scope.row.remark" @focus="showInput(handle.supplier.form.liaisonMens, scope.$index, 'remarkEdit')" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
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
          <el-button type="primary" @click="updateUser">保存</el-button>
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
                supplier: []
              },
              form: {
                name: '',
                makeOrderDaterange: '',
                requireDaterange: '',
                minTotalPrice: '',
                maxTotalPrice: ''
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
              name: '',
              liaisonMens: [{}]
            },
            rules: {
              name: [
                { required: true, message: this.$utils.getTipText('error', '-1080')}
              ],
              abbreviation: [
                { required: true, message: this.$utils.getTipText('error', '-1081')}
              ],
              address: [
                { required: true, message: this.$utils.getTipText('error', '-1082')}
              ],
              phone: [
                { required: true, message: this.$utils.getTipText('error', '-1083')}
              ],
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
        console.log(this.left.tabs[1].form)
        let params = {
          name: this.left.tabs[1].form.name,
          releasedOrderDate_from: this.left.tabs[1].form.makeOrderDaterange ? this.left.tabs[1].form.makeOrderDaterange[0] : '',
          releasedOrderDate_to: this.left.tabs[1].form.makeOrderDaterange ? this.left.tabs[1].form.makeOrderDaterange[1] : '',
          earliestDeliveryDate_from: this.left.tabs[1].form.requireDaterange ? this.left.tabs[1].form.requireDaterange[0] : '',
          earliestDeliveryDate_to: this.left.tabs[1].form.requireDaterange ? this.left.tabs[1].form.requireDaterange[1] : '',
          minTotalPrice: parseInt(this.left.tabs[1].form.minTotalPrice) || '',
          maxTotalPrice: parseInt(this.left.tabs[1].form.maxTotalPrice) || ''
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
          customerType: 20
        };

        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.customerQcip, (res) =>  {

          this.left.isLoading = false;
          this.left.tabs[2].list = res.data.content || [];
          this.left.tabs[1].filter.supplier = this.$utils.deepCopy(this.left.tabs[2].list);
        }, () => this.left.isLoading = false, params)
      },
      addOrder() {

        if(!this.left.tabs[0].selections.length) {
          this.$utils.showTip('warning', 'error', '-1060');
          return;
        }

        let time = new Date().getTime();
        let ids = [];
        this.left.tabs[0].selections.map(item => ids.push(item.outsourceType == 10 ? item.mrOutsourcePurchaseApplyId : item.productionPlanProcessId))
        this.$utils.setSessionStorage(time, JSON.stringify(ids));
        this.$router.push(`/plan/placeOrder/${time}`);
      },
      showDialog(type, row) {

        this.handle.supplier.type = type;
        if(type == 'add') { //新增
          
          this.$refs.supplierForm && this.$refs.supplierForm.resetFields();
          this.handle.supplier.dialogVisible = true;
          this.handle.supplier.form = {};
          this.handle.supplier.form.liaisonMens = [{}];
        }else { //编辑

          this.handle.supplier.dialogVisible = true;
          this.handle.supplier.form = this.$utils.deepCopy(row);
          if(!this.handle.supplier.form.liaisonMens || !this.handle.supplier.form.liaisonMens.length) this.handle.supplier.form.liaisonMens = [{}];
        }
      },
      updateUser() {

        this.$refs.supplierForm.validate((valid) => {
          if (valid) {
            
            let url = '';
            let params = {};

            if(this.handle.supplier.type == 'add') {

              url = this.$utils.CONFIG.api.saveCustomer;
              params = this.handle.supplier.form;
              params.customerType = 20;
              params.countryId = '--';
              let liaisonMens = [];
              params.liaisonMens && params.liaisonMens.map(item => {

                if(item.name && item.phone) liaisonMens.push(Object.assign({}, item))
              })
              params.liaisonMens = liaisonMens;
            }else {

              url = this.$utils.CONFIG.api.modifyCustomerInfo;
              params = this.handle.supplier.form;
              let liaisonMens = [];
              params.liaisonMens && params.liaisonMens.map(item => {
                if(item.mrLiaisonManId) {

                  if(!item.id) {
                    liaisonMens.push(Object.assign({}, item));
                  }
                }else {
                  if(item.name && item.phone) liaisonMens.push(Object.assign({}, item))
                }
                
              })
              params.liaisonMens = liaisonMens;
            }
           
            this.handle.supplier.isLoading = true;
            this.$utils.getJson(url, (res) =>  {

              this.handle.supplier.isLoading = false;
              this.handle.supplier.dialogVisible = false;
              this.$utils.showTip('success', 'success', '102');
              this.queryUser();
            }, () => this.handle.supplier.isLoading = false, params)
          } else {
  
            return false;
          }
        });
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