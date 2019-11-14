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
        <div class="pdlr10">
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
        <el-form ref="form" :model="tabs.calc.data" :rules="tabs.calc.rules" :inline="true">
          <el-row class="mgt20 mgb20 pdlr10">
            <el-col :span="16">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item class="lh32">
                  <i class="el-icon-lx-copy"></i> 报价计算
                  <span class="mgl20">总价（人民币）：{{offerTotalPrice()}}{{tabs.calc.data.offerTotalPrice}}</span>
                  <span class="mgl20">交易货币总价：{{totalPrice()}}{{tabs.calc.data.totalPrice}}</span>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col :span="8">
              <span>加载历史报价：</span>
              <el-select size="mini" style="width: 100px;" v-model="tabs.calc.offerRecord" @change="getData">
                <el-option v-for="(item, index) in tabs.calc.filter.offerRecord" :key="index" :label="item.offerNo" :value="item.offerNo"></el-option>
              </el-select>
            </el-col>
            <el-col :span="24" class="mgt10">
              <el-form-item label="报价单编号：" prop="addOfferNo" size="mini">
                <el-input v-model="tabs.calc.data.addOfferNo" style="width: 100px;"></el-input>
              </el-form-item>
              <el-form-item label="交易货币：" label-width="110px">
                <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.currency" value-key="name"  @change="(currency) => tabs.calc.data.exchangeRateValue = ''">
                  <el-option v-for="(item, index) in $dict.currencyList" :key="item.name" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="汇率：" prop="exchangeRateValue" size="mini">
                <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.exchangeRateValue">
                  <template v-if="tabs.calc.data.currency">
                    <el-option v-for="(item, index) in tabs.calc.data.currency.currencyRates" :key="index" :label="item.value" :value="item.value"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="管理费用上浮比例：" label-width="150px" prop="managementFeeFloatingRatio" size="mini">
                <el-select size="mini" style="width: 100px;" v-model="tabs.calc.data.managementFeeFloatingRatio">
                  <el-option v-for="(item, index) in tabs.calc.filter.floatRatio" :key="index" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" size="mini" class="mgl10" @click="handle.setting.dialogVisible = true">工序工时单价设置</el-button>
            </el-col>
            <el-col :span="24" class="mgb20">
              <el-table
                :data="tabs.calc.data.records"
                border
                size="mini"
                style="width: 100%"
                class="edit-table gray-head mgt10"
                :highlight-current-row="true">
                <el-table-column label="Det No." min-width="100"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'detNoEdit')">
                        <div class="ellipsis">{{ scope.row.detNo }}</div>
                        <el-input size="mini" v-model="scope.row.detNo" @focus="showInput(tabs.calc.data.records, scope.$index, 'detNoEdit')" @blur="scope.row.detNoEdit = false;" :style="{opacity: scope.row.detNoEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="80" align="center"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'amountEdit')">
                        <div class="ellipsis">{{ scope.row.amount }}</div>
                        <el-input size="mini" v-model="scope.row.amount" @focus="showInput(tabs.calc.data.records, scope.$index, 'amountEdit')" @blur="scope.row.amountEdit = false;" :style="{opacity: scope.row.amountEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="材料" width="100" align="center"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'stuffNoEdit')">
                        <div class="ellipsis">{{ scope.row.stuffNo }}</div>
                        <el-input size="mini" v-model="scope.row.stuffNo" @focus="showInput(tabs.calc.data.records, scope.$index, 'stuffNoEdit')" @blur="scope.row.stuffNoEdit = false;" :style="{opacity: scope.row.stuffNoEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="tabs.calc.allProcessOfIndex && tabs.calc.allProcessOfIndex.length"
                  v-for="(item, index) in tabs.calc.allProcessOfIndex"
                  :key="index"
                  :label="item.name"
                  align="center"
                  min-width="100"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(tabs.calc.data.records, scope.$index, `${item.name}Edit`, 'processesObj')">
                        <div class="ellipsis">{{ scope.row.processesObj[item.name] }}</div>
                        <el-input size="mini" v-model="scope.row.processesObj[item.name]" @focus="showInput(tabs.calc.data.records, scope.$index, `${item.name}Edit`, 'processesObj')" @blur="$set(scope.row.processesObj, `${item.name}Edit`, false)" :style="{opacity: scope.row.processesObj[`${item.name}Edit`] ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Qc" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                     {{qc(scope.row)}}
                     {{scope.row.qc}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Total" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                     {{totalTime(scope.row)}}
                     {{scope.row.totalTime}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="订购" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'orderPriceEdit')">
                        <div class="ellipsis">{{ scope.row.orderPrice }}</div>
                        <el-input size="mini" v-model="scope.row.orderPrice" @focus="showInput(tabs.calc.data.records, scope.$index, 'orderPriceEdit')" @blur="scope.row.orderPriceEdit = false;" :style="{opacity: scope.row.orderPriceEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="铜材" width="100" align="center"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'copperProductEdit')">
                        <div class="ellipsis">{{ scope.row.copperProduct }}</div>
                        <el-input size="mini" v-model="scope.row.copperProduct" @focus="showInput(tabs.calc.data.records, scope.$index, 'copperProductEdit')" @blur="scope.row.copperProductEdit = false;" :style="{opacity: scope.row.copperProductEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="钢材" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      {{steelProduct(scope.row)}}
                      {{scope.row.steelProduct}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="合计人民币" class-name="column-notEdit" align="center"  width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      {{rmbTotal(scope.row)}}
                      {{scope.row.rmbTotal}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="单价人民币" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      {{rmbUnitPrice(scope.row)}}
                      {{scope.row.rmbUnitPrice}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="单价" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      {{unitPrice(scope.row)}}
                      {{scope.row.unitPrice}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="最终价格" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      {{lastTotalPrice(scope.row)}}
                      {{scope.row.lastTotalPrice}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="长" width="100" align="center"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'lengthEdit')">
                        <div class="ellipsis">{{ scope.row.length }}</div>
                        <el-input size="mini" v-model="scope.row.length" @focus="showInput(tabs.calc.data.records, scope.$index, 'lengthEdit')" @blur="scope.row.lengthEdit = false;" :style="{opacity: scope.row.lengthEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="宽" width="100" align="center"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'widthEdit')">
                        <div class="ellipsis">{{ scope.row.width }}</div>
                        <el-input size="mini" v-model="scope.row.width" @focus="showInput(tabs.calc.data.records, scope.$index, 'widthEdit')" @blur="scope.row.widthEdit = false;" :style="{opacity: scope.row.widthEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="高" width="100" align="center"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'heightEdit')">
                        <div class="ellipsis">{{ scope.row.height }}</div>
                        <el-input size="mini" v-model="scope.row.height" @focus="showInput(tabs.calc.data.records, scope.$index, 'heightEdit')" @blur="scope.row.heightEdit = false;" :style="{opacity: scope.row.heightEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="重量" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      {{weight(scope.row)}}
                      {{scope.row.weight}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="材料" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'stuffUnitPriceEdit')">
                        <div class="ellipsis">{{ scope.row.stuffUnitPrice }}</div>
                        <el-input size="mini" v-model="scope.row.stuffUnitPrice" @focus="showInput(tabs.calc.data.records, scope.$index, 'stuffUnitPriceEdit')" @blur="scope.row.stuffUnitPriceEdit = false;" :style="{opacity: scope.row.stuffUnitPriceEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="运费" width="100" align="center"  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      <div @click="showInput(tabs.calc.data.records, scope.$index, 'freightUnitPriceEdit')">
                        <div class="ellipsis">{{ scope.row.freightUnitPrice }}</div>
                        <el-input size="mini" v-model="scope.row.freightUnitPrice" @focus="showInput(tabs.calc.data.records, scope.$index, 'freightUnitPriceEdit')" @blur="scope.row.freightUnitPriceEdit = false;" :style="{opacity: scope.row.freightUnitPriceEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="总重量" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div >
                      {{totalWeight(scope.row)}}
                      {{scope.row.totalWeight}}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
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
      <el-button type="primary" @click="save">报价</el-button>
      <el-button type="primary" @click="save(true)">保存草稿</el-button>
      <el-button type="primary" @click="back">返 回</el-button>
    </div>

    <el-dialog title="工序及对应工时单价设置" :visible.sync="handle.setting.dialogVisible">
      <div v-loading="handle.setting.isLoading">
        <p>设置报价表工序列及对应工时单价</p>
        <el-table
          :data="handle.setting.workProcedure"
          border
          size="mini"
          max-height="300px"
          class="edit-table gray-head mgt5"
          style="width: 100%">
          <el-table-column
            label="工序名称"
            min-width="120"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                <div @click="showWorkProcedureInput(handle.setting.workProcedure, scope.$index, 'nameEdit')">
                  <div class="ellipsis">{{ scope.row.name }}</div>
                  <el-input size="mini" class="tc" v-model="scope.row.name" @focus="showWorkProcedureInput(handle.setting.workProcedure, scope.$index, 'nameEdit')" @blur="scope.row.nameEdit = false;" :style="{opacity: scope.row.nameEdit ? 1 : 0}"/>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="工时单价(RMB元)"
            min-width="120"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                <div @click="showWorkProcedureInput(handle.setting.workProcedure, scope.$index, 'priceEdit')">
                  <div class="ellipsis">{{ scope.row.price }}</div>
                  <el-input size="mini" class="tc" v-model="scope.row.price" @focus="showWorkProcedureInput(handle.setting.workProcedure, scope.$index, 'priceEdit')" @blur="scope.row.priceEdit = false;" :style="{opacity: scope.row.priceEdit ? 1 : 0}"/>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" @click="deleteWorkProcedure(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button type="primary" @click="setProcessInfo">确 定</el-button>
          <el-button @click="handle.setting.dialogVisible = false">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import leftMixin from '../../../js/left-mixin'
export default {
  mixins: [leftMixin],
  data() {
    var checkOfferNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$utils.getTipText('error', '-1098')));
      }
      this.$utils.getJson(this.$utils.CONFIG.api.checkOfferNo, (res) => {

        if(res.data != 1) { //如果编号重复

          callback(new Error(this.$utils.getTipText('error', '-1099')));
        }else {
          callback();
        }
      }, null, {offerNo: value})
    };
    return {
      name: localStorage.getItem("ms_username"),
      activeTab: "calc",
      mrRequirementId: '',
      isLoading: false,
      workProcedure: [],
      workProcedurePrice: {},
      tabs: {
        calc: {
          filter: {
            floatRatio: [],
            offerRecord: []
          },
          requirement: {},
          offerRecord: '',
          allProcessOfIndex: [],
          processesObj: {},
          processesIdObj: {},
          processesPriceObj: {},
          data: {
            currency: {},
            addOfferNo: '',
            exchangeRateValue: '',
            managementFeeFloatingRatio: '',
            records: [{
              processesObj: {}
            }]
          },
          rules: {
            addOfferNo: [
              { required: true, message: this.$utils.getTipText('error', '-1098')},
              { validator: checkOfferNo, trigger: 'blur' }
            ],
            exchangeRateValue: { required: true, message: this.$utils.getTipText('error', '-1096')},
            managementFeeFloatingRatio: { required: true, message: this.$utils.getTipText('error', '-1097') },
          }
        },
        preview: {}
      },
      handle: {
        setting: {
          dialogVisible: false,
          isLoading: false,
          workProcedure: []
        }
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
    getData(offerNo) { //表格数据
        
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOfferRecord, (res) =>  {

        this.isLoading = false;
        let data = {
          currency: {},
          exchangeRateValue: '',
          records: [{}]
        };
        if(res.data) {

          data = res.data;

          if(data.currencyName && this.$dict.currencyList) { //货币初始化
            
            for(let i = 0; i < this.$dict.currencyList.length; i++) {

              if(data.currencyName == this.$dict.currencyList[i].name) {

                data.currency = this.$dict.currencyList[i];
                break;
              }
            }
          }

          if(data.records && data.records.length) { //表格数据
            data.records.map(item => {

              item.processesObj = this.$utils.deepCopy(this.tabs.calc.processesObj);
              item.processes && item.processes.length && item.processes.map(itemc => {

                if(item.processesObj.hasOwnProperty(itemc.name)) {

                  item.processesObj[itemc.name] = itemc.workTime || 0;
                }
              })
            })
          }else {

            data.records = [{}]
          }
        }
        this.tabs.calc.data = data;
      }, () => this.isLoading = false, {offerNo: offerNo})
    },
    showInput(list, index, key, keyParent, isAdd = true) {
        
        if(keyParent) {
          this.$set(list[index][keyParent], key, true);
        }else {
          this.$set(list[index], key, true);
        }

        if(list.length -1 == index && isAdd) list.push({
          processesObj: this.$utils.deepCopy(this.tabs.calc.processesObj)
        })
    },
    showWorkProcedureInput(list, index, key) {
        
      this.$set(list[index], key, true);
      if(list.length -1 == index) list.push({
        id: new Date().getTime()
      })
    },
    save(saveAsDraft = false) {//报价 saveAsDraft是否保存草稿

      this.$refs.form.validate((valid) => {
        if (valid) {
      
          let params = {
            offerRecordStatus: saveAsDraft ? 10 : 20,
            requirementId: this.mrRequirementId,
            offerNo: this.tabs.calc.data.addOfferNo,
            currencyName: this.tabs.calc.data.currency.name || '',
            exchangeRateValue: this.tabs.calc.data.exchangeRateValue || '',
            managementFeeFloatingRatio: this.tabs.calc.data.managementFeeFloatingRatio || '',
            records: []
          };

          this.tabs.calc.data.records.map(item => {

            if(item.detNo) {
              let obj = {
                detNo: item.detNo || '',
                amount: parseInt(item.amount) || 0,
                stuffNo: item.stuffNo || '',
                length: parseFloat(item.length) || 0,
                width: parseFloat(item.width) || 0,
                height: parseFloat(item.height) || 0,
                orderPrice: parseFloat(item.orderPrice) || 0,
                copperProduct: parseFloat(item.copperProduct) || 0,
                stuffUnitPrice: parseFloat(item.stuffUnitPrice) || 0,
                freightUnitPrice: parseFloat(item.freightUnitPrice) || 0,
                weight: parseFloat(item.weight) || 0,
                qc: parseFloat(item.qc) || 0,
                totalTime: parseFloat(item.totalTime) || 0,
                steelProduct: parseFloat(item.steelProduct) || 0,
                rmbTotal: parseFloat(item.rmbTotal) || 0,
                rmbUnitPrice: parseFloat(item.rmbUnitPrice) || 0,
                unitPrice: parseFloat(item.unitPrice) || 0,
                lastTotalPrice: parseFloat(item.lastTotalPrice) || 0,
                processes: []
              }
              console.log(this.tabs.calc
                  .processesIdObj)
              for(let key in item.processesObj) {
                if(this.tabs.calc
                  .processesIdObj[key]) {
                  obj.processes.push({
                    componentWorkProcedureId: this.tabs.calc
                    .processesIdObj[key],
                    workTime: item.processesObj[key] || 0
                  })
                }
              }
              params.records.push(obj)
            }
          })

          if(!params.records.length) {

            this.$utils.showTip('warning', 'error', '-1100');
            return;
          }

          this.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.saveComponentOfferRecord, (res) =>  {

            this.isLoading = false;
            this.$utils.showTip('success', 'success', '117');
            this.back();
          }, () => this.isLoading = false, params)
        } else {
          
          return false;
        }
      });
    },
    getDropDownList() {

      this.getList(this.$utils.CONFIG.api.queryOffer, this.tabs.calc.filter, 'offerRecord', {mrRequirementId: this.mrRequirementId}); //零件报价记录列表
      this.getList(this.$utils.CONFIG.api.floatRatio, this.tabs.calc.filter, 'floatRatio'); //管理费用上浮比例列表
    },
    initWorkProcedure(res, isFirst = false) {

      //表头设置
      let allProcessOfIndex = [];
      let processesObj = {};
      let processesIdObj = {};
      if(res.data && res.data.length) {

        allProcessOfIndex = this.$utils.deepCopy(res.data || []);
        allProcessOfIndex.map(item => {

          processesObj[item.name] = '';
          processesIdObj[item.name] = item.componentWorkProcedureId
        })
      }
      this.tabs.calc.allProcessOfIndex = allProcessOfIndex;
      this.tabs.calc.processesObj = processesObj;
      this.tabs.calc.processesIdObj = processesIdObj;
      isFirst && (this.tabs.calc.data.records[0].processesObj = this.$utils.deepCopy(this.tabs.calc.processesObj));

      //工序设置弹框设置
      this.workProcedure = this.$utils.deepCopy(res.data || []);
      this.workProcedurePrice = {};
      this.workProcedure && this.workProcedure.map(item => this.workProcedurePrice[item.name] = item.price || 0) //工序价格对象赋值
      this.handle.setting.workProcedure = this.$utils.deepCopy(res.data && res.data.length ? res.data : [{}]) || [{}]; //工序赋值弹框数据
    },
    getWorkProcedure() { //零件工序查询

      this.$utils.getJson(this.$utils.CONFIG.api.queryWorkProcedure, (res) =>  {

        this.initWorkProcedure(res, true);

      }, () => this.isLoading = false, {mrRequirementId: this.mrRequirementId})
    },
    deleteWorkProcedure(row) { //删除零件工序
      
      this.handle.setting.workProcedure = this.handle.setting.workProcedure.filter(item => (item.componentWorkProcedureId != row.componentWorkProcedureId || (item.id && item.id != row.id)))
    },
    getRepeatWorkProcedure() { //获取重复的工序名称

      let arr = this.handle.setting.workProcedure;
      let repeatWorkProcedureArr = [];

      for(let i = 0; i < arr.length; i++) {

        for(let j = i+1; j < arr.length; j++) {
          
          if(arr[i].name && arr[i].name == arr[j].name && repeatWorkProcedureArr.indexOf(arr[i].name) == -1) {

            repeatWorkProcedureArr.push(arr[i].name);
          }
        }
      }

      return repeatWorkProcedureArr
    },
    setProcessInfo() { //工序设置

      let repeatArr = this.getRepeatWorkProcedure();
      if(repeatArr.length) {

        this.$utils.showTip('warning', 'error', '', `${repeatArr.join('、')}工序名有重复！`);
        return;
      }

      let params = [];
      for(let i = 0; i < this.handle.setting.workProcedure.length; i++) {

        let item = this.handle.setting.workProcedure[i];

        if(item.name) {

          if(item.name.toUpperCase() == 'QC') {

            this.$utils.showTip('warning', 'error', '', `工序名不能为QC`);
            return;
          }else {

            params.push({
              componentWorkProcedureId: item.componentWorkProcedureId || '',
              name: item.name || '',
              price: parseFloat(item.price) || 0,
              requirementId: this.mrRequirementId || ''
            })
          }
        }
      }
      
      this.handle.setting.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.setProcessInfo, (res) =>  {

        this.handle.setting.isLoading = false;
        this.handle.setting.dialogVisible = false;
        this.$utils.showTip('success', 'success', '121');

        this.initWorkProcedure(res, false);

        let data = this.tabs.calc.data;
        if(data.records && data.records.length) { //更新表格工序数据
          data.records.map(item => {

            let processesObj = this.$utils.deepCopy(item.processesObj);
            item.processesObj = this.$utils.deepCopy(this.tabs.calc.processesObj);
            
            for(let key in item.processesObj) {

              item.processesObj[key] = processesObj[key] || processesObj[key] == 0 ? processesObj[key] : ''; 
            }
          })
        }
      }, () => this.handle.setting.isLoading = false, params)
    },
  },
  computed: {
    qc() { //qc

      return function(row) {

        let qc = 0;

        for(let key in row.processesObj) {
          if(key != 'BENCH' && key != '编程' && key != '电极设计' && key != '设计') {
            qc += (parseFloat(row.processesObj[key]) || 0);
          }
        }
    
        qc = (qc*0.1).toFixed(1);
        this.$set(row, 'qc', qc);
      }
    },
    totalTime() { //总工时

      return function(row) {

        let totalTime = 0;
        for(let key in row.processesObj) {
          totalTime += (parseFloat(row.processesObj[key]) || 0);
        }
        totalTime = totalTime.toFixed(1);

        this.$set(row, 'totalTime', totalTime);
      }
    },
    steelProduct() { //钢材

      return (row) => {

        let steelProduct = 0;
        steelProduct = (parseFloat(row.weight) || 0) * ((parseFloat(row.stuffUnitPrice) || 0) + (parseFloat(row.freightUnitPrice) || 0)) //重量*(材料 + 运费)
        steelProduct = steelProduct.toFixed(1);
        
        this.$set(row, 'steelProduct', steelProduct);
      }
    },
    rmbTotal() { //合计人民币

      return (row) => {

        let rmbTotal = 0;
       
        for(let key in row.processesObj) {

          rmbTotal += (parseFloat(row.processesObj[key]) || 0) * (parseFloat(this.workProcedurePrice[key]) || 0);
        }
        rmbTotal += ((parseFloat(row.orderPrice) || 0) + (parseFloat(row.copperProduct) || 0) + (parseFloat(row.steelProduct) || 0)) * (parseFloat(row.amount) || 0);

        this.$set(row, 'rmbTotal', row.detNo ? rmbTotal.toFixed(1) : '') //合计人民币
      }
    },
    rmbUnitPrice() { //单价人民币

      return (row) => {

        let rmbUnitPrice = 0;
       
        if(row.rmbTotal && parseFloat(row.rmbTotal) > 0 && row.amount && parseFloat(row.amount) > 0) {
          rmbUnitPrice = parseFloat(row.rmbTotal) / parseFloat(row.amount);
        }

        this.$set(row, 'rmbUnitPrice', rmbUnitPrice.toFixed(1) || '');
      }
    },
    unitPrice() { //单价

      return (row) => {

        let unitPrice = 0;
       
        if(row.rmbUnitPrice && parseFloat(row.rmbUnitPrice) > 0 && this.tabs.calc.data.exchangeRateValue && parseFloat(this.tabs.calc.data.exchangeRateValue) > 0) {

          unitPrice = parseFloat(row.rmbUnitPrice) / parseFloat(this.tabs.calc.data.exchangeRateValue);
        }

        this.$set(row, 'unitPrice', unitPrice.toFixed(1) || '');
      }
    },
    lastTotalPrice() { //最终价格

      return (row) => {

        let lastTotalPrice = 0;
        
        lastTotalPrice = parseFloat(row.unitPrice) + row.unitPrice*(parseFloat(this.tabs.calc.data.managementFeeFloatingRatio) || 0);
        
        this.$set(row, 'lastTotalPrice', lastTotalPrice.toFixed(1) || '');
      }
    },
    weight() { //重量

      return (row) => {

        let weight = 0;

        weight = (parseFloat(row.length) || 0) * (parseFloat(row.width) || 0) * (parseFloat(row.height) || 0) * 7.9 / 1000000;
        
        this.$set(row, 'weight', weight.toFixed(1) || '');
      }
    },
    totalWeight() { //总重量

      return (row) => {

        let totalWeight = 0;

        totalWeight = (parseFloat(row.weight) || 0) * (parseFloat(row.amount) || 0);
        
        this.$set(row, 'totalWeight', totalWeight.toFixed(1) || '');
      }
    },
    offerTotalPrice() { //总价

      return () => {

        let offerTotalPrice = 0;

        this.tabs.calc.data.records && this.tabs.calc.data.records.map(item => {

          offerTotalPrice += (parseFloat(item.rmbTotal) || 0)
        })

        this.$set(this.tabs.calc.data, 'offerTotalPrice', offerTotalPrice.toFixed(1) || '')
      }
    },
    totalPrice() { //总价

      return () => {

        let totalPrice = 0;

        if(this.tabs.calc.data.exchangeRateValue && parseFloat(this.tabs.calc.data.exchangeRateValue) > 0) {

          totalPrice = this.tabs.calc.data.offerTotalPrice / parseFloat(this.tabs.calc.data.exchangeRateValue);
        }

        this.$set(this.tabs.calc.data, 'totalPrice', totalPrice.toFixed(1))
        //交易货币总价
      }
    }
  },
  created() {

    if(!this.$route.params.id) return;
    this.mrRequirementId = this.$route.params.id;
    this.getDetail(); //需求详情
    this.getWorkProcedure(); //零件工序列表
    this.getDropDownList(); //下拉列表
    
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
