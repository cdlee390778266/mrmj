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
      <div class="main-left">
        <div class="main-left-search pd10">
          <div class="mgb10">
            代收款客户：
            <el-input v-model="form.text" style="width: 190px" prefix-icon="el-icon-search" @focus="isShowList = false" />
          </div>
        </div>
        <div class="list" style="top: 64px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex">
                <p>{{ item.id }}</p>
                <p>待收款：23413.00 欧元</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">未结订单数：2</el-col>
              <el-col :span="12">账款到期：666</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="handle.update.dialogVisible = true">收款登记</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right">
        <page-wrapper @change="refresh">
          <template #pageName>
            应收款明细
          </template>
          <template #pageTitle>
            <i class="el-icon-lx-edit"></i> 应收款项信息
          </template>
          <div class="pdt10 mgt10">
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：XXXXXX公司</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：12312323123</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：REQ1901</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：模具零件</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：已报价</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前应收款：12301.00</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">已收款金额：欧元</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">货币：欧元</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前应收款（RMB）：欧元</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前已收款（RMB）：欧元</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">最近账款到期时间：欧元</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">未结订单数量：欧元</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">未结订单列表：</el-col>
                <el-col :span="24" class="order-list">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      模具号：M-1903
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      客户PO.号：12334567
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单类型：整体模具
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单状态：生产中
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      下单时间：2019.03.01
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      发货时间：2019.03.21
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单总价：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      交易货币：欧元
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      汇率：7.0
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单总价（RMB）：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      应收金额：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      已收金额：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      账款到期时间：2019.03.3
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      模具号：M-1903
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      客户PO.号：12334567
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单类型：整体模具
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单状态：生产中
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      下单时间：2019.03.01
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      发货时间：2019.03.21
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单总价：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      交易货币：欧元
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      汇率：7.0
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单总价（RMB）：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      应收金额：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      已收金额：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      账款到期时间：2019.03.3
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      模具号：M-1903
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      客户PO.号：12334567
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单类型：整体模具
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单状态：生产中
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      下单时间：2019.03.01
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      发货时间：2019.03.21
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单总价：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      交易货币：欧元
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      汇率：7.0
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      订单总价（RMB）：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      应收金额：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      已收金额：12301.00
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      账款到期时间：2019.03.3
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="收款登记" :visible.sync="handle.update.dialogVisible" width="700px" v-dialogDrag>
      <el-form :model="handle.update.form" label-width="100px">
        <div class="dflex mgt20">
          <div class="flex">
            <el-form-item label="客户名称">
              xxxxxxx公司
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户PO.号">
                  <el-input v-model="handle.update.form.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模具号">
                  <el-input v-model="handle.update.form.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div>
          <p>零件清单：</p>
          <el-scrollbar style="height: 200px;" class="bor pd10">
            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：模具零件</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单状态：生产中</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">下单日期：2019.03.15</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：12301.00</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币种类：欧元</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">汇率：7.0</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价（RMB）：12301.00</el-col>
            </el-row>
            <p>订单零件列表</p>
            <el-table :data="handle.update.form.detailList" border size="mini" style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column prop="date" label="零件号" width="100"></el-table-column>
              <el-table-column prop="name" label="客户编号" width="88"></el-table-column>
              <el-table-column prop="name" label="数量" width="88"></el-table-column>
              <el-table-column prop="address" label="单价"></el-table-column>
              <el-table-column prop="address" label="总价"></el-table-column>
              <el-table-column prop="address" label="下单日期"></el-table-column>
              <el-table-column prop="address" label="要求交期"></el-table-column>
              <el-table-column prop="address" label="说明"></el-table-column>
            </el-table>
            <div class="pdtb20">
              订单说明：<br>
              这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
            </div>
          </el-scrollbar>
        </div>
        <el-row class="mgt30 mgb0">
          <el-col :span="12">
            <el-form-item label="收款金额">
              <el-input v-model="handle.update.form.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款货币">
              <el-select v-model="handle.update.form.type">
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
                v-model="handle.update.form.endDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
          <el-form-item label="说明">
            <el-input type="textarea" v-model="handle.update.form.dsc"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.update.dialogVisible = false">保存</el-button>
        <el-button @click="handle.update.dialogVisible = false">取 消</el-button>
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
        name: localStorage.getItem("ms_username"),
        left: {
          activeId: 125944,
          list: [
            {
              name: 'dddddddd',
              id: '125944',
              type: '模具零件',
              startDate: '2019.01.08',
              endDate: '2019.03.09'
            },
            {
              name: 'dddddddd',
              id: '1259445',
              type: '模具零件',
              startDate: '2019.01.08',
              endDate: '2019.03.09'
            }
          ]
        },
        right: {
          activeIndex: 0,
          list: [
            {
              spList: [
                {
                  date: "172988",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-04",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-01",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-03",
                  name: "",
                  address: ""
                }
              ],
              enclosureList: [
                {
                  date: "172988",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-04",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-01",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-03",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                }
              ]
            }
          ]
        },
        handle: {
          update: {
            dialogVisible: false,
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: "",
              endDate: '',
              detailList: [
                {
                  date: "2016-05-03",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-02",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-04",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                }
              ],
              enclosureList: [
                {
                  date: "2016-05-03",
                  name: "王小虎"
                },
                {
                  date: "2016-05-02",
                  name: "王小虎"
                },
                {
                  date: "2016-05-04",
                  name: "王小虎"
                },
                {
                  date: "2016-05-01",
                  name: "王小虎"
                }
              ]
            }
          }
        }
      };
    },
    methods: {
      handleSelect(item) {
        this.left.activeId = item.id;
      },
      refresh() {}
    },
    created() {}
  };
</script>


<style scoped lang="scss">
  .el-row {
    margin-bottom: 20px;
  }
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