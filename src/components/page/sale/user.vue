<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：客户档案
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="main-left" v-loading="left.isLoading">
        <div class="main-left-search pd10">
          <div class="mgb10">
            客户信息：
            <el-input v-model="form.text" style="width: 100px" prefix-icon="el-icon-search" @focus="isShowList = false" />
            <el-button type="primary" @click="edit('add', 'updateForm')" style="width: 80px; margin-left: 10px;">新增客户</el-button>
          </div>
        </div>
        <div class="list" style="top: 64px;">
          <div class="list-item pd10" v-for="(item, index) in left.list" :key="index" :class="{ active: left.activeId == item.mrCustomerId }" v-show="isShowList" @click="handleSelect(item)">
            <div class="dflex">
              <div>
                <img :src="item.business && item.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : defaultImg" width="30" class="mgr10 mgt10" />
              </div>
              <div class="flex">
                <p>{{ item.name }}</p>
              </div>
            </div>
            <el-row>
              <el-col :span="24" class="tr">
                <a href="javascript: void(0);" @click="edit('edit', 'updateForm', item)">编辑</a>
              </el-col>
            </el-row>
          </div>
          <div class="filter" v-show="!isShowList">
            <p v-for="(item, index) in filter.typeList" :key="index" @click="isShowList = true"><i class="el-icon-search"></i> {{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="main-right" v-loading="right.isLoading">
        <page-wrapper @change="search" :rightList="left.list">
          <template #pageName>
            客户信息明细
          </template>
          <template #pageTitle>
            <i class="el-icon-lx-edit"></i> 客户信息
          </template>
          <template v-slot:default="slotProps">
            <div class="pdt10 mgt10">
              <el-scrollbar class="main-content-scorll pdt10">
                <el-row>
                  <el-col :span="24"><strong>客户信息</strong></el-col>
                  <el-col :span="24">
                    <div class="dflex">
                      <div class="flex">
                        <el-row>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">客户名称：{{ currentData.name | filterNull }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">客户简称：{{ currentData.abbreviation | filterNull }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">客户所在国：{{ currentData.country ? currentData.country.name : '-' }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">详细地址：{{ currentData.address | filterNull }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">联系电话：{{ currentData.phone | filterNull }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">传真：{{ currentData.fax | filterNull }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">电子邮件：{{ currentData.email | filterNull }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">企业负责人：{{ currentData.personInCharge | filterNull }}</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">付款账期：{{ currentData.accountPeriod | filterNull }}天</el-col>
                          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">使用货币：{{ currentData.currency ? currentData.currency.name : '-' }}</el-col>
                        </el-row>
                      </div>
                      <div class="pd10">
                        <img :src="currentData.business && currentData.business.fileId ? `${$utils.CONFIG.api.image}?fileId=${currentData.business.fileId}` : defaultImg" width="88" height="88">
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><strong>联系人信息：</strong></el-col>
                  <el-col :span="24">
                    <el-table
                      :data="currentData.liaisonMens"
                      border
                      size="mini"
                      class="content-table"
                      style="width: 100%"
                    >
                      <el-table-column prop="name" label="联系人姓名" width="180" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="gender" label="性别" width="180" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="position" label="职位" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="phone" label="联系电话" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="email" label="电子邮件" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </template>
        </page-wrapper>
      </div>
    </div>

    <el-dialog title="客户档案" center :visible.sync="handle.update.dialogVisible" width="700px" v-dialogDrag v-loading="handle.update.isLoading">
      <el-form :model="handle.update.form" :rules="handle.update.rules" label-width="100px" ref="updateForm">
        <div class="dflex">
          <div class="flex">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="handle.update.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户简称" prop="abbreiation">
              <el-input v-model="handle.update.form.abbreiation" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户所在国" prop="countryId">
              <el-select v-model="handle.update.form.countryId" style="width: 100%;">
                <el-option v-for="(item, index) in $dict.countryList" :key="index" :label="item.name" :value="item.mrCountryId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="handle.update.form.address" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
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
                <el-form-item label="常用货币" prop="currencyId">
                  <el-select v-model="handle.update.form.currencyId" style="width: 100%;">
                    <el-option v-for="(item, index) in $dict.currencyList" :key="index" :label="item.name" :value="item.mrCurrencyId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="付款账期" prop="accountPeriod">
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
            :action="$utils.CONFIG.api.uploadFiles"
            list-type="picture-card"
            class="v-upload pdl10"
            name="files"
            :customerId="$utils.getStorage('userId')"
            :multiple="false"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-success="uploadSuccess "
            :on-error="uploadError"
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
                  <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'liaisonManNameEdit')">
                    <el-input size="mini" v-model="scope.row.liaisonManName" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'liaisonManNameEdit')" @blur="scope.row.liaisonManNameEdit = false" :style="{opacity: scope.row.liaisonManNameEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.liaisonManName }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="性别" width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'genderEdit')">
                    <el-input size="mini" v-model="scope.row.gender" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'genderEdit')" @blur="scope.row.genderEdit = false" :style="{opacity: scope.row.genderEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.gender }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="职位" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'positionEdit')">
                    <el-input size="mini" v-model="scope.row.position" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'positionEdit')" @blur="scope.row.positionEdit = false" :style="{opacity: scope.row.positionEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.position }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="联系电话" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'phoneEdit')">
                    <el-input size="mini" v-model="scope.row.phone" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'phoneEdit')" @blur="scope.row.phoneEdit = false" :style="{opacity: scope.row.phoneEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.phone }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="电子邮件" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'emailEdit')">
                    <el-input size="mini" v-model="scope.row.email" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'emailEdit')" @blur="scope.row.emailEdit = false" :style="{opacity: scope.row.emailEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.email }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="备注" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.liaisonManList, scope.$index, 'remarkEdit')">
                    <el-input size="mini" v-model="scope.row.remark" @focus="showInput(handle.update.form.liaisonManList, scope.$index, 'remarkEdit')" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.remark }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('updateForm')">保 存</el-button>
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
        defaultImg: require('../../../assets/img/img1.svg'),
        liaisonManDefault: {
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
        },
        right: {
          activeIndex: 0,
          isLoading: false
        },
        handle: {
          update: {
            dialogVisible: false,
            isLoading: false,
            handleType: 'add',
            form: {
              fileId: '',
              customerName: '',
              customerType: 10,
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
              liaisonManList: [],
              remark: ''
            },
            rules: {
              customerName: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
                { max: 20, message: this.$utils.getTipText('error', '-1011')}
              ],
              abbreiation: [
                { required: true, message: this.$utils.getTipText('error', '-1012')}
              ],
              countryId: [
                { required: true, message: this.$utils.getTipText('error', '-1013')}
              ],
              currencyId: [
                { required: true, message: this.$utils.getTipText('error', '-1017')}
              ],
              accountPeriod: [
                { required: true, message: this.$utils.getTipText('error', '-1018')}
              ],
              address: [
                { required: true, message: this.$utils.getTipText('error', '-1014')}
              ],
              phone: [
                { validator: this.$validator.checkPhone}
              ],
            }
          }
        }
      };
    },
    methods: {
      getLeftList() { //获取左侧列表数据

        let params = {
          _PAGE: this.left.page.currentPage,
          _PAGE_SIZE: this.left.page.limit,
        }
        if(this.form.text) params.name = this.form.text;

        this.left.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.customerQwaip, (res) => {

          this.left.list = res.data.content;
          if(this.left.list.length) {

            this.left.activeId = this.left.list[0].mrCustomerId;
            this.currentData = this.left.list[0];
          }
          this.left.isLoading = false;
        }, () => this.left.isLoading = false, params)
      },
      resetForm(formName) {

        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      resetLiaisonMan() {
        this.handle.update.form.liaisonManList = [
          Object.assign({}, this.liaisonManDefault),
          Object.assign({}, this.liaisonManDefault)
        ]
      },
      setFormData(item) {

        let liaisonManList = []
        item.liaisonMens.forEach(data => {

          let liaisonMan = Object.assign({}, this.liaisonManDefault);
          liaisonMan.liaisonManId = data.mrLiaisonManId;
          liaisonMan.liaisonManName = data.name;
          liaisonMan.gender = data.gender;
          liaisonMan.position = data.position;
          liaisonMan.phone = data.phone;
          liaisonMan.email = data.email;
          liaisonMan.remark = data.remark;
          liaisonManList.push(liaisonMan);
        })

        if(!liaisonManList.length) {

          liaisonManList = [
            Object.assign({}, this.liaisonManDefault),
            Object.assign({}, this.liaisonManDefault)
          ];
        }else if(liaisonManList.length == 1) {

          liaisonManList.push(Object.assign({}, this.liaisonManDefault));
        }

        this.handle.update.form = {
          customerId: item.id,
          customerName: item.name,
          customerType: 10,
          abbreiation: item.abbreiation,
          countryId: item.countryId,
          currencyId: item.currencyId,
          accountPeriod: item.accountPeriod,
          address: item.address,
          industryNume: item.industryNume,
          phone: item.phone,
          valueScale: item.valueScale,
          fax: item.fax,
          email: item.email,
          personInCharge: item.personInCharge,
          personScale: item.personScale,
          liaisonManList: liaisonManList,
          remark: item.remark
        }
      },
      edit(type, formName, item) {

        this.handle.update.handleType = type;
        this.resetForm(formName);
        this.handle.update.dialogVisible = true
        if(this.handle.update.handleType == 'edit') this.setFormData(item);
      },
      handlePictureCardPreview(file) {

        this.faceUrl = file.url;
        this.addDialog.dialogVisible = true;
      },
      uploadSuccess(res) {

        this.handle.update.form.fileId = res.data[0].fileId;
      },
      uploadError() {

        this.handle.update.form.fileId = '';
      },
      showInput(list, index, key) {

        list[index][key] = true;
        if(list.length -1 == index) list.push(Object.assign({}, this.liaisonManDefault))
      },
      handleSelect(item) {
        this.left.activeId = item.id;
        this.currentData= item;
      },
      saveFile() {
        let params = {
          fileId: this.handle.update.form.fileId,
          customerId: this.$utils.getStorage('userId')
        }
        this.$utils.getJson(this.$utils.CONFIG.api.saveCustomerHeadPortraits, (res) => {

        }, () => this.isLoading = false, params)
      },
      submitForm(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {

            let url = this.handle.update.handleType == 'add' ? this.$utils.CONFIG.api.saveCustomer : this.$utils.CONFIG.api.modifyCustomerInfo;
            let params = Object.assign({}, this.handle.update.form);
            params.valueScale = parseInt(params.valueScale);
            params.personScale = parseInt(params.personScale);
            params.liaisonManList = [];
            this.handle.update.form.liaisonManList.forEach(item => {
              if(item.liaisonManName && item.gender && item.position && item.phone) {
                params.liaisonManList.push({
                  liaisonManName: item.liaisonManName,
                  gender: item.gender,
                  position: item.position,
                  phone: item.phone,
                  email: item.email,
                  remark: item.remark
                });
              }
            })
            this.handle.update.form.fileId && this.saveFile();

            this.handle.update.isLoading = true;
            this.$utils.getJson(url, (res) => {

              this.handle.update.isLoading = false;
              this.handle.update.dialogVisible = false;
              this.search();
              this.$utils.showTip('success', 'success', '102');
            }, () => this.handle.update.isLoading = false, params)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      search() {
        this.left.page.currentPage = 0;
        this.getLeftList();
      }
    },
    created() {
      this.resetLiaisonMan();
      this.search();
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