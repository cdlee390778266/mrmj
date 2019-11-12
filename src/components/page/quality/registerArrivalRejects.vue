<template>
  <div class="posFull pdlr10" v-loading="isLoading" style="top: 40px;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：质量检验->外协到货质量检验->录入采购到货检验结果
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 28px;">
      <div class="calc">
        <div class="mgt20 pdlr10">
          <el-table
            :data="list"
            border
            size="mini"
            style="width: 100%;"
            class="edit-table"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"
              align="center"
              fixed="left">
            </el-table-column>
            <el-table-column label="状态" width="88" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="{'table-td-red': scope.row.dealStatusValue == 10}">{{scope.row.dealStatusText}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseOrderNo" label="采购单号" class-name="notEdit" width="120" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="供应商名称" class-name="notEdit" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="arrivalGoodsDateString" label="到货日期" class-name="notEdit" show-overflow-tooltip width="120" align="center"></el-table-column>
            <el-table-column prop="inspectionDateString" label="检验日期" class-name="notEdit" show-overflow-tooltip width="120" align="center"></el-table-column>
            <el-table-column prop="mouldNo" label="模具号" class-name="notEdit" width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="零件号" class-name="notEdit" width="120" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.components | concatString('componentNo')}}
              </template>
            </el-table-column>
            <el-table-column prop="processName" label="外协工序" class-name="notEdit"  width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="数量" class-name="notEdit" width="88" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.components | concatString('quantity')}}
              </template>
            </el-table-column>
            <el-table-column prop="inspectionResultText" label="检测结果" class-name="notEdit" width="88" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="abnormalQuantity" label="异常数量" class-name="notEdit" width="88" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="abnormalOverview" label="异常概况" class-name="notEdit" min-width="180" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理方式" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'dealWayTextEdit', {}, false)">
                    <div class="eclipsis">
                      {{scope.row.dealWayText}}
                    </div>
                    <el-select
                      v-model="scope.row.dealWayText"
                      placeholder="请选择"
                      :style="{opacity: scope.row.dealWayTextEdit ? 1 : 0}"
                      @focus="showInput(list, scope.$index, 'dealWayTextEdit', {}, false)"
                      @blur="scope.row.dealWayTextEdit = false">
                      <el-option
                        v-for="item in filter.result"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="处理说明" class-name="notEdit" min-width="180" align="center" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'dealIllustrateEdit', {}, false)">
                    <div class="emmipsis">{{ scope.row.dealIllustrate }}</div>
                    <el-input size="mini" v-model="scope.row.dealIllustrate" @focus="showInput(list, scope.$index, 'dealIllustrateEdit', {}, false)" @blur="scope.row.dealIllustrateEdit = false" :style="{opacity: scope.row.dealIllustrateEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保 存</el-button>
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
      filter: {
      result: [
        {
          label: '返工',
          value: '20'
        },
        {
          label: '特采',
          value: '40'
        },
        {
          label: '报废',
          value: '50'
        }
      ]
    },
    list: [],
    multipleSelection: []
    };
  },
  methods: {
    getData() { //获取采购订单列表

      let params = {
        dealStatus: 10,
        name: '',
        mouldNo: '',
        componentNo: '',
        inspectionDate_from: '',
        inspectionDate_to: '',
        processName: '',
        inspectionResult: []
      };
    
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryGoodsInspectInfo, (res) =>  {

        this.isLoading = false;
        this.list = res.data || [];
      }, () => this.isLoading = false, params)
    },
    handleSelectionChange(val) {

      this.multipleSelection = val;
    },
    getDealWayValue(dealWayText) {
      
      let value = ''
      
      if(!dealWayText) return value;

      for(let i = 0; i < this.filter.result.length; i++) {

        if(this.filter.result[i].label == dealWayText) {
          
          value = this.filter.result[i].value;
          break;
        }
      }
      return value
    },
    save() {

      if(!this.multipleSelection.length) {

        this.$utils.showTip('warning', 'error', '-1078')
        return;
      }

      let params = [];
      this.multipleSelection.map(item => {

        params.push({
          mrGoodsInspectionId: item.mrGoodsInspectionId,
          dealStatus: 20,
          dealWay: this.getDealWayValue(item.dealWayText),
          dealIllustrate: item.dealIllustrate
        })
      })

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.saveGoodsRejectsInfo, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '102');
        this.getData();
      }, () => this.isLoading = false, params)
    },
  },
  created() {

    this.getData();
  }
};
</script>

<style scoped lang="scss">
  .table-td-red {
    line-height: 26px;
  }
</style>