<template>
  <div>
    <div class="main">
      <div class="posFull pd15">
        <div class="mgtb10">
          <el-form :model="form" :inline="true" label-width="40px" ref="form" class="table-out">
            <el-form-item label="客户" prop="name">
              <el-input v-model="form.name" placeholder="请输入客户" style="width: 170px" />
            </el-form-item>
            <el-form-item label="区域" prop="areaName">
              <el-select v-model="form.areaName" clearable placeholder="请选择区域" style="width: 170px">
                <el-option :label="item.areaName" :value="item.areaName" v-for="(item, index) in $dict.areaList" :index="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="countryName">
              <el-select v-model="form.countryName" clearable placeholder="请选择国家" style="width: 170px">
                <el-option :label="item.countryName" :value="item.countryName" v-for="(item, index) in $dict.countryList" :index="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" class="pdl40">
              <el-button type="primary" size="small" @click="filterDada">查询</el-button>
              <el-button type="primary" size="small" @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="table.data"
          :height="maxHeight"
          :max-height="maxHeight"
          size="mini"
          stripe
          class="content-table"
          style="width: 100%"
          v-loading="table.isLoading"
        >
          <el-table-column prop="name" label="客户姓名" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="abbreviation" label="客户简称" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="所在区域" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.area && scope.row.area.areaName ? scope.row.area.areaName : '-'}}
            </template>
          </el-table-column>
          <el-table-column label="所在国家" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.country && scope.row.country.countryName ? scope.row.country.countryName : '-'}}
            </template>
          </el-table-column>
          <el-table-column label="常用联系人" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.contacts | concatString('name', ',')}}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="paymentPeriod" label="付款账期" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="currencyName" label="结算货币" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="操作" width="260" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="edit('edit', 'updateForm', scope.row)">修改</el-button>
              <el-button type="success" size="mini" @click="showDetail(scope.row)">详情</el-button>
              <el-button type="info" size="mini" @click="showHistory(scope.row)">历史事件</el-button>
              <el-button type="danger" size="mini" @click="delCustomer(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="客户档案" center :visible.sync="handle.update.dialogVisible" width="800px">
      <el-form :model="handle.update.form" :rules="handle.update.rules" v-loading="handle.update.isLoading" label-width="100px" ref="updateForm">
        <div class="dflex">
          <div class="flex pdr10">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="handle.update.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户简称" prop="abbreviation">
              <el-input v-model="handle.update.form.abbreviation" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户所在国" prop="country">
              <el-select v-model="handle.update.form.country" style="width: 100%;" value-key="countryName">
                <el-option v-for="item in $dict.countryList" :key="item.countryName" :label="item.countryName" :value="item"></el-option>
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
                <el-form-item label="常用货币" prop="currency">
                  <el-select v-model="handle.update.form.currency" value-key="currencyName" style="width: 100%;">
                    <el-option v-for="item in $dict.currencyList" :key="item.currencyName" :label="item.currencyName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="付款账期" prop="paymentPeriod">
                  <div class="dflex">
                    <div class="flex">
                      <el-input type="number" v-model="handle.update.form.paymentPeriod" auto-complete="off" aria-placeholder="请输入付款账期"></el-input>
                    </div>
                    <div style="padding-left: 5px;">天</div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- <el-upload
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
          </el-upload> -->
        </div>
        <div>
          <p>业务联系人：</p>
          <el-table :data="handle.update.form.contacts" border size="mini" style="width: 100%" class="edit-table">
            <el-table-column prop="name" label="联系人姓名"	width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.contacts, scope.$index, 'nameEdit')">
                    <el-input size="mini" v-model="scope.row.name" @focus="showInput(handle.update.form.contacts, scope.$index, 'nameEdit')" @blur="scope.row.nameEdit = false" :style="{opacity: scope.row.nameEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.name }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="性别" width="88" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.contacts, scope.$index, 'genderEdit')">
                    <div class="ellipsis">
                      {{scope.row.gender}}
                    </div>
                    <el-select
                      v-model="scope.row.gender"
                      placeholder="请选择"
                      :style="{opacity: scope.row.genderEdit ? 1 : 0}"
                      @focus="showInput(handle.update.form.contacts, scope.$index, 'genderEdit')"
                      @blur="() => scope.row.genderEdit = 0">
                      <el-option label="男" value="男">
                      </el-option>
                      <el-option label="女" value="女">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="职位" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.contacts, scope.$index, 'positionEdit')">
                    <el-input size="mini" v-model="scope.row.position" @focus="showInput(handle.update.form.contacts, scope.$index, 'positionEdit')" @blur="scope.row.positionEdit = false" :style="{opacity: scope.row.positionEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.position }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="联系电话" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.contacts, scope.$index, 'phoneEdit')">
                    <el-input size="mini" v-model="scope.row.phone" @focus="showInput(handle.update.form.contacts, scope.$index, 'phoneEdit')" @blur="scope.row.phoneEdit = false" :style="{opacity: scope.row.phoneEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.phone }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="电子邮件" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.contacts, scope.$index, 'emailEdit')">
                    <el-input size="mini" v-model="scope.row.email" @focus="showInput(handle.update.form.contacts, scope.$index, 'emailEdit')" @blur="scope.row.emailEdit = false" :style="{opacity: scope.row.emailEdit ? 1 : 0}"/>
                    <div class="ellipsis">{{ scope.row.email }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.contacts, scope.$index, 'remarkEdit')">
                    <el-input size="mini" v-model="scope.row.remark" @focus="showInput(handle.update.form.contacts, scope.$index, 'remarkEdit')" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
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

    <el-dialog title="客户详情" center :visible.sync="handle.update.detailDialogVisible" width="660px">
      <div v-loading="handle.update.isLoading">
        <el-row class="lh26">
          <el-col :span="12">
            客户名称: {{handle.update.form.name | filterNull}}
          </el-col>
          <el-col :span="12">
            客户简称: {{handle.update.form.abbreviation | filterNull}}
          </el-col>
          <el-col :span="12">
            客户所在国: {{handle.update.form.countryName | filterNull}}
          </el-col>
          <el-col :span="12">
            详细地址: {{handle.update.form.address | filterNull}}
          </el-col>
          <el-col :span="12">
            联系电话: {{handle.update.form.phone | filterNull}}
          </el-col>
          <el-col :span="12">
            传真: {{handle.update.form.fax | filterNull}}
          </el-col>
          <el-col :span="12">
            电子邮件: {{handle.update.form.email | filterNull}}
          </el-col>
          <el-col :span="12">
            企业负责人: {{handle.update.form.personInCharge | filterNull}}
          </el-col>
          <el-col :span="12">
            常用货币: {{handle.update.form.currencyName | filterNull}}
          </el-col>
          <el-col :span="12">
            付款账期: {{handle.update.form.paymentPeriod | filterNull}}天
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>业务联系人：</p>
            <el-table :data="handle.update.form.contacts" border size="mini" style="width: 100%" class="edit-table">
              <el-table-column prop="name" label="联系人姓名"  width="100" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    {{ scope.row.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别" width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    {{scope.row.gender}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="职位" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    {{ scope.row.position }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="联系电话" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    {{ scope.row.phone }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="电子邮件" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    {{ scope.row.phone }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="备注" show-overflow-tooltip>
                <template scope="scope">
                  <div>
                    {{ scope.row.remark }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div class="dflex">
          <!-- <el-upload
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
          </el-upload> -->
        </div>
      </div>
    </el-dialog>

    <el-dialog title="历史事件" center :visible.sync="handle.history.dialogVisible" width="660px">
      <div v-loading="handle.history.isLoading" class="history">
        <div class="pos-relative" v-if="handle.history.data && handle.history.data.length">
          <div class="history-line"></div>
          <div class="history-item" v-for="(item, index) in handle.history.data">
            <div class="history-icon pointer">
              <!-- <i class="el-icon-circle-plus"></i> -->
              <i class="el-icon-remove"></i>
            </div>
            <div class="history-title">
              <strong>{{item.date}}</strong>
            </div>
            <div class="history-body">
              <div class="dflex mgt5">
                <div class="flex">
                  <strong>主题：</strong>
                  <span class="ellipsis" :title="item.title | filterNull">{{item.title | filterNull}}</span>
                </div>
                <div class="flex">
                  <strong>地点：</strong>
                  <span class="ellipsis" :title="item.address | filterNull">{{item.address | filterNull}}</span>
                </div>
              </div>
              <div class="mgt5">
                <p><strong>会议内容：</strong></p>
                <p>{{item.content | filterNull}}</p>
              </div>
              <div class="mgt5">
                <p>
                  <strong>处理状态：</strong>
                  <span>{{item.state | filterNull}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="empty" v-else>
            没有历史事件
        </div>
        <div>
          <div class="mgb5"><strong>增加历史事件</strong></div>
          <el-form size="mini" :model="handle.history.form" :rules="handle.history.rules" label-width="100px" ref="historyForm" class="bor pd10">
            <el-row class="mgb0">
              <el-col :span="12">
                <el-form-item label="主题" prop="title">
                  <el-input v-model="handle.history.form.title" size="mini" placeholder="请输入主题"/>
                </el-form-item>   
              </el-col>
              <el-col :span="12">
                <el-form-item label="地点" prop="address">
                  <el-input v-model="handle.history.form.address" size="mini" placeholder="请输入地点"/>
                </el-form-item>   
              </el-col>
              <el-col :span="12">
                <el-form-item label="时间" prop="date">
                  <el-date-picker
                    v-model="handle.history.form.date"
                    type="date"
                    placeholder="选择时间"
                    style="width: 100%;">
                  </el-date-picker>
                </el-form-item>   
              </el-col>
              <el-col :span="12">
                <el-form-item label="处理状态" prop="state">
                  <el-select v-model="handle.history.form.state" clearable placeholder="请选择区域">
                    <el-option label="已处理" value="已处理"></el-option>
                  </el-select>
                </el-form-item>   
              </el-col>
              <el-col :span="24">
                <el-form-item label="变更影响说明" prop="content">
                  <el-input type="textarea" v-model="handle.history.form.content" :rows="4" size="mini" placeholder="请输入变更影响说明" style="width: 100%" />
                </el-form-item>   
              </el-col>
            </el-row>
          </el-form>
          <div class="tr mgt20">
            <el-button type="primary" size="small" @click="addHistory">保存</el-button>
            <el-button type="primary" size="small" @click="handle.history.dialogVisible = false;">关闭</el-button>
          </div>
        </div>
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
        form: {
          name: '',
          areaName: '',
          countryName: ''
        },
        handle: {
          update: {
            detailDialogVisible: false,
            dialogVisible: false,
            isLoading: false,
            handleType: 'add',
            form: {
              fileId: '',
              userFace: '',
              name: '',
              customerType: 10,
              abbreviation: '',
              country: '',
              currency: '',
              address: '',
              phone: '',
              valueScale: '',
              province: '',
              city: '',
              distinct: '',
              fax: '',
              email: '',
              personInCharge: '',
              personScale: '',
              contacts: [],
              remark: ''
            },
            rules: {
              name: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
                { max: 20, message: this.$utils.getTipText('error', '-1011')}
              ],
              abbreviation: [
                { required: true, message: this.$utils.getTipText('error', '-1012')}
              ],
              country: [
                { required: true, message: this.$utils.getTipText('error', '-1013')}
              ],
              currency: [
                { required: true, message: this.$utils.getTipText('error', '-1017')}
              ],
              address: [
                { required: true, message: this.$utils.getTipText('error', '-1014')}
              ],
              phone: [
                
              ],
            }
          },
          history: {
            dialogVisible: false,
            isLoading: false,
            data: [],
            form: {
              title: '',
              address: '',
              date: '',
              state: ''
            },
            rules: {
              title: [
                { required: true, message: this.$utils.getTipText('error', '-1103')}
              ],
              address: [
                { required: true, message: this.$utils.getTipText('error', '-1104')}
              ],
              date: [
                { required: true, message: this.$utils.getTipText('error', '-1105')}
              ],
              state: [
                { required: true, message: this.$utils.getTipText('error', '-1106')}
              ],
            }
          }
        }
      };
    },
    methods: {
      getData() { 

        this.table.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryCustomerList, (res) => {

          this.table.isLoading = false;
          this.table.srcData = res.data || [];
          this.table.data = this.$utils.deepCopy(this.table.srcData);
        }, () => this.table.isLoading = false)
      },
      filterDada() {

        this.table.data = this.table.srcData.filter(item => {

          let name = false;
          if(!this.form.name || (this.form.name == item.name)) {
            name = true; 
          }

          let areaName = false;
          if(!this.form.areaName || (item.area && this.form.areaName == item.area.areaName)) {
            areaName = true; 
          }

          let countryName = false;
          if(!this.form.countryName || (item.country && this.form.countryName == item.country.countryName)) {
            countryName = true; 
          }

          return name && areaName && countryName;
        })
      },
      getDetail(item) {

        this.handle.update.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.customerDetail, (res) => {

          this.handle.update.isLoading = false;

          if(res.data.country && res.data.country.countryName) { //所在国家

            this.$dict.countryList.map(item => {

              if(item.countryName == res.data.country.countryName) {

                res.data.country = item;
              }
            })
          }else {

            res.data.country = {};
          }

          if(res.data.currencyId) { //常用货币

            this.$dict.currencyList.map(item => {

              if(item.currencyId == res.data.currencyId) {

                res.data.currency = item;
              }
            })
          }else {

            res.data.currency = {};
          }

          this.handle.update.form = res.data || {};
        }, () => this.handle.update.isLoading = false, {customerId: item.customerId})
      },
      edit(type, formName, item) { //修改

        this.$refs.updateForm && this.$refs.updateForm.resetFields();
        this.handle.update.handleType = type;
        this.handle.update.dialogVisible = true;

        this.getDetail(item);
      },
      showDetail(item) {

        this.handle.update.detailDialogVisible = true;
        this.getDetail(item);
      },
      handleAvatarSuccess(res, file) { //上传头像
        
        this.handle.update.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.update.form.fileId = res.data[0].fileId;
      },
      submitForm(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.handle.update.form.country.countryId)
            let url = this.handle.update.handleType == 'add' ? this.$utils.CONFIG.api.saveCustomer : this.$utils.CONFIG.api.editCustomer;
            let params = Object.assign({}, this.handle.update.form);
            params = {
              fileId: this.handle.update.form.fileId,
              customerType: 1,
              customerId: this.handle.update.form.customerId || '',
              name: this.handle.update.form.name,
              abbreviation: this.handle.update.form.abbreviation,
              countryId: this.handle.update.form.country.countryId,
              address: this.handle.update.form.address,
              phone: this.handle.update.form.phone,
              fax: this.handle.update.form.fax,
              email: this.handle.update.form.email,
              personInCharge: this.handle.update.form.personInCharge,
              currencyId: this.handle.update.form.currency.currencyId,
              paymentPeriod: this.handle.update.form.paymentPeriod,
              contacts: []
            }
            params.contacts = [];
            this.handle.update.form.contacts.forEach(item => {
              if(item.name && item.gender && item.position && item.phone) {
                params.contacts.push({
                  customerContactsId: item.customerContactsId || '',
                  name: item.name,
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

              this.handle.update.isLoading = false;
              this.handle.update.dialogVisible = false;
              this.$utils.showTip('success', 'success', '117')
              this.search();
            }, () => this.handle.update.isLoading = false, params)
          } else {
            return false;
          }
        });
      },
      showHistory(item) { //历史事件

        this.resetForm('historyForm');
        this.handle.history.dialogVisible = true;
        this.handle.history.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryCustomerMettingRecordList, (res) => {

          this.handle.history.isLoading = false;

          this.handle.history.data = res.data || [];
        }, () => this.handle.history.isLoading = false, {customerId: item.customerId})
      },
      addHistory() {

        this.$refs.historyForm.validate((valid) => {
          if (valid) {
            
            this.handle.history.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.history, (res) => {

              this.handle.history.dialogVisible = false;
              this.handle.history.isLoading = false;
              this.$utils.showTip('success', 'success', '117')
            }, () => this.handle.history.isLoading = false, this.handle.history.form)
          } else {
            return false;
          }
        });
      },
      delCustomer(item) {

        this.table.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.delCustomer, (res) => {

          this.table.isLoading = false;
          this.$utils.showTip('success', 'success', '116');
          this.search();
        }, () => this.table.isLoading = false, {customerId: item.customerId})
      },
    },
    created() {
      
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