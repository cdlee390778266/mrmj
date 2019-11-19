<template>
  <div class="posFull pdlr10" v-loading="isLoading" style="top: 40px;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-copy"></i> 当前位置：委外加工->到货登记
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main" style="top: 28px;">
      <div class="calc">
        <div class="mgt20 pdlr10">
          <div class="mgb10">
             <span>采购订单号：{{data.purchaseOrderNo | filterNull}}</span>
             <span class="mgl20">供应商：{{data.name | filterNull}}</span>
             <span class="mgl20">联系人：{{data.purchaseOrderNo | filterNull}}</span>
             <span class="mgl20">增值税率：{{data.purchaseOrderNo | filterNull}}%</span>
          </div>
          <div class="mgb5">
            录入到货零件的合格数量等信息，确认零件到货
          </div>
          <el-table
            :data="data.contents"
            border
            size="mini"
            style="width: 100%;"
            class="content-table edit-table"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"
              align="center"
              fixed="left">
            </el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="mouldNo" label="模具号" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="零件号" class-name="notEdit" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                {{scope.row.components | concatString('componentNo')}}
              </template>
            </el-table-column>
            <el-table-column label="零件数量" class-name="notEdit" width="100" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                {{scope.row.components | concatString('quantity')}}
              </template>
            </el-table-column>
            <el-table-column prop="machineQuantity" label="加工数量" class-name="notEdit" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="machineUnit" label="单位" class-name="notEdit" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="工序" class-name="notEdit" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                {{scope.row.processes | concatString('processName')}}
              </template>
            </el-table-column>
            <el-table-column prop="requireDeliveryDateString" label="要求交货期" class-name="notEdit" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="到货日期" show-overflow-tooltip align="center" width="120">
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'arrivalDateStringEdit', {}, false)">
                    <div class="ellipsis tc">{{ scope.row.arrivalDateString }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.arrivalDateString"
                      @focus="showInput(data.contents, scope.$index, 'arrivalDateStringEdit', {}, false)"
                      @blur="scope.row.arrivalDateStringEdit = false"
                      :style="{opacity: scope.row.arrivalDateStringEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="包数" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'packageNumEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.packageNum }}</div>
                    <el-input size="mini" v-model="scope.row.packageNum" @focus="showInput(data.contents, scope.$index, 'packageNumEdit', {}, false)" @blur="scope.row.packageNumEdit = false" :style="{opacity: scope.row.packageNumEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="准时包数" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'punctualPackageNumEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.punctualPackageNum }}</div>
                    <el-input size="mini" v-model="scope.row.punctualPackageNum" @focus="showInput(data.contents, scope.$index, 'punctualPackageNumEdit', {}, false)" @blur="scope.row.punctualPackageNumEdit = false" :style="{opacity: scope.row.punctualPackageNumEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="合格" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'qualifiedNumEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.qualifiedNum }}</div>
                    <el-input size="mini" v-model="scope.row.qualifiedNum" @focus="showInput(data.contents, scope.$index, 'qualifiedNumEdit', {}, false)" @blur="scope.row.qualifiedNumEdit = false" :style="{opacity: scope.row.qualifiedNumEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="修" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'maintainNumEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.maintainNum }}</div>
                    <el-input size="mini" v-model="scope.row.maintainNum" @focus="showInput(data.contents, scope.$index, 'maintainNumEdit', {}, false)" @blur="scope.row.maintainNumEdit = false" :style="{opacity: scope.row.maintainNumEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="试用" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'tryOutNumEdit', {}, false)">
                    <div class="ellipsis">{{ scope.row.tryOutNum }}</div>
                    <el-input size="mini" v-model="scope.row.tryOutNum" @focus="showInput(data.contents, scope.$index, 'tryOutNumEdit', {}, false)" @blur="scope.row.tryOutNumEdit = false" :style="{opacity: scope.row.tryOutNumEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="报废" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'scrapNumEdit', {}, false)">
                    <div class="emmipsis">{{ scope.row.scrapNum }}</div>
                    <el-input size="mini" v-model="scope.row.scrapNum" @focus="showInput(data.contents, scope.$index, 'scrapNumEdit', {}, false)" @blur="scope.row.scrapNumEdit = false" :style="{opacity: scope.row.scrapNumEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="备注" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(data.contents, scope.$index, 'remarkEdit', {}, false)">
                    <div class="ennipsis">{{ scope.row.remark }}</div>
                    <el-input size="mini" v-model="scope.row.remark" @focus="showInput(data.contents, scope.$index, 'remarkEdit', {}, false)" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
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
      mrPurchaseOrderId: '',
      multipleSelection: [],
      data: {
        contents: []
      }
    };
  },
  methods: {
    getData() {

      let params = {
        mrPurchaseOrderId: this.mrPurchaseOrderId,
        type: 'NoArrivalGoods'
      };
     
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.queryOutSourceArrivalInfo, (res) =>  {

        this.isLoading = false;
        this.data = res.data || {contents: []};
        this.data.contents.map(item => {

          if(!item.arrivalDateString) {

            item.arrivalDateString = new Date().Format('yyyy-MM-dd'); 
          }
        })
      }, () => this.isLoading = false, params)
    },
    handleSelectionChange(val) {

      this.multipleSelection = val;
    },
    save() {

      let params = [];

      if(!this.multipleSelection.length) {

        this.$utils.showTip('warning', 'error', '-1101')
        return;
      }

      this.multipleSelection.map(item => {

        params.push({
          purchaseOrderId: item.mrOutsourcePurchaseOrderId,
          arrivalDate: item.arrivalDateString || '',
          packageNum: parseInt(item.packageNum) || '',
          punctualPackageNum: parseInt(item.punctualPackageNum) || '',
          qualifiedNum: parseInt(item.qualifiedNum) || '',
          tryOutNum: parseInt(item.tryOutNum) || '',
          maintainNum: parseInt(item.maintainNum) || '',
          scrapNum: parseInt(item.scrapNum) || '',
          remark: item.remark || '',
        })
      })
      
      this.isLoading = true;
      this.$utils.getJson(this.$utils.CONFIG.api.saveOutsourceGoods, (res) =>  {

        this.isLoading = false;
        this.$utils.showTip('success', 'success', '102');
        this.back();
      }, () => this.isLoading = false, params)
    },
  },
  created() {

    if(!this.$route.params.id) return;
    this.mrPurchaseOrderId = this.$route.params.id;
    this.getData();
  }
};
</script>


<style scoped lang="scss">
	
</style>
