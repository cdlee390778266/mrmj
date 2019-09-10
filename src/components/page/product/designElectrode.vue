<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>  <strong>当前位置：</strong> 电极设计任务->完成电极设计任务
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 68px;" v-loading="right.isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg">
            <h4>电极对应零件信息</h4>
            <div class="msg-wrapper">
              <span class="mgr20">模具号：{{component.mouldNo}}</span>
              <span class="mgr20">零件号：{{component.components | concatString('componentNo')}}</span>
              <span class="mgr20">要求交期：{{ component.requireDeliveryDate | filterNull }}</span>
              <span class="mgr20">数量：{{component.components | concatString('quantity')}}</span>
            </div>
          </div>
          <div class="content">
            <h5 class="content-left-title">零件工艺版本列表</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div class="tr mgt20">
                <el-button type="primary" size="mini" @click="addVersion">增加电极</el-button>
              </div>
              <div class="list tc">
                <div class="list-head dflex">
                  <div class="flex">电极号</div>
                  <div class="flex">数量</div>
                  <div class="flex">操作</div>
                </div>
                <div class="list-body">
                  <div class="dflex" v-for="(item, index) in left.list" :key="index" :class="{active: left.activeId == index}" @click="handleSelect(item, index)">
                    <div class="flex">
                      <div class="edit">
                        <div @click="showObjInput(item, 'electrodeNoEdit')">
                          <div class="ellipsis">{{ item.electrodeNo }}</div>
                          <el-input size="mini" v-if="item.type == 'add'" v-model="item.electrodeNo" @focus="showObjInput(item, 'electrodeNoEdit')" @blur="item.electrodeNoEdit = false" :style="{opacity: item.electrodeNoEdit ? 1 : 0}"/>
                        </div>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="edit">
                        <div @click="showObjInput(item, 'quantityEdit')">
                          <div class="ellipsis">{{ item.quantity }}</div>
                          <el-input size="mini" v-if="item.type == 'add'" v-model="item.quantity" @focus="showObjInput(item, 'quantityEdit')" @blur="item.quantityEdit = false" :style="{opacity: item.quantityEdit ? 1 : 0}"/>
                        </div>
                      </div>
                    </div>
                    <div class="flex">
                      <el-button type="text" @click.stop="deleteVersion(index)">删除</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title">工艺信息明细</h5>
            <div class="content-right">
              <p><strong>基本信息</strong></p>
              <p>
                <span>电极号：</span> 
                <el-input size="mini" v-model="currentData.electrodeNo" style="width: 100px" />
                <span class="mgl20">数量：</span> 
                <el-input size="mini" v-model="currentData.quantity" style="width: 100px" />
              </p>
              <p>
                <strong>电极工序与估工</strong>
                <el-table
                  :data="currentData.processes"
                  border
                  size="mini"
                  max-height="200"
                  class="content-table edit-table"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="工序序号"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    label="工序名称"
                    show-overflow-tooltip>
                    <template scope="scope">
                      <div>
                        <div @click="showInput(currentData.processes, scope.$index, 'processNameEdit')">
                          <div class="ellipsis">{{ scope.row.processName }}</div>
                          <el-autocomplete
                            class="inline-input"
                            v-model="scope.row.processName"
                            :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, right.process, 'name')"
                            valueKey="name"
                            value="name"
                            placeholder="请输入内容"
                            @focus="showInput(currentData.processes, scope.$index, 'processNameEdit')"
                            @blur="scope.row.processNameEdit = false"
                            :style="{opacity: scope.row.processNameEdit ? 1 : 0}"
                          ></el-autocomplete>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="估工(H)"
                    show-overflow-tooltip>
                    <template scope="scope">
                      <div>
                        <div @click="showInput(currentData.processes, scope.$index, 'estimationWorkTimeEdit')">
                          <div class="ellipsis">{{ scope.row.estimationWorkTime }}</div>
                          <el-input size="mini" v-model="scope.row.estimationWorkTime" @focus="showInput(currentData.processes, scope.$index, 'estimationWorkTimeEdit')" @blur="scope.row.estimationWorkTimeEdit = false" :style="{opacity: scope.row.estimationWorkTimeEdit ? 1 : 0}"/>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </p>
              <template v-if="currentData.mrElectrodeProductionListOrderId">
                <p><strong>电极设计附件</strong></p>
                <p>
                  上传附件：
                  <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                    <el-button size="mini" type="primary">上传附件</el-button>
                    <input type="file" name="file" ref="file" class="posFull opacity0" @change="uploadFile">
                  </span>
                </p>
                <el-table
                  :data="currentData.attachments"
                  border
                  size="mini"
                  class="content-table"
                  style="width: 100%">
                  <el-table-column
                    prop="fileName"
                    label="资料名称"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="operator"
                    label="操作"
                    width="120"
                    align="center"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" @click="deleteFiles(scope.row.fileId, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
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
        width: 210px;
        overflow: auto;
        border: 1px solid #ddd;
        .list {
          .list-head {
            position: absolute;
            top: 60px;
            right: 0;
            left: 0;
            background: rgba(228, 228, 228, 1);
            & > div {
              border-right: 1px solid #ddd;
            }
          }
          .list-body {
            position: absolute;
            top: 80px;
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
        left: 230px;
        font-weight: normal;
        font-size: 14px;
        background: #fff;
        z-index: 8;
      }
      .content-right {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 220px;
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