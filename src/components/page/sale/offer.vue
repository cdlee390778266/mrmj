<template>
  <div v-loading="isLoading">
    <el-form ref="form" :model="form" :rules="rules" :inline="true" :hide-required-asterisk="!canEdit" label-width="100px" class="mgtb20" :class="{read: !canEdit}">
      <el-row>
        <el-col :span="16">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              报价计算
              <span class="mgl20">人民币总价：{{totalPrice()}}{{form.totalPrice}}</span>
              <span class="mgl20">调整后人民币总价：{{adjustmentTotalPrice()}}{{form.adjustmentTotalPrice}}</span>
              <span class="mgl20">外币总价：{{wbTotalPrice()}}{{form.wbTotalPrice}}</span>
              <span class="mgl20">调整后外币总价：{{wbAdjustmentTotalPrice()}}{{form.wbAdjustmentTotalPrice}}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="mgt10">
          <el-form-item label="客户名称：" size="mini">
            <div style="width: 100px;" class="ellipsis">{{this.customer.name}}</div>
          </el-form-item>
          <el-form-item label="联系人：" prop="customerContactsId" size="mini">
            <div v-if="!canEdit" class="w100 ellipsis">{{form.customerContactsId | filterNull}}</div>
            <el-select size="mini" style="width: 100px;" v-else v-model="form.customerContactsId">
              <el-option v-for="(item, index) in filters.contacts" :key="index" :label="item.name" :value="item.customerContactsId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报价单号：" prop="offerNo" size="mini">
            <div v-if="!canEdit" class="w100 ellipsis">{{form.offerNo | filterNull}}</div>
            <el-input v-else v-model="form.offerNo" style="width: 100px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="佣金率：" prop="commissionRate" size="mini">
            <div v-if="!canEdit" class="w100 ellipsis">{{form.commissionRate | filterNull}}%</div>
            <el-input v-else v-model="form.commissionRate" style="width: 100px;">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="费用率：" prop="costRate" size="mini">
            <div v-if="!canEdit" class="w100 ellipsis">{{form.costRate | filterNull}}%</div>
           <el-input v-else v-model="form.costRate" style="width: 100px;">
             <template slot="append">%</template>
           </el-input>
          </el-form-item>
          <el-form-item label="调整率：" prop="adjustmentRate" size="mini">
            <div v-if="!canEdit" class="w100 ellipsis">{{form.costRate | filterNull}}%</div>
            <el-input v-else v-model="form.adjustmentRate" style="width: 100px;">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="currencyName" label="交易货币：">
            <div v-if="!canEdit" class="w100 ellipsis">{{form.currencyName | filterNull}}%</div>
            <el-select v-else v-model="form.currencyName" value-key="currencyName" size="mini" style="width: 100px;">
              <el-option v-for="item in $dict.currencyList" :key="item.currencyName" :label="item.currencyName" :value="item.currencyName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="汇率：" prop="exchangeRateVal" size="mini">
            <div v-if="!canEdit" class="w100 ellipsis">{{form.exchangeRateVal | filterNull}}%</div>
            <el-select v-else v-model="form.exchangeRateVal"  style="width: 100px;">
              <el-option v-for="item in $dict.exchangeRateList" :key="item.exchangeRateId" :label="item.exchangeRateVal" :value="item.exchangeRateVal"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="type == 'order'">
          <el-form-item prop="currencyName" label="模具号：">
            <div class="w100 ellipsis">{{orderSerialNo.mouldNo | filterNull}}</div>
          </el-form-item>
          <el-form-item label="订单号：" prop="exchangeRateVal" size="mini">
            <div class="w100 ellipsis">{{orderSerialNo.orderNo | filterNull}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mgb20">
          <el-table
            :data="table"
            border
            size="mini"
            style="width: 100%"
            height="276px"
            min-height="276px"
            class="edit-table gray-head mgt10"
            :highlight-current-row="true">
            <el-table-column label="零件编号" min-width="100"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'partNoEdit')">
                    <div class="ellipsis">{{ scope.row.partNo }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.partNo" @focus="showInput(table, scope.$index, 'partNoEdit')" @blur="scope.row.partNoEdit = false;" :style="{opacity: scope.row.partNoEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="80" align="center"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'countEdit')">
                    <div class="ellipsis">{{ scope.row.count }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.count" @focus="showInput(table, scope.$index, 'countEdit')" @blur="scope.row.countEdit = false;" :style="{opacity: scope.row.countEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="材料" width="140" align="center"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(table, scope.$index, 'stuffNoEdit')">
                    <div class="ellipsis">{{ scope.row.stuffNo }}</div>
                    <el-autocomplete
                      class="inline-input"
                      v-if="canEdit"
                      v-model="scope.row.stuffNo"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filters.stuff, 'name')"
                      valueKey="name"
                      value="stuffNo"
                      placeholder="请输入内容"
                      @focus="showInput(table, scope.$index, 'stuffNoEdit')"
                      @blur="scope.row.stuffNoEdit = false"
                      @select="data => scope.row.stuffId = data.stuffId"
                      :style="{opacity: scope.row.stuffNoEdit ? 1 : 0}"
                    ></el-autocomplete>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-for="(head, index) in heads" :key="index" :label="head.name" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, `${head.name}Edit`)">
                    <div class="ellipsis">{{ scope.row[head.name] }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row[head.name]" @focus="showInput(table, scope.$index, `${head.name}Edit`)" @blur="scope.row[`${head.name}Edit`] = false;" :style="{opacity: scope.row[`${head.name}Edit`] ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="QC" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
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
                  <div @click="showInput(table, scope.$index, 'orderPriceEdit')">
                    <div class="ellipsis">{{ scope.row.orderPrice }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.orderPrice" @focus="showInput(table, scope.$index, 'orderPriceEdit')" @blur="scope.row.orderPriceEdit = false;" :style="{opacity: scope.row.orderPriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="铜材" width="100" align="center"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'copperProductEdit')">
                    <div class="ellipsis">{{ scope.row.copperProduct }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.copperProduct" @focus="showInput(table, scope.$index, 'copperProductEdit')" @blur="scope.row.copperProductEdit = false;" :style="{opacity: scope.row.copperProductEdit ? 1 : 0}"/>
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
            <el-table-column label="外币单价" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  {{wbUnitPrice(scope.row)}}
                  {{scope.row.wbUnitPrice}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最终价格" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  {{wbTotal(scope.row)}}
                  {{scope.row.wbTotal}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="长" width="100" align="center"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'lengthEdit')">
                    <div class="ellipsis">{{ scope.row.length }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.length" @focus="showInput(table, scope.$index, 'lengthEdit')" @blur="scope.row.lengthEdit = false;" :style="{opacity: scope.row.lengthEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="宽" width="100" align="center"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'widthEdit')">
                    <div class="ellipsis">{{ scope.row.width }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.width" @focus="showInput(table, scope.$index, 'widthEdit')" @blur="scope.row.widthEdit = false;" :style="{opacity: scope.row.widthEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="高" width="100" align="center"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'heightEdit')">
                    <div class="ellipsis">{{ scope.row.height }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.height" @focus="showInput(table, scope.$index, 'heightEdit')" @blur="scope.row.heightEdit = false;" :style="{opacity: scope.row.heightEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="1片重量" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  {{onePieceOfWeight(scope.row)}}
                  {{scope.row.onePieceOfWeight}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="材料单价" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'stuffUnitPriceEdit')">
                    <div class="ellipsis">{{ scope.row.stuffUnitPrice }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.stuffUnitPrice" @focus="showInput(table, scope.$index, 'stuffUnitPriceEdit')" @blur="scope.row.stuffUnitPriceEdit = false;" :style="{opacity: scope.row.stuffUnitPriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="运费单价" width="100" align="center"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  <div @click="showInput(table, scope.$index, 'freightUnitPriceEdit')">
                    <div class="ellipsis">{{ scope.row.freightUnitPrice }}</div>
                    <el-input size="mini" v-if="canEdit" v-model="scope.row.freightUnitPrice" @focus="showInput(table, scope.$index, 'freightUnitPriceEdit')" @blur="scope.row.freightUnitPriceEdit = false;" :style="{opacity: scope.row.freightUnitPriceEdit ? 1 : 0}"/>
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
            <!-- <el-table-column label="钢材价格" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  {{totalWeight(scope.row)}}
                  {{scope.row.totalWeight}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="运费价格" class-name="column-notEdit" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div >
                  {{totalWeight(scope.row)}}
                  {{scope.row.totalWeight}}
                </div>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <div class="detail-footer tr" v-if="canEdit">
      <!-- <el-button type="primary" @click="saveAsDraft = false; onSubmitForm('form', save);">报价</el-button> -->
      <el-button type="primary" @click="saveAsDraft = true; onSubmitForm('form', save);">报价</el-button>
      <el-button type="primary" @click="dowloadOfferRecordPdf" v-if="type == 'edit'">生成报价单</el-button>
    </div>
    <div class="detail-footer tr" v-if="type =='order'">
      <el-button type="primary" @click="placeSaleOrder">下单</el-button>
    </div>
  </div>
</template>

<script>
import leftMixin from '../../../js/left-mixin'
export default {
  mixins: [leftMixin],
  props: ['type', 'customerId', 'data'],
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
      canEdit: true,
      isLoading: false,
      customer: {},
      orderSerialNo: {},
      filters: {
        contacts: [],
        stuff: []
      },
      form: {
        customerContactsId: '',
        offerNo: '',
        commissionRate: '',
        costRate: '',
        adjustmentRate: '',
        currencyName: '',
        exchangeRateVal: '',
      },
      rules: {
        customerContactsId: [
          { required: true, message: this.$utils.getTipText('error', '-1114')}
        ],
        offerNo: [
          { required: true, message: this.$utils.getTipText('error', '-1115')}
        ],
        commissionRate: [
          { required: true, message: this.$utils.getTipText('error', '-1116')}
        ],
        costRate: [
          { required: true, message: this.$utils.getTipText('error', '-1117')}
        ],
        adjustmentRate: [
          { required: true, message: this.$utils.getTipText('error', '-1118')}
        ],
        currencyName: [
          { required: true, message: this.$utils.getTipText('error', '-1119')}
        ],
        exchangeRateVal: [
          { required: true, message: this.$utils.getTipText('error', '-1120')}
        ]
      },
      heads: [],
      table: [{}],
      saveAsDraft: false, //是否保存为草稿
    };
  },
  computed: {
    qc() { //qc
      return function(row) {
      
        let qc = 0;
        this.heads && this.heads.map(item => {

          qc += (parseFloat(row[item.name]) || 0);
        })
    
        qc = (qc*0.1).toFixed(1);
        this.$set(row, 'qc', qc);
      }
    },
    totalTime() { //总工时

      return function(row) {

        let totalTime = 0;
        this.heads && this.heads.map(item => {

          totalTime += (parseFloat(row[item.name]) || 0);
        })

        totalTime += (parseFloat(row.qc) || 0);
        
        totalTime = totalTime.toFixed(1);

        this.$set(row, 'totalTime', totalTime);
      }
    },
    steelProduct() { //钢材

      return (row) => {

        let steelProduct = 0;
        steelProduct = (parseFloat(row.onePieceOfWeight) || 0) * ((parseFloat(row.stuffUnitPrice) || 0) + (parseFloat(row.freightUnitPrice) || 0)) //重量*(材料 + 运费)
        steelProduct = steelProduct.toFixed(1);
        
        this.$set(row, 'steelProduct', steelProduct);
      }
    },
    rmbTotal() { //合计人民币

      return (row) => {

        let rmbTotal = 0;
       
        this.heads && this.heads.map(item => {

          rmbTotal += (parseFloat(row[item.name]) || 0) * (parseFloat(item.price) || 0);
        })
        
        rmbTotal += ((parseFloat(row.orderPrice) || 0) + (parseFloat(row.copperProduct) || 0) + (parseFloat(row.steelProduct) || 0)) * (parseFloat(row.count) || 0);

        this.$set(row, 'rmbTotal', row.partNo ? rmbTotal.toFixed(1) : '') //合计人民币
      }
    },
    rmbUnitPrice() { //单价人民币

      return (row) => {

        let rmbUnitPrice = 0;
       
        if(row.rmbTotal && parseFloat(row.rmbTotal) > 0 && row.count && parseFloat(row.count) > 0) {
          rmbUnitPrice = parseFloat(row.rmbTotal) / parseFloat(row.count);
        }

        this.$set(row, 'rmbUnitPrice', rmbUnitPrice.toFixed(1) || '');
      }
    },
    wbUnitPrice() { //外币单价

      return (row) => {

        let wbUnitPrice = 0;
       
        if(row.rmbUnitPrice && parseFloat(row.rmbUnitPrice) > 0 && this.form.exchangeRateVal && parseFloat(this.form.exchangeRateVal) > 0) {

          wbUnitPrice = parseFloat(row.rmbUnitPrice) / parseFloat(this.form.exchangeRateVal);
        }

        this.$set(row, 'wbUnitPrice', wbUnitPrice.toFixed(1) || '');
      }
    },
    wbTotal() { //最终价格

      return (row) => {

        let wbTotal = 0;
        let rmbTotal = parseFloat(row.rmbTotal) || 0;
        let rate = (parseFloat(this.form.commissionRate || 0) + parseFloat(this.form.costRate || 0) + parseFloat(this.form.adjustmentRate || 0)) / 100;
        wbTotal = rmbTotal + rmbTotal*rate;
        wbTotal = wbTotal * parseFloat(this.form.exchangeRateVal || 0);
        
        this.$set(row, 'wbTotal', wbTotal.toFixed(1) || '');
      }
    },
    onePieceOfWeight() { //重量

      return (row) => {

        let onePieceOfWeight = 0;

        onePieceOfWeight = (parseFloat(row.length) || 0) * (parseFloat(row.width) || 0) * (parseFloat(row.height) || 0) * 7.9 / 1000000;
        
        this.$set(row, 'onePieceOfWeight', onePieceOfWeight.toFixed(1) || '');
      }
    },
    totalWeight() { //总重量

      return (row) => {

        let totalWeight = 0;

        totalWeight = (parseFloat(row.onePieceOfWeight) || 0) * (parseFloat(row.count) || 0);
        
        this.$set(row, 'totalWeight', totalWeight.toFixed(1) || '');
      }
    },
    totalPrice() { //人民币总价

      return () => {

        let totalPrice = 0;

        this.table && this.table.map(item => {

          totalPrice += (parseFloat(item.rmbTotal) || 0)
        })

        this.$set(this.form, 'totalPrice', totalPrice.toFixed(1) || '')
      }
    },
    adjustmentTotalPrice() { //调整后人民币总价

      return () => {

        let adjustmentTotalPrice = 0;
        let totalPrice = parseFloat(this.form.totalPrice) || 0;
        let rate = (parseFloat(this.form.commissionRate || 0) + parseFloat(this.form.costRate || 0) + parseFloat(this.form.adjustmentRate || 0)) / 100;
        adjustmentTotalPrice = totalPrice + totalPrice*rate;

        this.$set(this.form, 'adjustmentTotalPrice', adjustmentTotalPrice.toFixed(1));
      }
    },
    wbTotalPrice() { //外币总价

      return () => {

        let wbTotalPrice = (parseFloat(this.form.totalPrice) || 0) * (parseFloat(this.form.exchangeRateVal || 0))

        this.$set(this.form, 'wbTotalPrice', wbTotalPrice.toFixed(1));
      }
    },
    wbAdjustmentTotalPrice() { //调整后外币总价

      return () => {

        let wbAdjustmentTotalPrice = 0;
        let wbTotalPrice = parseFloat(this.form.wbTotalPrice) || 0;
        let rate = (parseFloat(this.form.commissionRate || 0) + parseFloat(this.form.costRate || 0) + parseFloat(this.form.adjustmentRate || 0)) / 100;
        wbAdjustmentTotalPrice = wbTotalPrice + wbTotalPrice*rate;

        this.$set(this.form, 'wbAdjustmentTotalPrice', wbAdjustmentTotalPrice.toFixed(1));
      }
    }
  },
  methods: {
    getCustomerDetail() { //客户信息

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.customerDetail, (res) => {

        this.isLoading = false;
        this.customer = res.data || {};
        this.filters.contacts = res.data && res.data.contacts ? res.data.contacts : [];
      }, () => this.isLoading = false, {customerId: this.customerId})
    },
    save() {//报价

      let params = {
        adjustmentRate: this.form.adjustmentRate,
        areaName: this.form.areaName,
        commissionRate: this.form.commissionRate,
        currencyName: this.form.currencyName,
        customerContactsId: this.form.customerContactsId,
        customerEnquiryDate: this.form.customerEnquiryDate,
        customerId: this.customerId,
        offerId: this.data.offerId,
        exchangeRateVal: this.form.exchangeRateVal,
        offerNo: this.form.offerNo,
        offerVersion: this.form.offerVersion,
        deliveryDate: this.form.deliveryDate,
        rqOfferRecordDetailDtoList: []
      }

      if(this.type == 'edit') params.offerRecordId = this.data.offerRecordId;

      this.table.map(item => {

        if(item.partNo) {

        let saleOfferRecordDetailProcessList = [];
          this.heads.map(process => {

            saleOfferRecordDetailProcessList.push({
              processId: process.processId,
              processName: process.name,
              processPrice: process.price,
              processTime: parseFloat(item[process.name]) || 0,
            })
          })
          let data = {
            partNo: item.partNo, 
            count: item.count, 
            stuffId: item.stuffId, 
            qc: item.qc, 
            totalTime: item.totalTime, 
            orderPrice: item.orderPrice, 
            copperProduct: item.copperProduct, 
            steelProduct: item.steelProduct,
            rmbTotal: item.rmbTotal,
            rmbUnitPrice: item.rmbUnitPrice,
            wbUnitPrice: item.wbUnitPrice,
            wbTotal: item.wbTotal,
            length: item.length,
            height: item.height,
            onePieceOfWeight: item.onePieceOfWeight,
            stuffUnitPrice: item.stuffUnitPrice,
            freightUnitPrice: item.freightUnitPrice,
            totalWeight: item.totalWeight,
            saleOfferRecordDetailProcessList: saleOfferRecordDetailProcessList
          }

          if(this.type == 'edit') data.offerRecordDetailId = item.offerRecordDetailId;

          params.rqOfferRecordDetailDtoList.push(data)
        }
      })
      
      if(!params.rqOfferRecordDetailDtoList.length) {

        this.$utils.showTip('warning', 'error', '-1079');
        return;
      }

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.editOfferRecord, (res) => {

        this.isLoading = false;
        this.$emit('success');
        this.$utils.showTip('success', 'success', '117');
      }, () => this.isLoading = false, params)    
    },
    dowloadOfferRecordPdf() {

      location.href = `${this.$utils.CONFIG.api.dowloadOfferRecordPdf}?offerRecordId=${this.data.offerRecordId}`;
    },
    getDropDownList() {

      //this.getList(this.$utils.CONFIG.api.queryOffer, this.filters, 'offerRecord', {mrRequirementId: this.mrRequirementId}); //零件报价记录列表
      this.getList(this.$utils.CONFIG.api.queryStuffList, this.filters, 'stuff'); //获取材料列表
    },
    queryOrderListTitle() { //获取工序表头

      this.$utils.getJson(this.$utils.CONFIG.api.queryProcessList, (res) => {

        this.heads = res.data || [];
      })
    },
    queryOfferRecord() { //查询记录
      
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOfferRecord, (res) => {

        this.isLoading = false;

        if(res.data && res.data.saleOfferRecord) {

          this.form = res.data.saleOfferRecord;
          let table = this.form.saleOfferRecordDetails && this.form.saleOfferRecordDetails.length ? this.form.saleOfferRecordDetails : [{}];
          table.map(item => {

            if(item.process) item = Object.assign({}, item, item.process);
          })

          this.table = table;
        }  
      }, () => this.isLoading = false, {offerRecordId: this.data.offerRecordId})
    },
    queryOrderSerialNo() { //查询订单流水号

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOrderSerialNo, (res) => {

        this.isLoading = false;
        this.orderSerialNo = res.data || {};
      }, () => this.isLoading = false, {})
    },
    placeSaleOrder() { //下单

      let params = {
        offerRecordId: this.data.offerRecordId,
        mouldNo: this.orderSerialNo.mouldNo,
        orderNo: this.orderSerialNo.orderNo,
        orderType: 0,
        attachmentList: []
      }

      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.placeSaleOrder, (res) => {

        
        this.isLoading = false;
        this.$emit('success');
        this.$utils.showTip('success', 'success', '117');
      }, () => this.isLoading = false, params)
    },
    refresh() {

      this.getCustomerDetail(); //客户详情
      this.getDropDownList();
    }
  },
  created() {

    this.refresh();
    this.queryOrderListTitle(); //零件工序列表
    
    if(this.type == 'edit' || this.type == 'read' || this.type == 'order') this.queryOfferRecord();

    if(this.type == 'order') this.queryOrderSerialNo();

    if(this.type == 'read' || this.type == 'order') this.canEdit = false;
  },
};
</script>


<style scoped lang="scss">
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
  .el-form-item {
    margin-bottom: 15px;
  }
  .w100 {
    width: 100px;
  }
  .read {
    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
