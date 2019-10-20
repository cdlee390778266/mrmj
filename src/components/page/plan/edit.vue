<template>
  <div>
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
        v-model="right.page1.date"
        type="date"
        size="mini"
        placeholder="年/月/日">
      </el-date-picker>
    </div>
    <div class="v-tabs mgt10">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">第1步 选择作业零件</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >第2步 制定工序作业计划</span>
    </div>
    <div class="detail-main" style="top: 153px;">
      <div class="calc hide mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="mgt20 pdlr10">
          <div class="mgb10 dflex">
            <div>排序：</div>
            <div class="flex">
              <el-radio-group v-model="right.page1">
                <el-radio :label="3" class="mgb5">出货日期</el-radio>
                <el-radio :label="6" class="mgb5">下图日期</el-radio>
                <el-radio :label="9" class="mgb5">要求交期</el-radio>
                <el-radio :label="9" class="mgb5">交期剩余(天)</el-radio>
                <el-radio :label="9" class="mgb5">剩余工时</el-radio>
                <el-radio :label="9" class="mgb5">M工序</el-radio>
                <el-radio :label="9" class="mgb5">G工序</el-radio>
                <el-radio :label="9" class="mgb5">EDM工序</el-radio>
                <el-radio :label="9" class="mgb5">CNC工序</el-radio>
                <el-radio :label="9" class="mgb5">W/C工序</el-radio>
              </el-radio-group>
            </div>
          </div>
          <p>
            开展生产零件选择列表（当前尚未完成工序的零件，默认继续开展生产，自动勾选）
          </p>
          <div class="posFull" style="top: 90px; bottom: 74px;">
            <el-table
                :data="tabs.calc.tableData"
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
                  label="下图日期"
                  width="120"
                  label-class-name="fc-el-table-head"
                  class-name="notEdit fc-blue"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="shipmentDate"
                  label="出货日期"
                  width="120"
                  label-class-name="fc-el-table-head"
                  class-name="notEdit fc-red"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
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
                  label="交期剩余(天)"
                  min-width="100"
                  align="center"
                  label-class-name="fc-el-table-head"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div :class="{fcfff: dateMinusBgColor(dateMinus(scope.row.requireCompletionDate))}" :style="{background: dateMinusBgColor(dateMinus(scope.row.requireCompletionDate))}">
                      {{dateMinus(scope.row.requireCompletionDate)}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="剩余工时"
                  min-width="88"
                  align="center"
                  label-class-name="fc-el-table-head"
                  show-overflow-tooltip>
                  <template scope="scope">
                    <div :class="{'bgRed fcfff': scope.row.residueWorkTime > 200}">{{scope.row.residueWorkTime | filterNull(' ')}}</div>
                  </template>
                </el-table-column>
                <el-table-column
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
                      {{scope.row.else}}
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
                      <th v-for="(itemc, key) in tabs.calc.multipleSelectionProcesses" :key="key" class="bge4e4e4">{{key}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td v-for="(itemc, key) in tabs.calc.multipleSelectionProcesses" :key="key">{{itemc.workTime}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
				<div class="preview-content">
          <div class="content">
            <h5 class="content-left-title">选择工序</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div class="list">
                <div class="list-body">
                  <div class="dflex pd10" :class="{active: left.activeId == key}" style="align-items: center;" v-for="(item, key) in tabs.calc.multipleSelectionProcesses" :key="key" @click="handleSelect(item, key)">
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
              <h3 class="tc pdtb10">工序G作业计划</h3>
              <div>
                <img :src="img1" width="22">
                <img :src="img2" width="22" class="mgl10">
                <img :src="img3" width="22" class="mgl10">
                <span class="mgl20">作业计划调整（选择某条记录，点击移出、上移、下移按钮进行操作）</span>
              </div>
              <div class="posFull" style="top: 90px; bottom: 74px;">
                <el-table
                  :data="tabs.calc.enclosureList"
                  border
                  size="mini"
                  style="width: 100%;"
                >
                  <el-table-column prop="name" label="模具号"></el-table-column>
                  <el-table-column prop="name" label="类型"></el-table-column>
                  <el-table-column prop="name" label="客户"></el-table-column>
                  <el-table-column prop="name" label="状态"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <router-link to="/product/editOrder">编辑</router-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="detail-footer" style="border-top: none;">
                <div class="dflex" style="align-items: center;">
                  <div class="pdlr10">模具号：18473</div>
                  <div class="pdlr10">零件号：100-14/15</div>
                  <div class="pdl20">当前状态：</div>
                  <div class="flex pdlr10">
                    <table class="mrmj-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th v-for="(itemc, index) in tabs.calc.selectedRow.processes" :key="index">{{itemc.name}}</th>
                          <th>66</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>状态</td>
                          <td v-for="(itemc, index) in tabs.calc.selectedRow.processes" :key="index">{{itemc.estimationWorkTime}}</td>
                          <th>66</th>
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
      <el-button type="primary">保 存</el-button>
      <el-button type="primary" @click="back">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        activeTab: "calc",
        defaultImg: require('../../../assets/img/wp.svg'),
        img1: require('../../../assets/img/img2.svg'),
        img2: require('../../../assets/img/img3.svg'),
        img3: require('../../../assets/img/img4.svg'),
        maxWorkTime: this.$dict.maxWorkTime,
        procedurePrefix: 'procedure',
        allProcessOfIndex: [],
        tabs: {
          calc: {
            form: {
              type: ''
            },
            selectedRow: [],
            multipleSelection: [],
            multipleSelectionProcesses: {},
            tableData: []
          },
          preview: {}
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
      getAllProcessOfIndex() {  //获取工序列表

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.getAllProcessOfIndex, (res) =>  {

          this.isLoading = false;
          let allProcessOfIndex = [];
          if(res.data.length) {

            // res.data.push({ //追加ENG工序
            //   max: 1,
            //   min: 0,
            //   mrProcessId: "",
            //   name: "ENG"
            // })

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

            //item.processes.push(item.eng); //追加ENG工序
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
          this.tabs.calc.tableData = res.data || [];
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
        
        this.tabs.calc.multipleSelection = val;
        this.tabs.calc.multipleSelectionProcesses = {};

        let processes = [];
        this.tabs.calc.multipleSelection.map(item => {

          processes = processes.concat(item.processes);
        })
       
        this.tabs.calc.multipleSelectionProcesses = {};
        processes.map(item => {
          console.log(item.workTime)
          if(this.tabs.calc.multipleSelectionProcesses[item.name]) {

            this.tabs.calc.multipleSelectionProcesses[item.name].workTime += item.workTime;
          }else {

            this.tabs.calc.multipleSelectionProcesses[item.name] = item;
          }
        })
      },
      handleSelect(row, event, column) {
        
        this.tabs.calc.selectedRow = row || {processes: []};

      },

    },
    computed: {
      dateMinus() { //交期剩余天数

        return function(dateString) {

          let t1 = new Date(dateString).getTime();
          let t0 = new Date().getTime();
    
          return parseInt((t1 - t0) / (1000 * 60 * 60 * 24))
        }
      },
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
      background: #fff;
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
      background: #fff;
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
