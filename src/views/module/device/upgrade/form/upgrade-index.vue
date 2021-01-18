<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.fileName" placeholder="请输入文件名称" allowClear />
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
        rowKey="fileId"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
      >
        <span slot="alarmType" slot-scope="text">
          <span>{{ text | alarmTypeFilter }}</span>
        </span>
        <span slot="alatmStaus" slot-scope="text">
          <a-badge :status="text | alarmStatusFilter" :text="text | statusFilter" />
        </span>
        <!--<span slot="action" slot-scope="text, record">-->
        <!--<template>-->
        <!--<a @click="handleEdit(record)">修复</a>-->
        <!--</template>-->
        <!--</span>-->
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
  name: 'UpgradeIndex',
  components: {
    STable
  },
  data () {
    return {
      formData: [],
      submitType: 0,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '文件名称',
          dataIndex: 'fileName'
        },
        {
          title: '文件大小',
          dataIndex: 'fileSize'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '120px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.pageSize = 5
        return this.$http.get(this.$apis.disk.page, Object.assign(parameter, this.queryParam), this).then(res => {
          res.data.current = parseInt(res.data.current)
          res.data.total = parseInt(res.data.total)
          res.data.size = parseInt(res.data.size)
          res.data.pages = parseInt(res.data.pages)
          return res
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
    handleSubmit () {
      if (this.submitType == 0) {
        const deviceId = this.formData[0].deviceId
        const deviceSn = this.formData[0].deviceSn
        return new Promise((resolve, reject) => {
          this.$http.post(this.$apis.device.upgrade, {
            deviceId: deviceId,
            deviceSn: deviceSn,
            filesId: this.selectedRowKeys[0]
          }, this
          ).then(res => {
            res.deviceList = this.formData
            resolve(res)
          }).catch(function (err) {
            reject(err)
          })
        })
      } else if (this.submitType == 1) {
        return new Promise((resolve, reject) => {
          this.$http.post(this.$apis.device.upgradeBatch, {
            deviceList: JSON.stringify(this.formData),
            filesId: this.selectedRowKeys[0]
          }, this
          ).then(res => {
            res.deviceList = this.formData
            resolve(res)
          }).catch(function (err) {
            reject(err)
          })
        })
      }
    },
    handleSend (record) {
      if (record) {
        if (record.length == 1) {
          this.submitType = 0
        } else if (record.length > 1) {
          this.submitType = 1
        }
      }
      this.formData = record
      // this.$refs.table.refresh()
      this.$emit('ok', record)
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
