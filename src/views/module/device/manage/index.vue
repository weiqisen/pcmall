<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="4" :sm="24" style="padding: 0 3px;">
              <a-date-picker @change="onChange" />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input placeholder="请输入设备Sn" allowClear/>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button >
                  <tc-icon title="查询" type="icon_search"></tc-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" >
                  <tc-icon style="color:rgba(0, 0, 0, 0.65);" title="查询" type="icon_clear_query"></tc-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--:showUploadList="false"-->
      <div class="table-operator">
        <download-excel
          style="display: inline-block"
          class="export-excel-wrapper"
          :beforeGenerate="handleExcel"
          :fields="exportFields"
          :data="exportData"
          :name="exportName">
          <a-button
            type="primary">
            <tc-icon
              style="color:white;"
              title="表格导出"
              type="iconwenjianshangchuan"></tc-icon>
            表格导出
          </a-button>
        </download-excel>
      </div>
      <a-alert
        message="统计：当前Suface Pro5共5台，Surface3共8台，总价20050元"
        type="info"
        show-icon
      />
      <a-table
        size="default"
        rowKey="key"
        :columns="columns"
        :data-source="data"
        :rowSelection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange}"
        bordered
      >
        <span slot="deviceBug" slot-scope="text">
          <a-tag v-if="text===1" :style="{background: '#E6F7FF',border: '1px solid #91D5FF',color:'#1890FF'}">通过</a-tag>
          <a-tag v-if="text===0" :style="{background: '#FFF1F0',border: '1px solid #FFA39E',color:'#FF4D4F'}">异常</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button @mousedown="handleEdit($event,record)" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></tc-icon>
              <span style="font-size: 12px;">编辑</span>
            </a-button>
            <a-button @mousedown="handleRemove($event,record)" :disabled="record.isSystem === 1" style="padding: 0 6px;font-size: 12px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></tc-icon>
              <span style="font-size: 12px;">删除</span>
            </a-button>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import RoleModal from './modal'
const data = []
for (let i = 1; i < 60; i += 1) {
  data.push({
    key: i,
    deviceSn: Math.floor(Math.random() * 3018357393 + 1234),
    deviceName: 'Surface Pro5',
    deviceRom: '4+128',
    deviceNew: '95%',
    deviceBug: 1,
    categoryName: 'Surface',
    createTime: '2020-11-' + Math.floor(Math.random() * 30 + 10) + ' 14:' + Math.floor(Math.random() * 60 + 10) + ':52'
  })
}
export default {
  name: 'UpgradeIndex',
  components: {
    PageView,
    STable,
    RoleModal
  },
  data () {
    return {
      data,
      columns: [
        {
          title: '设备型号',
          dataIndex: 'deviceName'
        },
        {
          title: '设备Sn',
          dataIndex: 'deviceSn'
        },
        {
          title: '内存规格',
          dataIndex: 'deviceRom'
        },
        {
          title: '外观',
          dataIndex: 'deviceNew'
        },
        {
          title: '功能测试',
          dataIndex: 'deviceBug',
          scopedSlots: { customRender: 'deviceBug' },
          align: 'center'
        },
        {
          title: '分类',
          dataIndex: 'categoryName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '80px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  computed: {

  },
  created () {
  },
  mounted () {

  },
  methods: {
    async handleExcel () {
      if (this.selectedRows && this.selectedRows.length > 0) {
        debugger
        this.exportData = this.selectedRows
        this.exportName = 'tc-设备统计' + '.xls'
        return
      }
      const parameter = {
        pageNo: 1,
        pageSize: this.$refs.table.localPagination.total
      }
      debugger
      const p1 = await this.$http.get(this.$apis.user.sport.health.page, Object.assign(parameter, this.queryParam), this)
      this.exportData = p1.data.records
      this.exportName = 'tc-设备统计' + '.xls'
      console.log(p1)
    }
  },
  onChange (date, dateString) {
    console.log(date, dateString)
  },
  onSelectChange (selectedRowKeys, selectedRows) {
    this.selectedRowKeys = selectedRowKeys
    this.selectedRows = selectedRows
  }
}
</script>
