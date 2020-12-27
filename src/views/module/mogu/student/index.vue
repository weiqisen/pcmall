<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="4" :sm="24" style="padding: 0 3px 0 0;">
              <a-date-picker @change="onChange" />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input placeholder="请输入学生姓名" allowClear/>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <span class="table-page-search-submitButtons">
                <a-button type="primary">
                  <tc-icon title="查询" type="icon_search"></tc-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" type="primary">
                  <tc-icon style="color:rgba(0, 0, 0, 0.65);" title="查询" type="icon_clear_query"></tc-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--:showUploadList="false"-->
      <div class="table-operator">
        <a-button
          type="primary">
          <tc-icon
            title="表格导出"
            type="iconwenjianshangchuan"></tc-icon>
          表格导出
        </a-button>
      </div>
      <a-alert
        message="统计：当前活跃学生人数12/人，弹唱5人/，电吉他2/人，指弹3/人"
        type="info"
      />
      <a-table
        size="middle"
        rowKey="stuId"
        :columns="columns"
        :data-source="data"
        :rowSelection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange}"
        bordered
        :scroll="{ x: 1400, y: 550 }"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></tc-icon>
              <span style="font-size: 12px;">编辑</span>
            </a-button>
            <a-button style="padding: 0 6px;font-size: 12px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></tc-icon>
              <span style="font-size: 12px;">删除</span>
            </a-button>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import RoleModal from './modal'
const data = []
for (let i = 1; i < 60; i += 1) {
  data.push({
    stuId: i,
    stuName: '学生' + Math.floor(Math.random() * 10 + 3),
    stuSex: '男',
    stuType: '成人',
    teacherName: '魏其森',
    type: '交错式弹唱1v2',
    takeLessonTime: '非固定',
    lessonCount: '5/节',
    note: '喜欢许巍的歌曲',
    createTime: '2020-11-' + Math.floor(Math.random() * 30 + 10) + ' 14:' + Math.floor(Math.random() * 60 + 10) + ':52'
  })
}
export default {
  name: 'StudentIndex',
  components: {
    PageView,
    STable,
    RoleModal
  },
  data () {
    return {
      data,
      columns: [
        {
          title: '学生姓名',
          dataIndex: 'stuName',
          fixed: 'left',
          width: 120
        },
        {
          title: '编号',
          dataIndex: 'stuId'
        },
        {
          title: '学生性别',
          dataIndex: 'stuSex'
        },
        {
          title: '学生类型',
          dataIndex: 'stuType'
        },
        {
          title: '任课老师',
          dataIndex: 'teacherName'
        },
        {
          title: '课程类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          width: 150
        },
        {
          title: '约课类型',
          dataIndex: 'takeLessonTime'
        },
        {
          title: '已上节数',
          dataIndex: 'lessonCount'
        },
        {
          title: '备注',
          dataIndex: 'note',
          width: 150
        },
        {
          title: '录入时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    }
  }
}
</script>
