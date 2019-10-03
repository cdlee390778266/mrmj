<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置： 项目开展
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            当前项目：
            <el-input v-model="form.text" style="width: 130px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            <el-dropdown ref="sort" :hide-on-click="false">
              <el-button type="primary" icon="el-icon-sort" class="mgl10" style="width: auto;"></el-button>
              <el-dropdown-menu slot="dropdown" class="sort">
                <el-dropdown-item>
                  <el-button type="text" class="fs14" :class="{active: filter.sort.sortType == ''}" @click="checkSort('')">升序</el-button>
                  <el-button type="text" class="fr fs14" :class="{active: filter.sort.sortType == 'desc'}" @click="checkSort('desc')">降序</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided v-for="(item, index) in filter.sort.listType.project" :key="index">
                  <el-radio v-model="filter.sort.sortField" :label="item.value">{{item.label}}</el-radio>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="list" style="top: 64px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="40" class="mgr10 mgt10" />
              </div>
              <div class="flex ellipsis">
                <p class="ellipsis">
                  <span>模具号：{{ item.a | filterNull }}</span>
                  <span class="mgl10">移模:<span :title="item.b | filterNull">{{ item.b | filterNull }}</span></span>
                </p>
                <p class="ellipsis">客户：<span :title="item.c | filterNull">{{ item.c | filterNull }}</span></p>
              </div>
            </div>
            <el-row>
              <el-col :span="24" class="ellipsis">产品名称：<span :title="item.d | filterNull">{{ item.d | filterNull }}</span></el-col>
              <el-col :span="12" class="ellipsis" :title="item.e | filterNull">项目状态：{{ item.e | filterNull }}</el-col>
              <el-col :span="12" class="ellipsis" :title="item.f | filterNull">当前逾期：<span class="fc-red">{{ item.f | filterNull }}</span></el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="$router.push(`/project/approval/${item.id}`)">编辑</a>
                <a href="javascript: void(0);" @click="getProductDetail(item)">提交零件生产</a>
                <a href="javascript: void(0);" @click="getModify(item)">提交零件修模</a>
                <a href="javascript: void(0);" @click="getNodeTerm(item)">结项</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true; getLeftList();"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="refresh" :haveCarousel="true">
          <template #pageName>订单开展明细信息</template>
          <el-carousel
              direction="vertical"
              :autoplay="false"
              :loop="false"
              trigger="click"
              ref="carousel"
            >
            <el-carousel-item >
              <div>
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 模具{{ right.page1.a | filterNull }}基本信息
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :span="24"><strong>项目开展进度</strong></el-col>
                    <el-col :span="24">
                      <span>当前状态：{{ right.page1.b | filterNull }}</span>
                      <span class="mgl20">目前逾期：{{ right.page1.c | filterNull }}天</span>
                    </el-col>
                    <el-col :span="24">
                      <table class="mrmj-table">
                        <thead>
                          <tr>
                            <th class="bge4e4e4"></th>
                            <th class="bge4e4e4">设计完成</th>
                            <th class="bge4e4e4">标件到货</th>
                            <th class="bge4e4e4">模板到货</th>
                            <th class="bge4e4e4">零件加工完成</th>
                            <th class="bge4e4e4">塑料到货</th>
                            <th class="bge4e4e4">装模完成</th>
                            <th class="bge4e4e4">T0 试模</th>
                            <th class="bge4e4e4">FA测量完成</th>
                            <th class="bge4e4e4">T0样品提交</th>
                            <th class="bge4e4e4">移模</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="bge4e4e4">计划</td>
                            <td v-for="(item, index) in right.page1.d" :key="index">{{item.a | filterNull('')}}</td>
                          </tr>
                          <tr>
                            <td class="bge4e4e4">实际</td>
                            <td v-for="(item, index) in right.page1.d" :key="index">{{item.b | filterNull('')}}</td>
                          </tr>
                          <tr>
                            <td class="bge4e4e4">逾期天数</td>
                            <td v-for="(item, index) in right.page1.d" :key="index">{{item.c | filterNull('')}}</td>
                          </tr>
                          <tr>
                            <td class="bge4e4e4">说明</td>
                            <td v-for="(item, index) in right.page1.d" :key="index">{{item.d | filterNull('')}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </el-col>
                    <el-col :span="24" class="mgt10">
                      <el-button type="primary">项目进度上报</el-button>
                    </el-col>
                  </el-row>
                  <el-row class="mgt20">
                    <el-col :span="24"><strong>项目基本信息</strong></el-col>
                    <el-col :span="24">
                      <div class="dflex">
                        <div class="pdtb10 pdlr20">
                          <vue-preview class="thumbnail" :slides="right.page1.e"></vue-preview>
                        </div>
                        <div class="flex">
                          <p class="ellipsis mgt10">
                            <span>模具号：{{right.page1.f | filterNull}}</span>
                            <span class="mgl20">模具报价(RMB)：{{right.page1.g | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>客户名称：{{right.page1.h | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>启动时间：{{right.page1.i | filterNull}}</span>
                            <span class="mgl20">移模日期：{{right.page1.j | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>产品名称：{{right.page1.k | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>产品编号：{{right.page1.l | filterNull}}</span>
                            <span class="mgl20">版本号：{{right.page1.m | filterNull}}</span>
                            <span class="mgl20">穴数：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>模具尺寸：{{right.page1.n | filterNull}}</span>
                            <span class="mgl20">模模具结构：{{right.page1.o | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>塑料名称：{{right.page1.p | filterNull}}</span>
                            <span class="mgl20">模具状态：{{right.page1.q | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>样品需求数量：{{right.page1.r | filterNull}}</span>
                          </p>
                          <p>
                            <el-button type="primary">查看订单明细</el-button>
                          </p>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="24" class="mgt10">
                      <p>特殊要求：</p>
                      <p>{{right.page1.s | filterNull}}</p>
                    </el-col>
                    <el-col :span="24" class="mgt10">
                      <p>特殊要求相关附件：</p>
                      <el-table
                        :data="right.page1.u"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      > 
                        <el-table-column type="index" width="50" label="序号"></el-table-column>
                        <el-table-column prop="fileName" label="附件名称" show-overflow-tooltip></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
                            <a href="javascript:void(0);" style="color: #3375AB;" @click="down(scope.row.fileId)">下载</a>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </div>
            </el-carousel-item>
            <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 模具{{right.page2.a | filterNull}}设计信息
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :span="24" class="mgb10 mgt10">
                      <strong>当前图纸列表</strong>
                      <el-button type="primary" class="mgl10">下图</el-button>
                    </el-col>
                    <el-col :span="24">
                      <div class="mgb5">
                        <span>图纸过滤条件</span>
                        <span class="mgl20">
                          图纸名称：
                          <el-select v-model="right.page2.aa" size="mini" placeholder="请选择" style="width: 100px;">
                          <el-option
                            v-for="item in filter.name"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        </span>
                        <span class="mgl20">
                          图出图批次：
                          <el-select v-model="right.page2.bb" size="mini" placeholder="请选择" style="width: 100px;">
                          <el-option
                            v-for="item in filter.batch"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        </span>
                      </div>
                      <el-table
                        :data="right.page2.b"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column prop="a" label="图纸名称" width="130" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="b" label="版本" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="c" label="出图批次" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="d" label="出图目的" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="e" label="出图时间" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="f" label="说明" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="mgtb10">
                      <strong>设计模具零件列表</strong>
                      <el-button type="primary" class="mgl10">增加整体模具零件</el-button>
                    </el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page2.c"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="a" label="零件号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="b" label="数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="c" label="设计完成日期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="d" label="计划生产完成时间" width="120"show-overflow-tooltip></el-table-column>
                        <el-table-column prop="e" label="设计图纸名称" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="f" label="版本" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="g" label="出图批次" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="h" label="说明" show-overflow-tooltip></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
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

    <el-dialog title="模具零件提交生产" class="dialog-gray" :visible.sync="handle.product.dialogVisible" width="780px">
      <div v-loading="handle.product.isLoading">
        <el-form :model="handle.product.form" ref="form" label-width="100px">
          <el-row class="pdt10 borb">
            <el-col :span="24">
              是否确定将下表所示零件提交生产，进行工艺设计及开展零件生产？
            </el-col>
          </el-row>
          <div class="dialog-content pdt10 pdlr10 mglr10 bgfff">
            <div class="mgb10 borb">
              <el-table
                :data="handle.product.data"
                max-height="400"
                border
                class="edit-table content-table"
                style="width: 100%">
                <el-table-column label="零件名称" width="120" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(handle.product.data, scope.$index, 'aaEdit')">
                        <div class="ellipsis">{{ scope.row.aa }}</div>
                        <el-autocomplete
                          class="inline-input"
                          v-model="scope.row.aa"
                          :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.aa, 'codeName')"
                          valueKey="codeName"
                          value="codeName"
                          placeholder="请输入内容"
                          @focus="showInput(handle.product.data, scope.$index, 'aaEdit')"
                          @blur="scope.row.aaEdit = false"
                          :style="{opacity: scope.row.aaEdit ? 1 : 0}"
                        ></el-autocomplete>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="66" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.product.data, scope.$index, 'bbEdit', {})">
                        <div class="ellipsis">{{ scope.row.bb }}</div>
                        <el-input size="mini" v-model="scope.row.bb" @focus="showInput(handle.product.data, scope.$index, 'bbEdit', {})" @blur="scope.row.bbEdit = false" :style="{opacity: scope.row.bbEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="图纸名称" width="120" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.product.data, scope.$index, 'ccEdit', {})">
                        <div class="ellipsis">{{ scope.row.cc }}</div>
                        <el-input size="mini" v-model="scope.row.cc" @focus="showInput(handle.product.data, scope.$index, 'ccEdit', {})" @blur="scope.row.ccEdit = false" :style="{opacity: scope.row.ccEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="版本" width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.product.data, scope.$index, 'ddEdit', {})">
                        <div class="ellipsis">{{ scope.row.dd }}</div>
                        <el-input size="mini" v-model="scope.row.dd" @focus="showInput(handle.product.data, scope.$index, 'ddEdit', {})" @blur="scope.row.ddEdit = false" :style="{opacity: scope.row.ddEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="出图批次" width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.product.data, scope.$index, 'eeEdit', {})">
                        <div class="ellipsis">{{ scope.row.ee }}</div>
                        <el-input size="mini" v-model="scope.row.ee" @focus="showInput(handle.product.data, scope.$index, 'eeEdit', {})" @blur="scope.row.eeEdit = false" :style="{opacity: scope.row.eeEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="出图目的" width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.product.data, scope.$index, 'ffEdit', {})">
                        <div class="ellipsis">{{ scope.row.ff }}</div>
                        <el-input size="mini" v-model="scope.row.ff" @focus="showInput(handle.product.data, scope.$index, 'ffEdit', {})" @blur="scope.row.ffEdit = false" :style="{opacity: scope.row.ffEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="说明" min-width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.product.data, scope.$index, 'ggEdit', {})">
                        <div class="ellipsis">{{ scope.row.gg }}</div>
                        <el-input size="mini" v-model="scope.row.gg" @focus="showInput(handle.product.data, scope.$index, 'ggEdit', {})" @blur="scope.row.ggEdit = false" :style="{opacity: scope.row.ggEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="saveProduct">提交生产</el-button>
          <el-button type="primary" @click="handle.product.dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="零件修模提交生产" class="dialog-gray" :visible.sync="handle.modify.dialogVisible" width="930px">
      <div v-loading="handle.modify.isLoading">
        <el-form :model="handle.modify.form" ref="form" label-width="100px">
          <el-row class="pdt10 borb">
            <el-col :span="24">
              选择整体模具包含的零件，提交生产进行修模
            </el-col>
          </el-row>
          <div class="dialog-content pdt10 pdlr10 mglr10 bgfff">
            <div class="mgb10 borb">
              <el-table
                :data="handle.modify.data"
                max-height="400"
                border
                class="edit-table content-table"
                style="width: 100%">
                <el-table-column label="零件名称" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'aaEdit')">
                        <div class="ellipsis">
                          {{scope.row.aa}}
                        </div>
                        <el-select
                          v-model="scope.row.aa"
                          placeholder="请选择"
                          :style="{opacity: scope.row.aaEdit ? 1 : 0}"
                          @focus="showInput(handle.modify.data, scope.$index, 'aaEdit')"
                          @blur="scope.row.aaEdit = false">
                          <el-option
                            v-for="item in filter.aa"
                            :key="item.codeName"
                            :label="item.codeName"
                            :value="item.codeName">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="66" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'bbEdit', {})">
                        <div class="ellipsis">{{ scope.row.bb }}</div>
                        <el-input size="mini" v-model="scope.row.bb" @focus="showInput(handle.modify.data, scope.$index, 'bbEdit', {})" @blur="scope.row.bbEdit = false" :style="{opacity: scope.row.bbEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="图纸名称" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'ccEdit')">
                        <div class="ellipsis">
                          {{scope.row.cc}}
                        </div>
                        <el-select
                          v-model="scope.row.cc"
                          placeholder="请选择"
                          :style="{opacity: scope.row.ccEdit ? 1 : 0}"
                          @focus="showInput(handle.modify.data, scope.$index, 'ccEdit')"
                          @blur="scope.row.ccEdit = false">
                          <el-option
                            v-for="item in filter.name"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="版本" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'ddEdit')">
                        <div class="ellipsis">
                          {{scope.row.dd}}
                        </div>
                        <el-select
                          v-model="scope.row.dd"
                          placeholder="请选择"
                          :style="{opacity: scope.row.ddEdit ? 1 : 0}"
                          @focus="showInput(handle.modify.data, scope.$index, 'ddEdit')"
                          @blur="scope.row.ddEdit = false">
                          <el-option
                            v-for="item in filter.dd"
                            :key="item.codeName"
                            :label="item.codeName"
                            :value="item.codeName">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="出图批次" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'eeEdit')">
                        <div class="ellipsis">
                          {{scope.row.ee}}
                        </div>
                        <el-select
                          v-model="scope.row.ee"
                          placeholder="请选择"
                          :style="{opacity: scope.row.eeEdit ? 1 : 0}"
                          @focus="showInput(handle.modify.data, scope.$index, 'eeEdit')"
                          @blur="scope.row.eeEdit = false">
                          <el-option
                            v-for="item in filter.batch"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="ff" label="出图目的" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="项目问题" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'ggEdit')">
                        <div class="ellipsis">
                          {{scope.row.gg}}
                        </div>
                        <el-select
                          v-model="scope.row.gg"
                          placeholder="请选择"
                          :style="{opacity: scope.row.ggEdit ? 1 : 0}"
                          @focus="showInput(handle.modify.data, scope.$index, 'ggEdit')"
                          @blur="scope.row.ggEdit = false">
                          <el-option
                            v-for="item in filter.batch"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="问题描述" min-width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'hhEdit', {})">
                        <div class="ellipsis">{{ scope.row.hh }}</div>
                        <el-input size="mini" v-model="scope.row.hh" @focus="showInput(handle.modify.data, scope.$index, 'hhEdit', {})" @blur="scope.row.hhEdit = false" :style="{opacity: scope.row.hhEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="修模说明" min-width="100" show-overflow-tooltip>
                  <template scope="scope">
                    <div>
                      <div @click="showInput(handle.modify.data, scope.$index, 'iiEdit', {})">
                        <div class="ellipsis">{{ scope.row.ii }}</div>
                        <el-input size="mini" v-model="scope.row.ii" @focus="showInput(handle.modify.data, scope.$index, 'iiEdit', {})" @blur="scope.row.iiEdit = false" :style="{opacity: scope.row.iiEdit ? 1 : 0}"/>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdtb20 pdlr10">
          <el-button type="primary" @click="saveModify">提交生产</el-button>
          <el-button type="primary" @click="handle.modify.dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="项目结项" class="dialog-gray" :visible.sync="handle.nodeTerm.dialogVisible" >
      <div v-loading="handle.nodeTerm.isLoading">
        <el-form :model="handle.nodeTerm.form" ref="form" label-width="100px">
          <el-row class="pdt20 borb">
            <el-col :span="8">
              模具号：{{ handle.nodeTerm.data.a | filterNull }}
            </el-col>
            <el-col :span="8">
              客户：{{ handle.nodeTerm.data.b | filterNull }}
            </el-col>
            <el-col :span="8">
              移模日期：{{ handle.nodeTerm.data.c | filterNull }}
            </el-col>
            <el-col :span="8">
              模具尺寸：{{ handle.nodeTerm.data.d | filterNull }}
            </el-col>
            <el-col :span="8">
              模具结构：{{ handle.nodeTerm.data.e | filterNull }}
            </el-col>
            <el-col :span="8">
              穴数：{{ handle.nodeTerm.data.f | filterNull }}
            </el-col>
            <el-col :span="24" class="mgt10">
              成本估算
            </el-col>
            <el-col :span="8">
              <el-form-item label="新模零件加工">
                <el-input size="mini" v-model="handle.nodeTerm.form.a"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修模零件加工">
                <el-input size="mini" v-model="handle.nodeTerm.form.b"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设计">
                <el-input size="mini" v-model="handle.nodeTerm.form.c"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="特殊工艺">
                <el-input size="mini" v-model="handle.nodeTerm.form.d"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="材料">
                <el-input size="mini" v-model="handle.nodeTerm.form.e"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="装模">
                <el-input size="mini" v-model="handle.nodeTerm.form.f"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="试模">
                <el-input size="mini" v-model="handle.nodeTerm.form.g"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="塑料成本">
                <el-input size="mini" v-model="handle.nodeTerm.form.h"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="顶针">
                <el-input size="mini" v-model="handle.nodeTerm.form.i"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="热流道">
                <el-input size="mini" v-model="handle.nodeTerm.form.j"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标件">
                <el-input size="mini" v-model="handle.nodeTerm.form.k"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模架">
                <el-input size="mini" v-model="handle.nodeTerm.form.l"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费">
                <el-input size="mini" v-model="handle.nodeTerm.form.m"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="结项说明">
                <el-input type="textarea" size="mini" v-model="handle.nodeTerm.form.n" row="4"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer tr pdb20 pdlr10">
          <el-button type="primary" @click="saveNodeTerm">结项</el-button>
          <el-button type="primary" @click="handle.nodeTerm.dialogVisible = false">取消</el-button>
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
        defaultImg: require('../../../assets/img/icon13.svg'),
        currentData: {
          detail: {}
        },
        filter: {
          aa: [
            {
              codeName: '202',
              supplier: '202'
            },
            {
              codeName: '203',
              supplier: '203'
            },
            {
              codeName: '204',
              supplier: '204'
            },
            {
              codeName: '205',
              supplier: '205'
            }
          ],
          dd: [
            {
              codeName: 'A',
              supplier: 'A'
            },
            {
              codeName: 'B',
              supplier: 'B'
            },
            {
              codeName: 'C',
              supplier: 'C'
            },
            {
              codeName: 'D',
              supplier: 'D'
            }
          ],
          name: [
            {
              value: '0',
              label: '全部'
            },
            {
              value: '1',
              label: 'T045-A01'
            },
            {
              value: '2',
              label: 'T045-A02'
            },
            {
              value: '3',
              label: 'T045-A03'
            },
          ],
          batch: [
            {
              value: '0',
              label: '全部'
            },
            {
              value: '1',
              label: '001'
            },
            {
              value: '2',
              label: '002'
            },
            {
              value: '3',
              label: '003'
            },
          ]
        },
        handle: {
          product: {
            dialogVisible: false,
            isLoading: false,
            data: [],
          },
          modify: {
            dialogVisible: false,
            isLoading: false,
            data: [],
          },
          nodeTerm: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {}
          }
        }
      };
    },
    methods: {
      getLeftList() { //获取采购订单列表

        let params = {

        };
        let mock = [
          {
            id: 0,
            a: 'T-0031',
            b: '整体模具',
            c: 'A公司',
            d: '2019.03.31',
            e: '12500.00元'
          },
          {
            id: 1,
            a: 'T-0032',
            b: '整体模具',
            c: 'B公司',
            d: '2019.03.31',
            e: '12500.00元'
          },
          {
            id: 2,
            a: 'T-0033',
            b: '整体模具',
            c: 'A公司',
            d: '2019.03.31',
            e: '12500.00元'
          }
        ]

        this.left.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.list = res.data || [];
          if(this.left.list.length) {

            this.left.activeId = this.left.list[0].id;
            this.currentData = this.left.list[0];
            this.getDetail();
          }
        }, () => this.left.isLoading = false, params, mock)
      },
      getDetail() {

        let params = {

        };
        let mockpage1 = {
            a: 'T-0031',
            b: 'tooling 加工',
            c: '4',
            d: [
              {
                a: '2018-05-20',
                b: '2018-05-18',
                c: '-2',
                d: ''
              },
              {
                a: '2018-05-30',
                b: '2018-05-31',
                c: '1',
                d: ''
              },
              {
                a: '2018-06-02',
                b: '2018-06-06',
                c: '4',
                d: ''
              },
              {
                a: '2018-06-10',
                b: '正在进行中',
                c: '',
                d: ''
              },
              {
                a: '2018-06-20',
                b: '未开始',
                c: '',
                d: ''
              },
              {
                a: '2018-06-25',
                b: '未开始',
                c: '',
                d: ''
              },
              {
                a: '2018-06-30',
                b: '未开始',
                c: '',
                d: ''
              },
              {
                a: '2018-07-07',
                b: '未开始',
                c: '',
                d: ''
              },
              {
                a: '2018-05-20',
                b: '未开始',
                c: '',
                d: ''
              },
              {
                a: '2018-05-20',
                b: '未开始',
                c: '',
                d: ''
              },
            ],
            e: [
              {
                src: require('../../../assets/img/1.jpg'),
                msrc: require('../../../assets/img/1.jpg'),
                alt: '',
                title: '',
                w: 600,
                h: 600
              }
            ],
            f: 'T-0029',
            g: '12301.00',
            h: 'FEP',
            i: '2019.03.31',
            j: '2019.03.31',
            k: 'Connector  10pol./1.2/2.8 MM',
            l: '42117900X',
            m: '00',
            n: '8',
            o: '350x600x400',
            p: '2板模+热流道',
            q: 'PBT SHINITE D201 G20',
            r: '内部生产',
            s: '20 shots',
            t: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.',
            u: [
              {
                fileName: '172988图纸',
                fileId: 'crQhc2flTyetPwbJ'
              },
              {
                fileName: '172988图纸',
                fileId: 'crQhc2flTyetPwbJ'
              },
              {
                fileName: '172988图纸',
                fileId: 'crQhc2flTyetPwbJ'
              },
            ]
        }
        

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page1 = res.data || {};
        }, () => this.right.isLoading = false, params, mockpage1)

        let mockpage2 = {
            a: 'T-0031',
            b: [
              {
                a: 'T045-A01',
                b: 'A',
                c: '001',
                d: 'Make new',
                e: '2019.02.17',
                f: '',
                fileId: 'crQhc2flTyetPwbJ'
              },
              {
                a: 'T045-A03',
                b: 'B',
                c: '002',
                d: 'Modify',
                e: '2019.02.17',
                f: '',
                fileId: 'crQhc2flTyetPwbJ'
              },
              {
                a: 'T045-A04',
                b: 'A',
                c: '001',
                d: 'Make new',
                e: '2019.02.17',
                f: '',
                fileId: 'crQhc2flTyetPwbJ'
              },
            ],
            c: [
              {
                a: 'A01',
                b: '3',
                c: '2019.02.17',
                d: '2019.03.31',
                e: 'T034-A01',
                f: 'A',
                g: '001',
                h: ''
              },
              {
                a: 'A03',
                b: '2',
                c: '2019.02.19',
                d: '2019.03.31',
                e: 'T034-A01',
                f: 'B',
                g: '001',
                h: ''
              },
            ]
        }

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page2 = res.data || {};
        }, () => this.right.isLoading = false, params, mockpage2)
      },
      handleSelect(item) {

        this.left.activeId = item.id;
        this.currentData = item;
        this.getDetail();
      },
      getProductDetail(item) {

        let params = {

        };
        let mock = [
          {
            aa: '202',
            bb: '3',
            cc: 'T029-202',
            dd: 'A',
            ee: '001',
            ff: 'Make new'
          }
        ]

        this.handle.product.dialogVisible = true;
        this.handle.product.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.product.isLoading = false;
          this.handle.product.data = res.data || [];
        }, () => this.handle.product.isLoading = false, params, mock)
      },
      saveProduct() {

        let params = {

        };
        
        this.handle.product.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '109');
          this.handle.product.isLoading = false;
          this.handle.product.dialogVisible = false;
        }, () => this.handle.product.isLoading = false, params)
      },
      getModify(item) {

        let params = {

        };
        let mock = [
          {
            aa: '202',
            bb: '3',
            cc: 'T029-202',
            dd: 'A',
            ee: '001',
            ff: 'Make new'
          }
        ]

        this.handle.modify.dialogVisible = true;
        this.handle.modify.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.modify.isLoading = false;
          this.handle.modify.data = res.data || [];
        }, () => this.handle.modify.isLoading = false, params, mock)
      },
      saveModify() {

        let params = {

        };
        
        this.handle.modify.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '109');
          this.handle.modify.isLoading = false;
          this.handle.modify.dialogVisible = false;
        }, () => this.handle.modify.isLoading = false, params)
      },
      getNodeTerm(item) {

        let params = {

        };
        let mock = [
          {
            aa: '202',
            bb: '3',
            cc: 'T029-202',
            dd: 'A',
            ee: '001',
            ff: 'Make new'
          }
        ]

        this.handle.nodeTerm.dialogVisible = true;
        this.handle.nodeTerm.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.handle.nodeTerm.isLoading = false;
          this.handle.nodeTerm.data = res.data || [];
        }, () => this.handle.nodeTerm.isLoading = false, params, mock)
      },
      saveNodeTerm() {

        let params = {

        };
        
        this.handle.nodeTerm.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '109');
          this.handle.nodeTerm.isLoading = false;
          this.handle.nodeTerm.dialogVisible = false;
        }, () => this.handle.nodeTerm.isLoading = false, params)
      },
      refresh() {}
    },
    created() {

      this.filter.typeList = this.filter.listType.project;
      this.filter.sort.sortField = this.filter.sort.listType.project[0].value;
      this.getLeftList();
    }
  };
</script>


<style scoped lang="scss">
  .el-row {
    margin-bottom: 20px;
  }
  .main-left-search {
    button {
      width: 130px;
    }
  }
  .thumbnail {
    width: 240px;
    height: 240px;
    background-position: center;
    background-size: cover;
    cursor: pointer;
    overflow: hidden;
  }
</style>