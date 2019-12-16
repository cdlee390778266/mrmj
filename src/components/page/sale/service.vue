<template>
  <div>
    <div class="main">
      <div class="main-right">
        <div class="main-right-title tl">销售 / 客户投诉</div>
        <div class="mgt20">
          <el-form :model="form" :inline="true" size="small" ref="form" class="table-out">
            <el-form-item label="日期" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 170px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="客户" prop="customerName">
              <el-input v-model="form.customerName" style="width: 170px" />
            </el-form-item>
            <el-form-item label="模具号" prop="mouldNo">
              <el-input v-model="form.mouldNo" style="width: 170px" />
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
                :data="props.row.customerComplainDtos"
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
                <el-table-column label="日期" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.createDtString ? new Date(scope.row.createDtString).Format('yyyy-MM-dd') : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="模具号码" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.mouldNo ? scope.row.mouldNo : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="投诉数量" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.complaintCount ? scope.row.complaintCount : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="加工数量" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.productionCount ? scope.row.productionCount : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="投诉问题" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.question ? scope.row.question : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="补救方式" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.solution ? scope.row.saleCustomerComplaintDetail.solution : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="责任人" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.dutyManId ? scope.row.dutyManId : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.solutionStartTimeString ? new Date(scope.row.saleCustomerComplaintDetail.solutionStartTimeString).Format('yyyy-MM-dd') : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="完成时间" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.solutionEndTimeString ? new Date(scope.row.saleCustomerComplaintDetail.solutionEndTimeString).Format('yyyy-MM-dd') : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="工时" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.solutionTime ? scope.row.saleCustomerComplaintDetail.solutionTime : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="类型1" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.type1 ? scope.row.saleCustomerComplaintDetail.type1 : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="类型2" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.type2 ? scope.row.saleCustomerComplaintDetail.type2 : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="类型3" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.type3 ? scope.row.saleCustomerComplaintDetail.type3 : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="类型4" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.saleCustomerComplaintDetail && scope.row.saleCustomerComplaintDetail.type4 ? scope.row.saleCustomerComplaintDetail.type4 : '-'}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="showComplaintDialog(scope.row, 'edit')">编辑</el-button>
                    <el-button type="success" size="mini" @click="showCompleteDialog(scope.row)">处理完成</el-button>
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
          <el-table-column label="日期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="模具号码" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="投诉数量" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="加工数量" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="投诉问题" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="补救方式" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="责任人" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="开始时间" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="完成时间" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="工时" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型1" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型2" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型3" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型4" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="showComplaintDialog(scope.row, 'add')">新增投诉</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 客户投诉登记 -->
    <el-dialog title="客户投诉登记" :visible.sync="handle.complaint.dialogVisible" width="600px">
      <div v-loading="handle.complaint.isLoading">
        <el-form ref="complaintForm" :model="handle.complaint.form" :rules="handle.complaint.rules" size="mini" label-width="80px">
          <el-row class="mgt20">
            <el-col :span="12">
              <el-form-item label="模具号" prop="mouldNo">
                <el-input v-model="handle.complaint.form.mouldNo" placeholder="请输入模具号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="加工数量" prop="productionCount">
                <el-input v-model="handle.complaint.form.productionCount" placeholder="请输入加工数量"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投诉数量" prop="complaintCount">
                <el-input v-model="handle.complaint.form.complaintCount" placeholder="请输入投诉数量"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人" prop="dutyManId">
                <el-input v-model="handle.complaint.form.dutyManId" placeholder="请输入责任人"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="投诉问题" prop="question">
                <el-input type="textarea" v-model="handle.complaint.form.question" placeholder="请输入投诉问题" :rows="4"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer tr mgtb20">
          <el-button type="primary" @click="onSubmitForm('complaintForm', editComplaint)">保存</el-button>
          <el-button @click="handle.complaint.dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 处理完成 -->
    <el-dialog title="处理完成" :visible.sync="handle.complete.dialogVisible" width="600px">
      <div v-loading="handle.complete.isLoading">
        <el-form ref="completeForm" :model="handle.complete.form" size="mini" label-width="80px">
          <el-row class="mgt20">
            <el-col :span="24" class="bor pd10">
              <div class="dflex">
                <div class="flex">
                  <strong>日期：</strong>
                  <span class="ellipsis">{{handle.complete.row.createDtString ? new Date(handle.complete.row.createDtString).Format('yyyy-MM-dd') : '-'}}</span>
                </div>
                <div class="flex">
                  <strong>模具号：</strong>
                  <span class="ellipsis" :title="handle.complete.row.mouldNo | filterNull">{{handle.complete.row.mouldNo | filterNull}}</span>
                </div>
              </div>
              <div class="dflex">
                <div class="flex">
                  <strong>加工数量：</strong>
                  <span class="ellipsis" :title="handle.complete.row.productionCount | filterNull">{{handle.complete.row.productionCount | filterNull}}</span>
                </div>
                <div class="flex">
                  <strong>投诉数量：</strong>
                  <span class="ellipsis" :title="handle.complete.row.complaintCount | filterNull">{{handle.complete.row.complaintCount | filterNull}}</span>
                </div>
              </div>
              <div class="dflex">
                <div class="flex">
                  <strong>责任人：</strong>
                  <span class="ellipsis" :title="handle.complete.row.dutyManId | filterNull">{{handle.complete.row.dutyManId | filterNull}}</span>
                </div>
              </div>
              <div>
                <p><strong>投诉问题：</strong></p>
                <p>{{handle.complete.row.question | filterNull}}</p>
              </div>
            </el-col>

            <el-col :span="24" class="mgt20">
              <el-form-item label="补救方式" prop="solution">
                <el-input v-model="handle.complete.form.solution" placeholder="请输入补救方式"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新做" prop="aa">
                <el-row>
                  <el-col :span="17">
                    <el-date-picker
                      v-model="handle.complete.form.solutionTimeRange"
                      type="daterange"
                      range-separator="至"
                      value-format="yyyy-MM-dd"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="工时" prop="solutionTime" label-width="60px" class="mgb0">
                      <el-input v-model="handle.complete.form.solutionTime" placeholder="请输入工时"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="类型1" prop="type1">
                <el-input v-model="handle.complete.form.type1" placeholder="请输入类型1"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="类型2" prop="type2">
                <el-input v-model="handle.complete.form.type2" placeholder="请输入类型2"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="类型3" prop="type3">
                <el-input v-model="handle.complete.form.type3" placeholder="请输入类型3"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="类型4" prop="type4">
                <el-input v-model="handle.complete.form.type4" placeholder="请输入类型4"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer tr mgtb20">
          <el-button type="primary" @click="onSubmitForm('completeForm', complete)">保存</el-button>
          <el-button @click="handle.complete.dialogVisible = false">取 消</el-button>
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
        form: {
          startDate: '',
          customerName: '',
          mouldNo: ''
        },
        handle: {
          complaint: {
            dialogVisible: false,
            isLoading: false,
            type: 'edit',
            row: {},
            form: {
              customerId: '',
              complaintCount: '',
              mouldNo: '',
              productionCount: '',
              dutyManId: '',
              question: ''
            },
            rules: {
              mouldNo: [
                { required: true, message: this.$utils.getTipText('error', '-1090')},
              ],
              productionCount: [
                { required: true, message: this.$utils.getTipText('error', '-1110')},
              ],
              complaintCount: [
                { required: true, message: this.$utils.getTipText('error', '-1111')},
              ],
              dutyManId: [
                { required: true, message: this.$utils.getTipText('error', '-1112')},
              ]
            }
          },
          complete: {
            dialogVisible: false,
            isLoading: false,
            row: {},
            form: {
              solution: '',
              solutionTimeRange: [],
              solutionTime: '',
              type1: '',
              type2: '',
              type3: '',
              type4: ''
            }
          }
        }
      };
    },
    methods: {
      getData() {

        let params = {
          startDate: this.form.startDate,
          customerName: this.form.customerName,
          mouldNo: this.form.mouldNo
        }

        this.table.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryComplaintList, (res) => {

          this.table.isLoading = false;
          this.table.srcData = res.data || [];
          this.table.data = this.$utils.deepCopy(this.table.srcData);
        }, () => this.table.isLoading = false, params)
      },
      showComplaintDialog(row, type = 'edit') { //新增投诉OR编辑投诉弹框

        this.resetForm('complaintForm');
        this.handle.complaint.row = row;
        this.handle.complaint.type = type;
        this.handle.complaint.dialogVisible = true;

        if(type == 'add') return;

        this.handle.complaint.form = row;
      },
      editComplaint() { //新增投诉OR编辑投诉

        let params = {
          customerId: this.handle.complaint.row.customerId,
          complaintCount: parseInt(this.handle.complaint.form.complaintCount) || 0,
          mouldNo: this.handle.complaint.form.mouldNo,
          productionCount: parseInt(this.handle.complaint.form.productionCount) || 0,
          dutyManId: this.handle.complaint.form.dutyManId,
          question: this.handle.complaint.form.question
        };

        if(this.handle.complaint.type == 'edit') params.customerComplaintId = this.handle.complaint.row.customerComplaintId; 

        this.handle.complaint.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.editComplaint, (res) => {

          this.handle.complaint.isLoading = false;
          this.handle.complaint.dialogVisible = false;
          this.$utils.showTip('success', 'success', '117');
          this.getData();
        }, () => this.handle.complaint.isLoading = false, params)
      },
      showCompleteDialog(row) {

        this.resetForm('completeForm');
        this.handle.complete.row = row;
        this.handle.complete.dialogVisible = true;
      },
      complete() { //处理完成
    
        let params = {
          complaintId: this.handle.complete.row.customerComplaintId,
          solution: this.handle.complete.form.solution || '',
          solutionStartTime: this.handle.complete.form.solutionTimeRange.length ? this.handle.complete.form.solutionTimeRange[0] : '',
          solutionEndTime: this.handle.complete.form.solutionTimeRange.length ? this.handle.complete.form.solutionTimeRange[1] : '',
          solutionTime: parseFloat(this.handle.complete.form.solutionTime) || '',
          type1: this.handle.complete.form.type1 || '',
          type2: this.handle.complete.form.type2 || '',
          type3: this.handle.complete.form.type3 || '',
          type4: this.handle.complete.form.type4 || ''
        };


        this.handle.complete.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.editComplaintDetail, (res) => {

          this.handle.complete.isLoading = false;
          this.handle.complete.dialogVisible = false;
          this.$utils.showTip('success', 'success', '117');
          this.getData();
        }, () => this.handle.complete.isLoading = false, params)
      },
      setTableMaxHeight() {

        this.maxHeight = this.$utils.getTableMaxHeight(['.main-right-title', '.table-out']);
      },
      refresh() {}
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