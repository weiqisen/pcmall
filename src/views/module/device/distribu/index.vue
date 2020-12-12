<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-select v-model="queryParam.orderType" class="input-width" placeholder="请选择年份" allowClear>
                <a-select-option
                  v-for="item in orderTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :md="4" :sm="24" style="padding: 0 3px;">
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
      <a-alert style="margin-top: 15px" message=" 本年度日期平均周期为29天，共有3个月超出平均线，距离上次日期已过去20天" type="info" close-text="Close Now"/>
      <div>
        <EchartsComponent
          :chartData="dataList3"
          id="waterPlantwater3Con"
          offsetStart="#00CA69"
          lineColor="#00CA69"
          itemColor="#00CA69"
          titleText="统计"></EchartsComponent>
      </div>
      <role-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import EchartsComponent from './EchartsComponent'
import { getRoleList, getServiceList } from '@/api/manage'
import RoleModal from './modal'
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
const dataList3 = []
for (let i = 1; i <= 30; i += 1) {
  dataList3.push({
    name: i,
    value: Math.floor(Math.random() * 7 + 25)
  })
}
export default {
  name: 'DeviceIndex',
  components: {
    PageView,
    STable,
    RoleModal,
    EchartsComponent
  },
  data () {
    return {
      mdl: {},
      dataList3: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      orderTypeOptions: [
        {
          label: '2020年',
          value: 1
        },
        {
          label: '2021年',
          value: 6
        }, {
          label: '2022年',
          value: 7
        }
      ],
      // 表头
      columns: [
        {
          title: '地区名称',
          dataIndex: 'distributionName'
        },
        {
          title: '经度',
          dataIndex: 'lon',
          scopedSlots: { customRender: 'dushu' }
        },
        {
          title: '纬度',
          dataIndex: 'lat',
          scopedSlots: { customRender: 'dushu' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '160px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.deviceSn = this.queryParam.deviceName
        return this.$http.get(this.$apis.distribu.page, Object.assign(parameter, this.queryParam), this).then(res => {
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
    }
  },
  mounted () {
    setTimeout(() => {
      this.dataList3 = dataList3
    })
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    // getRoleList({ t: new Date() })
  },
  methods: {
    handleEdit (record) {
      debugger
      let option = 0
      if (record && record.distributionId) {
        option = 1
      }
      this.$nextTick(() => {
        this.$router.push({ name: 'distribuAdd',
          params: { distributionId: record ? record.distributionId : '', option: option }
        })
      })
    },
    handleDistribu () {
      this.$nextTick(() => {
        this.$refs.distribumodal.edit()
      })
    },
    handleRemove (record) {
      this.$http.delete(this.$apis.distribu.remove, {
        distributionId: record.distributionId
      }, this).then(res => {
        this.handleOk()
      })
    },
    handleOk () {
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
    },
    handleRestQuery () {
      this.queryParam = {}
      this.handleTableQuery()
    },
    handleTableQuery () {
      this.$refs.table.refresh(true)
      this.selectedRowKeys = []
      this.selectedRows = []
    }
  }
}
</script>
