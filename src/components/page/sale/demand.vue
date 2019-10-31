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
            <el-input v-model="left.form.parameter" style="width: 200px" prefix-icon="el-icon-search" @focus="isShowList = false" />
          </div>
          <div>
            <el-button type="primary" @click="handle.add.dialogVisible = true" style="width: 130px;">新增需求</el-button>
            <el-button type="primary" class="fr" @click="showPlanDialog" style="width: 130px;">查看生产计划</el-button>
          </div>
        </div>
        <div class="list" ref="list">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrRequirementId }" v-show="isShowList" @click="handleSelect(item, 'mrRequirementId', getDetail)">
            <div class="dflex">
              <div>
                <div>
                <img :src="item.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
              </div>
              </div>
              <div class="flex">
                <p>{{ item.name | filterNull }}</p>
                <p>客户PO号：{{ item.customerPoNo | filterNull }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">需求类型：{{ item.requirementTypeText }}</el-col>
              <el-col :span="12">交期：{{ item.requireDeliveryDateString | filterNull }}</el-col>
              <el-col :span="24">报价：{{ item.totalPrice | filterNull }}{{ (item.currencyName ? item.currencyName : '') | filterNull }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click.stop="handle.add.dialogVisible = true">修改</a>
                <a href="javascript: void(0);" @click.stop="showStopDialog(item)">终止</a>
                <router-link to="/sale/detail">报价</router-link>
                <a href="javascript: void(0);" @click.stop="handle.order.dialogVisible = true">下单</a>
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
        <page-wrapper @change="refresh" :haveCarousel="false">
          <div class="main-content-title">
            <div>
              <slot name="pageTitle"><i class="el-icon-lx-edit"></i> 模具零件需求信息</slot>
            </div>
          </div>
          <div class="pdt10 mgt10">
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{ right.page1.name | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{ right.page1.customerPoNo | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求编号：{{ right.page1.requirementNum | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求类型：{{ right.page1.requirementTypeText | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求状态：{{ right.page1.requirementStatusText | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">已报总价：{{ right.page1.totalPrice | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">报价货币：{{ right.page1.currencyName | filterNull }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求零件列表：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="right.page1.components"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="componentNo" label="零件号" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerNo" label="客户编号" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="quantity" label="需求数量" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deliveryDateString" label="要求交期" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="remark" label="说明" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求附件：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="right.page1.attachments"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip></el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="scope">
                        <a href="javascript:void(0);" style="color: #3375AB;" @click="down(scope.row.fileId)">下载</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求说明：</el-col>
                <el-col
                  :span="24"
                >{{ right.page1.remark | filterNull }}</el-col>
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
            max-height="160"
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
      <div v-loading="handle.plan.isLoading">
        <el-table
          :data="handle.plan.tableData"
          size="mini"
          style="width: 100%"
          class="edit-table"
          :highlight-current-row="true"
          :row-class-name="setRowClass">
          <el-table-column
            label="出货日期"
            width="120"
            label-class-name="fc-el-table-head"
            class-name="fc-red"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.shipmentDateString | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="mouldNo"
            sortable
            label="模具号"
            width="120"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.mouldNo | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="零件号码"
            min-width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}" >
                {{scope.row.components | concatString('componentNo')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            min-width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}" >
                {{scope.row.components | concatString('quantity')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="versionNo"
            label="版本"
            width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.versionNo | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="整体外协"
            width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{ 
                  scope.row.buy == 1 ? '是' : (
                     scope.row.buy == 0 ? '否' : ''
                  )
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工艺时间" align="center" min-width="100">
            <el-table-column
              v-for="(item, index) in allProcessOfIndex"
              :key="index"
              :label="item.name"
              align="center"
              min-width="70"
              label-class-name="fc-red"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div
                :class="{
                  'fc-red': scope.row[item.key] > maxWorkTime,
                  'bg00b0f0 fcfff': scope.row.currentPlanProcessId == scope.row[item.key+'-id'],
                  'bg-green fcfff': scope.row.nextPlanProcessId == scope.row[item.key+'-id'],
                  'bgffff00': scope.row.workpieceLocationId == scope.row[item.key+'-id']}"
                  v-if="scope.row[item.key] || scope.row[item.key] == 0"
                  >
                  {{scope.row[item.key]}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="qc"
              label="Else"
              align="center"
              min-width="70"
              label-class-name="fc-blue"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="requireCompletionDate"
            sortable
            label="要求交期"
            min-width="100"
            align="center"
            label-class-name="fc-el-table-head"
            class-name="fc-blue"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.requireCompletionDate | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="abbreviation"
            sortable
            label="客户"
            min-width="100"
            align="center"
            class-name="fc-blue"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.abbreviation | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="surplus"
            sortable
            label="交期剩余(天)"
            min-width="120"
            align="center"
            label-class-name="fc-el-table-head"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div :class="{fcfff: dateMinusBgColor(scope.row.surplus)}" :style="{background: dateMinusBgColor(scope.row.surplus)}"
              >
                {{scope.row.surplus}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="现状" class-name="fc800000" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{ scope.row.currentSituation }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="电极"
            min-width="100"
            align="center"
            label-class-name="fc-el-table-head"
            class-name="fc-blue"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.electrode | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="residueWorkTime"
            sortable
            label="剩余工时"
            min-width="100"
            align="center"
            label-class-name="fc-el-table-head"
            show-overflow-tooltip>
            <template scope="scope">
              <div :class="{'bgRed fcfff': scope.row.residueWorkTime > 200}" >{{scope.row.residueWorkTime | filterNull(' ')}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button @click="handle.plan.dialogVisible = false">关 闭</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="终止原因" :visible.sync="handle.stop.dialogVisible" width="500px">
      <el-form ref="stopForm" :model="handle.stop.form" :rules="handle.stop.rules" label-width="110px" v-loading="handle.stop.isLoading">
        <el-form-item prop="causeTypeText" label="需求终止原因" class="mgt20">
          <el-input v-model="handle.stop.form.causeTypeText"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.stop.form.description" class="v-textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="stop">确 定</el-button>
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
        left: {
          form: {
            parameter: ''
          }
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
            isLoading: false,
            tableData: []
          },
          stop: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {
              causeTypeText: "",
              description: ""
            },
            rules: {
              causeTypeText: [
                { required: true, message: this.$utils.getTipText('error', '-1085')},
              ]
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
          parameter: this.left.form.parameter,
          type: this.filter.selectedValue,
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
          //sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`
        }
        if(this.form.text) params.name = this.form.text;

        this.getData(this.$utils.CONFIG.api.queryRequirement, params, 'mrRequirementId', loadingKey, this.getDetail);
      },
      getDetail() {
        let params = {
          mrRequirementId: this.currentData.mrRequirementId
        };
        
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryRequirementDetail, (res) =>  {

          this.right.isLoading = false;
          this.right.page1 = res.data || {};
        }, () => this.right.isLoading = false, params)
      },
      showPlanDialog() {

        this.handle.plan.dialogVisible = true;
        if(!this.handle.plan.tableData.length) {

          this.getAllProcessOfIndex();
          this.getPlan();
        }
      },
      getPlan() { //获取订单列表

        let params = {

        };
        this.handle.plan.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPlanList, (res) =>  {

          this.handle.plan.isLoading = false;
          res.data && res.data.map(item => {

            item.surplus = this.dateMinus(item.requireCompletionDate);
            item.processes && item.processes.map(itemc => {

              if(itemc.name && !itemc.haveSort) {

                let processes = item.processes.filter(itemcc => itemcc.name == itemc.name);
                processes.sort(this.compare('processSequence'));
                
                processes.map((itemcc, index) => {

                  itemc.haveSort = true;
                  itemc.processesIndex = index + 1;
                  itemc.webName = `${itemcc.name}${itemcc.processesIndex}`;

                  item[`${this.procedurePrefix}-${itemcc.name}${itemcc.processesIndex}`] = itemcc.workTime;
                  item[`${this.procedurePrefix}-${itemcc.name}${itemcc.processesIndex}-id`] = itemcc.mrProductionPlanProcessId;
                })
                item.webProcesses = processes;
              }
            })
          })
          this.handle.plan.tableData = res.data || [];
        }, () => this.handle.plan.isLoading = false, params)
      },
      showStopDialog(item) {

        this.$refs.stopForm && this.$refs.stopForm.resetFields();
        this.handle.stop.dialogVisible = true;
        this.handle.stop.data = item;
      },
      stop() {
    
        this.$refs.stopForm.validate((valid) => {
          if (valid) {
            
            let params = {
              mrRequirementId: this.currentData.mrRequirementId,
              causeTypeText: this.handle.stop.form.causeTypeText,
              description: this.handle.stop.form.description
            };
            
            this.handle.stop.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.saveDemand, (res) =>  {

              this.handle.stop.isLoading = false;
              this.handle.stop.dialogVisible = false;
              this.$utils.showTip('success', 'success', '115');
              this.getLeftList();
            }, () => this.handle.stop.isLoading = false, params)
          } else {
            
            return false;
          }
        });
      },
      handlePictureCardPreview(file) {
        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
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