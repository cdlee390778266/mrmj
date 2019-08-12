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
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            需求列表：
            <el-input v-model="form.text" style="width: 200px" prefix-icon="el-icon-search" @focus="isShowList = false" />
          </div>
          <div>
            <el-button type="primary" @click="handle.add.dialogVisible = true" style="width: 130px;">新增需求</el-button>
            <el-button type="primary" class="fr" @click="handle.plan.dialogVisible = true" style="width: 130px;">查看生产计划</el-button>
          </div>
        </div>
        <div class="list" ref="list">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
              </div>
              </div>
              <div class="flex">
                <p>{{ (item.customer ? item.customer.name : '') | filterNull }}</p>
                <p>客户PO号：{{ item.customerPoNo | filterNull }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">需求类型：{{ item.reqTypeId | filterValueToLabel($dict.reqTypeValToLab) }}</el-col>
              <el-col :span="12">交期：{{ item.reqCompletionDate | filterNull }}</el-col>
              <el-col :span="24">报价：{{ item.totalPrice | filterNull }}{{ (item.currency ? item.currency.name : '') | filterNull }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="handle.add.dialogVisible = true">修改</a>
                <a href="javascript: void(0);" @click="handle.stop.dialogVisible = true">终止</a>
                <router-link to="/sale/detail">报价</router-link>
                <a href="javascript: void(0);" @click="handle.order.dialogVisible = true">下单</a>
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
      <div class="main-right">
        <page-wrapper @change="refresh" :haveCarousel="true">
          <div class="pdt10 mgt10">
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{ (currentData.customer ? currentData.customer.name : '') | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{ currentData.customerPoNo | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求编号：{{ currentData.requirementNum | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求类型：{{ currentData.reqTypeId | filterValueToLabel($dict.reqTypeValToLab) }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求状态：{{ currentData.reqStatusId | filterValueToLabel($dict.reqStatusValToLab) }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">已报总价：{{ currentData.totalPrice | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">报价货币：{{ (currentData.currency ? currentData.currency.name : '') | filterNull }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求零件列表：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="currentData.componentRequirements"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="componentNum" label="零件号" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerNo" label="客户编号" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="componentAmount" label="需求数量" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="completionDate" label="要求交期" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="remark" label="说明" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求附件：</el-col>
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
                >{{ currentData.remark | filterNull }}</el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="新增客户需求" :visible.sync="handle.add.dialogVisible">
      <el-form :model="handle.add.form" label-width="100px">
        <div class="dflex">
          <div class="flex">
            <el-form-item label="客户">
              <el-input v-model="handle.add.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="需求类型">
                  <el-select v-model="handle.add.form.type">
                    <el-option label="模具零件" value="0"></el-option>
                    <el-option label="整体模具" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="需求编号">
                  <el-input v-model="handle.add.form.id" auto-complete="off"></el-input>
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
          <el-table :data="handle.add.form.detailList" height="160" border size="mini" style="width: 100%">
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
            :data="handle.add.form.enclosureList"
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
          <el-input type="textarea" v-model="handle.add.form.dsc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.add.dialogVisible = false">确 定</el-button>
        <el-button @click="handle.add.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看当前计划" :visible.sync="handle.plan.dialogVisible">
      <el-table
        :data="handle.plan.data"
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
        <el-button @click="handle.plan.dialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="终止原因" :visible.sync="handle.stop.dialogVisible">
      <el-form :model="handle.stop.form" label-width="100px">
        <el-form-item label="需求终止原因" class="mgt20">
          <el-input v-model="handle.stop.form.reason"></el-input>
        </el-form-item>
        <el-form-item label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.stop.form.dsc" class="v-textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.stop.dialogVisible = false">确 定</el-button>
        <el-button @click="handle.stop.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增模具零件订单" :visible.sync="handle.order.dialogVisible" width="700px">
      <el-form :model="handle.order.form" label-width="100px">
        <div class="dflex">
          <div class="flex">
            <el-form-item label="客户">
              <el-input v-model="handle.order.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="模具号">
              <el-input v-model="handle.order.form.id" auto-complete="off"></el-input>
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
            :data="handle.order.form.detailList"
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
                <el-select v-model="handle.order.form.btype">
                  <el-option label="欧元" value="0"></el-option>
                  <el-option label="美元" value="1"></el-option>
                  <el-option label="日元" value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item label="结算货币总价">
                <el-input v-model="handle.order.form.total" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <p class="mgb10">
            上传附件：
            <el-button type="primary" size="mini">选择上传文件</el-button>
          </p>
          <el-table
            :data="handle.order.form.enclosureList"
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
          <el-input type="textarea" v-model="handle.order.form.dsc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.order.dialogVisible = false">下达订单</el-button>
        <el-button type="primary" @click="handle.order.dialogVisible = false">存为草稿</el-button>
        <el-button @click="handle.order.dialogVisible = false">取 消</el-button>
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
          activeIndex: 0,
          list: [
            {
              spList: [
                {
                  date: "2016-05-03",
                  name: "",
                  address: ""
                }
              ],
              enclosureList: [
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
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                }
              ],
              enclosureList: [
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
            },{
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
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                }
              ],
              enclosureList: [
                {
                  date: "2016-05-01",
                  name: "王小虎"
                }
              ]
            },
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        let params = {
          name: '',
          type: '',
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        }
        if(this.form.text) params.name = this.form.text;

        this.getData(this.$utils.CONFIG.api.queryRequirementDetail, params, 'id', loadingKey);
      },
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
    created() {
      this.getLeftList();
    }
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