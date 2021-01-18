<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="12" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button style="margin-right: 8px" type="primary" icon="plus" @click="handleEdit()">新建</a-button>
                <a-button type="primary" @click="loadData">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        ref="table"
        rowKey="menuId"
        :columns="columns"
        :dataSource="data"
        :pagination="false">
        <span slot="status" slot-scope="text">
          <a-tag v-if="text===1" :style="{background: '#E6F7FF',border: '1px solid #91D5FF',color:'#1890FF'}">正常</a-tag>
          <a-tag v-if="text===0" :style="{background: '#FFF1F0',border: '1px solid #FFA39E',color:'#FF4D4F'}">禁用</a-tag>
        </span>
        <span slot="type" slot-scope="text">
          <a-tag :style="{background: '#E6F7FF',border: '1px solid #91D5FF',color:'#1890FF'}">{{ text | menuTypeFilter }}</a-tag>
        </span>
        <span slot="icon" slot-scope="text">
          <tc-icon :type="text"/>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)">删除</a>
          </template>
        </span>
      </a-table>
      <menu-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import MenuAction from './menu-action'
import MenuModal from './modal'
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
  name: 'SystemUser',
  components: {
    MenuModal,
    MenuAction,
    PageView
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
          title: '菜单名称',
          dataIndex: 'menuName'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },

        {
          title: '菜单编码',
          dataIndex: 'menuCode'
        },
        {
          title: '页面地址',
          dataIndex: 'path'
        },
        {
          title: '图标',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' }
        },

        {
          title: '排序',
          dataIndex: 'priority'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '描述',
          dataIndex: 'menuDesc',
          width: '150px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      selectServiceList: []
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    this.loadData()
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    menuTypeFilter (type) {
      if (type === 10) {
        return '导航'
      } else if (type === 20) {
        return '菜单'
      } else {
        return '按钮'
      }
    }
  },
  methods: {
    // 加载数据方法 必须为 Promise 对象
    loadData () {
      const that = this
      return this.$http.get(this.$apis.menu.list, this.queryParam, this).then(res => {
        for (var s = 0; s < res.data.length; s++) {
          Object.assign(res.data[s], { children: [''] })
        }
        that.data = this.render(res.data, 0)
      })
    },
    render (data, parentId, parentName) {
      const children = []
      const parent = []
      if (!data) return null
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentId === parentId) {
          if (parentName) {
            data[i].parentName = parentName
          }
          // Object.assign(data[i], {children: [""]})
          parent.push(data[i])
        } else {
          children.push(data[i])
        }
      }
      if (parent.length > 0) {
        for (var t = 0; t < parent.length; t++) {
          const tt = this.render(children, parent[t].menuId, parent[t].menuName)
          if (tt && tt.length > 0) {
            parent[t].children = tt
          } else {
            parent[t].children = null
          }
        }
      }
      return parent
    },
    // tableOption() {
    //   this.options = {
    //     rowSelection: {
    //       selectedRowKeys: this.selectedRowKeys,
    //       onChange: this.onSelectChange
    //     }
    //   }
    // },

    handleEdit (record) {
      this.$nextTick(() => {
        this.$refs.modal.edit(record)
      })
    },
    handleRemove (record) {
      debugger
      this.$http.delete(this.$apis.menu.remove, {
        menuId: record.menuId
      }, this).then(res => {
        this.handleOk()
      })
    },
    handleOk () {
      this.loadData()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOnSelectService (value) {
      this.queryParam.menuType = value
    },
    resetSearchForm () {
    }
  }
}
</script>
