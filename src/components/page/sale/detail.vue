<template>
    <div>
       <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-copy"></i> 当前位置：需求跟踪->模具零件报价
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="v-tabs">
            <span class="v-tab" :class="{'active': activeTab == 'calc'}" @click="activeTab = 'calc'">报价计算</span>
            <span class="v-tab" :class="{'active': activeTab == 'preview'}" @click="activeTab = 'preview'">报价清单预览</span>
        </div>
        <div class="detail-main">
            <div class="calc hide" :class="{'show': activeTab == 'calc'}">
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-copy"></i> 需求信息
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-row>
                    <el-col :span="12">
                        客户名称：XXXXXX公司
                    </el-col>
                    <el-col :span="12">
                        客户PO.号：12312323123
                    </el-col>
                    <el-col :span="12">
                        需求编号：REQ1901
                    </el-col>
                    <el-col :span="12">
                        需求类型：整体模具
                    </el-col>
                </el-row>
                <div class="mgt20">
                  <p class="mgb10">需求附件：</p>
                  <el-table
                    :data="tabs.calc.enclosureList"
                    border
                    size="mini"
                    style="width: 100%; max-width: 400px;">
                    <el-table-column
                      type="index"
                      label="序号">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="附件名称">
                    </el-table-column>
                    <el-table-column
                      label="操作">
                      <template slot-scope="scope">
                        <a href="">下载</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="mgt20">
                    <p class="mgb10">需求说明：</p>
                    <p>这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</p>
                </div>
                <el-row class="mgt20 mgb20">
                    <el-col :span="16">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item class="lh32">
                                <i class="el-icon-lx-copy"></i> 报价计算
                                <span class="mgl10">总价（人民币）：13250.00</span>
                                <span class="mgl10">交易货币总价：13250.00</span>
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="8">
                        <span>加载历史报价：</span>
                        <el-select v-model="tabs.calc.form.history" style="width: 100px;" size="mini">
                            <el-option label="模具零件" value="0"></el-option>
                            <el-option label="整体模具" value="1"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="24" class="mgt10">
                        <span class="mgl10">交易货币：</span>
                        <el-select size="mini" style="width: 100px;" v-model="tabs.calc.form.btype">
                            <el-option label="欧元" value="0"></el-option>
                            <el-option label="美元" value="1"></el-option>
                            <el-option label="日元" value="2"></el-option>
                        </el-select>
                        <span class="mgl10">汇率：</span>
                        <el-select size="mini" style="width: 100px;" v-model="tabs.calc.form.erate">
                            <el-option label="7.0" value="0"></el-option>
                            <el-option label="6.5" value="1"></el-option>
                            <el-option label="6.2" value="2"></el-option>
                        </el-select>
                        <span class="mgl10">管理费用上浮比例：</span>
                        <el-select size="mini" style="width: 100px;" class="mgr40" v-model="tabs.calc.form.goup">
                            <el-option label="5.0" value="0"></el-option>
                            <el-option label="5.1" value="1"></el-option>
                            <el-option label="5.2" value="2"></el-option>
                        </el-select>
                        <el-button type="primary">工序工时单价设置</el-button>
                    </el-col>
                    <el-row class="mgt20 mgb20">
                        <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--mini mgt10">
                            <table class="el-table__body" style="width: 100%">
                                <thead class="has-gutter">
                                    <tr class="">
                                        <th><div class="cell">Det No</div></th>
                                        <th><div class="cell">数量</div></th>
                                        <th><div class="cell">材料</div></th>
                                        <th><div class="cell">M</div></th>
                                        <th><div class="cell">EDB</div></th>
                                        <th><div class="cell">G</div></th>
                                        <th><div class="cell">CNCV</div></th>
                                        <th><div class="cell">CNCH</div></th>
                                        <th><div class="cell">EDM</div></th>
                                        <th><div class="cell">W/C</div></th>
                                        <th><div class="cell">BENCH</div></th>
                                        <th><div class="cell">编程</div></th>
                                        <th><div class="cell">电极设计</div></th>
                                        <th><div class="cell">设计</div></th>
                                        <th><div class="cell">QC</div></th>
                                        <th><div class="cell">Total</div></th>
                                        <th><div class="cell">订购</div></th>
                                        <th><div class="cell">铜材</div></th>
                                        <th><div class="cell">钢材</div></th>
                                        <th><div class="cell">合计人民币</div></th>
                                        <th><div class="cell">单价人民币</div></th>
                                        <th><div class="cell">单价</div></th>
                                        <th><div class="cell">最终价格</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell"><div>1</div></div>
                                        </td>
                                        <td>
                                            <div class="cell">王小虎</div>
                                        </td>
                                        <td>
                                            <div class="cell"><a href="">下载</a></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--mini mgt10">
                            <table class="el-table__body" style="width: 100%">
                                <thead class="has-gutter">
                                    <tr class="">
                                        <th><div class="cell">长(MM)</div></th>
                                        <th><div class="cell">宽(MM)</div></th>
                                        <th><div class="cell">高(MM)</div></th>
                                        <th><div class="cell">重量(KG)</div></th>
                                        <th><div class="cell">材料</div></th>
                                        <th><div class="cell">运费</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="el-table__row">
                                        <td>
                                            <div class="cell"><div>1</div></div>
                                        </td>
                                        <td>
                                            <div class="cell">王小虎</div>
                                        </td>
                                        <td>
                                            <div class="cell"><a href="">下载</a></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-row>
                </el-row>
            </div>
            <div class="preview hide" :class="{'show': activeTab == 'preview'}">
                2
            </div>
        </div>
        <div class="detail-footer tr">
            <el-button type="primary">报价</el-button>
            <el-button type="primary">保存草稿</el-button>
            <el-button type="primary">返 回</el-button>
        </div> 
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                activeTab: 'calc',
                tabs: {
                    calc: {
                        form: {
                            history: '0',
                            btype: '0',
                            erate: '0',
                            goup: '0'
                        },
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
                    preview: {

                    }
                }
            }
        },
        created(){
           
        },
        methods: {
    
        }
    }

</script>


<style scoped lang="scss">
    .v-tabs {
        border-bottom: 1px solid #a3bf1f;
        .v-tab {
            display: inline-block;
            width: 120px;
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            cursor: pointer;
            &.active {
                color: #fff;
                background: #a3bf1f;
            }
        }
    }
    .detail-main {
        position: absolute;
        top: 115px;
        right: 10px;
        bottom: 54px;
        left: 10px;
        overflow-y: auto;
    }
    .detail-footer {
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 0px;
        padding: 10px 0;
        border-top: 1px solid #a3bf1f;
    }
</style>
