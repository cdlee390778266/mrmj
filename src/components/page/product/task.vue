<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：电极设计与CNC编程
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            待处理零件：
            <el-input v-model="form.text" style="width: 130px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            
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
          </div>
        </div>
        <div class="list" ref="list" style="top: 65px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrElectrodeProductionOrderId }" v-show="isShowList" @click="handleSelect(item, 'mrElectrodeProductionOrderId', getAttachments)">
            <div class="dflex">
              <div>
                <div>
                  <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
                </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">模具号：<span>{{ item.mouldNo | filterNull }}</span></p>
                  <p class="flex ellipsis">交期：<span>{{ item.requireDeliveryDate | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">零件号：<span>{{item.components | concatString('componentNo')}}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">数量：{{item.components | concatString('quantity')}}</span></el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click.stop="queryElectrodeComponentInfo(item)">设计完成</a>
                <a href="javascript: void(0);" @click.stop="getOrderDetail(item)">下达电极生产订单</a>
              </el-col>
            </el-row>
          </div>
          <div class="tc pd10" v-show="isShowList && left.isLoadingMore">
            加载中<i class="el-icon-loading"></i>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="selectType(item)"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="refresh">
          <template #pageName>零件信息明细</template>
          <div >
            <div class="main-content-title">
              <div>
                <i class="el-icon-lx-edit"></i> 零件号{{currentData.components | concatString('componentNo')}}电极设计与CNC编程任务信息
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <strong>零件及工艺信息</strong>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{ currentData.mouldNo | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：{{ currentData.name | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交期：{{ currentData.requireDeliveryDate | filterNull }}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">零件号码：{{currentData.components | concatString('componentNo')}}</el-col>
                <el-col :xs="24">
                  材料：{{ currentData.stuffNo | filterNull }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">工序及估工：</el-col>
                <el-col :span="24">
                  <table class="mrmj-table">
                    <thead>
                      <tr>
                        <th class="bge4e4e4">工序顺序</th>
                        <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.name}}</th>
                        <th class="bge4e4e4">工时合计</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="bge4e4e4">估工（H）</td>
                        <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                        <th class="bge4e4e4">
                          {{currentData.processes | sum('estimationWorkTime')}}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </el-col>
              </el-row>
              <el-row class="mgt10">
                <el-col :span="24"><strong>相关附件</strong></el-col>
                <el-col :span="24">
                  <el-table
                    :data="currentData.attachments"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="versionNo" label="版本号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>电极设计任务</strong>
                  <el-button type="primary" class="mgl10" @click="showDialog('taskApply', 'design', currentData.electrodeDesignTasks.mrElectrodeDesignTasksId, '电极设计任务')" v-if="currentData.electrodeDesignTasks && !currentData.electrodeDesignTasks.designer">申领</el-button>
                  <el-button type="primary" class="mgl10" v-if="currentData.electrodeDesignTasks && currentData.electrodeDesignTasks.designer && currentData.electrodeDesignTasks.designer == userName" @click="jump">完成</el-button>
                </el-col>
                <el-col :span="24" v-if="currentData.electrodeDesignTasks && currentData.electrodeDesignTasks.designer">
                  <span>设计人员：{{currentData.electrodeDesignTasks.designer}}</span>
                  <span class="mgl20">完成时间：{{currentData.electrodeDesignTasks.completionDate}}</span>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>ELE编程任务</strong>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.eleProgram && !currentData.eleProgram.designer"
                    @click="showDialog('taskApply', 'eleProgram', currentData.eleProgram.mrProgrammeTasksId, 'ELE编程任务')">
                    申领
                  </el-button>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.eleProgram && currentData.eleProgram.designer && currentData.eleProgram.designer == userName && (!currentData.eleProgram.attachments || !currentData.eleProgram.attachments.length)"
                    @click="showDialog('attachment', 'eleProgram', currentData.eleProgram.mrProgrammeTasksId, 'ELE编程任务')">
                    完成
                  </el-button>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.eleProgram && currentData.eleProgram.designer && currentData.eleProgram.designer == userName && currentData.eleProgram.attachments && currentData.eleProgram.attachments.length"
                    @click="showDialog('attachment', 'eleProgram', currentData.eleProgram.mrProgrammeTasksId, 'ELE编程任务', currentData.eleProgram.attachments)">
                    编辑
                  </el-button>
                </el-col>
                <el-col :span="24" v-if="currentData.eleProgram && currentData.eleProgram.designer">
                  <span>设计人员：{{currentData.eleProgram.designer}}</span>
                  <span class="mgl20">完成时间：{{currentData.eleProgram.completionDate}}</span>
                  <div v-if="currentData.eleProgram.attachments && currentData.eleProgram.attachments.length">
                    <p>ELE编程上传附件</p>
                    <el-table
                      :data="currentData.eleProgram.attachments"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%">
                      <el-table-column
                        type="index"
                        label="序号"
                        width="80">
                      </el-table-column>
                      <el-table-column
                        prop="fileName"
                        label="资料名称"
                        show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="120"
                        align="center"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>CNCV编程任务</strong>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.cncvProgram && !currentData.cncvProgram.designer"
                    @click="showDialog('taskApply', 'eleProgram', currentData.cncvProgram.mrProgrammeTasksId, 'CNCV编程任务')">
                    申领
                  </el-button>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.cncvProgram && currentData.cncvProgram.designer && currentData.cncvProgram.designer == userName && (!currentData.cncvProgram.attachments || !currentData.cncvProgram.attachments.length)"
                    @click="showDialog('attachment', 'eleProgram', currentData.cnchProgram.mrProgrammeTasksId, 'CNCV编程任务')">
                      完成
                  </el-button>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.cncvProgram && currentData.cncvProgram.designer && currentData.cncvProgram.designer == userName && currentData.cncvProgram.attachments && currentData.cncvProgram.attachments.length"
                    @click="showDialog('attachment', 'cncvProgram', currentData.cncvProgram.mrProgrammeTasksId, 'CNCV编程任务', currentData.cncvProgram.attachments)">
                    编辑
                  </el-button>
                </el-col>
                <el-col :span="24" v-if="currentData.cncvProgram && currentData.cncvProgram.designer">
                  <span>设计人员：{{currentData.cncvProgram.designer}}</span>
                  <span class="mgl20">完成时间：{{currentData.cncvProgram.completionDate}}</span>
                  <div v-if="currentData.cncvProgram.attachments && currentData.cncvProgram.attachments.length">
                    <p>CNCV编程上传附件</p>
                    <el-table
                      :data="currentData.cncvProgram.attachments"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%">
                      <el-table-column
                        type="index"
                        label="序号"
                        width="80">
                      </el-table-column>
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
                          <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
              <el-row class="mgt10 mgb40">
                <el-col :span="24">
                  <strong>CNCH编程任务</strong>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.cnchProgram && !currentData.cnchProgram.designer" @click="showDialog('taskApply', 'eleProgram', currentData.cnchProgram.mrProgrammeTasksId, 'CNCH编程任务')">
                    申领
                  </el-button>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.cnchProgram && currentData.cnchProgram.designer && currentData.cnchProgram.designer == userName && (!currentData.cnchProgram.attachments || !currentData.cnchProgram.attachments.length)"
                    @click="showDialog('attachment', 'cnchProgram', currentData.cnchProgram.mrProgrammeTasksId, 'CNCH编程任务')"
                    >
                    完成
                  </el-button>
                  <el-button
                    type="primary"
                    class="mgl10"
                    v-if="currentData.cnchProgram && currentData.cnchProgram.designer && currentData.cnchProgram.designer == userName && currentData.cnchProgram.attachments && currentData.cnchProgram.attachments.length"
                    @click="showDialog('attachment', 'cnchProgram', currentData.cnchProgram.mrProgrammeTasksId, 'CNCH编程任务', currentData.cnchProgram.attachments)">
                    编辑
                  </el-button>
                </el-col>
                <el-col :span="24" v-if="currentData.cnchProgram && currentData.cnchProgram.designer">
                  <span>设计人员：{{currentData.cnchProgram.designer}}</span>
                  <span class="mgl20">完成时间：{{currentData.cnchProgram.completionDate}}</span>
                  <div v-if="currentData.cnchProgram.attachments && currentData.cnchProgram.attachments.length">
                    <p>CNCH编程上传附件</p>
                    <el-table
                      :data="currentData.cnchProgram.attachments"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%">
                      <el-table-column
                        type="index"
                        label="序号"
                        width="80">
                      </el-table-column>
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
                          <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="电极生产订单下达对话框" class="dialog-gray" :visible.sync="handle.add.dialogVisible">
      <div v-loading="handle.add.isLoading">
        <el-form :model="handle.add.form" ref="form" label-width="100px">
          <el-row class="pdtb10 borb">
            <el-col :span="24"><strong>电极列表</strong></el-col>
          </el-row>
          <div class="dialog-content pdt10 pdlr10 mglr10 bgfff">
            <div class="mgb10" :class="{borb: handle.add.data && (index != handle.add.data.length - 1)}" v-for="(item, index) in handle.add.data" :key="index" >
              <el-row>
                <el-col :span="24">
                  <span class="mgr40">电极号：{{ item.electrodeNo }}</span>
                  <span class="mgr40">数量：{{ item.quantity }}</span></span>
                  <span>附件：<el-button type="text" v-for="(itemc, index) in item.attachments" :key="index" @click="down(itemc.fileId)">{{itemc.fileName}}</el-button></span>
                </el-col>
              </el-row>
              <div class="mgb20">
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th class="bge4e4e4">工序顺序</th>
                      <th v-for="(itemc, index) in item.processes" :key="index">{{itemc.processName}}</th>
                      <th class="bge4e4e4">工时合计</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="bge4e4e4">估工(H)</td>
                      <th v-for="(itemc, index) in item.processes" :key="index">
                        {{itemc.estimationWorkTime}}
                      </th>
                      <th class="bge4e4e4">
                        {{item.processes | sum('estimationWorkTime')}}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="addOrder(false)">下达生产订单</el-button>
          <!-- <el-button type="primary" @click="addOrder(true)">保存草稿</el-button> -->
          <el-button type="primary" @click="handle.add.dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="零件电极设计与CNC编程任务完成确认" align="center" width="500px" :visible.sync="handle.design.dialogVisible">
      <div v-loading="handle.design.isLoading" class="tl">
        <el-row>
          <el-col :span="24">
            <strong>零件信息</strong>
          </el-col>
          <el-col :span="12">
            模具号：{{handle.design.data.mouldNo | filterNull}}
          </el-col>
          <el-col :span="12">
            客户：{{handle.design.data.name | filterNull}}
          </el-col>
          <el-col :span="24">
            交期：{{handle.design.data.requireDeliveryDate | filterNull}}
          </el-col>
          <el-col :span="24">
            零件号码：{{handle.design.data.components | concatString('componentNo')}}
          </el-col>
          <el-col :span="24" class="mgt10">
            <strong>电极设计与CNC编程是否已经完成？</strong>
          </el-col>
          <el-col :span="24">
            {{handle.design.data.checkList}}
            <el-checkbox label="查修筋" v-model="handle.design.data.checkReinforcement" :true-label="0" :false-label="1"></el-checkbox>
            <el-checkbox label="查漏设计" v-model="handle.design.data.checkLeakDesign" :true-label="0" :false-label="1"></el-checkbox>
            <el-checkbox label="查粗打齿" v-model="handle.design.data.checkRoughBeatingTeeth" :true-label="0" :false-label="1"></el-checkbox>
            <el-checkbox label="单向公差" v-model="handle.design.data.unilateralTolerance" :true-label="0" :false-label="1"></el-checkbox>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer tr mgt30">
          <el-button type="primary" @click="electrodeDesignCompletion">完成</el-button>
          <el-button type="primary" @click="handle.design.dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="`${handle.taskApply.title}申领确认框`" align="center" width="500px" :visible.sync="handle.taskApply.dialogVisible">
      <div v-loading="handle.taskApply.isLoading" class="tl">
        是否确定申领该零件电极的{{handle.taskApply.title}}?
        <div slot="footer" class="dialog-footer tr mgt30">
          <el-button type="primary" @click="applyElectrode">申领</el-button>
          <el-button type="primary" @click="handle.taskApply.dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="`${handle.attachment.title}编程任务完成确认对话框`" align="center" width="500px" class="dialog-gray" :visible.sync="handle.attachment.dialogVisible">
      <div v-loading="handle.attachment.isLoading" class="tl pdtb20">
        <div>
          <p class="mgb10">
            上传附件：
            <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
              <el-button size="mini" type="primary">上传附件</el-button>
              <input type="file" name="file" ref="file" class="posFull opacity0" @change="addAttachments">
            </span>
          </p>
          <el-table
            :data="handle.attachment.data"
            border
            size="mini"
            max-height="200"
            class="content-table"
            style="width: 100%">
            <el-table-column
              type="index"
              width="50"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="fileName"
              label="附件名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作"
              width="120"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="removeAttachments(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer tr mgt30">
          <el-button type="primary" @click="saveProAttachment">完 成</el-button>
          <el-button type="primary" @click="handle.attachment.dialogVisible = false">返 回</el-button>
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
        defaultImg: require('../../../assets/img/spareParts.svg'),
        userName: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName),
        handle: {
          add: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {
              mouldNo: "",
              name: "",
              type: "0",
              id: "",
              dsc: "",
            }
          },
          design: {
            dialogVisible: false,
            isLoading: false,
            data: {
              checkLeakDesign: 1,
              checkReinforcement: 1,
              checkRoughBeatingTeeth: 1,
              unilateralTolerance: 1
            }
          },
          taskApply: {
            title: '',
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {}
          },
          attachment: {
            type: '',
            dialogVisible: false,
            isLoading: false,
            addFiles: [],
            data: []
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading', isSetCurrentData = false) { //获取左侧列表数据

        let params = {
          parameter: '',
          type: this.filter.selectedValue,
          sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`,
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        }
        if(this.form.text) params.parameter = this.form.text;

        this.getData(this.$utils.CONFIG.api.queryNoDealEleOrCNC, params, 'mrElectrodeProductionOrderId', loadingKey, this.getAttachments, isSetCurrentData);
      },
      getAttachments() {
        
        if(this.currentData.eleProgram && this.currentData.eleProgram.mrProgrammeTasksId) { //ELE附件列表查询

          this.right.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.queryAttInProgramme, (res) => {  

            this.right.isLoading = false;
            this.$set(this.currentData.eleProgram, 'attachments', res.data || []);
          }, () => this.right.isLoading = false, {mrProgrammeTasksId: this.currentData.eleProgram.mrProgrammeTasksId});
        }

        if(this.currentData.cncvProgram && this.currentData.cncvProgram.mrProgrammeTasksId) { //CNCV附件列表查询

          this.right.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.queryAttInProgramme, (res) => {  

            this.right.isLoading = false;
            this.$set(this.currentData.cncvProgram, 'attachments', res.data || []);
          }, () => this.right.isLoading = false, {mrProgrammeTasksId: this.currentData.cncvProgram.mrProgrammeTasksId});
        }

        if(this.currentData.cnchProgram && this.currentData.cnchProgram.mrProgrammeTasksId) { //CNCH附件列表查询

          this.right.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.queryAttInProgramme, (res) => {  

            this.right.isLoading = false;
            this.$set(this.currentData.cnchProgram, 'attachments', res.data || []);
          }, () => this.right.isLoading = false, {mrProgrammeTasksId: this.currentData.cnchProgram.mrProgrammeTasksId});
        }
      },
      resetForm() {
      
        this.handle.design.datacheckLeakDesign = 1;
        this.handle.design.datacheckReinforcement = 1;
        this.handle.design.datacheckRoughBeatingTeeth = 1;
        this.handle.design.dataunilateralToleranc = 1;
      },
      queryElectrodeComponentInfo(item) {

        this.resetForm();
        this.handle.design.dialogVisible = true;

        let params = {
          mrElectrodeProductionOrderId: item.mrElectrodeProductionOrderId
        }

        this.handle.design.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryElectrodeComponentInfo, (res) => {

          this.handle.design.isLoading = false;
          this.handle.design.data = res.data || {};
        }, () => this.handle.design.isLoading = false, params);
      },
      electrodeDesignCompletion() {

        let params = {
          mrElectrodeProductionOrderId: this.handle.design.data.mrElectrodeProductionOrderId,
          checkLeakDesign: this.handle.design.data.checkLeakDesign,
          checkReinforcement: this.handle.design.data.checkReinforcement,
          checkRoughBeatingTeeth: this.handle.design.data.checkRoughBeatingTeeth,
          unilateralTolerance: this.handle.design.data.unilateralTolerance
        }
        
        this.handle.design.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.electrodeDesignCompletion, (res) => {

          this.handle.design.isLoading = false;
          this.handle.design.dialogVisible = false;
          this.$utils.showTip('success', 'success', '102');
        }, () => this.handle.design.isLoading = false, params);
      },
      getOrderDetail(item) {  //电极生产订单详情

        if(item.isCanIssued == 1) {
          let params = {
            mrElectrodeDesignTasksId: item.mrElectrodeDesignTasksId
          }

          this.handle.add.order = item;
          this.handle.add.dialogVisible = true;
          this.handle.add.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.queryElectrodeNoById, (res) => {

            this.handle.add.isLoading = false;
            this.handle.add.data = res.data;
          }, () => this.handle.add.isLoading = false, params);
        }else {

          this.$utils.showTip('warning', 'error', '-1046');
        }
      },
      addOrder(saveAsDraft = false) {  //下达生产订单, saveAsDraft=false为下达电极生产订单;saveAsDraft=true为保存为草稿

        let params = {
          mrElectrodeProductionOrderId: this.handle.add.order.mrElectrodeProductionOrderId,
          createBy: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName),
        }

        let url = saveAsDraft ? this.$utils.CONFIG.api.saveEleAsModify : this.$utils.CONFIG.api.releasedElectrodeProductionOrder;

        this.$utils.getJson(url, (res) => { 

          this.handle.add.isLoading = false;
          this.handle.add.dialogVisible = false;
          this.$utils.showTip('success', 'success', '102');
          !saveAsDraft && this.search();
        }, () => this.handle.add.isLoading = false, params);
      },
      showDialog(formKey, type, id, title, attachments) {
        
        this.handle[formKey].type = type;
        this.handle[formKey].id = id;
        this.handle[formKey].title = title;
        this.handle[formKey].data = attachments ? attachments.concat() : [];
        this.handle[formKey].addFiles = [];
        this.handle[formKey].dialogVisible = true;
      },
      applyElectrode() {  //申领

        let url = '';
        let params = {}

        if(this.handle.taskApply.type == 'design') {

          url = this.$utils.CONFIG.api.applyElectrodeDesignTasks;
          params = {
            mrElectrodeDesignTasksId: this.handle.taskApply.id,
            designer: this.userName
          }
        }else {

          url = this.$utils.CONFIG.api.applyProgrammeTask;
          params = {
            mrProgrammeTasksId: this.handle.taskApply.id,
            designer: this.userName
          }
        }

        this.handle.taskApply.isLoading = true;
        this.$utils.getJson(url, (res) => { 

          this.handle.taskApply.isLoading = false;
          this.handle.taskApply.dialogVisible = false;
          this.$utils.showTip('success', 'success', '103');
          this.getLeftList('isLoading', true);
        }, () => this.handle.taskApply.isLoading = false, params);
      },
      jump() {

        let time = new Date().getTime();
        this.$utils.setStorage(time, JSON.stringify(this.currentData));
        this.$router.push(`/product/designElectrode/${time}`);
      },
      addAttachments() {
        
        let fileId = new Date().getTime();
        this.$refs.file.files[0].fileId = fileId;
        this.handle.attachment.addFiles.push(this.$refs.file.files[0]);
        this.handle.attachment.data.push({
          type: 'add',
          fileId: fileId,
          fileName: this.$refs.file.files[0].name
        })
        this.$refs.file.value = '';
      },
      removeAttachments(file) {

        this.handle.attachment.data = this.handle.attachment.data.filter(item => item.fileId != file.fileId);

        if(file.type == 'add') {
          this.handle.attachment.addFiles = this.handle.attachment.addFiles.filter(item => item.fileId != file.fileId);
        }
      },
      saveProAttachment() { //保存编程任务附件

        if(this.handle.attachment.addFiles.length) {

          this.uploadFile(this.handle.attachment);
        }else {

          this.uploadSuccess();
        }
      },
      uploadSuccess(res) {

        let params = [];

        this.handle.attachment.data.map(item => {

          if(!item.type) {  //添加原有附件数据
            params.push({
              mrProgrammeTasksId: this.handle.attachment.id,
              fileId: item.fileId,
              fileName: item.fileName,
              filePath: '',
              versionNO: ''
            })
          }
        })

        if(res && res.data && res.data.length) { //如通有新增附件

          res.data.map(item => {  //添加新增附件数据

            params.push({
              mrProgrammeTasksId: this.handle.attachment.id,
              fileId: item.fileId,
              fileName: item.fileName,
              filePath: '',
              versionNO: ''
            })
          })
        }
        
        this.handle.attachment.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.saveProAttachment, (response) => { 

          this.handle.attachment.isLoading = false;
          this.handle.attachment.dialogVisible = false;
          this.$utils.showTip('success', 'success', '102');
          this.getLeftList('isLoading', true);
        }, () => this.handle.attachment.isLoading = false, params);
      },
      refresh() {}
    },
    created() {

      this.getLeftList();
    }
  };
</script>


<style scoped lang="scss">
  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
  }
</style>