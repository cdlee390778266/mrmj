<template>
  <div v-loading="isLoading">
    <div class="crumbs" style="border: none;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>
          <strong>当前位置：</strong>
          <span>跟踪生产进度->终止生产订单</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 80px;">
      <div class="calc">
        <div class="main">
          <div class="content">
            <div class="pos-relative" style="height: 260px;">
              <h5 class="content-right-title">生产订单</h5>
              <div class="content-right">
                <el-table
                  :data="needStopOfOrder"
                  height="238"
                  border
                  size="mini"
                  class="content-table mgt10"
                  style="width: 100%"
                  :highlight-current-row="true"
                  @row-click="handleSelect">
                  <el-table-column
                    prop="mouldNo"
                    label="模具号"
                    width="130"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="typeText"
                    label="类型"
                    width="130"
                    align="center"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="客户"
                    min-width="100"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="operator"
                    label="操作"
                    width="140"
                    align="center"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" @click="showDialog('stop', scope.row)">终止订单</el-button>
                      <el-button type="text" @click="showDialog('suspend', scope.row)">暂停订单</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="pos-relative mgt10" style="height: 260px;">
              <h5 class="content-right-title">订单对应零件</h5>
              <div class="content-right">
                <el-table
                  :data="selectedRow.stopInfo"
                  height="238"
                  border
                  size="mini"
                  class="content-table mgt10"
                  style="width: 100%">
                  <el-table-column
                    label="零件号"
                    min-width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.stopComponents | concatString('componentNo')}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="fileName"
                    label="数量"
                    min-width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.stopComponents | concatString('quantity')}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="requireDateString"
                    label="要求交期"
                    width="120"
                    align="center"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="shipmentDateString"
                    label="出货日期"
                    width="120"
                    align="center"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="operator"
                    label="操作"
                    width="140"
                    align="center"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" @click="showDialog('stop', scope.row, 'route')">终止订单</el-button>
                      <el-button type="text" @click="showDialog('suspend', scope.row, 'route')">暂停订单</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="back">返 回</el-button>
    </div>

    <el-dialog :title="`${handle.stop.title}生产原因`" :visible.sync="handle.stop.dialogVisible">
      <div v-loading="handle.stop.isLoading">
        <el-form :model="handle.stop.form" :rules="handle.stop.rules" ref="form" label-width="120px">
          <div class="dialog-content">
            <el-form-item :label="`${handle.stop.title}生产原因:`" prop="reason">
              <el-input v-model="handle.stop.form.reason"></el-input>
            </el-form-item>
            <el-form-item label="说明:" prop="remark">
              <el-input type="textarea" v-model="handle.stop.form.remark"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdt20">
          <el-button type="primary" @click="save">确定</el-button>
          <el-button type="primary" @click="handle.stop.dialogVisible = false">取消</el-button>
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
      return {
        isLoading: false,
        selectedRow: {},
        needStopOfOrder: [],
        handle: {
          stop: {
            dialogVisible: false,
            isLoading: false,
            title: '',
            type: '',
            tableType: '',
            row: {},
            form: {
              reason: '',
              remark: ''
            },
            rules: {
              reason: [
                { required: true, message: `请输入原因`}
              ],
            }
          }
        }
      }
    },
    methods: {
      queryNeedStopOfOrder() { //获取未终止生产订单列表
        
        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryNeedStopOfOrder, (res) =>  {

          this.isLoading = false;
          this.needStopOfOrder = res.data || [];
        }, () => this.isLoading = false)
      },
      showDialog(type, row, tableType = 'order') {

        this.handle.stop.dialogVisible = true;
        this.handle.stop.type = type;
        this.handle.stop.row = row;
        this.handle.stop.title = type == 'stop' ? '终止' : '暂停';
        this.handle.stop.tableType = tableType;
        this.$refs.form && this.$refs.form.resetFields();
      },
      handleSelect(row, event, column) {
        
        this.selectedRow = row || {stopInfo: []};
      },
      save() {

        this.$refs.form.validate((valid) => {
          if (valid) {
           
            let url = this.handle.stop.tableType == 'order' ? this.$utils.CONFIG.api.stopOrPauseOrder : this.$utils.CONFIG.api.stopOrPauseRoute;
            let params = {
              productOrderOrCraftRouteId: this.handle.stop.tableType == 'order' ? this.handle.stop.row.productionOrderId : this.handle.stop.row.craftRouteLineId,
              operateType: this.handle.stop.type == 'stop' ? 50 : 40,
              reason: this.handle.stop.form.reason,
              remark: this.handle.stop.form.remark
            }

            this.handle.stop.isLoading = true;
            this.$utils.getJson(url, (res) =>  {

              this.handle.stop.isLoading = false;
              this.$utils.showTip('success', 'success', '117');
              this.queryNeedStopOfOrder();
              this.selectedRow = {};
            }, () => this.handle.stop.isLoading = false, params)
          } else {
            
            return false;
          }
        });
      },
      refresh() {
        
      }
    },
    
    created() {
      
      this.queryNeedStopOfOrder();
    }
  };
</script>


<style scoped lang="scss">
  .main {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: none;
    box-shadow: none;
    .content {
      position: absolute;
      top: 0px;
      right: 0;
      bottom: 0px;
      left: 0;
      height: auto;
      visibility: visible;
      .content-right-title {
        position: absolute;
        top: 0px;
        left: 0px;
        font-weight: normal;
        font-size: 14px;
        background: #fff;
        z-index: 8;
      }
      .content-right {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 0px;
        right: 0;
        overflow: auto;
        border: 1px solid #ddd;
      }
    }
    .handle {
      left: 0;
      right: 0;
    }
  }
  .crumbs {
    padding-bottom: 10px;
    border-bottom: 1px solid #a3bf1f;
  }
</style>