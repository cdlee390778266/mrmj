<template>
  <div v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：委外加工->下达采购订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="v-tabs">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">编辑订单</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >订单预览</span>
    </div>
    <div class="detail-main">
      <div class="calc hide mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="mgt20 pdlr10">
          <div class="mgb10">
            <span class="dib mgb5">
              采购订单号：
              <el-input v-model="tabs.calc.data.purchaseOrderNo" style="width: 100px" />
            </span> 
            <span class="dib mgl20 mgb5">
              供应商：
              <el-autocomplete
                style="width: 100px;"
                class="inline-input"
                v-model="tabs.calc.data.purchaseOrderNo"
                :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.supplier, 'stuffNo')"
                valueKey="stuffNo"
                value="stuffNo"
                placeholder="请输入内容"
              ></el-autocomplete>
            </span>
            <span class="dib mgl20 mgb5">
              联系人：
              <el-autocomplete
                style="width: 100px;"
                class="inline-input"
                v-model="tabs.calc.data.contacts"
                :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.contacts, 'stuffNo')"
                valueKey="stuffNo"
                value="stuffNo"
                placeholder="请输入内容"
              ></el-autocomplete>
            </span>
            <span class="dib mgl20 mgb5">
              增值税率：
              <el-autocomplete
                style="width: 100px;"
                class="inline-input"
                v-model="tabs.calc.data.taxRate"
                :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.taxRate, 'stuffNo')"
                valueKey="stuffNo"
                value="stuffNo"
                placeholder="请输入内容"
              ></el-autocomplete>
            </span>
          </div>
          <div class="dflex mgb20 mgb5">
            <span>技术要求：</span>
            <el-input type="textarea" row="4" v-model="tabs.calc.data.require" style="width: 100%" class="flex"/>
          </div>
          <el-table
            :data="tabs.calc.data.contents"
            border
            size="mini"
            class="content-table edit-table"
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="mouldNo" label="模具号" class-name="notEdit" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="零件号" class-name="notEdit" min-width="100" show-overflow-tooltip>
              <template scope="scope">
                {{scope.row.components | concatString('componentNo')}}
              </template>
            </el-table-column>
            <el-table-column label="零件数量" class-name="notEdit" min-width="100" show-overflow-tooltip>
              <template scope="scope">
                {{scope.row.components | concatString('quantity')}}
              </template>
            </el-table-column>
            <el-table-column label="加工数量" width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'machineQuantityEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.machineQuantity }}</div>
                    <el-input size="mini" v-model="scope.row.machineQuantity" @focus="showInput(tabs.calc.data.contents, scope.$index, 'machineQuantityEdit', {}, false)" @blur="scope.row.machineQuantityEdit = false" :style="{opacity: scope.row.machineQuantityEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="加工单位" min-width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'machineUnitEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.machineUnit }}</div>
                    <el-input size="mini" v-model="scope.row.machineUnit" @focus="showInput(tabs.calc.data.contents, scope.$index, 'machineUnitEdit', {}, false)" @blur="scope.row.machineUnitEdit = false" :style="{opacity: scope.row.machineUnitEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'nameEdit', {}, false)">
                    <div class="ellipsis">
                      {{scope.row.selectProcesses}}
                    </div>
                    <el-select
                      v-model="scope.row.selectProcesses"
                      placeholder="请选择"
                      :style="{opacity: scope.row.selectProcessesEdit ? 1 : 0}"
                      @focus="showInput(tabs.calc.data.contents, scope.$index, 'selectProcessesEdit', {}, false)"
                      @blur="scope.row.selectProcessesEdit = false">
                      <el-option
                        v-for="itemc in tabs.calc.filter.processes"
                        :key="itemc.name"
                        :label="itemc.name"
                        :value="itemc.name">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="要求交货期" width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'requireDeliveryDateStringEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.requireDeliveryDateString }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.requireDeliveryDateString"
                      @focus="showInput(tabs.calc.data.contents, scope.$index, 'requireDeliveryDateStringEdit', {}, false)"
                      @blur="scope.row.requireDeliveryDateStringEdit = false"
                      :style="{opacity: scope.row.requireDeliveryDateStringEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="未含税单价" width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRatePrice }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRatePrice" @focus="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)" @blur="scope.row.noTaxRatePriceEdit = false" :style="{opacity: scope.row.noTaxRatePriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="未含税总价" width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRateTotalPricesEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRateTotalPrices }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRateTotalPrices" @focus="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRateTotalPricesEdit', {}, false)" @blur="scope.row.noTaxRateTotalPricesEdit = false" :style="{opacity: scope.row.noTaxRateTotalPricesEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="增殖税率" width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRatePrice }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRatePrice" @focus="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)" @blur="scope.row.noTaxRatePriceEdit = false" :style="{opacity: scope.row.noTaxRatePriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="含税单价" width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRatePrice }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRatePrice" @focus="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)" @blur="scope.row.noTaxRatePriceEdit = false" :style="{opacity: scope.row.noTaxRatePriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="含税总价" width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRatePrice }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRatePrice" @focus="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)" @blur="scope.row.noTaxRatePriceEdit = false" :style="{opacity: scope.row.noTaxRatePriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'remarkEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.remark }}</div>
                    <el-input size="mini" v-model="scope.row.remark" @focus="showInput(tabs.calc.data.contents, scope.$index, 'remarkEdit', {}, false)" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
				<div class="preview-content">
          <div class="preview-content">

          </div>
          <div class="preview-handle tc">
            <p class="mgt20"><el-button type="primary" style="width: 80px;">打印</el-button></p>
            <p class="mgt10"><el-button type="primary" style="width: 80px;">导出PDF</el-button></p>
          </div>
				</div>
			</div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">下达采购订单</el-button>
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
      isLoading: false,
      mrPurchaseOrderId: '',
      ids: [],
      tabs: {
        calc: {
          filter: {
            supplier: [
              {
                stuffNo: 'A公司'
              },
              {
                stuffNo: 'B公司'
              },
            ],
            contacts: [
              {
                stuffNo: '王强'
              },
              {
                stuffNo: '张二一'
              },
            ],
            taxRate: [
              {
                stuffNo: '5.1'
              },
              {
                stuffNo: '7.8'
              },
            ],
            processes: []
          },
          form: {
            orderNum: '',
            supplier: '',
            contacts: '',
            taxRate: ''
          },
          data: {
            contents: []
          }
        },
        preview: {}
      }
    };
  },
  methods: {
    getData() {

      let params = {
        mrPurchaseOrderId: this.mrPurchaseOrderId,
        type: 'NoArrivalGoods'
      };
     
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOutSourceArrivalInfo, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.data = res.data || {contents: []};
      }, () => this.isLoading = false, params)
    },
    save() {

      let params = {

      };
      
      this.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '108');
        this.back();
      }, () => this.isLoading = false, params)
    },
    getDropDownList() {

      // this.getList(this.$utils.CONFIG.api.stuff, this.tabs.calc.filter, 'supplier'); //获取供应商列表
      // this.getList(this.$utils.CONFIG.api.stuff, this.tabs.calc.filter, 'contacts'); //获取联系人列表
      // this.getList(this.$utils.CONFIG.api.stuff, this.tabs.calc.filter, 'taxRate'); //获取增值税率列表
      this.getList(this.$utils.CONFIG.api.process, this.tabs.calc.filter, 'processes'); //获取工序名称列表
    }
  },
  created() {

    if(!this.$route.params.id) return;
    this.mrPurchaseOrderId = this.$route.params.id;
    this.getData();
    this.getDropDownList();
  }
};
</script>


<style scoped lang="scss">
	
</style>
