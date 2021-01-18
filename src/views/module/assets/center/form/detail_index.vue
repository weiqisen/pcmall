<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.content" placeholder="请输入告警内容" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-select v-model="queryParam.alarmType" placeholder="请选择告警类型" allowClear>
                <a-select-option value="1">以太网异常</a-select-option>
                <a-select-option value="2">Modem无服务</a-select-option>
                <a-select-option value="3">内存满</a-select-option>
                <a-select-option value="4">no data</a-select-option>
                <a-select-option value="5">掉卡</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="alarmId"
        :columns="columns"
        :data="loadData"
      >
        <span slot="alarmType" slot-scope="text">
          <span>{{ text | alarmTypeFilter }}</span>
        </span>
        <span slot="alatmStaus" slot-scope="text">
          <a-badge :status="text | alarmStatusFilter" :text="text | statusFilter" />
          <!--<a-tag :color="record.text | alarmStatusFilter" @click="handleView(record,record.ethernet)">以太网异常</a-tag>-->
          <!--<a-tag :color="record.modem | alatmStausFilter" @click="handleView(record,record.modem)">Modem无服务</a-tag>-->
          <!--<a-tag :color="record.ram | alatmStausFilter" @click="handleView(record,record.ram)">内存满</a-tag>-->
          <!--<a-tag :color="record.data | alatmStausFilter" @click="handleView(record,record.data)">no data</a-tag>-->
          <!--<a-tag :color="record.simCard | alatmStausFilter" @click="handleView(record,record.simCard)">掉卡</a-tag>-->
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修复</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
const statusMap = {
  0: {
    status: 'error',
    text: '未处理'
  },
  1: {
    status: 'processing',
    text: '已处理'
  },
  3: {
    status: 'default',
    text: '待处理'
  }
}

export default {
  name: 'DetailIndex',
  components: {
    STable
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '告警类型',
          dataIndex: 'alarmType',
          scopedSlots: { customRender: 'alarmType' }
        },
        {
          title: '告警内容',
          dataIndex: 'content'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'alatmStaus' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get(this.$apis.alarm.page, Object.assign(parameter, this.queryParam), this).then(res => {
          res.data.current = parseInt(res.data.current)
          res.data.total = parseInt(res.data.total)
          res.data.size = parseInt(res.data.size)
          res.data.pages = parseInt(res.data.pages)
          return res
        })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    alarmStatusFilter (type) {
      return statusMap[type].status
    },
    alarmTypeFilter (type) {
      if (type === '1') {
        return '以太网异常'
      } else if (type === '2') {
        return 'Modem无服务'
      } else if (type === '3') {
        return '内存满'
      } else if (type === '4') {
        return 'no data'
      } else if (type === '5') {
        return '掉卡'
      } else {
        return ''
      }
    }

  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    // this.tableOption()
    // getRoleList({ t: new Date() })
  },
  methods: {
    // tableOption () {
    //   if (!this.optionAlertShow) {
    //     this.options = {
    //       alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
    //       rowSelection: {
    //         selectedRowKeys: this.selectedRowKeys,
    //         onChange: this.onSelectChange
    //       }
    //     }
    //     this.optionAlertShow = true
    //   } else {
    //     this.options = {
    //       alert: false,
    //       rowSelection: null
    //     }
    //     this.optionAlertShow = false
    //   }
    // },

    // handleEdit (record) {
    //   this.$nextTick(() => {
    //     this.$refs.modal.edit(record)
    //   })
    // },
    // handleView (record,status) {
    //   this.$refs.DetailModel.edit(record,status)
    //   // this.$http.delete(this.$apis.role.remove, {
    //   //   roleId: record.roleId
    //   // }, this).then(res => {
    //   //   this.handleOk ()
    //   // })
    // },
    handleOk (record, status) {
      this.queryParam.name = status
      this.queryParam.deviceId = record.deviceId
      this.$refs.table.refresh()
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
