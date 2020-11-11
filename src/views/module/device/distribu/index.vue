<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.distributionName" placeholder="请输入地区名称" allowClear />
            </a-col>
            <a-col :md="4" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button @click="handleTableQuery">
                  <jihao-icon type="icon_search"></jihao-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleRestQuery">
                  <jihao-icon type="icon_clear_query"></jihao-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button @click="handleEdit()">
          <jihao-icon type="icon_add"></jihao-icon>
          分布地</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="distributionId"
        :columns="columns"
        :data="loadData"
        bordered
      >
        <span slot="online" slot-scope="text">
          <a-tag :color="text | statusTypeFilter" @click="handleView(record,record.ethernet)">{{text | statusFilter}}</a-tag>
        </span>
        <span slot="dushu" slot-scope="text">
          {{text}}°
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button @click="handleEdit(record)" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
              <jihao-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></jihao-icon>
              <span style="font-size: 12px;">编辑</span>
            </a-button>
            <a-button @click="handleRemove(record)" style="padding: 0 6px;font-size: 12px;height: 26px;">
              <jihao-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></jihao-icon>
              <span style="font-size: 12px;">删除</span>
            </a-button>
          </template>
        </span>
      </s-table>
      <role-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>
  import { PageView } from '@/layouts'
  import { STable } from '@/components'
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

  export default {
    name: 'DeviceIndex',
    components: {
      PageView,
      STable,
      RoleModal
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
        if(record&&record.distributionId){
          option = 1
        }
        this.$nextTick(() => {
          this.$router.push({ name: 'distribuAdd',
            params: {distributionId:record?record.distributionId:'',option:option}
          })
        })
      },
      handleDistribu (){
        this.$nextTick(() => {
          this.$refs.distribumodal.edit()
        })
      },
      handleRemove (record) {
        this.$http.delete(this.$apis.distribu.remove, {
          distributionId: record.distributionId
        }, this).then(res => {
          this.handleOk ()
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
      handleRestQuery (){
        this.queryParam = {}
        this.handleTableQuery()
      },
      handleTableQuery (){
        this.$refs.table.refresh(true)
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    },
  }
</script>
