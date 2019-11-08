<template>
  <div v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：需求跟踪->模具零件报价
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="v-tabs">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">报价计算</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >报价清单预览</span>
    </div>
    <div class="detail-main">
      <div class="calc hide bor mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="crumbs borb pd10">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item class="fs18">
              <i class="el-icon-lx-copy"></i> 需求信息
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-row class="pd10">
          <el-col :span="12" class="pdb10">客户名称：{{tabs.calc.requirement.name | filterNull}}</el-col>
          <el-col :span="12" class="pdb10">客户PO.号：{{tabs.calc.requirement.customerPoNo | filterNull}}</el-col>
          <el-col :span="12" class="pdb10">需求编号：{{tabs.calc.requirement.requirementNum | filterNull}}</el-col>
          <el-col :span="12" class="pdb10">需求类型：{{tabs.calc.requirement.requirementTypeText | filterNull}}</el-col>
        </el-row>
        <div class="mgt20 pdlr10">
          <p class="mgb10">需求附件：</p>
          <el-table
            :data="tabs.calc.requirement.attachments"
            border
            size="mini"
            style="width: 100%; max-width: 400px;"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="fileName" label="附件名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mgt20 mgb10 pdlr10">
          <p class="mgb10">需求说明：</p>
          <p>{{tabs.calc.requirement.remark | filterNull}}</p>
        </div>
        <el-row class="mgt20 mgb20 pdlr10">
          <el-col :span="16">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item class="lh32">
                <i class="el-icon-lx-copy"></i> 报价计算
                <span class="mgl10">总价（人民币）：{{tabs.calc.data.offerTotalPrice | filterNull}}</span>
                <span class="mgl10">交易货币总价：{{tabs.calc.data.totalPrice | filterNull}}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="8">
            <span>加载历史报价：</span>
            <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.offerRecord">
              <el-option v-for="(item, index) in tabs.calc.filter.requ" :key="index" :label="item.offerNo" :value="item.offerNo"></el-option>
            </el-select>
          </el-col>
          <el-col :span="24" class="mgt10">
            <span class="mgl10">交易货币：</span>
            <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.currency" value-key="name"  @change="(currency) => tabs.calc.data.exchangeRateValue = ''">
              <el-option v-for="(item, index) in $dict.currencyList" :key="item.name" :label="item.name" :value="item"></el-option>
            </el-select>
            <span class="mgl10">汇率：</span>
            <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.exchangeRateValue">
              <template v-if="tabs.calc.data.currency">
                <el-option v-for="(item, index) in tabs.calc.data.currency.currencyRates" :key="index" :label="item.value" :value="item.value"></el-option>
              </template>
            </el-select>
            <span class="mgl10">管理费用上浮比例：</span>
            <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.managementFeeFloatingRatio">
              <el-option v-for="(item, index) in tabs.calc.filter.floatRatio" :key="index" :label="item.value" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" size="mini" class="mgl10">工序工时单价设置</el-button>
          </el-col>
          <el-col :span="24" class="mgb20">
            <el-table
              :data="tabs.calc.data.list"
              size="mini"
              style="width: 100%"
              class="edit-table mgt10"
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
                    <div @click="showInput(tabs.calc.data.list, scope.$index, 'currentSituationEdit', {}, false)">
                      <div class="ecurrentSituationipsis">{{ scope.row.currentSituation }}</div>
                      <el-input size="mini" v-model="scope.row.currentSituationInput" @focus="showInput(tabs.calc.data.list, scope.$index, 'currentSituationEdit', {}, false)" @blur="() => setCurrentSituation(scope.row)" :style="{opacity: scope.row.currentSituationEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="mouldNo"
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
                      @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row, scope.row[item.key+'-id'], true)">
                      {{scope.row[item.key]}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Else"
                  align="center"
                  min-width="70"
                  label-class-name="fc-blue"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div @contextmenu.prevent.stop="(e) => showRightMenu(e, scope.row, '', true)">
                      <div @click="showInput(tableData, scope.$index, 'qcEdit')">
                        <div class="ellipsis">
                          {{scope.row.qc}}
                        </div>
                        <el-select
                          v-model="scope.row.qcSelect"
                          placeholder="请选择"
                          :style="{opacity: scope.row.qcEdit ? 1 : 0}"
                          @focus="showInput(tableData, scope.$index, 'qcEdit')"
                          @change="() => setQc(scope.row)">
                          <el-option label="请选择" value="">
                          </el-option>
                          <el-option label="QC" value="QC">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="requireCompletionDate"
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
                    <div @click="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)">
                      <div class="ecurrentSituationipsis">{{ scope.row.currentSituation }}</div>
                      <el-input size="mini" v-model="scope.row.currentSituationInput" @focus="showInput(tableData, scope.$index, 'currentSituationEdit', {}, false)" @blur="() => setCurrentSituation(scope.row)" :style="{opacity: scope.row.currentSituationEdit ? 1 : 0}"/>
                    </div>
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
          </el-col>
        </el-row>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
				<div class="preview-content">

				</div>
				<div class="preview-handle tc">
					<p class="mgt20"><el-button type="primary" style="width: 80px;">打印</el-button></p>
					<p class="mgt10"><el-button type="primary" style="width: 80px;">导出PDF</el-button></p>
				</div>
			</div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary">报价</el-button>
      <el-button type="primary">保存草稿</el-button>
      <el-button type="primary">返 回</el-button>
    </div>
  </div>
</template>

<script>
import leftMixin from '../../../js/left-mixin'
export default {
  mixins: [leftMixin],
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      activeTab: "calc",
      mrRequirementId: '',
      isLoading: false,
      tabs: {
        calc: {
          filter: {
            floatRatio: [],
            offerRecord: []
          },
          requirement: {},
          data: {
            list: [{}]
          }
        },
        preview: {}
      }
    };
  },
  methods: {
    getDetail() { //需求详情

      let params = {
        mrRequirementId: this.mrRequirementId
      };
    
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryRequirementDetail, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.requirement = res.data || {};
      }, () => this.isLoading = false, params)
    },
    getData() { //表格数据
        
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOfferRecord, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.data = res.data || {};
      }, () => this.isLoading = false, {offerNo: this.mrRequirementId})
    },
    save() {//报价

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOfferRecord, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.data = res.data || {};
      }, () => this.isLoading = false, params)
    },
    getDropDownList() {

      this.getList(this.$utils.CONFIG.api.queryOffer, this.tabs.calc.filter, 'offerRecord', {mrRequirementId: this.mrRequirementId}); //零件报价记录列表
      this.getList(this.$utils.CONFIG.api.floatRatio, this.tabs.calc.filter, 'floatRatio'); //管理费用上浮比例列表
    }
  },
  created() {

    if(!this.$route.params.id) return;
    this.mrRequirementId = this.$route.params.id;
    this.getDetail();
    this.getData();
    this.getDropDownList();
  },
};
</script>


<style scoped lang="scss">
	.v-tabs {
		border-bottom: 1px solid #a3bf1f;
		.v-tab {
				display: inline-block;
				width: 120px;
				line-height: 40px;
				text-align: center;
				font-size: 16px;
				cursor: pointer;
				&.active {
				color: #fff;
				background: #a3bf1f;
				}
		}
	}
	.detail-main {
		position: absolute;
		top: 115px;
		right: 10px;
		bottom: 54px;
		left: 10px;
		overflow-y: auto;
		& > div {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			.preview-content {
				position: absolute;
				top: 0;
				right: 100px;
				bottom: 0;
				left: 0;
				overflow-y: auto;
			}
			.preview-handle {
				position: absolute;
				top: 0;
				right: 0px;
				bottom: 0;
				width: 100px;
			}
		}
	}
	.detail-footer {
		position: absolute;
		left: 10px;
		right: 10px;
		bottom: 0px;
		padding: 10px 0;
		border-top: 1px solid #a3bf1f;
	}
</style>
