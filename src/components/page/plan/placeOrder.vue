<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：
委外加工->下达采购订单
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="v-tabs">
      <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">编辑订单</span>
      <span
        class="v-tab"
        :class="{'active': activeTab == 'preview'}"
        @click="activeTab = 'preview'"
      >订单预览</span>
    </div>
    <div class="detail-main">
      <div class="calc hide mgt20 mgl20" :class="{'show': activeTab == 'calc'}">
        <div class="mgt20 pdlr10">
          <div class="mgb10">
            <span class="dib">
              采购订单：
              <el-input v-model="currentData" style="width: 100px" />
            </span> 
            <span class="dib mgl20">
              供应商：
              <el-select style="width: 100px;" v-model="currentData">
                <el-option v-for="(itemc, index) in currentData" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
              </el-select>
            </span>
            <span class="dib mgl20">
              联系人：
              <el-select style="width: 100px;" v-model="currentData">
                <el-option v-for="(itemc, index) in currentData" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
              </el-select>
            </span>
            <span class="dib mgl20">
              增值税率：
              <el-select style="width: 100px;" v-model="currentData">
                <el-option v-for="(itemc, index) in currentData" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
              </el-select>
            </span>
          </div>
          <el-table
            :data="tabs.calc.enclosureList"
            border
            size="mini"
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="模具号"></el-table-column>
            <el-table-column prop="name" label="零件号"></el-table-column>
            <el-table-column prop="name" label="零件数量"></el-table-column>
            <el-table-column prop="name" label="加工数量"></el-table-column>
            <el-table-column prop="name" label="加工单位"></el-table-column>
            <el-table-column prop="name" label="工序"></el-table-column>
            <el-table-column prop="name" label="要求交货期"></el-table-column>
            <el-table-column prop="name" label="未含税单价"></el-table-column>
            <el-table-column prop="name" label="未含税总价"></el-table-column>
            <el-table-column prop="name" label="备注"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
				<div class="preview-content">

				</div>
			</div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary">下达采购订单</el-button>
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
