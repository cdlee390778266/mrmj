<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：销售订单开展
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div>
            当前订单：
            <el-input v-model="form.text" style="width: 146px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            <el-dropdown ref="sort" :hide-on-click="false">
              <el-button type="primary" icon="el-icon-sort" class="mgl10" style="width: auto;"></el-button>
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
            <div class="mgt10">
              <el-button type="primary" @click="handle.add.dialogVisible = true" style="width: 100%;">新增订单</el-button>
            </div>
          </div>
        </div>
        <div class="list" style="top: 96px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex ellipsis">
                <p class="ellipsis">
                  <span>模具号：{{item.a | filterNull}}</span>
                  <span class="mgl20" :title="item.b | filterNull">订单类型：{{item.b | filterNull}}</span>
                </p>
                <p class="ellipsis" :title="item.c | filterNull">客户：{{item.c | filterNull}}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">交期：{{item.d | filterNull}}</el-col>
              <el-col :span="12" class="ellipsis" :title="item.e | filterNull">订单价格：{{item.e | filterNull}}</el-col>
              <el-col :span="12">状态：{{item.f | filterNull}}</el-col>
              <el-col :span="12">进度：<el-progress :percentage="50" color="rgba(0, 255, 0, 1)" style="width: 88px;display: inline-block;"></el-progress></el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click.stop="handle.update.dialogVisible = true">修改</a>
                <a href="javascript: void(0);">暂停</a>
                <a href="javascript: void(0);">终止</a>
                <a href="javascript: void(0);" @click.stop="handle.del.dialogVisible = true">删除</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true"><i class="el-icon-search"></i> {{ item.label }}</p>
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
            ref="carousel">
            <el-carousel-item>
              <div class="main-content-title">
                <div>
                  <i class="el-icon-lx-edit"></i> 订单{{right.page1.aa | filterNull}}信息
                </div>
              </div>
              <el-scrollbar class="main-content-scorll pdt10">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{right.page1.a | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{right.page1.b | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{right.page1.c | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{right.page1.d | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单状态：{{right.page1.e | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：{{right.page1.f | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">汇率：{{right.page1.g | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价(RMB)：{{right.page1.h | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前成本累计(RMB)：{{right.page1.i | filterNull}}</el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" class="mgt10">订单零件列表：</el-col>
                  <el-col :span="24">
                    <el-table
                      :data="right.page1.j"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <el-table-column prop="a" label="零件号" width="180"></el-table-column>
                      <el-table-column prop="b" label="客户编号" width="180"></el-table-column>
                      <el-table-column prop="c" label="数量" min-width="88"></el-table-column>
                      <el-table-column prop="d" label="单价"  min-width="88"></el-table-column>
                      <el-table-column prop="e" label="总价"  min-width="88"></el-table-column>
                      <el-table-column prop="f" label="下单日期"  min-width="88"></el-table-column>
                      <el-table-column prop="g" label="要求交期" min-width="88"></el-table-column>
                      <el-table-column prop="h" label="说明" min-width="88"></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <p class="mgt20">订单附件</p>
                    <el-table
                      :data="right.page1.k"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <el-table-column prop="fileName" label="附件名称"></el-table-column>
                      <el-table-column width="100" label="操作">
                        <template slot-scope="scope">
                          <a href="javascript:void(0);" style="color: #3375AB;" @click="down(scope.row.fileId)">下载</a>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="mgt20">需求说明：</el-col>
                  <el-col
                    :span="24"
                  >
                    {{right.page1.l | filterNull}}
                  </el-col>
                </el-row>
              </el-scrollbar>
            </el-carousel-item>
            <el-carousel-item>
              <el-scrollbar class="main-content-scorll pdt10">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{ currentData.mouldNo | filterNull }}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{ currentData.orderTypeText | filterNull }}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{ currentData.customerPoNo | filterNull }}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{ currentData.name | filterNull }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-button type="primary" @click="orderDetail">查看相关销售订单</el-button>
                  </el-col>
                </el-row>
                <div class="progress-list">
                  <div class="progress-item" v-for="(item, index) in currentData.trackMessages">
                    <div class="process-left">
                      <p class="ellipsis">
                        <span>零件：
                          <el-tooltip class="item" effect="dark" :content="item.components | concatString('componentNo')" placement="top">
                            <span>{{item.components | concatString('componentNo')}}</span>
                          </el-tooltip>
                        </span>
                      </p>
                      <p class="ellipsis">
                        <span>数量：
                          <el-tooltip class="item" effect="dark" :content="item.components | concatString('quantity')" placement="top">
                            <span>{{item.components | concatString('quantity')}}</span>
                          </el-tooltip>
                        </span>
                      </p>
                      <p class="ellipsis">
                        <span>备货数量：
                          <el-tooltip class="item" effect="dark" :content="item.components | concatString('stockingQuantity')" placement="top">
                            <span>{{item.components | concatString('stockingQuantity')}}</span>
                          </el-tooltip>
                        </span>
                      </p>
                      <p class="ellipsis"><span>生产订单下达时间：{{ currentData.issuedOrderDate | filterNull }}</span></p>
                      <p class="ellipsis"><span>计划时间：{{ currentData.planStartDate | filterNull }} 至 {{ currentData.planEndDate | filterNull }}</span></p>
                      <p class="ellipsis"><span>当前成本累计：{{ total(item) }}元</span></p>
                      <p>
                        <el-button type="text" @click="jump">编辑 查看 打印工艺卡</el-button>
                      </p>
                    </div>
                    <div class="process-right">
                      <!-- 不整体外协 -->
                      <table class="mrmj-table" v-if="!item.buy">  
                        <thead>
                          <tr>
                            <th class="tr">工序</th>
                            <th v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                              <span>{{itemc.processName}}</span>
                              <img :src="itemc.statusDescription == '已完成' ? progressImg1 : progressImg2" class="mgl5" v-if="index != item.processes.length - 1">
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="tr"><span class="bg-green fcfff">估工</span></td>
                            <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                              <span>{{itemc.estimationWorkTime}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="tr"><span class="bg-green fcfff">开始</span></td>
                            <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                              <span>{{itemc.startTimeString}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="tr"><span class="bg-green fcfff">结束</span></td>
                            <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                              <span>
                                {{itemc.endTimeString || (itemc.statusDescription == '进行中' && item.isOutsource ? '外协中' : itemc.statusDescription)}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="tr"><span class="bg-green fcfff">耗时</span></td>
                            <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                              <span>{{itemc.consumeTime}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="tr"><span class="bg-green fcfff">人工成本</span></td>
                            <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                              <span>{{itemc.consumeTime ? `${(itemc.consumeTime * itemc.processPrice).toFixed(2)}元` : ''}}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- 整体外协 -->
                      <table class="mrmj-table" v-else>  
                        <thead>
                          <tr>
                            <th class="tl">工序</th>
                            <th v-for="(itemc, index) in item.processes" :key="index">
                              <span>{{itemc.processName}}</span>
                              <img :src="progressImg2" class="mgl5" v-if="index != item.processes.length - 1">
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="tl" :colspan="item.processes.length"><span>{{item.buyText | filterNull}}</span></td>
                          </tr>
                          <tr>
                            <td class="tl ellipsis" width="130px" :colspan="item.processes.length">
                              <span>外协订单下达时间：{{item.issuedPurchaseOrderDate | filterNull}}</span>
                              <span class="mgl20">要求到货日期：{{item.requireArrivalDate | filterNull}}</span>
                              <span class="mgl20">实际到货日期：{{item.arrivalDate | filterNull}}</span>
                            </td>
                          </tr>
                          <tr>
                            <td class="tl" :colspan="item.processes.length"><span>外协价格(RMB)：{{item.outsourceTotalPrice | filterNull}}</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-carousel-item>
          </el-carousel>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="新增销售订单" :visible.sync="handle.add.dialogVisible" width="900px">
      <div class="dflex">
        <div style="width: 200px;" class="bor rel">
          <div style="display: inline-block; background: #fff; position: relative; top: -10px; left: 10px; z-index: 1">选择需求生成订单</div>
          <div class="order-table-wrapper">
            <el-table :data="handle.add.form.detailList" size="mini" class="order-table">
              <el-table-column prop="date" label="需求编号" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="name" label="客户名称" show-overflow-tooltip	></el-table-column>
              <el-table-column prop="address" label="需求类型" show-overflow-tooltip	></el-table-column>
              <el-table-column prop="address" label="要求交期" show-overflow-tooltip	></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="flex">
          <el-form :model="handle.add.form" label-width="100px" class="bor mgl10 pd10">
            <div style="display: inline-block; background: #fff; position: relative; top: -20px; left: 10px; z-index: 1">选择需求生成订单</div>
            <div class="dflex mgt20">
              <div class="flex">
                <el-form-item label="客户">
                  <el-input v-model="handle.add.form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="模具号">
                      <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="订单类型">
                      <el-select v-model="handle.add.form.type">
                        <el-option label="模具零件" value="0"></el-option>
                        <el-option label="整体模具" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                class="v-upload pdl10"
                :multiple="false"
                :limit="1"
                :on-preview="handlePictureCardPreview"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <div>
              <p>零件清单：</p>
              <el-table :data="handle.add.form.detailList" height="160" border size="mini" style="width: 100%">
                <el-table-column prop="date" label="零件号" width="100"></el-table-column>
                <el-table-column prop="name" label="数量" width="88"></el-table-column>
                <el-table-column prop="address" label="要求交期"></el-table-column>
                <el-table-column prop="address" label="单价"></el-table-column>
                <el-table-column prop="address" label="总价"></el-table-column>
                <el-table-column prop="address" label="说明"></el-table-column>
              </el-table>
            </div>
            <el-row class="mgt20">
              <el-col :span="8" style="line-height: 33px;">
                订单总价（RMB）：231323.00
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算货币">
                  <el-select v-model="handle.add.form.type" style="width: 80px;">
                    <el-option label="欧元" value="0"></el-option>
                    <el-option label="美元" value="1"></el-option>
                    <el-option label="日元" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算货币总价">
                  <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入结算货币总价" style="width: 80px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div>
              <p class="mgb10">
                上传附件：
                <el-button type="primary" size="mini">选择上传文件</el-button>
              </p>
              <el-table
                :data="handle.add.form.enclosureList"
                height="160"
                border
                size="mini"
                style="width: 100%"
              >
                <el-table-column prop="date" label="上传文件"></el-table-column>
                <el-table-column prop="name" label="资料名称"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form-item label="需求编号" class="mgt20">
              <el-input type="textarea" v-model="handle.add.form.dsc"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.add.dialogVisible = false">下单订单</el-button>
        <el-button type="primary" @click="handle.add.dialogVisible = false">存为草稿</el-button>
        <el-button @click="handle.add.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除确认框" :visible.sync="handle.del.dialogVisible">
      <el-form :model="handle.del.form" label-width="100px">
        您确定删除此订单？
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.del.dialogVisible = false">确 定</el-button>
        <el-button @click="handle.del.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改模具零件订单" :visible.sync="handle.update.dialogVisible" width="700px">
      <el-form :model="handle.update.form" label-width="100px">
        <div class="dflex mgt20">
          <div class="flex">
            <el-form-item label="客户">
              <el-input v-model="handle.add.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="模具号">
                  <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            class="v-upload pdl10"
            :multiple="false"
            :limit="1"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div>
          <p>零件清单：</p>
          <el-table :data="handle.add.form.detailList" height="160" border size="mini" style="width: 100%">
            <el-table-column prop="date" label="零件号" width="100"></el-table-column>
            <el-table-column prop="name" label="数量" width="88"></el-table-column>
            <el-table-column prop="address" label="要求交期"></el-table-column>
            <el-table-column prop="address" label="单价"></el-table-column>
            <el-table-column prop="address" label="总价"></el-table-column>
            <el-table-column prop="address" label="说明"></el-table-column>
          </el-table>
        </div>
        <el-row class="mgt20">
          <el-col :span="8" style="line-height: 33px;">
            订单总价（RMB）：231323.00
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算货币">
              <el-select v-model="handle.add.form.type" style="width: 80px;">
                <el-option label="欧元" value="0"></el-option>
                <el-option label="美元" value="1"></el-option>
                <el-option label="日元" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算货币总价">
              <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入结算货币总价" style="width: 80px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <p class="mgb10">
            上传附件：
            <el-button type="primary" size="mini">选择上传文件</el-button>
          </p>
          <el-table
            :data="handle.add.form.enclosureList"
            height="160"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="date" label="上传文件"></el-table-column>
            <el-table-column prop="name" label="资料名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="需求编号" class="mgt20">
          <el-input type="textarea" v-model="handle.add.form.dsc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.update.dialogVisible = false">下达订单</el-button>
        <el-button type="primary" @click="handle.update.dialogVisible = false">存为草稿</el-button>
        <el-button @click="handle.update.dialogVisible = false">取 消</el-button>
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
        name: localStorage.getItem("ms_username"),
        handle: {
          add: {
            dialogVisible: false,
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: "",
              detailList: [
                {
                  date: "2016-05-03",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-02",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-04",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                }
              ],
              enclosureList: [
                {
                  date: "2016-05-03",
                  name: "王小虎"
                },
                {
                  date: "2016-05-02",
                  name: "王小虎"
                },
                {
                  date: "2016-05-04",
                  name: "王小虎"
                },
                {
                  date: "2016-05-01",
                  name: "王小虎"
                }
              ]
            }
          },
          del: {
            dialogVisible: false,
            form: {
              reason: "",
              dsc: ""
            }
          },
          update: {
            dialogVisible: false,
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              btype: "0",
              total: 1256,
              dsc: "",
              detailList: [
                {
                  date: "2016-05-03",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-02",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-04",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                }
              ],
              enclosureList: [
                {
                  date: "2016-05-03",
                  name: "王小虎"
                },
                {
                  date: "2016-05-02",
                  name: "王小虎"
                },
                {
                  date: "2016-05-04",
                  name: "王小虎"
                },
                {
                  date: "2016-05-01",
                  name: "王小虎"
                }
              ]
            },
          }
        }
      };
    },
    methods: {
      getLeftList() {

        let params = {

        };
        let mock = [
          {
            id: '125944',
            a: 'M-1901',
            b: '模具零件',
            c: '测试测试测试测试公司',
            d: '2019.03.31',
            e: '12500.00元',
            f: '草稿'
          },
          {
            id: '125945',
            a: 'M-1902',
            b: '模具零件',
            c: '测试测试测试测试公司',
            d: '2019.03.31',
            e: '12500.00元',
            f: '生产中'
          },
        ]

        this.left.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.list = res.data || [];
          if(this.left.list.length) {

            this.currentData = this.left.list[0];
            this.left.activeId = this.left.list[0].id;
            this.getDetail();
          }
        }, () => this.left.isLoading = false, params, mock)
      },
      getDetail() {

        let params = {

        };

        let mock = {
          a: 'A公司',
          b: '12334567',
          cc: 'M-1901',
          c: '模具零件',
          d: '生产中',
          e: '12301.00',
          f: '欧元',
          g: '7.0',
          h: '12301.00',
          i: '9301.00',
          j: [
            {
              a: '172988',
              b: '',
              c: '3',
              d: '',
              e: '2019.03.1',
              f: '2019.03.08',
              g: ''
            },
            {
              a: '832071',
              b: '',
              c: '3',
              d: '',
              e: '2019.03.1',
              f: '2019.03.08',
              g: ''
            }
          ],
          k: [
            {
              fileName: '172988图纸',
              fileId: 'crQhc2flTyetPwbJ'
            }
          ],
          l: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc ege'
        }

        let mock1 = {
          a: 'M-1901',
          b: '模具零件',
          c: '12301.00',
          d: '欧元',
          e: '12301.00',
          components: [
            {
              a: '172988',
              b: '1',
              c: '3',
              d: '2019.03.15',
              e: '2019.04.15',
              f: '2019.04.15',
              g: '',
            },
            {
              a: '172986',
              b: '1',
              c: '3',
              d: '2019.03.15',
              e: '2019.04.15',
              f: '2019.04.15',
              g: '',
            }
          ],
          g: [
            {
              fileName: '172988图纸',
              fileId: 'crQhc2flTyetPwbJ'
            }
          ],
          h: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.'
        }

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page1 = res.data || {};
        }, () => this.right.isLoading = false, params, mock)

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page2 = res.data || {};
        }, () => this.right.isLoading = false, params, mock1)
      },
      handlePictureCardPreview(file) {
        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
      },
      handleSelect(item) {

        this.left.activeId = item.id;
        this.currentData = item;
        this.getDetail();
      },
      del(index, row) {
        console.log(index, row);
      },
      refresh() {}
    },
    created() {

      this.getLeftList();
    }
  };
</script>


<style scoped lang="scss">
  .main-left-search {
  
  }
</style>