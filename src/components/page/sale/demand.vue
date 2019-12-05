<template>
  <div>
    <div class="main">
      <div class="main-right" v-loading="right.isLoading">
        <div class="main-right-title tl">销售 / 报价管理</div>
        <div class="mgt20">
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
          :show-header="false"
          :data="left.list"
          :height="maxHeight"
          :max-height="maxHeight"
          size="mini"
          class="content-table"
          style="width: 100%"
          v-loading="left.isLoading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="所属店铺">
                  <span>{{ props.row.shop }}</span>
                </el-form-item>
                <el-form-item label="商品 ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="店铺 ID">
                  <span>{{ props.row.shopId }}</span>
                </el-form-item>
                <el-form-item label="商品分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <el-form-item label="店铺地址">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item label="商品描述">
                  <span>{{ props.row.desc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="客户姓名" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="abbreviation" label="客户简称" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="address" width="120" show-overflow-tooltip></el-table-column>
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
              <el-button type="primary" size="mini" @click="edit('edit', 'updateForm', scope.row)">修改项目</el-button>
              <el-button type="danger" size="mini">删除项目</el-button>
              <el-button type="success" size="mini">新增项目</el-button>
              <el-button type="info" size="mini">历史事件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog :title="`${handle.update.type == 'add' ? '新增' : '修改'}客户需求`" :visible.sync="handle.update.dialogVisible">
      <el-form ref="updateForm" :model="handle.update.form" :rules="handle.update.rules" label-width="100px" v-loading="handle.update.isLoading">
        <div class="dflex">
          <div class="flex pdr10">
            <el-form-item prop="name" label="客户">
              <el-input v-model="handle.update.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="customerPoNo" label="客户PO.号">
              <el-input v-model="handle.update.form.customerPoNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="
                requirementTypeText" label="需求类型">
                  <el-select v-model="handle.update.form.requirementTypeText">
                    <el-option label="模具零件" value="模具零件"></el-option>
                    <el-option label="整体模具" value="整体模具"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  prop="requirementNum" label="需求编号" v-show="handle.update.type == 'add'">
                  <el-input v-model="handle.update.form.requirementNum" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="handle.update.form.requirementTypeText == '整体模具'">
                <el-form-item  prop="deliveryDate" label="要求交期">
                  <el-date-picker
                    type="date"
                    size="mini"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: '98px'"
                    :clearable="false"
                    :editable="false"
                    v-model="handle.update.form.deliveryDate">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-upload
            class="avatar-uploader"
            name="files"
            ref="upload"
            :action="$utils.CONFIG.api.uploadFiles"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="handle.update.form.userFace" :src="handle.update.form.userFace" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="mgb20" v-show="handle.update.form.requirementTypeText == '模具零件'">
          <p>需求明细：</p>
          <el-table :data="handle.update.form.components" max-height="160" border size="mini" class="edit-table" style="width: 100%">
            <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.components, scope.$index, 'componentNoEdit', {})">
                    <div class="ellipsis">{{ scope.row.componentNo }}</div>
                    <el-input size="mini" v-model="scope.row.componentNo" @focus="showInput(handle.update.form.components, scope.$index, 'componentNoEdit', {}, false)" @blur="scope.row.componentNoEdit = false" :style="{opacity: scope.row.componentNoEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.components, scope.$index, 'customerNoEdit', {})">
                    <div class="ellipsis">{{ scope.row.customerNo }}</div>
                    <el-input size="mini" v-model="scope.row.customerNo" @focus="showInput(handle.update.form.components, scope.$index, 'customerNoEdit', {}, false)" @blur="scope.row.customerNoEdit = false" :style="{opacity: scope.row.customerNoEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" min-width="88" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.components, scope.$index, 'quantityEdit', {})">
                    <div class="ellipsis">{{ scope.row.quantity }}</div>
                    <el-input size="mini" v-model="scope.row.quantity" @focus="showInput(handle.update.form.components, scope.$index, 'quantityEdit', {}, false)" @blur="scope.row.quantityEdit = false" :style="{opacity: scope.row.quantityEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="要求交期" show-overflow-tooltip align="center" width="100">
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.components, scope.$index, 'deliveryDateStringEdit', {})">
                    <div class="ellipsis tc">{{ scope.row.deliveryDateString }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.deliveryDateString"
                      @focus="showInput(handle.update.form.components, scope.$index, 'deliveryDateStringEdit', {})"
                      @blur="scope.row.deliveryDateStringEdit = false"
                      :style="{opacity: scope.row.deliveryDateStringEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="说明" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.update.form.components, scope.$index, 'remarkEdit', {})">
                    <div class="ellipsis">{{ scope.row.remark }}</div>
                    <el-input size="mini" v-model="scope.row.remark" @focus="showInput(handle.update.form.components, scope.$index, 'remarkEdit', {}, false)" @blur="scope.row.remarkEdit = false" :style="{opacity: scope.row.remarkEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <p class="mgb10">
            上传附件：
            <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
              <el-button size="mini" type="primary">选择上传文件</el-button>
              <input type="file" name="file" ref="fileUpdate" class="posFull opacity0" @change="() => addAttachments($refs.fileUpdate, handle.update)">
            </span>
          </p>
          <el-table
            :data="handle.update.form.attachments"
            max-height="160"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="fileName" label="资料名称"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="deleteAttachments(scope.row, handle.update)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item prop="remark" label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.update.form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFileAndData(handle.update, uploadSuccess)">确 定</el-button>
        <el-button @click="handle.update.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看当前计划" :visible.sync="handle.plan.dialogVisible">
      <div v-loading="handle.plan.isLoading">
        <el-table
          :data="handle.plan.tableData"
          size="mini"
          style="width: 100%"
          class="edit-table"
          :highlight-current-row="true"
          :row-class-name="setRowClass">
          <el-table-column
            label="出货日期"
            width="120"
            label-class-name="fc-el-table-head"
            class-name="fc-red"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.shipmentDateString | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="mouldNo"
            sortable
            label="模具号"
            width="120"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.mouldNo | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="零件号码"
            min-width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}" >
                {{scope.row.components | concatString('componentNo')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            min-width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div :class="{'bg8db4e3 fcfff': scope.row.productionTasksStatus == 80}" >
                {{scope.row.components | concatString('quantity')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="versionNo"
            label="版本"
            width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.versionNo | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="整体外协"
            width="100"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{ 
                  scope.row.buy == 1 ? '是' : (
                     scope.row.buy == 0 ? '否' : ''
                  )
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工艺时间" align="center" min-width="100">
            <el-table-column
              v-for="(item, index) in allProcessOfIndex"
              :key="index"
              :label="item.name"
              align="center"
              min-width="70"
              label-class-name="fc-red"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <div
                :class="{
                  'fc-red': scope.row[item.key] > maxWorkTime,
                  'bg00b0f0 fcfff': scope.row.currentPlanProcessId == scope.row[item.key+'-id'],
                  'bg-green fcfff': scope.row.nextPlanProcessId == scope.row[item.key+'-id'],
                  'bgffff00': scope.row.workpieceLocationId == scope.row[item.key+'-id']}"
                  v-if="scope.row[item.key] || scope.row[item.key] == 0"
                  >
                  {{scope.row[item.key]}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="qc"
              label="Else"
              align="center"
              min-width="70"
              label-class-name="fc-blue"
              show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="requireCompletionDate"
            sortable
            label="要求交期"
            min-width="100"
            align="center"
            label-class-name="fc-el-table-head"
            class-name="fc-blue"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.requireCompletionDate | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="abbreviation"
            sortable
            label="客户"
            min-width="100"
            align="center"
            class-name="fc-blue"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.abbreviation | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="surplus"
            sortable
            label="交期剩余(天)"
            min-width="120"
            align="center"
            label-class-name="fc-el-table-head"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div :class="{fcfff: dateMinusBgColor(scope.row.surplus)}" :style="{background: dateMinusBgColor(scope.row.surplus)}"
              >
                {{scope.row.surplus}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="现状" class-name="fc800000" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{ scope.row.currentSituation }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="电极"
            min-width="100"
            align="center"
            label-class-name="fc-el-table-head"
            class-name="fc-blue"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div >
                {{scope.row.electrode | filterNull(' ')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="residueWorkTime"
            sortable
            label="剩余工时"
            min-width="100"
            align="center"
            label-class-name="fc-el-table-head"
            show-overflow-tooltip>
            <template scope="scope">
              <div :class="{'bgRed fcfff': scope.row.residueWorkTime > 200}" >{{scope.row.residueWorkTime | filterNull(' ')}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer mgt20 tr">
          <el-button @click="handle.plan.dialogVisible = false">关 闭</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="终止原因" :visible.sync="handle.stop.dialogVisible" width="500px">
      <el-form ref="stopForm" :model="handle.stop.form" :rules="handle.stop.rules" label-width="110px" v-loading="handle.stop.isLoading">
        <el-form-item prop="causeTypeText" label="需求终止原因" class="mgt20">
          <el-input v-model="handle.stop.form.causeTypeText"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.stop.form.description" class="v-textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="stop">确 定</el-button>
        <el-button @click="handle.stop.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增模具零件订单" :visible.sync="handle.order.dialogVisible" width="820px">
      <el-form ref="orderForm" :model="handle.order.form" :rules="handle.order.rules" label-width="110px" v-loading="handle.order.isLoading">
        <div class="dflex">
          <div class="flex pdr10">
            <el-form-item prop="name" label="客户">
              <el-input v-model="handle.order.form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="customerPoNo" label="客户PO.号">
              <el-input v-model="handle.order.form.customerPoNo" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="mouldNo" label="模具号">
              <el-input v-model="handle.order.form.mouldNo" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="
              requirementTypeText" label="需求类型">
              <el-select v-model="handle.order.form.requirementTypeText">
                <el-option label="模具零件" value="模具零件"></el-option>
                <el-option label="整体模具" value="整体模具"></el-option>
              </el-select>
            </el-form-item> -->
          </div>
          <el-upload
            class="avatar-uploader"
            name="files"
            :action="$utils.CONFIG.api.uploadFiles"
            :show-file-list="false"
            :on-success="handleAvatarOrderSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="handle.order.form.userFace" :src="handle.order.form.userFace" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="mgb20">
          <p>零件清单：</p>
          <el-table :data="handle.order.form.componentOrders" max-height="160" border size="mini" class="edit-table" style="width: 100%">
            <el-table-column label="零件号" min-width="100" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'componentNoEdit', {})">
                    <div class="ellipsis">{{ scope.row.componentNo }}</div>
                    <el-input size="mini" v-model="scope.row.componentNo" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'componentNoEdit', {}, false)" @blur="scope.row.componentNoEdit = false" :style="{opacity: scope.row.componentNoEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" min-width="88" show-overflow-tooltip align="center">
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'quantityEdit', {})">
                    <div class="ellipsis">{{ scope.row.quantity }}</div>
                    <el-input size="mini" v-model="scope.row.quantity" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'quantityEdit', {}, false)" @blur="scope.row.quantityEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.quantityEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="客户编号" min-width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'customerNoEdit', {})">
                    <div class="ellipsis">{{ scope.row.customerNo }}</div>
                    <el-input size="mini" v-model="scope.row.customerNo" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'customerNoEdit', {}, false)" @blur="scope.row.customerNoEdit = false" :style="{opacity: scope.row.customerNoEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="要求交期" show-overflow-tooltip align="center" width="100">
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'deliveryDateEdit', {})">
                    <div class="ellipsis tc">{{ scope.row.deliveryDate }}</div>
                    <el-date-picker
                      type="date"
                      size="mini"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="scope.row.deliveryDate"
                      @focus="showInput(handle.order.form.componentOrders, scope.$index, 'deliveryDateEdit', {})"
                      @blur="scope.row.deliveryDateEdit = false"
                      :style="{opacity: scope.row.deliveryDateEdit ? 1 : 0}">
                    </el-date-picker>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center" min-width="88" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'componentPriceEdit', {})">
                    <div class="ellipsis">{{ scope.row.componentPrice }}</div>
                    <el-input size="mini" v-model="scope.row.componentPrice" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'componentPriceEdit', {}, false)" @blur="scope.row.componentPriceEdit = false; scope.row.componentTotal = (parseInt(scope.row.quantity) || 0) * (parseFloat(scope.row.componentPrice) || 0)" :style="{opacity: scope.row.componentPriceEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="componentTotal" label="总价" min-width="88" align="center" class="notEdit" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="说明" show-overflow-tooltip>
              <template scope="scope">
                <div>
                  <div @click="showInput(handle.order.form.componentOrders, scope.$index, 'descriptionEdit', {})">
                    <div class="ellipsis">{{ scope.row.description }}</div>
                    <el-input size="mini" v-model="scope.row.description" @focus="showInput(handle.order.form.componentOrders, scope.$index, 'descriptionEdit', {}, false)" @blur="scope.row.descriptionEdit = false" :style="{opacity: scope.row.descriptionEdit ? 1 : 0}"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <div class="mgb10 dflex el-form-item-mgb0" style="line-height: 32px;">
            {{saleTotalPrice}}
            <div class="flex">订单总价(RMB)：{{handle.order.form.saleTotalPrice}}</div>
            <div class="flex">
              <el-form-item prop="currency" label="常用货币">
                <el-select size="mini" v-model="handle.order.form.currency" value-key="name"  @change="(currency) => handle.order.form.settlementExchangeRate = ''">
                  <el-option v-for="(item, index) in $dict.currencyList" :key="item.name" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item prop="settlementExchangeRate" label="汇率">
                <el-select size="mini" v-model="handle.order.form.settlementExchangeRate">
                  <template v-if="handle.order.form.currency">
                    <el-option v-for="(item, index) in handle.order.form.currency.currencyRates" :key="index" :label="item.value" :value="item.value"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex">
              <el-form-item prop="settlementCurrencyTotalPrice" label="结算货币总价:">
                <el-input size="mini" v-model="handle.order.form.settlementCurrencyTotalPrice" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </div>
          <p class="mgb10">
            上传附件：
            <span class="pos-relative overflowHidden" style="display: inline-block;top: 8px;">
              <el-button size="mini" type="primary">选择上传文件</el-button>
              <input type="file" name="file" ref="fileOrder" class="posFull opacity0" @change="() => addAttachments($refs.fileOrder, handle.order)">
            </span>
          </p>
          <el-table
            :data="handle.order.form.attachments"
            height="160"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column prop="fileName" label="资料名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="deleteAttachments(scope.row, handle.order)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="说明" class="mgt20">
          <el-input type="textarea" v-model="handle.order.form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handle.order.judgeType = 1; checkMouldNo();">下达订单</el-button>
        <el-button type="primary" @click="handle.order.judgeType = 2;saveFileAndData(handle.order, saveOrder);">存为草稿</el-button>
        <el-button @click="handle.order.dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import leftMixin from '../../../js/left-mixin'
  export default {
    mixins: [leftMixin],
    data() {

      var checkNumber = (rule, value, callback) => { //需求编号验重
        if (!value) {
          return callback(new Error(this.$utils.getTipText('error', '-1087')));
        }

        if(this.handle.update.type != 'add') {
          return callback();
        }
        
        this.$utils.getJson(this.$utils.CONFIG.api.checkRequirementNum, (res) => {

          if(res.data != 1) { //如果编号重复

            callback(new Error(this.$utils.getTipText('error', '-1088')));
          }else {
            callback();
          }
        }, null, {requirementNum: value})
      };

      return {
        left: {
          form: {
            parameter: ''
          }
        },
        handle: {
          update: {
            dialogVisible: false,
            isLoading: false,
            type: 'add',
            item: {},
            attachments: [],
            addFiles: [],
            form: {
              userFace: '',
              fileId: "",
              name: "",
              customerPoNo: "",
              requirementTypeText: "模具零件",
              requirementNum: "",
              deliveryDateString: new Date(),
              components: [{}],
              attachments: [],
              remark: ''
            },
            rules: {
              name: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
              ],
              customerPoNo: [
                { required: true, message: this.$utils.getTipText('error', '-1086')},
              ],
              requirementNum: [
                { validator: checkNumber, trigger: 'blur' }
              ]
            }
          },
          plan: {
            dialogVisible: false,
            isLoading: false,
            tableData: []
          },
          stop: {
            dialogVisible: false,
            isLoading: false,
            data: {},
            form: {
              causeTypeText: "",
              description: ""
            },
            rules: {
              causeTypeText: [
                { required: true, message: this.$utils.getTipText('error', '-1085')},
              ]
            }
          },
          order: {
            dialogVisible: false,
            isLoading: false,
            judgeType: 1,
            item: {},
            attachments: [],
            addFiles: [],
            form: {
              currency: {},
              userFace: '',
              fileId: "",
              name: '', 
              mouldNo: '', 
              customerPoNo: '',
              saleOrderTypeText: '',
              settlementCurrency: '',
              settlementExchangeRate: '',
              settlementCurrencyTotalPrice: '',
              saleTotalPrice: '',
              components: [],
              attachments: [],
              remark: ''
            },
            rules: {
              name: [
                { required: true, message: this.$utils.getTipText('error', '-1010')},
              ],
              customerPoNo: [
                { required: true, message: this.$utils.getTipText('error', '-1086')},
              ],
              mouldNo: [
                { required: true, message: this.$utils.getTipText('error', '-1090')},
              ],
              settlementExchangeRate: [
                { required: true, message: this.$utils.getTipText('error', '-1092')},
              ],
              settlementCurrencyTotalPrice: [
                { required: true, message: this.$utils.getTipText('error', '-1093')},
              ],
            }
          }
        }
      };
    },
    methods: {
      getLeftList(loadingKey = 'isLoading') { //获取左侧列表数据

        let params = {
          parameter: this.left.form.parameter,
          type: this.filter.selectedValue,
          pageNo: this.left.page.pageNo,
          pageSize: this.left.page.pageSize,
          //sorting: `${this.filter.sort.sortField} ${this.filter.sort.sortType}`
        }
        if(this.form.text) params.name = this.form.text;

        this.getData(this.$utils.CONFIG.api.queryRequirement, params, 'mrRequirementId', loadingKey, this.getDetail);
      },
      getDetail(item = null, isOrder = false) { //需求详情 isOrder 是否是下单

        let params = {
          mrRequirementId: this.currentData.mrRequirementId
        };
        let obj = this.right;

        if(item && item.mrRequirementId) { //如果是修改

          this.handle.update.item = item;
          params.mrRequirementId = item.mrRequirementId;
          obj = this.handle.update;
        }

        if(item && isOrder) { //如果是修改

          this.handle.order.item = item;
          params.mrRequirementId = item.mrRequirementId;
          obj = this.handle.order;
        }
        
        obj.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryRequirementDetail, (res) =>  {

          obj.isLoading = false;
          if(item && item.mrRequirementId) {

             obj.form = res.data || {};
             obj.form.attachments = obj.form.attachments || [];
             if(obj.form.fileId) {

              obj.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${obj.form.fileId}`;
             }
          }else {

             obj.page1 = res.data || {};
          }
        }, () => obj.isLoading = false, params)
      },
      handleAvatarSuccess(res, file) { //上传头像
        
        this.handle.update.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.update.form.fileId = res.data[0].fileId;
      },
      handleAvatarOrderSuccess(res, file) { //上传头像

        this.handle.order.form.userFace = `${this.$utils.CONFIG.api.image}?fileId=${res.data[0].fileId}`;
        this.handle.order.form.fileId = res.data[0].fileId;
      },
      uploadSuccess(res) { //需求
        
        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            let url = this.$utils.CONFIG.api.addRequirement;
            let params = {
              fileId: this.handle.update.form.fileId,
              name: this.handle.update.form.name,
              customerPoNo: this.handle.update.form.customerPoNo,
              requirementTypeText: this.handle.update.form.requirementTypeText,
              requirementNum: this.handle.update.form.requirementNum,
              components: [],
              attachments: [],
              remark: this.handle.update.form.remark
            };
            
            if(params.requirementTypeText == '模具零件') { //零件

              let components = [];
              this.handle.update.form.components.map(item => {

                if(item.componentNo && item.quantity && item.customerNo && item.deliveryDateString) {

                  components.push({
                    mrComponentReqId: item.mrComponentReqId,
                    componentNo: item.componentNo,
                    quantity: parseInt(item.quantity) || 0,
                    customerNo: item.customerNo,
                    deliveryDate: item.deliveryDateString, 
                    remark: item.remark
                  })
                }
              })

              if(!components || !components.length ) {

                this.handle.update.isLoading = false;
                this.$utils.showTip('warning', 'error', '-1089');
                return;
              }

              params.components = components;
            }

            params.attachments = [];
            if(this.handle.update.type == 'edit') { //如果是编辑

              url = this.$utils.CONFIG.api.modifyRequirement;
              params.mrRequirementId = this.handle.update.item.mrRequirementId;
              params.requireDeliveryDate = this.handle.update.form.deliveryDate;
            }
            if(res && res.data && res.data.length) { //附件

              res.data.map(item => params.attachments.push({
                fileId: item.fileId,
                fileName: item.fileName
              }))
            }
            this.handle.update.form.attachments &&  this.handle.update.form.attachments.map(item => {

              if(item.type != 'add') {
                params.attachments.push({
                  fileId: item.fileId,
                  fileName: item.fileName
                })
              }
            })


            this.handle.update.isLoading = true;
            this.$utils.getJson(url, (res) =>  {

              this.handle.update.isLoading = false;
              this.handle.update.dialogVisible = false;
              this.$utils.showTip('success', 'success', this.handle.update.type == 'add' ? '111' : '120');
              this.getLeftList();
            }, () => this.handle.update.isLoading = false, params)
          }else {

            this.handle.update.isLoading = false;
          }
        })
      },
      showPlanDialog() { //查看生产计划

        this.handle.plan.dialogVisible = true;
        if(!this.handle.plan.tableData.length) {

          this.getAllProcessOfIndex();
          this.getPlan();
        }
      },
      getPlan() { //获取订单列表

        let params = {

        };
        this.handle.plan.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.queryPlanList, (res) =>  {

          this.handle.plan.isLoading = false;
          res.data && res.data.map(item => {

            item.surplus = this.dateMinus(item.requireCompletionDate);
            item.processes && item.processes.map(itemc => {

              if(itemc.name && !itemc.haveSort) {

                let processes = item.processes.filter(itemcc => itemcc.name == itemc.name);
                processes.sort(this.compare('processSequence'));
                
                processes.map((itemcc, index) => {

                  itemc.haveSort = true;
                  itemc.processesIndex = index + 1;
                  itemc.webName = `${itemcc.name}${itemcc.processesIndex}`;

                  item[`${this.procedurePrefix}-${itemcc.name}${itemcc.processesIndex}`] = itemcc.workTime;
                  item[`${this.procedurePrefix}-${itemcc.name}${itemcc.processesIndex}-id`] = itemcc.mrProductionPlanProcessId;
                })
                item.webProcesses = processes;
              }
            })
          })
          this.handle.plan.tableData = res.data || [];
        }, () => this.handle.plan.isLoading = false, params)
      },
      showStopDialog(item) {

        this.$refs.stopForm && this.$refs.stopForm.resetFields();
        this.handle.stop.dialogVisible = true;
        this.handle.stop.data = item;
      },
      stop() { //终止
    
        this.$refs.stopForm.validate((valid) => {
          if (valid) {
            
            let params = {
              mrRequirementId: this.handle.stop.data.mrRequirementId,
              causeTypeText: this.handle.stop.form.causeTypeText,
              description: this.handle.stop.form.description
            };
            
            this.handle.stop.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.saveDemand, (res) =>  {

              this.handle.stop.isLoading = false;
              this.handle.stop.dialogVisible = false;
              this.$utils.showTip('success', 'success', '115');
              this.getLeftList();
            }, () => this.handle.stop.isLoading = false, params)
          } else {
            
            return false;
          }
        });
      },
      getOrderDetail(item) { //订单详情

        let params = {
          mrRequirementId: item.mrRequirementId
        };

        this.handle.order.item = item;
        this.handle.order.isLoading = true;
        this.$utils.getJson(this.$utils.CONFIG.api.querySaleOrderInModify, (res) =>  {

          this.handle.order.isLoading = false;
          let obj  = res.data || {};
          obj.componentOrders = obj.componentOrders || [{}];
          obj.settlementExchangeRate = obj.settlementExchangeRate || '';
          obj.attachments = obj.attachments || [];
          if(obj.fileId) {

            obj.userFace = `${this.$utils.CONFIG.api.image}?fileId=${obj.fileId}`;
          }else {

            obj.userFace = '';
          }
          if(obj.settlementCurrency && this.$dict.currencyList) {

            for(let i = 0; i < this.$dict.currencyList.length; i++) {

              if(this.$dict.currencyList[i].name == obj.settlementCurrency) {

                obj.currency = this.$dict.currencyList[i];
                break;
              }
            }
          }
          this.handle.order.form = obj;
          this.handle.order.originModulNo = this.handle.order.form.mouldNo || '';
        }, () => obj.isLoading = false, params)
      },
      checkMouldNo() { //模具号验重

        if(!this.handle.order.form.mouldNo) {

          this.$utils.showTip('warning', 'error', '-1090')
          return;
        }
        this.$utils.getJson(this.$utils.CONFIG.api.checkMouldNo, (res) => {

          if(res.data != 1) { //如果模具号重复

            this.$utils.showTip('warning', 'error', '-1094');
          }else {
            
            this.saveFileAndData(this.handle.order, this.saveOrder);
          }
        }, null, {mouldNo: this.handle.order.form.mouldNo})
      },
      saveOrder(res) { //下单

        this.$refs.orderForm.validate((valid) => {
          if (valid) {

            let params = {
              mrSaleOrderId: this.handle.order.form.mrSaleOrderId || '',
              mrRequirementId: this.handle.order.form.mrRequirementId || this.handle.order.item.mrRequirementId,
              judgeType: this.handle.order.judgeType,
              name: this.handle.order.form.name, 
              createBy: this.$utils.getStorage(this.$utils.CONFIG.storageNames.usernameName),
              fileId: this.handle.order.form.fileId,
              mouldNo: this.handle.order.form.mouldNo, 
              customerPoNo: this.handle.order.form.customerPoNo,
              saleOrderTypeText: this.handle.order.item.requirementTypeText,
              settlementCurrency: this.handle.order.form.currency.name,
              settlementExchangeRate: this.handle.order.form.settlementExchangeRate,
              settlementCurrencyTotalPrice: parseFloat(this.handle.order.form.settlementCurrencyTotalPrice) || 0,
              saleTotalPrice: this.handle.order.form.saleTotalPrice,
              componentOrders: [],
              attachments: [],
              remark: this.handle.order.form.remark
            };
            
            let componentOrders = [];
            this.handle.order.form.componentOrders && this.handle.order.form.componentOrders.map(item => {

              if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {
                componentOrders.push({
                  componentNo: item.componentNo,
                  quantity: parseInt(item.quantity) || 0,
                  customerNo: item.customerNo,
                  deliveryDate: item.deliveryDate,
                  componentPrice: parseInt(item.componentPrice) || 0,
                  componentTotal: item.componentTotal,
                  description: item.description
                })
              }
            })

            if(!componentOrders || !componentOrders.length ) {

              this.handle.order.isLoading = false;
              this.$utils.showTip('warning', 'error', '-1084');
              return;
            }

            params.componentOrders = componentOrders;

            params.attachments = [];
            if(res && res.data && res.data.length) { //附件

              res.data.map(item => params.attachments.push({
                fileId: item.fileId,
                fileName: item.fileName
              }))
            }
            this.handle.order.form.attachments &&  this.handle.order.form.attachments.map(item => {

              if(item.type != 'add') {
                params.attachments.push({
                  fileId: item.fileId,
                  fileName: item.fileName
                })
              }
            })

            this.handle.order.isLoading = true;
            this.$utils.getJson(this.$utils.CONFIG.api.saveSaleOrder, (res) =>  {

              this.handle.order.isLoading = false;
              this.handle.order.dialogVisible = false;
              this.$utils.showTip('success', 'success', '117');
              this.getLeftList();
            }, () => this.handle.order.isLoading = false, params)
          }else {

            this.handle.order.isLoading = false;
          }
        })
      },
      setTableMaxHeight() {

        this.maxHeight = this.$utils.getTableMaxHeight(['.main-right-title', '.table-out']);
      },
      refresh() {}
    },
    computed: {
      saleTotalPrice() {

        let saleTotalPrice = 0;
        this.handle.order.form.componentOrders && this.handle.order.form.componentOrders.map(item => {

          if(item.componentNo && item.quantity && item.customerNo && item.deliveryDate) {

            saleTotalPrice += (parseInt(item.quantity) || 0) * (parseFloat(item.componentPrice) || 0);
          }
        })

        this.handle.order.form.saleTotalPrice = saleTotalPrice;
      }
    },
    created() {
      this.getLeftList();
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