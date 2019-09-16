<template>
  <div>
    <div class="detail-main" style="top: 48px;bottom: 10px;" v-loading="right.isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg" style="width: 100%;">
            <div class="msg-wrapper">
              <el-button type="primary">制定作业计划</el-button>
              <el-button type="primary">发货</el-button>
              <el-dropdown ref="sort" :hide-on-click="false">
                <el-button type="primary" icon="el-icon-sort" class="mgl10"></el-button>
                <el-dropdown-menu slot="dropdown" class="sort">
                  <el-dropdown-item>
                    <el-button type="text" class="fs14" :class="{active: filter.sort.sortType == ''}" @click="checkSort('')">升序</el-button>
                    <el-button type="text" class="fr fs14" :class="{active: filter.sort.sortType == 'desc'}" @click="checkSort('desc')">降序</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item divided v-for="(item, index) in filter.sort.listType.product" :key="index">
                    <el-radio v-model="filter.sort.sortField" :label="item.value">{{item.label}}</el-radio>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span class="mgl20">
                工序估工时间超过
                <el-input v-model="right.page1.data" style="width: 60px;" size="mini"></el-input>
                小时，进行标红提示
              </span>
            </div>
            <div class="mgt5 fs12 legend">
              表格图例说明：
              <span><i></i>下道工序</span>
              <span class="mgl20"><i></i>工件位置</span>
              <span class="mgl20"><i></i>正在加工</span>
              <span class="mgl20"><i></i>暂停加工</span>
              <span class="mgl20"><i></i>工件完成</span>
            </div>
          </div>
          <div class="content">
            <div class="content-left" v-loading="left.isLoading">
              <el-table
                :data="tableData3"
                :span-method="objectSpanMethod"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="模具号">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="出货日期">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="客户">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="要求交期">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="状态">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="零件号码">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="数量">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="版本">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="整体外协">
                </el-table-column>
                <el-table-column label="工艺时间" align="center">
                  <el-table-column
                    prop="name"
                    label="M"
                    align="center"
                    width="66">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="M"
                    align="center"
                    width="66">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="M"
                    align="center"
                    width="66">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="M"
                    align="center"
                    width="66">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="M"
                    align="center"
                    width="66">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="M"
                    align="center"
                    width="66">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="M"
                    align="center"
                    width="66">
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="detail-footer tr">
            <div class="dflex" style="align-items: center;">
              <div class="pdlr10">模具号：18473</div>
              <div class="pdlr10">零件号：100-14/15</div>
              <div class="flex pdlr10">
                <span>当前状态：</span>
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.name}}</th>
                      <th>66</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>状态</td>
                      <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
                      <th>66</th>
                    </tr>
                    <tr>
                      <td>估工工时</td>
                      <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
                      <th>66</th>
                    </tr>
                    <tr>
                      <td>实际工时</td>
                      <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
                      <th>66</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="生产订单信息查看修改" class="dialog-gray" :visible.sync="handle.setting.dialogVisible" width="500px">
      <el-form :model="handle.setting.form" label-width="100px">
        <div class="dialog-content pdt10">
          <el-row class="pdtb10" :gutter="20">
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer tr pdb20 pdlr10">
            <el-button type="primary" @click="handle.setting.dialogVisible = false">保 存</el-button>
            <el-button @click="handle.setting.dialogVisible = false">返 回</el-button>
          </div>
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
        },
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }],
        handle: {
          setting: {
            dialogVisible: false,
            data: {},
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: ""
            }
          }
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
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
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
    .legend {
      span {
        i {
          position: relative;
          top: 2px;
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 2px;
        }
        &:nth-child(5n+1) i {
          background: rgba(0, 176, 80, 1);
        }
        &:nth-child(5n+2) i {
          background: rgba(255, 255, 0, 1);
        }
        &:nth-child(5n+3) i {
          background: rgba(0, 176, 240, 1);
        }
        &:nth-child(5n+4) i {
          background: rgba(228, 109, 10, 1);
        }
        &:nth-child(5n+5) i {
          background: rgba(141, 180, 227, 1);
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
      .content-left {
        position: absolute;
        top: 24px;
        right: 0px;
        bottom: 200px;
        left: 0;
        padding: 20px 10px;
        width: auto !important;
        overflow: auto;
      }
    }
    .detail-footer {
      border: none;
    }
  }
  .setting-item {
    margin-bottom: 10px;
    h3 {
      position: absolute;
      top: -10px;
      font-size: 14px;
      font-weight: normal;
      background: #f2f2f2;
    }
    padding: 10px;
    border: 1px solid #ddd;
  }
</style>