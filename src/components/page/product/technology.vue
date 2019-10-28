<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：工艺设计与估工
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div>
            待处理订单：
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
            <div>
              <el-button type="primary" style="width: 100%; margin-top: 10px;" @click="showUpdateDialog">新增订单</el-button>
            </div>
          </div>
        </div>
        <div class="list" ref="list" style="top: 96px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrSaleOrderId }" v-show="isShowList" @click="handleSelect(item, 'mrSaleOrderId')">
            <div class="dflex">
              <div>
                <div>
                  <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
                </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">来源：<span>{{ item.saleOrderOrigin | filterNull }}</span></p>
                  <p class="flex ellipsis">模具号：<span>{{ item.mouldNo | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">客户：<span>{{ item.name | filterNull }}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">交期：{{ item.completionDate | filterNull }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click.stop="getOrderDetail(item)">下达生产订单</a>
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
        <page-wrapper @change="refresh" :haveCarousel="true">
          <template #pageName>订单明细</template>
            <el-carousel
              direction="vertical"
              :autoplay="false"
              :loop="false"
              trigger="click"
              ref="carousel"
            >
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 订单{{ right.page1.saleOrderNo }}信息
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{ right.page1.mouldNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{ right.page1.saleOrderType | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{ right.page1.customerPoNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{ right.page1.name | filterNull }}</el-col>
                    <el-col :xs="24">
                      <p>订单说明</p>
                      <p>{{ right.page1.remark | filterNull }}</p>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">订单零件列表：</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page1.componentOrders"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="componentNo" label="零件号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerNo" label="客户编号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requirementQuantity" label="数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="issuedOrderDate" label="下单日期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requireDeliveryDate" label="要求交期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">订单附件：</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page1.attachments"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
                            <el-button type="text" @click="down(scope.row.fileId)">下载</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </el-carousel-item>
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 制定零件工艺
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row v-show="right.page2.noMakeCraftList && right.page2.noMakeCraftList.length">
                    <el-col :span="24" class="mgb10 mgt10">
                      <strong>待制定订单零件列表</strong>
                      <el-button type="primary" class="mgl10" @click="jump('add')">选择下表零件，点我制定工艺</el-button>
                      <span>（选择多个零件，表示选择多个工艺相同零件一齐制定工艺）</span>
                    </el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page2.noMakeCraftList"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column
                        type="selection"
                        width="50">
                        </el-table-column>
                        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="componentNo" label="零件号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerNo" label="客户编号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requirementQuantity" label="要求数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="issuedOrderDate" label="下单日期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requireDeliveryDate" label="要求交期" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="mgtb10"><strong>已制定工艺卡列表</strong></el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page2.haveMakeCraftList"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column label="零件号" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{scope.row.components | concatString('componentNo')}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="craftMakePerson" label="工艺制定人员" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="completionDate" label="完成日期" show-overflow-tooltip></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
                            <el-button type="text" @click="jump('edit', scope.row)">编辑</el-button>
                            <el-button type="text" @click="deleteCraft(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </el-carousel-item>
            </el-carousel>
         
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="新增生产订单草稿" :visible.sync="handle.update.dialogVisible" width="700px">
      <div v-loading="handle.update.isLoading">
        <el-form ref="updateForm" :model="handle.update.form" :rules="handle.update.rules" label-width="100px">
          <div class="dflex">
            <div class="flex">
              <el-form-item label="客户:" prop="name">
                <el-autocomplete
                  v-model="handle.update.form.name"
                  :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.customer, 'name')"
                  valueKey="name"
                  value="name"
                  placeholder="请输入客户"
                  style="width: 100%;"></el-autocomplete>
              </el-form-item>
              <el-form-item prop="customerPoNo" label="客户PO.号:">
                <el-input v-model="handle.update.form.customerPoNo" auto-complete="off" aria-placeholder="请输入客户PO.号"></el-input>
              </el-form-item>
              <el-form-item label="模具号" prop="mouldNo">
                <el-input v-model="handle.update.form.mouldNo" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
              </el-form-item>
            </div>
          </div>
          <div>
            <p class="mgb5">零件清单：</p>
            <el-table
              :data="handle.update.form.componentOrders"
              max-height="160"
              border
              size="mini"
              style="width: 100%"
              class="edit-table">
              <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'componentNoEdit')">
                      <div class="eaaipsis">{{ scope.row.componentNo }}</div>
                      <el-input size="mini" v-model="scope.row.componentNo" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'componentNoEdit', {}, false)" @blur="scope.row.componentNoEdit = false" :style="{opacity: scope.row.componentNoEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="数量" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'quantityEdit')">
                      <div class="eaaipsis">{{ scope.row.quantity }}</div>
                      <el-input size="mini" v-model="scope.row.quantity" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'quantityEdit', {}, false)" @blur="scope.row.quantityEdit = false" :style="{opacity: scope.row.quantityEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'customerNoEdit')">
                      <div class="eaaipsis">{{ scope.row.customerNo }}</div>
                      <el-input size="mini" v-model="scope.row.customerNo" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'customerNoEdit', {}, false)" @blur="scope.row.customerNoEdit = false" :style="{opacity: scope.row.customerNoEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="要求交期" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'deliveryDateEdit', {})">
                      <div class="ellipsis">{{ scope.row.deliveryDate }}</div>
                      <el-date-picker
                        type="date"
                        size="mini"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="scope.row.deliveryDate"
                        @focus="showInput(handle.update.form.componentOrders, scope.$index, 'deliveryDateEdit', {})"
                        @blur="scope.row.deliveryDateEdit = false"
                        :style="{opacity: scope.row.deliveryDateEdit ? 1 : 0}">
                      </el-date-picker>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="说明" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'descriptionEdit')">
                      <div class="eaaipsis">{{ scope.row.description }}</div>
                      <el-input size="mini" v-model="scope.row.description" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'descriptionEdit', {}, false)" @blur="scope.row.descriptionEdit = false" :style="{opacity: scope.row.descriptionEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <p class="mgtb10">
              上传附件：
              <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                <el-button size="mini" type="primary">选择上传文件</el-button>
                <input type="file" name="file" ref="fileUpdate" class="posFull opacity0" @change="() => addAttachments()">
              </span>
            </p>
            <el-table
              :data="handle.update.form.attachments"
              max-height="160"
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column prop="fileName" label="资料名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="() => deleteAttachments(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item label="说明:" class="mgt20">
            <el-input type="textarea" v-model="handle.update.form.f"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button type="primary" @click="saveUpdate">保存</el-button>
          <el-button @click="handle.update.dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="下达生产订单" class="dialog-gray" :visible.sync="handle.add.dialogVisible">
      <div v-loading="handle.add.isLoading">
        <el-form :model="handle.add.form" label-width="100px">
          <el-row class="pdtb10 borb">
            <el-col :span="8">模具号：{{handle.add.order && handle.add.order.mouldNo}}</el-col>
            <el-col :span="8">客户：{{handle.add.order && handle.add.order.name}}</el-col>
            <el-col :span="8">交期：{{handle.add.order && handle.add.order.mouldNo}}</el-col>
          </el-row>
          <div class="dialog-content pdt10 pdlr10 mglr10 bgfff">
            <div class="mgb10" :class="{borb: handle.add.data && (index != handle.add.data.length - 1)}" v-for="(item, index) in handle.add.data" :key="index" >
              <el-row>
                <el-col :span="24" class="mgb10">
                  <span class="mgr40">序号：{{index + 1}}</span>
                  <span class="mgr40">零件号码：{{item.components | concatString('componentNo')}}</span></span>
                  <span>数量：{{item.components | concatString('quantity')}}</span>
                </el-col>
                <el-col :span="24" class="mgb10">
                  <span class="mgr40">版本：
                    <el-select style="width: 100px;" v-model="item.selectedVersionNo">
                      <el-option v-for="(itemc, index) in item.versions" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                    </el-select>
                  </span>
                  <span>材料：{{getSelectedVersionStuffNo(item.versions, item.selectedVersionNo)}}</span>
                </el-col>
              </el-row>
              <div class="mgb20">
                <p>工序及估工：</p>
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th class="bge4e4e4">工序顺序</th>
                      <th v-for="(itemc, index) in getSelectedProcesses(item.versions, item.selectedVersionNo)" :key="index">{{itemc.name}}</th>
                      <th class="bge4e4e4">工时合计</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="bge4e4e4">估工（H）</td>
                      <th v-for="(itemc, index) in getSelectedProcesses(item.versions, item.selectedVersionNo)" :key="index">{{itemc.estimationWorkTime}}</th>
                      <th class="bge4e4e4">
                        {{getSelectedProcesses(item.versions, item.selectedVersionNo) | sum('estimationWorkTime')}}
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
          <el-button type="primary" @click="addOrder(true)">保存草稿</el-button>
          <el-button type="primary" @click="handle.add.dialogVisible = false">返回</el-button>
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
        right: {
          page1: {},
          page2: {
            selections: [],
            noMakeCraftList: [],
            haveMakeCraftList: []
          },
          list: []
        },
        filter: {
          customer: [],
          customer: [],
          customer: []
        },
        handle: {
          update: {
            dialogVisible: false,
            isLoading: false,
            addFiles: [],
            form: {
              name: '',
              createBy: '',
              mouldNo: '',
              customerPoNo: '',
              componentOrders: [{}],
              attachments: [],
              remark: ''
            },
            rules: {
              name: [
                { required: true, message: '请输入客户名称'},
              ],
              mouldNo: [
                { required: true, message: '请输入模具号'},
              ],
              customerPoNo: [
                { required: true, message: '请输入客户PO号'},
              ]
            }
          },
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
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        let params = {
          parameter: '',
          type: this.filter.selectedValue,
          sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`,
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        }
        if(this.form.text) params.parameter = this.form.text;

        this.getData(this.$utils.CONFIG.api.queryPendingSaleOrder, params, 'mrSaleOrderId', loadingKey, this.getDetail);
      },
      getDetail(id) {

        let params = {
          mrSaleOrderId: id
        }

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPendingSaleOrderDetail, (res) => { //订单详情 

          this.right.page1 = res.data[0] || {};
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);

        this.getCraftList();
      },
      getCraftList() {  //取得待制定订单零件列表与已制定工艺卡列表

        let params = {
          mrSaleOrderId: this.left.activeId
        }

        this.$utils.getJson(this.$utils.CONFIG.api.queryNoMakeCraft, (res) => { //待制定订单零件列表

          this.right.page2.noMakeCraftList = res.data;
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);

        this.$utils.getJson(this.$utils.CONFIG.api.queryHaveMakeCraftComponent, (res) => { //已制定工艺卡列表

          this.right.page2.haveMakeCraftList = res.data;
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);
      },
      handleSelect(item, idKey = 'id') {
      
        this.left.activeId = item[idKey];
        this.currentData= item;
        this.getDetail(this.left.activeId);
      },
      showUpdateDialog() {

        this.handle.update.form = {
          name: '',
          createBy: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName),
          mouldNo: '',
          customerPoNo: '',
          componentOrders: [{}],
          attachments: [],
          remark: ''
        }
        this.handle.update.dialogVisible = true;
      },
      addAttachments() {

        let fileId = new Date().getTime();
        this.$refs.fileUpdate.files[0].fileId = fileId;
        this.handle.update.addFiles.push(this.$refs.fileUpdate.files[0]);
        this.handle.update.form.attachments.push({
          type: 'add',
          fileId: fileId,
          fileName: this.$refs.fileUpdate.files[0].name
        })
        this.$refs.fileUpdate.value = '';
      },
      deleteAttachments(file) {

        this.handle.update.form.attachments = this.handle.update.form.attachments.filter(item => item.fileId != file.fileId);

        if(file.type == 'add') {
          this.handle.update.addFiles = this.handle.update.addFiles.filter(item => item.fileId != file.fileId);
        }
      },
      saveUpdate() { //新增销售订单

        if(this.handle.update.addFiles.length) {

          this.uploadFile(this.handle.update);
        }else {

          this.uploadSuccess();
        }
      },
      uploadSuccess(res) {

        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            
            let params = this.handle.update.form;
            let componentOrders = [];
            params.componentOrders.map(item => {

              if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {

                componentOrders.push({
                  componentNo: item.componentNo,
                  quantity: parseInt(item.quantity) || 0,
                  customerNo: item.customerNo,
                  deliveryDate: item.deliveryDate,
                  description: item.description
                });
              }
            })
            if(!componentOrders || !componentOrders.length ) {

              this.$utils.showTip('warning', 'error', '-1084');
              return;
            }

            params.componentOrders = componentOrders;

            params.attachments = [];
            if(res && res.data && res.data.length) {

              res.data.map(item => params.attachments.push({
                fileId: item.fileId,
                fileName: item.fileName
              }))
            }

            this.handle.update.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.saveSaleInProduct, (res) =>  {

              this.handle.update.isLoading = false;
              this.handle.update.dialogVisible = false;
              this.$utils.showTip('success', 'success', '102');
              this.getLeftList();
            }, () => this.handle.update.isLoading = false, params)
          } else {
  
            return false;
          }
        });
      },
      getOrderDetail(item) {  //生产订单详情

        if(item.isCanIssued == 10) { //如果有未制定工艺的零件
          this.$utils.showTip('warning', 'error', '-1041');
          return;
        }else if(item.isCanIssued == 20) { //还存在零件未制定工艺
          this.$utils.showTip('warning', 'error', '-1042');
          return;
        }else if(item.isCanIssued == 30) {

          let params = {
            mrSaleOrderId: item.mrSaleOrderId
          }

          this.handle.add.order = item;
          this.handle.add.dialogVisible = true;
          this.handle.add.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.queryProductionOrderInfo, (res) => {

            this.handle.add.isLoading = false;
            this.handle.add.data = res.data;
          }, () => this.handle.add.isLoading = false, params);
        }
      },
      addOrder(saveAsDraft = false) {  //下达生产订单, saveAsDraft=false为下达生产订单;saveAsDraft=true为保存为草稿

        let params = {
          createBy: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName),
          mrSaleOrderId: this.handle.add.order.mrSaleOrderId,
          versions: []
        }

        this.handle.add.data.map(item => {  //取得选中的版本，如没选中则默认选中第一个

          let obj = {
            mrCraftRouteLineId: item.mrCraftRouteLineId
          }
          if(item.selectedVersionNo) {
            obj.versionNo = item.selectedVersionNo;
          }else {
            if(item.versions && item.versions.length) {
              obj.versionNo = item.versions[0].versionNo;
            }else {
              obj.versionNo = '';
            }
          }
          params.versions.push(obj);
        })
        
        let url = saveAsDraft ? this.$utils.CONFIG.api.saveAsDraft : this.$utils.CONFIG.api.releasedProductionOrder;
        this.handle.add.isLoading = true;
        this.$utils.getJson(url, (res) => {

          this.handle.add.isLoading = false;
          this.handle.add.dialogVisible = false;
          this.$utils.showTip('success', 'success', '102');
          !saveAsDraft && this.search();
        }, () => this.handle.add.isLoading = false, params);
      },
      handleSelectionChange(val) {

        this.right.page2.selections = val;
      },
      jump(type = 'add', row = {}) {
        
        if(type == 'add' && !this.right.page2.selections.length) {
          this.$utils.showTip('warning', 'error', '-1040');
          return;
        }
        let obj = {
          type: type,
          mrSaleOrderId: this.currentData.mrSaleOrderId,
          customerId: this.currentData.customerId,
          mouldNo: this.currentData.mouldNo,
          name: this.currentData.name,
          componentNos: '',
          requirementQuantitys: '',
          completionDate: this.currentData.completionDate,
          customerPoNo: this.currentData.customerPoNo,
          components: type == 'add' ? this.right.page2.selections : row,
          activeId: this.left.activeId
        };
        
        if(type == 'add') {
          this.right.page2.selections.map((item, index) => {

            obj.componentNos += item.componentNo;
            obj.requirementQuantitys += item.requirementQuantity;
            if(index != this.right.page2.selections.length - 1) {
              obj.componentNos+= '/';
              obj.requirementQuantitys += '/';
            }
          });
        }else {
          row.components && row.components.length && row.components.map((item, index) => {

            obj.componentNos += item.componentNo;
            obj.requirementQuantitys += item.quantity;
            if(index != row.components.length - 1) {
              obj.componentNos+= '/';
              obj.requirementQuantitys += '/';
            }
          });
        }
        let time = new Date().getTime();
        localStorage.setItem(time, JSON.stringify(obj));
        this.$router.push(`/product/processCard/${time}`);
      },
      deleteCraft(row) {  //删除工艺卡
        
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.deleteCraftInfoById, (res) => {  

          this.right.isLoading = false;
          this.getCraftList();
        }, () => this.right.isLoading = false, {mrCraftRouteLineId: row.mrCraftRouteLineId});
      },
      getDropDownList() { //客户、模具号、零件号下拉列表

        this.getList(this.$utils.CONFIG.api.customer, this.filter, 'customer', {otherWhereClause:'customerType !=20'}); //获取客户列表
        //this.getList(this.$utils.CONFIG.api.qwm, this.filter, 'qwm'); //获取模具与零件号联动列表
      },
      refresh() {}
    },
    created() {
      this.left.activeId = this.$route.params.id || '';
      this.filter.typeList = this.filter.listType.product;
      this.getLeftList();
      this.getDropDownList();
    }
  };
</script>


<style scoped lang="scss">
  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
  }
</style>