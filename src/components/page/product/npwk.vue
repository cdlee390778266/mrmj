<template>
  <div>
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
              <h2 class="tc pdtb10">G工序报工</h2>
              <p>
                <span class="mgr20">报工日期：</span>
                <el-date-picker
                  v-model="right.page1.date"
                  type="date"
                  size="mini"
                  placeholder="选择日期"
                  style="width: 140px;">
                </el-date-picker>
                <span class="mgl20">报工人员：</span>
                <el-select size="mini" style="width: 140px;" v-model="right.page1.data">
                  <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                </el-select>
              </p>
              <p class="mgt10">
                <span>估工工时合计(H)：463</span>
                <span class="mgl20">实际工时合计(H)：463</span>
                <span class="mgl20">准时交货率：85%</span>
                <span class="mgl20">报废率：5%</span>
              </p>
            </div>
          </div>
          <div class="content">
            <div class="content-right">
              <el-table
                :data="currentData.processes"
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
                  prop="fileName"
                  label="工作类型"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="工序"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="模具号"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="数量"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="估工工时(H)"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="开始时间"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="要求完成日期"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="加工人人员"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
                  label="实际加工工时(H)"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="fileName"
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