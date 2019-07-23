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
            <el-input v-model="form.text" style="width: 100px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            <el-button type="primary" @click="handle.update.dialogVisible = true" style="width: 80px; margin-left: 10px;">新增客户</el-button>
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
              </div>
            </div>
            <el-row>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="handle.update.dialogVisible = true">编辑</a>
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
            客户信息明细
          </template>
          <template #pageTitle>
            <i class="el-icon-lx-edit"></i> 客户信息
          </template>
          <div class="pdt10 mgt10">
            <el-scrollbar class="main-content-scorll pdt10">
              <el-row>
                <el-col :span="24"><strong>客户信息</strong></el-col>
                <el-col :span="24">
                  <div class="dflex">
                    <div class="flex">
                      <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">客户名称：XXXXXXXXXXXXXXX公司</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">客户简称：XXXXX</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">客户所在国：美国</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">详细地址：撒的发生的发生打发斯蒂芬</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">联系电话：123123123123123</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">传真：123123123</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">电子邮件：fasdfasdf@xxxxxxxx.com</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">企业负责人：asdfasdfasdf</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">付款账期：30天</el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">使用货币：美元</el-col>
                      </el-row>
                    </div>
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      list-type="picture-card"
                      class="v-upload pdr20"
                      :multiple="false"
                      :limit="1"
                      :on-preview="handlePictureCardPreview"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><strong>联系人信息：</strong></el-col>
                <el-col :span="24">
                  <el-table
                    :data="right.list[right.activeIndex].spList"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column prop="date" label="联系人姓名" width="180"></el-table-column>
                    <el-table-column prop="name" label="性别" width="180"></el-table-column>
                    <el-table-column prop="address" label="职位"></el-table-column>
                    <el-table-column prop="d" label="单价"></el-table-column>
                    <el-table-column prop="address" label="联系电话"></el-table-column>
                    <el-table-column prop="address" label="电子邮件"></el-table-column>
                    <el-table-column prop="address" label="备注"></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="客户档案" center :visible.sync="handle.update.dialogVisible" width="700px" v-dialogDrag>
      <el-form :model="handle.update.form" label-width="100px">
        <div class="dflex">
          <div class="flex">
            <el-form-item label="客户名称">
              <el-input v-model="handle.update.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户简称">
              <el-input v-model="handle.update.form.abbreiation" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户所在国">
              <el-select v-model="handle.update.form.countryId" style="width: 100%;">
                <el-option :label="模具零件" value="0" v-for="(item, index) in handle.update.list.country" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="handle.update.form.address" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="handle.update.form.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="传真">
                  <el-input v-model="handle.update.form.fax" auto-complete="off" aria-placeholder="请输入传真"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电子邮件">
                  <el-input v-model="handle.update.form.email" auto-complete="off" aria-placeholder="请输入电子邮件"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="企业负责人">
                  <el-input v-model="handle.update.form.personInCharge" auto-complete="off" aria-placeholder="请输入企业负责人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="常用货币">
                  <el-select v-model="handle.update.form.currencyId" style="width: 100%;">
                    <el-option label="欧元" value="0"></el-option>
                    <el-option label="美元" value="1"></el-option>
                    <el-option label="日元" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="付款账期">
                  <div class="dflex">
                    <div class="flex">
                      <el-input type="number" v-model="handle.update.form.accountPeriod" auto-complete="off" aria-placeholder="请输入付款账期"></el-input>
                    </div>
                    <div style="padding-left: 5px;">天</div>
                  </div>
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
          <p>业务联系人：</p>
          <el-table :data="handle.update.form.liaisonManList" border size="mini" style="width: 100%" class="edit-table">
            <el-table-column prop="liaisonManName" label="联系人姓名"	width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="scope.row.liaisonManNameEdit = true">
                    <el-input size="mini" v-model="scope.row.liaisonManName" @blur="scope.row.liaisonManNameEdit = false" :style="{opacity: scope.row.liaisonManNameEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.liaisonManName }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="性别" width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="scope.row.genderEdit = true">
                    <el-input size="mini" v-model="scope.row.gender" @blur="scope.row.genderEdit = false" :style="{opacity: scope.row.genderEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.gender }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="职位" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="scope.row.positionEdit = true">
                    <el-input size="mini" v-model="scope.row.position" @blur="scope.row.positionEdit = false" :style="{opacity: scope.row.positionEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.position }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="联系电话" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="scope.row.phoneEdit = true">
                    <el-input size="mini" v-model="scope.row.phone" @blur="scope.row.phoneEdit = false" :style="{opacity: scope.row.phoneEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.phone }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="电子邮件" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="scope.row.emailEdit = true">
                    <el-input size="mini" v-model="scope.row.email" @blur="scope.row.emailEdit = false" :style="{opacity: scope.row.emailEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.email }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="备注" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="scope.row.remarkEdit = true">
                    <el-input size="mini" v-model="scope.row.remark" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.remark }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.update.dialogVisible = false">保 存</el-button>
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
      let liaisonManDefault = {
        liaisonManName: '',
        liaisonManNameEdit: false,
        gender: '',
        genderEdit: false,
        position: '',
        positionEdit: false,
        phone: '',
        phoneEdit: false,
        email: '',
        emailEdit: false,
        remark: '',
        remarkEdit: false
      }
      return {
        selectList: {
          currency: [],
          country: []
        },
        left: {
          activeId: 125944,
          list: [
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
                }
              ]
            }
          ]
        },
        handle: {
          update: {
            dialogVisible: false,
            list: {
              country: []
            },
            form: {
              customerName: '',
              number: '',
              customerType: 0,
              abbreiation: '',
              countryId: '',
              currencyId: '',
              accountPeriod: '',
              address: '',
              industryNume: '',
              phone: '',
              valueScale: '',
              province: '',
              city: '',
              distinct: '',
              fax: '',
              email: '',
              personInCharge: '',
              personScale: '',
              liaisonManList: [Object.assign({}, liaisonManDefault), Object.assign({}, liaisonManDefault), Object.assign({}, liaisonManDefault), Object.assign({}, liaisonManDefault)]
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
      refresh() {}
    },
    created() {
      //币种列表
    }
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