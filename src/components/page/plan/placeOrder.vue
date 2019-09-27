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
            <span class="dib">
              采购订单号：
              <el-input v-model="tabs.calc.form.orderNum" style="width: 100px" />
            </span> 
            <span class="dib mgl20">
              供应商：
              <el-autocomplete
                style="width: 100px;"
                class="inline-input"
                v-model="tabs.calc.form.supplier"
                :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.supplier, 'stuffNo')"
                valueKey="stuffNo"
                value="stuffNo"
                placeholder="请输入内容"
              ></el-autocomplete>
            </span>
            <span class="dib mgl20">
              联系人：
              <el-autocomplete
                style="width: 100px;"
                class="inline-input"
                v-model="tabs.calc.form.contacts"
                :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.contacts, 'stuffNo')"
                valueKey="stuffNo"
                value="stuffNo"
                placeholder="请输入内容"
              ></el-autocomplete>
            </span>
            <span class="dib mgl20">
              增值税率：
              <el-autocomplete
                style="width: 100px;"
                class="inline-input"
                v-model="tabs.calc.form.taxRate"
                :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.taxRate, 'stuffNo')"
                valueKey="stuffNo"
                value="stuffNo"
                placeholder="请输入内容"
              ></el-autocomplete>
            </span>
          </div>
          <div class="dflex mgb20">
            <span>技术要求：</span>
            <el-input type="textarea" row="4" v-model="tabs.calc.form.require" style="width: 100%" class="flex"/>
          </div>
          <el-table
            :data="tabs.calc.list"
            border
            size="mini"
            class="content-table edit-table"
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="mouldNo" label="模具号" class-name="notEdit" show-overflow-tooltip></el-table-column>
            <el-table-column label="零件号" class-name="notEdit"  show-overflow-tooltip>
              <template scope="scope">
                {{scope.row.components | concatString('componentNo')}}
              </template>
            </el-table-column>
            <el-table-column label="零件数量" class-name="notEdit"  show-overflow-tooltip>
              <template scope="scope">
                {{scope.row.components | concatString('quantity')}}
              </template>
            </el-table-column>
            <el-table-column label="加工数量" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'numEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.num }}</div>
                    <el-input size="mini" v-model="scope.row.num" @focus="showInput(tabs.calc.list, scope.$index, 'numEdit', {}, false)" @blur="scope.row.numEdit = false" :style="{opacity: scope.row.numEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="加工单位" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'nameEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.name }}</div>
                    <el-input size="mini" v-model="scope.row.name" @focus="showInput(tabs.calc.list, scope.$index, 'nameEdit', {}, false)" @blur="scope.row.nameEdit = false" :style="{opacity: scope.row.nameEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'nameEdit', {}, false)">
                    <div class="ellipsis">
                      {{scope.row.selectProcesses}}
                    </div>
                    <el-select
                      v-model="scope.row.selectProcesses"
                      placeholder="请选择"
                      :style="{opacity: scope.row.selectProcessesEdit ? 1 : 0}"
                      @focus="showInput(tabs.calc.list, scope.$index, 'selectProcessesEdit', {}, false)"
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
            <el-table-column label="要求交货期" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'requireDeliveryDateStringEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.requireDeliveryDateString }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.requireDeliveryDateString"
                      @focus="showInput(tabs.calc.list, scope.$index, 'requireDeliveryDateStringEdit', {}, false)"
                      @blur="scope.row.requireDeliveryDateStringEdit = false"
                      :style="{opacity: scope.row.requireDeliveryDateStringEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="未含税单价" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'noTaxRatePriceEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRatePrice }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRatePrice" @focus="showInput(tabs.calc.list, scope.$index, 'noTaxRatePriceEdit', {}, false)" @blur="scope.row.noTaxRatePriceEdit = false" :style="{opacity: scope.row.noTaxRatePriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="未含税总价" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'noTaxRateTotalPricesEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.noTaxRateTotalPrices }}</div>
                    <el-input size="mini" v-model="scope.row.noTaxRateTotalPrices" @focus="showInput(tabs.calc.list, scope.$index, 'noTaxRateTotalPricesEdit', {}, false)" @blur="scope.row.noTaxRateTotalPricesEdit = false" :style="{opacity: scope.row.noTaxRateTotalPricesEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'remarkEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.remark }}</div>
                    <el-input size="mini" v-model="scope.row.remark" @focus="showInput(tabs.calc.list, scope.$index, 'remarkEdit', {}, false)" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
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
          list: []
        },
        preview: {}
      }
    };
  },
  methods: {
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
    refresh() {

      // this.getList(this.$utils.CONFIG.api.stuff, this.tabs.calc.filter, 'supplier'); //获取供应商列表
      // this.getList(this.$utils.CONFIG.api.stuff, this.tabs.calc.filter, 'contacts'); //获取联系人列表
      // this.getList(this.$utils.CONFIG.api.stuff, this.tabs.calc.filter, 'taxRate'); //获取增值税率列表
      this.getList(this.$utils.CONFIG.api.process, this.tabs.calc.filter, 'processes'); //获取工序名称列表
    }
  },
  created() {

    if(this.$route.params.id) {

      let json = this.$utils.getSessionStorage(this.$route.params.id);
      this.tabs.calc.list = json ? JSON.parse(json) : [];
    }
    
    this.refresh();
  }
};
</script>


<style scoped lang="scss">
	
</style>
