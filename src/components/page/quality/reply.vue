<template>
  <div class="posFull pdlr10" v-loading="isLoading" style="top: 40px;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：售后反馈->客户投诉回复
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 18px;">
      <div class="calc">
        <div class="mgt20 pdlr10">
          <el-row style="line-height: 22px;">
            <el-row :span="24" class="mgb5"><strong>客诉信息</strong></el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户：{{tabs.calc.a | filterNull}}</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系人：{{tabs.calc.b | filterNull}}</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">职务：{{tabs.calc.cc | filterNull}}</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">联系电话：{{tabs.calc.c | filterNull}}</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">邮箱地址：{{tabs.calc.d | filterNull}}</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：{{tabs.calc.e | filterNull}}</el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">投诉单号：{{tabs.calc.f | filterNull}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="mgt10">投诉附件：</el-col>
            <el-col :span="24">
              <el-table
                :data="tabs.calc.g"
                border
                size="mini"
                class="content-table"
                style="width: 100%"
              >
                <el-table-column prop="fileName" label="资料名称"></el-table-column>
                <el-table-column width="100" label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:void(0);" style="color: #3375AB;" @click="down(scope.row.fileId)">下载</a>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="24" class="pdb40">
              <div v-for="(item, index) in tabs.calc.h" :key="index">
                <el-divider class="mgtb20"></el-divider>
                <el-row>
                  <el-col :span="24"><strong>客诉零件</strong></el-col>
                  <el-col :span="24">
                    <span>零件号：{{item.a | filterNull}}</span>
                  </el-col>
                  <el-col :span="24">
                    <div class="dflex">
                      <div>情况说明：</div>
                      <div class="flex">
                        {{item.b | filterNull}}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="24" class="mgt10">
                    <span>
                      投诉类别：
                      <el-select v-model="item.type" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in filter.type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </span>
                  </el-col>
                  <el-col :span="24" class="mgt10">
                    <div class="dflex">
                      <div>解决改善方案：</div>
                      <div class="flex">
                        <el-input type="textarea" v-model="item.solve" />
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="24" class="mgt10">
                    <span>
                      改善效果：
                      <el-select v-model="item.type" placeholder="请选择" size="mini">
                        <el-option
                          v-for="item in filter.effect"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </span>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="detail-footer tr">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button type="primary" @click="back">返 回</el-button>
    </div>
  </div>
</template>

<script>
import leftMixin from '../../../js/left-mixin'
export default {
  mixins: [leftMixin],
  data() {
    return {
      activeTab: "calc",
      isLoading: false,
      filter: {
        type: [],
        effect: []
      },
      tabs: {
        calc: {},
        preview: {}
      }
    };
  },
  methods: {
    getData() { //获取列表

      let params = {

      };
      let mock = {
        a: 'A公司',
        b: '张二旺',
        cc: '采购经理',
        c: '13684054888',
        d: '26895778@qq.com',
        e: '12345678',
        f: '1231231',
        g: [
          {
            fileName: '172988图纸',
            fileId: 'crQhc2flTyetPwbJ'
          }
        ],
        h: [
          {
            a: '406',
            b: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.',
          },
          {
            a: '588',
            b: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.',
          }
        ]
      }

      this.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.isLoading = false;
        this.tabs.calc = res.data || [];
      }, () => this.isLoading = false, params, mock)
    },
    save() {

      let params = {

      };
      
      this.isLoading = true;
      this.$utils.mock(this.$utils.CONFIG.api.terminateOrPauseOrder, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '102');
        this.back();
      }, () => this.isLoading = false, params)
    },
  },
  created() {

    this.getData();
  }
};
</script>

<style scoped lang="scss">
</style>