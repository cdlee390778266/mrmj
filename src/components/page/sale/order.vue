<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：销售订单开展
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left">
        <div class="main-left-search pd10">
          <div class="mgb10">
            当前订单：
            <el-input v-model="form.text" style="width: 110px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            <el-button type="primary" @click="handle.add.dialogVisible = true" style="width: 80px; margin-left: 10px;">新增订单</el-button>
          </div>
        </div>
        <div class="list" style="top: 64px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex">
                <p><span>模具号：{{ item.id }}</span><span>订单类型：{{ item.id }}</span></p>
                <p>客户：{{ item.id }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">交期：{{ item.type }}</el-col>
              <el-col :span="12">订单价格：666</el-col>
              <el-col :span="12">状态：{{ item.type }}</el-col>
              <el-col :span="12">进度：<el-progress :percentage="50" color="rgba(0, 255, 0, 1)" style="width: 90px;display: inline-block;"></el-progress></el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="handle.update.dialogVisible = true">修改</a>
                <a href="javascript: void(0);" @click="handle.update.dialogVisible = true">暂停</a>
                <a href="javascript: void(0);" @click="handle.update.dialogVisible = true">终止</a>
                <a href="javascript: void(0);" @click="handle.del.dialogVisible = true">删除</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right">
        <page-wrapper @change="refresh">
          <template #pageName>
            订单明细
          </template>
          <template #pageTitle>
            <i class="el-icon-lx-edit"></i> 订单M-1901信息
          </template>
          <div class="pdt10 mgt10">
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：XXXXXX公司</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：12312323123</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">模具号：REQ1901</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单类型：模具零件</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单状态：已报价</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价：12301.00</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">汇率：欧元</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">订单总价（RMB）：欧元</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">当前成本累计（RMB）：欧元</el-col>
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
                    <el-table-column prop="d" label="单价"></el-table-column>
                    <el-table-column prop="address" label="总价"></el-table-column>
                    <el-table-column prop="address" label="下单日期"></el-table-column>
                    <el-table-column prop="address" label="要求交期"></el-table-column>
                    <el-table-column prop="address" label="说明"></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
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
                <el-col :span="24">需求说明：</el-col>
                <el-col
                  :span="24"
                >这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="新增销售订单" :visible.sync="handle.add.dialogVisible" width="900px">
      <div class="dflex">
        <div style="width: 200px;" class="bor rel">
          <div style="display: inline-block; background: #fff; position: relative; top: -10px; left: 10px; z-index: 1">选择需求生成订单</div>
          <div class="order-table-wrapper">
            <el-table :data="handle.add.form.detailList" size="mini" class="order-table">
              <el-table-column prop="date" label="需求编号" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="name" label="客户名称" show-overflow-tooltip	></el-table-column>
              <el-table-column prop="address" label="需求类型" show-overflow-tooltip	></el-table-column>
              <el-table-column prop="address" label="要求交期" show-overflow-tooltip	></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="flex">
          <el-form :model="handle.add.form" label-width="100px" class="bor mgl10 pd10">
            <div style="display: inline-block; background: #fff; position: relative; top: -20px; left: 10px; z-index: 1">选择需求生成订单</div>
            <div class="dflex mgt20">
              <div class="flex">
                <el-form-item label="客户">
                  <el-input v-model="handle.add.form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="模具号">
                      <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="订单类型">
                      <el-select v-model="handle.add.form.type">
                        <el-option label="模具零件" value="0"></el-option>
                        <el-option label="整体模具" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                class="v-upload pdl10"
                :multiple="false"
                :limit="1"
                :on-preview="handlePictureCardPreview"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <div>
              <p>零件清单：</p>
              <el-table :data="handle.add.form.detailList" height="160" border size="mini" style="width: 100%">
                <el-table-column prop="date" label="零件号" width="100"></el-table-column>
                <el-table-column prop="name" label="数量" width="88"></el-table-column>
                <el-table-column prop="address" label="要求交期"></el-table-column>
                <el-table-column prop="address" label="单价"></el-table-column>
                <el-table-column prop="address" label="总价"></el-table-column>
                <el-table-column prop="address" label="说明"></el-table-column>
              </el-table>
            </div>
            <el-row class="mgt20">
              <el-col :span="8" style="line-height: 33px;">
                订单总价（RMB）：231323.00
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算货币">
                  <el-select v-model="handle.add.form.type" style="width: 80px;">
                    <el-option label="欧元" value="0"></el-option>
                    <el-option label="美元" value="1"></el-option>
                    <el-option label="日元" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结算货币总价">
                  <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入结算货币总价" style="width: 80px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div>
              <p class="mgb10">
                上传附件：
                <el-button type="primary" size="mini">选择上传文件</el-button>
              </p>
              <el-table
                :data="handle.add.form.enclosureList"
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
            <el-form-item label="需求编号" class="mgt20">
              <el-input type="textarea" v-model="handle.add.form.dsc"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.add.dialogVisible = false">下单订单</el-button>
        <el-button type="primary" @click="handle.add.dialogVisible = false">存为草稿</el-button>
        <el-button @click="handle.add.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除确认框" :visible.sync="handle.del.dialogVisible">
      <el-form :model="handle.del.form" label-width="100px">
        您确定删除此订单？
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.del.dialogVisible = false">确 定</el-button>
        <el-button @click="handle.del.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改模具零件订单" :visible.sync="handle.update.dialogVisible" width="700px">
      <el-form :model="handle.update.form" label-width="100px">
        <div class="dflex mgt20">
          <div class="flex">
            <el-form-item label="客户">
              <el-input v-model="handle.add.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="模具号">
                  <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入模具号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            class="v-upload pdl10"
            :multiple="false"
            :limit="1"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div>
          <p>零件清单：</p>
          <el-table :data="handle.add.form.detailList" height="160" border size="mini" style="width: 100%">
            <el-table-column prop="date" label="零件号" width="100"></el-table-column>
            <el-table-column prop="name" label="数量" width="88"></el-table-column>
            <el-table-column prop="address" label="要求交期"></el-table-column>
            <el-table-column prop="address" label="单价"></el-table-column>
            <el-table-column prop="address" label="总价"></el-table-column>
            <el-table-column prop="address" label="说明"></el-table-column>
          </el-table>
        </div>
        <el-row class="mgt20">
          <el-col :span="8" style="line-height: 33px;">
            订单总价（RMB）：231323.00
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算货币">
              <el-select v-model="handle.add.form.type" style="width: 80px;">
                <el-option label="欧元" value="0"></el-option>
                <el-option label="美元" value="1"></el-option>
                <el-option label="日元" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算货币总价">
              <el-input v-model="handle.add.form.id" auto-complete="off" aria-placeholder="请输入结算货币总价" style="width: 80px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <p class="mgb10">
            上传附件：
            <el-button type="primary" size="mini">选择上传文件</el-button>
          </p>
          <el-table
            :data="handle.add.form.enclosureList"
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
        <el-form-item label="需求编号" class="mgt20">
          <el-input type="textarea" v-model="handle.add.form.dsc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.update.dialogVisible = false">下达订单</el-button>
        <el-button type="primary" @click="handle.update.dialogVisible = false">存为草稿</el-button>
        <el-button @click="handle.update.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {
      return {
        name: localStorage.getItem("ms_username"),
        left: {
          activeId: 125944,
          list: [
            {
              name: 'dddddddd',
              id: '125944',
              type: '模具零件',
              startDate: '2019.01.08',
              endDate: '2019.03.09'
            },
            {
              name: 'dddddddd',
              id: '1259445',
              type: '模具零件',
              startDate: '2019.01.08',
              endDate: '2019.03.09'
            }
          ]
        },
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
          add: {
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
          },
          update: {
            dialogVisible: false,
            form: {
              faceUrl: "",
              name: "",
              type: "0",
              id: "",
              btype: "0",
              total: 1256,
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
            },
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
  .main-left-search {
    button {
      width: 130px;
    }
  }
</style>