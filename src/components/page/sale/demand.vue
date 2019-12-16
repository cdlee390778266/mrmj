<template>
  <div>
    <div class="main">
      <div class="main-right">
        <div class="main-right-title tl">销售 / 报价管理</div>
        <div class="mgt20">
          <el-form :model="form" :inline="true" size="small" ref="form" class="table-out">
            <el-form-item label="客户" prop="customerName">
              <el-input v-model="form.customerName" style="width: 170px" />
            </el-form-item>
            <el-form-item label="报价单号" prop="offerNo">
              <el-input v-model="form.offerNo" style="width: 170px" />
            </el-form-item>
            <el-form-item label="客户项目编号" prop="customerProjectNo">
              <el-input v-model="form.customerProjectNo" style="width: 170px" />
            </el-form-item>
            <el-form-item label="" class="pdl40">
              <el-button type="primary" size="small" @click="search">查询</el-button>
              <el-button type="primary" size="small" @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="table.data"
          :height="maxHeight"
          :max-height="maxHeight"
          :default-expand-all="true"
          size="mini"
          class="content-table green-table"
          style="width: 100%"
          v-loading="table.isLoading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                :show-header="false"
                :data="props.row.rpOfferListDtoList"
                size="mini"
                class="content-table orage-table"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props1">
                    <el-table
                      :show-header="false"
                      :data="props1.row.rpOfferListRecordlDtoList"
                      stripe
                      size="mini"
                      class="content-table blue-table"
                      style="width: 100%">
                      <el-table-column type="expand"></el-table-column>
                      <el-table-column label="客户名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{props.row.name | filterNull}}
                        </template>
                      </el-table-column>
                      <el-table-column label="客户项目编号" width="100" show-overflow-tooltip>
                        {{props1.row.customerProjectNo | filterNull}}
                      </el-table-column>
                      <el-table-column label="客户询价编号" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.customerEnquiryNo | filterNull}}
                        </template>
                      </el-table-column>
                      <el-table-column label="询价时间" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.customerEnquiryDateString | filterNull}}
                        </template>
                      </el-table-column>
                      <el-table-column label="报价单编号" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.offerNo | filterNull}}
                        </template>
                      </el-table-column>
                      <el-table-column label="版本" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.offerVersion | filterNull}}
                        </template>
                      </el-table-column>
                      <el-table-column label="总价" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.offerTotalPrice | filterNull}}
                        </template>
                      </el-table-column>
                      <el-table-column label="要求交货日期" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                          {{scope.row.deliveryDateString | filterNull}}
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
                      <el-table-column label="操作" width="260" align="center">
                        <template slot-scope="scope"> 
                          <el-button type="info" size="mini">下单</el-button>
                          <el-button type="primary" size="mini" @click="showOfferDialog(scope.row, 'edit')">修改</el-button>
                          <el-button type="success" size="mini">详情</el-button>
                          <el-button type="danger" size="mini">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="客户名称" min-width="160" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{props.row.name | filterNull}}
                  </template>
                </el-table-column>
                <el-table-column label="客户项目编号" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.customerProjectNo | filterNull}}
                  </template>
                </el-table-column>
                <el-table-column label="客户询价编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="询价时间" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="报价单编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="版本" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="总价" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="要求交货日期" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="260" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="showProjectDialog(scope.row, 'edit')">修改</el-button>
                    <el-button type="danger" size="mini" @click="delOffer(scope.row)">删除</el-button>
                    <el-button type="success" size="mini" @click="showOfferDialog(scope.row, 'add')">报价</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="客户名称" min-width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <strong>{{scope.row.name | filterNull}}</strong>
            </template>
          </el-table-column>
          <el-table-column label="客户项目编号" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="客户询价编号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="询价时间" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="报价单编号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="版本" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="总价" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="要求交货日期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="备注" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="260" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showProjectDialog(scope.row, 'add')">新增项目</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog :title="`${handle.project.type == 'add' ? '新增' : '修改'}项目`" :visible.sync="handle.project.dialogVisible" width="600px">
      <el-form ref="projectForm" :model="handle.project.form" :rules="handle.project.rules" v-loading="handle.project.isLoading">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="customerProjectNo" label="客户项目编号：" label-width="130px" class="mgt20">
              <el-input v-model="handle.project.form.customerProjectNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="offerNo" label="报价编号：" label-width="130px">
              <el-input v-model="handle.project.form.offerNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <p class="mgb10">
              上传文件：
              <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                <el-button size="mini" type="primary">选择上传文件</el-button>
                <input type="file" name="file" ref="file" class="posFull opacity0" @change="() => addAttachments($refs.file, handle.project)">
              </span>
            </p>
            <el-table
              :data="handle.project.form.attachments"
              max-height="160"
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="fileName" label="附件名称"></el-table-column>
              <el-table-column label="操作" width="100px" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="() => deleteAttachments(scope.row, handle.project)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="remark" label="说明" class="mgt20">
              <el-input type="textarea" v-model="handle.project.form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDataAfterFile(handle.project, editOffer, 'projectForm')">保存</el-button>
        <el-button @click="handle.project.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="`${handle.offer.type == 'add' ? '新增' : '修改'}报价`" :visible.sync="handle.offer.dialogVisible" width="1000px">
      <offer :type="handle.offer.type" :customerId="selectCustomerId" :data="offerData" @success="editOfferRecordSuccess" style="height: 500px" v-if="handle.offer.dialogVisible"></offer>
    </el-dialog>
   
    <el-dialog title="新增模具零件订单" :visible.sync="handle.order.dialogVisible" width="820px">
      <el-form ref="orderForm" :model="handle.order.form" :rules="handle.order.rules" label-width="110px" v-loading="handle.order.isLoading">
        <div class="dflex">
          <div class="flex pdr10">
            <el-form-item prop="name" label="客户">
              <el-input v-model="handle.order.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="customerPoNo" label="客户PO.号">
              <el-input v-model="handle.order.form.customerPoNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="mouldNo" label="模具号">
              <el-input v-model="handle.order.form.mouldNo" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="
              requirementTypeText" label="需求类型">
              <el-select v-model="handle.order.form.requirementTypeText">
                <el-option label="模具零件" value="模具零件"></el-option>
                <el-option label="整体模具" value="整体模具"></el-option>
              </el-select>
            </el-form-item> -->
          </div>
          <el-upload
            class="avatar-uploader"
            name="files"
            :action="$utils.CONFIG.api.uploadFiles"
            :show-file-list="false"
            :on-success="handleAvatarOrderSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="handle.order.form.userFace" :src="handle.order.form.userFace" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="mgb20">
          <p>零件清单：</p>
          <el-table :data="handle.order.form.componentOrders" max-height="160" border size="mini" class="edit-table" style="width: 100%">
            <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'componentNoEdit', {})">
                    <div class="ellipsis">{{ scope.row.componentNo }}</div>
                    <el-input size="mini" v-model="scope.row.componentNo" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'componentNoEdit', {}, false)" @blur="scope.row.componentNoEdit = false" :style="{opacity: scope.row.componentNoEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" min-width="88" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'quantityEdit', {})">
                    <div class="ellipsis">{{ scope.row.quantity }}</div>
                    <el-input size="mini" v-model="scope.row.quantity" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'quantityEdit', {}, false)" @blur="scope.row.quantityEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.quantityEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'customerNoEdit', {})">
                    <div class="ellipsis">{{ scope.row.customerNo }}</div>
                    <el-input size="mini" v-model="scope.row.customerNo" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'customerNoEdit', {}, false)" @blur="scope.row.customerNoEdit = false" :style="{opacity: scope.row.customerNoEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="要求交期" show-overflow-tooltip align="center" width="100">
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'deliveryDateEdit', {})">
                    <div class="ellipsis tc">{{ scope.row.deliveryDate }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.deliveryDate"
                      @focus="showInput(handle.order.form.componentOrders, scope.$index, 'deliveryDateEdit', {})"
                      @blur="scope.row.deliveryDateEdit = false"
                      :style="{opacity: scope.row.deliveryDateEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center" min-width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'componentPriceEdit', {})">
                    <div class="ellipsis">{{ scope.row.componentPrice }}</div>
                    <el-input size="mini" v-model="scope.row.componentPrice" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'componentPriceEdit', {}, false)" @blur="scope.row.componentPriceEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.componentPriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="componentTotal" label="总价" min-width="88" align="center" class="notEdit" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="说明" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'descriptionEdit', {})">
                    <div class="ellipsis">{{ scope.row.description }}</div>
                    <el-input size="mini" v-model="scope.row.description" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'descriptionEdit', {}, false)" @blur="scope.row.descriptionEdit = false" :style="{opacity: scope.row.descriptionEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <div class="mgb10 dflex el-form-item-mgb0" style="line-height: 32px;">
            {{saleTotalPrice}}
            <div class="flex">订单总价(RMB)：{{handle.order.form.saleTotalPrice}}</div>
            <div class="flex">
              <el-form-item prop="currency" label="常用货币">
                <el-select size="mini" v-model="handle.order.form.currency" value-key="name"  @change="(currency) => handle.order.form.settlementExchangeRate = ''">
                  <el-option v-for="(item, index) in $dict.currencyList" :key="item.name" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item prop="settlementExchangeRate" label="汇率">
                <el-select size="mini" v-model="handle.order.form.settlementExchangeRate">
                  <template v-if="handle.order.form.currency">
                    <el-option v-for="(item, index) in handle.order.form.currency.currencyRates" :key="index" :label="item.value" :value="item.value"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item prop="settlementCurrencyTotalPrice" label="结算货币总价:">
                <el-input size="mini" v-model="handle.order.form.settlementCurrencyTotalPrice" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <p class="mgb10">
            上传附件：
            <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
              <el-button size="mini" type="primary">选择上传文件</el-button>
              <input type="file" name="file" ref="fileOrder" class="posFull opacity0" @change="() => addAttachments($refs.fileOrder, handle.order)">
            </span>
          </p>
          <el-table
            :data="handle.order.form.attachments"
            height="160"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="fileName" label="资料名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="deleteAttachments(scope.row, handle.order)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.order.form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.order.judgeType = 1; checkMouldNo();">下达订单</el-button>
        <el-button type="primary" @click="handle.order.judgeType = 2;saveFileAndData(handle.order, saveOrder);">存为草稿</el-button>
        <el-button @click="handle.order.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  import Offer from './offer'
  export default {
    mixins: [leftMixin],
    components: {Offer},
    data() {

      return {
        selectCustomerId: '',
        offerData: {},
        form: {
          customerName: '',
          offerNo: '',
          customerProjectNo: ''
        },
        handle: {
          project: { //项目
            dialogVisible: false,
            isLoading: false,
            type: 'add',
            row: {},
            data: {},
            addFiles: [],
            form: {
              customerProjectNo: '',
              offerNo: '',
              attachments: [],
              remark: ''
            },
            rules: {
              customerProjectNo: [
                { required: true, message: this.$utils.getTipText('error', '-1113')},
              ],
            }
          },
          offer: { //项目
            dialogVisible: false,
            isLoading: false,
            type: 'add',
          },
          update: {
            dialogVisible: false,
            isLoading: false,
            type: 'add',
            item: {},
            attachments: [],
            addFiles: [],
            form: {
              userFace: '',
              fileId: "",
              name: "",
              customerPoNo: "",
              requirementTypeText: "模具零件",
              requirementNum: "",
              deliveryDateString: new Date(),
              components: [{}],
              attachments: [],
              remark: ''
            },
            rules: {
              name: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
              ],
              customerPoNo: [
                { required: true, message: this.$utils.getTipText('error', '-1086')},
              ]
            }
          },
          stop: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {
              causeTypeText: "",
              description: ""
            },
            rules: {
              causeTypeText: [
                { required: true, message: this.$utils.getTipText('error', '-1085')},
              ]
            }
          },
          order: {
            dialogVisible: false,
            isLoading: false,
            judgeType: 1,
            item: {},
            attachments: [],
            addFiles: [],
            form: {
              currency: {},
              userFace: '',
              fileId: "",
              name: '', 
              mouldNo: '', 
              customerPoNo: '',
              saleOrderTypeText: '',
              settlementCurrency: '',
              settlementExchangeRate: '',
              settlementCurrencyTotalPrice: '',
              saleTotalPrice: '',
              components: [],
              attachments: [],
              remark: ''
            },
            rules: {
              name: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
              ],
              customerPoNo: [
                { required: true, message: this.$utils.getTipText('error', '-1086')},
              ],
              mouldNo: [
                { required: true, message: this.$utils.getTipText('error', '-1090')},
              ],
              settlementExchangeRate: [
                { required: true, message: this.$utils.getTipText('error', '-1092')},
              ],
              settlementCurrencyTotalPrice: [
                { required: true, message: this.$utils.getTipText('error', '-1093')},
              ],
            }
          }
        }
      };
    },
    methods: {
      getData() {

        let params = {
          customerName: this.form.customerName,
          offerNo: this.form.offerNo,
          customerProjectNo: this.form.customerProjectNo
        }

        this.table.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryOfferList, (res) => {

          this.table.isLoading = false;
          this.table.srcData = res.data || [];
          this.table.data = this.$utils.deepCopy(this.table.srcData);
        }, () => this.table.isLoading = false, params)
      },
      showProjectDialog(row, type = 'edit') {

        this.resetForm('projectForm');
        this.handle.project.type = type;
        this.handle.project.row = row;
        this.handle.project.addFiles = [];
        this.handle.project.form.attachments = [];
        this.handle.project.dialogVisible = true;

        if(type == 'add') return;

        this.handle.project.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryOfferDetail, (res) => {

          this.handle.project.isLoading = false;
          this.handle.project.form = res.data || {}; 
        }, () => this.handle.project.isLoading = false, {offerId: row.offerId})
      },
      editOffer(res) { //新增OR编辑项目信息

        let params = {
          customerId: this.handle.project.row.customerId,
          customerProjectNo: this.handle.project.form.customerProjectNo,
          offerNo: this.handle.project.form.offerNo,
          remark: this.handle.project.form.remark,
          attachments: []
        }

        if(res && res.data) {

          params.attachments.push({
            attachmentId: res.data.attachmentId
          })
        }

        if(this.handle.project.type == 'edit') {

          params.offerId = this.handle.project.row.offerId;
        }

        this.$utils.getJson(this.$utils.CONFIG.api.editOffer, (res) => {

          this.handle.project.isLoading = false;
          this.handle.project.dialogVisible = false;
          this.$utils.showTip('success', 'success', '117');
          this.search();
        }, () => this.handle.project.isLoading = false, params)
      },
      delOffer(row) { //删除项目
        
        let params = {
          offerId: row.offerId,
          customerId: row.customerId
        }

        this.table.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.delOffer, (res) => {

          this.table.isLoading = false;
          this.$utils.showTip('success', 'success', '116');
          this.search();
        }, () => this.table.isLoading = false, params)
      },
      showOfferDialog(row, type = 'edit') {

        this.handle.offer.type = type;
        this.handle.offer.row = row;
        this.selectCustomerId = row.customerId;
        this.offerData = row;
        this.handle.offer.dialogVisible = true;

        if(type == 'add') return;

        this.handle.offer.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryOfferDetail, (res) => {

          this.handle.offer.isLoading = false;
          this.handle.offer.form = res.data || {}; 
        }, () => this.handle.offer.isLoading = false, {offerId: row.offerId})
      },
      editOfferRecordSuccess() {

        this.handle.offer.dialogVisible = false;
        this.search();
      },
      handleAvatarSuccess(res, file) { //上传头像
        
        this.handle.update.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.update.form.fileId = res.data[0].fileId;
      },
      handleAvatarOrderSuccess(res, file) { //上传头像

        this.handle.order.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.order.form.fileId = res.data[0].fileId;
      },
      showStopDialog(item) {

        this.$refs.stopForm && this.$refs.stopForm.resetFields();
        this.handle.stop.dialogVisible = true;
        this.handle.stop.data = item;
      },
      stop() { //终止
    
        this.$refs.stopForm.validate((valid) => {
          if (valid) {
            
            let params = {
              mrRequirementId: this.handle.stop.data.mrRequirementId,
              causeTypeText: this.handle.stop.form.causeTypeText,
              description: this.handle.stop.form.description
            };
            
            this.handle.stop.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.saveDemand, (res) =>  {

              this.handle.stop.isLoading = false;
              this.handle.stop.dialogVisible = false;
              this.$utils.showTip('success', 'success', '115');
              this.getData();
            }, () => this.handle.stop.isLoading = false, params)
          } else {
            
            return false;
          }
        });
      },
      getOrderDetail(item) { //订单详情

        let params = {
          mrRequirementId: item.mrRequirementId
        };

        this.handle.order.item = item;
        this.handle.order.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.querySaleOrderInModify, (res) =>  {

          this.handle.order.isLoading = false;
          let obj  = res.data || {};
          obj.componentOrders = obj.componentOrders || [{}];
          obj.settlementExchangeRate = obj.settlementExchangeRate || '';
          obj.attachments = obj.attachments || [];
          if(obj.fileId) {

            obj.userFace = `${this.$utils.CONFIG.api.image}?fileId=${obj.fileId}`;
          }else {

            obj.userFace = '';
          }
          if(obj.settlementCurrency && this.$dict.currencyList) {

            for(let i = 0; i < this.$dict.currencyList.length; i++) {

              if(this.$dict.currencyList[i].name == obj.settlementCurrency) {

                obj.currency = this.$dict.currencyList[i];
                break;
              }
            }
          }
          this.handle.order.form = obj;
          this.handle.order.originModulNo = this.handle.order.form.mouldNo || '';
        }, () => obj.isLoading = false, params)
      },
      checkMouldNo() { //模具号验重

        if(!this.handle.order.form.mouldNo) {

          this.$utils.showTip('warning', 'error', '-1090')
          return;
        }
        this.$utils.getJson(this.$utils.CONFIG.api.checkMouldNo, (res) => {

          if(res.data != 1) { //如果模具号重复

            this.$utils.showTip('warning', 'error', '-1094');
          }else {
            
            this.saveFileAndData(this.handle.order, this.saveOrder);
          }
        }, null, {mouldNo: this.handle.order.form.mouldNo})
      },
      saveOrder(res) { //下单

        this.$refs.orderForm.validate((valid) => {
          if (valid) {

            let params = {
              mrSaleOrderId: this.handle.order.form.mrSaleOrderId || '',
              mrRequirementId: this.handle.order.form.mrRequirementId || this.handle.order.item.mrRequirementId,
              judgeType: this.handle.order.judgeType,
              name: this.handle.order.form.name, 
              createBy: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName),
              fileId: this.handle.order.form.fileId,
              mouldNo: this.handle.order.form.mouldNo, 
              customerPoNo: this.handle.order.form.customerPoNo,
              saleOrderTypeText: this.handle.order.item.requirementTypeText,
              settlementCurrency: this.handle.order.form.currency.name,
              settlementExchangeRate: this.handle.order.form.settlementExchangeRate,
              settlementCurrencyTotalPrice: parseFloat(this.handle.order.form.settlementCurrencyTotalPrice) || 0,
              saleTotalPrice: this.handle.order.form.saleTotalPrice,
              componentOrders: [],
              attachments: [],
              remark: this.handle.order.form.remark
            };
            
            let componentOrders = [];
            this.handle.order.form.componentOrders && this.handle.order.form.componentOrders.map(item => {

              if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {
                componentOrders.push({
                  componentNo: item.componentNo,
                  quantity: parseInt(item.quantity) || 0,
                  customerNo: item.customerNo,
                  deliveryDate: item.deliveryDate,
                  componentPrice: parseInt(item.componentPrice) || 0,
                  componentTotal: item.componentTotal,
                  description: item.description
                })
              }
            })

            if(!componentOrders || !componentOrders.length ) {

              this.handle.order.isLoading = false;
              this.$utils.showTip('warning', 'error', '-1084');
              return;
            }

            params.componentOrders = componentOrders;

            params.attachments = [];
            if(res && res.data && res.data.length) { //附件

              res.data.map(item => params.attachments.push({
                fileId: item.fileId,
                fileName: item.fileName
              }))
            }
            this.handle.order.form.attachments &&  this.handle.order.form.attachments.map(item => {

              if(item.type != 'add') {
                params.attachments.push({
                  fileId: item.fileId,
                  fileName: item.fileName
                })
              }
            })

            this.handle.order.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.saveSaleOrder, (res) =>  {

              this.handle.order.isLoading = false;
              this.handle.order.dialogVisible = false;
              this.$utils.showTip('success', 'success', '117');
              this.getData();
            }, () => this.handle.order.isLoading = false, params)
          }else {

            this.handle.order.isLoading = false;
          }
        })
      },
      setTableMaxHeight() {

        this.maxHeight = this.$utils.getTableMaxHeight(['.main-right-title', '.table-out']);
      },
      refresh() {}
    },
    computed: {
      saleTotalPrice() {

        let saleTotalPrice = 0;
        this.handle.order.form.componentOrders && this.handle.order.form.componentOrders.map(item => {

          if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {

            saleTotalPrice += (parseInt(item.quantity) || 0) * (parseFloat(item.componentPrice) || 0);
          }
        })

        this.handle.order.form.saleTotalPrice = saleTotalPrice;
      }
    },
    created() {
      this.getData();
    },
    updated() {
      this.setTableMaxHeight();
      window.onresize = this.setTableMaxHeight;
    }
  };
</script>


<style scoped lang="scss">
</style>