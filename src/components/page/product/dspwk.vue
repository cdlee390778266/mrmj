<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 工序生产->工序派工
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 68px;" v-loading="right.isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg">
            <div class="msg-wrapper">
              <span class="mgr20">派工日期：</span>
              <el-date-picker
                v-model="right.page1.date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="content">
            <h5 class="content-left-title">当前作业计划</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div class="list tc posFull" style="width: 700px">
                <div class="list-head dflex">
                  <div class="flex">生产序号</div>
                  <div style="width: 100px;">是否已派工</div>
                  <div class="flex">工序</div>
                  <div class="flex">状态</div>
                  <div class="flex">模具号</div>
                  <div class="flex">零件号</div>
                  <div class="flex">数量</div>
                  <div class="flex">剩余工时</div>
                  <div style="width: 100px;">要求完成日期</div>
                </div>
                <div class="list-body">
                  <div class="dflex" v-for="(item, index) in [1,2]" :key="index" :class="{active: left.activeId == index}" @click="handleSelect(item, index)">
                    <div class="flex">
                      {{index + 1}}
                    </div>
                    <div style="width: 100px;">
                      {{index}}
                    </div>
                    <div class="flex">
                      {{index}}
                    </div>
                    <div class="flex">
                      {{index}}
                    </div>
                    <div class="flex">
                      {{index}}
                    </div>
                    <div class="flex">
                      {{index}}
                    </div>
                    <div class="flex">
                      {{index}}
                    </div>
                    <div class="flex">
                      {{index}}
                    </div>
                    <div style="width: 100px;">
                      {{index}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title">人员分配</h5>
            <div class="content-right">
              <p><strong>相关零件生产内容</strong></p>
              <p>
                <span>模具号：M18480</span> 
                <span class="mgl20">零件号：56/57</span> 
                <span class="mgl20">数量：8+1EA</span> 
                <span class="mgl20">材料：1.2343ESU</span> 
                <span class="mgl20">要求完成日期：2018.08.06</span> 
              </p>
              <p class="ellipsis">
                <span>零件工序及估工：（绿底标注工序为，当前所选派工任务对应工序）</span>
              </p>
              <p>
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th class="bge4e4e4">工序顺序</th>
                      <th v-for="(itemc, index) in right.page1.list" :key="index">{{itemc.name}}</th>
                      <th class="bge4e4e4">工时合计</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="bge4e4e4">估工（H）</td>
                      <th v-for="(itemc, index) in right.page1.list" :key="index">{{itemc.estimationWorkTime}}</th>
                      <th class="bge4e4e4">
                        {{right.page1.list | sum('estimationWorkTime')}}
                      </th>
                    </tr>
                  </tbody>
                </table>      
              </p>
              <p>
                <strong>下载附件</strong>
                <el-table
                  :data="currentData.processes"
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
                      <el-button type="text" @click="down(1)">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </p>
              <div>
                <strong>加工人员安排</strong>
                <p>
                  排序：
                  <el-select style="width: 100px;" v-model="right.page1.data">
                    <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                  </el-select>
                </p>
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <div class="people dflex mgt10">
                      <div class="flex">
                        <p class="ellipsis">
                          <img :src="defaultPeopleImg">
                          <span>人员姓名：E01</span>
                        </p>
                        <p class="mgt10">
                          <strong>已分配任务：</strong>
                        </p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                      </div>
                      <div style="width: 100px;"></div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <div class="people dflex mgt10">
                      <div class="flex">
                        <p class="ellipsis">
                          <img :src="defaultPeopleImg">
                          <span>人员姓名：E01</span>
                        </p>
                        <p class="mgt10">
                          <strong>已分配任务：</strong>
                        </p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                      </div>
                      <div style="width: 100px;"></div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <div class="people dflex mgt10">
                      <div class="flex">
                        <p class="ellipsis">
                          <img :src="defaultPeopleImg">
                          <span>人员姓名：E01</span>
                        </p>
                        <p class="mgt10">
                          <strong>已分配任务：</strong>
                        </p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                      </div>
                      <div style="width: 100px;"></div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                    <div class="people dflex mgt10">
                      <div class="flex">
                        <p class="ellipsis">
                          <img :src="defaultPeopleImg">
                          <span>人员姓名：E01</span>
                        </p>
                        <p class="mgt10">
                          <strong>已分配任务：</strong>
                        </p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        <p class="ellipsis"><span>1：M18480，56/57</span></p>
                      </div>
                      <div style="width: 100px;"></div>
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
      <el-button type="primary" @click="$router.push('/product/task')">返 回</el-button>
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
        time: '',
        component: {},
        defaultData: {
          type: 'add',
          mrElectrodeDesignTasksId: '',
          mrElectrodeProductionListOrderId: '',
          electrodeNo: '',
          quantity: '',
          processes: [{}],
          attachments: [],
        }
      }
    },
    methods: {
      getLeftList() { //获取版本列表
        
        let params = {
          mrElectrodeDesignTasksId: this.component.mrElectrodeDesignTasksId
        }
        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryElectrodeNoById, (res) => {

          this.left.isLoading = false;
          this.left.list = res.data || [];
          if(this.left.list.length) {

            this.left.activeId = 0;
            this.currentData = this.left.list[0];
            if(!this.currentData.processes || !this.currentData.processes.length) {
              this.currentData.processes = [{}];
            }
          }else {

            this.currentData = this.$utils.deepCopy(this.defaultData);
          }
        }, () => {

          this.left.isLoading = false;
          this.currentData = this.$utils.deepCopy(this.defaultData);
        }, params)
      },
      handleSelect(item, index) {
      
        this.left.activeId = index;
        this.currentData = item;
        if(!this.currentData.processes || !this.currentData.processes.length) {
          this.currentData.processes = [{}];
        }
      },
      addVersion() {

        let data = this.$utils.deepCopy(this.defaultData);
        this.left.list.push(data);
        this.currentData = data;
        this.left.activeId = this.left.list.length - 1;
      },
      deleteVersionSuccess(index) {

        this.left.list.splice(index, 1);
        if(this.left.activeId > index) {
          index = this.left.activeId - 1;
          this.left.activeId = index;
          this.currentData = this.left.list[index];
        }else if(this.left.activeId == index) {
          if(index == this.left.list.length) {
            index = this.left.list.length - 1;
          }
          this.left.activeId = index;
          this.currentData = this.left.list[index] || this.$utils.deepCopy(this.defaultData);
        }
      },
      deleteVersion(index) {

        if(this.left.list[index].type == 'add') {

          this.deleteVersionSuccess(index);
        }else {

          this.left.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.saveEleAsModify, (res) => { //版本详情 

            this.left.isLoading = false;
            this.$utils.showTip('success', 'success', '104');
            this.deleteVersionSuccess(index);
          }, () => this.left.isLoading = false, {mrElectrodeProductionListOrderId: this.left.list[index].mrElectrodeProductionListOrderId}, 'post', true);
        }
      },
      uploadSuccess(res) {

        this.$refs.file.value = '';
        let params = [{
            fileId: res.data[0].fileId,
            fileName: res.data[0].fileName,
            mrElectrodeProductionListOrderId: this.currentData.mrElectrodeProductionListOrderId
          }]
        this.$utils.getJson(this.$utils.CONFIG.api.saveEleAttachment, (response) => { //存储电极附件

          this.currentData.attachments.push({
            fileId: res.data[0].fileId,
            fileName: res.data[0].fileName,
          });
        }, () => this.right.isLoading = false, params);
      },
      deleteSuccess() {

        this.$utils.getJson(this.$utils.CONFIG.api.deleteAttachment, (response) => { //删除附件
          
          this.currentData.attachments = this.currentData.attachments.filter(item => this.deleteRow.fileId != item.fileId);
        }, () => this.right.isLoading = false, {fileId: this.deleteRow.fileId});
      },
      save() {

        if(!this.currentData.electrodeNo) { //如果电极号为空
          this.$utils.showTip('warning', 'error', '-1050');
          return;
        }

        let url = '';
        let params = {}

        if(this.currentData.type == 'add') {

          url = this.$utils.CONFIG.api.designElectrodeDesignTasks;
          params = {
            mrElectrodeDesignTasksId: this.component.mrElectrodeDesignTasksId,
            electrodeNo: this.currentData.electrodeNo,
            quantity: parseInt(this.currentData.quantity) || 0,
            processes: [],
            attachments: []
          }
        }else {

          url = this.$utils.CONFIG.api.modifyEleInfo;
          params = {
            mrElectrodeProductionListOrderId: this.currentData.mrElectrodeProductionListOrderId,
            electrodeNo: this.currentData.electrodeNo,
            quantity: parseInt(this.currentData.quantity) || 0,
            processes: [],
            attachments: []
          }
        }

        this.currentData.processes.map((item, index) => { //工艺列表

          if(item.processName) {

            let obj = {
              processSequence: index + 1,
              processName: item.processName,
              estimationWorkTime: parseFloat(item.estimationWorkTime) || 0,
            }
            if(item.mrElectrodeProcessProductionOrderId) {
              obj.mrElectrodeProcessProductionOrderId = item.mrElectrodeProcessProductionOrderId;
            }
            params.processes.push(obj);
          }
        })

        this.right.isLoading = true;
        this.$utils.getJson(url, (res) => {

          this.right.isLoading = false;
          this.$utils.showTip('success', 'success', '102');
          this.component.type = 'edit';
          localStorage.setItem(this.time, JSON.stringify(this.component));
          this.refresh();
        }, () => this.right.isLoading = false, params);
      },
      refresh() {

        this.getList(this.$utils.CONFIG.api.stuff, this.right, 'stuff'); //获取材料列表
        this.getList(this.$utils.CONFIG.api.process, this.right, 'process'); //获取工序名称列表
        this.getList(this.$utils.CONFIG.api.sysCode, this.right, 'sysCode', {otherWhereClause: "codeType = 'processContent'"}); //获取工序内容列表
        this.getLeftList();
      }
    },
    
    created() {

      if(!this.$route.params.id) return;
      this.time = this.$route.params.id;
      let component = localStorage.getItem(this.time);
      if(!component) return;
      this.component = JSON.parse(component);
      this.refresh();
      console.log(this.component)
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