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
                    <el-button type="primary" @click="jump('add')">下达采购订单</el-button>
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
                    <el-table-column prop="mouldNo" label="模具号" width="180" show-overflow-tooltip></el-table-column>
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
                    <el-table-column label="外协工序" width="180" show-overflow-tooltip>
                      <template scope="scope">
                        {{scope.row.components | concatString('quantity')}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="applyDate" label="申请交期" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="description" label="操作" show-overflow-tooltip>
                      <template scope="scope">
                        <el-button type="text">取消</el-button>
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
                  <div class="mgt10 dflex">
                    <div>筛选条件</div>
                    <div class="flex">
                      <div class="filter-item">
                        <span>供应商名称：</span> 
                        <el-select style="width: 100px;" v-model="currentData">
                          <el-option v-for="(itemc, index) in currentData" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                        </el-select>
                      </div>
                      <div class="filter-item">
                        <span>下单日期：</span> 
                        <el-date-picker
                          v-model="currentData"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </div>
                      <div class="filter-item">
                        <span>要求交期：</span> 
                        <el-date-picker
                          v-model="currentData"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </div>
                      <div class="filter-item">
                        <span>总金额：</span> 
                        <el-input v-model="currentData.key" style="width: 60px" />
                        元
                        <span class="mglr10">至</span>
                        <el-input v-model="currentData.key" style="width: 60px" />
                        元
                      </div>
                    </div>
                  </div>
                  <div>
                    排序:
                    <el-button type="primary" size="mini">订单编号</el-button>
                    <el-button type="primary" size="mini">下单日期</el-button>
                    <el-button type="primary" size="mini">总金额</el-button>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[1].list"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column prop="componentNo" label="采购订单编号" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="componentNo" label="供应商" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="requirementQuantity" label="下单日期" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerNo" label="最近要求交期" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="issuedOrderDate" label="总金额(CNY)" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="description" label="操作" show-overflow-tooltip>
                      <template scope="scope">
                        <el-button type="text" @click="$router.push('/plan/register/1')">到货</el-button>
                        <el-button type="text" @click="jump('edit')">查看</el-button>
                        <el-button type="text" @click="jump('edit')">编辑</el-button>
                        <el-button type="text" @click="jump('edit')">完成</el-button>
                        <el-button type="text">取消</el-button>
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
                    <el-button type="primary" @click="jump('add')">添加供应商</el-button>
                  </p>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[2].list"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column prop="componentNo" label="供应商名称" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="componentNo" label="供应商简称" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="requirementQuantity" label="联系电话" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerNo" label="传真" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="issuedOrderDate" label="电子邮件" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="description" label="操作" show-overflow-tooltip>
                      <template scope="scope">
                        <el-button type="text">编辑</el-button>
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
        <el-form :model="handle.supplier.form" label-width="100px">
          <div class="dialog-content pdt10 pdlr10 mglr10">
            <el-form-item label="供应商名称" prop="customerName">
              <el-input v-model="handle.supplier.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="供应商简称" prop="customerName">
              <el-input v-model="handle.supplier.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="customerName">
              <el-input v-model="handle.supplier.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="customerName">
              <el-input v-model="handle.supplier.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="customerName">
              <el-input v-model="handle.supplier.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件" prop="customerName">
              <el-input v-model="handle.supplier.form.customerName" auto-complete="off"></el-input>
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
          <el-button type="primary" @click="addOrder(true)">保存</el-button>
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
              list: []
            },
            {
              key:  'page2',
              name: '采购订单跟踪',
              icon: require('../../../assets/img/icon9.svg'),
              filter: {

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
          supplier: {
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
      queryNoReleasedPurchase() { //获取外协零件列表

        let params = {
          offset: 0,
          limit: 1000,
          sorting: '_MrOutsourcePurchaseApply.applyDate'
        }
        
        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryNoReleasedPurchase, (res) => {
   
          this.left.isLoading = false;
          this.left.tabs[0].list = res.data.content || [];
        }, () => {

          this.left.isLoading = false;
          this.left.tabs[0].list = [];
        }, params)
      },
      queryNoReleasedPurchase1() { //获取外协零件列表

        let params = {
          offset: 0,
          limit: 1000,
          sorting: '_MrOutsourcePurchaseApply.applyDate'
        }
        
        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryNoReleasedPurchase, (res) => {
   
          this.left.isLoading = false;
          this.left.tabs[0].list = res.data.content || [];
        }, () => {

          this.left.isLoading = false;
          this.left.tabs[0].list = [];
        }, params)
      },
      getDetail(i) {

        // let params = {
        //   mrSaleOrderId: id
        // }

        // this.right.isLoading = true;
        // this.$utils.getJson(this.$utils.CONFIG.api.queryPendingSaleOrderDetail, (res) => { //订单详情 

        //   this.right.page1 = res.data[0] || {};
        //   this.right.isLoading = false;
        // }, () => this.right.isLoading = false, params);

       
      },
      handleSelect(item) {
      
        this.left.activeId = item.key;
        this.currentData= item;
        this.getDetail();
      },
      addOrder(saveAsDraft = false) {

      },
      handleSelectionChange(val) {

        this.right.page2.selections = val;
      },
      jump(type = 'add', row = {}) {
      },
      refresh() {}
    },
    created() {
      this.handleSelect(this.left.tabs[0]);
      this.queryNoReleasedPurchase();
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
    margin-left: 20px;
    margin-bottom: 10px;
  }
</style>