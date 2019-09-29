<template>
  <div class="posFull pdlr10" v-loading="isLoading" style="top: 40px;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：质量检验->外协到货质量检验->录入采购到货检验结果
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 28px;">
      <div class="calc">
        <div class="mgt20 pdlr10">
          <el-table
            :data="tabs.calc.list"
            border
            size="mini"
            style="width: 100%;"
            class="edit-table">
            <el-table-column label="状态" width="88" show-overflow-tooltip>
              <template slot-scope="scope">
                <div :class="{'table-td-red': scope.row.status == '未处置'}">{{scope.row.status}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="aa" label="采购单号" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="bb" label="供应商名称" class-name="notEdit" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cc" label="到货日期" class-name="notEdit" show-overflow-tooltip width="120"></el-table-column>
            <el-table-column prop="dd" label="检验日期" class-name="notEdit" show-overflow-tooltip  width="120"></el-table-column>
            <el-table-column prop="ee" label="模具号" class-name="notEdit" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ff" label="零件号" class-name="notEdit" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="gg" label="外协工序" class-name="notEdit"  width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="hh" label="数量" class-name="notEdit" width="88" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ii" label="检测结果" width="88" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jj" label="异常数量" class-name="notEdit" width="88" show-overflow-tooltip></el-table-column>
            <el-table-column prop="kk" label="异常概况" class-name="notEdit" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理方式" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'llEdit', {}, false)">
                    <div class="ellipsis">
                      {{scope.row.ll}}
                    </div>
                    <el-select
                      v-model="scope.row.ll"
                      placeholder="请选择"
                      :style="{opacity: scope.row.llEdit ? 1 : 0}"
                      @focus="showInput(tabs.calc.list, scope.$index, 'llEdit', {}, false)"
                      @blur="scope.row.llEdit = false">
                      <el-option
                        v-for="item in tabs.calc.filter.result"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="处理说明" class-name="notEdit" min-width="180" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'mmEdit', {}, false)">
                    <div class="emmipsis">{{ scope.row.mm }}</div>
                    <el-input size="mini" v-model="scope.row.mm" @focus="showInput(tabs.calc.list, scope.$index, 'mmEdit', {}, false)" @blur="scope.row.mmEdit = false" :style="{opacity: scope.row.mmEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保 存</el-button>
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
          filter: {
            result: [
              {
                label: '接受',
                value: '1'
              },
              {
                label: '返工',
                value: '2'
              },
              {
                label: '报废',
                value: '3'
              }
            ]
          },
          list: []
        },
        preview: {}
      }
    };
  },
  methods: {
    getData() { //获取采购订单列表

      let params = {

      };
      let mock = [
        {
          status: '未处置',
          aa: 'MR2019-05-04',
          bb: 'A公司',
          cc: '5月7日',
          dd: '5月7日',
          ee: 'M16005',
          ff: '300-1',
          gg: 'L',
          hh: '5',
          ii: '接受',
          jj: '10',
          kk: '查图，尺寸量错',
          ll: '',
          mm: ''
        },
        {
          status: '已处置',
          aa: 'MR2017-08-08',
          bb: 'B公司',
          cc: '5月9日',
          dd: '5月30日',
          ee: 'M8888',
          ff: '400-1',
          gg: 'G',
          hh: '5',
          ii: '接受',
          jj: '10',
          kk: '查图，尺寸量错',
          ll: '',
          mm: ''
        }
      ]

      this.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.isLoading = false;
        this.tabs.calc.list = res.data || [];
      }, () => this.isLoading = false, params, mock)
    },
    save() {

      let params = {

      };
      
      this.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '102');
      }, () => this.isLoading = false, params)
    },
  },
  created() {

    this.getData();
  }
};
</script>

<style scoped lang="scss">
  .table-td-red {
    line-height: 26px;
  }
</style>