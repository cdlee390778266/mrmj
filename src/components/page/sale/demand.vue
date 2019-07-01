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
        <left-wrapper type="saleDemand"></left-wrapper>
      </div>
      <div class="main-right">
        <page-wrapper @change="refresh">
          <div class="pdt10 mgt10">
            <div class="main-content-scorll pdt10">
              <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户名称：XXXXXX公司</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">客户PO.号：12312323123</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求编号：REQ1901</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求类型：模具零件</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">需求状态：已报价</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">已报总价：12301.00</el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">报价货币：欧元</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求零件列表：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="current.spList"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="date" label="零件号" width="180"></el-table-column>
                    <el-table-column prop="name" label="客户编号" width="180"></el-table-column>
                    <el-table-column prop="address" label="需求数量"></el-table-column>
                    <el-table-column prop="d" label="要求交期"></el-table-column>
                    <el-table-column prop="address" label="说明"></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求附件：</el-col>
                <el-col :span="24">
                  <el-table
                    :data="current.spList"
                    border
                    size="mini"
                    class="content-table"
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="date" label="附件名称"></el-table-column>
                    <el-table-column width="100" label="操作">
                      <template slot-scope="scope">
                        <a href style="color: #3375AB;">下载</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">需求说明：</el-col>
                <el-col
                  :span="24"
                >这里保存的是对客户需求的详细说明。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</el-col>
              </el-row>
            </div>
          </div>
        </page-wrapper>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: localStorage.getItem("ms_username"),
        current: {
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
      };
    },
    methods: {
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