<template>
  <div>
    <div class="detail-main" style="top: 48px;bottom: 10px;" v-loading="isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg" style="width: 100%;">
            <div class="msg-wrapper">
              <el-button type="primary" @click="$router.push('/plan/edit/1')">制定作业计划</el-button>
              <el-button type="primary" @click="getOutGoods">发货</el-button>
              <el-button type="primary" @click="$router.push('/plan/stop')">终止/暂停/恢复生产</el-button>
              <span class="mgl20">
                工序估工时间超过
                <el-input v-model="maxWorkTime" style="width: 60px;" size="mini"></el-input>
                小时，进行标红提示
              </span>
            </div>
            <div class="mgt5 fs12 legend">
              表格图例说明：
              <span><i class="bg00B051"></i>下道工序</span>
              <span class="mgl20"><i class="bgffff00"></i>工件位置</span>
              <span class="mgl20"><i class="bg00b0f0"></i>正在加工</span>
              <span class="mgl20"><i class="bge46d0a"></i>暂停加工</span>
              <span class="mgl20"><i class="bg8db4e3"></i>工件完成</span>
            </div>
          </div>
          <div class="content">
            <div class="content-left" v-loading="left.isLoading">
              <el-table
                :data="tableData"
                size="mini"
                style="width: 100%"
                class="edit-table"
                :highlight-current-row="true"
                :row-class-name="setRowClass"
                @row-click="handleSelect">
                <el-table-column
                  label="出货日期"
                  width="120"
                  label-class-name="fc-el-table-head"
                  class-name="fc-red"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
                      {{scope.row.shipmentDate | filterNull(' ')}}
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
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                    <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}" @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                    <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}" @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                        @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row, scope.row[item.key+'-id'], true)">
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
                      <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row, '', true)">
                        <div @click="showInput(tableData, scope.$index, 'qcEdit')">
                          <div class="ellipsis">
                            {{scope.row.qc}}
                          </div>
                          <el-select
                            v-model="scope.row.qcSelect"
                            placeholder="请选择"
                            :style="{opacity: scope.row.qcEdit ? 1 : 0}"
                            @focus="showInput(tableData, scope.$index, 'qcEdit')"
                            @change="() => setQc(scope.row)">
                            <el-option label="请选择" value="">
                            </el-option>
                            <el-option label="QC" value="QC">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </template>
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
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                      @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)"
                    >
                      {{scope.row.surplus}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="现状" class-name="fc800000" min-width="180" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
                      <div @click="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)">
                        <div class="ecurrentSituationipsis">{{ scope.row.currentSituation }}</div>
                        <el-input size="mini" v-model="scope.row.currentSituationInput" @focus="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)" @blur="() => setCurrentSituation(scope.row)" :style="{opacity: scope.row.currentSituationEdit ? 1 : 0}"/>
                      </div>
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
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">
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
                    <div :class="{'bgRed fcfff': scope.row.residueWorkTime > 200}" @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row)">{{scope.row.residueWorkTime | filterNull(' ')}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="detail-footer">
            <div class="dflex" style="align-items: center;">
              <div class="pdlr10">模具号：{{selectedRow.mouldNo}}</div>
              <div class="pdlr10">零件号：{{selectedRow.components | concatString('componentNo')}}</div>
              <div class="pdl20">当前状态：</div>
              <div class="flex pdlr10">
                <table class="mrmj-table tc">
                  <thead>
                    <tr height="24">
                      <th></th>
                      <th v-for="(itemc, index) in selectedRow.processes" :key="index">{{itemc.name}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>状态</td>
                      <td v-for="(itemc, index) in selectedRow.processes" :key="index">{{itemc.statusDescription}}</td>
                    </tr>
                    <tr>
                      <td>估工工时</td>
                      <td v-for="(itemc, index) in selectedRow.processes" :key="index">{{itemc.estimationWorkTime}}</td>
                    </tr>
                    <tr>
                      <td>实际工时</td>
                      <td v-for="(itemc, index) in selectedRow.processes" :key="index">{{itemc.actualCompletionWorkTime}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="发货登记" class="dialog-gray" :visible.sync="handle.add.dialogVisible">
      <div v-loading="handle.add.isLoading">
        <el-form :model="handle.add.form" ref="form" label-width="100px">
          <el-row class="pdtb10 borb">
            <el-col :span="24">
              <p>请勾选完工零件确认发货。发货后，表示该零件生产完成，将不再在计划表和跟踪表中显示。</p>
              <p class="mgt5">已完工零件列表</p>
            </el-col>
          </el-row>
          <div class="dialog-content bgfff">
            <div class="mgb10 borb">
              <el-table
                :data="handle.add.tableData"
                max-height="400"
                style="width: 100%"
                 @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55"
                  fixed="left">
                </el-table-column>
                <el-table-column
                  prop="requireCompletionDate"
                  label="要求交期"
                  sortable
                  min-width="100"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="mouldNo"
                  label="模具号"
                  min-width="100"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  label="零件号码"
                  min-width="100"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.components | concatString('componentNo')}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="数量"
                  min-width="100"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.components | concatString('quantity')}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="abbreviation"
                  label="客户"
                  sortable
                  min-width="100"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="sendOutGoods">发货</el-button>
          <el-button type="primary" @click="handle.add.dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 右键 -->
    <right-menu v-bind={...rightMenu} @rightMenuHandle="handleTable" @hide="rightMenu.show = false"/>
  </div>
</template>

<script>
  import RightMenu from '../../common/rightMenu'
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    components: {
      RightMenu
    },
    data() {
      return {
        defaultPeopleImg: require('../../../assets/img/people.svg'),
        isLoading: false,
        maxWorkTime: this.$dict.maxWorkTime,
        procedurePrefix: 'procedure',
        allProcessOfIndex: [],
        tableData: [],
        rightMenu: {
          show: false,
          isProcesses: false,
          top: 0,
          left: 0,
          row: {}
        },
        selectedRow: {
          processes: []
        },
        handle: {
          add: {
            dialogVisible: false,
            isLoading: false,
            multipleSelection: [],
            tableData: [],
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: ""
            }
          }
        }
      }
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
          this.tableData = res.data || [];
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
      showRightMenu(e, row, processesId = '', isProcesses = false) {

        this.rightMenu.show = true;
        this.rightMenu.row = row;
        this.rightMenu.isProcesses = isProcesses;
        this.rightMenu.processesId = processesId;
        this.rightMenu.top = e.clientY + 'px';
        this.rightMenu.left = e.clientX + 'px';
      },
      setQc(row) { //设置Else

        row.qcEdit = false;
        this.rightMenu.row = row;
        this.handleTable('qc')
      },
      setCurrentSituation(row) { //设置现状

        row.currentSituationEdit = false;
        this.rightMenu.row = row;
        this.handleTable('currentSituation')
      },
      handleTable(type) { //操作表格交互

        let params = {
          mrProductionPlanTasksId: this.rightMenu.row.mrProductionPlanTasksId
        }

        switch(type) {
          case 'pos': //工件位置
            params.workpieceLocationId = this.rightMenu.processesId;
            break;
          case 'suspend': //暂停加工
            params.productionTasksStatus = 60;
            break;
          case 'stop': //终止
            params.productionTasksStatus = 70;
            break;
          case 'complete': //工件完成
            params.productionTasksStatus = 80;
            break;
          case 'qc': //Else列
            params.qc = this.rightMenu.row.qcSelect;
            break; 
          case 'currentSituation': //现状
            params.currentSituation = this.rightMenu.row.currentSituationInput;
            break;
        }

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.processTransferRegister, (res) =>  {

          this.isLoading = false;
          this.$utils.showTip('success', 'success', '117');

          this.rightMenu.row.productionTasksStatus = res.data.productionTasksStatus;
          this.rightMenu.row.productionTasksStatusText = res.data.productionTasksStatusText;

          switch(type) {

            case 'pos': //工件位置

              this.rightMenu.row.currentPlanProcessId = res.data.currentPlanProcessId;
              this.rightMenu.row.nextPlanProcessId = res.data.nextPlanProcessId
              this.rightMenu.row.workpieceLocationId = res.data.workpieceLocationId
              break;
            case 'suspend': //暂停加工
              
              break;
            case 'stop': //终止成功后删除
              this.tableData = this.tableData.filter(item => item.mrProductionPlanTasksId != this.rightMenu.row.mrProductionPlanTasksId)
              break;
            case 'complete': //工件完成
              
              break;
            case 'qc': //Else
              this.rightMenu.row.qc = this.rightMenu.row.qcSelect;
              break;
            case 'currentSituation': //现状
              this.rightMenu.row.currentSituation = this.rightMenu.row.currentSituationInput;
              break;
          }
        }, () => {

          this.isLoading = false
          this.$utils.showTip('error', 'error', '-3');
        }, params)
      },
      handleSelect(row, event, column) {
        
        this.selectedRow = row || {processes: []};
      },
      handleSelectionChange(val) {

        this.handle.add.multipleSelection = val;
      },
      getOutGoods() { //获取可发货列表

        let params = {
          type: 2
        };

        this.handle.add.multipleSelection = [];
        this.handle.add.isLoading = true;
        this.handle.add.dialogVisible = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPlanList, (res) =>  {

          this.handle.add.isLoading = false;
          this.handle.add.tableData = res.data || [];
        }, () => this.handle.add.isLoading = false, params)
      },
      sendOutGoods() { //发货

        let params = [];
        if(!this.handle.add.multipleSelection.length) {

          this.$utils.showTip('warning', 'error', '-1078');
          return;
        }

        this.handle.add.multipleSelection.map(item => {

          params.push(item.mrProductionPlanTasksId)
        })

        this.handle.add.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.sendOutGoods, (res) =>  {

          this.handle.add.isLoading = false;
          this.handle.add.dialogVisible = false;
          this.$utils.showTip('success', 'success', '118');
        }, () =>  this.handle.add.isLoading = false, params)
      },
      refresh() {

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
  .main {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: none;
    box-shadow: none;
    .legend {
      span {
        i {
          position: relative;
          top: 2px;
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 2px;
        }
      }
    }
    .content {
      position: absolute;
      top: 40px;
      right: 0;
      bottom: 0px;
      left: 0;
      height: auto;
      visibility: visible;
      .content-left {
        position: absolute;
        top: 24px;
        right: 0px;
        bottom: 115px;
        left: 0;
        padding: 20px 10px;
        width: auto !important;
        overflow: auto;
      }
    }
    .detail-footer {
      border: none;
    }
    .mrmj-table {
      border-color: #333;
      td, th {
        border-color: #333;
      }
    }
  }

  .setting-item {
    margin-bottom: 10px;
    h3 {
      position: absolute;
      top: -10px;
      font-size: 14px;
      font-weight: normal;
      background: #f2f2f2;
    }
    padding: 10px;
    border: 1px solid #ddd;
  }
</style>