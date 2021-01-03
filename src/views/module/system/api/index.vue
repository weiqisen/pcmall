<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-input v-model="queryParam.path" placeholder="请输入名称/访问地址/编码" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" @click="handleEdit()">新建</a-button>
        <!--:disabled="$auth('systemApiEdit')?false:true"-->
        <a-button type="primary" @click="handleEdit('','form2')">同步接口</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="apiCode"
        :columns="columns"
        :data="loadData"
        :scroll="{ x: 1450 }"
        :rowSelection="options.rowSelection"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)">删除</a>
          </template>
        </span>
        <span slot="isAuth" slot-scope="text, record">
          <template>
            <a-tag v-if="record.isAuth===1" :style="{background: '#E6F7FF',border: '1px solid #91D5FF',color:'#1890FF'}">身份认证</a-tag>
            <a-tag v-if="record.status===1" :style="{background: '#E6F7FF',border: '1px solid #91D5FF',color:'#1890FF'}">正常</a-tag>
            <a-tag v-else-if="record.isAuth!==1">身份认证</a-tag>
            <a-tag v-else-if="record.status===2" color="orange">维护中</a-tag>
            <a-tag v-else="" color="red">禁用</a-tag>
          </template>
        </span>
      </s-table>
      <api-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import ApiModal from './modal'
const statusMap = {
  1: {
    status: 'success',
    text: '正常'
  },
  2: {
    status: 'warning',
    text: '锁定'
  },
  3: {
    status: 'error',
    text: '禁用'
  }
}
export default {
  name: 'GatewayRoute',
  components: {
    PageView,
    STable,
    ApiModal
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: '访问地址',
          dataIndex: 'path'
        },
        {
          title: '名称',
          dataIndex: 'apiName'
        },
        {
          title: '安全状态',
          dataIndex: 'isAuth',
          scopedSlots: { customRender: 'isAuth' }
        },
        {
          title: '分类',
          dataIndex: 'apiCategory'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.queryParam.path) {
          this.queryParam.apiName = this.queryParam.path
          this.queryParam.apiCode = this.queryParam.path
        } else {
          this.queryParam.apiName = this.queryParam.path
          this.queryParam.apiCode = this.queryParam.path
        }
        return this.$http.get(this.$apis.api.page, Object.assign(parameter, this.queryParam), this).then(res => {
          res.data.current = parseInt(res.data.current)
          res.data.total = parseInt(res.data.total)
          res.data.size = parseInt(res.data.size)
          res.data.pages = parseInt(res.data.pages)
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      selectServiceList: []
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    this.tableOption()
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
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    handleEdit (record, current) {
      this.$nextTick(() => {
        this.$refs.modal.edit(record, current)
      })
    },
    handleSearch () {
      this.$refs['table'].search()
    },
    handleRemove (record) {
      this.$http.delete(this.$apis.api.remove, {
        apiId: record.apiId
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
    handleOnSelectService (value) {
      this.queryParam.apiType = value
    },
    resetSearchForm () {
    }
  }
}
</script>
