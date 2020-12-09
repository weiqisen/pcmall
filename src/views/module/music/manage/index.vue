<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.deviceName" placeholder="请输入设备名称/设备编号" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-select v-model="queryParam.online" placeholder="请选择设备状态" allowClear>
                <a-select-option value="1">在线</a-select-option>
                <a-select-option value="0">离线</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button @click="handleTableQuery">
                  <jihao-icon title="查询" type="icon_search"></jihao-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleRestQuery">
                  <jihao-icon style="color:rgba(0, 0, 0, 0.65);" title="查询" type="icon_clear_query"></jihao-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" @mousedown="handleExports" :disabled="selectedRowKeys.length > 0?false:true">
          <jihao-icon title="批量导出" type="iconpiliang"></jihao-icon>
          批量导出</a-button>
        <a-button type="primary" @mousedown="handleDelete" :disabled="selectedRowKeys.length > 0?false:true">
          <jihao-icon title="批量删除" type="icon_delete"></jihao-icon>
          批量删除</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="logId"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange}"
        bordered
      >
        <span slot="online" slot-scope="text">
          <a-tag :color="text | statusTypeFilter">{{text | statusFilter}}</a-tag>
        </span>
        <span slot="fileSize" slot-scope="text">
            <span :title="text">{{text | fileSizeTypeFilter}}</span>
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
            title: '设备编号',
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
            title: '设备IP',
            dataIndex: 'deviceIp'
          },
          {
            title: '文件名称',
            dataIndex: 'realName'
          },
          {
            title: '文件大小',
            dataIndex: 'fileSize'
          },
          {
            title: '创建时间',
            dataIndex: 'createTime'
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.deviceSn = this.queryParam.deviceName
          return this.$http.get(this.$apis.log.page, Object.assign(parameter, this.queryParam), this).then(res => {
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
      },
      fileSizeTypeFilter (val){
        if(val===0) return '0 B'
        const k = 1024;
        const size = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(val) / Math.log(k));
        return (val/Math.pow(k,i)).toPrecision(3)+' '+size[i]
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
      handleDelete(event){
        const logList = []
        const that = this
        if(this.selectedRows){
          this.selectedRows.map(m=>{
            logList.push({
              logId:m.logId,
              fileName:m.fileName,
              realName:m.realName
            })
          })
        }
        this.$http.delete(this.$apis.log.removeBatch, {
          logList: JSON.stringify(logList)
        }, this).then(res => {
          if(res.code===0){
            that.selectedRowKeys= []
            that.selectedRows= []
          }
          that.handleOk()
        }).finally(() => {
          this.saving = false
        })
        event.preventDefault()
      },
      handleExports (event) {
        const fileList = []
        if(this.selectedRows){
          this.selectedRows.map(m=>{
            fileList.push({
              fileName:m.fileName,
              realName:m.realName
            })
          })
        }
        this.$http.post(this.$apis.log.exports, {
          fileList: JSON.stringify(fileList)
        }, this).then(res => {
          let downloadUrl = res.data.downloadUrl;
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', downloadUrl);
          document.body.appendChild(link);
          link.click()
          document.body.removeChild(link)
        }).catch(error => {
          console.log(error)
        })
        event.preventDefault()
      },
      handleRemove (record) {
        this.$http.delete(this.$apis.role.remove, {
          roleId: record.roleId
        }, this).then(res => {
          this.handleOk ()
        })
      },
      handleOk () {
        this.$refs.table.refresh()
      },
      handleRestQuery (){
        this.queryParam = {}
        this.handleTableQuery()
      },
      handleTableQuery (){
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$refs.table.refresh(true)
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
      }
    }
  }
</script>
