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
                  <jihao-icon title="查询" type="icon_search"></jihao-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" >
                  <jihao-icon style="color:rgba(0, 0, 0, 0.65);" title="查询" type="icon_clear_query"></jihao-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--:showUploadList="false"-->
      <div class="table-operator">
        <a-button
          type="primary">
          <jihao-icon
            style="color:white;"
            title="表格导出"
            type="iconwenjianshangchuan"></jihao-icon>
          表格导出
        </a-button>
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
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
              <jihao-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></jihao-icon>
              <span style="font-size: 12px;">编辑</span>
            </a-button>
            <a-button style="padding: 0 6px;font-size: 12px;height: 26px;">
              <jihao-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></jihao-icon>
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
    // deviceId: Math.floor(Math.random() * 100501+100501)+i,
    deviceSn: Math.floor(Math.random() * 3018357393 + 1234),
    deviceName: 'Surface Pro5',
    deviceRom: '4+128',
    deviceNew: '95%',
    deviceBug: '全部通过',
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
          scopedSlots: { customRender: 'deviceBug' }

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
          width: '50px',
          fixed: 'right',
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
  }
}
</script>
