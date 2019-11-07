<template>
  <div class="posFull pdlr10" v-loading="isLoading" style="top: 40px;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：质量检验->工序完工质量检验->录入工序完工检验结果
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
            <el-table-column label="模具号" width="140" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'mouldNoEdit')">
                    <div class="ellipsis">{{ scope.row.mouldNo }}</div>
                    <el-select
                      v-model="scope.row.selectMoud"
                      placeholder="请选择"
                      value-key="mouldNo"
                      :style="{opacity: scope.row.mouldNoEdit ? 1 : 0}"
                      @focus="showInput(list, scope.$index, 'mouldNoEdit')"
                      @blur="scope.row.mouldNoEdit = false"
                      @change="item => {
                        $set(list, scope.$index,  item.mouldNo == '清空' ? {} : $utils.deepCopy(item));
                      }">
                      <el-option
                        v-for="item in (filter.modulList || [])"
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
            <el-table-column label="工序"  width="120" show-overflow-tooltip>
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
            <el-table-column label="异常概况"  min-width="180" show-overflow-tooltip>
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
    queryOrder() { //工中未进行工序检验的零件查询

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryNoJobBookingProcess, (res) =>  {

        this.isLoading = false;
        let modulList = [{mouldNo: '清空'}];
        modulList = modulList.concat(res.data || []);
        this.filter.modulList = modulList;
      }, () => this.isLoading = false, {})
    },
    save() {

      let params = [];

      for(let i = 0; i < this.list.length; i++) {

        let item = this.list[i];
        if(item.mouldNo) {

          if(!item.selectComponentNo) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择零件号`);
            return;
          }

          if(!item.selectProcessName) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择工序`);
            return;
          }

          if(!item.inspectionDateString) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择检验日期`);
            return;
          }

          if(!item.inspectionResultText) {
            this.$utils.showTip('warning', '', '', `第${i + 1}条订单请选择检验结果`);
            return;
          }

          params.push({
            inspectionDate: item.inspectionDateString || '',
            mouldNo: item.mouldNo || '',
            name: item.selectProcessName || '',
            productionPlanProcessId: item.mrProductionPlanProcessId || '',
            inspectionResultText: item.inspectionResultText || '',
            abnormalQuantity: item.abnormalQuantity || 0,
            abnormalOverview: item.abnormalOverview || '',
            components: [{
              componentNo: item.selectComponentNo || '',
              quantity: item.quantity || 0
            }]
          })
        }
      }
    
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.saveProcessInspection, (res) =>  {

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