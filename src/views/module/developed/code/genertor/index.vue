<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.url" placeholder="请输入url地址" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-input v-model="queryParam.username" placeholder="请输入用户名" allowClear />
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
        <a-button type="primary" icon="plus" @click="handleEdit()">新建</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="genertorId"
        :columns="columns"
        :data="loadData"
      >
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleCodeGenertor(record)">代码生成</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)">删除</a>
          </template>
        </span>
      </s-table>
      <genertor-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import GenertorModal from './modal'
const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '正常'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'SystemRole',
  components: {
    PageView,
    STable,
    GenertorModal
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
          title: '连接名称',
          dataIndex: 'lineName'
        },
        {
          title: '数据库类型',
          dataIndex: 'type'
        },
        {
          title: '数据库地址',
          dataIndex: 'url'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '密码',
          dataIndex: 'password'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get(this.$apis.developer.code.genertor.page, Object.assign(parameter, this.queryParam), this).then(res => {
          res.data.current = parseInt(res.data.current)
          res.data.total = parseInt(res.data.total)
          res.data.size = parseInt(res.data.size)
          res.data.pages = parseInt(res.data.pages)
          return res
        })
      },
      websock: null
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
    // this.initWebSocket();
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    handleEdit (record, current) {
      this.$nextTick(() => {
        this.$refs.modal.edit(record)
      })
    },
    handleCodeGenertor (record) {
      this.$router.push({
        name: 'genertorDetail',
        params: { genertorId: record ? record.genertorId : '' }
      })
    },
    handleRemove (record) {
      this.$http.delete(this.$apis.role.remove, {
        roleId: record.roleId
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
    initWebSocket () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      // 初始化weosocket
      const wsuri = 'ws://192.168.124.8:9000/admin/ws'
      this.websock = new WebSocket(wsuri, token)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      const actions = { 'test': '12345' }
      this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror () { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
    },
    websocketsend (Data) { // 数据发送
      this.websock.send(Data)
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
    }
  }
}
</script>
