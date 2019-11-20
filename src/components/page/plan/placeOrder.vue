<template>
  <div v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：委外加工->编辑采购订单
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
              {{tabs.calc.data.purchaseOrderNo | filterNull}}
            </span> 
            <span class="dib mgl20 mgb5">
              供应商：
              <el-select size="mini" v-model="tabs.calc.data.supplier" value-key="name" placeholder="请选择供应商" style="width: 100px;" @change="$set(tabs.calc.data, 'liaisonManName', '')">
                <el-option v-for="(item, index) in tabs.calc.filter.supplier" :key="index" :label="item.name" :value="item"></el-option>
              </el-select>
            </span>
            <span class="dib mgl20 mgb5">
              联系人：
              <el-select size="mini" v-model="tabs.calc.data.liaisonManName"  placeholder="请选择联系人" style="width: 100px;" @change="">
                <el-option v-for="(item, index) in (tabs.calc.data.supplier && tabs.calc.data.supplier.liaisonMens ? tabs.calc.data.supplier.liaisonMens : [])" :key="index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </span>
            <span class="dib mgl20 mgb5">
              增值税率：
              <el-input v-model="tabs.calc.data.valueAddedTax" style="width: 100px" />
            </span>
          </div>
          <div class="dflex mgb20 mgb5">
            <span>技术要求：</span>
            <el-input type="textarea" row="4" v-model="tabs.calc.data.skillRequire" style="width: 100%" class="flex"/>
          </div>
          <el-table
            :data="tabs.calc.data.contents"
            border
            size="mini"
            class="content-table edit-table"
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="mouldNo" label="模具号" class-name="notEdit" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="零件号" class-name="notEdit" min-width="100" align="center" show-overflow-tooltip>
              <template scope="scope">
                {{scope.row.components | concatString('componentNo')}}
              </template>
            </el-table-column>
            <el-table-column label="零件数量" class-name="notEdit" min-width="100" align="center" show-overflow-tooltip>
              <template scope="scope">
                {{scope.row.components | concatString('quantity')}}
              </template>
            </el-table-column>
            <el-table-column label="加工数量" width="100" align="center" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'machineQuantityEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.machineQuantity }}</div>
                    <el-input size="mini" v-model="scope.row.machineQuantity" @focus="showInput(tabs.calc.data.contents, scope.$index, 'machineQuantityEdit', {}, false)" @blur="scope.row.machineQuantityEdit = false" :style="{opacity: scope.row.machineQuantityEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="加工单位" min-width="100" align="center" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'machineUnitEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.machineUnit }}</div>
                    <el-input size="mini" v-model="scope.row.machineUnit" @focus="showInput(tabs.calc.data.contents, scope.$index, 'machineUnitEdit', {}, false)" @blur="scope.row.machineUnitEdit = false" :style="{opacity: scope.row.machineUnitEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" min-width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'selectProcessesEdit', {}, false)">
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
                        v-for="item in (scope.row.processes || [])"
                        :key="item.processName"
                        :label="item.processName"
                        :value="item.processName">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="要求交货期" width="100" align="center" show-overflow-tooltip>
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
            <el-table-column label="未含税单价" width="100" align="center" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRatePrice }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRatePrice" @focus="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRatePriceEdit', {}, false)" @blur="scope.row.noTaxRatePriceEdit = false" :style="{opacity: scope.row.noTaxRatePriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="未含税总价" width="100" align="center" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRateTotalPricesEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRateTotalPrices }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRateTotalPrices" @focus="showInput(tabs.calc.data.contents, scope.$index, 'noTaxRateTotalPricesEdit', {}, false)" @blur="scope.row.noTaxRateTotalPricesEdit = false" :style="{opacity: scope.row.noTaxRateTotalPricesEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="valueAddedTax" label="增殖税率" width="100" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="haveTaxRatePrice" label="含税单价" width="100" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="haveTaxRateTotalPrices" label="含税总价" width="100" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="备注" min-width="100" align="center" show-overflow-tooltip>
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
            supplier: []
          },
          data: {
            supplier: {
              liaisonMens: []
            },
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
      this.$utils.getJson(this.$utils.CONFIG.api.editPurchaseOrder, (res) =>  {

        this.isLoading = false;
        
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

      this.getList(this.$utils.CONFIG.api.customerQcip, this.tabs.calc.filter.supplier, 'supplier', {customerType: 20}, (res) => {

          let supplier = res.content || [];

          if(this.tabs.calc.data.name) {

            this.$set(this.tabs.calc.data, 'supplier', supplier.find(item => item.name == this.tabs.calc.data.name))
          }

          this.$set(this.tabs.calc.filter, 'supplier', supplier)
        }); //获取供应商

        // this.getList(this.$utils.CONFIG.api.queryOutsourceProcess, this.filter, 'outsourceProcess'); //外协工序列表
        // this.getList(this.$utils.CONFIG.api.process, this.filter, 'processes', ); //工序名称列表
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
