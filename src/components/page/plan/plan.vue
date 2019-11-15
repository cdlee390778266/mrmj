<template>
  <div>
    <div class="detail-main" style="top: 48px;bottom: 10px;" v-loading="isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg" style="width: 100%;">
            <div class="msg-wrapper tr">
              <el-button v-popover:popover type="text">点击设定工厂日历</el-button>
              <el-popover
                ref="popover"
                placement="right"
                width="400"
                trigger="click">
                <p>
                  <el-select style="width: 100%;" v-model="right.page1.data">
                    <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                  </el-select>
                </p>
                <p class="mgt10">
                  <el-date-picker
                    v-model="right.page1.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </p>
                <p class="mgt10">
                  说明：绿色为工作日，白色为休息日；点击日历某天或框选某个时段，自动切换工作日或休息日
                </p>
              </el-popover>
            </div>
          </div>
          <div class="content">
            <h5 class="content-left-title">当前生产计划列表</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div>
                <p>
                  <span class="mgb10 dib">
                    客户：
                    <el-select clearable size="mini" v-model="form.abbreviation" placeholder="请选择客户" style="width: 120px;">
                      <el-option v-for="(item, index) in filter.customer" :key="index" :label="item.abbreviation" :value="item.abbreviation"></el-option>
                    </el-select>
                  </span>
                  <span class="mgl20 mgb10 dib">
                    模具号：
                    <el-select clearable size="mini" v-model="form.module" value-key="mouldNo" placeholder="请选择模具号" style="width: 120px;" @change="(module) => { form.moduleNo = ''; form.componentNo = ''; }">
                      <el-option v-for="(item, index) in filter.qwm" :key="item.mouldNo" :label="item.mouldNo" :value="item"></el-option>
                    </el-select>
                  </span>
                  <span class="mgl20 mgb10 dib">
                    零件号：
                    <el-select clearable size="mini" v-model="form.componentNo" placeholder="请选择模具号" style="width: 120px;">
                      <template v-if="form.module">
                        <el-option v-for="(item, index) in form.module.componentOrders" :key="index" :label="item.componentNo" :value="item.componentNo"></el-option>
                      </template>
                    </el-select>
                  </span>
                  <el-button type="primary" size="mini" class="mgl20 mgb10" @click="getData">查找符合条件记录</el-button>
                </p>
                <p class="mgt10">
                  <span>
                    工序估工时间超过
                    <el-input v-model="maxWorkTime" style="width: 60px;" size="mini"></el-input>
                    小时，进行标红提示
                  </span>
                </p>
                <p class="mgt10">
                  表格操作说明：点击某订单，设置订单出货日期及外协采购等操作
                </p>
              </div>
              <div class="posFull" style="top: 140px;
              overflow: auto;">
                <el-table
                  :data="tableData"
                  stripe
                  size="mini"
                  style="width: 100%"
                  class="edit-table"
                  :highlight-current-row="true"
                  :row-class-name="setRowClass"
                  @row-click="handleSelect">
                  <el-table-column
                    prop="mouldNo"
                    sortable
                    label="模具号"
                    width="120"
                    align="center"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div >
                        {{scope.row.mouldNo | filterNull(' ')}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="releaseProductionOrderDate"
                    sortable
                    label="下图日期"
                    width="120"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-red"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div >
                        {{scope.row.releaseProductionOrderDate | filterNull(' ')}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="shipmentDateString"
                    sortable
                    label="出货日期"
                    width="120"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-red"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>
                        <div @click="showInput(tableData, scope.$index, 'shipmentDateStringEdit', {})">
                          <div class="ellipsis tc">{{ scope.row.shipmentDateString }}</div>
                          <el-date-picker
                            type="date"
                            size="mini"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="scope.row.shipmentDateString"
                            @focus="showInput(tableData, scope.$index, 'shipmentDateStringEdit', {})"
                            @blur="scope.row.shipmentDateStringEdit = false"
                            :style="{opacity: scope.row.shipmentDateStringEdit ? 1 : 0}">
                          </el-date-picker>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="abbreviation"
                    sortable
                    label="客户"
                    width="120"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-red"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div >
                        {{scope.row.abbreviation | filterNull(' ')}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="productionTasksStatusText"
                    sortable
                    label="状态"
                    width="120"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-red"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div >
                        {{scope.row.productionTasksStatusText | filterNull(' ')}}
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
                      <div>
                        <div @click="showInput(tableData, scope.$index, 'buyEdit')">
                          <div class="ellipsis">
                            {{scope.row.buy == 1 ? '是' : (scope.row.buy == 0 ? '否' : '')}}
                          </div>
                          <el-select
                            v-model="scope.row.buy"
                            placeholder="请选择"
                            :style="{opacity: scope.row.buyEdit ? 1 : 0}"
                            @focus="showInput(tableData, scope.$index, 'buyEdit')"
                            @blur="() => scope.row.buyEdit = 0">
                            <el-option label="是" :value="1">
                            </el-option>
                            <el-option label="否" :value="0">
                            </el-option>
                          </el-select>
                        </div>
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
                        <div>
                          <!-- <div @click="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)">
                            <div class="ecurrentSituationipsis">{{ scope.row.currentSituation }}</div>
                            <el-input size="mini" v-model="scope.row.currentSituationInput" @focus="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)" @blur="() => setCurrentSituation(scope.row)" :style="{opacity: scope.row.currentSituationEdit ? 1 : 0}"/>
                          </div> -->
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
                </el-table>
              </div>
            </div>
            <h5 class="content-right-title">5月2日-6月5日 产能负荷对比图</h5>
            <div class="content-right">
              <div class="mgtb10">
                <el-button type="primary" style="width: 100%;" @click="handle.setting.dialogVisible = true;">工序日产能设置</el-button>
              </div>
              <div class="capacity">
                <div class="capacity-head">
                  <span><i></i>负荷</span>
                  <span class="mgl20"><i></i>低产能</span>
                  <span class="mgl20"><i></i>高产能</span>
                </div>
                <div class="capacity-body posFull">
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="生产订单信息查看修改" class="dialog-gray" :visible.sync="handle.setting.dialogVisible" width="500px">
      <el-form :model="handle.setting.form" label-width="100px">
        <div class="dialog-content pdt10">
          <el-row class="pdtb10" :gutter="20">
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer tr pdb20 pdlr10">
            <el-button type="primary" @click="handle.setting.dialogVisible = false">保 存</el-button>
            <el-button @click="handle.setting.dialogVisible = false">返 回</el-button>
          </div>
        </div>
      </el-form>
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
        maxWorkTime: this.$dict.maxWorkTime,
        filter: {
          customer: [],
          qwm: []
        },
        form: {
          abbreviation: '',
          module: '',
          moduleNo: '',
          componentNo: ''
        },
        procedurePrefix: 'procedure',
        allProcessOfIndex: [],
        tableData: [],
        handle: {
          setting: {
            dialogVisible: false,
            data: {}
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
          type: 1,
          abbreviation: this.form.abbreviation || '',
          mouldNo: this.form.module && this.form.module.mouldNo ?  this.form.module.mouldNo : '',
          componentNo: this.form.componentNo || ''
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
      getDropDownList() { //客户、模具号、零件号下拉列表

        this.getList(this.$utils.CONFIG.api.customer, this.filter, 'customer', {otherWhereClause:'customerType !=20'}); //获取客户列表
        this.getList(this.$utils.CONFIG.api.qwm, this.filter, 'qwm'); //获取模具与零件号联动列表
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
      
      this.getDropDownList();
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
    .msg {
      h4 {

      }
      .msg-wrapper {
        span {
          display: inline-block;
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
        right: 250px;
        bottom: 0;
        left: 0;
        padding: 20px 10px;
        width: auto !important;
        overflow: auto;
        border: 1px solid #ddd;
      }
      .content-right-title {
        position: absolute;
        top: 0px;
        right: 27px;
        font-weight: normal;
        font-size: 14px;
        background: #fff;
        z-index: 8;
      }
      .content-right {
        position: absolute;
        top: 10px;
        right: 0;
        bottom: 0;
        width: 220px;
        padding: 10px;
        overflow: auto;
        border: 1px solid #ddd;
        p {
          margin-bottom: 10px;
        }
        .capacity {
          .capacity-head {
            span {
              i {
                display: inline-block;
                width: 10px;
                height: 10px;
                margin-right: 2px;
                background: #9bbb59;
              }
              &:nth-child(3n+2) i {
                  background: #c0504d;
                }
              &:nth-child(3n+3) i {
                background: #4f81bd;
              }
            }
          }
          .capacity-body {
            top: 80px;
            padding: 10px;
            overflow: auto;
            .capacity-item {
              margin-bottom: 20px;
              .progress {
                font-size: 12px;
                line-height: 0;
                & > div {
                  & > span {
                    display: inline-block;
                    width: 100px;
                    height: 10px;
                    margin-right: 5px;
                    font-weight: bold;
                    background: #9bbb59;
                  }
                  &:nth-child(3n+2) span {
                    background: #c0504d;
                  }
                  &:nth-child(3n+3) span {
                    background: #4f81bd;
                  }
                }
              }
            }
          }
        }
      }
    }
    .handle {
      left: 0;
      right: 0;
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