<template>
  <page-view :title="title">
    <a-card :bordered="false" >
      <a-row>
        <a-col :sm="6" :xs="24">
          <info title="全职" value="12/月" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="兼职" value="10/月" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="总收入" value="60415/元" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="本月收入" value="895/元" />
        </a-col>
      </a-row>
    </a-card>
    <br/>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-select v-model="queryParam.online" placeholder="请选择年份" allowClear>
                <a-select-option value="1">2020</a-select-option>
                <a-select-option value="0">2019</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button @click="handleTableQuery">
                  <tc-icon title="查询" type="icon_search"></tc-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleRestQuery">
                  <tc-icon style="color:rgba(0, 0, 0, 0.65);" title="查询" type="icon_clear_query"></tc-icon>
                  重置</a-button>
              </span>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <div class="table-operator">
                <download-excel
                  style="display: inline-block"
                  class="export-excel-wrapper"
                  :beforeGenerate="handleExcel"
                  :data="exportData"
                  :name="exportName">
                  <a-button type="primary" >
                    <tc-icon title="批量导出" type="iconpiliang"></tc-icon>
                    批量导出</a-button>
                </download-excel>
                <a-button type="primary" >
                  <tc-icon title="批量删除" type="icon_delete"></tc-icon>
                  批量删除</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="salaryId"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange}"
        bordered
      >
        <span slot="type" slot-scope="text">
          <a-tag v-if="text===1" :style="{background: '#E6F7FF',border: '1px solid #91D5FF',color:'#1890FF'}">工资</a-tag>
          <a-tag v-if="text===0" :style="{background: '#FFF1F0',border: '1px solid #FFA39E',color:'#FF4D4F'}">其他</a-tag>
        </span>
        <span slot="online" slot-scope="text">
          <a-tag :color="text | statusTypeFilter">{{ text | statusFilter }}</a-tag>
        </span>
        <span slot="fileSize" slot-scope="text">
          <span :title="text">{{ text | fileSizeTypeFilter }}</span>
        </span>
      </s-table>
      <role-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>

import { PageView } from '@/layouts'
import { STable } from '@/components'
import RoleModal from './modal'
import Info from './components/Info'
import { payer } from '@/mock/tc/tc'

const data = []
for (let i = 1; i < 60; i += 1) {
  data.push({
    salaryId: i,
    payer: payer(),
    receiver: '魏其森',
    money: Math.floor(Math.random() * 5000 + 1000),
    type: 1,
    note: '2020年11月',
    createTime: '2020-11-' + Math.floor(Math.random() * 30 + 10)
  })
}
const statusMap = {
  0: {
    status: '',
    text: '离线'
  },
  1: {
    status: 'green',
    text: '在线'
  }
}

export default {
  name: 'SystemRole',
  components: {
    PageView,
    STable,
    RoleModal,
    Info
  },
  data () {
    return {
      mdl: {},
      data,
      exportName: '导出表格',
      exportData: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: 'salaryId'
        },
        {
          title: '收款人',
          dataIndex: 'receiver'
        },
        {
          title: '发放人',
          dataIndex: 'payer'
        },

        {
          title: '金额',
          dataIndex: 'money'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '备注',
          dataIndex: 'note'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return new Promise(
          function (resolve, reject) {
            const res = {
              data: {
                records: data,
                current: 1,
                total: 60,
                size: 10,
                pages: 6
              }
            }
            resolve(res)
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
  },
  methods: {
    onChange (date, dateString) {
      console.log(date, dateString)
    },
    async handleExcel () {
      if (this.selectedRows && this.selectedRows.length > 0) {
        debugger
        this.exportData = this.selectedRows
        this.exportName = '统计' + '.xls'
        return
      }
      const parameter = {
        pageNo: 1,
        pageSize: this.$refs.table.localPagination.total
      }
      debugger
      const p1 = await this.$http.get(this.$apis.user.sport.health.page, Object.assign(parameter, this.queryParam), this)
      this.exportData = p1.data.records
      this.exportName = '统计' + '.xls'
      console.log(p1)
    },
    handleRemove (record) {
      this.$http.delete(this.$apis.role.remove, {
        roleId: record.roleId
      }, this).then(res => {
        this.handleOk()
      })
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    handleRestQuery () {
      this.queryParam = {}
      this.handleTableQuery()
    },
    handleTableQuery () {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
    }
  }
}
</script>
