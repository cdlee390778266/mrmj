<template>
  <div v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：跟踪生产进度->制定作业计划
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="">
      <span>作业计划日期：</span>
      <el-date-picker
        v-model="operationalPlanDate"
        type="date"
        size="mini"
        :picker-options="pickerOptions"
        placeholder="年/月/日">
      </el-date-picker>
      <el-button type="text" class="mgl10 pointer" @click="showPlan">查询已制定作业计划</el-button>
    </div>
    <div class="v-tabs mgt10">
      <span class="v-tab" :class="{'active': activeTab == 'step1'}" @click="activeTab = 'step1'">第1步 选择作业零件</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'step2'}"
        @click="activeTab = 'step2'"
      >第2步 制定工序作业计划</span>
    </div>
    <div class="detail-main" style="top: 153px;">
      <div class="step1 hide mgt20 mgl20" :class="{'show': activeTab == 'step1'}">
        <div class="pdlr10">
          <p>
            开展生产零件选择列表（当前尚未完成工序的零件，默认继续开展生产，自动勾选）
          </p>
          <div class="posFull" style="top: 30px; bottom: 66px;">
            <el-table
                ref="step1"
                :data="tabs.step1.tableData"
                size="mini"
                style="width: 100%"
                :highlight-current-row="true"
                :row-class-name="setRowClass"
                class="edit-table"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55"
                  align="center"
                  fixed="left">
                </el-table-column>
                <el-table-column
                  prop="releaseProductionOrderDate"
                  sortable
                  label="下图日期"
                  width="100"
                  label-class-name="fc-el-table-head"
                  class-name="notEdit fc-blue"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="shipmentDateString"
                  sortable
                  label="出货日期"
                  width="100"
                  label-class-name="fc-el-table-head"
                  class-name="notEdit fc-red"
                  show-overflow-tooltip>
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
                    <div>
                      {{scope.row.requireCompletionDate | filterNull(' ')}}
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
                    <div :class="{fcfff: dateMinusBgColor(scope.row.surplus)}" :style="{background: dateMinusBgColor(scope.row.surplus)}">
                      {{scope.row.surplus}}
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
                    <div :class="{'bgRed fcfff': scope.row.residueWorkTime > 200}">{{scope.row.residueWorkTime | filterNull(' ')}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mouldNo"
                  sortable
                  label="模具号"
                  width="120"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
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
                    <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}">
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
                    <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}">
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
                    <div>
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
                    <div>
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
                    :prop="item.key"
                    sortable
                    align="center"
                    min-width="100"
                    label-class-name="fc-red"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div
                      :class="{
                        'fc-red': scope.row[item.key] > maxWorkTime,
                        'bg00b0f0 fcfff': scope.row.currentPlanProcessId == scope.row[item.key+'-id'],
                        'bg-green fcfff': scope.row.nextPlanProcessId == scope.row[item.key+'-id'],
                        'bgffff00': scope.row.workpieceLocationId == scope.row[item.key+'-id']}"
                        v-if="scope.row[item.key] || scope.row[item.key] == 0">
                        {{scope.row[item.key]}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Else"
                    align="center"
                    min-width="70"
                    label-class-name="fc-blue"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.qc}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="客户"
                  min-width="100"
                  align="center"
                  class-name="fc-blue"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      {{scope.row.abbreviation | filterNull(' ')}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="现状" class-name="fc800000" min-width="180" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.currentSituation }}
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
                    <div>
                      {{scope.row.electrode | filterNull(' ')}}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
          </div>
          <div class="detail-footer" style="border-top: none;">
            <div class="dflex" style="align-items: center;">
              <div class="pdl20">所选零件工时统计：</div>
              <div class="flex pdlr10">
                <table class="mrmj-table tc">
                  <thead>
                    <tr>
                      <th v-for="(itemc, key) in tabs.step1.multipleSelectionProcesses" :key="key" class="bge4e4e4">{{key}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td v-for="(itemc, key) in tabs.step1.multipleSelectionProcesses" :key="key">{{itemc.workTime}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="step2 hide rel" :class="{'show': activeTab == 'step2'}">
				<div class="step2-content">
          <div class="content">
            <h5 class="content-left-title" style="background: #fff">选择工序</h5>
            <div class="content-left">
              <div class="list">
                <div class="list-body">
                  <div class="dflex pd10" :class="{active: tabs.step2.left.activeId == key}" style="align-items: center;" v-for="(item, key) in tabs.step2.left.processes" :key="key" @click="handleSelectProcesses(key)">
                    <img :src="defaultImg" width="32">
                    <div class="flex pdl10">
                      工序：{{key}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title" style="background: #fff">制定所选工序作业计划</h5>
            <div class="content-right">
              <h3 class="tc pdtb10">工序G作业计划</h3>
              <div>
                <img :src="img1" width="22" class="pointer" @click="remove">
                <img :src="img2" width="22" class="mgl10 pointer" @click="moveUp">
                <img :src="img3" width="22" class="mgl10 pointer" @click="moveDown">
                <span class="mgl20">作业计划调整（选择某条记录，点击移出、上移、下移按钮进行操作）</span>
              </div>
              <div class="posFull" style="top: 90px; bottom: 74px;">
                <el-table
                  :data="tabs.step2.right.tableData"
                  border
                  size="mini"
                  style="width: 100%;"
                  class="edit-table"
                  :highlight-current-row="true"
                  @row-click="handleSelect">
                  <el-table-column type="index" label="序号" width="50"></el-table-column>
                  <el-table-column prop="processesName" label="工序" width="100" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="mouldNo" label="模具号" width="100" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column label="零件号" min-width="100" class-name="notEdit" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.components | concatString('componentNo')}}
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" min-width="100" class-name="notEdit" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.components | concatString('quantity', '+')}}
                    </template>
                  </el-table-column>
                  <el-table-column label="内容" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>
                        <div @click="showInput(tabs.step2.right.tableData, scope.$index, 'operationalStatusTextEdit', {}, false)">
                          <div class="ellipsis">
                            {{scope.row.operationalStatusText}}
                          </div>
                          <el-select
                            v-model="scope.row.operationalStatusText"
                            placeholder="请选择"
                            :style="{opacity: scope.row.operationalStatusTextEdit ? 1 : 0}"
                            @focus="showInput(tabs.step2.right.tableData, scope.$index, 'operationalStatusTextEdit', {}, false)"
                            @blur="scope.row.operationalStatusTextEdit = false">
                            <el-option label="加工" value="加工">
                            </el-option>
                            <el-option label="备加工" value="备加工">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="estimationWorkTime" label="估工工时" width="100" align="center" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="electrode" label="电极" align="center" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column label="开始日期" align="center" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>
                        <div @click="showInput(tabs.step2.right.tableData, scope.$index, 'startDateStringEdit', {}, false)">
                          <div class="ellipsis tc">{{ scope.row.startDateString }}</div>
                          <el-date-picker
                            type="date"
                            size="mini"
                            placeholder="选择日期"
                            :clearable="false"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="scope.row.startDateString"
                            @focus="showInput(tabs.step2.right.tableData, scope.$index, 'startDateStringEdit', {}, false)"
                            @blur="scope.row.startDateStringEdit = false"
                            :style="{opacity: scope.row.startDateStringEdit ? 1 : 0}">
                          </el-date-picker>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="要求完成日期" width="120" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>
                        <div @click="showInput(tabs.step2.right.tableData, scope.$index, 'requireCompletionDateEdit', {}, false)">
                          <div class="ellipsis tc">{{ scope.row.requireCompletionDate }}</div>
                          <el-date-picker
                            type="date"
                            size="mini"
                            placeholder="选择日期"
                            :clearable="false"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="scope.row.requireCompletionDate"
                            @focus="showInput(tabs.step2.right.tableData, scope.$index, 'requireCompletionDateEdit', {}, false)"
                            @blur="scope.row.requireCompletionDateEdit = false"
                            :style="{opacity: scope.row.requireCompletionDateEdit ? 1 : 0}">
                          </el-date-picker>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="加工人" class-name="notEdit" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.people | concatString('userName', ',')}}
                    </template>
                  </el-table-column>
                  <el-table-column label="备注"  show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>
                        <div @click="showInput(tabs.step2.right.tableData, scope.$index, 'remarkEdit', {}, false)">
                          <div class="eremarkipsis">{{ scope.row.remark }}</div>
                          <el-input size="mini" v-model="scope.row.remark" @focus="showInput(tabs.step2.right.tableData, scope.$index, 'remarkEdit', {}, false)" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="detail-footer" style="border-top: none;">
                <div class="dflex" style="align-items: center;">
                  <div class="pdlr10">模具号：{{tabs.step2.right.selectedRow.mouldNo}}</div>
                  <div class="pdlr10">零件号：{{tabs.step2.right.selectedRow.components | concatString('componentNo')}}</div>
                  <div class="pdl20">当前状态：</div>
                  <div class="flex pdlr10">
                    <table class="mrmj-table tc">
                      <thead>
                        <tr>
                          <th v-for="(itemc, index) in tabs.step2.right.selectedRow.processes" :key="index" class="bge4e4e4">{{itemc.name}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                           <td v-for="(itemc, index) in tabs.step2.right.selectedRow.processes" :key="index">{{itemc.workTime}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
				</div>
			</div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保 存</el-button>
    </div>

    <el-dialog title="查看历史作业计划" class="dialog-gray" :visible.sync="handle.plan.dialogVisible">
      <div class="step2 rel show" style="height: 400px;" v-loading="handle.plan.isLoading">
        <div class="step2-content">
          <div class="pdtb10">
            <span>查询日期：</span>
            <el-date-picker
              v-model="handle.plan.form.date"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              @change="showPlan">
            </el-date-picker>
          </div>
          <div class="content" style="top: 50px; bottom: 60px;">
            <h5 class="content-left-title">选择工序</h5>
            <div class="content-left">
              <div class="list">
                <div class="list-body">
                  <div class="dflex pd10" :class="{active: handle.plan.activeId == index}" style="align-items: center;" v-for="(item, index) in handle.plan.list" :key="index" @click="handleSelectPlanProcesses(index)">
                    <img :src="defaultImg" width="32">
                    <div class="flex pdl10">
                      工序：{{item.name}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title">制定所选工序作业计划</h5>
            <div class="content-right">
              <div class="posFull" style="top: 20px;">
                <el-table
                  :data="handle.plan.selectedRow.planProcesses"
                  border
                  size="mini"
                  height="256px"
                  style="width: 100%;"
                  :highlight-current-row="true">
                  <el-table-column type="index" label="序号" width="50"></el-table-column>
                  <el-table-column prop="name" label="工序" width="100" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="mouldNo" label="模具号" width="100" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column label="零件号" min-width="100" class-name="notEdit" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.components | concatString('componentNo')}}
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" min-width="100" class-name="notEdit" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.components | concatString('quantity', '+')}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="operationalStatusText" label="内容" width="100" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="estimationWorkTime" label="估工工时" width="100" align="center" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="electrode" label="电极" align="center" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="startDateString" label="开始日期" align="center" width="100" class-name="notEdit" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="requireCompletionDateString" label="要求完成日期" width="120" align="center" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="加工人" class-name="notEdit" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.people | concatString('userName', ',')}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注"  show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="detail-footer tr" style="border-top: none;">
            <el-button type="primary" class="mgb5" @click="handle.plan.dialogVisible = false">关闭</el-button>
          </div>
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
        isLoading: false,
        activeTab: "step1",
        defaultImg: require('../../../assets/img/wp.svg'),
        img1: require('../../../assets/img/img2.svg'),
        img2: require('../../../assets/img/img3.svg'),
        img3: require('../../../assets/img/img4.svg'),
        maxWorkTime: this.$dict.maxWorkTime,
        procedurePrefix: 'procedure',
        allProcessOfIndex: [],
        operationalPlanDate: new Date(),
        pickerOptions: { // 限制派工时间不让选择今天以前的
        　　disabledDate(time) {
        　　　　return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        　　}
        },
        tabs: {
          step1: {
            form: {
              type: ''
            },
            multipleSelection: [],
            multipleSelectionProcesses: {},
            tableData: []
          },
          step2: {
            left: {
              activeId: '',
              processes: {}
            },
            right: {
              selectedRow: {},
              tableData: []
            }
          }
        },
        handle: {
          plan: {
            dialogVisible: false,
            isLoading: false,
            activeId: 0,
            selectedRow: {},
            list: [],
            tableData: [],
            form: {
              date: ''
            }
          }
        }
      };
    },
    methods: {
      compare(propertyName) { //对象排序比较器

        return function(object1, object2) {

          var value1 = object1[propertyName];
          var value2 = object2[propertyName];
          if (value2 < value1) {

            return 1;
          } else if (value2 > value1) {

            return -1;
          } else {

            return 0;
          }
        }
      },
      dateMinus(dateString) { //交期剩余天数

        let t1 = new Date(dateString).getTime();
        let t0 = new Date().getTime();
  
        return parseInt((t1 - t0) / (1000 * 60 * 60 * 24))
      },
      getAllProcessOfIndex() {  //获取工序列表

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.getAllProcessOfIndex, (res) =>  {

          this.isLoading = false;
          let allProcessOfIndex = [];
          if(res.data.length) {

            res.data.map(item => {

              if(item.max > 1) {

                for(let i = 1; i <= item.max; i++) {

                  let newItem = Object.assign({}, item);
                  newItem.name = `${newItem.name}${i}`;
                  newItem.key = `${this.procedurePrefix}-${newItem.name}`;
                  newItem.index = i;
                  allProcessOfIndex.push(newItem);
                }
              }else if(item.max == 1) {

                item.key = `${this.procedurePrefix}-${item.name}1`;
                allProcessOfIndex.push(item);
              }
            })
          }
          this.allProcessOfIndex = allProcessOfIndex;
        }, () => this.isLoading = false)
      },
      getData() { //获取订单列表

        let params = {
        };
        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPlanList, (res) =>  {

          this.isLoading = false;
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
          this.tabs.step1.tableData = res.data || [];
          this.$nextTick(() => {  //全选

            this.tabs.step1.tableData.map(row => {

              row.isSelected && this.$refs.step1.toggleRowSelection(row);
            })
          })
        }, () => this.isLoading = false, params)
      },
      setRowClass(row) {

        let rowClass = '';

        if(row.row.productionTasksStatus == 60) { //暂停加工

          rowClass = 'rowTermination'
        }else if(row.row.productionTasksStatus == 80) {
          
          rowClass = 'rowSuspend';
        }

        return rowClass
      },
      handleSelectionChange(val) {
        
        this.tabs.step1.multipleSelection = this.$utils.deepCopy(val);
        let processes = [];
        this.tabs.step1.multipleSelection.map(item => {

          processes = processes.concat(item.processes);
        })
       
        this.tabs.step1.multipleSelectionProcesses = {};
        processes.map(item => {
         
          if(this.tabs.step1.multipleSelectionProcesses[item.name]) {

            this.tabs.step1.multipleSelectionProcesses[item.name].workTime += item.workTime;
          }else {

            this.tabs.step1.multipleSelectionProcesses[item.name] = item;
          }
        })

        this.tabs.step2.left.processes = this.tabs.step1.multipleSelectionProcesses;

        let haveSetActive = false;
        for(let key in this.tabs.step2.left.processes) {
          if(!haveSetActive) {
            haveSetActive = true;
            this.handleSelectProcesses(key);
            break;
          }
        }
      },
      handleSelectProcesses(key) {

        this.tabs.step2.left.activeId = key;
        this.tabs.step2.right.tableData = [];
        this.tabs.step2.right.selectedRow = {};

        this.tabs.step1.multipleSelection.map(item => {
          
          let index = 0;
          if(item.processes && item.processes.length) {

            let nameHaveNumber = false;
            if((item.processes.filter(itemc => itemc.name == key)).length > 1) nameHaveNumber = true;
            item.processes.map((itemc) => {

              if(itemc.name == key) {

                let obj = this.$utils.deepCopy(item);
                index++;
                obj.processesName = nameHaveNumber ? `${itemc.name}${index}` : itemc.name;
                obj.mrProductionPlanProcessId = itemc.mrProductionPlanProcessId;
                obj.operationalStatusText = itemc.content ? itemc.content : '加工';
                obj.requireCompletionDate = itemc.requireCompletionDateString ? itemc.requireCompletionDateString : (new Date().Format('yyyy-MM-dd'));
                obj.estimationWorkTime = itemc.estimationWorkTime;
                this.tabs.step2.right.tableData.push(obj);
              }
            })
          }
        })
      },
      handleSelect(row, event, column) {
        
        this.tabs.step2.right.selectedRow = row;
      },
      getSelectRowIndex() {

        if(!this.tabs.step2.right.selectedRow.processesName) return -1;

        let index = this.tabs.step2.right.tableData.findIndex(item => this.tabs.step2.right.selectedRow.mrProductionPlanProcessId == item.mrProductionPlanProcessId);

        return index;
      },
      remove() {  //删除

        let index = this.getSelectRowIndex();
        if(index == -1) return;

        this.tabs.step2.right.tableData.splice(index, 1);
        this.tabs.step2.right.selectedRow = {};
      },
      moveUp() {  //上移

        let index = this.getSelectRowIndex();
        if(index == -1) return;

        if (index > 0) {
          let upDate = this.tabs.step2.right.tableData[index - 1];
          this.tabs.step2.right.tableData.splice(index - 1, 1);
          this.tabs.step2.right.tableData.splice(index,0, upDate);
        }
      },
      moveDown() {  //下移

        let index = this.getSelectRowIndex();
        if(index == -1) return;

        if ((index + 1) !== this.tabs.step2.right.tableData.length){
          
          let downDate = this.tabs.step2.right.tableData[index + 1];
          this.tabs.step2.right.tableData.splice(index + 1, 1);
          this.tabs.step2.right.tableData.splice(index,0, downDate);
        }
      },
      saveSelectedTask() { //保存勾选的任务

        let params = [];

        this.tabs.step1.multipleSelection.map(item => params.push(item.mrProductionPlanTasksId))

        this.$utils.getJson(this.$utils.CONFIG.api.saveSelectedTask, (res) => {}, null, params)
      },
      save() {

        if(!this.tabs.step2.right.tableData.length) {

          this.$utils.showTip('warning', 'error', '-1079');
          return;
        }

        this.saveSelectedTask();

        let params = [];
        this.tabs.step2.right.tableData.map((item, index) => {

          params.push({
            operationSequence: index + 1,
            productionPlanProcessId: item.mrProductionPlanProcessId,
            operationalStatusText: item.operationalStatusText,
            operationalPlanDate: this.operationalPlanDate,
            startDate: item.startDateString,
            requireCompletionDate: item.requireCompletionDate,
            remark: item.remark
          })
        })

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.makeOperationPlan, (res) =>  {

          this.isLoading = false;
          this.$utils.showTip('success', 'success', '102');
        }, () => this.isLoading = false, params)
      },
      showPlan() {

        let params = {
          operationalPlanDate: this.handle.plan.form.date
        }

        this.handle.plan.dialogVisible = true;
        this.handle.plan.list = [];
        this.handle.plan.selectedRow = {};

        this.handle.plan.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPlanProcess, (res) => {

          this.handle.plan.isLoading = false;
          this.handle.plan.list = res.data || [];

          if(this.handle.plan.list && this.handle.plan.list.length) {
            this.handle.plan.activeId = 0;
            this.handle.plan.selectedRow = this.handle.plan.list[0];
          }
        }, () => this.handle.plan.isLoading = false, params)
      },
      handleSelectPlanProcesses(key) {
        
        this.handle.plan.activeId = key;
        this.handle.plan.selectedRow = this.handle.plan.list[key];
      }
    },
    computed: {
      dateMinusBgColor() { //交期剩余天数颜色

        return function(time) {

          let bgColor = '';

          if(time > 10) {

            bgColor = '#0070c0'
          }else if(time >= 5) {

            bgColor = '#ffff00'
          }else if(time >= 0) {

            bgColor = '#ffc000'
          }else if(time < 0) {

            bgColor = '#ff0000'
          }
    
          return bgColor
        }
      }
    },
    created() {

      this.getAllProcessOfIndex();
      this.getData();
    }
  };
</script>


<style scoped lang="scss">
	.v-tab {
    width: 50%;
  }
  .content {
    position: absolute;
    top: 20px;
    right: 0;
    bottom: 0px;
    left: 0;
    height: auto;
    visibility: visible;
    .content-left-title {
      position: absolute;
      top: 0px;
      left: 10px;
      font-weight: normal;
      font-size: 14px;
      background: #f2f2f2;
      z-index: 8;
    }
    .content-left {
      position: absolute;
      top: 10px;
      bottom: 0;
      left: 0;
      width: 210px;
      overflow: auto;
      border: 1px solid #ddd;
      .list {
        .list-head {
          position: absolute;
          top: 60px;
          right: 0;
          left: 0;
          background: rgba(228, 228, 228, 1);
          & > div {
            border-right: 1px solid #ddd;
          }
        }
        .list-body {
          position: absolute;
          top: 15px;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: auto;
          .dflex{
            cursor: pointer;
            &:hover, &.active {
              background: #e8e8e8;
            }
          }
          .flex {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .content-right-title {
      position: absolute;
      top: 0px;
      left: 230px;
      font-weight: normal;
      font-size: 14px;
      background: #f2f2f2;
      z-index: 8;
    }
    .content-right {
      position: absolute;
      top: 10px;
      bottom: 0;
      left: 220px;
      right: 0;
      padding: 10px;
      overflow: auto;
      border: 1px solid #ddd;
      p {
        margin-bottom: 10px;
      }
    }
  }
</style>
