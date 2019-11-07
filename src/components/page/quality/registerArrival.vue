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
            class="edit-table">
            <el-table-column label="采购单号" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'purchaseOrderNoEdit')">
                    <div class="ellipsis">{{ scope.row.purchaseOrderNo }}</div>
                    <el-select
                      v-model="scope.row.purchaseOrder"
                      :clearable="true"
                      placeholder="请选择"
                      value-key="purchaseOrderNo"
                      :style="{opacity: scope.row.purchaseOrderNoEdit ? 1 : 0}"
                      @focus="showInput(list, scope.$index, 'purchaseOrderNoEdit')"
                      @blur="scope.row.purchaseOrderNoEdit = false"
                      @change="item => {
                        $set(list, scope.$index,  item.purchaseOrderNo == '清空' ? {} : $utils.deepCopy(item));
                        $set(scope.row, 'processes', []);
                        $set(scope.row, 'mouldNo', '');
                        $set(scope.row, 'componentNo', '');
                        $set(scope.row, 'quantity', '');
                      }">
                      <el-option
                        v-for="item in filter.orderList"
                        :key="item.purchaseOrderNo"
                        :label="item.purchaseOrderNo"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="供应商名称" prop="supplierName" class-name="notEdit" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="到货日期" show-overflow-tooltip align="center" width="120">
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'arrivalGoodsDateStringEdit', {})">
                    <div class="ellipsis tc">{{ scope.row.arrivalGoodsDateString }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.arrivalGoodsDateString"
                      @focus="showInput(list, scope.$index, 'arrivalGoodsDateStringEdit', {}, false)"
                      @blur="scope.row.arrivalGoodsDateStringEdit = false"
                      :style="{opacity: scope.row.arrivalGoodsDateStringEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="检验日期" show-overflow-tooltip align="center" width="120">
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'inspectionDateStringEdit', {})">
                    <div class="ellipsis tc">{{ scope.row.inspectionDateString }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.inspectionDateString"
                      @focus="showInput(list, scope.$index, 'inspectionDateStringEdit', {}, false)"
                      @blur="scope.row.inspectionDateStringEdit = false"
                      :style="{opacity: scope.row.inspectionDateStringEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="模具号" width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'selectMouldNoEdit')">
                    <div class="ellipsis">{{ scope.row.selectMouldNo }}</div>
                    <el-select
                      v-model="scope.row.selectMoud"
                      placeholder="请选择"
                      value-key="mouldNo"
                      :style="{opacity: scope.row.selectMouldNoEdit ? 1 : 0}"
                      @focus="showInput(list, scope.$index, 'selectMouldNoEdit')"
                      @blur="scope.row.selectMouldNoEdit = false"
                      @change="item => {
                        $set(scope.row, 'selectMouldNo', item.mouldNo);
                        $set(scope.row, 'components', $utils.deepCopy(item.components || []));
                        $set(scope.row, 'selectComponentNo', '');
                      }">
                      <el-option
                        v-for="item in (scope.row.mouldNos || [])"
                        :key="item.mouldNo"
                        :label="item.mouldNo"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零件号" width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'selectComponentNoEdit')">
                    <div class="ellipsis">{{ scope.row.selectComponentNo }}</div>
                    <el-select
                      v-model="scope.row.selectComponent"
                      placeholder="请选择"
                      value-key="componentNo"
                      :style="{opacity: scope.row.selectComponentNoEdit ? 1 : 0}"
                      @focus="showInput(list, scope.$index, 'selectComponentNoEdit')"
                      @blur="scope.row.selectComponentNoEdit = false"
                      @change="item => {
                        $set(scope.row, 'selectComponentNo', item.componentNo);
                        $set(scope.row, 'quantity', item.quantity);
                        $set(scope.row, 'processes', $utils.deepCopy(item.processes));
                      }">
                      <el-option
                        v-for="item in (scope.row.components || [])"
                        :key="item.componentNo"
                        :label="item.componentNo"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="外协工序"  width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'selectProcessNameEdit')">
                    <div class="ellipsis">{{ scope.row.selectProcessName }}</div>
                    <el-select
                      v-model="scope.row.selectProcess"
                      placeholder="请选择"
                      value-key="processId"
                      :style="{opacity: scope.row.selectProcessNameEdit ? 1 : 0}"
                      @focus="showInput(list, scope.$index, 'selectProcessNameEdit')"
                      @blur="scope.row.selectProcessNameEdit = false"
                      @change="item => {
                        $set(scope.row, 'selectProcessName', item.name);
                        $set(scope.row, 'mrProductionPlanProcessId', item.mrProductionPlanProcessId);
                      }">
                      <el-option
                        v-for="item in (scope.row.processes || [])"
                        :key="item.processId"
                        :label="item.name"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'quantityEdit', {})">
                    <div class="ellipsis">{{ scope.row.quantity }}</div>
                    <el-input size="mini" v-model="scope.row.quantity" @focus="showInput(list, scope.$index, 'quantityEdit', {})" @blur="scope.row.quantityEdit = false" :style="{opacity: scope.row.quantityEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="检测结果"
              width="88"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'inspectionResultTextEdit')">
                    <div class="ellipsis">
                      {{scope.row.inspectionResultText}}
                    </div>
                    <el-select
                      v-model="scope.row.inspectionResultText"
                      placeholder="请选择"
                      :style="{opacity: scope.row.inspectionResultTextEdit ? 1 : 0}"
                      @focus="showInput(list, scope.$index, 'inspectionResultTextEdit')"
                      @blur="scope.row.inspectionResultTextEdit = false">
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
            <el-table-column label="异常数量" width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'abnormalQuantityEdit', {})">
                    <div class="ellipsis">{{ scope.row.abnormalQuantity }}</div>
                    <el-input size="mini" v-model="scope.row.abnormalQuantity" @focus="showInput(list, scope.$index, 'abnormalQuantityEdit', {}, false)" @blur="scope.row.abnormalQuantityEdit = false" :style="{opacity: scope.row.abnormalQuantityEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="异常概况" class-name="notEdit" min-width="180" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'abnormalOverviewEdit', {}, false)">
                    <div class="emmipsis">{{ scope.row.abnormalOverview }}</div>
                    <el-input size="mini" v-model="scope.row.abnormalOverview" @focus="showInput(list, scope.$index, 'abnormalOverviewEdit', {}, false)" @blur="scope.row.abnormalOverviewEdit = false" :style="{opacity: scope.row.abnormalOverviewEdit ? 1 : 0}"/>
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
      isLoading: false,
      filter: {
        orderList: [],
        result: [
          {
            label: '接受',
            value: '接受'
          },
          {
            label: '返工',
            value: '返工'
          },
          {
            label: '报废',
            value: '报废'
          }
        ]
      },
      list: [{}]
    };
  },
  methods: {
    queryOrder() { //未全部收货的采购订单表头查询

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryGoodsInspect, (res) =>  {

        this.isLoading = false;
        let orderList = [{purchaseOrderNo: '清空'}];
        orderList = orderList.concat(res.data || []);
        this.filter.orderList = orderList;
      }, () => this.isLoading = false, {})
    },
    save() {

      let params = [];

      for(let i = 0; i < this.list.length; i++) {

        let item = this.list[i];
        if(item.purchaseOrderNo) {

          if(!item.arrivalGoodsDateString) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择到货日期`);
            return;
          }

          if(!item.inspectionDateString) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择检验日期`);
            return;
          }

          if(!item.selectMouldNo) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择模具号`);
            return;
          }

          if(!item.selectComponentNo) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择零件号`);
            return;
          }

          if(!item.selectProcessName) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择外协工序`);
            return;
          }

          if(!item.inspectionResultText) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择检验结果`);
            return;
          }

          params.push({
            purchaseOrderNo: item.purchaseOrderNo,
            supplierName: item.supplierName || '-',
            arrivalGoodsDate: item.arrivalGoodsDateString || '',
            inspectionDate: item.inspectionDateString || '',
            mouldNo: item.selectMouldNo || '',
            processName: item.selectProcessName || '',
            productionPlanProcessId: item.mrProductionPlanProcessId || '',
            inspectionResultText: item.inspectionResultText || '',
            abnormalQuantity: item.abnormalQuantity || 0,
            abnormalOverview: item.abnormalOverview || '',
            components: [{
              componentNo: item.selectComponentNo,
              quantity: item.quantity
            }]
          })
        }
      }
    
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.saveGoodsInspection, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '102');
        this.back();
      }, () => this.isLoading = false, params)
    }
  },
  created() {

    this.queryOrder();
  }
};
</script>