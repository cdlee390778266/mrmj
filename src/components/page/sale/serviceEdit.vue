<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：售后反馈->编辑客户投诉
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main" v-loading="right.isLoading">
      <el-scrollbar class="main-left" style="width: 500px; background: transparent;">
        <el-form :model="left.data" label-width="100px" class="mgl10 pd10">
          <div class="dflex">
            <div class="flex">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="投诉单号">
                    <el-input v-model="left.data.a" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户">
                    <el-autocomplete
                      class="inline-input"
                      v-model="left.data.b"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.aa, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入客户名称"></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系人">
                    <el-autocomplete
                      class="inline-input"
                      v-model="left.data.c"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.aa, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入联系人"></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职务">
                    <el-input v-model="left.data.d" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话">
                    <el-input v-model="left.data.e" auto-complete="off" aria-placeholder="请输联系人电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱地址">
                    <el-input v-model="left.data.f" auto-complete="off" aria-placeholder="请输联系人电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户PO.号">
                    <el-autocomplete
                      class="inline-input"
                      v-model="left.data.g"
                      :fetch-suggestions="(queryString, cb) =>querySearch(queryString, cb, filter.aa, 'codeName')"
                      valueKey="codeName"
                      value="codeName"
                      placeholder="请输入客户PO.号"></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="销售订单号">
                    <el-input v-model="left.data.h" auto-complete="off" aria-placeholder="请输入销售订单号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div>
            <el-table :data="left.data.i" max-height="160" border size="mini" class="edit-table" style="width: 100%">
              <el-table-column label="零件号" width="100">
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(left.data.i, scope.$index, 'aaEdit')">
                      <div class="ellipsis">
                        {{scope.row.aa}}
                      </div>
                      <el-select
                        v-model="scope.row.aa"
                        placeholder="请选择"
                        :style="{opacity: scope.row.aaEdit ? 1 : 0}"
                        @focus="showInput(left.data.i, scope.$index, 'aaEdit')"
                        @blur="scope.row.aaEdit = false">
                        <el-option
                          v-for="item in filter.cc"
                          :key="item.codeName"
                          :label="item.codeName"
                          :value="item.codeName">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="投诉类别" width="100">
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(left.data.i, scope.$index, 'bbEdit')">
                      <div class="ellipsis">
                        {{scope.row.bb}}
                      </div>
                      <el-select
                        v-model="scope.row.bb"
                        placeholder="请选择"
                        :style="{opacity: scope.row.bbEdit ? 1 : 0}"
                        @focus="showInput(left.data.i, scope.$index, 'bbEdit')"
                        @blur="scope.row.bbEdit = false">
                        <el-option
                          v-for="item in filter.dd"
                          :key="item.codeName"
                          :label="item.codeName"
                          :value="item.codeName">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="情况描述">
                <template slot-scope="scope">
                  <div>
                    <div @click="showInput(left.data.i, scope.$index, 'ccEdit', {})">
                      <div class="ellipsis">{{ scope.row.cc }}</div>
                      <el-input size="mini" v-model="scope.row.cc" @focus="showInput(left.data.i, scope.$index, 'ccEdit', {}, false)" @blur="scope.row.ccEdit = false" :style="{opacity: scope.row.ccEdit ? 1 : 0}"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <p class="mgb10 mgt20">
              投诉附件：
              <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
                <el-button size="mini" type="primary">选择上传文件</el-button>
                <input type="file" name="file" ref="file" class="posFull opacity0" @change="addAttachments">
              </span>
            </p>
            <el-table
              :data="left.data.j"
              max-height="160"
              border
              size="mini"
              style="width: 100%">
              <el-table-column prop="fileName" label="资料名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="deleteAttachments(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </el-scrollbar>
      <div class="main-right">
        <div>
          <div class="main-right-title">投诉相关订单信息</div>
          <el-scrollbar class="main-content-scorll pd10">
            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：{{right.page1.a | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：{{right.page1.b | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：{{right.page1.c | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币：{{right.page1.d | filterNull}}</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币总价：{{right.page1.e | filterNull}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24">订单零件列表：</el-col>
              <el-col :span="24">
                <el-table
                  :data="right.page1.f"
                  border
                  size="mini"
                  class="content-table"
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" width="50"></el-table-column>
                  <el-table-column prop="a" label="零件号" width="180"></el-table-column>
                  <el-table-column prop="b" label="客户编号" width="180"></el-table-column>
                  <el-table-column prop="c" label="数量" min-width="88"></el-table-column>
                  <el-table-column prop="d" label="下单日期" min-width="88"></el-table-column>
                  <el-table-column prop="e" label="要求交期" min-width="88"></el-table-column>
                  <el-table-column prop="f" label="实际交期" min-width="88"></el-table-column>
                  <el-table-column prop="g" label="说明"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                订单附件
              </el-col>
              <el-col :span="24">
                <el-table
                  :data="right.page1.g"
                  border
                  size="mini"
                  class="content-table"
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" width="50"></el-table-column>
                  <el-table-column prop="fileName" label="附件名称"></el-table-column>
                  <el-table-column width="100" label="操作">
                    <template slot-scope="scope">
                      <a href="javascript:void(0);" style="color: #3375AB;" @click="down(scope.row.fileId)">下载</a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">订单说明：</el-col>
              <el-col
                :span="24"
              >{{right.page1.h | filterNull}}</el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="handle pdtb10 tr">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="back">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        filter: {
          aa: [
            {
              codeName: '张',
              supplier: 'A公司'
            },
            {
              codeName: '王',
              supplier: 'B公司'
            },
            {
              codeName: '孙',
              supplier: 'C公司'
            },
            {
              codeName: '李',
              supplier: 'D公司'
            }
          ],
          bb: [
            {
              codeName: '12365',
              supplier: 'A公司'
            },
            {
              codeName: '669548',
              supplier: 'B公司'
            },
            {
              codeName: '3543',
              supplier: 'C公司'
            },
            {
              codeName: '2336h',
              supplier: 'D公司'
            }
          ],
          cc: [
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
          dd: [
            {
              codeName: '漏查'
            },
            {
              codeName: '形状'
            },
            {
              codeName: '尺寸'
            }
          ]
        },
        left: {
          data: {
            i: [
              {}
            ]
          }
        }
      };
    },
    methods: {
      getDetail() {

        let params = {

        };
        let mock = {
          a: 'M-1901',
          b: '模具零件',
          c: '12301.00',
          d: '欧元',
          e: '12301.00',
          f: [
            {
              a: '172988',
              b: '',
              c: '3',
              d: '',
              e: '2019.03.1',
              f: '2019.03.08',
              g: ''
            },
            {
              a: '832071',
              b: '',
              c: '3',
              d: '',
              e: '2019.03.1',
              f: '2019.03.08',
              g: ''
            }
          ],
          g: [
            {
              fileName: '172988图纸',
              fileId: 'crQhc2flTyetPwbJ'
            },
            {
              fileName: '95988图纸',
              fileId: 'crQhc2flTyetPwbJ'
            }
          ],
          h: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhonc'
        }

        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.right.isLoading = false;
          this.right.page1 = res.data || [];
        }, () => this.right.isLoading = false, params, mock)
      },
      addAttachments() {

        let id = new Date().getTime();
        this.$set(this.left.data, 'j', this.left.data.j || []);
        this.left.data.j.push({
          id: id,
          fileName: this.$refs.file.files[0].name
        })
        this.$refs.file.value = '';
      },
      deleteAttachments(id) {

        this.left.data.j = this.left.data.j.filter(item => item.id != id);
      },
      handleSelect(item) {
        this.left.activeId = item.id;
      },
      save() {

        let params = {

        };
        
        this.right.isLoading = true;
        this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

          this.$utils.showTip('success', 'success', '102');
          this.right.isLoading = false;
        }, () => this.right.isLoading = false, params)
      },
      refresh() {}
    },
    created() {

      this.getDetail();
    }
  };
</script>


<style scoped lang="scss">
  .el-row {
    margin-bottom: 20px;
  }
  .main {
    bottom: 70px;
  }
  .main-content-scorll {
    top: 50px !important;
    right: 10px !important;
  }
</style>