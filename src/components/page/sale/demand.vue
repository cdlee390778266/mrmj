<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：需求跟踪
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left">
        <div class="main-left-search pd10">
          <div class="mgb10">
            需求列表：
            <el-input v-model="search.form.text" style="width: 200px" prefix-icon="el-icon-search" @focus="search.isShowList = false" />
          </div>
          <div>
            <el-button type="primary" @click="handle.saleDemand.add.dialogVisible = true" style="width: 130px;">新增需求</el-button>
            <el-button type="primary" class="fr" @click="handle.saleDemand.plan.dialogVisible = true" style="width: 130px;">查看生产计划</el-button>
          </div>
        </div>
        <div class="list">
          <div class="list-item pd10 active" v-for="(item, index) in search.list" :key="index" v-show="search.isShowList">
            <div class="dflex">
              <div>
                <img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex">
                <p>{{ item.name }}</p>
                <p>客户PO号：{{ item.id }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">需求类型：{{ item.type }}</el-col>
              <el-col :span="12">交期：{{ item.endDate }}</el-col>
              <el-col :span="24">报价：{{ item.startDate }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="handle.saleDemand.add.dialogVisible = true">修改</a>
                <a href="javascript: void(0);" @click="handle.saleDemand.stop.dialogVisible = true">终止</a>
                <router-link to="/sale/detail">报价</router-link>
                <a href="javascript: void(0);" @click="handle.saleDemand.order.dialogVisible = true">下单</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!search.isShowList">
            <p class="pdtb10" v-for="(item, index) in search.filter.typeList" :key="index" @click="search.isShowList = true"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right">
        <page-wrapper @change="refresh">
          <div class="pdt10 mgt10">
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：XXXXXX公司</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：12312323123</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求编号：REQ1901</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求类型：模具零件</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求状态：已报价</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">已报总价：12301.00</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">报价货币：欧元</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求零件列表：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="current.spList"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="date" label="零件号" width="180"></el-table-column>
                    <el-table-column prop="name" label="客户编号" width="180"></el-table-column>
                    <el-table-column prop="address" label="需求数量"></el-table-column>
                    <el-table-column prop="d" label="要求交期"></el-table-column>
                    <el-table-column prop="address" label="说明"></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求附件：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="current.spList"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="date" label="附件名称"></el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="scope">
                        <a href style="color: #3375AB;">下载</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求说明：</el-col>
                <el-col
                  :span="24"
                >这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="新增客户需求" :visible.sync="handle.saleDemand.add.dialogVisible">
      <el-form :model="handle.saleDemand.add.form" label-width="100px">
        <div class="dflex">
          <div class="flex">
            <el-form-item label="客户">
              <el-input v-model="handle.saleDemand.add.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="需求类型">
                  <el-select v-model="handle.saleDemand.add.form.type">
                    <el-option label="模具零件" value="0"></el-option>
                    <el-option label="整体模具" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="需求编号">
                  <el-input v-model="handle.saleDemand.add.form.id" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            class="v-upload pdl10"
            :multiple="false"
            :limit="1"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div>
          <p>需求明细：</p>
          <el-table :data="handle.saleDemand.add.form.detailList" height="160" border size="mini" style="width: 100%">
            <el-table-column prop="date" label="零件号" width="100"></el-table-column>
            <el-table-column prop="name" label="数量" width="88"></el-table-column>
            <el-table-column prop="address" label="要求交期"></el-table-column>
            <el-table-column prop="address" label="说明"></el-table-column>
          </el-table>
        </div>
        <div>
          <p class="mgt20 mgb10">
            上传附件：
            <el-button type="primary" size="mini">选择上传文件</el-button>
          </p>
          <el-table
            :data="handle.saleDemand.add.form.enclosureList"
            height="160"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="date" label="上传文件"></el-table-column>
            <el-table-column prop="name" label="资料名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="需求编号" class="mgt20">
          <el-input type="textarea" v-model="handle.saleDemand.add.form.dsc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.saleDemand.add.dialogVisible = false">确 定</el-button>
        <el-button @click="handle.saleDemand.add.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看当前计划" :visible.sync="handle.saleDemand.plan.dialogVisible">
      <el-table
        :data="handle.saleDemand.plan.data"
        border
        size="mini"
        align="center"
        :span-method="objectSpanMethod"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="模具号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="下图日期"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="出货日期"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="客户"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="要求日期"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="状态"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="零件号码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="数量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="date"
          label="版本"
          width="100">
        </el-table-column>
        <el-table-column label="工艺时间">
          <el-table-column
            prop="province"
            label="M"
            width="100">
          </el-table-column>
          <el-table-column
            prop="city"
            label="H\WC"
            width="100">
          </el-table-column>
          <el-table-column
            prop="address"
            label="H\T"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="G"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="EDM"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="CNC"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="EDB"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="W/C"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="PL"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="ENG"
            width="100">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="other"
            width="100">
          </el-table-column>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handle.saleDemand.plan.dialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="终止原因" :visible.sync="handle.saleDemand.stop.dialogVisible">
      <el-form :model="handle.saleDemand.stop.form" label-width="100px">
        <el-form-item label="需求终止原因" class="mgt20">
          <el-input v-model="handle.saleDemand.stop.form.reason"></el-input>
        </el-form-item>
        <el-form-item label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.saleDemand.stop.form.dsc" class="v-textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.saleDemand.stop.dialogVisible = false">确 定</el-button>
        <el-button @click="handle.saleDemand.stop.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增模具零件订单" :visible.sync="handle.saleDemand.order.dialogVisible" width="700px">
      <el-form :model="handle.saleDemand.order.form" label-width="100px">
        <div class="dflex">
          <div class="flex">
            <el-form-item label="客户">
              <el-input v-model="handle.saleDemand.order.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="模具号">
              <el-input v-model="handle.saleDemand.order.form.id" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            class="v-upload pdl10"
            :multiple="false"
            :limit="1"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div>
          <p>零件清单：</p>
          <el-table
            :data="handle.saleDemand.order.form.detailList"
            height="160"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="date" label="零件号" width="100"></el-table-column>
            <el-table-column prop="name" label="数量" width="88"></el-table-column>
            <el-table-column prop="address" label="要求交期"></el-table-column>
            <el-table-column prop="address" label="单价"></el-table-column>
            <el-table-column prop="address" label="总价"></el-table-column>
            <el-table-column prop="address" label="说明"></el-table-column>
          </el-table>
        </div>
        <div>
          <div class="mgt20 mgb0 dflex el-form-item-mgb0" style="line-height: 32px;">
            <div class="flex">订单总价（RMB）：231323.00</div>
            <div class="flex">
              <el-form-item label="结算货币">
                <el-select v-model="handle.saleDemand.order.form.btype">
                  <el-option label="欧元" value="0"></el-option>
                  <el-option label="美元" value="1"></el-option>
                  <el-option label="日元" value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item label="结算货币总价">
                <el-input v-model="handle.saleDemand.order.form.total" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <p class="mgb10">
            上传附件：
            <el-button type="primary" size="mini">选择上传文件</el-button>
          </p>
          <el-table
            :data="handle.saleDemand.order.form.enclosureList"
            height="160"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="date" label="上传文件"></el-table-column>
            <el-table-column prop="name" label="资料名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.saleDemand.order.form.dsc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.saleDemand.order.dialogVisible = false">下达订单</el-button>
        <el-button type="primary" @click="handle.saleDemand.order.dialogVisible = false">存为草稿</el-button>
        <el-button @click="handle.saleDemand.order.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: localStorage.getItem("ms_username"),
        current: {
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
        },
        search: {
          isShowList: true,
          filter: {
            typeList: [
              {
                label: '按照客户名称搜索需求',
                value: '1',
              },
              {
                label: '按照模具号搜索需求',
                value: '2',
              },
              {
                label: '按照零件号搜索需求',
                value: '3',
              },
              {
                label: '按照需求说明内容搜索需求',
                value: '4',
              }
            ]
          },
          form: {
            text: '',
            type: ''
          },
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
              id: '125944',
              type: '模具零件',
              startDate: '2019.01.08',
              endDate: '2019.03.09'
            }
          ]
        },
        handle: {
          saleDemand: {
            add: {
              dialogVisible: false,
              form: {
                faceUrl: "",
                name: "",
                type: "0",
                id: "",
                dsc: "",
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
            },
            plan: {
              dialogVisible: false,
              data: [{
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              }, {
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              }, {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              }, {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              }, {
                date: '2016-05-08',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              }, {
                date: '2016-05-06',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              }, {
                date: '2016-05-07',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
              }]
            },
            stop: {
              dialogVisible: false,
              form: {
                reason: "",
                dsc: ""
              }
            },
            order: {
              dialogVisible: false,
              form: {
                faceUrl: "",
                name: "",
                type: "0",
                id: "",
                btype: "0",
                total: 1256,
                dsc: "",
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
              },
            }
          }
        }
      };
    },
    methods: {
      handlePictureCardPreview(file) {
        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) { //合并
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      del(index, row) {
        console.log(index, row);
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
  .main-left-search {
    button {
      width: 130px;
    }
  }
</style>