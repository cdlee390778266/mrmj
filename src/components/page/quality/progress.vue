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
      <div class="main-left">
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
                <p>{{ item.id }}</p>
                <p>投诉订单：{{ item.id }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">反馈类型：{{ item.type }}</el-col>
              <el-col :span="12">日期：666</el-col>
              <el-col :span="24">状态：{{ item.type }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="$router.push('/sale/serviceEdit/edit/11')">回复</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right">
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
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"><strong>客诉信息</strong></el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：XXXXXX公司</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：12312323123</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：REQ1901</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：模具零件</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：已报价</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：12301.00</el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">投诉单号：欧元</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">投诉附件：</el-col>
                    <el-col :span="24">
                      <el-table
                        :data="right.list[right.activeIndex].spList"
                        border
                        size="mini"
                        class="content-table"
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="date" label="资料名称"></el-table-column>
                        <el-table-column width="100" label="操作">
                          <template slot-scope="scope">
                            <a href style="color: #3375AB;">下载</a>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <div>
                    <el-divider class="mgtb20"></el-divider>
                    <el-row>
                      <el-col :span="24"><strong>客诉零件</strong></el-col>
                      <el-col :span="24">
                        <span>零件号：406</span>
                        <span class="mgl10">投诉类型：投诉</span>
                        <span class="mgl10">存在问题：质量</span>
                      </el-col>
                      <el-col :span="24">
                        <div class="dflex">
                          <div>情况说明：</div>
                          <div class="flex">
                            这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24"><strong>内部处置信息</strong></el-col>
                      <el-col :span="24">
                        <span>责任部门：XXXX部</span>
                        <span class="mgl10">投诉类别：外观</span>
                        <span class="mgl10">检测人员：ZZZZ</span>
                      </el-col>
                      <el-col :span="24">
                        <div class="dflex">
                          <div>情解决改善方案：</div>
                          <div class="flex">
                            这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                          </div>
                        </div>
                        <div>改善效果：已改善</div>
                      </el-col>
                    </el-row>
                  </div>
                  <div>
                    <el-divider class="mgtb20"></el-divider>
                    <el-row>
                      <el-col :span="24"><strong>客诉零件</strong></el-col>
                      <el-col :span="24">
                        <span>零件号：406</span>
                        <span class="mgl10">投诉类型：投诉</span>
                        <span class="mgl10">存在问题：质量</span>
                      </el-col>
                      <el-col :span="24">
                        <div class="dflex">
                          <div>情况说明：</div>
                          <div class="flex">
                            这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24"><strong>内部处置信息</strong></el-col>
                      <el-col :span="24">
                        <span>责任部门：XXXX部</span>
                        <span class="mgl10">投诉类别：外观</span>
                        <span class="mgl10">检测人员：ZZZZ</span>
                      </el-col>
                      <el-col :span="24">
                        <div class="dflex">
                          <div>情解决改善方案：</div>
                          <div class="flex">
                            这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                          </div>
                        </div>
                        <div>改善效果：已改善</div>
                      </el-col>
                    </el-row>
                  </div>
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
        left: {
          activeId: 125944,
          list: [
            {
              name: 'dddddddd',
              id: '125944',
              type: '模具零件',
              startDate: '2019.01.08',
              endDate: '2019.03.09'
            },
            {
              name: 'dddddddd',
              id: '1259445',
              type: '模具零件',
              startDate: '2019.01.08',
              endDate: '2019.03.09'
            }
          ]
        },
        right: {
          activeIndex: 0,
          list: [
            {
              spList: [
                {
                  date: "172988",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-04",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-01",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-03",
                  name: "",
                  address: ""
                }
              ],
              enclosureList: [
                {
                  date: "172988",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-04",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-01",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-03",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                }
              ]
            }
          ]
        }
      };
    },
    methods: {
      handlePictureCardPreview(file) {
        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
      },
      handleSelect(item) {
        this.left.activeId = item.id;
      },
      del(index, row) {
        console.log(index, row);
      },
      refresh() {}
    },
    created() {}
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