<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：售后反馈
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left">
        <div class="main-left-search pd10">
          <div class="mgb10">
            待处理投诉：
            <el-input v-model="form.text" style="width: 110px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            <el-button type="primary" @click="handle.update.dialogVisible = true" style="width: 70px; margin-left: 10px;">新增投诉</el-button>
          </div>
        </div>
        <div class="list" style="top: 64px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.id }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img src="../../../assets/img/img1.svg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex">
                <p>{{ item.id }}</p>
                <p>投诉订单：{{ item.id }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="12">反馈类型：{{ item.type }}</el-col>
              <el-col :span="12">日期：666</el-col>
              <el-col :span="24">待处理：{{ item.type }}</el-col>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="handle.update.dialogVisible = true">编辑</a>
                <a href="javascript: void(0);" @click="handle.del.dialogVisible = true">处理完成</a>
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
            客户投诉明细
          </template>
          <template #pageTitle>
            <i class="el-icon-warning-outline"></i> 客诉及内部处置信息
          </template>
          <div class="pdt10 mgt10">
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"><strong>客诉信息</strong></el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：XXXXXX公司</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：12312323123</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：REQ1901</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：模具零件</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：已报价</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：12301.00</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">投诉单号：欧元</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">投诉附件：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="right.list[right.activeIndex].spList"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="date" label="资料名称"></el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="scope">
                        <a href style="color: #3375AB;">下载</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <div>
                <el-divider class="mgtb20"></el-divider>
                <el-row>
                  <el-col :span="24"><strong>客诉零件</strong></el-col>
                  <el-col :span="24">
                    <span>零件号：406</span>
                    <span class="mgl10">投诉类型：投诉</span>
                    <span class="mgl10">存在问题：质量</span>
                  </el-col>
                  <el-col :span="24">
                    <div class="dflex">
                      <div>情况说明：</div>
                      <div class="flex">
                        这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><strong>内部处置信息</strong></el-col>
                  <el-col :span="24">
                    <span>责任部门：XXXX部</span>
                    <span class="mgl10">投诉类别：外观</span>
                    <span class="mgl10">检测人员：ZZZZ</span>
                  </el-col>
                  <el-col :span="24">
                    <div class="dflex">
                      <div>情解决改善方案：</div>
                      <div class="flex">
                        这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                      </div>
                    </div>
                    <div>改善效果：已改善</div>
                  </el-col>
                </el-row>
              </div>
              <div>
                <el-divider class="mgtb20"></el-divider>
                <el-row>
                  <el-col :span="24"><strong>客诉零件</strong></el-col>
                  <el-col :span="24">
                    <span>零件号：406</span>
                    <span class="mgl10">投诉类型：投诉</span>
                    <span class="mgl10">存在问题：质量</span>
                  </el-col>
                  <el-col :span="24">
                    <div class="dflex">
                      <div>情况说明：</div>
                      <div class="flex">
                        这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><strong>内部处置信息</strong></el-col>
                  <el-col :span="24">
                    <span>责任部门：XXXX部</span>
                    <span class="mgl10">投诉类别：外观</span>
                    <span class="mgl10">检测人员：ZZZZ</span>
                  </el-col>
                  <el-col :span="24">
                    <div class="dflex">
                      <div>情解决改善方案：</div>
                      <div class="flex">
                        这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.
                      </div>
                    </div>
                    <div>改善效果：已改善</div>
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="新增客户投诉" :visible.sync="handle.update.dialogVisible" width="700px">
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.update.dialogVisible = false">保 存</el-button>
        <el-button @click="handle.update.dialogVisible = false">返 回</el-button>
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
  .main-left-search {
    button {
      width: 130px;
    }
  }
</style>