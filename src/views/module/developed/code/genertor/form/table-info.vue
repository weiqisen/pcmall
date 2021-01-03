<template>
  <div>
    <s-table
      ref="table"
      size="default"
      rowKey="fileId"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
    >
      <span slot="alarmType" slot-scope="text">
        <span>{{ text | alarmTypeFilter }}</span>
      </span>
      <span slot="alatmStaus" slot-scope="text">
        <a-badge :status="text | alarmStatusFilter" :text="text | statusFilter" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <span>
            <a-button @click="handleRemove(record)" style="padding: 0 6px;font-size: 12px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></tc-icon>
              <span style="font-size: 12px;">删除</span>
            </a-button>
          </span>
        </template>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
export default {
  name: 'TableInfo',
  components: {
    STable
  },
  data () {
    return {
      queryParam: {},
      isAdd: true,
      columns: [
        {
          title: '设备id',
          dataIndex: 'deviceSn'
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName'
        },
        {
          title: '设备状态',
          dataIndex: 'online',
          scopedSlots: { customRender: 'online' }
        },
        {
          title: '设备版本',
          dataIndex: 'softwareVersion'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '90px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.genertorId = this.genertorId
        return this.$http.get(this.$apis.developer.code.genertor.tables, Object.assign(parameter, this.queryParam), this).then(res => {
          res.data.current = parseInt(res.data.current)
          res.data.total = parseInt(res.data.total)
          res.data.size = parseInt(res.data.size)
          res.data.pages = parseInt(res.data.pages)
          return res
        })
      },
      genertorId: ''
    }
  },
  methods: {
    getFormItem () {
      return {
        genertorId: '',
        type: '',
        lineName: '',
        driverName: '',
        url: '',
        username: '',
        password: ''
      }
    },
    setData (data) {
      this.isAdd = true
      if (data && data.genertorId) {
        this.genertorId = data.genertorId
        this.$refs.table.refresh(true)
      } else {
        this.formItem = this.getFormItem()
      }
    },
    handleReset () {

      // this.form.resetFields()
      // this.formItem = this.getFormItem()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            const paramer = {
              lineName: values.lineName,
              driverName: values.driverName,
              url: values.url,
              username: values.username,
              password: values.password,
              genertorId: this.formItem.genertorId,
              type: values.type
            }
            this.$http.post(this.$apis.developer.code.genertor.save, paramer, this).then(res => {
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
            this.$emit('ok')
          } else {
            resolve(false)
          }
        })
      })
    }
  },
  mounted: function () {
  }
}
</script>
