<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：待立项订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="left.isLoading">
      <div class="main-left">
        <div class="main-left-search pd10">
          <div class="mgb10">
            待立项订单：
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
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrSaleOrderId }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img :src="item.img ? `${$utils.CONFIG.api.image}?fileId=${item.img}` : defaultImg" width="40" class="mgr10 mgt10" />
              </div>
              <div class="flex ellipsis">
                <p class="ellipsis">
                  <span>模具号：{{ item.mouldNo | filterNull }}</span>
                  <span class="mgl10">订单类型:<span :title="item.saleOrderTypeText | filterNull">{{ item.saleOrderTypeText | filterNull }}</span></span>
                </p>
                <p class="ellipsis">客户：{{ item.name | filterNull }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12" class="ellipsis">交期：{{ item.completionDateString | filterNull }}</el-col>
              <el-col :span="12" class="ellipsis" :title="item.saleTotalPrice | filterNull">订单价格：{{ item.saleTotalPrice | filterNull }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="$router.push(`/project/approval/${item.mrSaleOrderId}`)">立项</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true; getLeftList();"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right">
        <page-wrapper @change="refresh">
          <template #pageName>订单明细</template>
          <div>
            <div class="main-content-title">
              <div>
                <i class="el-icon-lx-edit"></i> 订单{{currentData.mrSaleOrderId | filterNull}}基础信息
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：{{currentData.detail.name | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{currentData.customerPoNo | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{currentData.mouldNo | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{currentData.saleOrderTypeText | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">要求交期号：{{currentData.completionDateString | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单状态：{{currentData.detail.dd | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：{{currentData.detail.f | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币种类：{{currentData.detail.g | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">汇率：{{currentData.detail.h | filterNull}}</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币总价(RMB)：{{currentData.detail.i | filterNull}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">订单附件</el-col>
                <el-col :span="24">
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
              <el-row>
                <el-col :span="24">
                  <span>订单说明：</span>
                </el-col>
                <el-col :span="24">
                  {{currentData.detail.k | filterNull}}
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
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
      getLeftList(loadingKey = 'isLoading') { //获取采购订单列表

        let params = {
          parameter: this.form.parameter || '',
          type: this.filter.selectedValue,
          sorting: '',
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        }
        
        this.getData(this.$utils.CONFIG.api.queryUnfinishedProjectList, params, 'mrSaleOrderId', loadingKey, this.getDetail);
      },
      handleSelect(item) {

        this.left.activeId = item.mrSaleOrderId;
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