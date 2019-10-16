<template>
  <div>
    <div class="detail-main" style="top: 48px;bottom: 10px;" v-loading="isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg" style="width: 100%;">
            <div class="msg-wrapper">
              <el-button type="primary" @click="$router.push('/plan/edit/1')">制定作业计划</el-button>
              <el-button type="primary" @click="handle.add.dialogVisible = true;">发货</el-button>
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
              <span class="mgl20">
                工序估工时间超过
                <el-input v-model="maxWorkTime" style="width: 60px;" size="mini"></el-input>
                小时，进行标红提示
              </span>
            </div>
            <div class="mgt5 fs12 legend">
              表格图例说明：
              <span><i></i>下道工序</span>
              <span class="mgl20"><i></i>工件位置</span>
              <span class="mgl20"><i></i>正在加工</span>
              <span class="mgl20"><i></i>暂停加工</span>
              <span class="mgl20"><i></i>工件完成</span>
            </div>
          </div>
          <div class="content">
            <div class="content-left" v-loading="left.isLoading">
              <el-table
                :data="tableData"
                size="mini"
                style="width: 100%"
                class="edit-table">
                <el-table-column
                  prop="shipmentDate"
                  label="出货日期"
                  width="120"
                  class-name="notEdit"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="mouldNo"
                  label="模具号"
                  width="120"
                  class-name="notEdit"
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
                  label="数量"
                  min-width="100"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.components | concatString('quantity')}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="versionNo"
                  label="版本"
                  width="100"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  label="整体外协"
                  width="100"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ 
                      scope.row.buy == 1 ? '是' : (
                         scope.row.buy == 0 ? '否' : ''
                      )
                    }}
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
                      <div :class="{'fc-red': (scope.row[item.key] > maxWorkTime) && !scope.row[`${item.key}-isOut`]}" v-if="scope.row[item.key]">
                        <div @click="showInput(tableData, scope.$index, `${item.key}Edit`)">
                          <div class="ellipsis">
                            {{ 
                              scope.row[`${item.key}-isOut`] == 1 ? '外协' : scope.row[item.key]
                            }}
                          </div>
                          <el-select
                            v-model="scope.row[`${item.key}-isOut`]"
                            placeholder="请选择"
                            :style="{opacity: scope.row[`${item.key}Edit`] ? 1 : 0}"
                            @focus="showInput(tableData, scope.$index, `${item.key}Edit`)"
                            @blur="scope.row[`${item.key}Edit`] = false">
                            <el-option
                              v-for="itemc in $dict.outsourceLabelList"
                              :key="itemc.value"
                              :label="itemc.label"
                              :value="itemc.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="requireCompletionDate"
                  label="要求交期"
                  min-width="100"
                  align="center"
                  label-class-name="fc-el-table-head"
                  class-name="fc-blue"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="abbreviation"
                  label="客户"
                  min-width="100"
                  align="center"
                  label-class-name="fc-el-table-head"
                  class-name="fc-blue"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  label="交期剩余(天)"
                  min-width="100"
                  align="center"
                  label-class-name="fc-el-table-head"
                  class-name="fc-blue"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    11
                  </template>
                </el-table-column>
                <el-table-column label="现状" class-name="notEdit" min-width="180" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)">
                        <div class="ecurrentSituationipsis">{{ scope.row.currentSituation }}</div>
                        <el-input size="mini" v-model="scope.row.currentSituation" @focus="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)" @blur="scope.row.currentSituationEdit = false" :style="{opacity: scope.row.currentSituationEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="electrode"
                  label="电极"
                  min-width="100"
                  align="center"
                  label-class-name="fc-el-table-head"
                  class-name="fc-blue"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="residueWorkTime"
                  label="剩余工时"
                  min-width="100"
                  align="center"
                  label-class-name="fc-el-table-head"
                  class-name="fc-blue"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="detail-footer">
            <div class="dflex" style="align-items: center;">
              <div class="pdlr10">模具号：18473</div>
              <div class="pdlr10">零件号：100-14/15</div>
              <div class="pdl20">当前状态：</div>
              <div class="flex pdlr10">
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.name}}</th>
                      <th>66</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>状态</td>
                      <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
                      <th>66</th>
                    </tr>
                    <tr>
                      <td>估工工时</td>
                      <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
                      <th>66</th>
                    </tr>
                    <tr>
                      <td>实际工时</td>
                      <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
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

    <el-dialog title="发货登记" class="dialog-gray" :visible.sync="handle.add.dialogVisible">
      <div v-loading="handle.add.isLoading">
        <el-form :model="handle.add.form" ref="form" label-width="100px">
          <el-row class="pdtb10 borb">
            <el-col :span="24">
              <p>请勾选完工零件确认发货。发货后，表示该零件生产完成，将不再在计划表和跟踪表中显示。</p>
              <p class="mgt5">已完工零件列表</p>
              <p class="mgt5">
                <el-radio v-model="handle.add.form" label="1">按照要求交期排序</el-radio>
                <el-radio v-model="handle.add.form" label="2">按照订单是否完成排序</el-radio>
                <el-radio v-model="handle.add.form" label="3">按照客户排序</el-radio>
              </p>
            </el-col>
          </el-row>
          <div class="dialog-content pdt10 pdlr10 mglr10 bgfff">
            <div class="mgb10 borb">
              <div class="mgb20">
                <el-table
                  :data="tableData"
                  :span-method="objectSpanMethod"
                  max-height="400"
                  style="width: 100%">
                  <el-table-column
                    prop="date"
                    label="模具号">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="出货日期">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="客户">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="要求交期">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="状态">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="零件号码">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="数量">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="版本">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="整体外协">
                  </el-table-column>
                  <el-table-column label="工艺时间" align="center">
                    <el-table-column
                      prop="name"
                      label="M"
                      align="center"
                      width="66">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="M"
                      align="center"
                      width="66">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="M"
                      align="center"
                      width="66">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="M"
                      align="center"
                      width="66">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="M"
                      align="center"
                      width="66">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="M"
                      align="center"
                      width="66">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="M"
                      align="center"
                      width="66">
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="addOrder(false)">发货</el-button>
          <el-button type="primary" @click="handle.add.dialogVisible = false">取消</el-button>
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
        defaultPeopleImg: require('../../../assets/img/people.svg'),
        maxWorkTime: this.$dict.maxWorkTime,
        component: {},
        defaultData: {
          type: 'add',
          mrElectrodeDesignTasksId: '',
          mrElectrodeProductionListOrderId: '',
          electrodeNo: '',
          quantity: '',
          processes: [{}],
          attachments: [],
        },
        procedurePrefix: 'procedure',
        allProcessOfIndex: [],
        tableData: [{
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
        }],
        handle: {
          add: {
            dialogVisible: false,
            data: {},
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
              }else {

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
        let mock = [
          {
            id: 0,
            a: 'M19536',
            b: '4月7日',
            c: '5月1日',
            d: 'KL-D',
            e: '5月7日',
            f: '',
            g: '200',
            h: '8+1',
            i: 'v1',
            j: '是',
            k: [
              {
                name: 'M',
                value: 50,
                index: 1
              },
              {
                name: 'W/C',
                value: 100,
                index: 1
              },
              {
                name: 'G',
                value: 369,
                index: 2
              }
            ]
          }
        ]

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPlanList, (res) =>  {

          this.isLoading = false;
          res.data && res.data.map(item => {

            item.processes && item.processes.map(itemc => {

              item[`${this.procedurePrefix}-${itemc.name}${itemc.processSequence}`] = itemc.workTime;
            })
          })
          this.tableData = res.data || [];
        }, () => this.isLoading = false, params)
      },
      handleSelect(item, index) {
      
        this.left.activeId = index;
        this.currentData = item;
        if(!this.currentData.processes || !this.currentData.processes.length) {
          this.currentData.processes = [{}];
        }
      },
      save() {
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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
      refresh() {

        
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
        &:nth-child(5n+1) i {
          background: rgba(0, 176, 80, 1);
        }
        &:nth-child(5n+2) i {
          background: rgba(255, 255, 0, 1);
        }
        &:nth-child(5n+3) i {
          background: rgba(0, 176, 240, 1);
        }
        &:nth-child(5n+4) i {
          background: rgba(228, 109, 10, 1);
        }
        &:nth-child(5n+5) i {
          background: rgba(141, 180, 227, 1);
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