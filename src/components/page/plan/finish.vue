<template>
  <div v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：委外加工-> 采购订单完成确认
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
        <div>
          <div class="mgb10">
            <span class="dib">
              采购订单号：{{tabs.calc.data.purchaseOrderNo | filterNull}}
            </span> 
            <span class="dib mgl20">
              供应商：{{tabs.calc.data.name | filterNull}}
            </span>
            <span class="dib mgl20">
              联系人：{{tabs.calc.data.liaisonManName | filterNull}}
            </span>
            <span class="dib mgl20">
              增值税率：{{tabs.calc.data.valueAddedTax | filterNull}}
            </span>
          </div>
          <el-table
            :data="tabs.calc.data.contents"
            border
            size="mini"
            style="width: 100%;"
            class="content-table edit-table">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="mouldNo" label="模具号" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="零件号" class-name="notEdit" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                {{scope.row.components | concatString('componentNo')}}
              </template>
            </el-table-column>
            <el-table-column prop="b" label="数量" class-name="notEdit"  width="100" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                {{scope.row.components | concatString('quantity')}}
              </template>
            </el-table-column>
            <el-table-column prop="machineUnit" label="单位" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="工序" class-name="notEdit" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                {{scope.row.processes | concatString('processName')}}
              </template>
            </el-table-column>
            <el-table-column prop="requireDeliveryDateString" label="要求交货期" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="arrivalDateString" label="实际交货期" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="noTaxRatePrice" label="未含税单价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="noTaxRateTotalPrices" label="未含税总价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="haveTaxRatePrice" label="含税单价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="haveTaxRateTotalPrices" label="含税总价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="packageNum" label="包数" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="punctualPackageNum" label="准时包数" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="qualifiedNum" label="合格" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="maintainNum" label="修" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="tryOutNum" label="试用" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="scrapNum" label="报废" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip align="center"></el-table-column>
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
      <el-button type="primary" @click="save">订单完成</el-button>
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
      multipleSelection: [],
      tabs: {
        calc: {
          form: {
            type: ''
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
        type: 'ArrivalGoods'
      };
     
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOutSourceArrivalInfo, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.data = res.data || {contents: []};
      }, () => this.isLoading = false, params)
    },
    save() {

      if(!this.tabs.calc.data.mrPurchaseOrderId) {

        this.$utils.showTip('warning', 'error', '-1102')
        return;
      }

      let params = {
        mrPurchaseOrderId: this.tabs.calc.data.mrPurchaseOrderId
      };

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.completePurchase, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '117');
        this.back();
      }, () => this.isLoading = false, params)
    }
  },
  created() {

    if(!this.$route.params.id) return;
    this.mrPurchaseOrderId = this.$route.params.id;
    this.getData();
  }
};
</script>