<template>
  <div v-loading="isLoading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：委外加工->下达采购订单
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
        <div>
          <div class="mgb10">
            <span class="dib">
              采购订单号：{{tabs.calc.form.orderNum | filterNull}}
            </span> 
            <span class="dib mgl20">
              供应商：{{tabs.calc.form.supplier | filterNull}}
            </span>
            <span class="dib mgl20">
              联系人：采购订单号：{{tabs.calc.form.contacts | filterNull}}
            </span>
            <span class="dib mgl20">
              增值税率：{{tabs.calc.form.taxRate | filterNull}}
            </span>
          </div>
          <div class="dflex mgb20">
            <span>技术要求：</span>
            <span class="flex">{{tabs.calc.form.require | filterNull}}</span>
          </div>
          <el-table
            :data="tabs.calc.list"
            border
            size="mini"
            style="width: 100%;"
            class="content-table edit-table">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="aa" label="模具号" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="a" label="零件号" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="b" label="数量" class-name="notEdit"  width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="d" label="单位" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="e" label="工序" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="f" label="要求交货期" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="g" label="实际交货期" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="h" label="未含税单价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="i" label="未含税总价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="j" label="含税总价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="k" label="含税总价" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="l" label="包数" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="m" label="准时包数" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="n" label="合格" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="o" label="修" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="p" label="试用" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="q" label="报废" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="r" label="备注" show-overflow-tooltip align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="preview hide rel" :class="{'show': activeTab == 'preview'}">
				<div class="preview-content">
          <div class="preview-content">

          </div>
          <div class="preview-handle tc">
            <p class="mgt20"><el-button type="primary" style="width: 80px;">打印</el-button></p>
            <p class="mgt10"><el-button type="primary" style="width: 80px;">导出PDF</el-button></p>
          </div>
				</div>
			</div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="back">返 回</el-button>
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
      isLoading: false,
      tabs: {
        calc: {
          form: {
            type: ''
          },
          list: []
        },
        preview: {}
      }
    };
  },
  methods: {
    getData() {

      let params = {

      };
      let mock = [
       {
        aa: 'M1845TF',
        a: '301',
        b: '55',
        c: '10',
        d: '孔',
        e: 'EDB',
        f: '2019/8/26',
        g: '2019/9/26',
        h: '10',
        i: '125',
        j: '12',
        k: '130',
        l: '1',
        m: '5',
        n: '6',
        o: '1',
        p: '2',
        q: '9',
        r: '测试'
       },
       {
        aa: 'FTEDS108',
        a: '01',
        b: '5',
        c: '101',
        d: '孔',
        e: 'EDB',
        f: '2019/8/01',
        g: '2019/9/10',
        h: '1',
        i: '15',
        j: '1.1',
        k: '20',
        l: '2',
        m: '5',
        n: '7',
        o: '1',
        p: '2',
        q: '9',
        r: '测试'
       }
      ]
      
      this.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.list = res.data || [];
      }, () => this.isLoading = false, params, mock)
    }
  },
  created() {

    this.getData();
  }
};
</script>