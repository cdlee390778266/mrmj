<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：跟踪生产进度->制定作业计划
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="">
      <span>作业计划日期：</span>
      <el-date-picker
        v-model="right.page1.date"
        type="date"
        size="mini"
        placeholder="年/月/日">
      </el-date-picker>
    </div>
    <div class="v-tabs mgt10">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">第1步 选择作业零件</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >第2步 制定工序作业计划</span>
    </div>
    <div class="detail-main" style="top: 153px;">
      <div class="calc hide mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="mgt20 pdlr10">
          <div class="mgb10 dflex">
            <div>排序：</div>
            <div class="flex">
              <el-radio-group v-model="right.page1">
                <el-radio :label="3" class="mgb5">出货日期</el-radio>
                <el-radio :label="6" class="mgb5">下图日期</el-radio>
                <el-radio :label="9" class="mgb5">要求交期</el-radio>
                <el-radio :label="9" class="mgb5">交期剩余(天)</el-radio>
                <el-radio :label="9" class="mgb5">剩余工时</el-radio>
                <el-radio :label="9" class="mgb5">M工序</el-radio>
                <el-radio :label="9" class="mgb5">G工序</el-radio>
                <el-radio :label="9" class="mgb5">EDM工序</el-radio>
                <el-radio :label="9" class="mgb5">CNC工序</el-radio>
                <el-radio :label="9" class="mgb5">W/C工序</el-radio>
              </el-radio-group>
            </div>
          </div>
          <p>
            开展生产零件选择列表（当前尚未完成工序的零件，默认继续开展生产，自动勾选）
          </p>
          <div class="posFull" style="top: 90px; bottom: 74px;">
            <el-table
              :data="tabs.calc.enclosureList"
              border
              size="mini"
              style="width: 100%;"
            >
              <el-table-column prop="name" label="模具号"></el-table-column>
              <el-table-column prop="name" label="类型"></el-table-column>
              <el-table-column prop="name" label="客户"></el-table-column>
              <el-table-column prop="name" label="状态"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <router-link to="/product/editOrder">编辑</router-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="detail-footer" style="border-top: none;">
            <div class="dflex" style="align-items: center;">
              <div class="pdl20">所选零件工时统计：</div>
              <div class="flex pdlr10">
                <table class="mrmj-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.name}}</th>
                      <th>66</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>状态</td>
                      <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
                      <th>66</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
				<div class="preview-content">
          <div class="content">
            <h5 class="content-left-title">选择工序</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div class="list">
                <div class="list-body">
                  <div class="dflex pd10" :class="{active: left.activeId == index}" style="align-items: center;" v-for="(item, index) in [{},{}]" :key="index" @click="handleSelect(item, index)">
                    <img :src="defaultImg" width="32">
                    <div class="flex pdl10">
                      工序：G
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="content-right-title">制定所选工序作业计划</h5>
            <div class="content-right">
              <h3 class="tc pdtb10">工序G作业计划</h3>
              <div>
                <img :src="img1" width="22">
                <img :src="img2" width="22" class="mgl10">
                <img :src="img3" width="22" class="mgl10">
                <span class="mgl20">作业计划调整（选择某条记录，点击移出、上移、下移按钮进行操作）</span>
              </div>
              <div class="posFull" style="top: 90px; bottom: 74px;">
                <el-table
                  :data="tabs.calc.enclosureList"
                  border
                  size="mini"
                  style="width: 100%;"
                >
                  <el-table-column prop="name" label="模具号"></el-table-column>
                  <el-table-column prop="name" label="类型"></el-table-column>
                  <el-table-column prop="name" label="客户"></el-table-column>
                  <el-table-column prop="name" label="状态"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <router-link to="/product/editOrder">编辑</router-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="detail-footer" style="border-top: none;">
                <div class="dflex" style="align-items: center;">
                  <div class="pdlr10">模具号：18473</div>
                  <div class="pdlr10">零件号：100-14/15</div>
                  <div class="pdl20">当前状态：</div>
                  <div class="flex pdlr10">
                    <table class="mrmj-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.name}}</th>
                          <th>66</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>状态</td>
                          <td v-for="(itemc, index) in right.page1.data" :key="index">{{itemc.estimationWorkTime}}</td>
                          <th>66</th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
				</div>
			</div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary">保 存</el-button>
      <el-button type="primary">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        activeTab: "calc",
        defaultImg: require('../../../assets/img/wp.svg'),
        img1: require('../../../assets/img/img2.svg'),
        img2: require('../../../assets/img/img3.svg'),
        img3: require('../../../assets/img/img4.svg'),
        tabs: {
          calc: {
            form: {
              type: ''
            },
            enclosureList: [
              {
                date: "2016-05-03",
                name: "王小虎"
              },
              {
                date: "2016-05-02",
                name: "王小虎"
              },
              {
                date: "2016-05-04",
                name: "王小虎"
              },
              {
                date: "2016-05-01",
                name: "王小虎"
              }
            ]
          },
          preview: {}
        }
      };
    },
    created() {},
    methods: {}
  };
</script>


<style scoped lang="scss">
	.v-tab {
    width: 50%;
  }
  .content {
    position: absolute;
    top: 20px;
    right: 0;
    bottom: 0px;
    left: 0;
    height: auto;
    visibility: visible;
    .content-left-title {
      position: absolute;
      top: 0px;
      left: 10px;
      font-weight: normal;
      font-size: 14px;
      background: #fff;
      z-index: 8;
    }
    .content-left {
      position: absolute;
      top: 10px;
      bottom: 0;
      left: 0;
      width: 210px;
      overflow: auto;
      border: 1px solid #ddd;
      .list {
        .list-head {
          position: absolute;
          top: 60px;
          right: 0;
          left: 0;
          background: rgba(228, 228, 228, 1);
          & > div {
            border-right: 1px solid #ddd;
          }
        }
        .list-body {
          position: absolute;
          top: 15px;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: auto;
          .dflex{
            cursor: pointer;
            &:hover, &.active {
              background: #e8e8e8;
            }
          }
          .flex {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .content-right-title {
      position: absolute;
      top: 0px;
      left: 230px;
      font-weight: normal;
      font-size: 14px;
      background: #fff;
      z-index: 8;
    }
    .content-right {
      position: absolute;
      top: 10px;
      bottom: 0;
      left: 220px;
      right: 0;
      padding: 10px;
      overflow: auto;
      border: 1px solid #ddd;
      p {
        margin-bottom: 10px;
      }
    }
  }
</style>
