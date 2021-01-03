<template>
  <!--分配权限-->
  <div>
    <div class="table-operator" style="margin-bottom: 5px;">
      <a-button :disabled="addButton" type="primary" icon="plus" @click="handleAdd()">新建</a-button>
    </div>

    <s-table
      ref="table"
      rowKey="actionId"
      :columns="columns"
      showPagination="false"
      :data="loadData">
      <span slot="action" slot-scope="text, record">
        <template>
          <span v-if="record.editable">
            <a @click="() => save(record)">保存</a>
            <a-divider type="vertical" />
            <a @click="() => cancel(record)">取消</a>
          </span>
          <span v-else>
            <a @click="() => edit(record)">编辑</a>

            <a-divider type="vertical" />
            <a-popconfirm placement="left" okText="保存" cancelText="取消" @cancel="handleTransferCancel" @confirm="handleTransferConfirm(record)">
              <a-icon slot="icon" type=""/>
              <template slot="title">
                <a-transfer
                  :dataSource="selectApis"
                  showSearch
                  :listStyle="{
                    width: '320px',
                    height: '300px',
                  }"
                  :targetKeys="authorityIds"
                  @change="handleTransferChange"
                  :render="item=>`${item.title}`">
                <span slot="notFoundContent">
                  没数据
                </span>
              </a-transfer>
              </template>
              <a @click="handleTransfer(record)">接口授权</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a @click="handleRemove(record)" :disabled="$auth('systemMenuEdit')?false:true">删除</a>
          </span>
        </template>
      </span>
      <!--{{col}}}-->
      <template
        v-for="col in ['actionCode', 'actionName', 'priority']"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            :value="text"
            @change="e => handleChange(e.target.value, record, col)"/>
          <template v-else>{{text}}</template>
        </div>
      </template>
      <span slot="status" slot-scope="text">
        <a-tag :color="text | statusTypeFilter">{{text | statusFilter}}</a-tag>
      </span>
    </s-table>

  </div>
</template>

<script>
import {STable} from '@/components'
const statusMap = {
  0: {
    status: '',
    text: '禁用'
  },
  1: {
    status: 'green',
    text: '启用'
  }
}
export default {
  name: 'MenuAuth',
  components: {
    STable
  },
  data () {
    return {
      value: {},
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '编码',
          dataIndex: 'actionCode',
          scopedSlots: { customRender: 'actionCode' }
        },
        {
          title: '名称',
          dataIndex: 'actionName',
          scopedSlots: { customRender: 'actionName' }
        },
        {
          title: '优先级',
          dataIndex: 'priority',
          scopedSlots: { customRender: 'priority' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (!this.queryParam || !this.queryParam.menuId) {
          return
        }
        return this.$http.get(this.$apis.action.getActionsByMenu, Object.assign(parameter, this.queryParam), this).then(res => {
          return res
        })
      },
      options: {
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      showPagination: false,
      pagination: false,
      selectApis: [],
      authorityIds: [],
      addButton:false
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
    getFormItem () {
      return {
        userId: '',
        grantActions: [],
        grantMenus: [],
        expireTime: '',
        isExpired: false
      }
    },
    setData (data) {
      if (data && data.menuId) {
        // Object.assign(this.formItem, {
        //   userId: data.userId
        // })
        // this.handleLoadUserGranted(data.userId)
        this.value=data
        this.queryParam.menuId=data.menuId
        this.handleReset()
        // this.$refs.table.refresh(true)
        // this.handleSearch ()
      }
    },
    handleSearch () {
      if (!this.value || !this.value.menuId) {
        return
      }
      this.$http.get(this.$apis.action.getActionsByMenu, {
        menuId: this.value.menuId
      }).then(res => {
        this.data = res.data
      })
    },
    checkMethod ({ row, rowIndex }) {
      if (this.disableRowKeys.includes(row.menuId)) {
        return false
      } else {
        return true
      }
    },
    handleReset () {
      this.$refs.table.refresh(true)
    },
    tableOption() {
      this.options = {
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    },
    handleChange(value, record, column) {
      if (value) {
        record[column] = value;
      }
    },
    edit(record) {
      const newData = [...this.$refs.table.localDataSource];
      newData.forEach(item => {
        if(item.editable){
          item.editable=false
        }
      })
      const target = newData.filter(item => record.actionId === item.actionId)[0];
      if (target) {
        target.editable = true;
        this.$refs.table.localDataSource = newData
      }
    },
    cancel(record){
      debugger
      const newData = [...this.$refs.table.localDataSource];
      const target = newData.filter(item => {
        if(item.actionId){
          return true
        }
      });
      const current = newData.filter(item=>record.actionId===item.actionId)[0]
      if (current) {
        delete current.editable;
        this.$refs.table.localDataSource = target
      }

    },
    save(record) {
      const newData = [...this.$refs.table.localDataSource];
      const target = newData.filter(item => record.actionId === item.actionId)[0];
      if (target) {
        delete target.editable;
        if(!record.menuId){
          record.menuId=this.value.menuId
        }
        this.$http.post(this.$apis.action.save, Object.assign(target, record), this).then(res => {
          this.handleReset()
          // this.addButton=true
        })
      }
    },
    handleRemove (data) {
      this.$http.delete(this.$apis.action.remove, {
        actionId: data.actionId
      }, this).then(res => {
        this.handleReset()
      })
    },
    handleAdd() {
      // this.addButton=false
      const newData = {
        editable: true,
        actionCode: this.value.menuCode,
        actionName: "",
        status: 1,
        priority: 0,
      }
      debugger
      this.$refs.table.localDataSource = [newData,...this.$refs.table.localDataSource]
    },
    getCheckedAuthorities () {
      const menuIds = []
      this.$refs['tree'].getSelectRecords().map(item => {
        menuIds.push(item.authorityId)
      })
      return menuIds.concat(this.formItem.grantActions)
    },
    handleTransfer(record){
      this.selectApis=[]
      this.authorityIds=[]
      if (!record.actionId) {
        return
      }
      const that = this
      const p1 = this.$http.get(this.$apis.api.actionList, {actionId: record.actionId,actionType: this.value.menuType}, this)
      // const p2 = this.$http.get(this.$apis.authority.action, { actionId: record.actionId }, this)
      Promise.all([p1]).then(function (values) {
        const res1 = values[0]
        // const res2 = values[1]
        if (res1.code === 0) {
          const result = []
          that.selectApis = res1.data.apiList.map(item => {
            item.key = item.apiId
            item.title = `${item.path} - ${item.apiName}`
            item.disabled = item.path === '/**'
            return item
          })
          res1.data.actionList.map(item => {
            if (!result.includes(item.apiId)) {
              result.push(item.apiId)
            }
          })
          that.authorityIds = result
        }
        // if (res2.code === 0) {
        //   const result = []

        // }
      })
    },
    handleTransferConfirm(record){
      if (record && record.actionId) {
        this.$http.post(this.$apis.action.grantActionApi, {
          actionId: record.actionId,
          apiIds: this.authorityIds.join(',')
        }, this).then(res => {
          this.handleReset()
          this.handleSearch()
        }).finally(() => {
          this.saving = false
        })
      }
    },
    handleTransferCancel(){
      this.selectApis = []
      this.authorityIds = []
    },
    handleTransferChange(targetKeys, direction, moveKeys){
      this.authorityIds=targetKeys
    }
  },
  created () {
    this.tableOption()
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
