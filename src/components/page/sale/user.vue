<template>
  <div>
    <div class="main">
      <div class="posFull pd15">
        <div class="mgtb10">
          <el-form :model="form" :inline="true" label-width="40px" ref="form" class="table-out">
            <el-form-item label="客户" prop="customerName">
              <el-input v-model="form.parameter" style="width: 170px" />
            </el-form-item>
            <el-form-item label="区域" prop="customerName">
              <el-input v-model="form.parameter" style="width: 170px" />
            </el-form-item>
            <el-form-item label="国家" prop="customerName">
              <el-input v-model="form.parameter" style="width: 170px" />
            </el-form-item>
            <el-form-item label="" class="pdl40">
              <el-button type="primary" size="small">查询</el-button>
              <el-button type="primary" size="small">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="left.list"
          :height="maxHeight"
          :max-height="maxHeight"
          size="mini"
          stripe
          class="content-table"
          style="width: 100%"
          v-loading="left.isLoading"
        >
          <el-table-column prop="name" label="客户姓名" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="abbreviation" label="客户简称" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="address" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="所在国家" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="常用联系人" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.liaisonMens | concatString('name', ',')}}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="付款账期" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="结算货币" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="操作" width="260" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="edit('edit', 'updateForm', scope.row)">修改</el-button>
              <el-button type="success" size="mini">详情</el-button>
              <el-button type="info" size="mini">历史事件</el-button>
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="客户档案" center :visible.sync="handle.update.dialogVisible" width="800px">
      <el-form :model="handle.update.form" :rules="handle.update.rules" v-loading="handle.update.isLoading" label-width="100px" ref="updateForm">
        <div class="dflex">
          <div class="flex pdr10">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="handle.update.form.customerName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户简称" prop="abbreviation">
              <el-input v-model="handle.update.form.abbreviation" auto-complete="off"></el-input>
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
                <el-form-item label="传真" prop="fax">
                  <el-input v-model="handle.update.form.fax" auto-complete="off" aria-placeholder="请输入传真"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电子邮件" prop="email">
                  <el-input v-model="handle.update.form.email" auto-complete="off" aria-placeholder="请输入电子邮件"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="企业负责人" prop="personInCharge">
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
            class="avatar-uploader"
            name="files"
            ref="upload"
            :action="$utils.CONFIG.api.uploadFiles"
            :customerId="$utils.getStorage('userId')"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="handle.update.form.userFace" :src="handle.update.form.userFace" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
        filter: {
          
        },
        handle: {
          update: {
            dialogVisible: false,
            isLoading: false,
            handleType: 'add',
            form: {
              fileId: '',
              userFace: '',
              customerName: '',
              customerType: 10,
              abbreviation: '',
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
              abbreviation: [
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
                
              ],
            }
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        let params = {
          customerType: 10,
          type: this.filter.selectedValue,
          offset: this.left.page.offset || 0,
          limit: this.left.page.limit || 1000,
          sorting: '_MrCustomer.name'
        }
        
        if(this.form.text) params.name = this.form.text;

        this.getData(this.$utils.CONFIG.api.customerQcip, params, 'mrCustomerId', loadingKey);
      },
      
      resetLiaisonMan() {
        this.handle.update.form.liaisonManList = [
          Object.assign({}, this.liaisonManDefault),
          Object.assign({}, this.liaisonManDefault)
        ]
      },
      setFormData(item) {

        let liaisonManList = []
        item.liaisonMens && item.liaisonMens.forEach(data => {

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
          fileId: item.business && item.business.fileId ? item.business.fileId : '',
          userFace: item.business && item.business.fileId ? `${this.$utils.CONFIG.api.image}?fileId=${item.business.fileId}` : '',
          mrCustomerId: item.mrCustomerId || '',
          customerName: item.name,
          customerType: 10,
          abbreviation: item.abbreviation,
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
        this.resetUpload();
        this.resetForm(formName);
        this.handle.update.dialogVisible = true
        this.setFormData(this.handle.update.handleType == 'edit' ? item : {})
      },
      
      showInput(list, index, key) {

        list[index][key] = true;
        if(list.length -1 == index) list.push(Object.assign({}, this.liaisonManDefault))
      },
      handleAvatarSuccess(res, file) { //上传头像
        
        this.handle.update.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.update.form.fileId = res.data[0].fileId;
      },
      submitForm(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {

            let url = this.handle.update.handleType == 'add' ? this.$utils.CONFIG.api.saveCustomer : this.$utils.CONFIG.api.modifyCustomerInfo;
            let params = Object.assign({}, this.handle.update.form);
            params = {
              fileId: this.handle.update.form.fileId,
              mrCustomerId: this.handle.update.form.mrCustomerId || '',
              name: this.handle.update.form.customerName,
              abbreviation: this.handle.update.form.abbreviation,
              customerType: 10,
              countryId: this.handle.update.form.countryId,
              currencyId: this.handle.update.form.currencyId,
              accountPeriod: this.handle.update.form.accountPeriod,
              address: this.handle.update.form.address,
              industryNume: this.handle.update.form.industryNume,
              phone: this.handle.update.form.phone,
              industryNume: this.handle.update.form.industryNume,
              fax: this.handle.update.form.fax,
              email: this.handle.update.form.email,
              personInCharge: this.handle.update.form.personInCharge,
              valueScale: parseInt(this.handle.update.form.valueScale) || 0,
              personScale: parseInt(this.handle.update.form.personScale) || '',
              liaisonMens: []
            }
            params.liaisonMens = [];
            this.handle.update.form.liaisonManList.forEach(item => {
              if(item.liaisonManName && item.gender && item.position && item.phone) {
                params.liaisonMens.push({
                  mrLiaisonManId: item.liaisonManId || '',
                  name: item.liaisonManName,
                  gender: item.gender,
                  position: item.position,
                  phone: item.phone,
                  email: item.email,
                  remark: item.remark
                });
              }
            })

            this.handle.update.isLoading = true;
            this.$utils.getJson(url, (res) => {

              this.closeDialog();
              this.search();
            }, () => this.handle.update.isLoading = false, params)
          } else {
            return false;
          }
        });
      }
    },
    created() {
      
      this.resetLiaisonMan();
      this.search();
    },
    updated() {
      this.setTableMaxHeight();
      window.onresize = this.setTableMaxHeight;
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