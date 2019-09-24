<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：生产订单跟踪->查看当前生产计划安排
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 70px;" v-loading="left.isLoading">
      <div class="calc mgt20 mgl20">
        <el-table
          :data="left.list"
          :span-method="objectSpanMethod"
          style="width: 100%">
          <el-table-column
            prop="releaseProductionOrderDate"
            label="下图日期"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="shipmentDate"
            label="出货日期"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mouldNo"
            label="模具号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="零件号码"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.components | concatString('componentNo')}}
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.components | concatString('quantity')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="versionNo"
            label="版本"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="工艺时间" align="center">
            <el-table-column
              v-for="(itemc, index) in [1, 2, 3]"
              :key="index"
              prop="name"
              label="M"
              align="center"
              width="66"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="今天" align="center">
            <el-table-column
              prop="requireCompletionDate"
              label="要求交期"
              align="center"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="4月25日" align="center">
            <el-table-column
              prop="abbreviation"
              label="客户"
              align="center"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column label="四" align="center">
            <el-table-column
              prop="name"
              label="交期"
              align="center"
              width="100"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column
              prop="name"
              label="现状"
              align="center"
              width="100"
              show-overflow-tooltip>
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
      tableData3: [{
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
    };
  },
  methods: {
    getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

      this.getData(this.$utils.CONFIG.api.queryPlanList, {}, 'name', loadingKey);
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
    removeWarning(item) {  //消除报警

      let params = {

      };

      this.right.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.$utils.showTip('success', 'success', '107');
        this.right.isLoading = false;
      }, () => this.right.isLoading = false, params)
    },
  },
  created() {
    this.getLeftList();
  }
};
</script>


<style scoped lang="scss">
	
</style>
