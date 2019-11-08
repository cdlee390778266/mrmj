<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：应收款
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            当前应收款
            <el-input v-model="form.text" style="width: 146px" prefix-icon="el-icon-search" @focus="isShowList = false" />
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
        <div class="list" style="top: 64px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex ellipsis">
                <p class="ellipsis">{{item.a | filterNull}}</p>
                <p class="ellipsis">待收款：{{item.b | filterNull}}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="10">未结订单数：{{item.c | filterNull}}</el-col>
              <el-col :span="14">账款到期：{{item.d | filterNull}}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="getReceiveDetail(item)">收款登记</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="refresh">
          <template #pageName>
            应收款明细
          </template>
          <template #pageTitle>
            <i class="el-icon-lx-edit"></i> 应收款项信息
          </template>
          <div class="pdt10 mgt10">
            <div>
              <div class="main-content-title">
                <div>
                  <i class="el-icon-lx-edit"></i> 应收款项信息
                </div>
              </div>
              <el-scrollbar class="main-content-scorll pdt30">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{right.page1.a | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：{{right.page1.b | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：{{right.page1.c | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：{{right.page1.d | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：{{right.page1.e | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前应收款：{{right.page1.f | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">已收款金额：{{right.page1.g | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">货币：{{right.page1.h | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前应收款（RMB）：{{right.page1.i | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前已收款（RMB）：{{right.page1.j | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">最近账款到期时间：{{right.page1.k | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">未结订单数量：{{right.page1.l | filterNull}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="mgt10">未结订单列表：</el-col>
                  <el-col :span="24" class="order-list">
                    <el-row v-for="(item, index) in right.page1.m" :key="index">
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        模具号：{{item.a | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        客户PO.号：{{item.b | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        订单类型：{{item.c | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        订单状态：{{item.d | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        下单时间：{{item.e | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        发货时间：{{item.f | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        订单总价：{{item.g | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        交易货币：{{item.h | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        汇率：{{item.i | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        订单总价（RMB）：{{item.j | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        应收金额：{{item.k | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        已收金额：{{item.l | filterNull}}
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                        账款到期时间：{{item.m | filterNull}}
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="收款登记" :visible.sync="handle.update.dialogVisible" width="700px">
      <div v-loading="handle.update.isLoading">
        <el-form :model="handle.update.data" label-width="100px">
          <div class="dflex">
            <div class="flex">
              <el-form-item label="客户名称">
                {{handle.update.data.a | filterNull}}
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="客户PO.号">
                    <el-autocomplete
                      class="inline-input"
                      v-model="handle.update.data.b"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.aa, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入内容"
                      ></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="模具号">
                    <el-autocomplete
                      class="inline-input"
                      v-model="handle.update.data.c"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.aa, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入内容"
                      ></el-autocomplete>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-if="handle.update.data.d">
            <p class="mgb5">零件清单：</p>
            <div style="height: 200px; overflow: auto;" class="bor pd10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{handle.update.data.d.a | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单状态：{{handle.update.data.d.b | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">下单日期：{{handle.update.data.d.c | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：{{handle.update.data.d.d | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币种类：{{handle.update.data.d.e | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">汇率：{{handle.update.data.d.f | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价（RMB）：{{handle.update.data.d.g | filterNull}}</el-col>
              </el-row>
              <p>订单零件列表</p>
              <el-table :data="handle.update.data.d.h" border size="mini" style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column prop="a" label="零件号" width="100"></el-table-column>
                <el-table-column prop="b" label="客户编号" width="88"></el-table-column>
                <el-table-column prop="c" label="数量" width="88"></el-table-column>
                <el-table-column prop="d" label="单价"></el-table-column>
                <el-table-column prop="e" label="总价"></el-table-column>
                <el-table-column prop="f" label="下单日期"></el-table-column>
                <el-table-column prop="g" label="要求交期"></el-table-column>
                <el-table-column prop="h" label="说明"></el-table-column>
              </el-table>
              <div class="pdtb20">
                <p>订单说明：</p>
                <p>{{handle.update.data.d.i | filterNull}}</p>
              </div>
            </div>
          </div>
          <el-row class="mgt30 mgb0">
            <el-col :span="12">
              <el-form-item label="收款金额">
                <el-input v-model="handle.update.data.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款货币">
                <el-select v-model="handle.update.data.type">
                  <el-option label="模具零件" value="0"></el-option>
                  <el-option label="整体模具" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="剩余应收款">
                123456.00 欧元
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下次收款时间">
                <el-date-picker
                  v-model="handle.update.data.endDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="说明">
              <el-input type="textarea" v-model="handle.update.data.dsc"></el-input>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer tr">
          <el-button type="primary" @click="saveReceive">保存</el-button>
          <el-button @click="handle.update.dialogVisible = false">取 消</el-button>
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
        filter: {
          aa: [
            {
              codeName: '202',
              supplier: '202'
            }
          ],
        },
        handle: {
          update: {
            dialogVisible: false,
            isLoading: false,
            data: {

            }
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') {

        let params = {
          parameter: this.form.parameter,
          type: this.filter.selectedValue,
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
          sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`
        }
        
        this.getData(this.$utils.CONFIG.api.queryReceivables, params, 'mrSaleOrderId', loadingKey, this.getDetail);
      },
      getDetail() {

        let params = {

        };
        let mock = {
          a: 'XXXXXX公司',
          b: 'YYYYYY',
          c: '采购经理',
          d: '123123123123123',
          e: 'fasdfasdf@xxxxxxxx.com',
          f: '12301.00',
          g: '12301.00',
          h: '欧元',
          i: '86107.00元',
          j: '86107.00元',
          k: '2019.03.20',
          l: '8',
          m: [
            {
              a: 'M-1901',
              b: '12334567',
              c: '整体模具',
              d: '生产中',
              e: '2019.03.01',
              f: '2019.03.21',
              g: '12301.00',
              h: '欧元',
              i: '7.0',
              j: '12301.00',
              k: '12301.00',
              l: '12301.00',
              m: '2019.03.31' 
            },
            {
              a: 'M-1902',
              b: '12334567',
              c: '整体模具',
              d: '生产中',
              e: '2019.03.01',
              f: '2019.03.21',
              g: '12301.00',
              h: '欧元',
              i: '7.0',
              j: '12301.00',
              k: '12301.00',
              l: '12301.00',
              m: '2019.03.31' 
            },
            {
              a: 'M-1903',
              b: '12334567',
              c: '整体模具',
              d: '生产中',
              e: '2019.03.01',
              f: '2019.03.21',
              g: '12301.00',
              h: '欧元',
              i: '7.0',
              j: '12301.00',
              k: '12301.00',
              l: '12301.00',
              m: '2019.03.31' 
            }
          ]
        }

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page1 = res.data || [];
        }, () => this.right.isLoading = false, params, mock)
      },
      getReceiveDetail(item) {

        let params = {

        };
        let mock = {
          a: 'xxxxxxx公司',
          b: '',
          c: '',
          d: {
            a: '模具零件',
            b: '生产中',
            c: '2019.03.15',
            d: '12301.00',
            e: '欧元',
            f: '7.0',
            g: '12301.00',
            h: [
              {
                a: '172988',
                b: '',
                c: '3',
                d: '',
                e: '',
                f: '',
                g: '2019.3.15', 
                h: ''
              },
              {
                a: '832071',
                b: '',
                c: '3',
                d: '',
                e: '',
                f: '',
                g: '2019.3.15', 
                h: ''
              }
            ],
            i: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.'
          },
          e: '',
          f: '',
          g: '123456.00 欧元',
          h: '',
          i: ''
        }

        this.handle.update.dialogVisible = true;
        this.handle.update.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.update.isLoading = false;
          this.handle.update.data = res.data || [];
        }, () => this.handle.update.isLoading = false, params, mock)
      },
      saveReceive() {

        let params = {

        };
        
        this.handle.update.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.handle.update.isLoading = false;
          this.handle.update.dialogVisible = false;
        }, () => this.handle.update.isLoading = false, params)
      },
      handleSelect(item) {

        this.left.activeId = item.id;
        this.currentData = item;
        this.getDetail();
      },
      refresh() {}
    },
    created() {

      this.getLeftList();
    }
  };
</script>

<style scoped lang="scss">
  .order-list {
    .el-row {
      padding: 10px;
      margin-bottom: 0;
      &:nth-child(2n+1) {
        background: #f2f2f2;
      }
      &:nth-child(2n) {
        background: #d7d7d7;
      }
    }
  }
</style>