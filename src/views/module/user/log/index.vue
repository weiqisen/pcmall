<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-form-item label="">
                <a-date-picker style="width:100%;" format="YYYY-MM-DD" v-model="time.start" placeholder="开始日期" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-form-item label="">
                <a-date-picker style="width:100%;" format="YYYY-MM-DD" v-model="time.end" placeholder="结束日期" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-form-item label="">
                <a-input v-model="queryParam.userName" placeholder="用户名" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button @click="$refs.table.refresh(true)">
                  <tc-icon title="查询" type="icon_search"></tc-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">
                  <tc-icon style="color:rgba(0, 0, 0, 0.65);" title="查询" type="icon_clear_query"></tc-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="accessId"
        :columns="columns"
        :data="loadData"
        bordered
      >
        <span slot="status" slot-scope="text">
          <a-tag :color="text | statusTypeFilter">{{ text | statusFilter }}</a-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)" :disabled="record.isSystem === 1">删除</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-view>
</template>

<script>
import moment from 'moment'
import { PageView } from '@/layouts'
import { STable } from '@/components'
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
  name: 'UserManage',
  components: {
    moment,
    PageView,
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      time: {},
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '操作',
          dataIndex: 'optionName'
        },
        {
          title: 'IP',
          dataIndex: 'ip'
        },
        {
          title: '日期',
          dataIndex: 'createTime'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.time.start) {
          this.queryParam.startTime = moment(this.time.start).format('YYYY-MM-DD')
        } else {
          this.queryParam.startTime = ''
        }
        if (this.time.end) {
          this.queryParam.endTime = moment(this.time.end).format('YYYY-MM-DD')
        } else {
          this.queryParam.endTime = ''
        }
        return this.$http.get(this.$apis.user.log, Object.assign(parameter, this.queryParam), this).then(res => {
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
  methods: {
    handleReset () {
      this.queryParam = {}
      this.time.end = undefined
      this.time.start = undefined
      this.$refs.table.refresh(true)
    },
    handleEdit (record) {
      this.$nextTick(() => {
        this.$refs.modal.edit(record)
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
