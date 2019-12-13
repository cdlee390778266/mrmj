<template>
  <div>
    <div class="main">
      <div class="main-right">
        <div class="main-right-title tl">销售 / 订单管理</div>
        <div class="mgt20">
          <el-form :model="form" :inline="true" size="small" ref="form" class="table-out">
            <el-form-item label="下单时间" prop="customerName">
              <el-date-picker
                v-model="form.parameter"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
                placeholder="选择下单时间"
                style="width: 170px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.parameter" style="width: 170px" />
            </el-form-item>
            <el-form-item label="模具编号" prop="customerName">
              <el-input v-model="form.parameter" style="width: 170px" />
            </el-form-item>
            <el-form-item label="客户项目编号" prop="customerName">
              <el-input v-model="form.parameter" style="width: 170px" />
            </el-form-item>
            <el-form-item label="客户订单编号" prop="customerName">
              <el-input v-model="form.parameter" style="width: 170px" />
            </el-form-item>
            <el-form-item label="要求交货日期" prop="customerName" class="mgr40">
              <el-date-picker
                v-model="form.parameter"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
                placeholder="选择要求交货日期"
                style="width: 170px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" size="small">查询</el-button>
              <el-button type="primary" size="small">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="table.data"
          :height="maxHeight"
          :max-height="maxHeight"
          size="mini"
          class="content-table gray-table"
          style="width: 100%"
          v-loading="table.isLoading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                :show-header="false"
                :data="props.row.rpOrderDtoList"
                size="mini"
                stripe
                class="content-table blue-table"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props1">
                    
                  </template>
                </el-table-column>
                <el-table-column label="客户" min-width="160" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <strong>{{props.row.name | filterNull}}</strong>
                  </template>
                </el-table-column>
                <el-table-column prop="createDtString" label="下单时间" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="" label="订单编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="" label="报价单编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="" label="客户项目编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="" label="总价" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="" label="要求交货日期" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="" label="订单金额" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="" label="要求交货日期" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="140" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="() => showStopDialog(scope.row, 'suspend')">暂停</el-button>
                    <el-button type="danger" size="mini" @click="() => showStopDialog(scope.row)">终止</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="客户" min-width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <strong>{{scope.row.name | filterNull}}</strong>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单编号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="报价单编号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="客户项目编号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="总价" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="要求交货日期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单金额" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="要求交货日期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="showProjectDialog('add')">出货</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 出货 -->
    <el-dialog title="出货" :visible.sync="handle.project.dialogVisible" width="600px">
      <div>
        <el-table
          :data="[]"
          size="mini"
          class="content-table mgt10"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="要求交期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="模具号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="零件号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="数量" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="客户" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer tr mgtb20">
          <el-button type="primary">保存</el-button>
          <el-button @click="handle.project.dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
   
    <el-dialog :title="`${handle.stop.type == 'stop' ? '终止' : '暂停'}原因`" :visible.sync="handle.stop.dialogVisible" width="400px">
      <el-form ref="stopForm" :model="handle.stop.form" :rules="handle.stop.rules" label-width="80px" v-loading="handle.stop.isLoading">
        <el-form-item :label="`${handle.stop.type == 'stop' ? '终止' : '暂停'}原因`" class="mgt20">
          <el-input type="causeTypeText" v-model="handle.stop.form.causeTypeText"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="说明" class="mgt20">
          <el-input type="textarea" :rows="4" v-model="handle.stop.form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">确认</el-button>
        <el-button @click="handle.stop.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {

      return {
        form: {
          name: '',
          areaName: '',
          countryName: ''
        },
        handle: {
          project: {
            dialogVisible: false,
            isLoading: false,
            type: 'add',
            form: {
              remark: ''
            }
          },
          plan: {
            dialogVisible: false,
            isLoading: false,
            tableData: []
          },
          stop: {
            dialogVisible: false,
            isLoading: false,
            type: 'stop',
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
          }
        }
      };
    },
    methods: {
      getData() {

        this.table.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryOrderList, (res) => {

          this.table.isLoading = false;
          this.table.srcData = res.data || [];
          this.table.data = this.$utils.deepCopy(this.table.srcData);
        }, () => this.table.isLoading = false)
      },
      showProjectDialog(type = 'add') {

        this.resetForm('projectForm');
        this.handle.project.dialogVisible = true;
      },
      handleAvatarSuccess(res, file) { //上传头像
        
        this.handle.update.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.update.form.fileId = res.data[0].fileId;
      },
      handleAvatarOrderSuccess(res, file) { //上传头像

        this.handle.order.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.order.form.fileId = res.data[0].fileId;
      },
      showStopDialog(data, type = 'stop') {

        this.resetForm('stopForm');
        this.handle.stop.data = data;
        this.handle.stop.type =  type;
        this.handle.stop.dialogVisible = true;
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