<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-copy"></i> 当前位置：需求跟踪
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main">
            <div class="main-left">
                <div class="main-left-search pd10">
                    需求列表：
                    <el-input
                    v-model="searchText" size="mini" style="width: 110px">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button type="primary" size="mini" class="mgl10" @click="dialogAddVisible = true">新增需求</el-button>
                </div>
                <div class="list">
                    <div class="list-item pd10 active">
                        <div class="dflex">
                            <div><img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10"></div>
                            <div class="flex">
                               <p>啛啛喳喳错错</p>
                               <p>客户PO号：123456</p> 
                            </div>
                        </div>
                        <el-row>
                            <el-col :span="12">
                                需求类型：模具零件
                            </el-col>
                            <el-col :span="12">
                                交期：2019.03.03
                            </el-col>
                            <el-col :span="24">
                                报价：2019.03.03
                            </el-col>
                            <el-col :span="24" class="tr">
                                <a href="javascript: void(0);" @click="dialogAddVisible = true">修改</a>
                                <a href="javascript: void(0);" @click="dialogStopVisible = true">终止</a>
                                <router-link to="/sale/detail">报价</router-link>
                                <a href="javascript: void(0);" @click="dialogOrderVisible = true">下单</a>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="main-right">
                <div class="main-right-title">需求明细</div>
                <div class="tc up"><img src="../../../assets/img/up.png" height="12" width="60" class="pointer"></div>
                <div class="main-content-title">
                    <div><i class="el-icon-lx-edit"></i> 模具零件需求信息</div>
                </div>
                <div class="main-content pdt10">
                  <div class="main-content-scorll">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                            客户名称：XXXXXX公司
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                            客户PO.号：12312323123
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                            需求编号：REQ1901
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                            需求类型：模具零件
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                            需求状态：已报价
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                            已报总价：12301.00
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                            报价货币：欧元
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=24>
                            需求零件列表：
                        </el-col>
                        <el-col :span=24>
                            <el-table
                              :data="current.spList"
                              border
                              size="mini"
                              class="content-table"
                              style="width: 100%">
                                <el-table-column
                                  type="index"
                                  label="序号"
                                  width="50">
                                </el-table-column>
                                <el-table-column
                                  prop="date"
                                  label="零件号"
                                  width="180">
                                </el-table-column>
                                <el-table-column
                                  prop="name"
                                  label="客户编号"
                                  width="180">
                                </el-table-column>
                                <el-table-column
                                  prop="address"
                                  label="需求数量">
                                </el-table-column>
                                <el-table-column
                                  prop="d"
                                  label="要求交期">
                                </el-table-column>
                                <el-table-column
                                  prop="address"
                                  label="说明">
                                </el-table-column>
                          </el-table>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=24>
                            需求附件：
                        </el-col>
                        <el-col :span=24>
                            <el-table
                              :data="current.spList"
                              border
                              size="mini"
                              class="content-table"
                              style="width: 100%">
                                <el-table-column
                                  type="index"
                                  label="序号"
                                  width="50">
                                </el-table-column>
                                <el-table-column
                                  prop="date"
                                  label="附件名称">
                                </el-table-column>
                                <el-table-column
                                  width="100"
                                  label="操作">
                                  <template slot-scope="scope">
                                    <a href="" style="color: #3375AB;">下载</a>
                                  </template>
                                </el-table-column>
                          </el-table>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=24>
                            需求说明：
                        </el-col>
                        <el-col :span=24>
                            这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                        </el-col>
                    </el-row>
                  </div>
                  <div class="main-content-page">
                    <i class="el-icon-arrow-up"></i>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <i class="el-icon-arrow-down"></i>
                  </div>
                  <!-- <div class="mask">
                    <i class="el-icon-loading"></i>
                  </div> -->
                </div>
                <div class="tc down"><img src="../../../assets/img/down.png" height="12" width="60" class="pointer"></div>
            </div>
        </div>

        <el-dialog title="新增客户需求" :visible.sync="dialogAddVisible">
          <el-form :model="addForm" label-width="100px">
            <div class="dflex">
              <div class="flex">
                <el-form-item label="客户">
                  <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="需求类型">
                      <el-select v-model="addForm.type">
                        <el-option label="模具零件" value="0"></el-option>
                        <el-option label="整体模具" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="需求编号">
                      <el-input v-model="addForm.id" auto-complete="off"></el-input>
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
                :on-preview="handlePictureCardPreview">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <div>
              <p>需求明细：</p>
              <el-table
                :data="addForm.detailList"
                height="160"
                border
                size="mini"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="零件号"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="数量"
                  width="88">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="要求交期">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="说明">
                </el-table-column>
              </el-table>
            </div>
            <div>
              <p class="mgt20 mgb10">上传附件：  <el-button type="primary" size="mini">选择上传文件</el-button></p>
              <el-table
                :data="addForm.enclosureList"
                height="160"
                border
                size="mini"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="上传文件">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="资料名称">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="del(scope.$index, scope.row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form-item label="需求编号" class="mgt20">
              <el-input type="textarea" v-model="addForm.dsc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogAddVisible = false">确 定</el-button>
            <el-button @click="dialogAddVisible = false">取 消</el-button>
          </div>
        </el-dialog>

        <el-dialog title="终止原因" :visible.sync="dialogStopVisible">
          <el-form :model="stopForm" label-width="100px">
            <el-form-item label="需求终止原因" class="mgt20">
              <el-input v-model="stopForm.reason"></el-input>
            </el-form-item>
            <el-form-item label="说明" class="mgt20">
              <el-input type="textarea" v-model="stopForm.dsc"  class="v-textarea"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogStopVisible = false">确 定</el-button>
            <el-button @click="dialogStopVisible = false">取 消</el-button>
          </div>
        </el-dialog>

        <el-dialog title="新增模具零件订单" :visible.sync="dialogOrderVisible" width="700px">
          <el-form :model="orderForm" label-width="100px">
            <div class="dflex">
              <div class="flex">
                <el-form-item label="客户">
                  <el-input v-model="orderForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="模具号">
                  <el-input v-model="orderForm.id" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                class="v-upload pdl10"
                :multiple="false"
                :limit="1"
                :on-preview="handlePictureCardPreview">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <div>
              <p>零件清单：</p>
              <el-table
                :data="orderForm.detailList"
                height="160"
                border
                size="mini"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="零件号"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="数量"
                  width="88">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="要求交期">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="单价">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="总价">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="说明">
                </el-table-column>
              </el-table>
            </div>
            <div>
              <div class="mgt20 mgb0 dflex el-form-item-mgb0" style="line-height: 32px;">
                <div class="flex">订单总价（RMB）：231323.00</div>
                <div class="flex">
                  <el-form-item label="结算货币">
                    <el-select v-model="orderForm.btype">
                      <el-option label="欧元" value="0"></el-option>
                      <el-option label="美元" value="1"></el-option>
                      <el-option label="日元" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex">
                  <el-form-item label="结算货币总价">
                    <el-input v-model="orderForm.total" auto-complete="off"></el-input>
                  </el-form-item>
                </div>
              </div>
              <p class="mgb10">上传附件：  <el-button type="primary" size="mini">选择上传文件</el-button></p>
              <el-table
                :data="orderForm.enclosureList"
                height="160"
                border
                size="mini"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="上传文件">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="资料名称">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="del(scope.$index, scope.row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form-item label="说明" class="mgt20">
              <el-input type="textarea" v-model="orderForm.dsc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogOrderVisible = false">下达订单</el-button>
            <el-button type="primary" @click="dialogOrderVisible = false">存为草稿</el-button>
            <el-button @click="dialogOrderVisible = false">取 消</el-button>
          </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                searchText: '',
                current: {
                  spList: [{
                    date: '172988',
                    name: '',
                    address: '3',
                    d: '2019-03-02'
                  }, {
                    date: '2016-05-04',
                    name: '',
                    address: '3',
                    d: '2019-03-02'
                  }, {
                    date: '2016-05-01',
                    name: '',
                    address: '3',
                    d: '2019-03-02'
                  }, {
                    date: '2016-05-03',
                    name: '',
                    address: ''
                  }],
                  enclosureList:[{
                    date: '172988',
                    name: '',
                    address: '3',
                    d: '2019-03-02'
                  }, {
                    date: '2016-05-04',
                    name: '',
                    address: '3',
                    d: '2019-03-02'
                  }, {
                    date: '2016-05-01',
                    name: '',
                    address: '3',
                    d: '2019-03-02'
                  }, {
                    date: '2016-05-03',
                    name: '',
                    address: '3',
                    d: '2019-03-02'
                  }]
                },
                dialogAddVisible: false,
                addForm: {
                  faceUrl: '',
                  name: '',
                  type: '0',
                  id: '',
                  dsc: '',
                  detailList: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }],
                  enclosureList: [{
                    date: '2016-05-03',
                    name: '王小虎',
                  }, {
                    date: '2016-05-02',
                    name: '王小虎'
                  }, {
                    date: '2016-05-04',
                    name: '王小虎'
                  }, {
                    date: '2016-05-01',
                    name: '王小虎'
                  }]
                },
                dialogStopVisible: false,
                stopForm: {
                  reason: '',
                  dsc: ''
                },
                dialogOrderVisible: false,
                orderForm: {
                  faceUrl: '',
                  name: '',
                  type: '0',
                  id: '',
                  btype: '0',
                  total: 1256,
                  dsc: '',
                  detailList: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                  }],
                  enclosureList: [{
                    date: '2016-05-03',
                    name: '王小虎',
                  }, {
                    date: '2016-05-02',
                    name: '王小虎'
                  }, {
                    date: '2016-05-04',
                    name: '王小虎'
                  }, {
                    date: '2016-05-01',
                    name: '王小虎'
                  }]
                }
            }
        },
        methods: {
          handlePictureCardPreview(file) {
            this.faceUrl = file.url;
            this.addDialog.dialogVisible = true;
          },
          del(index, row) {
            console.log(index, row);
          }
        },
        created(){
          
        }
    }
</script>


<style scoped lang="scss">
    .el-row {
        margin-bottom: 20px;
    }
</style>