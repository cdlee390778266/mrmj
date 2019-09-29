<template>
  <div class="posFull pdlr10" v-loading="isLoading" style="top: 40px;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：质量检验->工序完工质量检验->录入工序完工检验结果
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
            <el-table-column prop="aa" label="模具号" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bb" label="零件号" width="120" class-name="notEdit" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cc" label="工序"  width="120" class-name="notEdit" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dd" label="检验日期" show-overflow-tooltip align="center" width="120" class-name="notEdit"></el-table-column>
            <el-table-column prop="ee" label="数量" width="120" class-name="notEdit" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ff" label="检测结果" width="120" class-name="notEdit" show-overflow-tooltip></el-table-column>
            <el-table-column prop="gg" label="异常数量" width="120" class-name="notEdit" show-overflow-tooltip></el-table-column>
            <el-table-column prop="hh" label="异常概况" min-width="180" class-name="notEdit" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理方式" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'iiEdit', {}, false)">
                    <div class="ellipsis">
                      {{scope.row.ii}}
                    </div>
                    <el-select
                      v-model="scope.row.ii"
                      placeholder="请选择"
                      :style="{opacity: scope.row.iiEdit ? 1 : 0}"
                      @focus="showInput(tabs.calc.list, scope.$index, 'iiEdit', {}, false)"
                      @blur="scope.row.iiEdit = false">
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
                  <div @click="showInput(tabs.calc.list, scope.$index, 'jjEdit', {}, false)">
                    <div class="ejjipsis">{{ scope.row.jj }}</div>
                    <el-input size="mini" v-model="scope.row.jj" @focus="showInput(tabs.calc.list, scope.$index, 'jjEdit', {}, false)" @blur="scope.row.jjEdit = false" :style="{opacity: scope.row.jjEdit ? 1 : 0}"/>
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
    getData() { //获取列表

      let params = {

      };
      let mock = [
        {
          status: '未处置',
          aa: 'M16005',
          bb: '300-1',
          cc: 'L',
          dd: '5月7日',
          ee: '5',
          ff: '接受',
          gg: '1',
          hh: '查图，尺寸量错'
        },
        {
          status: '已处置',
          aa: 'M9995',
          bb: '301',
          cc: 'K',
          dd: '5月7日',
          ee: '10',
          ff: '返工',
          gg: '12',
          hh: '圆弧接深'
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