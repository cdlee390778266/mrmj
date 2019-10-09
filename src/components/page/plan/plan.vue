<template>
  <div>
    <div class="detail-main" style="top: 48px;bottom: 10px;" v-loading="isLoading">
      <div class="calc mgt10">
        <div class="main">
          <div class="msg" style="width: 100%;">
            <div class="msg-wrapper tr">
              <el-button v-popover:popover type="text">点击设定工厂日历</el-button>
              <el-popover
                ref="popover"
                placement="right"
                width="400"
                trigger="click">
                <p>
                  <el-select style="width: 100%;" v-model="right.page1.data">
                    <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                  </el-select>
                </p>
                <p class="mgt10">
                  <el-date-picker
                    v-model="right.page1.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </p>
                <p class="mgt10">
                  说明：绿色为工作日，白色为休息日；点击日历某天或框选某个时段，自动切换工作日或休息日
                </p>
              </el-popover>
            </div>
          </div>
          <div class="content">
            <h5 class="content-left-title">当前生产计划列表</h5>
            <div class="content-left" v-loading="left.isLoading">
              <div>
                <p>
                  <el-button type="primary" size="mini" @click="getData">查找符合条件记录</el-button>
                  <span class="mgl20">查找条件</span>
                  <span class="mgl20">
                    客户：
                    <el-select size="mini" style="width: 100px;" v-model="form.customer">
                      <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                    </el-select>
                  </span>
                  <span class="mgl20">
                    模具号：
                    <el-select size="mini" style="width: 100px;" v-model="form.moduleNo">
                      <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                    </el-select>
                  </span>
                  <span class="mgl20">
                    零件号：
                    <el-select size="mini" style="width: 100px;" v-model="form.componentNo">
                      <el-option v-for="(itemc, index) in right.page1.data" :key="index" :label="itemc.versionNo" :value="itemc.versionNo" @click=""></el-option>
                    </el-select>
                  </span>
                </p>
                <p class="mgt10">
                  <span>
                    工序估工时间超过
                    <el-input v-model="form.time" style="width: 60px;" size="mini"></el-input>
                    小时，进行标红提示
                  </span>
                </p>
                <p class="mgt10">
                  表格操作说明：点击某订单，设置订单出货日期及外协采购等操作
                </p>
              </div>
              <div class="posFull" style="top: 125px;
              overflow: auto;">
                <el-table
                  :data="tableData"
                  size="mini"
                  style="width: 100%"
                  class="edit-table">
                  <el-table-column
                    prop="a"
                    label="模具号"
                    width="120"
                    class-name="notEdit"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="b"
                    label="下图日期"
                    width="100"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-blue"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="c"
                    label="出货日期"
                    width="100"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-red"
                    show-overflow-tooltip>
                    <template scope="scope">
                      <div>
                        <div @click="showInput(tableData, scope.$index, 'cEdit', {})">
                          <div class="ellipsis tc">{{ scope.row.c }}</div>
                          <el-date-picker
                            type="date"
                            size="mini"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="scope.row.c"
                            @focus="showInput(tableData, scope.$index, 'cEdit', {})"
                            @blur="scope.row.cEdit = false"
                            :style="{opacity: scope.row.cEdit ? 1 : 0}">
                          </el-date-picker>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="d"
                    label="客户"
                    min-width="100"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-blue"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="e"
                    label="要求交期"
                    width="100"
                    align="center"
                    label-class-name="fc-el-table-head"
                    class-name="fc-blue"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="f"
                    label="状态"
                    width="100"
                    align="center"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="g"
                    label="零件号码"
                    min-width="100"
                    align="center"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="h"
                    label="数量"
                    min-width="100"
                    align="center"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="i"
                    label="版本"
                    width="100"
                    align="center"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="j"
                    label="整体外协"
                    width="100"
                    align="center"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>
                        <div @click="showInput(tableData, scope.$index, 'jEdit')">
                          <div class="ellipsis">
                            {{ 
                              scope.row.j == 1 ? '是' : (
                                 scope.row.j == 0 ? '否' : ''
                              )
                            }}
                          </div>
                          <el-select
                            v-model="scope.row.j"
                            placeholder="请选择"
                            :style="{opacity: scope.row.jEdit ? 1 : 0}"
                            @focus="showInput(tableData, scope.$index, 'jEdit')"
                            @blur="scope.row.jEdit = false">
                            <el-option
                              v-for="itemc in $dict.outsourceList"
                              :key="itemc.value"
                              :label="itemc.label"
                              :value="itemc.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="工艺时间" align="center" min-width="100">
                    <el-table-column
                      v-for="(item, index) in procedureList"
                      :key="index"
                      :label="item.name"
                      align="center"
                      min-width="70"
                      label-class-name="fc-red"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <div :class="{'fc-red': (scope.row[item.key] > form.time) && !scope.row[`${item.key}-isOut`]}" v-if="scope.row[item.key]">
                          <div @click="showInput(tableData, scope.$index, `${item.key}Edit`)">
                            <div class="ellipsis">
                              {{ 
                                scope.row[`${item.key}-isOut`] == 1 ? '外协' : scope.row[item.key]
                              }}
                            </div>
                            <el-select
                              v-model="scope.row[`${item.key}-isOut`]"
                              placeholder="请选择"
                              :style="{opacity: scope.row[`${item.key}Edit`] ? 1 : 0}"
                              @focus="showInput(tableData, scope.$index, `${item.key}Edit`)"
                              @blur="scope.row[`${item.key}Edit`] = false">
                              <el-option
                                v-for="itemc in $dict.outsourceLabelList"
                                :key="itemc.value"
                                :label="itemc.label"
                                :value="itemc.value">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <h5 class="content-right-title">5月2日-6月5日 产能负荷对比图</h5>
            <div class="content-right">
              <div class="mgtb10">
                <el-button type="primary" style="width: 100%;" @click="handle.setting.dialogVisible = true;">工序日产能设置</el-button>
              </div>
              <div class="capacity">
                <div class="capacity-head">
                  <span><i></i>负荷</span>
                  <span class="mgl20"><i></i>低产能</span>
                  <span class="mgl20"><i></i>高产能</span>
                </div>
                <div class="capacity-body posFull">
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                  <div class="capacity-item">
                    <div>M工序</div>
                    <div class="progress">
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                      <div><span></span>669</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="生产订单信息查看修改" class="dialog-gray" :visible.sync="handle.setting.dialogVisible" width="500px">
      <el-form :model="handle.setting.form" label-width="100px">
        <div class="dialog-content pdt10">
          <el-row class="pdtb10" :gutter="20">
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="pos-relative">
              <div class="setting-item">
                <h3>G工序日产能</h3>
                <div>
                  <p class="mgt10">
                    <span>高产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                  <p class="mgt10">
                    <span>低产能：</span> 
                    <el-input size="mini" v-model="right.page1.craftVersionNo" style="width: 100px" />
                    <span> 小时</span> 
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer tr pdb20 pdlr10">
            <el-button type="primary" @click="handle.setting.dialogVisible = false">保 存</el-button>
            <el-button @click="handle.setting.dialogVisible = false">返 回</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        isLoading: false,
        form: {
          customer: '',
          moduleNo: '',
          componentNo: '',
          time: '50'
        },
        procedurePrefix: 'procedure',
        procedureList: [],
        tableData: [],
        handle: {
          setting: {
            dialogVisible: false,
            data: {}
          }
        }
      }
    },
    methods: {
      getProcedureList() {  //获取工序列表

        let params = {

        };
        let mock = [
          {
            name: 'M',
            max: 1
          },
          {
            name: 'H\WC',
            max: 1
          },
          {
            name: 'H/T',
            max: 1
          },
          {
            name: 'G',
            max: 2
          },
          {
            name: 'EDM',
            max: 2
          },
          {
            name: 'CNC',
            max: 1
          },
          {
            name: 'EDB',
            max: 1
          },
          {
            name: 'W/C',
            max: 1
          },
          {
            name: 'PL',
            max: 1
          },
          {
            name: 'ENG',
            max: 2
          },
          {
            name: 'other',
            max: 1
          },
        ]

        this.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.isLoading = false;
          let procedureList = [];
          if(res.data.length) {
            
            res.data.map(item => {

              if(item.max > 1) {

                for(let i = 1; i <= item.max; i++) {

                  let newItem = Object.assign({}, item);
                  newItem.name = `${newItem.name}${i}`;
                  newItem.key = `${this.procedurePrefix}-${newItem.name}`;
                  newItem.index = i;
                  procedureList.push(newItem);
                }
              }else {

                item.key = `${this.procedurePrefix}-${item.name}1`;
                procedureList.push(item);
              }
            })
          }
          this.procedureList = procedureList;
        }, () => this.isLoading = false, params, mock)
      },
      getData() { //获取订单列表

        let params = {

        };
        let mock = [
          {
            id: 0,
            a: 'M19536',
            b: '4月7日',
            c: '5月1日',
            d: 'KL-D',
            e: '5月7日',
            f: '',
            g: '200',
            h: '8+1',
            i: 'v1',
            j: '是',
            k: [
              {
                name: 'M',
                value: 50,
                index: 1
              },
              {
                name: 'W/C',
                value: 100,
                index: 1
              },
              {
                name: 'G',
                value: 369,
                index: 2
              }
            ]
          },
          {
            id: 0,
            a: 'M19575',
            b: '4月7日',
            c: '5月1日',
            d: 'KL-D',
            e: '5月7日',
            f: '',
            g: '200',
            h: '4+1',
            i: 'v1',
            j: '是',
            k: [
              {
                name: 'HWC',
                value: 42,
                index: 1
              },
              {
                name: 'HT',
                value: 36,
                index: 1
              },
              {
                name: 'PL',
                value: 11,
                index: 2
              }
            ]
          },
          {
            id: 0,
            a: 'M1988',
            b: '4月7日',
            c: '5月1日',
            d: 'KL-D',
            e: '5月7日',
            f: '',
            g: '200',
            h: '18+1',
            i: 'v1',
            j: '是',
            k: [
              {
                name: 'CNC',
                value: 110,
                index: 1
              },
              {
                name: 'ENG',
                value: 6,
                index: 2
              },
              {
                name: 'G',
                value: 62,
                index: 2
              }
            ]
          }
        ]

        this.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.isLoading = false;
          res.data.map(item => {

            if(item.k.length) {

              item.k.map(itemc => {

                item[`${this.procedurePrefix}-${itemc.name}${itemc.index}`] = itemc.value;
              })
            }
          })
          this.tableData = res.data || [];
        }, () => this.isLoading = false, params, mock)
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      getList() {

        this.getList(this.$utils.CONFIG.api.stuff, this.right, 'stuff'); //获取客户列表
        this.getList(this.$utils.CONFIG.api.process, this.right, 'process'); //获取模具号列表
        this.getList(this.$utils.CONFIG.api.sysCode, this.right, 'sysCode', {otherWhereClause: "codeType = 'processContent'"}); //获取零件号列表
        this.getLeftList();
      }
    },
    
    created() {
      
      this.getProcedureList();
      this.getData();      
    }
  };
</script>


<style scoped lang="scss">
  .main {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: none;
    box-shadow: none;
    .msg {
      h4 {

      }
      .msg-wrapper {
        span {
          display: inline-block;
        }
      }
    }
    .content {
      position: absolute;
      top: 40px;
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
        right: 250px;
        bottom: 0;
        left: 0;
        padding: 20px 10px;
        width: auto !important;
        overflow: auto;
        border: 1px solid #ddd;
      }
      .content-right-title {
        position: absolute;
        top: 0px;
        right: 27px;
        font-weight: normal;
        font-size: 14px;
        background: #fff;
        z-index: 8;
      }
      .content-right {
        position: absolute;
        top: 10px;
        right: 0;
        bottom: 0;
        width: 220px;
        padding: 10px;
        overflow: auto;
        border: 1px solid #ddd;
        p {
          margin-bottom: 10px;
        }
        .capacity {
          .capacity-head {
            span {
              i {
                display: inline-block;
                width: 10px;
                height: 10px;
                margin-right: 2px;
                background: #9bbb59;
              }
              &:nth-child(3n+2) i {
                  background: #c0504d;
                }
              &:nth-child(3n+3) i {
                background: #4f81bd;
              }
            }
          }
          .capacity-body {
            top: 80px;
            padding: 10px;
            overflow: auto;
            .capacity-item {
              margin-bottom: 20px;
              .progress {
                font-size: 12px;
                line-height: 0;
                & > div {
                  & > span {
                    display: inline-block;
                    width: 100px;
                    height: 10px;
                    margin-right: 5px;
                    font-weight: bold;
                    background: #9bbb59;
                  }
                  &:nth-child(3n+2) span {
                    background: #c0504d;
                  }
                  &:nth-child(3n+3) span {
                    background: #4f81bd;
                  }
                }
              }
            }
          }
        }
      }
    }
    .handle {
      left: 0;
      right: 0;
    }
  }
  .setting-item {
    margin-bottom: 10px;
    h3 {
      position: absolute;
      top: -10px;
      font-size: 14px;
      font-weight: normal;
      background: #f2f2f2;
    }
    padding: 10px;
    border: 1px solid #ddd;
  }
</style>