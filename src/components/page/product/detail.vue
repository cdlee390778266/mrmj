<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：生产订单跟踪->查看当前全部订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="v-tabs">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">生产订单</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >生产计划</span>
    </div>
    <div class="detail-main">
      <div class="calc hide bor mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="mgt20 pdlr10">
          <p class="mgb10">
            筛选条件： 
            <el-checkbox-group v-model="tabs.calc.form.type" style="display: inline-block;">
              <el-checkbox label="草稿"></el-checkbox>
              <el-checkbox label="未开始"></el-checkbox>
              <el-checkbox label="已开始"></el-checkbox>
            </el-checkbox-group>
          </p>
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
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
				<div class="preview-content">

				</div>
			</div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary">返 回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      activeTab: "calc",
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
	
</style>
