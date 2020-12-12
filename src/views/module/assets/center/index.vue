<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.deviceName" placeholder="请输入设备名称/设备编号" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-select v-model="queryParam.online" placeholder="请选择设备状态" allowClear>
                <a-select-option value="1">在线</a-select-option>
                <a-select-option value="0">离线</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="4" :sm="24" style="padding: 0 3px 0 0;">
              <span class="table-page-search-submitButtons">
                <a-button @click="handleTableQuery">
                  <tc-icon type="icon_search"></tc-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleRestQuery">
                  <tc-icon type="icon_clear_query"></tc-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-alert
        message="告警信息：已处理为绿色，未处理为红色，离线为灰色"
        type="info"
        show-icon
      />
      <s-table
        ref="table"
        size="default"
        rowKey="deviceId"
        :columns="columns"
        :data="loadData"
        bordered
      >
        <span slot="online" slot-scope="text">
          <a-tag :color="text | statusTypeFilter" @click="handleView(record,record.ethernet)">{{ text | statusFilter }}</a-tag>
        </span>
        <span slot="alatmStaus" slot-scope="text,record">
          <a-tag :color="record.ethernet | alatmStausFilter(record)" @click="handleView(record,record.ethernet)">以太网异常</a-tag>
          <a-tag :color="record.modem | alatmStausFilter(record)" @click="handleView(record,record.modem)">Modem无服务</a-tag>
          <a-tag :color="record.ram | alatmStausFilter(record)" @click="handleView(record,record.ram)">内存满</a-tag>
          <a-tag :color="record.simCard | alatmStausFilter(record)" @click="handleView(record,record.simCard)">掉卡</a-tag>
          <a-tag :color="record.data | alatmStausFilter(record)" @click="handleView(record,record.data)">no data</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <!--<a @click="handleRepairShow(record)" :disabled="record.online===1?false:true">-->
            <!--<tc-icon type="icon_repair_dark"></tc-icon>-->
            <!--一键修复</a>-->
            <a-button @mousedown="handleRepairShow($event,record)" :disabled="record.online===1?false:true" type="primary" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></tc-icon>
              <span style="font-size: 12px;">一键修复</span>
            </a-button>
          </template>
        </span>
      </s-table>
      <role-modal ref="modal" @ok="handleOk"/>
      <detail-modal ref="detailmodal" @ok="handleOk"/>
      <a-modal
        :centered="true"
        title="一键修复"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :maskClosable="false"
        @ok="handleRepair"
        @cancel="handleCancel"
      >
        <p>您确认执行本次操作吗？该操作将重启设备！</p>
      </a-modal>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import RoleModal from './modal'
import DetailModal from './detailModal'
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
  name: 'AlarmIndex',
  components: {
    PageView,
    STable,
    RoleModal,
    DetailModal
  },
  data () {
    return {
      deviceStatus: '',
      visible: false,
      confirmLoading: false,
      deviceId: '',
      deviceSn: '',
      setTimeStatus: '',
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '设备编号',
          dataIndex: 'deviceSn'
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          ellipsis: true
        },
        {
          title: '状态',
          dataIndex: 'online',
          scopedSlots: { customRender: 'online' }
        },
        {
          title: '上报时间',
          dataIndex: 'updateTime'
        },
        {
          title: '告警信息',
          dataIndex: 'ethernet',
          scopedSlots: { customRender: 'alatmStaus' }

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
        this.queryParam.deviceSn = this.queryParam.deviceName
        return this.$http.get(this.$apis.device.page, Object.assign(parameter, this.queryParam), this).then(res => {
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
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    alatmStausFilter (status, record) {
      if (record.online === 0) {
        return ''
      } else {
        if (status === 0) {
          return 'red'
        } else if (status === 1) {
          return 'green'
        } else if (status === 2) {
          return ''
        } else {
          return ''
        }
      }
    }

  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    this.handleInitRefresh()
  },
  destroyed () {
    clearInterval(this.deviceStatus)
    clearTimeout(this.setTimeStatus)
  },
  methods: {
    handleRepair () {
      if (this.deviceId) {
        return this.$http.get(this.$apis.alarm.repair, { deviceId: this.deviceId, deviceSn: this.deviceSn }, this).then(res => {
          if (res.code === 0) {
            this.visible = false
            this.deviceId = ''
            this.deviceSn = ''
          }
          return res
        })
      }
    },
    handleRepairShow (event, record) {
      this.visible = true
      this.deviceId = record.deviceId
      this.deviceSn = record.deviceSn
      event.preventDefault()
    },
    handleCancel (e) {
      this.visible = false
      this.deviceId = ''
      this.deviceSn = ''
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    handleInitRefresh () {
    },
    handleLoadInit () {
      this.deviceStatus = setInterval(this.handleSysey, 8000)
    },
    handleSysey () {
      const deviceList = []
      if (this.$refs.table.localDataSource) {
        this.$refs.table.localDataSource.map(item => {
          deviceList.push({
            deviceId: item.deviceId,
            deviceSn: item.deviceSn
          })
        })
      }
      this.$http.get(this.$apis.device.interval, {
        deviceList: JSON.stringify(deviceList)
      }, this).then(res => {
        const deviceList = res.data
        if (this.$refs.table.localDataSource) {
          if (deviceList) {
            deviceList.map(dev => {
              this.$refs.table.localDataSource.map(item => {
                if (item.deviceId === dev.deviceId) {
                  if (typeof (dev.online) !== 'undefined' && item.online != dev.online) {
                    item.online = dev.online
                  }
                }
              })
            })
          }
        }
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
    },
    handleRestQuery () {
      this.queryParam = {}
      this.handleTableQuery()
    },
    handleTableQuery () {
      this.$refs.table.refresh(true)
    }
  },
  beforeRouteLeave (to, from, next) {
    next(vm => {
      clearInterval(vm.deviceStatus)
      clearTimeout(vm.setTimeStatus)
    })
  }
}
</script>
