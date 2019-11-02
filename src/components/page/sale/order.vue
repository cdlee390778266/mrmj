<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：销售订单开展
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="isLoading">
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
              <el-button type="primary" @click="getAddLeftList" style="width: 100%;">新增订单</el-button>
            </div>
          </div>
        </div>
        <div class="list" style="top: 96px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrSaleOrderId }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex ellipsis">
                <p class="ellipsis">
                  <span>模具号：{{item.mouldNo | filterNull}}</span>
                  <span class="mgl20" :title="item.saleOrderTypeText | filterNull">订单类型：{{item.saleOrderTypeText | filterNull}}</span>
                </p>
                <p class="ellipsis" :title="item.c | filterNull">客户：{{item.name | filterNull}}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">交期：{{item.completionDateString | filterNull}}</el-col>
              <el-col :span="12" class="ellipsis" :title="item.settlementCurrencyTotalPrice | filterNull">订单价格：{{item.settlementCurrencyTotalPrice | filterNull}}</el-col>
              <el-col :span="12" class="ellipsis" :title="item.saleOrderStatusText | filterNull">状态：{{item.saleOrderStatusText | filterNull}}</el-col>
              <el-col :span="12">
                进度：
                <el-progress :percentage="item | cpercentage('haveCompletionTotalTime', 'estimateTotalTime')" color="rgba(0, 255, 0, 1)" style="width: 85px;display: inline-block;"></el-progress>
              </el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click.stop="showUpdateDialog(item)">修改</a>
                <a href="javascript: void(0);" @click.stop="resetSaleOrder(item)" v-if="item.saleOrderStatus == 14">恢复</a>
                <a href="javascript: void(0);" @click.stop="suspend(item)" v-else>暂停</a>
                <a href="javascript: void(0);" @click.stop="deleteOrder(item)" v-if="item.saleOrderStatus == 10 || item.saleOrderStatus == 12">删除</a>
                <a href="javascript: void(0);" @click.stop="termination(item)" v-else>终止</a>
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
                  <i class="el-icon-lx-edit"></i> 订单{{currentData.number}}信息
                </div>
              </div>
              <el-scrollbar class="main-content-scorll pdt10">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{currentData.name | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{currentData.customerPoNo | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{currentData.mouldNo | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{currentData.saleOrderTypeText | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单状态：{{currentData.saleOrderStatusText | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：{{currentData.settlementCurrencyTotalPrice | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">汇率：{{currentData.settlementExchangeRate | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价(RMB)：{{currentData.saleTotal | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前成本累计(RMB)：{{currentData.i | filterNull}}</el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">下单日期：{{currentData.releaseOrderDateString | filterNull}}</el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" class="mgt10">订单零件列表：</el-col>
                  <el-col :span="24">
                    <el-table
                      :data="currentData.componentOrders"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%"
                    >
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <el-table-column prop="componentNo" label="零件号" width="180"></el-table-column>
                      <el-table-column prop="customerNo" label="客户编号" width="180"></el-table-column>
                      <el-table-column prop="quantity" label="数量" min-width="88"></el-table-column>
                      <el-table-column prop="componentPrice" label="单价"  min-width="88"></el-table-column>
                      <el-table-column prop="componentTotal" label="总价"  min-width="88"></el-table-column>
                      <el-table-column prop="deliveryDateString" label="要求交期" min-width="88"></el-table-column>
                      <el-table-column prop="description" label="说明" min-width="88"></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <p class="mgt20">订单附件</p>
                    <el-table
                      :data="currentData.attachments"
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
                    {{currentData.remark | filterNull}}
                  </el-col>
                </el-row>
              </el-scrollbar>
            </el-carousel-item>
            <el-carousel-item>
              <div class="main-content-title">
                <div>
                  <i class="el-icon-lx-edit"></i> 零件生产过程
                </div>
              </div>
              <el-scrollbar class="main-content-scorll">
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
                      <p class="ellipsis">
                          <span>
                            生产订单下达时间：
                            <el-tooltip class="item" effect="dark" :content="item.issuedOrderDate | filterNull" placement="top">
                              <span>{{item.issuedOrderDate | filterNull}}</span>
                            </el-tooltip>
                        </span>
                      </p>
                      <p class="ellipsis">
                        <span>计划时间：
                          <el-tooltip class="item" effect="dark" :content="item.planStartDate + '至' + item.planEndDate" placement="top">
                            <span>{{item.planStartDate }} 至 {{ item.planEndDate }}</span>
                          </el-tooltip>
                        </span>
                      </p>
                      <p class="ellipsis"><span>当前成本累计：{{ total(item) }}元</span></p>
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
                          <!-- <tr>
                            <td class="tr"><span class="bg-green fcfff">结束</span></td>
                            <td class="tc" v-for="(itemc, index) in item.processes" :key="index" :class="{'fc-green': itemc.statusDescription == '已完成'}">
                              <span>
                                {{itemc.endTimeString || (itemc.statusDescription == '进行中' && item.isOutsource ? '外协中' : itemc.statusDescription)}}</span>
                            </td>
                          </tr> -->
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

    <el-dialog title="新增销售订单" :visible.sync="handle.add.dialogVisible" width="1020px">
      <div v-loading="handle.add.isLoading">
        <div class="dflex" >
          <div style="width: 200px;" class="bor rel">
            <div style="display: inline-block; background: #fff; position: relative; top: -10px; left: 10px; z-index: 1">选择需求生成订单</div>
            <div class="order-table-wrapper">
              <el-table
                ref="order"
                :data="handle.add.left.list"
                size="mini"
                class="order-table"
                :row-class-name="rowClass"
                @row-click="rowClick">
                <el-table-column prop="requirementNum" label="需求编号" width="100" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="客户名称" align="center" show-overflow-tooltip	></el-table-column>
                <el-table-column prop="requirementTypeText" label="需求类型" align="center" show-overflow-tooltip	></el-table-column>
                <el-table-column prop="requireDeliveryDateString" label="要求交期" align="center" show-overflow-tooltip	></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="flex" v-loading="handle.add.right.isLoading">
            <el-form ref="orderForm" :model="handle.add.right.form" :rules="handle.add.right.rules" label-width="110px" class="bor mgl10 pd10" style="min-height: 300px">
              <div v-show="handle.add.left.list.length">
              <div style="display: inline-block; background: #fff; position: relative; top: -20px; left: 10px; z-index: 1">录入订单信息</div>
                <div class="dflex">
                  <div class="flex pdr10">
                    <el-form-item prop="name" label="客户">
                      <el-input v-model="handle.add.right.form.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="customerPoNo" label="客户PO.号">
                      <el-input v-model="handle.add.right.form.customerPoNo" auto-complete="off"></el-input>
                    </el-form-item>
                     <el-row>
                      <el-col :span="12">
                        <el-form-item prop="mouldNo" label="模具号">
                          <el-autocomplete
                            class="inline-input"
                            v-model="handle.add.right.form.mouldNo"
                            :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, $dict.mouldNoList, 'mouldNo')"
                            valueKey="mouldNo"
                            value="mouldNo"
                            placeholder="请输入模具号"></el-autocomplete>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="
                    requirementTypeText" label="订单类型">
                          <el-select v-model="handle.add.right.form.requirementTypeText">
                            <el-option label="模具零件" value="模具零件"></el-option>
                            <el-option label="整体模具" value="整体模具"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item  prop="deliveryDate" label="要求交期" v-show="handle.add.right.form.requirementTypeText == '整体模具'">
                      <el-date-picker
                        type="date"
                        size="mini"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        :editable="false"
                        v-model="handle.add.right.form.deliveryDate">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                  <el-upload
                    class="avatar-uploader"
                    name="files"
                    :action="$utils.CONFIG.api.uploadFiles"
                    :show-file-list="false"
                    :on-success="handleAvatarOrderSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="handle.add.right.form.userFace" :src="handle.add.right.form.userFace" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div class="mgb20" v-show="handle.add.right.form.requirementTypeText == '模具零件'">
                  <p>零件清单：</p>
                  <el-table :data="handle.add.right.form.componentOrders" max-height="160" border size="mini" class="edit-table" style="width: 100%">
                    <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
                      <template scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.componentOrders, scope.$index, 'componentNoEdit', {})">
                            <div class="ellipsis">{{ scope.row.componentNo }}</div>
                            <el-input size="mini" v-model="scope.row.componentNo" @focus="showInput(handle.add.right.form.componentOrders, scope.$index, 'componentNoEdit', {}, false)" @blur="scope.row.componentNoEdit = false" :style="{opacity: scope.row.componentNoEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" min-width="88" show-overflow-tooltip align="center">
                      <template scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.componentOrders, scope.$index, 'quantityEdit', {})">
                            <div class="ellipsis">{{ scope.row.quantity }}</div>
                            <el-input size="mini" v-model="scope.row.quantity" @focus="showInput(handle.add.right.form.componentOrders, scope.$index, 'quantityEdit', {}, false)" @blur="scope.row.quantityEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.quantityEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
                      <template scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.componentOrders, scope.$index, 'customerNoEdit', {})">
                            <div class="ellipsis">{{ scope.row.customerNo }}</div>
                            <el-input size="mini" v-model="scope.row.customerNo" @focus="showInput(handle.add.right.form.componentOrders, scope.$index, 'customerNoEdit', {}, false)" @blur="scope.row.customerNoEdit = false" :style="{opacity: scope.row.customerNoEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" label="要求交期" show-overflow-tooltip align="center" width="100">
                      <template scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.componentOrders, scope.$index, 'deliveryDateEdit', {})">
                            <div class="ellipsis tc">{{ scope.row.deliveryDate }}</div>
                            <el-date-picker
                              type="date"
                              size="mini"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              v-model="scope.row.deliveryDate"
                              @focus="showInput(handle.add.right.form.componentOrders, scope.$index, 'deliveryDateEdit', {})"
                              @blur="scope.row.deliveryDateEdit = false"
                              :style="{opacity: scope.row.deliveryDateEdit ? 1 : 0}">
                            </el-date-picker>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="单价" align="center" min-width="88" show-overflow-tooltip>
                      <template scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.componentOrders, scope.$index, 'componentPriceEdit', {})">
                            <div class="ellipsis">{{ scope.row.componentPrice }}</div>
                            <el-input size="mini" v-model="scope.row.componentPrice" @focus="showInput(handle.add.right.form.componentOrders, scope.$index, 'componentPriceEdit', {}, false)" @blur="scope.row.componentPriceEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.componentPriceEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="componentTotal" label="总价" min-width="88" align="center" class="notEdit" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="address" label="说明" show-overflow-tooltip>
                      <template scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.componentOrders, scope.$index, 'descriptionEdit', {})">
                            <div class="ellipsis">{{ scope.row.description }}</div>
                            <el-input size="mini" v-model="scope.row.description" @focus="showInput(handle.add.right.form.componentOrders, scope.$index, 'descriptionEdit', {}, false)" @blur="scope.row.descriptionEdit = false" :style="{opacity: scope.row.descriptionEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div>
                  <div class="mgb10 dflex el-form-item-mgb0" style="line-height: 32px;">
                    {{saleTotalPrice()}}
                    <div class="flex">订单总价(RMB)：{{handle.add.right.form.saleTotalPrice}}</div>
                    <div class="flex">
                      <el-form-item prop="currency" label="常用货币">
                        <el-select size="mini" v-model="handle.add.right.form.currency" value-key="name"  @change="(currency) => handle.add.right.form.settlementExchangeRate = ''">
                          <el-option v-for="(item, index) in $dict.currencyList" :key="item.name" :label="item.name" :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="flex">
                      <el-form-item prop="settlementExchangeRate" label="汇率">
                        <el-select size="mini" v-model="handle.add.right.form.settlementExchangeRate">
                          <template v-if="handle.add.right.form.currency">
                            <el-option v-for="(item, index) in handle.add.right.form.currency.currencyRates" :key="index" :label="item.value" :value="item.value"></el-option>
                          </template>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="flex">
                      <el-form-item prop="settlementCurrencyTotalPrice" label="结算货币总价:">
                        <el-input size="mini" v-model="handle.add.right.form.settlementCurrencyTotalPrice" auto-complete="off"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <p class="mgb10">
                    上传附件：
                    <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                      <el-button size="mini" type="primary">选择上传文件</el-button>
                      <input type="file" name="file" ref="fileOrder" class="posFull opacity0" @change="() => addAttachments($refs.fileOrder, handle.add.right)">
                    </span>
                  </p>
                  <el-table
                    :data="handle.add.right.form.attachments"
                    height="160"
                    border
                    size="mini"
                    style="width: 100%"
                  >
                    <el-table-column prop="fileName" label="资料名称"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="deleteAttachments(scope.row, handle.add.right)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <el-form-item label="说明" class="mgt20">
                  <el-input type="textarea" v-model="handle.add.right.form.remark"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer mgt20 tr" v-show="handle.add.left.list.length">
          <el-button type="primary" @click="handle.add.right.judgeType = 1; saveFileAndData(handle.add.right, saveOrder)">下达订单</el-button>
          <el-button type="primary" @click="handle.add.right.judgeType = 2; saveFileAndData(handle.add.right, saveOrder)">存为草稿</el-button>
          <el-button @click="handle.add.dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="删除确认框" :visible.sync="handle.del.dialogVisible">
      <div v-loading="handle.del.isLoading">
        <el-form :model="handle.del.form" label-width="100px">
          您确定删除此订单？
        </el-form>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button type="primary" @click="deleteOrder">确 定</el-button>
          <el-button @click="handle.del.dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="修改模具零件订单" :visible.sync="handle.update.dialogVisible" width="800px">
      <div v-loading="handle.update.isLoading">
        <el-form ref="editForm" :model="handle.update.form" :rules="handle.update.rules" label-width="110px" class=" mgl10 pd10">
          <div class="dflex">
            <div class="flex pdr10">
              <el-form-item prop="name" label="客户">
                <el-input v-model="handle.update.form.name" auto-complete="off" disabled></el-input>
              </el-form-item>
              <el-form-item prop="customerPoNo" label="客户PO.号">
                <el-input v-model="handle.update.form.customerPoNo" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item prop="mouldNo" label="模具号">
                <el-autocomplete
                  style="width: 100%;"
                  class="inline-input"
                  v-model="handle.update.form.mouldNo"
                  :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, $dict.mouldNoList, 'mouldNo')"
                  valueKey="mouldNo"
                  value="mouldNo"
                  placeholder="请输入模具号"></el-autocomplete>
              </el-form-item>
              <!-- <el-form-item  prop="deliveryDate" label="要求交期" v-show="handle.update.form.requirementTypeText == '整体模具'">
                <el-date-picker
                  type="date"
                  size="mini"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :editable="false"
                  v-model="handle.update.form.deliveryDate">
                </el-date-picker>
              </el-form-item> -->
            </div>
            <el-upload
              class="avatar-uploader"
              name="files"
              action=""
              disabled>
              <img v-if="handle.update.form.userFace" :src="handle.update.form.userFace" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="mgb20" v-show="handle.update.form.requirementTypeText == '模具零件'">
            <p>零件清单：</p>
            <el-table :data="handle.update.form.componentOrders" max-height="160" border size="mini" class="edit-table" style="width: 100%">
              <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'componentNoEdit', {})">
                      <div class="ellipsis">{{ scope.row.componentNo }}</div>
                      <el-input size="mini" v-model="scope.row.componentNo" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'componentNoEdit', {}, false)" @blur="scope.row.componentNoEdit = false" :style="{opacity: scope.row.componentNoEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="数量" min-width="88" show-overflow-tooltip align="center">
                <template scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'quantityEdit', {})">
                      <div class="ellipsis">{{ scope.row.quantity }}</div>
                      <el-input size="mini" v-model="scope.row.quantity" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'quantityEdit', {}, false)" @blur="scope.row.quantityEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.quantityEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'customerNoEdit', {})">
                      <div class="ellipsis">{{ scope.row.customerNo }}</div>
                      <el-input size="mini" v-model="scope.row.customerNo" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'customerNoEdit', {}, false)" @blur="scope.row.customerNoEdit = false" :style="{opacity: scope.row.customerNoEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="要求交期" show-overflow-tooltip align="center" width="100">
                <template scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'deliveryDateEdit', {})">
                      <div class="ellipsis tc">{{ scope.row.deliveryDate }}</div>
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
              <el-table-column label="单价" align="center" min-width="88" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'componentPriceEdit', {})">
                      <div class="ellipsis">{{ scope.row.componentPrice }}</div>
                      <el-input size="mini" v-model="scope.row.componentPrice" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'componentPriceEdit', {}, false)" @blur="scope.row.componentPriceEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.componentPriceEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="componentTotal" label="总价" min-width="88" align="center" class="notEdit" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="address" label="说明" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.componentOrders, scope.$index, 'descriptionEdit', {})">
                      <div class="ellipsis">{{ scope.row.description }}</div>
                      <el-input size="mini" v-model="scope.row.description" @focus="showInput(handle.update.form.componentOrders, scope.$index, 'descriptionEdit', {}, false)" @blur="scope.row.descriptionEdit = false" :style="{opacity: scope.row.descriptionEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div class="mgb10 dflex el-form-item-mgb0" style="line-height: 32px;">
              {{saleTotalPrice(handle.update)}}
              <div class="flex">订单总价(RMB)：{{handle.update.form.saleTotalPrice}}</div>
              <div class="flex">
                <el-form-item prop="currency" label="常用货币">
                  <el-select size="mini" v-model="handle.update.form.currency" value-key="name"  @change="(currency) => handle.update.form.settlementExchangeRate = ''">
                    <el-option v-for="(item, index) in $dict.currencyList" :key="item.name" :label="item.name" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex">
                <el-form-item prop="settlementExchangeRate" label="汇率">
                  <el-select size="mini" v-model="handle.update.form.settlementExchangeRate">
                    <template v-if="handle.update.form.currency">
                      <el-option v-for="(item, index) in handle.update.form.currency.currencyRates" :key="index" :label="item.value" :value="item.value"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex">
                <el-form-item prop="settlementCurrencyTotalPrice" label="结算货币总价:">
                  <el-input size="mini" v-model="handle.update.form.settlementCurrencyTotalPrice" auto-complete="off"></el-input>
                </el-form-item>
              </div>
            </div>
            <p class="mgb10">
              上传附件：
              <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                <el-button size="mini" type="primary">选择上传文件</el-button>
                <input type="file" name="file" ref="editFile" class="posFull opacity0" @change="() => addAttachments($refs.editFile, handle.update)">
              </span>
            </p>
            <el-table
              :data="handle.update.form.attachments"
              height="160"
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column prop="fileName" label="资料名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="deleteAttachments(scope.row, handle.update)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item label="说明" class="mgt20">
            <el-input type="textarea" v-model="handle.update.form.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button type="primary" @click="saveFileAndData(handle.update, saveUpdate)">保存</el-button>
            <el-button @click="handle.add.dialogVisible = false">取 消</el-button>
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
        progressImg1: require('../../../assets/img/progress-1.png'),
        progressImg2: require('../../../assets/img/progress-2.png'),
        isLoading: false,
        handle: {
          add: {
            dialogVisible: false,
            isLoading: false,
            currentData: {},
            left: {
              activeId: '',
              list: []
            },
            right: {
              dialogVisible: false,
              isLoading: false,
              judgeType: 1,
              item: {},
              attachments: [],
              addFiles: [],
              form: {
                currency: {},
                userFace: '',
                fileId: "",
                name: '', 
                mouldNo: '', 
                customerPoNo: '',
                saleOrderTypeText: '',
                settlementCurrency: '',
                settlementExchangeRate: '',
                settlementCurrencyTotalPrice: '',
                saleTotalPrice: '',
                components: [],
                attachments: [],
                remark: ''
              },
              rules: {
                name: [
                  { required: true, message: this.$utils.getTipText('error', '-1010')},
                ],
                customerPoNo: [
                  { required: true, message: this.$utils.getTipText('error', '-1086')},
                ],
                mouldNo: [
                  { required: true, message: this.$utils.getTipText('error', '-1090')},
                ],
                settlementExchangeRate: [
                  { required: true, message: this.$utils.getTipText('error', '-1092')},
                ],
                settlementCurrencyTotalPrice: [
                  { required: true, message: this.$utils.getTipText('error', '-1093')},
                ],
              }
            },
          },
          del: {
            dialogVisible: false,
            isLoading: false,
            form: {
              reason: "",
              dsc: ""
            }
          },
          update: {
            dialogVisible: false,
            isLoading: false,
            judgeType: 1,
            item: {},
            attachments: [],
            addFiles: [],
            form: {
              currency: {},
              userFace: '',
              fileId: "",
              name: '', 
              mouldNo: '', 
              customerPoNo: '',
              saleOrderTypeText: '',
              settlementCurrency: '',
              settlementExchangeRate: '',
              settlementCurrencyTotalPrice: '',
              saleTotalPrice: '',
              components: [],
              attachments: [],
              remark: ''
            },
            rules: {
              name: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
              ],
              customerPoNo: [
                { required: true, message: this.$utils.getTipText('error', '-1086')},
              ],
              mouldNo: [
                { required: true, message: this.$utils.getTipText('error', '-1090')},
              ],
              settlementExchangeRate: [
                { required: true, message: this.$utils.getTipText('error', '-1092')},
              ],
              settlementCurrencyTotalPrice: [
                { required: true, message: this.$utils.getTipText('error', '-1093')},
              ],
            }
          }
        }
      };
    },
    methods: {
      getLeftList() {

        let params = {
          type: this.filter.selectedValue,
          sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`
        };
      
        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.querySaleOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.list = res.data || [];
          if(this.left.list.length) {

            this.currentData = this.left.list[0];
            this.left.activeId = this.left.list[0].mrSaleOrderId;
          }
        }, () => this.left.isLoading = false, params)
      },
      getAddLeftList() {

        this.handle.add.dialogVisible = true;

        if(this.handle.add.left.list.length) return;

        let params = {
          parameter: '',
          type: '',
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        };
        
        this.handle.add.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryRequirement, (res) =>  {

          this.handle.add.isLoading = false;
          this.handle.add.left.list = res.data && res.data.content ? res.data.content : [];

          if(this.handle.add.left.list.length) {

            this.handle.add.currentData = this.handle.add.left.list[0];
            this.handle.add.left.activeId = this.handle.add.left.list[0].mrRequirementId;
            this.getOrderDetail(this.handle.add.left.list[0])
          }
        }, () => this.handle.add.isLoading = false, params)
      },
      handleAvatarOrderSuccess(res, file) { //上传头像

        this.handle.add.right.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.add.right.form.fileId = res.data[0].fileId;
      },
      rowClass(obj) {

        let rowClass = obj.row.mrRequirementId == this.handle.add.left.activeId ? 'active' : '';
        return rowClass;
      },
      rowClick(row) {

        this.handle.add.left.activeId = row.mrRequirementId;
        this.handle.add.currentData = row;
        this.getOrderDetail(row);
      },
      saveOrder(res) { //下单

        this.$refs.orderForm.validate((valid) => {
          if (valid) {

            let params = {
              mrSaleOrderId: this.handle.add.right.form.mrSaleOrderId || '',
              mrRequirementId: this.handle.add.right.form.mrRequirementId || this.handle.add.right.item.mrRequirementId,
              judgeType: this.handle.add.right.judgeType,
              name: this.handle.add.right.form.name, 
              createBy: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName),
              fileId: this.handle.add.right.form.fileId,
              mouldNo: this.handle.add.right.form.mouldNo, 
              customerPoNo: this.handle.add.right.form.customerPoNo,
              saleOrderTypeText: this.handle.add.right.form.requirementTypeText,
              settlementCurrency: this.handle.add.right.form.currency.name,
              settlementExchangeRate: this.handle.add.right.form.settlementExchangeRate,
              settlementCurrencyTotalPrice: parseFloat(this.handle.add.right.form.settlementCurrencyTotalPrice) || 0,
              saleTotalPrice: this.handle.add.right.form.saleTotalPrice,
              componentOrders: [],
              attachments: [],
              remark: this.handle.add.right.form.remark
            };
            
            let componentOrders = [];
            this.handle.add.right.form.componentOrders && this.handle.add.right.form.componentOrders.map(item => {

              if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {
                componentOrders.push({
                  componentNo: item.componentNo,
                  quantity: parseInt(item.quantity) || 0,
                  customerNo: item.customerNo,
                  deliveryDate: item.deliveryDate,
                  componentPrice: parseInt(item.componentPrice) || 0,
                  componentTotal: item.componentTotal,
                  description: item.description
                })
              }
            })

            if(!componentOrders || !componentOrders.length ) {

              this.handle.add.right.isLoading = false;
              this.$utils.showTip('warning', 'error', '-1084');
              return;
            }

            params.componentOrders = componentOrders;

            params.attachments = [];
            if(res && res.data && res.data.length) { //附件

              res.data.map(item => params.attachments.push({
                fileId: item.fileId,
                fileName: item.fileName
              }))
            }
            this.handle.add.right.form.attachments &&  this.handle.add.right.form.attachments.map(item => {

              if(item.type != 'add') {
                params.attachments.push({
                  fileId: item.fileId,
                  fileName: item.fileName
                })
              }
            })

            this.handle.add.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.saveSaleOrder, (res) =>  {

              this.handle.add.right.isLoading = false;
              this.handle.add.isLoading = false;
              this.handle.add.dialogVisible = false;
              this.$utils.showTip('success', 'success', '117');
              (params.judgeType == 1) && (this.handle.add.left.list = []);
            }, () => {
              this.handle.add.right.isLoading = false;
              this.handle.add.isLoading = false;
            }, params)
          }else {

            this.handle.add.right.isLoading = false;
          }
        })
      },
      getOrderDetail(item) { //订单详情

        let params = {
          mrRequirementId: item.mrRequirementId
        };

        this.handle.add.right.item = item;
        this.handle.add.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.querySaleOrderInModify, (res) =>  {

          this.handle.add.right.isLoading = false;
          let obj  = res.data || {};
          obj.componentOrders = obj.componentOrders || [{}];
          obj.settlementExchangeRate = obj.settlementExchangeRate || '';
          obj.attachments = obj.attachments || [];
          obj.requirementTypeText = obj.saleOrderTypeText || '模具零件';
          if(obj.fileId) {

            obj.userFace = `${this.$utils.CONFIG.api.image}?fileId=${obj.fileId}`;
          }else {

            obj.userFace = '';
          }
          if(obj.settlementCurrency && this.$dict.currencyList) {

            for(let i = 0; i < this.$dict.currencyList.length; i++) {

              if(this.$dict.currencyList[i].name == obj.settlementCurrency) {

                obj.currency = this.$dict.currencyList[i];
                break;
              }
            }
          }
          this.handle.add.right.form = obj;
        }, () => this.handle.add.right.isLoading = false, params)
      },
      showUpdateDialog(item) {

        this.handle.update.allFiles = [];
        this.handle.update.dialogVisible = true;
        item.userFace = '';
        item.fileId = '';
        item.requirementTypeText = item.saleOrderTypeText || '模具零件';
        item.deliveryDate = item.completionDateString;
        if(item.settlementCurrency && this.$dict.currencyList) {

          for(let i = 0; i < this.$dict.currencyList.length; i++) {

            if(this.$dict.currencyList[i].name == item.settlementCurrency) {

              item.currency = this.$dict.currencyList[i];
              break;
            }
          }
        }

        this.$set(this.handle.update, 'form', this.$utils.deepCopy(item));
      },
      saveUpdate(res) {

        this.$refs.editForm.validate((valid) => {
          if (valid) {

            let params = {
              mrSaleOrderId: this.handle.update.form.mrSaleOrderId || '', 
              mouldNo: this.handle.update.form.mouldNo, 
              customerPoNo: this.handle.update.form.customerPoNo,
              settlementCurrency: this.handle.update.form.currency.name,
              settlementExchangeRate: this.handle.update.form.settlementExchangeRate,
              settlementCurrencyTotalPrice: parseFloat(this.handle.update.form.settlementCurrencyTotalPrice) || 0,
              saleTotalPrice: this.handle.update.form.saleTotalPrice,
              componentOrders: [],
              attachments: [],
              remark: this.handle.update.form.remark
            };
            
            let componentOrders = [];
            this.handle.update.form.componentOrders && this.handle.update.form.componentOrders.map(item => {

              if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {
                componentOrders.push({
                  mrComponentOrderId: item.mrComponentOrderId || '',
                  componentNo: item.componentNo,
                  quantity: parseInt(item.quantity) || 0,
                  customerNo: item.customerNo,
                  deliveryDate: item.deliveryDate,
                  componentPrice: parseInt(item.componentPrice) || 0,
                  componentTotal: item.componentTotal,
                  description: item.description
                })
              }
            })

            if(!componentOrders || !componentOrders.length ) {

              this.handle.update.isLoading = false;
              this.$utils.showTip('warning', 'error', '-1084');
              return;
            }

            params.componentOrders = componentOrders;

            params.attachments = [];
            if(res && res.data && res.data.length) { //附件

              res.data.map(item => params.attachments.push({
                fileId: item.fileId,
                fileName: item.fileName
              }))
            }
            this.handle.update.form.attachments &&  this.handle.update.form.attachments.map(item => {

              if(item.type != 'add') {
                params.attachments.push({
                  fileId: item.fileId,
                  fileName: item.fileName
                })
              }
            })

            this.handle.add.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.editSaleOrder, (res) =>  {

              this.handle.update.isLoading = false;
              this.handle.update.dialogVisible = false;
              this.$utils.showTip('success', 'success', '117');
              this.getLeftList();
            }, () => this.handle.update.isLoading = false, params)
          }else {

            this.handle.update.isLoading = false;
          }
        })
      },
      suspend(item) { //暂停

        let params = {
          mrSaleOrderId: item.mrSaleOrderId,
          saleOrderStatus: 14
        };

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.pauseOrStopSaleOrder, (res) =>  {

          this.isLoading = false;
          item.saleOrderStatus = 14;
          item.saleOrderStatusText = '暂停';
          this.$utils.showTip('success', 'success', '114');
        }, () => this.isLoading = false, params)
      },
      resetSaleOrder(item) { //恢复

        let params = {
          mrSaleOrderId: item.mrSaleOrderId
        };

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.resetSaleOrder, (res) =>  {

          this.isLoading = false;
          item.saleOrderStatus = 120;
          item.saleOrderStatusText = '已下达生产订单';
          this.$utils.showTip('success', 'success', '119');
        }, () => this.isLoading = false, params)
      },
      termination(item) { //终止

        let params = {
          mrSaleOrderId: item.mrSaleOrderId,
          saleOrderStatus: 16
        };

        this.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.pauseOrStopSaleOrder, (res) =>  {

          this.isLoading = false;
          this.$utils.showTip('success', 'success', '115');
          this.search();
        }, () => this.isLoading = false, params)
      },
      deleteOrder(item) {

        let params = {
          mrSaleOrderId: item.mrSaleOrderId
        };
        
        this.handle.del.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.deleteSaleOrder, (res) =>  {

          this.handle.del.isLoading = false;
          this.handle.del.dialogVisible = false;
          this.$utils.showTip('success', 'success', '116');
          this.getLeftList();
        }, () => this.handle.del.isLoading = false, params)
      },
      handleSelect(item) {

        this.left.activeId = item.id;
        this.currentData = item;
      },
      refresh() {}
    },
    computed: {
      total() {

        return function(item) {

          let total = 0;
          item && item.processes.map(itemc => {
            total += (itemc.consumeTime || 0) * itemc.processPrice;
          })
          return total || '-'
        }
      },
      saleTotalPrice() {

        return (obj = null) => {

          let handleObj = obj ? obj : this.handle.add.right;
          let saleTotalPrice = 0;
          handleObj.form.componentOrders && handleObj.form.componentOrders.map(item => {

            if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {

              saleTotalPrice += (parseInt(item.quantity) || 0) * (parseFloat(item.componentPrice) || 0);
            }
          })

          handleObj.form.saleTotalPrice = saleTotalPrice;
        }
      }
    },
    created() {

      this.getLeftList();
    }
  };
</script>


<style scoped lang="scss">
  .progress-list {
    margin-top: 20px;
    .progress-item {
      position: relative;
      display: table;
      min-width: 100%;
      box-sizing: border-box;
      .process-left {
        position: absolute;
        left: 10px;
        bottom: 10px;
        top: 10px;
        width: 200px;
        padding-top: 5px;
        line-height: 27px;
        border-right: 1px solid #ddd;
        .el-button {
          font-size: 14px;
        }
      }
      .process-right {
        height: 193px;
        padding: 10px;
        padding-left: 210px;
        border-top: 1px solid rgba(188, 188, 188, 1);
        background: rgba(242, 242, 242, 1);
        .mrmj-table {
          border: none;
          margin-bottom: 10px;
          background: transparent;
          th {
            border: none;
            min-width: 66px;
            img {
              position: relative;
              top: 3px;
            }
          }
          td {
            border: none;
          }
        }
      }
      &:nth-child(even) .process-right {
        background: rgba(228, 228, 228, 1);
      }
    }
    &.unqualified-list {
      .progress-item {
        padding: 10px;
        background: rgba(242, 242, 242, 1);
        &:nth-child(even) {
          background: rgba(228, 228, 228, 1);
        }
      }
    }
  }
  .mrmj-table {
    td {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>