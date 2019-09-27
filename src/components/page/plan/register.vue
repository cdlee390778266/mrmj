<template>
  <div class="posFull pdlr10" v-loading="isLoading" style="top: 40px;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：委外加工->到货登记
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 28px;">
      <div class="calc">
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
            :data="tabs.calc.list"
            border
            size="mini"
            style="width: 100%;"
            class="content-table edit-table">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="aa" label="模具号" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="a" label="零件号" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="b" label="零件数量" class-name="notEdit"  width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="c" label="加工数量" class-name="notEdit" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="d" label="单位" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="e" label="工序" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="f" label="要求交货期" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="到货日期" show-overflow-tooltip align="center" width="120">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'ggEdit', {}, false)">
                    <div class="ellipsis tc">{{ scope.row.gg }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.gg"
                      @focus="showInput(tabs.calc.list, scope.$index, 'ggEdit', {}, false)"
                      @blur="scope.row.ggEdit = false"
                      :style="{opacity: scope.row.ggEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="包数" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'hhEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.hh }}</div>
                    <el-input size="mini" v-model="scope.row.hh" @focus="showInput(tabs.calc.list, scope.$index, 'hhEdit', {}, false)" @blur="scope.row.hhEdit = false" :style="{opacity: scope.row.hhEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="准时包数" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'iiEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.ii }}</div>
                    <el-input size="mini" v-model="scope.row.ii" @focus="showInput(tabs.calc.list, scope.$index, 'iiEdit', {}, false)" @blur="scope.row.iiEdit = false" :style="{opacity: scope.row.iiEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="合格" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'jjEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.jj }}</div>
                    <el-input size="mini" v-model="scope.row.jj" @focus="showInput(tabs.calc.list, scope.$index, 'jjEdit', {}, false)" @blur="scope.row.jjEdit = false" :style="{opacity: scope.row.jjEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="修" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'kkEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.kk }}</div>
                    <el-input size="mini" v-model="scope.row.kk" @focus="showInput(tabs.calc.list, scope.$index, 'kkEdit', {}, false)" @blur="scope.row.kkEdit = false" :style="{opacity: scope.row.kkEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="试用" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'llEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.ll }}</div>
                    <el-input size="mini" v-model="scope.row.ll" @focus="showInput(tabs.calc.list, scope.$index, 'llEdit', {}, false)" @blur="scope.row.llEdit = false" :style="{opacity: scope.row.llEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="报废" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'mmEdit', {}, false)">
                    <div class="emmipsis">{{ scope.row.mm }}</div>
                    <el-input size="mini" v-model="scope.row.mm" @focus="showInput(tabs.calc.list, scope.$index, 'mmEdit', {}, false)" @blur="scope.row.mmEdit = false" :style="{opacity: scope.row.mmEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(tabs.calc.list, scope.$index, 'nnEdit', {}, false)">
                    <div class="ennipsis">{{ scope.row.nn }}</div>
                    <el-input size="mini" v-model="scope.row.nn" @focus="showInput(tabs.calc.list, scope.$index, 'nnEdit', {}, false)" @blur="scope.row.nnEdit = false" :style="{opacity: scope.row.nnEdit ? 1 : 0}"/>
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
        gg: '',
        hh: '',
        ii: '',
        jj: '',
        kk: '',
        ll: '',
        mm: '',
        nn: ''
       },
       {
        aa: 'M1845TF1',
        a: '301/T102',
        b: '1',
        c: '2',
        d: '个',
        e: 'EDB',
        f: '2019/8/25',
        gg: '',
        hh: '',
        ii: '',
        jj: '',
        kk: '',
        ll: '',
        mm: '',
        nn: ''
       },
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
        this.back();
      }, () => this.isLoading = false, params)
    },
  },
  created() {

    this.getData();
  }
};
</script>


<style scoped lang="scss">
	
</style>
