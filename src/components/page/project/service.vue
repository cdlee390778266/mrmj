<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：售后反馈
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            待处理投诉：
            <el-input v-model="form.text" style="width: 190px" prefix-icon="el-icon-search" @focus="isShowList = false" />
          </div>
        </div>
        <div class="list" style="top: 64px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="50" class="mgr10 mgt10" />
              </div>
              <div class="flex">
                <p>{{ item.a | filterNull }}</p>
                <p>投诉订单：{{ item.b | filterNull }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">反馈类型：{{ item.c | filterNull }}</el-col>
              <el-col :span="12">日期：{{ item.d | filterNull }}</el-col>
              <el-col :span="24">状态：{{ item.e | filterNull }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="$router.push(`/project/reply/${item.id}`)">回复</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="selectType(item)"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="refresh" :haveCarousel="true">
          <template #pageName>客户投诉明细</template>
          <el-carousel
            direction="vertical"
            :autoplay="false"
            :loop="false"
            trigger="click"
            ref="carousel">
              <el-carousel-item>
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 客诉信息
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><strong>客诉信息</strong></el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：{{right.page1.a | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：{{right.page1.b | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：{{right.page1.cc | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：{{right.page1.c | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：{{right.page1.d | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{right.page1.e | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">投诉单号：{{right.page1.f | filterNull}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">投诉附件：</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page1.g"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column prop="fileName" label="资料名称"></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
                            <a href="javascript:void(0);" style="color: #3375AB;" @click="down(scope.row.fileId)">下载</a>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <div v-for="(item, index) in right.page1.h" :key="index">
                    <el-divider class="mgtb20"></el-divider>
                    <el-row>
                      <el-col :span="24"><strong>客诉零件</strong></el-col>
                      <el-col :span="24">
                        <span>零件号：{{item.a | filterNull}}</span>
                        <span class="mgl20">投诉类型：{{item.b | filterNull}}</span>
                        <span class="mgl20">存在问题：{{item.c | filterNull}}</span>
                      </el-col>
                      <el-col :span="24">
                        <div class="dflex">
                          <div>情况说明：</div>
                          <div class="flex">
                            {{item.d | filterNull}}
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-scrollbar>
              </el-carousel-item>
              <el-carousel-item>
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 客诉涉及订单信息
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{right.page2.a | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{right.page2.b | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：{{right.page2.c | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币：{{right.page2.d | filterNull}}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币总价：{{right.page2.e | filterNull}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">订单零件列表</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page2.components"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      > 
                        <el-table-column type="index" width="50" label="序号"></el-table-column>
                        <el-table-column prop="a" label="零件号" width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="b" label="客户编号" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="c" label="数量" width="88" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="d" label="下单日期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="e" label="要求交期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="f" label="实际交期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="g" label="说明" min-width="120" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">订单附件</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.page2.g"
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
                  <el-row>
                    <el-col :span="24">
                      <span>订单说明：</span>
                    </el-col>
                    <el-col :span="24">
                      {{right.page2.h | filterNull}}
                    </el-col>
                  </el-row>
                </el-scrollbar>
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
        defaultImg: require('../../../assets/img/icon1.png'),
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //售后反馈列表

        let params = {
          parameter: this.form.parameter || '',
          type: this.filter.selectedValue,
          sorting: '',
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        }
        
        this.getData(this.$utils.CONFIG.api.queryUnfinishedProjectList, params, 'mrSaleOrderId', loadingKey, this.getDetail);
      },
      getDetail() {

        let params = {

        };

        let mock = {
          a: 'A公司',
          b: '张二旺',
          cc: '采购经理',
          c: '13684054888',
          d: '26895778@qq.com',
          e: '12345678',
          f: '1231231',
          g: [
            {
              fileName: '172988图纸',
              fileId: 'crQhc2flTyetPwbJ'
            }
          ],
          h: [
            {
              a: '406',
              b: '投诉',
              c: '质量',
              d: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.',
            },
            {
              a: '588',
              b: '投诉',
              c: '质量',
              d: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.',
            }
          ]
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
          this.right.page1.a = this.currentData.a;
        }, () => this.right.isLoading = false, params, mock)

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page2 = res.data || {};
        }, () => this.right.isLoading = false, params, mock1)
      },
      handleSelect(item) {

        this.left.activeId = item.id;
        this.currentData = item;
        this.getDetail();
      },
      refresh() {}
    },
    created() {

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