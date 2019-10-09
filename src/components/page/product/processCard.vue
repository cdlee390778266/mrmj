<template>
  <div v-loading="isLoading">
    <div class="crumbs" style="border: none;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i>
          <strong>当前位置：</strong>
          <span v-if="component.type == 'remanufacture'">生产订单跟踪->下达重制订单</span>
          <span v-else>零件工艺设计->制定工艺卡</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="v-tabs">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">制定工艺卡</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >工艺卡预览</span>
    </div>
    <div class="detail-main" v-loading="right.isLoading">
      <div class="calc hide  mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="main">
          <div class="msg">
            <h4>订单信息</h4>
            <div class="msg-wrapper">
              <!-- 重制订单 -->
              <div class="mgt10" v-if="component.type == 'remanufacture'">
                <span>客户：
                  <el-autocomplete
                    size="mini"
                    style="width: 160px;"
                    class="inline-input"
                    v-model="right.page1.stuffNo"
                    :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, right.stuff, 'stuffNo')"
                    valueKey="stuffNo"
                    value="stuffNo"
                  ></el-autocomplete>
                </span>
                <span class="mgl20">模具号：
                  <el-autocomplete
                    size="mini"
                    style="width: 160px;"
                    class="inline-input"
                    v-model="right.page1.stuffNo"
                    :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, right.stuff, 'stuffNo')"
                    valueKey="stuffNo"
                    value="stuffNo"
                  ></el-autocomplete>
                </span>
                <span class="mgl20">零件号：
                  <el-autocomplete
                    size="mini"
                    style="width: 160px;"
                    class="inline-input"
                    v-model="right.page1.stuffNo"
                    :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, right.stuff, 'stuffNo')"
                    valueKey="stuffNo"
                    value="stuffNo"
                  ></el-autocomplete>
                </span>
                <span class="mgl20">手动增加原因：
                  <el-select size="mini" v-model="right.page1.drawingVersionNo" placeholder="请选择" style="width: 77px;">
                    <el-option label="重置" :value="0"></el-option>
                    <el-option label="其它" :value="1"></el-option>
                  </el-select>
                </span>
                <span class="mgl20">数量：
                  <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 66px" />
                </span>
              </div>
              <template v-else>
                <span class="mgr20">模具号：{{component.mouldNo}}</span>
                <span class="mgr20">零件号：{{component.componentNos}}</span>
                <span class="mgr20">客户：{{component.name}}</span>
                <span class="mgr20">要求交期：{{component.completionDate}}</span>
                <span class="mgr20">数量：{{component.requirementQuantitys}}</span>
                <span>客户PO.号：{{component.customerPoNo}}</span>
            </template>
            </div>
          </div>
          <div class="content" :style="{top: component.type == 'remanufacture' ? '66px' : '40px'}">
            <h5 class="content-left-title">零件工艺版本列表</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div class="list tc">
                <div class="list-head dflex">
                  <div class="flex">工艺版本号</div>
                  <div class="flex">图纸名称版本</div>
                </div>
                <div class="list-body">
                  <div class="dflex" v-for="(item, index) in left.list" :key="index" :class="{active: left.activeId == item.mrCraftRouteLineVersionId}" @click="handleSelect(item)">
                    <div class="flex">{{item.craftVersionNo}}</div>
                    <div class="flex">{{item.drawingVersionNo}}</div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title">工艺信息明细</h5>
            <div class="content-right" v-loading="right.isLoading">
              <p><strong>工艺版本号</strong>（可输入新的版本号，保存后为零件增加新版本工艺路线）
              </p>
              <p>
                <span>工艺路线版本号：</span> 
                <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                <span class="mgl20">使用图纸版本号：</span> 
                <el-select size="mini" v-model="right.page1.drawingVersionNo" placeholder="请选择" style="width: 100px;">
                  <el-option v-for="(itemc, index) in left.list" :key="index" :label="itemc.drawingVersionNo" :value="itemc.drawingVersionNo"></el-option>
                </el-select>
              </p>
              <p v-for="(item, index) in right.page1.components" :key="index">
                <span>零件号码：{{item.componentNo}}</span>
                <span class="mgl20">数量： 
                <el-input size="mini" v-model="item.quantity" style="width: 100px" /></span>
                <span class="mgl20">备货数量： 
                <el-input size="mini" v-model="item.stockingQuantity" style="width: 100px" /></span>
              </p>
              <p><strong>下料清单</strong></p>
              <p>
                <span class="mgl20">材料：
                  <el-autocomplete
                    style="width: 100px;"
                    class="inline-input"
                    v-model="right.page1.stuffNo"
                    :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, right.stuff, 'stuffNo')"
                    valueKey="stuffNo"
                    value="stuffNo"
                    placeholder="请输入内容"
                  ></el-autocomplete>
                </span>
                <span class="mgl20">下料尺寸(净尺寸mm)：
                  <el-input size="mini" v-model="right.page1.length" style="width: 70px" placeholder="长"/>
                  x
                  <el-input size="mini" v-model="right.page1.width" style="width: 70px" placeholder="宽"/>
                  x
                  <el-input size="mini" v-model="right.page1.height" style="width: 70px" placeholder="高"/>
                </span>
              </p>
              <p>
                备注：
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  style="width: 600px;"
                  v-model="right.page1.remark">
                </el-input>
              </p>
              <p>
                <strong>加工工序</strong>
                <el-table
                  :data="right.page1.processes"
                  border
                  size="mini"
                  max-height="200"
                  class=" edit-table"
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
                        <div @click="showInput(right.page1.processes, scope.$index, 'nameEdit')">
                          <div class="ellipsis">{{ scope.row.name }}</div>
                          <el-autocomplete
                            class="inline-input"
                            v-model="scope.row.name"
                            :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, right.process, 'name')"
                            valueKey="name"
                            value="name"
                            placeholder="请输入内容"
                            @focus="showInput(right.page1.processes, scope.$index, 'nameEdit')"
                            @blur="scope.row.nameEdit = false"
                            :style="{opacity: scope.row.nameEdit ? 1 : 0}"
                          ></el-autocomplete>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="加工工序内容"
                    show-overflow-tooltip>
                    <template scope="scope">
                      <div>
                        <div @click="showInput(right.page1.processes, scope.$index, 'processContentTextEdit')">
                          <div class="ellipsis">{{ scope.row.processContentText }}</div>
                          <el-autocomplete
                            class="inline-input"
                            v-model="scope.row.processContentText"
                            :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, right.sysCode, 'codeName')"
                            valueKey="codeName"
                            value="codeName"
                            placeholder="请输入内容"
                            @focus="showInput(right.page1.processes, scope.$index, 'processContentTextEdit')"
                            @blur="scope.row.processContentTextEdit = false"
                            :style="{opacity: scope.row.processContentTextEdit ? 1 : 0}"
                          ></el-autocomplete>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="是否委外"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>
                        <div @click="showInput(right.page1.processes, scope.$index, 'nameEdit')">
                          <div class="ellipsis">
                            {{ 
                              scope.row.isOutsource == 1 ? '是' : (
                                 scope.row.isOutsource == 0 ? '否' : ''
                              )
                            }}
                          </div>
                          <el-select
                            v-model="scope.row.isOutsource"
                            placeholder="请选择"
                            :style="{opacity: scope.row.isOutsourceEdit ? 1 : 0}"
                            @focus="showInput(right.page1.processes, scope.$index, 'isOutsourceEdit')"
                            @blur="scope.row.isOutsourceEdit = false">
                            <el-option
                              v-for="itemc in $dict.outsourceList"
                              :key="itemc.value"
                              :label="itemc.label"
                              :value="itemc.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="估工(H)"
                    show-overflow-tooltip>
                    <template scope="scope">
                      <div>
                        <div @click="showInput(right.page1.processes, scope.$index, 'estimationWorkTimeEdit')">
                          <div class="ellipsis">{{ scope.row.estimationWorkTime }}</div>
                          <el-input size="mini" v-model="scope.row.estimationWorkTime" @focus="showInput(right.page1.processes, scope.$index, 'estimationWorkTimeEdit')" @blur="scope.row.estimationWorkTimeEdit = false" :style="{opacity: scope.row.estimationWorkTimeEdit ? 1 : 0}"/>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </p>
              <p>
                工艺说明：
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="right.page1.processDescription">
                </el-input>
              </p>
              <template v-if="(component.type == 'edit') && isExistenceVersion(left.list, right.page1.craftVersionNo, 'craftVersionNo')">
                <p><strong>工艺附件</strong></p>
                <p>
                  上传工艺附件：
                  <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                    <el-button size="mini" type="primary">上传图纸</el-button>
                    <input type="file" name="file" ref="file" class="posFull opacity0" @change="uploadFile">
                  </span>
                </p>
                <el-table
                  :data="right.page1.attachments"
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
                    label="操作者"
                    width="120"
                    align="center"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" @click="deleteFiles(scope.row.fileId, scope.row)">删除</el-button>
                      <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
        <div class="preview-content">

        </div>
        <div class="preview-handle tc">
          <p class="mgt20"><el-button type="primary" style="width: 80px;">打印</el-button></p>
          <p class="mgt10"><el-button type="primary" style="width: 80px;">导出PDF</el-button></p>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="back">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        activeTab: "calc",
        time: '',
        isLoading: false,
        component: {},
        form: {}
      }
    },
    methods: {
      getLeftList() { //获取版本列表

        if(this.component.type == 'edit') {  //如果是编辑

          let params = {
            componentNo: this.component.componentNos
          }
          this.left.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.queryComponentVersion, (res) => {

            this.left.isLoading = false;
            this.left.list = res.data || [];
            if(this.left.list.length) {

              this.left.activeId = this.left.list[0].mrCraftRouteLineVersionId;
              this.currentData = this.left.list[0];
              this.getDetail(this.currentData);
            }
          }, () => this.left.isLoading = false, params)
        }else if(this.component.type == 'add') { //如果是制定工艺
          
          this.component.components.map(item => {
            item.quantity = item.requirementQuantity;
          })
          this.right.page1 = {
            components: this.$utils.deepCopy(this.component.components),
            processes: [{}]
          }
        }else { //下达重制订单

          this.right.page1 = {
            components: this.$utils.deepCopy(this.component.components),
            processes: [{}]
          }
        }
      },
      getDetail(currentData) {
        
        let params = {
          mrCraftRouteLineId: currentData.mrCraftRouteLineId,
          versionNo: currentData.craftVersionNo,
        }

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryVersionDetail, (res) => { //版本详情 

          this.right.isLoading = false;
          this.right.page1 = res.data || {};
          if(!this.right.page1.processes || !this.right.page1.processes.length) {
            this.right.page1.processes = [{}]
          }
        }, () => this.right.isLoading = false, params);
      },
      handleSelect(item) {
      
        this.left.activeId = item.mrCraftRouteLineVersionId;
        this.currentData= item;
        this.getDetail(this.currentData);
      },
      uploadSuccess(res) {

        this.$refs.file.value = '';
        let params = [{
            fileId: res.data[0].fileId,
            fileName: res.data[0].fileName,
            mrCraftRouteLineVersionId: this.currentData.mrCraftRouteLineVersionId
          }]
        this.$utils.getJson(this.$utils.CONFIG.api.saveCraftAttachment, (response) => { //版本详情 

          this.right.page1.attachments.push({
            fileId: res.data[0].fileId,
            fileName: res.data[0].fileName,
            fileSize: res.data[0].fileSize,
            operator: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName)
          });
        }, () => this.right.isLoading = false, params);
      },
      deleteSuccess() {

        this.$utils.getJson(this.$utils.CONFIG.api.deleteCraftAttachment, (response) => { //版本详情 
          
          this.right.page1.attachments = this.right.page1.attachments.filter(item => this.deleteRow.fileId != item.fileId);
        }, () => this.right.isLoading = false, {fileId: this.deleteRow.fileId});
      },
      back() {

        if(this.component.activeId) {

          this.$router.push(`/product/technology/${this.component.activeId}`);
        }else {
          
          this.$router.go(-1);
        }
      },
      save() {

        if(!this.right.page1.craftVersionNo) { //如果没有输入工艺路线版本号
          this.$utils.showTip('warning', 'error', '-1043');
          return;
        }

        if(!this.right.page1.stuffNo) { //如果没有输入材料
          this.$utils.showTip('warning', 'error', '-1047');
          return;
        }

        if(this.isExistenceVersion(this.left.list, this.right.page1.craftVersionNo, 'craftVersionNo') && this.currentData.craftVersionNo != this.right.page1.craftVersionNo) { //输入工艺路线版本号与选中工艺路线版本号不一致
          this.$utils.showTip('warning', 'error', '-1045');
          return;
        }

        let url = '';
        let params = {}

        if((this.component.type == 'edit') && this.isExistenceVersion(this.left.list, this.right.page1.craftVersionNo, 'craftVersionNo')) {

          url = this.$utils.CONFIG.api.modifyCraftRouteLine;
          params = {
            mrCraftRouteLineVersionId: this.right.page1.mrCraftRouteLineVersionId,
            versionNo: this.right.page1.craftVersionNo,
            stuffNo: this.right.page1.stuffNo || '',
            length: parseFloat(this.right.page1.length) || 0,
            width: parseFloat(this.right.page1.width) || 0,
            height: parseFloat(this.right.page1.height) || 0,
            remark: this.right.page1.remark || '',
            processDescription: this.right.page1.processDescription || '',
            components: [],
            processes: []
          }
        }else {

          url = this.$utils.CONFIG.api.designCraftRouteLine;
          params = {
            saleOrderId: this.component.mrSaleOrderId,
            customerId: this.component.customerId,
            versionNo: this.right.page1.craftVersionNo,
            drawingVersionNo: this.right.page1.drawingVersionNo || '',
            stuffNo: this.right.page1.stuffNo || '',
            length: parseFloat(this.right.page1.length) || 0,
            width: parseFloat(this.right.page1.width) || 0,
            height: parseFloat(this.right.page1.height) || 0,
            remark: this.right.page1.remark || '',
            processDescription: this.right.page1.processDescription || '',
            components: [],
            processes: []
          }
        }

        this.right.page1.components.map(item => { //零件列表

          let obj = {
            componentNo: item.componentNo,
            quantity: parseInt(item.quantity) || 0,
            stockingQuantity: parseInt(item.stockingQuantity) || 0,
          }
          if((this.component.type == 'edit') && this.isExistenceVersion(this.left.list, this.right.page1.craftVersionNo, 'craftVersionNo')) {

            obj.mrComponentCraftId = item.mrComponentCraftId
          }
          params.components.push(obj);
        })

        this.right.page1.processes.map((item, index) => { //工艺列表

          if(item.name) {

            let obj = {
              processSequence: index + 1,
              name: item.name,
              processContentText: item.processContentText || '',
              isOutsource: item.isOutsource,
              estimationWorkTime: parseFloat(item.estimationWorkTime) || 0,
              operator: item.operator
            }
            
            if((this.component.type == 'edit') && this.isExistenceVersion(this.left.list, this.right.page1.craftVersionNo, 'craftVersionNo') && item.mrComponentCraftProcessId) {
              obj.mrComponentCraftProcessId = item.mrComponentCraftProcessId
            }
            params.processes.push(obj);
          }
        })

        this.isLoading = true;
        this.$utils.getJson(url, (res) => { //版本详情 

          this.isLoading = false;
          this.$utils.showTip('success', 'success', '102');
          this.component.type = 'edit';
          localStorage.setItem(this.time, JSON.stringify(this.component));

          this.back();
        }, () => this.isLoading = false, params);
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
            top: 15px;
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
  .crumbs {
    padding-bottom: 10px;
    border-bottom: 1px solid #a3bf1f;
  }
</style>