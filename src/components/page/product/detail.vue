<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：生产订单跟踪->查看当前生产计划安排
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 70px;" v-loading="isLoading">
      <div class="calc mgt20 mgl20">
        <el-table
          :data="tableData"
          :height="maxHeight"
          :max-height="maxHeight"
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
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="$router.push('/product/progress')">返 回</el-button>
    </div>
  </div>
</template>

<script>
import leftMixin from '../../../js/left-mixin'
export default {
  mixins: [leftMixin],
  data() {
    return {
      isLoading: false,
      tableData: []
    };
  },
  methods: {
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
    }
  },
  updated() {
    this.setTableMaxHeight();
    window.onresize = this.setTableMaxHeight;
  },
  created() {
    
    this.getAllProcessOfIndex();
    this.getData(); 
  }
};
</script>


<style scoped lang="scss">
	
</style>
