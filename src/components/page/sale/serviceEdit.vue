<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：售后反馈->编辑客户投诉
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-scrollbar class="main-left" style="width: 500px; background: transparent;">
        <el-form :model="handle.update.form" label-width="100px" class="mgl10 pd10">
          <div class="dflex">
            <div class="flex">
              <el-form-item label="客户">
                <el-input v-model="handle.update.form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人">
                    <el-select v-model="handle.update.form.type">
                      <el-option label="模具零件" value="0"></el-option>
                      <el-option label="整体模具" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职务">
                    <el-select v-model="handle.update.form.type">
                      <el-option label="模具零件" value="0"></el-option>
                      <el-option label="整体模具" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话">
                    <el-input v-model="handle.update.form.id" auto-complete="off" aria-placeholder="请输联系人电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱地址">
                    <el-input v-model="handle.update.form.id" auto-complete="off" aria-placeholder="请输联系人电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户PO.号">
                    <el-select v-model="handle.update.form.type">
                      <el-option label="模具零件" value="0"></el-option>
                      <el-option label="整体模具" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="投诉单号">
                    <el-input v-model="handle.update.form.id" auto-complete="off" aria-placeholder="请输联系人电话"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div>
            <el-table :data="handle.update.form.detailList" height="160" border size="mini" style="width: 100%">
              <el-table-column prop="date" label="零件号" width="100"></el-table-column>
              <el-table-column prop="name" label="投诉类型" width="88"></el-table-column>
              <el-table-column prop="address" label="存在问题"></el-table-column>
              <el-table-column prop="address" label="情况描述"></el-table-column>
            </el-table>
          </div>
          <div>
            <p class="mgb10 mgt20">
              投诉附件：
              <el-button type="primary" size="mini">选择上传文件</el-button>
            </p>
            <el-table
              :data="handle.update.form.enclosureList"
              height="160"
              border
              size="mini"
              style="width: 100%"
            >
              <el-table-column prop="date" label="上传文件"></el-table-column>
              <el-table-column prop="name" label="资料名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
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
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：REQ1901</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：模具零件</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：12301.00</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币：欧元</el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">交易货币总价：欧元</el-col>
            </el-row>
            <el-row>
              <el-col :span="24">订单零件列表：</el-col>
              <el-col :span="24">
                <el-table
                  :data="right.list[right.activeIndex].spList"
                  border
                  size="mini"
                  class="content-table"
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" width="50"></el-table-column>
                  <el-table-column prop="date" label="零件号" width="180"></el-table-column>
                  <el-table-column prop="name" label="客户编号" width="180"></el-table-column>
                  <el-table-column prop="address" label="数量"></el-table-column>
                  <el-table-column prop="address" label="下单日期"></el-table-column>
                  <el-table-column prop="address" label="要求交期"></el-table-column>
                  <el-table-column prop="address" label="实际交期"></el-table-column>
                  <el-table-column prop="address" label="说明"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                订单附件
              </el-col>
              <el-col :span="24">
                <el-table
                  :data="right.list[right.activeIndex].spList"
                  border
                  size="mini"
                  class="content-table"
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" width="50"></el-table-column>
                  <el-table-column prop="date" label="附件名称"></el-table-column>
                  <el-table-column width="100" label="操作">
                    <template slot-scope="scope">
                      <a href style="color: #3375AB;">下载</a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">订单说明：</el-col>
              <el-col
                :span="24"
              >这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="handle pdtb10 tr">
      <el-button type="primary" @click="handle.update.dialogVisible = false">保 存</el-button>
      <el-button @click="handle.update.dialogVisible = false">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        right: {
          activeIndex: 0,
          list: [
            {
              spList: [
                {
                  date: "172988",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-04",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-01",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-03",
                  name: "",
                  address: ""
                }
              ],
              enclosureList: [
                {
                  date: "172988",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-04",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-01",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                },
                {
                  date: "2016-05-03",
                  name: "",
                  address: "3",
                  d: "2019-03-02"
                }
              ]
            }
          ]
        },
        handle: {
          update: {
            dialogVisible: false,
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              dsc: "",
              detailList: [
                {
                  date: "2016-05-03",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-02",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-04",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄"
                }
              ],
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
            }
          },
          del: {
            dialogVisible: false,
            form: {
              reason: "",
              dsc: ""
            }
          }
        }
      };
    },
    methods: {
      handlePictureCardPreview(file) {
        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
      },
      handleSelect(item) {
        this.left.activeId = item.id;
      },
      del(index, row) {
        console.log(index, row);
      },
      refresh() {}
    },
    created() {}
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