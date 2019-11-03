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
                    <el-autocomplete
                      class="inline-input"
                      v-model="scope.row.mouldNo"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.orderList, 'mouldNo')"
                      valueKey="mouldNo"
                      value="mouldNo"
                      placeholder="请输入内容"
                      @focus="showInput(list, scope.$index, 'mouldNoEdit')"
                      @blur="scope.row.mouldNoEdit = false"
                      @select="item => {
                        $set(list, scope.$index, $utils.deepCopy(item));
                      }"
                      :style="{opacity: scope.row.mouldNoEdit ? 1 : 0}"
                    ></el-autocomplete>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零件号" width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'componentNoEdit')">
                    <div class="ellipsis">{{ scope.row.componentNo }}</div>
                    <el-autocomplete
                      class="inline-input"
                      v-model="scope.row.componentNo"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, (scope.row.components || []), 'componentNo')"
                      valueKey="componentNo"
                      value="componentNo"
                      placeholder="请输入内容"
                      @focus="showInput(list, scope.$index, 'componentNoEdit')"
                      @blur="scope.row.componentNoEdit = false"
                      @select="item => {
                        $set(scope.row, 'processes', $utils.deepCopy(item.processes));
                        $set(scope.row, 'quantity', item.quantity);
                      }"
                      :style="{opacity: scope.row.componentNoEdit ? 1 : 0}"
                    ></el-autocomplete>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序"  width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(list, scope.$index, 'processNameEdit')">
                    <div class="ellipsis">{{ scope.row.processName }}</div>
                    <el-autocomplete
                      class="inline-input"
                      v-model="scope.row.processName"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, (scope.row.processes || []), 'name')"
                      valueKey="name"
                      value="name"
                      placeholder="请输入内容"
                      @focus="showInput(list, scope.$index, 'processNameEdit')"
                      @blur="scope.row.processNameEdit = false"
                      @select="item => scope.row.mrProductionPlanProcessId = item.mrProductionPlanProcessId"
                      :style="{opacity: scope.row.processNameEdit ? 1 : 0}"
                    ></el-autocomplete>
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
        this.filter.orderList = res.data || [];
      }, () => this.isLoading = false, {})
    },
    save() {

      let params = [];

      this.list.map(item => {

        if(item.mouldNo) {
          params.push({
            inspectionDate: item.inspectionDate || '',
            mouldNo: item.mouldNo || '',
            name: item.processName || '',
            productionPlanProcessId: item.mrProductionPlanProcessId || '',
            inspectionResultText: item.inspectionResultText || '',
            abnormalQuantity: item.abnormalQuantity || 0,
            abnormalOverview: item.abnormalOverview || '',
            components: [{
              componentNo: item.componentNo || '',
              quantity: item.quantity || ''
            }]
          })
        }
      })
    
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