<template>
  <div>
    <div class="main">
      <div class="main-right">
        <div class="main-right-title tl">销售 / 订单管理</div>
        <div class="mgt20">
          <el-form :model="form" :inline="true" size="small" ref="form" class="table-out">
            <el-form-item label="下单时间" prop="createStartDate">
              <el-date-picker
                v-model="form.createStartDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择下单时间"
                style="width: 170px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" style="width: 170px" />
            </el-form-item>
            <el-form-item label="模具编号" prop="mouldNo">
              <el-input v-model="form.mouldNo" style="width: 170px" />
            </el-form-item>
            <el-form-item label="客户项目编号" prop="customerProjectNo">
              <el-input v-model="form.customerProjectNo" style="width: 170px" />
            </el-form-item>
            <el-form-item label="客户订单编号" prop="orderNo">
              <el-input v-model="form.orderNo" style="width: 170px" />
            </el-form-item>
            <el-form-item label="要求交货日期" prop="deliveryEndDate" class="mgr40">
              <el-date-picker
                v-model="form.deliveryEndDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择要求交货日期"
                style="width: 170px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
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
                <el-table-column label="下单时间" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.createDtString ? new Date(scope.row.createDtString).Format('yyyy-MM-dd') : '-'}}
                  </template>
                </el-table-column>
                <el-table-column prop="orderNo" label="订单编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="offerRecordNo" label="报价单编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerProjectNo" label="客户项目编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderPrice" label="订单金额" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deliveryDateString" label="要求交货日期" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.deliveryDateString ? new Date(scope.row.deliveryDateString).Format('yyyy-MM-dd') : '-'}}
                  </template>
                </el-table-column>
                <el-table-column v-for="(head, index) in heads" :key="index" :label="head" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.orderProcessMap[head]}}
                  </template>
                </el-table-column>
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
          <el-table-column label="订单金额" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="要求交货日期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column v-for="(head, index) in heads" :key="index" :label="head" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="showShipableOrderDialog(scope.row)">出货</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 出货 -->
    <el-dialog title="出货" :visible.sync="handle.shipableOrder.dialogVisible" width="600px">
      <div v-loading="handle.shipableOrder.isLoading">
        <el-table
          :data="handle.shipableOrder.data"
          size="mini"
          class="content-table mgt10"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="要求交期" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.deliveryDateString ? new Date(scope.row.deliveryDateString).Format('yyyy-MM-dd') : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="mouldNo" label="模具号" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.mouldNo | filterNull}}
            </template>
          </el-table-column>
          <el-table-column prop="mouldNo" label="零件号" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.rpOrderPartDtos | concatString('partNo')}}
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.rpOrderPartDtos | concatString('count')}}
            </template>
          </el-table-column>
          <el-table-column prop="" label="客户" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.customerName | filterNull}}
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer tr mgtb20">
          <el-button type="primary" @click="editShipableOrder">保存</el-button>
          <el-button @click="handle.shipableOrder.dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
   
    <el-dialog :title="`${handle.stop.type == 'stop' ? '终止' : '暂停'}原因`" :visible.sync="handle.stop.dialogVisible" width="400px">
      <el-form ref="stopForm" :model="handle.stop.form" :rules="handle.stop.rules" label-width="80px" v-loading="handle.stop.isLoading">
        <el-form-item :label="`${handle.stop.type == 'stop' ? '终止' : '暂停'}原因`" class="mgt20">
          <el-input type="reason" v-model="handle.stop.form.reason"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="说明" class="mgt20">
          <el-input type="textarea" :rows="4" v-model="handle.stop.form.remark"></el-input>
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
        heads: [],
        form: {
          customerName: '',
          mouldNo: '',
          customerProjectNo: '',
          orderNo: '',
          deliveryEndDate: '',
          createStartDate: '',
        },
        handle: {
          shipableOrder: {
            dialogVisible: false,
            isLoading: false,
            data: []
          },
          stop: {
            dialogVisible: false,
            isLoading: false,
            type: 'stop',
            data: {},
            form: {
              reason: "",
              remark: ""
            },
            rules: {
              reason: [
                { required: true, message: this.$utils.getTipText('error', '-1085')},
              ]
            }
          }
        }
      };
    },
    methods: {
      getData() {

        let params = {
          customerName: this.form.customerName,
          mouldNo: this.form.mouldNo,
          customerProjectNo: this.form.customerProjectNo,
          orderNo: this.form.orderNo,
          deliveryEndDate: this.form.deliveryEndDate,
          createStartDate: this.form.createStartDate,
        }

        this.table.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryOrderList, (res) => {

          this.table.isLoading = false;
          this.table.srcData = res.data || [];
          this.table.data = this.$utils.deepCopy(this.table.srcData);
        }, () => this.table.isLoading = false, params)
      },
      queryOrderListTitle() {

        this.$utils.getJson(this.$utils.CONFIG.api.queryOrderListTitle, (res) => {

          this.heads = res.data || [];
        })
      },
      showShipableOrderDialog(row) { //出货查询

        this.handle.shipableOrder.dialogVisible = true;

        let params = {
          customerId: row.customerId
        }

        this.handle.shipableOrder.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryShipableOrderList, (res) => {

          this.handle.shipableOrder.isLoading = false;
          this.handle.shipableOrder.data = res.data || [];
        }, () => this.handle.shipableOrder.isLoading = false, params)
      },
      editShipableOrder() { //出货

        if(!this.multipleSelection.length) {

          this.$utils.showTip('warning', 'error', '-1078');
          return;
        }

        let params = {
          orderIds: [],
          partIds: []
        }
        this.multipleSelection.map(item => {

          params.orderIds.push(item.orderId);

          item.rpOrderPartDtos && item.rpOrderPartDtos.map(itemc => {

            params.partIds.push(itemc.partId)
          })
        })

        this.handle.shipableOrder.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.editShipableOrder, (res) => {

          this.handle.shipableOrder.isLoading = false;
          this.handle.shipableOrder.dialogVisible = false;
          this.$utils.showTip('success', 'success', '117');
          this.getData();
        }, () => this.handle.shipableOrder.isLoading = false, params)
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
            
            let url = this.handle.stop.type == 'stop' ? this.$utils.CONFIG.api.editStopOrder : this.$utils.CONFIG.api.editSuspendOrder;
            let params = {
              orderId: this.handle.stop.data.orderId,
              reason: this.handle.stop.form.reason,
              remark: this.handle.stop.form.remark
            };
            
            this.handle.stop.isLoading = true;
            this.$utils.getJson(url, (res) =>  {

              this.handle.stop.isLoading = false;
              this.handle.stop.dialogVisible = false;
              this.$utils.showTip('success', 'success', '117');
            }, () => this.handle.stop.isLoading = false, params)
          } else {
            
            return false;
          }
        });
      },
      setTableMaxHeight() {

        this.maxHeight = this.$utils.getTableMaxHeight(['.main-right-title', '.table-out']);
      },
      refresh() {}
    },

    created() {

      this.queryOrderListTitle();
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