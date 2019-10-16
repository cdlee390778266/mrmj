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
                  <div class="flex">估工工时</div>
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
                      <span :title="item.mouldNo">
                        {{item.mouldNo}}
                      </span>
                    </div>
                    <div class="flex">
                      <span :title="item.components | concatString('componentNo')">
                        {{item.components | concatString('componentNo')}}
                      </span>
                    </div>
                    <div class="flex">
                      <span :title="item.components | concatString('quantity')">
                        {{item.components | concatString('quantity')}}
                      </span>
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
              <template v-if="currentData.page1">
                <p><strong>相关零件生产内容</strong></p>
                <p>
                  <span>模具号：{{currentData.page1.mouldNo}}</span> 
                  <span class="mgl20">零件号：{{currentData.page1.components | concatString('componentNo')}}</span> 
                  <span class="mgl20">数量：{{currentData.page1.components | concatString('quantity')}}</span> 
                  <span class="mgl20">材料：{{currentData.page1.stuffNo}}</span> 
                  <span class="mgl20">要求完成日期：{{currentData.page1.requireCompletionDateString}}</span> 
                </p>
                <p class="ellipsis">
                  <span>零件工序及估工：（绿底标注工序为当前所选派工任务对应工序）</span>
                </p>
                <p>
                  <table class="mrmj-table">
                    <thead>
                      <tr>
                        <th class="bge4e4e4">工序顺序</th>
                        <th v-for="(itemc, index) in currentData.page1.processes" :key="index" :class="{'bg-green fcfff': currentData.mrProductionPlanTasksId == itemc.mrProductionPlanProcessId}">{{itemc.name}}</th>
                        <th class="bge4e4e4">工时合计</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="bge4e4e4">估工（H）</td>
                        <th v-for="(itemc, index) in currentData.page1.processes" :key="index" :class="{'bg-green fcfff': currentData.mrProductionPlanTasksId == itemc.mrProductionPlanProcessId}">{{itemc.estimationWorkTime}}</th>
                        <th class="bge4e4e4">
                          {{currentData.page1.processes | sum('estimationWorkTime')}}
                        </th>
                      </tr>
                    </tbody>
                  </table>      
                </p>
                <p>
                  <strong>下载附件</strong>
                  <el-table
                    :data="currentData.page1.attachments"
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
                    <el-select size="mini" style="width: 100px;" v-model="currentData.sort" @change="getUserList">
                      <el-option label="全部" value="" @click=""></el-option>
                      <el-option label="空闲" value="1" @click=""></el-option>
                    </el-select>
                    <el-button v-popover:popover type="text" class="mgl10">设置</el-button>
                    <el-popover
                      ref="popover"
                      placement="right"
                      width="400"
                      trigger="click">
                      <p>
                        <el-button type="primary" size="mini" class="mgr10" @click="showAddDialog">添加员工</el-button>
                        <span class="mgl10">
                          日工时：
                          <el-input type="text" size="mini" style="width: 100px;" v-model="workTimeDays"/>
                        </span>
                      </p>
                       <p class="fs12">(日工时是生产人员每天工作的小时数，用于计算各加工人员的工作饱和度，以合理分配加工人员)</p>
                    </el-popover>
                  </p>
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" v-for="(item, index) in currentData.userList" :key="index" class="mgb10">
                      <div class="people pd10">
                        <div style="position: relative; z-index: 8;">
                          <el-checkbox v-model="item.isAssignWorkSelected" :checked="!!item.isAssignWorkSelected">分配所选零件加工任务</el-checkbox>
                          <div class="mgl10 dib" style="color: #333;">
                            数量：
                            <el-input type="text" size="mini" style="width: 60px;" v-model="item.quantity"/>
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
                            <p class="ellipsis" v-for="(item, index) in item.tasks"><span>{{index + 1}}：{{item.mouldNo}}，{{item.components | concatString('componentNo')}}</span></p>
                          </div>
                          {{saturation(item)}}
                          <div style="width: 200px; height: 200px">
                            <ve-pie
                            height="400px"
                            width="100px"
                            :data="item.chartData"
                            :colors="chart.colors"
                            :settings="chart.settings"
                            :extend="chart.chartExtend"
                            :legend-visible="false"
                            style="position: relative;top: -140px; margin: auto;">
                            </ve-pie>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="$router.go(-1)">返 回</el-button>
    </div>

    <el-dialog :title="`增加${name}工序生产人员`" :visible.sync="handle.add.dialogVisible" class="dialog-gray" width="360px">
      <el-form ref="addForm" :model="handle.add.form" :rules="handle.add.rules" label-width="88px" class="pdt20 pdr10" v-loading="handle.add.isLoading">
        <el-form-item label="员工编号" prop="number">
          <el-input v-model="handle.add.form.number"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="handle.add.form.name"></el-input>
        </el-form-item>
        <div class="dialog-footer tr pdb20">
          <el-button type="primary" @click="addProcessor">保 存</el-button>
          <el-button @click="handle.add.dialogVisible = false">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {

      var checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$utils.getTipText('error', '-1076')));
        }
        
        this.$utils.getJson(this.$utils.CONFIG.api.checkNumber, (res) => {

          if(res.data != 1) { //如果编号重复

            callback(new Error(this.$utils.getTipText('error', '-1077')));
          }else {
            callback();
          }
        }, null, {number: value})
      };

      return {
        defaultPeopleImg: require('../../../assets/img/people.svg'),
        name: '',
        assignWorkDate: new Date().Format('yyyy-MM-dd'),
        component: {},
        isLoading: false,
        workTimeDays: 8,
        chart: {
          colors: ['#c0504d','#4f81bd', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
          settings: {
            legendLimit: 0,
            radius: 40,
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          chartExtend: {
            tooltip (v) {

              v.formatter = function (params) {
          
                return params.name;
              }
              return v
            }
          }
        },
        pickerOptions: { // 限制派工时间不让选择今天以前的
        　　disabledDate(time) {
        　　　　return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        　　}
        },
        handle: {
          add: {
            dialogVisible: false,
            data: {},
            form: {
              number: "",
              name: "",
            },
            rules: {
              number: [
                { validator: checkNumber, trigger: 'blur' }
              ],
              name: [
                { required: true, message: '请输入姓名'}
              ]
            }
          },
        }
      }
    },
    methods: {
      getWorkTimeDays() {  //获取日工时
        this.$utils.getJson(this.$utils.CONFIG.api.workTimeDays, (res) => {

         this.workTimeDays = res.data && res.data.length && res.data[0].dayWorkTime ? res.data[0].dayWorkTime : 8;
        })
      },
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        let params = {
          name: this.name,
          assignWorkDate: ''
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

        if(this.currentData.page1) return;

        let params = {
          productionPlanProcessId: this.currentData.mrProductionPlanTasksId
        };
        
        this.currentData.page1 = {};
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryAssignWorkInfo, (res) =>  {

          this.right.isLoading = false;
          this.currentData.page1 = res.data || {};
        }, () => this.right.isLoading = false, params)

        this.getUserList();
      },
      getUserList() { //获取加工人员列表

        let params = {
          type: 1,
          productionPlanProcessId: this.currentData.productionPlanProcessId,
          sorting: this.currentData.sort ? '_MrUserIdleRecord.isIdle' : ''
        };
        
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryProcessorById, (res) =>  {

          this.right.isLoading = false;
          if(res.data && res.data.length) {

            res.data.map(item => {
              
              item.chartData = {
                columns: ['a', 'b'],
                rows: []
              }
            })
          }
          this.$set(this.currentData, 'userList', res.data || [])
        }, () => this.right.isLoading = false, params)        
      },
      showAddDialog() {

        if(!this.currentData.mrOperationalPlanId) return;
        this.handle.add.dialogVisible = true;
        this.$refs.addForm && this.$refs.addForm.resetFields();
      },
      addProcessor() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            
            this.handle.add.form.mrOperationalPlanId = this.currentData.mrOperationalPlanId;
            this.handle.add.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.addProcessor, (res) =>  {

              this.handle.add.isLoading = false;
              this.handle.add.dialogVisible = false;
              this.$utils.showTip('success', 'success', '111');
              this.getUserList();
            }, () => this.handle.add.isLoading = false, this.handle.add.form)
          } else {
            
            return false;
          }
        });
      },
      handleSelect(item, index) {
      
        this.left.activeId = index;
        this.currentData = item;
        this.getDetail();
      },
      save() { //派工

        if(!this.left.list && !this.left.list.length) return;
        
        let params = [];

        this.left.list.map(item => {

          item.userList && item.userList.map(itemc => {

            params.push({
              mrAssignWorkMiddleId: itemc.mrAssignWorkMiddleId,
              isAssignWorkSelected: itemc.isAssignWorkSelected ? 1 : 0,
              quantity: itemc.quantity || 0
            })
          })
        })

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.processAssignWork, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.isLoading = false;
          this.setWorkTimeDays();
          this.back();
        }, () => this.isLoading = false, params)
      },
      setWorkTimeDays() { //设置日工时

        this.$utils.getJson(this.$utils.CONFIG.api.setWorkTimeDays, (res) =>  {}, () => this.isLoading = false, {dayWorkTime: parseInt(this.workTimeDays) || 8})
      }
    },
    computed: {
      saturation() { //计算饱和度显示饼图
        return (people) => {

          let componentNums = 0; //零件总数
          this.currentData.components && this.currentData.components.map(item => {

            let quantity = item.quantity || 0;
            componentNums += item.quantity;
          })

          let rate = (this.currentData.estimationWorkTime || 0) / (componentNums || 1); //单个零件加工时间
          let totalTime = (parseInt(people.quantity) || 0) * rate; //加工总时间;
          let todayTotalTime = (people.processTotalTime || 0) + totalTime;
          let percentage = todayTotalTime / (this.workTimeDays || 1) ; //工作饱和度
          if(percentage > 1) percentage = 1;

          let tooltip = '<div style="max-width: 200px;    white-space: normal;">';
          
          people.tasks && people.tasks.map((item, index) => {

            let html = `<p>
                        ${index + 1}:
                        模具号：${item.mouldNo},
                        零件号：${this.$filters.concatString(item.components, 'componentNo')},
                        零件数量：${this.$filters.concatString(item.components, 'quantity')}
                       </p>`
            tooltip += html;
          })

          let saturation = parseInt(percentage*100);
          tooltip += `<p>已分配任务总时长：${people.processTotalTime.toFixed(1)} h</p>`;
          tooltip += `<p>当前工序${this.name}计划派工时长：${totalTime.toFixed(1)} h</p>`;
          tooltip += `<p>总时长：${todayTotalTime.toFixed(1)} h</p>`;
          tooltip += `<p>工作饱和度：${saturation}%</p>`;
          tooltip += '</div>';

          people.chartData.rows = [
            {a: percentage && tooltip ? tooltip : '', b: percentage},
            {a: `空闲度：${100 - saturation}%`, b: 1 - percentage},
          ]
        }
      }
    },
    created() {
      
      if(!this.$route.params.id) return;
      this.name = this.$route.params.id;
      this.getWorkTimeDays();
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