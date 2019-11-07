<template>
  <div>
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
          <el-col :span="12" class="pdb10">客户名称：XXXXXX公司</el-col>
          <el-col :span="12" class="pdb10">客户PO.号：12312323123</el-col>
          <el-col :span="12" class="pdb10">需求编号：REQ1901</el-col>
          <el-col :span="12" class="pdb10">需求类型：整体模具</el-col>
        </el-row>
        <div class="mgt20 pdlr10">
          <p class="mgb10">需求附件：</p>
          <el-table
            :data="tabs.calc.attachments"
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
        <div class="mgt20 pdlr10">
          <p class="mgb10">需求说明：</p>
          <p>这里.</p>
        </div>
        <el-row class="mgt20 mgb20 pdlr10">
          <el-col :span="16">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item class="lh32">
                <i class="el-icon-lx-copy"></i> 报价计算
                <span class="mgl10">总价（人民币）：{{calc.data.offerTotalPrice | filterNull}}</span>
                <span class="mgl10">交易货币总价：{{calc.data.totalPrice | filterNull}}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="8">
            <span>加载历史报价：</span>
            <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.offerRecord">
              <el-option v-for="(item, index) in tabs.calc.filter.offerNo" :key="index" :label="item.offerNo" :value="item.offerNo"></el-option>
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
            <el-button type="primary">工序工时单价设置</el-button>
          </el-col>
          <el-col :span="24" class="mgb20">
            <div
              class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--mini mgt10"
            >
              <table class="el-table__body" style="width: 100%">
                <thead class="has-gutter">
                  <tr class>
                    <th>
                      <div class="cell">Det No</div>
                    </th>
                    <th>
                      <div class="cell">数量</div>
                    </th>
                    <th>
                      <div class="cell">材料</div>
                    </th>
                    <th>
                      <div class="cell">M</div>
                    </th>
                    <th>
                      <div class="cell">EDB</div>
                    </th>
                    <th>
                      <div class="cell">G</div>
                    </th>
                    <th>
                      <div class="cell">CNCV</div>
                    </th>
                    <th>
                      <div class="cell">CNCH</div>
                    </th>
                    <th>
                      <div class="cell">EDM</div>
                    </th>
                    <th>
                      <div class="cell">W/C</div>
                    </th>
                    <th>
                      <div class="cell">BENCH</div>
                    </th>
                    <th>
                      <div class="cell">编程</div>
                    </th>
                    <th>
                      <div class="cell">电极设计</div>
                    </th>
                    <th>
                      <div class="cell">设计</div>
                    </th>
                    <th>
                      <div class="cell">QC</div>
                    </th>
                    <th>
                      <div class="cell">Total</div>
                    </th>
                    <th>
                      <div class="cell">订购</div>
                    </th>
                    <th>
                      <div class="cell">铜材</div>
                    </th>
                    <th>
                      <div class="cell">钢材</div>
                    </th>
                    <th>
                      <div class="cell">合计人民币</div>
                    </th>
                    <th>
                      <div class="cell">单价人民币</div>
                    </th>
                    <th>
                      <div class="cell">单价</div>
                    </th>
                    <th>
                      <div class="cell">最终价格</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="el-table__row">
                    <td>
                      <div class="cell">
                        <div>1</div>
                      </div>
                    </td>
                    <td>
                      <div class="cell">王小虎</div>
                    </td>
                    <td>
                      <div class="cell">
                        <a href>下载</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--mini mgt10"
            >
              <table class="el-table__body" style="width: 100%">
                <thead class="has-gutter">
                  <tr class>
                    <th>
                      <div class="cell">长(MM)</div>
                    </th>
                    <th>
                      <div class="cell">宽(MM)</div>
                    </th>
                    <th>
                      <div class="cell">高(MM)</div>
                    </th>
                    <th>
                      <div class="cell">重量(KG)</div>
                    </th>
                    <th>
                      <div class="cell">材料</div>
                    </th>
                    <th>
                      <div class="cell">运费</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="el-table__row">
                    <td>
                      <div class="cell">
                        <div>1</div>
                      </div>
                    </td>
                    <td>
                      <div class="cell">王小虎</div>
                    </td>
                    <td>
                      <div class="cell">
                        <a href>下载</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
export default {
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      activeTab: "calc",
      offerNo: '',
      tabs: {
        calc: {
          filter: {
            floatRatio: [],
            offerRecord: []
          },
          data: {}
        },
        preview: {}
      }
    };
  },
  methods: {
    getData() {
         
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOfferRecord, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.data = res.data || {};
      }, () => this.isLoading = false, {offerNo: this.offerNo})
    },
    save() {//报价

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOfferRecord, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.data = res.data || {};
      }, () => this.isLoading = false, params)
    },
    getDropDownList() {

      this.getList(this.$utils.CONFIG.api.queryOfferRecord, this.tabs.calc.filter, 'offerRecord'); //零件报价记录列表
      this.getList(this.$utils.CONFIG.api.floatRatio, this.tabs.calc.filter, 'floatRatio'); //管理费用上浮比例列表
    }
  },
  created() {

    if(!this.$route.params.id) return;
    this.offerNo = this.$route.params.id;


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
