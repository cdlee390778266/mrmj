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
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
              </div>
              </div>
              <div class="flex">
                <div class="dflex">
                  <p class="flex ellipsis">工序：<span>{{ item.saleOrderOrigin | filterNull }}</span></p>
                  <p class="flex ellipsis">状态：<span>{{ item.mouldNo | filterNull }}</span></p>
                </div>
                <div class="dflex">
                  <p class="ellipsis">未处理不良：<span>{{ item.name | filterNull }}</span></p>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="24">当天工序进度：<el-progress :percentage="50" color="rgba(0, 255, 0, 1)" style="width: 180px;display: inline-block;"></el-progress></el-col>
              <el-col :span="24" class="tr">
                <router-link to="/product/dspwk">派工</router-link>
                <router-link to="/product/npwk">报工</router-link>
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
                    <i class="el-icon-lx-edit"></i> G工序生产情况
                  </div>
                </div>
                <el-scrollbar class="main-content-scorll pdt10">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">报工日期：{{ right.page1.mouldNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">代报工人员：{{ right.page1.saleOrderType | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">估工工时合计(H)：{{ right.page1.customerPoNo | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">实际工时合计(H)：{{ right.page1.name | filterNull }}</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">准时交货率：{{ right.page1.name | filterNull }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-table
                        :data="right.page1.componentOrders"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="componentNo" label="工作类型" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerNo" label="状态" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requirementQuantity" label="工序" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="issuedOrderDate" label="模具号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="requireDeliveryDate" label="零件号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="数量" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="估工工时(H)" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="开始时间" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="要求完成日期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="加工人人员" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="实际加工工时(H)" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="备  注" show-overflow-tooltip></el-table-column>
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
                    <el-select style="width: 100px;" v-model="right.page1.data">
                      <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                    </el-select>
                  </p>
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      <div class="people dflex mgt10">
                        <div class="flex">
                          <p class="ellipsis">
                            <img :src="defaultPeopleImg">
                            <span>人员姓名：E01</span>
                          </p>
                          <p class="mgt10">
                            <strong>已分配任务：</strong>
                          </p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        </div>
                        <div style="width: 100px;"></div>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      <div class="people dflex mgt10">
                        <div class="flex">
                          <p class="ellipsis">
                            <img :src="defaultPeopleImg">
                            <span>人员姓名：E01</span>
                          </p>
                          <p class="mgt10">
                            <strong>已分配任务：</strong>
                          </p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        </div>
                        <div style="width: 100px;"></div>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      <div class="people dflex mgt10">
                        <div class="flex">
                          <p class="ellipsis">
                            <img :src="defaultPeopleImg">
                            <span>人员姓名：E01</span>
                          </p>
                          <p class="mgt10">
                            <strong>已分配任务：</strong>
                          </p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        </div>
                        <div style="width: 100px;"></div>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                      <div class="people dflex mgt10">
                        <div class="flex">
                          <p class="ellipsis">
                            <img :src="defaultPeopleImg">
                            <span>人员姓名：E01</span>
                          </p>
                          <p class="mgt10">
                            <strong>已分配任务：</strong>
                          </p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                          <p class="ellipsis"><span>1：M18480，56/57</span></p>
                        </div>
                        <div style="width: 100px;"></div>
                      </div>
                    </el-col>
                  </el-row>
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
        defaultImg: require('../../../assets/img/wp.svg'),
        defaultPeopleImg: require('../../../assets/img/people.svg'),
        left: {
          list: [{}]
        },
        right: {
          activeIndex: 0,
          list: [
            {
              spList: [
                {
                  date: "2016-05-03",
                  name: "",
                  address: ""
                }
              ],
              enclosureList: [
                {
                  date: "2016-05-03",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                }
              ]
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
          name: '',
          type: '',
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
        }
        if(this.form.text) params.name = this.form.text;

        this.getData(this.$utils.CONFIG.api.queryRequirementDetail, params, 'id', loadingKey);
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
</style>