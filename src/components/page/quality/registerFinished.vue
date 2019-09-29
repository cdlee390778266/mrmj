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
            <el-table-column label="模具号" width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'ddEdit')">
                    <div class="ellipsis">{{ scope.row.dd }}</div>
                    <el-autocomplete
                      class="inline-input"
                      v-model="scope.row.dd"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.dd, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入内容"
                      @focus="showInput(tabs.calc.list, scope.$index, 'ddEdit')"
                      @blur="scope.row.ddEdit = false"
                      :style="{opacity: scope.row.ddEdit ? 1 : 0}"
                    ></el-autocomplete>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="零件号" width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'eeEdit')">
                    <div class="ellipsis">{{ scope.row.ee }}</div>
                    <el-autocomplete
                      class="inline-input"
                      v-model="scope.row.ee"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.ee, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入内容"
                      @focus="showInput(tabs.calc.list, scope.$index, 'eeEdit')"
                      @blur="scope.row.eeEdit = false"
                      :style="{opacity: scope.row.eeEdit ? 1 : 0}"
                    ></el-autocomplete>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="工序"  width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'ffEdit')">
                    <div class="ellipsis">{{ scope.row.ff }}</div>
                    <el-autocomplete
                      class="inline-input"
                      v-model="scope.row.ff"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, tabs.calc.filter.ff, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入内容"
                      @focus="showInput(tabs.calc.list, scope.$index, 'ffEdit')"
                      @blur="scope.row.ffEdit = false"
                      :style="{opacity: scope.row.ffEdit ? 1 : 0}"
                    ></el-autocomplete>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="检验日期" show-overflow-tooltip align="center" width="120">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'ccEdit', {})">
                    <div class="ellipsis tc">{{ scope.row.cc }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.cc"
                      @focus="showInput(tabs.calc.list, scope.$index, 'ccEdit', {})"
                      @blur="scope.row.ccEdit = false"
                      :style="{opacity: scope.row.ccEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'ggEdit', {})">
                    <div class="ellipsis">{{ scope.row.gg }}</div>
                    <el-input size="mini" v-model="scope.row.gg" @focus="showInput(tabs.calc.list, scope.$index, 'ggEdit', {}, false)" @blur="scope.row.ggEdit = false" :style="{opacity: scope.row.ggEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="检测结果"
              width="120"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'hhEdit')">
                    <div class="ellipsis">
                      {{scope.row.hh}}
                    </div>
                    <el-select
                      v-model="scope.row.hh"
                      placeholder="请选择"
                      :style="{opacity: scope.row.hhEdit ? 1 : 0}"
                      @focus="showInput(tabs.calc.list, scope.$index, 'hhEdit')"
                      @blur="scope.row.hhEdit = false">
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
            <el-table-column label="异常数量" width="120" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'iiEdit', {})">
                    <div class="ellipsis">{{ scope.row.ii }}</div>
                    <el-input size="mini" v-model="scope.row.ii" @focus="showInput(tabs.calc.list, scope.$index, 'iiEdit', {}, false)" @blur="scope.row.iiEdit = false" :style="{opacity: scope.row.iiEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="异常概况" min-width="180" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'jjEdit')">
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
            aa: [
              {
                codeName: 'M2019-08-01',
                supplier: 'A公司'
              },
              {
                codeName: 'M2019-09-09',
                supplier: 'B公司'
              },
              {
                codeName: 'M2019-01-01',
                supplier: 'C公司'
              },
              {
                codeName: 'M2019-06-23',
                supplier: 'D公司'
              }
            ],
            dd: [
              {
                codeName: 'M1'
              },
              {
                codeName: 'M0012T'
              },
              {
                codeName: 'M100'
              },
              {
                codeName: 'M6'
              }
            ],
            ee: [
              {
                codeName: 'LL99'
              },
              {
                codeName: 'L2'
              },
              {
                codeName: 'L1036G'
              },
              {
                codeName: 'L668I'
              }
            ],
            ff: [
              {
                codeName: 'A'
              },
              {
                codeName: 'G'
              },
              {
                codeName: 'K'
              },
              {
                codeName: 'PP'
              }
            ],
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
          list: [{}]
        },
        preview: {}
      }
    };
  },
  methods: {
    getList() {

      this.getList(this.$utils.CONFIG.api.stuff, this.tabs.calc.filter, 'stuff'); //获取采购单号列表
      this.getList(this.$utils.CONFIG.api.process, this.tabs.calc.filter, 'process'); //获取模具号列表
      this.getList(this.$utils.CONFIG.api.sysCode, this.tabs.calc.filter, 'sysCode', {otherWhereClause: "codeType = 'processContent'"}); //获取零件号列表
      this.getList(this.$utils.CONFIG.api.sysCode, this.tabs.calc.filter, 'sysCode', {otherWhereClause: "codeType = 'processContent'"}); //获取外协工序列表
    },
    save() {

      let params = {

      };
      
      this.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '102');
        this.back();
      }, () => this.isLoading = false, params)
    },
  },
  created() {

    
  }
};
</script>