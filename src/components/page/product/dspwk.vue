<template>
  <div class="posFull" style="top: 36px; padding-left: 10px;" v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 工序生产->工序派工
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 36px;">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg">
            <div class="msg-wrapper">
              <span>派工日期：</span>
              <el-date-picker
                v-model="assignWorkDate"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="content">
            <h5 class="content-left-title">当前作业计划</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div class="list tc posFull" style="width: 700px; top: -4px;">
                <div class="list-head dflex">
                  <div class="flex">生产序号</div>
                  <div style="width: 100px;">是否已派工</div>
                  <div class="flex">工序</div>
                  <div class="flex">状态</div>
                  <div class="flex">模具号</div>
                  <div class="flex">零件号</div>
                  <div class="flex">数量</div>
                  <div class="flex">剩余工时</div>
                  <div style="width: 120px;">要求完成日期</div>
                </div>
                <div class="list-body">
                  <div class="dflex" v-for="(item, index) in left.list" :key="index" :class="{active: left.activeId == index}" @click="handleSelect(item, index)">
                    <div class="flex">
                      {{index + 1}}
                    </div>
                    <div style="width: 100px;">
                      {{item.hasAssignWork ? '是' : '否'}}
                    </div>
                    <div class="flex">
                      {{item.name}}
                    </div>
                    <div class="flex">
                      {{item.operationalStatusText}}
                    </div>
                    <div class="flex">
                      {{item.mouldNo}}
                    </div>
                    <div class="flex">
                      {{item.components | concatString('componentNo')}}
                    </div>
                    <div class="flex">
                      {{item.components | concatString('quantity')}}
                    </div>
                    <div class="flex">
                      {{item.estimationWorkTime}}
                    </div>
                    <div style="width: 120px;">
                      {{item.requireCompletionDateString}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title">人员分配</h5>
            <div class="content-right" v-loading="right.isLoading">
              <p><strong>相关零件生产内容</strong></p>
              <p>
                <span>模具号：{{right.page1.mouldNo}}</span> 
                <span class="mgl20">零件号：{{right.page1.components | concatString('componentNo')}}</span> 
                <span class="mgl20">数量：{{right.page1.components | concatString('quantity')}}</span> 
                <span class="mgl20">材料：{{right.page1.stuffNo}}</span> 
                <span class="mgl20">要求完成日期：{{right.page1.requireCompletionDateString}}</span> 
              </p>
              <p class="ellipsis">
                <span>零件工序及估工：（绿底标注工序为当前所选派工任务对应工序）</span>
              </p>
              <p>
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th class="bge4e4e4">工序顺序</th>
                      <th v-for="(itemc, index) in right.page1.processes" :key="index" :class="{'bg-green fcfff': currentData.mrProductionPlanTasksId == itemc.mrProductionPlanProcessId}">{{itemc.name}}</th>
                      <th class="bge4e4e4">工时合计</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="bge4e4e4">估工（H）</td>
                      <th v-for="(itemc, index) in right.page1.processes" :key="index" :class="{'bg-green fcfff': currentData.mrProductionPlanTasksId == itemc.mrProductionPlanProcessId}">{{itemc.estimationWorkTime}}</th>
                      <th class="bge4e4e4">
                        {{right.page1.processes | sum('estimationWorkTime')}}
                      </th>
                    </tr>
                  </tbody>
                </table>      
              </p>
              <p>
                <strong>下载附件</strong>
                <el-table
                  :data="right.page1.attachments"
                  border
                  size="mini"
                  max-height="200"
                  class="content-table edit-table"
                  style="width: 100%">
                  <el-table-column
                    prop="fileName"
                    label="资料名称"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    show-overflow-tooltip>
                    <template scope="scope">
                      <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </p>
              <div>
                <strong>加工人员安排</strong>
                <p class="mgt5" style="position: relative; z-index: 8;">
                  排序：
                  <el-select size="mini" style="width: 100px;" v-model="right.page2.sort">
                    <el-option label="空闲" value="0" @click=""></el-option>
                  </el-select>
                  <el-button v-popover:popover type="text" class="mgl10">设置</el-button>
                  <el-popover
                    ref="popover"
                    placement="right"
                    width="400"
                    trigger="click">
                    <p>
                      <el-button type="primary" size="mini" class="mgr10">添加员工</el-button>
                      <span class="mgl10">
                        日工时：
                        <el-input type="text" size="mini" style="width: 100px;" v-model="right.a"/>
                      </span>
                    </p>
                     <p class="fs12">(日工时是生产人员每天工作的小时数，用于计算各加工人员的工作饱和度，以合理分配加工人员)</p>
                  </el-popover>
                </p>
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-for="(item, index) in right.page2.list" :key="index" class="mgb10">
                    <div class="people pd10">
                      <div style="position: relative; z-index: 8;">
                        <el-checkbox v-model="right.page2.checked">分配所选零件加工任务</el-checkbox>
                        <div class="mgl10 dib" style="color: #333;">
                          数量：
                          <el-input type="text" size="mini" style="width: 44px;" v-model="right.page2.quantity"/>
                        </div>
                      </div>
                      <div class="dflex mgt10">
                        <div class="flex">
                          <p class="ellipsis">
                            <img :src="defaultPeopleImg">
                            <span>人员姓名：{{item.userName}}</span>
                          </p>
                          <p class="mgt10">
                            <strong>已分配任务：</strong>
                          </p>
                          <p class="ellipsis" v-for="(itemc, index) in item.tasks"><span>{{index + 1}}：{{itemc.mouldNo}}，{{itemc.components | concatString('componentNo')}}</span></p>
                        </div>
                        <div style="width: 200px; height: 200px">
                          <ve-pie :data="item.chartData" :colors="chart.colors" :settings="chart.settings" height="400px" width="100px" :legend-visible="false" style="position: relative;top: -140px; margin: auto;"></ve-pie>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
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
        defaultPeopleImg: require('../../../assets/img/people.svg'),
        name: '',
        assignWorkDate: new Date().Format('yyyy-MM-dd'),
        component: {},
        isLoading: false,
        chart: {
          colors: ['#c0504d','#4f81bd', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
          settings: {
            legendLimit: 0,
            radius: 40,
            labelLine: {
              show: false
            }
          }
        },
        pickerOptions: { // 限制派工时间不让选择今天以前的
        　　disabledDate(time) {
        　　　　return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        　　}
        },
        right: {
          page1: {},
          page2: {
            sort: '',
            list: []
          }
        }
      }
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        let params = {
          name: this.name,
          assignWorkDate: this.assignWorkDate
        }

        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryOperationalProcess, (res) => { //详情

          this.left.list = res.data || {};
          this.left.isLoading = false;
          if(this.left.list.length) {

            this.currentData = this.left.list[0];
            this.left.activeId = 0;
            this.getDetail();
          }
        }, () => this.left.isLoading = false, params);
      },
      getDetail() {

        let params = {
          productionPlanProcessId: this.currentData.mrProductionPlanTasksId
        };
      
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryAssignWorkInfo, (res) =>  {

          this.right.isLoading = false;
          this.right.page1 = res.data || {};
        }, () => this.right.isLoading = false, params)

        this.getUserList();
      },
      getUserList() { //获取加工人员列表

        let params = {
          productionPlanProcessId: this.currentData.mrProductionPlanTasksId,
          sorting: this.right.page2.sort ? '_SysUser.isIdle = 0' : ''
        };
        
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryProcessorById, (res) =>  {

          this.right.isLoading = false;
          this.right.page2.list = res.data || [];
        }, () => this.right.isLoading = false, params)        
      },
      handleSelect(item, index) {
      
        this.left.activeId = index;
        this.currentData = item;
        this.getDetail();
      },
      save() {

        if(!this.currentData.mrProductionPlanTasksId) return;

        let params = {
          mrOperationalPlanId: this.currentData.mrProductionPlanTasksId,
          processes: []
        };
    
        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.processAssignWork, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.isLoading = false;
          this.back();
        }, () => this.isLoading = false, params)
      }
    },
    
    created() {

      if(!this.$route.params.id) return;
      this.name = this.$route.params.id;
      this.getLeftList();
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
      top: 40px;
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
      .content-left {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 0;
        width: 340px;
        overflow: auto;
        border: 1px solid #ddd;
        .list {
          .list-head {
            position: absolute;
            top: 20px;
            right: 0;
            left: 0;
            background: rgba(228, 228, 228, 1);
            & > div {
              border-right: 1px solid #ddd;
            }
          }
          .list-body {
            position: absolute;
            top: 40px;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            .dflex{
              cursor: pointer;
              &:hover, &.active {
                background: #e8e8e8;
              }
            }
            .flex {
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .content-right-title {
        position: absolute;
        top: 0px;
        left: 350px;
        font-weight: normal;
        font-size: 14px;
        background: #fff;
        z-index: 8;
      }
      .content-right {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 350px;
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