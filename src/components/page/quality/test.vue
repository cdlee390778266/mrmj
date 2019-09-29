<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：质量检验
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="left.isLoading">
      <div class="main-left" style="width: 148px;">
        <div class="list" ref="list" style="top: 0px;">
          <div class="list-item pd10" :class="{ active: left.activeId == item.key }" v-for="item in left.tabs" :key="item.key" @click="handleSelect(item)">
            <div class="dflex" style="align-items: center;">
              <div>
                <img :src="item.icon" width="32">
              </div>
              <div class="flex"><span class="mgl5">{{item.name}}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="refresh" :hidePageName="true">
          <div v-show="left.activeId == left.tabs[0].key">
            <div class="main-content-title">
              <div>
                <img :src="currentData.icon" width="22px" style="position: relative;top: 5px;"> {{currentData.name}}
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24" class="mgb10 mgt10">
                  <div>
                    <el-button type="primary" @click="$router.push('/quality/registerArrival')">质量检验</el-button>
                  </div>
                  <div class="mgt10 ">
                    <div class="filter-item">
                      <span>供应商名称：</span> 
                      <el-select style="width: 100px;" v-model="left.tabs[0].form.processes">
                        <el-option v-for="(item, index) in left.tabs[1].filter.processes" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      <span>模具号：</span> 
                      <el-input v-model="left.tabs[0].form.mouldNo" style="width: 100px" />
                    </div>
                    <div class="filter-item">
                      <span>零件号：</span> 
                      <el-input v-model="left.tabs[0].form.componentNo" style="width: 100px" />
                    </div>
                    <div class="filter-item">
                      <span>检验日期：</span> 
                      <el-date-picker
                        v-model="left.tabs[0].form.testDaterange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div class="filter-item">
                      <span>外协工序：</span> 
                      <el-select style="width: 100px;" v-model="left.tabs[0].form.processes">
                        <el-option v-for="(item, index) in left.tabs[1].filter.processes" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      检验结果：
                      <el-checkbox-group v-model="left.tabs[0].form.resultType" style="display: inline-block;">
                        <el-checkbox label="接受"></el-checkbox>
                        <el-checkbox label="返工"></el-checkbox>
                        <el-checkbox label="报废"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <el-button type="primary" class="mgl40" @click="queryOrder">搜 索</el-button>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[0].list"
                    border
                    size="mini"
                    class="content-table">
                    <el-table-column prop="a" label="采购单号" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="b" label="供应商名称" sortable  width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="c" label="到货日期" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="d" label="检验日期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="e" label="模具号" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="f" label="零件号" sortable width="120"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="g" label="外协工序" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="h" label="数量" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="i" label="检测结果" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="j" label="异常数量" sortable width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="k" label="异常概况" sortable min-width="120" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
          <div v-show="left.activeId == left.tabs[1].key">
            <div class="main-content-title">
              <div>
                <img :src="currentData.icon" width="22px" style="position: relative;top: 5px;"> {{currentData.name}}
              </div>
            </div>
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24" class="mgb10 mgt10">
                  <div>
                    <el-button type="primary" @click="$router.push('/quality/registerFinished')">质量检验</el-button>
                  </div>
                  <div class="mgt10 ">
                    <div class="filter-item">
                      <span>模具号：</span> 
                      <el-input v-model="left.tabs[1].form.mouldNo" style="width: 100px" />
                    </div>
                    <div class="filter-item">
                      <span>零件号：</span> 
                      <el-input v-model="left.tabs[1].form.componentNo" style="width: 100px" />
                    </div>
                    <div class="filter-item">
                      <span>加工工序：</span> 
                      <el-select style="width: 100px;" v-model="left.tabs[1].form.processes">
                        <el-option v-for="(item, index) in left.tabs[1].filter.processes" :key="index" :label="item.stuffNo" :value="item.stuffNo" @click=""></el-option>
                      </el-select>
                    </div>
                    <div class="filter-item">
                      <span>检验日期：</span> 
                      <el-date-picker
                        v-model="left.tabs[1].form.testDaterange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                    <div class="filter-item">
                      检验结果：
                      <el-checkbox-group v-model="left.tabs[1].form.resultType" style="display: inline-block;">
                        <el-checkbox label="接受"></el-checkbox>
                        <el-checkbox label="返工"></el-checkbox>
                        <el-checkbox label="报废"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <el-button type="primary" class="mgl40" @click="queryProcesses">搜 索</el-button>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-table
                    :data="left.tabs[1].list"
                    border
                    size="mini"
                    class="content-table">
                    <el-table-column prop="a" label="模具号" sortable width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="b" label="零件号" sortable  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="c" label="工序" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="d" label="检验日期" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="e" label="数量" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="f" label="检测结果" sortable width="120"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="g" label="异常数量" sortable width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="h" label="异常概况" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
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
        left: {
          isLoading: false,
          tabs: [
            {
              key:  'page1',
              name: '采购到货检验',
              icon: require('../../../assets/img/icon11.svg'),
              filter: {
                supplier: [
                  {
                    stuffNo: 'A公司'
                  },
                  {
                    stuffNo: 'B公司'
                  },
                ],
                processes: [
                  {
                    stuffNo: 'A'
                  },
                  {
                    stuffNo: 'G'
                  },
                ]
              },
              form: {
                supplier: '',
                mouldNo: '',
                componentNo: '',
                processes: '',
                testDaterange: '',
                resultType: []
              },
              list: []
            },
            {
              key:  'page2',
              name: '工序完工检验',
              icon: require('../../../assets/img/icon12.svg'),
              filter: {
                processes: [
                  {
                    stuffNo: 'A'
                  },
                  {
                    stuffNo: 'G'
                  },
                ]
              },
              form: {
                mouldNo: '',
                componentNo: '',
                processes: '',
                testDaterange: '',
                resultType: []
              },
              list: []
            }
          ]
        }
      };
    },
    methods: {
      queryOrder() { //获取采购到货检验列表

        let params = {

        };
        let mock = [
          {
            a: 'MR2019-05-04',
            b: 'A公司',
            c: '5月7日',
            d: '5月7日',
            e: 'M16005',
            f: '300-1',
            g: 'L',
            h: '5',
            i: '接受',
            j: '10',
            k: '查图，尺寸量错'
          },
          {
            a: 'MR2019-09-09',
            b: 'B公司',
            c: '5月7日',
            d: '5月7日',
            e: 'M16005',
            f: '300-1',
            g: 'S',
            h: '3',
            i: '返工',
            j: '3',
            k: '70.07*0.96°斜度未加工'
          }
        ]

        this.left.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.tabs[0].list = res.data || [];
        }, () => this.left.isLoading = false, params, mock)
      },
      queryProcesses() { //获取工序完工检验列表

        let params = {

        };
        let mock = [
          {
            a: 'M16005',
            b: '300-1',
            c: 'L',
            d: '5月7日',
            e: '5',
            f: '接受',
            g: '1',
            h: '查图，尺寸量错'
          },
          {
            a: 'M9995',
            b: '301',
            c: 'K',
            d: '5月7日',
            e: '10',
            f: '返工',
            g: '12',
            h: '圆弧接深'
          }
        ]

        this.left.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.left.isLoading = false;
          this.left.tabs[1].list = res.data || [];
        }, () => this.left.isLoading = false, params, mock)
      },
      deleteOrder(item, index) {

        let params = {

        };
      
        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.$utils.showTip('success', 'success', '104');
          this.left.tabs[1].list.splice(index, 1);
        }, () => this.right.isLoading = false, params)
      },
      addOrder() {

        if(!this.left.tabs[0].selections.length) {
          this.$utils.showTip('warning', 'error', '-1060');
          return;
        }

        let time = new Date().getTime();
        this.$utils.setSessionStorage(time, JSON.stringify(this.left.tabs[0].selections));
        this.$router.push(`/plan/placeOrder/${time}`);
      },
      handleSelect(item) {
      
        this.left.activeId = item.key;
        this.currentData= item;
      },
      refresh() {}
    },
    created() {

      this.handleSelect(this.left.tabs[0]);
      this.queryOrder();
      this.queryProcesses();
    }
  };
</script>


<style scoped lang="scss">
  .dialog-content {
    max-height: 400px;
    overflow-y: auto;
  }
  .filter-item {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
  }
</style>