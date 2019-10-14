<template>
  <div class="posFull" style="top: 36px; padding-left: 10px;" v-loading="isLoading">
    <div class="crumbs borb-green pdb10">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 工序生产->生产报工
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 68px;" v-loading="right.isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg" style="width: 100%;">
            <div class="msg-wrapper">
              <h2 class="tc pdtb10">{{name}}工序报工</h2>
              <p>
                <span class="mgr20">报工日期：</span>
                <el-date-picker
                  v-model="form.jobBookingDate"
                  type="date"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width: 140px;">
                </el-date-picker>
                <span class="mgl20">报工人员：</span>
                <el-select size="mini" style="width: 140px;" v-model="form.jobBookingWorkerId">
                  <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                </el-select>
              </p>
              <p class="mgt10">
                <span>估工工时合计(H)：{{ currentData.estimationTotalWorkTime | filterNull }}</span>
                <span class="mgl20">实际工时合计(H)：{{ currentData.actualTotalWorkTime | filterNull }}</span>
                <span class="mgl20">准时交货率：{{(currentData.punctualDeliveryNum || 0)/((currentData.punctualDeliveryNum + currentData.delayDeliveryNum) || 1)}}%</span>
                <span class="mgl20">报废率：{{(currentData.haveDumpingNum || 0)/((currentData.haveDumpingNum + currentData.noDumpingNum)  || 1)}}%</span>
              </p>
            </div>
          </div>
          <div class="content">
            <div class="content-right">
              <el-table
                :data="currentData.planMsg"
                border
                size="mini"
                class="content-table edit-table"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="operationalTypeText"
                  label="工作类型"
                  width="100"
                  class-name="notEdit"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="工序"
                  width="100"
                  class-name="notEdit"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="mouldNo"
                  label="模具号"
                  min-width="100"
                  class-name="notEdit"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="零件号" min-width="130" 
                class-name="notEdit"
                show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.components | concatString('componentNo')}}
                  </template>
                </el-table-column>
                <el-table-column label="数量" min-width="100"
                class-name="notEdit"
                show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.components | concatString('quantity')}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="estimationWorkTime"
                  label="估工工时(H)"
                  width="100"
                  class-name="notEdit"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="startDateString"
                  label="开始时间"
                  width="100"
                  class-name="notEdit"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="requireCompletionDateString"
                  label="要求完成日期"
                  width="100"
                  class-name="notEdit"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="加工人人员" min-width="120" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(currentData.planMsg, scope.$index, 'peopleEdit', {}, false)">
                        <div class="ellipsis">
                          {{scope.row.ll | concatString('name')}}
                        </div>
                        <el-select
                          v-model="scope.row.ll"
                          placeholder="请选择"
                          multiple
                          value-key="mrUserIdleRecordId"
                          :style="{opacity: scope.row.peopleEdit ? 1 : 0}"
                          @focus="showInput(currentData.planMsg, scope.$index, 'peopleEdit', {}, false)"
                          @blur="scope.row.peopleEdit = false">
                          <el-option
                            v-for="item in filter.idle"
                            :key="item.mrUserIdleRecordId"
                            :label="item.name"
                            :value="item">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="actualCompletionWorkTime"
                  label="实际加工工时(H)"
                  width="120"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(currentData.planMsg, scope.$index, 'actualCompletionWorkTimeEdit', {}, false)">
                        <div class="ellipsis">{{ scope.row.actualCompletionWorkTime }}</div>
                        <el-input size="mini" v-model="scope.row.actualCompletionWorkTime" @focus="showInput(currentData.planMsg, scope.$index, 'actualCompletionWorkTimeEdit', {}, false)" @blur="scope.row.actualCompletionWorkTimeEdit = false" :style="{opacity: scope.row.actualCompletionWorkTimeEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备  注"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="$router.go(-1)">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        isLoading: false,
        name: '',
        form: {
          jobBookingDate: '',
          jobBookingWorkerId: ''
        },
        filter: {

        }
      }
    },
    methods: {
      getData() { //获取列表
        
        let params = {
          name: this.name
        }

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryTodayProcessByName, (res) => { //详情

          this.currentData = res.data || {};
          this.isLoading = false;
          if(this.currentData.planMsg && this.currentData.planMsg.length) {

            this.currentData.planMsg.map(item => {

              !item.selectPeople && (item.selectPeople = []);
              if(item.people && item.people.length) {

                item.people.map(itemc => {

                  if(itemc.name) {

                    item.selectPeople.push({
                      name: itemc.name,
                      mrUserIdleRecordId: itemc.mrUserIdleRecordId
                    })
                  }
                })
              }
            })
          }
        }, () => this.isLoading = false, params);
        //this.getUserList();
      },
      getUserList() { //获取加工人员列表

        let params = {
          type: 2,
          name: this.name,
          assignWorkDate: new Date().Format('yyyy-MM-dd'),
          sorting: this.right.page2.sort ? '_MrUserIdleRecord.isIdle' : ''
        };
        
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryProcessorById, (res) =>  {

          this.right.isLoading = false;
          this.right.page2.data = res.data || [];
        }, () => this.right.isLoading = false, params)        
      },
      getDropDownList() {
        
        this.getList(this.$utils.CONFIG.api.idle, this.filter, 'idle', {}, (list) => {
          this.filter.idle = [];
          if(list && list.length) {

            list.map(item => {

              this.filter.idle.push({
                name: item.name, 
                mrUserIdleRecordId: item.mrUserIdleRecordId
              })
            })
          }
        }); //获取加工人人员列表
      },
      save() {

        if(!this.currentData.planMsg || !this.currentData.planMsg.length) {

          this.$utils.showTip('warning', 'error', '-1075');
          return;
        }

        if(!this.form.jobBookingDate) {

          this.$utils.showTip('warning', 'error', '-1073');
          return;
        }
        if(!this.form.jobBookingWorkerId) {

          this.$utils.showTip('warning', 'error', '-1074');
          return;
        }

        let params = {
          jobBookingDate: this.form.jobBookingDate,
          jobBookingWorkerId: this.form.jobBookingWorkerId,
          jobBookingList: []
        };

        this.currentData.planMsg.map(item => {

          let data = {
            mrOperationalPlanId: item.mrOperationalPlanId,
            actualCompletionWorkTime: item.actualCompletionWorkTime,
            workerList: []
          }

          item.selectPeople.map(itemc => {

            data.workerList.push(itemc.mrUserIdleRecordId)
          })

          params.jobBookingList.push(data);
        })
  
        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.saveJobBooking, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.isLoading = false;
          this.back();
        }, () => this.isLoading = false, params)
      }
    },
    created() {

      if(!this.$route.params.id) return;
      this.name = this.$route.params.id;
      this.getData();
      this.getDropDownList();
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
    .msg {
      h4 {

      }
      .msg-wrapper {
        span {
          display: inline-block;
        }
      }
    }
    .content {
      position: absolute;
      top: 105px;
      right: 0;
      bottom: 0px;
      left: 0;
      height: auto;
      visibility: visible;
      .content-left-title {
        position: absolute;
        top: 0px;
        left: 10px;
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
        padding: 10px;
        overflow: auto;
        border: 1px solid #ddd;
        p {
          margin-bottom: 10px;
        }
      }
    }
    .handle {
      left: 0;
      right: 0;
    }
  }
</style>