<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：今日工序生产
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="tc" style="margin: 5px 0;">
            今日工序生产
          </div>
        </div>
        <div class="list" ref="list" style="top: 52px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.name }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
              </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">工序：<strong>{{ item.name | filterNull }}</strong></p>
                  <p class="flex ellipsis">状态：<span>{{ item.statusText | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">未处理不良：<span>{{ item.rejectsNum | filterNull }}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">当天工序进度：<el-progress :percentage="item | cpercentage('haveJobBookingWorkTime', 'processTotalWorkTime')" color="rgba(0, 255, 0, 1)" style="width: 160px;display: inline-block;"></el-progress></el-col>
              <el-col :span="24" class="tr">
                <router-link :to="`/product/dspwk/${item.name}`">派工</router-link>
                <router-link :to="`/product/npwk/${item.name}`">报工</router-link>
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
          <template #pageName>工序生产情况明细</template>
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
                    <i class="el-icon-lx-edit"></i> {{currentData.name | filterNull}}工序生产情况
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">报工日期：{{ right.page1.jobBookingDate | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">代报工人员：{{ right.page1.jobBookingWorker | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">估工工时合计(H)：{{ right.page1.estimationTotalWorkTime | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">实际工时合计(H)：{{ right.page1.actualTotalWorkTime | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">准时交货率：{{(right.page1.punctualDeliveryNum || 0)/((right.page1.punctualDeliveryNum + right.page1.delayDeliveryNum) || 1)}}%</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">报废率：{{(right.page1.haveDumpingNum || 0)/((right.page1.haveDumpingNum + right.page1.noDumpingNum)  || 1)}}%</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-table
                        :data="right.page1.planMsg"
                        border
                        size="mini"
                        class="content-table mgt10"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="operationalTypeText" label="工作类型" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="operationalStatusText" label="状态" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="工序" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="mouldNo" label="模具号" show-overflow-tooltip></el-table-column>
                        <el-table-column label="零件号" min-width="130" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{scope.row.components | concatString('componentNo')}}
                          </template>
                        </el-table-column>
                        <el-table-column label="数量" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{scope.row.components | concatString('quantity')}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="estimationWorkTime" label="估工工时(H)" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="startDateString" label="开始时间" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requireCompletionDateString" label="要求完成日期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column label="加工人人员" width="120" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{scope.row.people | concatString('name')}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="actualCompletionWorkTime" label="实际加工工时(H)" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="remark" label="备  注" show-overflow-tooltip></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </el-carousel-item>
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 加工人员生产情况
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <p>
                    排序：
                    <el-select style="width: 100px;" v-model="right.page2.sort" @change="getUserList">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="空闲" value="1"></el-option>
                    </el-select>
                  </p>
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(item, index) in right.page2.data" :key="index">
                      <div class="people dflex mgt10">
                        <div class="flex">
                          <p class="ellipsis">
                            <img :src="defaultPeopleImg">
                            <span>人员姓名：{{item.userName}}</span>
                          </p>
                          <p class="mgt10">
                            <strong>已分配任务：</strong>
                          </p>
                          <p class="ellipsis" v-for="(itemc, index) in item.tasks"><span>{{index + 1}}：{{itemc.mouldNo}}，{{itemc.components | concatString('componentNo')}}</span></p>
                        </div>
                        <div style="width: 200px; height: 200px">
                          <ve-pie :data="item.chartData" :colors="chart.colors" :settings="chart.settings" height="400px" width="100px" :legend-visible="false" style="position: relative;top: -140px; margin: auto;"></ve-pie>
                        </div>
                      </div>
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
        defaultImg: require('../../../assets/img/wp.svg'),
        defaultPeopleImg: require('../../../assets/img/people.svg'),
        chart: {
          colors: ['#c0504d','#4f81bd', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
          settings: {
            legendLimit: 0,
            radius: 40,
            labelLine: {
              show: false
            }
          }
        },
        right: {
          page1: {},
          page2: {
            sort: '',
            data: ''
          }
        },
        handle: {
          add: {
            dialogVisible: false,
            data: {},
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: ""
            }
          },
          stop: {
            dialogVisible: false,
            form: {
              reason: "",
              dsc: ""
            }
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        this.getData(this.$utils.CONFIG.api.queryTodayProcess, {}, 'name', loadingKey, this.getDetail);
      },
      getDetail() {

        let params = {
          name: this.currentData.name
        }

        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryTodayProcessByName, (res) => { //详情

          this.right.page1 = res.data || {};
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params);
        this.getUserList();
      },
      getUserList() { //获取加工人员列表

        let params = {
          type: 2,
          name: this.currentData.name,
          assignWorkDate: new Date().Format('yyyy-MM-dd'),
          sorting: this.right.page2.sort ? '_MrUserIdleRecord.isIdle' : ''
        };
        
        this.right.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryProcessorById, (res) =>  {

          this.right.isLoading = false;
          this.right.page2.data = res.data || [];
        }, () => this.right.isLoading = false, params)        
      },
      handleSelect(item) {
      
        this.left.activeId = item.name;
        this.currentData= item;
        this.getDetail();
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
</style>