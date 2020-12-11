<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-form-item label="">
                <a-input v-model="queryParam.userName" placeholder="账号/用户名/手机号/邮箱" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button @click="handleTableQuery">
                  <tc-icon title="查询" type="icon_search"></tc-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleRestQuery">
                  <tc-icon title="重置" type="icon_clear_query"></tc-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button @mousedown="handleEdit">
          <tc-icon title="添加用户" type="icon_add"></tc-icon>
          用户</a-button>
        <a-button @mousedown="handleRemoveBatch" :disabled="selectedRowKeys.length > 0?false:true">
          <tc-icon title="批量删除" type="icon_delete"></tc-icon>
          批量删除</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="userId"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange, getCheckboxProps:handleGetSelect}"
        bordered
      >
        <span slot="status" slot-scope="text">
          <a-tag :color="text | statusTypeFilter">{{ text | statusFilter }}</a-tag>
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
      </s-table>
      <user-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import UserModal from './modal'
const statusMap = {
  0: {
    status: '',
    text: '禁用'
  },
  1: {
    status: 'green',
    text: '正常'
  },
  2: {
    status: 'red',
    text: '锁定'
  }
}
export default {
  name: 'UserManage',
  components: {
    PageView,
    STable,
    UserModal
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
          title: '登入帐号',
          dataIndex: 'account'
        },
        {
          title: '用户昵称',
          dataIndex: 'nickName'
        },
        {
          title: '所属角色',
          dataIndex: 'roleName'
        },
        {
          title: '手机',
          dataIndex: 'mobile'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.userName) {
          this.queryParam.mobile = this.queryParam.userName
          this.queryParam.email = this.queryParam.userName
          this.queryParam.account = this.queryParam.userName
        }
        return this.$http.get(this.$apis.user.page, Object.assign(parameter, this.queryParam), this).then(res => {
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
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    handleEdit (event, record) {
      this.$nextTick(() => {
        this.$refs.modal.edit(record)
      })
      event.preventDefault()
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
    handleRemove (event, record) {
      this.$http.delete(this.$apis.user.remove, {
        userId: record.userId,
        tenantId: record.tenantId
      }, this).then(res => {
        this.handleOk()
      })
      event.preventDefault()
    },
    handleRemoveBatch (event) {
      const that = this
      this.$http.delete(this.$apis.user.batchRemove, {
        userIds: this.selectedRowKeys.join(',')
      }, this).then(res => {
        if (res.code === 0) {
          that.selectedRowKeys = []
          that.selectedRows = []
        }
        that.handleOk()
      })
      event.preventDefault()
    },
    handleGetSelect (record) {
      return ({
        props: {
          disabled: record.isSystem === 1
        }
      })
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
  }
}
</script>
