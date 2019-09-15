<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：在产订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            在产订单：
            <el-input v-model="form.text" style="width: 150px" prefix-icon="el-icon-search" @focus="isShowList = false" />
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
          </div>
          <div>
            <el-button type="primary" @click="$router.push(`/product/editOrder`)" style="width: 130px;">新增生产订单</el-button>
            <el-button type="primary" class="fr" @click="$router.push(`/product/detail`)" style="width: 130px;">查看当前订单及计划</el-button>
          </div>
        </div>
        <div class="list" ref="list">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
              </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">模具号：<span>{{ item.mouldNo | filterNull }}</span></p>
                  <p class="flex ellipsis">类型：<span>{{ item.orderTypeText | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">客户：<span>{{ item.name | filterNull }}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">进度：<el-progress :percentage="(parseFloat(item.haveCompletionTotalTime) || 0)/(parseFloat(item.estimateTotalTime) || 1)" color="rgba(0, 255, 0, 1)" style="width: 220px;display: inline-block;"></el-progress></el-col>
              <el-col :span="12">状态：{{ item.orderStatusText | filterNull }}</el-col>
              <el-col :span="12">延误时间累计(H)：{{ item.delayTotalTime | filterNull(0) }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" v-if="item.orderStatusText == '未开始'"  @click="edit(item)">编辑</a>
                <a href="javascript: void(0);" v-if="item.orderStatusText == '未开始'" @click="confirm('cancel', '取消', item)">取消</a>
                <a href="javascript: void(0);" v-if="item.orderStatusText != '未开始'" @click="confirm('suspend', '暂停', item)">暂停</a>
                <a href="javascript: void(0);" v-if="item.orderStatusText != '未开始'" @click="confirm('stop', '终止', item)">终止</a>
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
      <div class="main-right">
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
                    <i class="el-icon-lx-edit"></i> 订单T-0034生产进度
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{ right.page1.mouldNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{ right.page1.saleOrderType | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{ right.page1.customerPoNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{ right.page1.name | filterNull }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-button type="primary" @click="orderDetail">查看相关销售订单</el-button>
                    </el-col>
                  </el-row>
                  <div class="progress-list">
                    <div class="progress-item">
                      <div class="process-left">
                        <p><span>零件：A14656</span></p>
                        <p><span>数量：5</span><span class="mgl10">备货数量：3</span></p>
                        <p><span>生产订单下达时间：02.28</span></p>
                        <p><span>计划时间：03.02 至 03.21</span></p>
                        <p><span>当前成本累计：120.00元</span></p>
                        <p>
                          <el-button type="text" @click="jump">编辑 查看 打印工艺卡</el-button>
                        </p>
                      </div>
                      <div class="process-right">
                        <table class="mrmj-table">
                          <thead>
                            <tr>
                              <th class="tr">工序</th>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.name}}</th>
                              <th class="fc-green"><span>H/T</span><img :src="progressImg1" class="mgl5"></th>
                              <th class="fc-green"><span>G</span><img :src="progressImg1" class="mgl5"></th>
                              <th><span>CNCH</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>G</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>EDM</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>CNCH</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>G</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>EDM</span><img :src="progressImg2" class="mgl5"></th>
                              <th class="left"><span>字标</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">估工</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">开始</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">结束</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">耗时</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">人工成本</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="process-left">
                        <p><span>零件：A14656</span></p>
                        <p><span>数量：5</span><span class="mgl10">备货数量：3</span></p>
                        <p><span>生产订单下达时间：02.28</span></p>
                        <p><span>计划时间：03.02 至 03.21</span></p>
                        <p><span>当前成本累计：120.00元</span></p>
                        <p>
                          <el-button type="text" @click="jump">编辑 查看 打印工艺卡</el-button>
                        </p>
                      </div>
                      <div class="process-right">
                        <table class="mrmj-table">
                          <thead>
                            <tr>
                              <th class="tr">工序</th>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.name}}</th>
                              <th class="fc-green"><span>H/T</span><img :src="progressImg1" class="mgl5"></th>
                              <th class="fc-green"><span>G</span><img :src="progressImg1" class="mgl5"></th>
                              <th><span>CNCH</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>G</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>EDM</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>CNCH</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>G</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>EDM</span><img :src="progressImg2" class="mgl5"></th>
                              <th class="left"><span>字标</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">估工</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">开始</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">结束</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">耗时</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">人工成本</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="process-left">
                        <p><span>零件：A14656</span></p>
                        <p><span>数量：5</span><span class="mgl10">备货数量：3</span></p>
                        <p><span>生产订单下达时间：02.28</span></p>
                        <p><span>计划时间：03.02 至 03.21</span></p>
                        <p><span>当前成本累计：120.00元</span></p>
                        <p>
                          <el-button type="text" @click="jump">编辑 查看 打印工艺卡</el-button>
                        </p>
                      </div>
                      <div class="process-right">
                        <table class="mrmj-table">
                          <thead>
                            <tr>
                              <th class="tr">工序</th>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.name}}</th>
                              <th class="fc-green"><span>H/T</span><img :src="progressImg1" class="mgl5"></th>
                              <th class="fc-green"><span>G</span><img :src="progressImg1" class="mgl5"></th>
                              <th><span>CNCH</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>G</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>EDM</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>CNCH</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>G</span><img :src="progressImg2" class="mgl5"></th>
                              <th><span>EDM</span><img :src="progressImg2" class="mgl5"></th>
                              <th class="left"><span>字标</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">估工</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">开始</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">结束</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">耗时</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                            <tr>
                              <td class="tr"><span class="bg-green fcfff">人工成本</span></td>
                              <th v-for="(itemc, index) in currentData.processes" :key="index">{{itemc.estimationWorkTime}}</th>
                              <th>
                                {{currentData.processes | sum('estimationWorkTime')}}
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </el-carousel-item>
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 不合格品情况
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <div>不合格品检测结果</div>
                  <div class="progress-list unqualified-list" style="margin-top: 10px;">
                    <div class="progress-item">
                      <div class="progress-top">
                        <p>
                          <span>时间：2019.04.25</span>
                          <span class="mgl20">加工工序：<strong class="fc-red">G</strong></span>
                          <span class="mgl20">零件号：405/406/426/425</span>
                          <span class="mgl20">数量：8+1</span>
                          <span class="mgl20">检测结果：<strong class="fc-red">返工</strong></span>
                          <span class="mgl20">异常数量：2</span>
                        </p>
                        <p class="ellipsis">
                          异常概况：105#10.776-0.002实测-0.013；255-3#，,205-4#：-0.002公差均-0，105#10.776-105#10.776-105#105#10.776-0.002实测-0.013；255-3#，,205-4#：-0.002公差均-0，105#10.776-105#10.776-105#
                        </p>
                        <p class="ellipsis">
                          处理方式：返工：G光底部
                        </p>
                      </div>
                      <div class="progress-bottom tr">
                        <el-button type="text">附件下载</el-button>
                        <el-button type="text">消除警告</el-button>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="progress-top">
                        <p>
                          <span>时间：2019.04.25</span>
                          <span class="mgl20">加工工序：<strong class="fc-red">G</strong></span>
                          <span class="mgl20">零件号：405/406/426/425</span>
                          <span class="mgl20">数量：8+1</span>
                          <span class="mgl20">检测结果：<strong class="fc-red">返工</strong></span>
                          <span class="mgl20">异常数量：2</span>
                        </p>
                        <p class="ellipsis">
                          异常概况：105#10.776-0.002实测-0.013；255-3#，,205-4#：-0.002公差均-0，105#10.776-105#10.776-105#105#10.776-0.002实测-0.013；255-3#，,205-4#：-0.002公差均-0，105#10.776-105#10.776-105#
                        </p>
                        <p class="ellipsis">
                          处理方式：返工：G光底部
                        </p>
                      </div>
                      <div class="progress-bottom tr">
                        <el-button type="text">附件下载</el-button>
                        <el-button type="text">消除警告</el-button>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="progress-top">
                        <p>
                          <span>时间：2019.04.25</span>
                          <span class="mgl20">加工工序：<strong class="fc-red">G</strong></span>
                          <span class="mgl20">零件号：405/406/426/425</span>
                          <span class="mgl20">数量：8+1</span>
                          <span class="mgl20">检测结果：<strong class="fc-red">返工</strong></span>
                          <span class="mgl20">异常数量：2</span>
                        </p>
                        <p class="ellipsis">
                          异常概况：105#10.776-0.002实测-0.013；255-3#，,205-4#：-0.002公差均-0，105#10.776-105#10.776-105#105#10.776-0.002实测-0.013；255-3#，,205-4#：-0.002公差均-0，105#10.776-105#10.776-105#
                        </p>
                        <p class="ellipsis">
                          处理方式：返工：G光底部
                        </p>
                      </div>
                      <div class="progress-bottom tr">
                        <el-button type="text">附件下载</el-button>
                        <el-button type="text">消除警告</el-button>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </el-carousel-item>
            </el-carousel>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="生产订单信息查看修改" class="dialog-gray" :visible.sync="handle.edit.dialogVisible">
      <div v-loading="handle.edit.isLoading">
        <el-form :model="handle.edit.form" label-width="100px">
          <el-row class="pdtb10 borb">
            <el-col :span="8">模具号：{{handle.edit.order && handle.edit.order.mouldNo}}</el-col>
            <el-col :span="8">客户：{{handle.edit.order && handle.edit.order.name}}</el-col>
            <el-col :span="8">交期：{{handle.edit.order && handle.edit.order.mouldNo}}</el-col>
          </el-row>
          <div class="dialog-content pdt10 pdlr10 mglr10 bgfff">
            <div class="mgb10" :class="{borb: handle.edit.data && (index != handle.edit.data.length - 1)}" v-for="(item, index) in handle.edit.data" :key="index" >
              <el-row>
                <el-col :span="24" class="mgb10">
                  <span class="mgr40">序号：{{index + 1}}</span>
                  <span class="mgr40">零件号码：{{item.components | concatString('componentNo')}}</span></span>
                  <span class="mgr40">版本：
                    <el-select style="width: 100px;" v-model="item.selectedVersionNo">
                      <el-option v-for="(itemc, index) in item.versions" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                    </el-select>
                  </span>
                  <span>材料：{{getSelectedVersionStuffNo(item.versions, item.selectedVersionNo)}}</span>
                </el-col>
                <el-col :span="24">
                  <p v-for="(item, index) in [1, 2]" :key="index" class="mgb10">
                    <span>零件号码：{{handle.edit.form.componentNo}}</span>
                    <span class="mgl20">数量： 
                    <el-input size="mini" v-model="handle.edit.form.quantity" style="width: 100px" /></span>
                    <span class="mgl20">备货数量： 
                    <el-input size="mini" v-model="handle.edit.form.stockingQuantity" style="width: 100px" /></span>
                  </p>
                </el-col>
              </el-row>
              <div class="mgb20">
                <p>工序及估工：</p>
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th class="bge4e4e4">工序顺序</th>
                      <th v-for="(itemc, index) in item.processes" :key="index">{{itemc.name}}</th>
                      <th class="bge4e4e4">工时合计</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="bge4e4e4">估工（H）</td>
                      <th v-for="(itemc, index) in item.processes" :key="index">{{itemc.estimationWorkTime}}</th>
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
          <el-button type="primary" @click="saveEdit(true)">保存</el-button>
          <el-button type="primary" @click="handle.edit.dialogVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="`${handle.handle.title}原因`" :visible.sync="handle.handle.dialogVisible">
      <el-form :model="handle.handle.form" label-width="100px" v-loading="handle.handle.isLoading">
        <el-form-item :label="`需求${handle.handle.title}原因`" class="mgt20">
          <el-input v-model="handle.handle.form.reason"></el-input>
        </el-form-item>
        <el-form-item label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.handle.form.dsc" class="v-textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveHandle">确 定</el-button>
        <el-button @click="handle.handle.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看销售订单信息" center :visible.sync="handle.update.dialogVisible" width="800px" v-dialogDrag>
      <el-form :model="handle.update.form" :rules="handle.update.rules" v-loading="handle.update.isLoading" label-width="100px" ref="updateForm">
        <div class="dflex">
          <div class="flex">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="handle.update.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="模具号" prop="abbreviation">
              <el-input v-model="handle.update.form.abbreviation" auto-complete="off"></el-input>
            </el-form-item>
            <div>
              <p>零件清单：</p>
              <el-table :data="handle.update.form.liaisonManList" border size="mini" style="width: 100%" class="edit-table">
                <el-table-column prop="liaisonManName" label="零件号"  width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'liaisonManNameEdit')">
                        <el-input size="mini" v-model="scope.row.liaisonManName" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'liaisonManNameEdit')" @blur="scope.row.liaisonManNameEdit = false" :style="{opacity: scope.row.liaisonManNameEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.liaisonManName }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="数量" width="88" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'genderEdit')">
                        <el-input size="mini" v-model="scope.row.gender" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'genderEdit')" @blur="scope.row.genderEdit = false" :style="{opacity: scope.row.genderEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.gender }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="要求交期" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'positionEdit')">
                        <el-input size="mini" v-model="scope.row.position" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'positionEdit')" @blur="scope.row.positionEdit = false" :style="{opacity: scope.row.positionEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.position }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="单价" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'phoneEdit')">
                        <el-input size="mini" v-model="scope.row.phone" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'phoneEdit')" @blur="scope.row.phoneEdit = false" :style="{opacity: scope.row.phoneEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.phone }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="总价" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'emailEdit')">
                        <el-input size="mini" v-model="scope.row.email" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'emailEdit')" @blur="scope.row.emailEdit = false" :style="{opacity: scope.row.emailEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.email }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="说明" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'remarkEdit')">
                        <el-input size="mini" v-model="scope.row.remark" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'remarkEdit')" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                        <div class="ellipsis">{{ scope.row.remark }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-row class="mgt10">
              <el-col :span="8">
                <el-form-item label="订单总价(RMB)" label-width="120px">
                  231323.00
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算货币" prop="currencyId" label-width="120px">
                  <el-select v-model="handle.update.form.currencyId" style="width: 100%;">
                    <el-option v-for="(item, index) in $dict.currencyList" :key="index" :label="item.name" :value="item.mrCurrencyId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算货币总价" prop="accountPeriod" label-width="120px">
                  <div class="dflex">
                    <div class="flex">
                      <el-input type="number" v-model="handle.update.form.accountPeriod" auto-complete="off" aria-placeholder="请输入结算货币总价"></el-input>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-upload
            list-type="picture-card"
            class="v-upload pdl10"
            name="files"
            accept="jpg"
            ref="upload"
            :action="$utils.CONFIG.api.uploadFiles"
            :customerId="$utils.getStorage('userId')"
            :multiple="false"
            :limit="1"
            :on-success="(res) => uploadSuccess(res)"
            :on-error="() => uploadError()"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div>
          <p class="mgb10">
            上传附件：
            <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
              <el-button size="mini" type="primary">选择上传文件</el-button>
              <input type="file" name="file" ref="file" class="posFull opacity0" @change="uploadFile">
            </span>
          </p>
          <el-table :data="handle.update.form.liaisonManList" border size="mini" style="width: 100%" class="edit-table">
            <el-table-column prop="fileName" label="上传文件"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="资料名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="address" label="操作" show-overflow-tooltip>
              <template scope="scope">
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="说明" prop="customerName" class="mgt10">
          <el-input type="textarea" v-model="handle.update.form.customerName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer tr">
        <el-button type="primary" @click="saveEdit('updateForm')">下单订单</el-button>
        <el-button type="primary" @click="saveEdit('updateForm')">保存草稿</el-button>
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
        defaultImg: require('../../../assets/img/order.svg'),
        progressImg1: require('../../../assets/img/progress-1.png'),
        progressImg2: require('../../../assets/img/progress-2.png'),
        left: {
          list: [{}]
        },
        right: {
          activeIndex: 0,
          list: [
            {
              spList: [],
              enclosureList: []
            }
          ]
        },
        handle: {
          edit: {
            dialogVisible: false,
            isLoading: false,
            order: {},
            data: [{},{}],
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: "",
              quantity: '',
              stockingQuantity: ''
            }
          },
          handle: {
            dialogVisible: false,
            isLoading: false,
            order: {},
            form: {
              reason: '',
              dic: ''
            }
          },
          update: {
            dialogVisible: false,
            isLoading: false,
            handleType: 'add',
            form: {
              fileId: '',
              customerName: '',
              customerType: 10,
              abbreviation: '',
              countryId: '',
              currencyId: '',
              accountPeriod: '',
              address: '',
              industryNume: '',
              phone: '',
              valueScale: '',
              province: '',
              city: '',
              distinct: '',
              fax: '',
              email: '',
              personInCharge: '',
              personScale: '',
              liaisonManList: [],
              remark: ''
            },
            rules: {
              customerName: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
                { max: 20, message: this.$utils.getTipText('error', '-1011')}
              ],
              abbreviation: [
                { required: true, message: this.$utils.getTipText('error', '-1012')}
              ],
              countryId: [
                { required: true, message: this.$utils.getTipText('error', '-1013')}
              ],
              currencyId: [
                { required: true, message: this.$utils.getTipText('error', '-1017')}
              ],
              accountPeriod: [
                { required: true, message: this.$utils.getTipText('error', '-1018')}
              ],
              address: [
                { required: true, message: this.$utils.getTipText('error', '-1014')}
              ],
              phone: [
                { validator: this.$validator.checkPhone}
              ],
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
          pageSize: this.left.page.pageSize
        }
        if(this.form.text) params.name = this.form.text;

        this.getData(this.$utils.CONFIG.api.trackProductionOrder, params, 'id', loadingKey);
      },
      edit(item) {

        this.handle.edit.order = item;
        this.handle.edit.dialogVisible = true;
      },
      saveEdit() {


      },
      confirm(type, title, item) {

        this.handle.handle.type = type;
        this.handle.handle.title = title;
        this.handle.handle.order = item;
        this.handle.handle.dialogVisible = true;
      },
      saveHandle() {

        this.handle.handle.dialogVisible = false;
      },
      orderDetail() {

        this.handle.update.dialogVisible = true;
      },
      handlePictureCardPreview(file) {
        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
      },
      jump() {

        this.$router.push(`/product/processCard/1`);
      },
      del(index, row) {
        console.log(index, row);
      },
      refresh() {}
    },
    created() {
      this.filter.typeList = this.filter.listType.product;
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
</style>