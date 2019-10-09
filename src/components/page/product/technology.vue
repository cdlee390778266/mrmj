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
              <el-button type="primary" style="width: 100%; margin-top: 10px;" @click="showUpdateDialog">手动增加生产订单</el-button>
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
        <el-form ref="updateForm" :model="handle.update.form" :rules="handle.update.rules" label-width="88px">
          <div class="dflex">
            <div class="flex">
              <el-form-item label="客户:" prop="a">
                <el-autocomplete
                  v-model="handle.update.form.a"
                  :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.aa, 'supplier')"
                  valueKey="supplier"
                  value="supplier"
                  placeholder="请输入客户"
                  style="width: 100%;"></el-autocomplete>
              </el-form-item>
              <el-form-item label="客户PO.号:">
                <el-input v-model="handle.update.form.b" auto-complete="off" aria-placeholder="请输入客户PO.号"></el-input>
              </el-form-item>
              <el-form-item label="模具号" prop="c">
                <el-input v-model="handle.update.form.c" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
              </el-form-item>
            </div>
          </div>
          <div>
            <p class="mgb5">零件清单：</p>
            <el-table
              :data="handle.update.form.d"
              max-height="160"
              border
              size="mini"
              style="width: 100%"
              class="edit-table">
              <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.d, scope.$index, 'aaEdit')">
                      <div class="eaaipsis">{{ scope.row.aa }}</div>
                      <el-input size="mini" v-model="scope.row.aa" @focus="showInput(handle.update.form.d, scope.$index, 'aaEdit', {}, false)" @blur="scope.row.aaEdit = false" :style="{opacity: scope.row.aaEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="数量" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.d, scope.$index, 'bbEdit')">
                      <div class="eaaipsis">{{ scope.row.bb }}</div>
                      <el-input size="mini" v-model="scope.row.bb" @focus="showInput(handle.update.form.d, scope.$index, 'bbEdit', {}, false)" @blur="scope.row.bbEdit = false" :style="{opacity: scope.row.bbEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.d, scope.$index, 'ccEdit')">
                      <div class="eaaipsis">{{ scope.row.cc }}</div>
                      <el-input size="mini" v-model="scope.row.cc" @focus="showInput(handle.update.form.d, scope.$index, 'ccEdit', {}, false)" @blur="scope.row.ccEdit = false" :style="{opacity: scope.row.ccEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="要求交期" min-width="100" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.d, scope.$index, 'ddEdit', {})">
                      <div class="ellipsis">{{ scope.row.dd }}</div>
                      <el-date-picker
                        type="date"
                        size="mini"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="scope.row.dd"
                        @focus="showInput(handle.update.form.d, scope.$index, 'ddEdit', {})"
                        @blur="scope.row.ddEdit = false"
                        :style="{opacity: scope.row.ddEdit ? 1 : 0}">
                      </el-date-picker>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="说明" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.d, scope.$index, 'eeEdit')">
                      <div class="eaaipsis">{{ scope.row.ee }}</div>
                      <el-input size="mini" v-model="scope.row.ee" @focus="showInput(handle.update.form.d, scope.$index, 'eeEdit', {}, false)" @blur="scope.row.eeEdit = false" :style="{opacity: scope.row.eeEdit ? 1 : 0}"/>
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
              :data="handle.update.form.e"
              max-height="160"
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column prop="fileName" label="资料名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="() => deleteAttachments(scope.row.id)">删除</el-button>
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
          aa: [
            {
              codeName: 'M2019-08-01',
              supplier: 'A公司'
            },
            {
              codeName: 'M2019-09-09',
              supplier: 'B公司'
            },
            {
              codeName: 'M2019-01-01',
              supplier: 'C公司'
            },
            {
              codeName: 'M2019-06-23',
              supplier: 'D公司'
            }
          ]
        },
        handle: {
          update: {
            dialogVisible: false,
            isLoading: false,
            form: {
              a: '',
              b: '',
              c: '',
              d: [{}],
              e: [],
              f: ''
            },
            rules: {
              a: [
                { required: true, message: '请输入客户名称'},
              ],
              c: [
                { required: true, message: '请输入模具号'},
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
          a: '',
          b: '',
          c: '',
          d: [{}],
          e: [],
          f: ''
        }
        this.handle.update.dialogVisible = true;
      },
      addAttachments() {

        let id = new Date().getTime();
        this.$set(this.handle.update.form, 'e', this.handle.update.form.e || []);
        this.handle.update.form.e.push({
          id: id,
          fileName: this.$refs.fileUpdate.files[0].name
        })
        this.$refs.fileUpdate.value = '';
      },
      deleteAttachments(id) {

        this.handle.update.form.e = this.handle.update.form.e.filter(item => item.id != id);
      },
      saveUpdate() {

        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            
            let params = {

            };
            
            this.handle.update.isLoading = true;
            this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

              this.handle.update.isLoading = false;
              this.handle.update.dialogVisible = false;
              this.$utils.showTip('success', 'success', '102');
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
      refresh() {}
    },
    created() {
      this.left.activeId = this.$route.params.id || '';
      this.filter.typeList = this.filter.listType.product;
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