<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.roleName" placeholder="请输入角色名称" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.roleCode" placeholder="请输入角色编码" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
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
          <tc-icon title="添加角色" type="icon_add"></tc-icon>
          角色</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="roleCode"
        :columns="columns"
        :data="loadData"
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
    text: '禁用'
  },
  1: {
    status: 'green',
    text: '正常'
  }
}

export default {
  name: 'SystemRole',
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
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '角色编码',
          dataIndex: 'roleCode'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '描述',
          dataIndex: 'roleDesc'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '220px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get(this.$apis.role.page, Object.assign(parameter, this.queryParam), this).then(res => {
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
  },
  methods: {
    handleEdit (event, record) {
      this.$nextTick(() => {
        this.$refs.modal.edit(record)
      })
      event.preventDefault()
    },
    handleRemove (event, record) {
      this.$http.delete(this.$apis.role.remove, {
        roleId: record.roleId
      }, this).then(res => {
        this.handleOk()
      })
      event.preventDefault()
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
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh(true)
    }
  }
}
</script>
