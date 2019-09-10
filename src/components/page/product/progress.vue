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
                <a href="javascript: void(0);" v-if="item.orderStatusText == '未开始'" @click="handle.add.dialogVisible = true">编辑</a>
                <a href="javascript: void(0);" v-if="item.orderStatusText == '未开始'" @click="handle.stop.dialogVisible = true">取消</a>
                <router-link to="/sale/detail" v-if="item.orderStatusText != '未开始'">暂停</router-link>
                <a href="javascript: void(0);" v-if="item.orderStatusText != '未开始'" @click="handle.order.dialogVisible = true">终止</a>
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
                      <el-button type="primary">查看相关销售订单</el-button>
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </el-carousel-item>
              <el-carousel-item >
                <div class="main-content-title">
                  <div>
                    <i class="el-icon-lx-edit"></i> 不合格品情况
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  
                </el-scrollbar>
              </el-carousel-item>
            </el-carousel>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="生产订单信息查看修改" :visible.sync="handle.add.dialogVisible">
      <el-form :model="handle.add.form" label-width="100px">
        <el-row class="pdtb10 borb">
          <el-col :span="8">模具号：{{handle.add.data.mouldNo}}</el-col>
          <el-col :span="8">客户：{{handle.add.data.name}}</el-col>
          <el-col :span="8">交期：{{handle.add.data.deliveryDate}}</el-col>
        </el-row>
        <div class="dialog-content pdt10">
          <div class="mgb10 borb" v-for="(item, index) in handle.add.data" :key="index">
            <el-row>
              <el-col :span="24" class="mgb10">
                <span class="mgr40">序号：1</span>
                <span class="mgr40">零件号码：407/408</span>
              </el-col>
              <el-col :span="24" class="mgb10">
                <span class="mgr40">版本：
                  <el-select style="width: 100px;">
                    <el-option v-for="(item, index) in $dict.countryList" :key="index" :label="item.name" :value="item.mrCountryId"></el-option>
                  </el-select>
                </span>
                <span>材料：1.2343ESU</span>
              </el-col>
            </el-row>
            <div>
              <p>工序及估工：</p>
              <el-table :data="handle.add.form.detailList"  border size="mini" style="width: 100%">
                <el-table-column prop="date" label="零件号" width="100"></el-table-column>
                <el-table-column prop="name" label="数量" width="88"></el-table-column>
                <el-table-column prop="address" label="要求交期"></el-table-column>
                <el-table-column prop="address" label="说明"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.add.dialogVisible = false">保 存</el-button>
        <el-button @click="handle.add.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="终止原因" :visible.sync="handle.stop.dialogVisible">
      <el-form :model="handle.stop.form" label-width="100px">
        <el-form-item label="需求终止原因" class="mgt20">
          <el-input v-model="handle.stop.form.reason"></el-input>
        </el-form-item>
        <el-form-item label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.stop.form.dsc" class="v-textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.stop.dialogVisible = false">确 定</el-button>
        <el-button @click="handle.stop.dialogVisible = false">取 消</el-button>
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
          add: {
            dialogVisible: false,
            data: {},
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: "",
              detailList: [
                {
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                }
              ],
              enclosureList: [
                {
                  date: "2016-05-01",
                  name: "王小虎"
                }
              ]
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
      handlePictureCardPreview(file) {
        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) { //合并
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
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
  .el-row {
    margin-bottom: 20px;
  }
  .main-left-search {
    button {
      width: 130px;
    }
  }
</style>