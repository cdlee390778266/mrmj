<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：
委外加工->到货登记
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 78px;">
      <div class="calc mgl20">
        <div class="mgt20 pdlr10">
          <div class="mgb10">
             <span>采购订单号：MR2018-09-10</span>
             <span class="mgl20">供应商：asdfasdfasdfasdf</span>
             <span class="mgl20">联系人：asdfasdf</span>
             <span class="mgl20">增值税率：7%</span>
          </div>
          <div class="mgb5">
            录入到货零件的合格数量等信息，确认零件到货
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
            <el-table-column prop="name" label="单位"></el-table-column>
            <el-table-column prop="name" label="工序"></el-table-column>
            <el-table-column prop="name" label="要求交货期"></el-table-column>
            <el-table-column prop="name" label="到货日期"></el-table-column>
            <el-table-column prop="name" label="包数"></el-table-column>
            <el-table-column prop="name" label="准时包数"></el-table-column>
            <el-table-column prop="name" label="合格"></el-table-column>
            <el-table-column prop="name" label="修"></el-table-column>
            <el-table-column prop="name" label="试用"></el-table-column>
            <el-table-column prop="name" label="报废"></el-table-column>
            <el-table-column prop="name" label="备注"></el-table-column>
          </el-table>
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
