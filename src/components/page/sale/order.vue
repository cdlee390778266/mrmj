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
                <a href="javascript: void(0);" @click.stop="getOrderDetail(item)">修改</a>
                <a href="javascript: void(0);" @click.stop="suspend(item)">暂停</a>
                <a href="javascript: void(0);" @click.stop="termination(item)">终止</a>
                <a href="javascript: void(0);" @click.stop="deleteConfirm(item)">删除</a>
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
              <div class="main-content-title">
                <div>
                  <i class="el-icon-lx-edit"></i> 零件生产过程
                </div>
              </div>
              <el-scrollbar class="main-content-scorll">
                <div class="progress-list">
                  <div class="progress-item" v-for="(item, index) in right.page2">
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
                      <p class="ellipsis"><span>总价：{{ total(item) }}元</span></p>
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
      <div v-loading="handle.add.isLoading">
        <div class="dflex" >
          <div style="width: 200px;" class="bor rel">
            <div style="display: inline-block; background: #fff; position: relative; top: -10px; left: 10px; z-index: 1">选择需求生成订单</div>
            <div class="order-table-wrapper">
              <el-table
                :data="handle.add.left.list"
                size="mini"
                class="order-table"
                :row-class-name="rowClass"
                @row-click="rowClick">
                <el-table-column prop="a" label="需求编号" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="b" label="客户名称" show-overflow-tooltip	></el-table-column>
                <el-table-column prop="c" label="需求类型" show-overflow-tooltip	></el-table-column>
                <el-table-column prop="d" label="要求交期" show-overflow-tooltip	></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="flex">
            <el-form :model="handle.add.right.form" label-width="100px" class="bor mgl10 pd10">
              <div style="display: inline-block; background: #fff; position: relative; top: -20px; left: 10px; z-index: 1">录入订单信息</div>
              <div class="dflex mgt20">
                <div class="flex">
                  <el-form-item label="客户:">
                    <p class="ellipsis">{{handle.add.right.form.a}}</p>
                  </el-form-item>
                  <el-form-item label="客户PO.号:">
                    <p class="ellipsis">{{handle.add.right.form.b}}</p>
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="模具号">
                        <el-input v-model="handle.add.right.form.c" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="订单类型">
                        <el-select v-model="handle.add.right.form.d">
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
              <template v-if="handle.add.right.form.d == 0">
                <div>
                  <p>零件清单：</p>
                  <el-table
                    :data="handle.add.right.form.e"
                    max-height="160"
                    border
                    size="mini"
                    style="width: 100%"
                    class="edit-table">
                    <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.e, scope.$index, 'aaEdit')">
                            <div class="eaaipsis">{{ scope.row.aa }}</div>
                            <el-input size="mini" v-model="scope.row.aa" @focus="showInput(handle.add.right.form.e, scope.$index, 'aaEdit', {}, false)" @blur="scope.row.aaEdit = false" :style="{opacity: scope.row.aaEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" min-width="88" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.e, scope.$index, 'bbEdit')">
                            <div class="eaaipsis">{{ scope.row.bb }}</div>
                            <el-input size="mini" v-model="scope.row.bb" @focus="showInput(handle.add.right.form.e, scope.$index, 'bbEdit', {}, false)" @blur="scope.row.bbEdit = false" :style="{opacity: scope.row.bbEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.e, scope.$index, 'ccEdit')">
                            <div class="eaaipsis">{{ scope.row.cc }}</div>
                            <el-input size="mini" v-model="scope.row.cc" @focus="showInput(handle.add.right.form.e, scope.$index, 'ccEdit', {}, false)" @blur="scope.row.ccEdit = false" :style="{opacity: scope.row.ccEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="要求交期" min-width="100" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.e, scope.$index, 'ddEdit')">
                            <div class="eaaipsis">{{ scope.row.dd }}</div>
                            <el-input size="mini" v-model="scope.row.dd" @focus="showInput(handle.add.right.form.e, scope.$index, 'ddEdit', {}, false)" @blur="scope.row.ddEdit = false" :style="{opacity: scope.row.ddEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="单价" min-width="100" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.e, scope.$index, 'eeEdit')">
                            <div class="eaaipsis">{{ scope.row.ee }}</div>
                            <el-input size="mini" v-model="scope.row.ee" @focus="showInput(handle.add.right.form.e, scope.$index, 'eeEdit', {}, false)" @blur="scope.row.eeEdit = false" :style="{opacity: scope.row.eeEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="总价" min-width="100" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.e, scope.$index, 'ffEdit')">
                            <div class="eaaipsis">{{ scope.row.ff }}</div>
                            <el-input size="mini" v-model="scope.row.ff" @focus="showInput(handle.add.right.form.e, scope.$index, 'ffEdit', {}, false)" @blur="scope.row.ffEdit = false" :style="{opacity: scope.row.ffEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="说明" min-width="100" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div>
                          <div @click="showInput(handle.add.right.form.e, scope.$index, 'ggEdit')">
                            <div class="eaaipsis">{{ scope.row.gg }}</div>
                            <el-input size="mini" v-model="scope.row.gg" @focus="showInput(handle.add.right.form.e, scope.$index, 'ggEdit', {}, false)" @blur="scope.row.ggEdit = false" :style="{opacity: scope.row.ggEdit ? 1 : 0}"/>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <el-row class="mgt20">
                  <el-col :span="8" style="line-height: 33px;">
                    订单总价(RMB)：{{handle.add.right.form.f | filterNull}}
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="结算货币">
                      <el-select v-model="handle.add.right.form.g" style="width: 80px;">
                        <el-option label="欧元" value="0"></el-option>
                        <el-option label="美元" value="1"></el-option>
                        <el-option label="日元" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="结算货币总价">
                      <el-input v-model="handle.add.right.form.h" auto-complete="off" aria-placeholder="请输入结算货币总价" style="width: 80px;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
              <div>
                <p class="mgb10">
                  上传附件：
                  <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                    <el-button size="mini" type="primary">选择上传文件</el-button>
                    <input type="file" name="file" ref="fileAdd" class="posFull opacity0" @change="() => addAttachments()">
                  </span>
                </p>
                <el-table
                  :data="handle.add.right.form.i"
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
              <el-form-item label="说明" class="mgt20">
                <el-input type="textarea" v-model="handle.add.right.form.j"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button type="primary" @click="() => saveAdd()">下达订单</el-button>
          <el-button type="primary" @click="() => saveAdd(true)">存为草稿</el-button>
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

    <el-dialog title="修改模具零件订单" :visible.sync="handle.update.dialogVisible" width="700px">
      <div v-loading="handle.update.isLoading">
        <el-form :model="handle.update.form" label-width="100px">
          <div class="dflex mgt20">
            <div class="flex">
              <el-form-item label="客户:">
                <p class="ellipsis">{{handle.update.form.a}}</p>
              </el-form-item>
              <el-form-item label="客户PO.号:">
                <p class="ellipsis">{{handle.update.form.b}}</p>
              </el-form-item>
              <el-form-item label="模具号">
                <el-input v-model="handle.update.form.c" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
              </el-form-item>
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
            <el-table
              :data="handle.update.form.e"
              max-height="160"
              border
              size="mini"
              style="width: 100%"
              class="edit-table">
              <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.e, scope.$index, 'aaEdit')">
                      <div class="eaaipsis">{{ scope.row.aa }}</div>
                      <el-input size="mini" v-model="scope.row.aa" @focus="showInput(handle.update.form.e, scope.$index, 'aaEdit', {}, false)" @blur="scope.row.aaEdit = false" :style="{opacity: scope.row.aaEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="数量" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.e, scope.$index, 'bbEdit')">
                      <div class="eaaipsis">{{ scope.row.bb }}</div>
                      <el-input size="mini" v-model="scope.row.bb" @focus="showInput(handle.update.form.e, scope.$index, 'bbEdit', {}, false)" @blur="scope.row.bbEdit = false" :style="{opacity: scope.row.bbEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.e, scope.$index, 'ccEdit')">
                      <div class="eaaipsis">{{ scope.row.cc }}</div>
                      <el-input size="mini" v-model="scope.row.cc" @focus="showInput(handle.update.form.e, scope.$index, 'ccEdit', {}, false)" @blur="scope.row.ccEdit = false" :style="{opacity: scope.row.ccEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="要求交期" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.e, scope.$index, 'ddEdit')">
                      <div class="eaaipsis">{{ scope.row.dd }}</div>
                      <el-input size="mini" v-model="scope.row.dd" @focus="showInput(handle.update.form.e, scope.$index, 'ddEdit', {}, false)" @blur="scope.row.ddEdit = false" :style="{opacity: scope.row.ddEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单价" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.e, scope.$index, 'eeEdit')">
                      <div class="eaaipsis">{{ scope.row.ee }}</div>
                      <el-input size="mini" v-model="scope.row.ee" @focus="showInput(handle.update.form.e, scope.$index, 'eeEdit', {}, false)" @blur="scope.row.eeEdit = false" :style="{opacity: scope.row.eeEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="总价" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.e, scope.$index, 'ffEdit')">
                      <div class="eaaipsis">{{ scope.row.ff }}</div>
                      <el-input size="mini" v-model="scope.row.ff" @focus="showInput(handle.update.form.e, scope.$index, 'ffEdit', {}, false)" @blur="scope.row.ffEdit = false" :style="{opacity: scope.row.ffEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="说明" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(handle.update.form.e, scope.$index, 'ggEdit')">
                      <div class="eaaipsis">{{ scope.row.gg }}</div>
                      <el-input size="mini" v-model="scope.row.gg" @focus="showInput(handle.update.form.e, scope.$index, 'ggEdit', {}, false)" @blur="scope.row.ggEdit = false" :style="{opacity: scope.row.ggEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-row class="mgt20">
            <el-col :span="8" style="line-height: 33px;">
              订单总价(RMB)：{{handle.update.form.f | filterNull}}
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算货币">
                <el-select v-model="handle.update.form.g" style="width: 80px;">
                  <el-option label="欧元" value="0"></el-option>
                  <el-option label="美元" value="1"></el-option>
                  <el-option label="日元" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算货币总价">
                <el-input v-model="handle.update.form.h" auto-complete="off" aria-placeholder="请输入结算货币总价" style="width: 80px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <p class="mgb10">
              上传附件：
              <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                <el-button size="mini" type="primary">选择上传文件</el-button>
                <input type="file" name="file" ref="fileUpdate" class="posFull opacity0" @change="() => addAttachments(handle.update.form, 'i', 'fileUpdate')">
              </span>
            </p>
            <el-table
              :data="handle.update.form.i"
              max-height="160"
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column prop="fileName" label="资料名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="() => deleteAttachments(scope.row.id, handle.update.form, 'i')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item label="说明" class="mgt20">
            <el-input type="textarea" v-model="handle.update.form.j"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button type="primary" @click="() => saveUpdate()">下达订单</el-button>
            <el-button type="primary" @click="() => saveUpdate(true)">存为草稿</el-button>
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
              activeId: ''
            },
            right: {
              isLoading: false,
              form: {

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
            form: {

            }
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

        let mock1 = [{"mrProductionPlanTasksId":"bUzB93j7vki1xgZk","issuedOrderDate":"2019-09-29","planStartDate":"2019-09-30","planEndDate":"2019-11-27","currentProcessId":"eXWfclePNi1hsWoC","issuedPurchaseOrderDate":null,"requireArrivalDate":null,"arrivalDate":null,"outsourceTotalPrice":null,"components":[{"likeCondition":null,"otherWhereClause":null,"enableSumQuery":false,"sumQueryCols":null,"_PAGE":0,"_PAGE_SIZE":0,"_SORT":null,"mrComponentCraftId":"2sNXtAm8X76PLc9Q","componentNo":"L800","quantity":6,"stockingQuantity":5,"id":null,"idColumnName":"","buDesc":null},{"likeCondition":null,"otherWhereClause":null,"enableSumQuery":false,"sumQueryCols":null,"_PAGE":0,"_PAGE_SIZE":0,"_SORT":null,"mrComponentCraftId":"FT7VlgnoZoWMLmDK","componentNo":"TU905","quantity":8,"stockingQuantity":2,"id":null,"idColumnName":"","buDesc":null}],"processes":[{"mrProductionPlanProcessId":"eXWfclePNi1hsWoC","processSequence":"1","processName":"G","isOutsource":null,"workTime":0,"estimationWorkTime":15,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"进行中","consumeTime":null,"processPrice":10},{"mrProductionPlanProcessId":"qO26agoSLjzeworC","processSequence":"2","processName":"M","isOutsource":null,"workTime":10,"estimationWorkTime":10,"startTime":"2019-10-09T05:00:00.000+0000","startTimeString":"2019-10-09 13:00:00","endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":10},{"mrProductionPlanProcessId":"MyR0GNnJeginQzt8","processSequence":"3","processName":"G","isOutsource":null,"workTime":9,"estimationWorkTime":9,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":10},{"mrProductionPlanProcessId":"hDSocyg3qjPm29t4","processSequence":"4","processName":"BH","isOutsource":null,"workTime":0,"estimationWorkTime":5,"startTime":"2019-10-04T05:00:00.000+0000","startTimeString":"2019-10-04 13:00:00","endTime":"2019-10-04T11:00:00.000+0000","endTimeString":"2019-10-04 19:00:00","statusDescription":"已完成","consumeTime":6,"processPrice":100}],"buy":null},{"mrProductionPlanTasksId":"EEe9dvlefbu4gRRv","issuedOrderDate":"2019-09-29","planStartDate":"2019-09-30","planEndDate":"2019-12-27","currentProcessId":"B4U9plj5pRtfA7gZ","issuedPurchaseOrderDate":null,"requireArrivalDate":null,"arrivalDate":null,"outsourceTotalPrice":null,"components":[{"likeCondition":null,"otherWhereClause":null,"enableSumQuery":false,"sumQueryCols":null,"_PAGE":0,"_PAGE_SIZE":0,"_SORT":null,"mrComponentCraftId":"CnqlBCfATbBejaL2","componentNo":"602","quantity":4,"stockingQuantity":3,"id":null,"idColumnName":"","buDesc":null}],"processes":[{"mrProductionPlanProcessId":"B4U9plj5pRtfA7gZ","processSequence":"1","processName":"W/C","isOutsource":null,"workTime":0,"estimationWorkTime":9,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"进行中","consumeTime":null,"processPrice":100},{"mrProductionPlanProcessId":"NlKACfiHEeA8yfIf","processSequence":"2","processName":"CNCH","isOutsource":null,"workTime":0,"estimationWorkTime":5,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":50},{"mrProductionPlanProcessId":"UimEd3dfQxYNYeTp","processSequence":"3","processName":"G","isOutsource":null,"workTime":0,"estimationWorkTime":18,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":10}],"buy":1},{"mrProductionPlanTasksId":"sRtXHUnsJmRqvii9","issuedOrderDate":"2019-09-29","planStartDate":"2019-09-30","planEndDate":null,"currentProcessId":"Zi3hmniC6pmTajQ7","issuedPurchaseOrderDate":null,"requireArrivalDate":null,"arrivalDate":null,"outsourceTotalPrice":null,"components":[{"likeCondition":null,"otherWhereClause":null,"enableSumQuery":false,"sumQueryCols":null,"_PAGE":0,"_PAGE_SIZE":0,"_SORT":null,"mrComponentCraftId":"mLdDOplocrNnbvFf","componentNo":"998","quantity":9,"stockingQuantity":6,"id":null,"idColumnName":"","buDesc":null}],"processes":[{"mrProductionPlanProcessId":"Zi3hmniC6pmTajQ7","processSequence":"1","processName":"M","isOutsource":null,"workTime":5,"estimationWorkTime":5,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"进行中","consumeTime":null,"processPrice":10},{"mrProductionPlanProcessId":"88389BmhwoK1RTCW","processSequence":"2","processName":"G","isOutsource":null,"workTime":16,"estimationWorkTime":16,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":10},{"mrProductionPlanProcessId":"KlVeR2ec06ShL6Xo","processSequence":"3","processName":"M","isOutsource":null,"workTime":10,"estimationWorkTime":10,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":10},{"mrProductionPlanProcessId":"8mKZ8VcgJecj02CI","processSequence":"4","processName":"CNCV","isOutsource":null,"workTime":8,"estimationWorkTime":8,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":10},{"mrProductionPlanProcessId":"GNsW0pfxvCatngOq","processSequence":"5","processName":"CNCH","isOutsource":null,"workTime":4,"estimationWorkTime":4,"startTime":null,"startTimeString":null,"endTime":null,"endTimeString":null,"statusDescription":"待处理","consumeTime":null,"processPrice":50}],"buy":null}]

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
      resetAddForm(obj = null) {

        this.handle.add.right.form = {
          a: obj ? obj.b : '',
          e: [{}],
          d: '0'
        };
      },
      getAddLeftList() {

        let params = {

        };
        let mock = [
          {
            id: '125944',
            a: 'M-1901',
            b: '1测试测试测试测试公司',
            c: '',
            d: ''
          },
          {
            id: '125945',
            a: 'M-1904',
            b: '测试测试测试测试公司',
            c: '',
            d: ''
          },
        ]

        this.handle.add.dialogVisible = true;
        this.handle.add.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.add.isLoading = false;
          this.handle.add.left.list = res.data || [];
          if(this.handle.add.left.list.length) {

            this.handle.add.currentData = this.handle.add.left.list[0];
            this.handle.add.left.activeId = this.handle.add.left.list[0].id;
            this.resetAddForm(this.handle.add.left.list[0])
          }
        }, () => this.handle.add.isLoading = false, params, mock)
      },
      rowClass(obj) {

        let rowClass = obj.row.id == this.handle.add.left.activeId ? 'active' : '';
        return rowClass;
      },
      rowClick(row) {

        this.handle.add.left.activeId = row.id;
        this.handle.add.currentData = row;
        this.resetAddForm(row);
      },
      addAttachments(obj = this.handle.add.right.form, key = 'i', fileRef="fileAdd") {

        let id = new Date().getTime();
        this.$set(obj, key, obj[key] || []);
        obj[key].push({
          id: id,
          fileName: this.$refs[fileRef].files[0].name
        })
        this.$refs[fileRef].value = '';
      },
      deleteAttachments(id, obj = this.handle.add.right.form, key = 'i') {

        obj[key] = obj[key].filter(item => item.id != id);
      },
      saveAdd(isSaveAsDraft = false) {

        let params = {

        };
        
        this.handle.add.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.add.isLoading = false;
          this.handle.add.dialogVisible = false;
          this.$utils.showTip('success', 'success', isSaveAsDraft ? '102' : '113');
        }, () => this.handle.add.isLoading = false, params)
      },
      getOrderDetail(item) {

        let params = {

        };
        let mock = {
          a: '',
          e: [{}],
          d: '0' 
        }

        this.handle.update.isLoading = true;
        this.handle.update.dialogVisible = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.update.isLoading = false;
          this.handle.update.form = res.data || {};
        }, () => this.handle.update.isLoading = false, params, mock)
      },
      saveUpdate(isSaveAsDraft = false) {

        let params = {

        };
        
        this.handle.update.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.update.isLoading = false;
          this.handle.update.dialogVisible = false;
          this.$utils.showTip('success', 'success', isSaveAsDraft ? '102' : '113');
        }, () => this.handle.update.isLoading = false, params)
      },
      suspend(item) {

        let params = {

        };
        
        this.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.isLoading = false;
          this.$utils.showTip('success', 'success', '114');
        }, () => this.isLoading = false, params)
      },
      termination(item) {

        let params = {

        };
        
        this.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.isLoading = false;
          this.$utils.showTip('success', 'success', '115');
        }, () => this.isLoading = false, params)
      },
      deleteConfirm(item) {

        this.left.deleteData = item;
        this.handle.del.dialogVisible = true;
      },
      deleteOrder(item) {

        let params = {

        };
        
        this.handle.del.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.del.isLoading = false;
          this.handle.del.dialogVisible = false;
          this.$utils.showTip('success', 'success', '116');
          this.getLeftList();
        }, () => this.handle.del.isLoading = false, params)
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