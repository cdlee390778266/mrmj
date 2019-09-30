<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置： 项目开展
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="left.isLoading">
      <div class="main-left">
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
                <a href="javascript: void(0);" @click="$router.push(`/project/approval/${item.id}`)">提交零件生产</a>
                <a href="javascript: void(0);" @click="$router.push(`/project/approval/${item.id}`)">提交零件修模</a>
                <a href="javascript: void(0);" @click="$router.push(`/project/approval/${item.id}`)">结项</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true; getLeftList();"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right">
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
                    <i class="el-icon-lx-edit"></i> 模具T-0029基本信息
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :span="24"><strong>项目开展进度</strong></el-col>
                    <el-col :span="24">
                      <span>当前状态：{{ right.page1.f | filterNull }}</span>
                      <span class="mgl20">目前逾期：{{ right.page1.f | filterNull }}天</span>
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
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                          </tr>
                          <tr>
                            <td class="bge4e4e4">实际</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                          </tr>
                          <tr>
                            <td class="bge4e4e4">逾期天数</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                          </tr>
                          <tr>
                            <td class="bge4e4e4">说明</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
                            <td>{{right.page1.a | filterNull('')}}</td>
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
                        <div></div>
                        <div class="flex">
                          <p class="ellipsis">
                            <span>模具号：{{right.page1.a | filterNull}}</span>
                            <span class="mgl20">模具报价(RMB)：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>客户名称：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>启动时间：{{right.page1.a | filterNull}}</span>
                            <span class="mgl20">移模日期：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>产品名称：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>产品编号：{{right.page1.a | filterNull}}</span>
                            <span class="mgl20">版本号：{{right.page1.a | filterNull}}</span>
                            <span class="mgl20">穴数：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>模具尺寸：{{right.page1.a | filterNull}}</span>
                            <span class="mgl20">模模具结构：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>塑料名称：{{right.page1.a | filterNull}}</span>
                            <span class="mgl20">模具状态：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p class="ellipsis">
                            <span>样品需求数量：{{right.page1.a | filterNull}}</span>
                          </p>
                          <p>
                            <el-button type="primary">查看订单明细</el-button>
                          </p>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="24">
                      <p>特殊要求：</p>
                      <p>{{right.page1.a | filterNull}}</p>
                    </el-col>
                    <el-col :span="24">
                      <p>特殊要求相关附件：</p>
                      <el-table
                        :data="currentData.detail.j"
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
          </el-carousel>
        </page-wrapper>
      </div>
    </div>
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
            e: '12500.00元',
            detail: {
              a: 'A公司',
              b: '12334567',
              c: 'T-0031',
              d: '整体模具',
              e: '2019.03.31',
              dd: '已立项',
              f: '12301.00',
              g: '欧元',
              h: '7.0',
              i: '12301.00',
              j: [
                {
                  fileName: '172988图纸',
                  fileId: 'crQhc2flTyetPwbJ'
                }
              ],
              k: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.'
            }
          },
          {
            id: 1,
            a: 'T-0032',
            b: '整体模具',
            c: 'B公司',
            d: '2019.03.31',
            e: '12500.00元',
            detail: {
              a: 'B公司',
              b: '12334567',
              c: 'T-0032',
              d: '整体模具',
              e: '2019.03.31',
              dd: '已立项',
              f: '12301.00',
              g: '欧元',
              h: '7.5',
              i: '12301.00',
              j: [
                {
                  fileName: '36988图纸',
                  fileId: 'crQhc2flTyetPwbJ'
                }
              ],
              k: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.'
            }
          },
          {
            id: 2,
            a: 'T-0033',
            b: '整体模具',
            c: 'A公司',
            d: '2019.03.31',
            e: '12500.00元',
            detail: {
              a: 'A公司',
              b: '12334567',
              c: 'T-0033',
              d: '整体模具',
              e: '2019.03.31',
              dd: '已立项',
              f: '12301.00',
              g: '欧元',
              h: '7.0',
              i: '12301.00',
              j: [
                {
                  fileName: '172988图纸',
                  fileId: 'crQhc2flTyetPwbJ'
                }
              ],
              k: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.'
            }
          }
        ]

        this.left.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.list = res.data || [];
          if(this.left.list.length) {

            this.left.activeId = this.left.list[0].id;
            this.currentData = this.left.list[0];
          }
        }, () => this.left.isLoading = false, params, mock)
      },
      handleSelect(item) {

        this.left.activeId = item.id;
        this.currentData = item;
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
</style>