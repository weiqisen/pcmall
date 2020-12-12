<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.name" placeholder="请输入分类名称" allowClear />
            </a-col>
            <a-col :md="4" :sm="24" style="padding: 0 3px 0 0;">
              <span class="table-page-search-submitButtons">
                <a-button @click="handleTableQuery">
                  <tc-icon type="icon_search"></tc-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleRestQuery">
                  <tc-icon type="icon_clear_query"></tc-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button @mousedown="handleEdit">
          <tc-icon title="添加" type="icon_add"></tc-icon>
          分类</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="categoryId"
        :columns="columns"
        :data="loadData"
        bordered
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button @mousedown="handleEdit($event,record)" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></tc-icon>
              <span style="font-size: 12px;">编辑</span>
            </a-button>
            <a-button @mousedown="handleRemove($event,record)" style="padding: 0 6px;font-size: 12px;height: 26px;">
              <tc-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></tc-icon>
              <span style="font-size: 12px;">删除</span>
            </a-button>
          </template>
        </span>
      </s-table>
      <!--<a-table-->
      <!--ref="table"-->
      <!--:loading="loading"-->
      <!--rowKey="categoryId"-->
      <!--:columns="columns"-->
      <!--:dataSource="data"-->
      <!--:pagination="false"-->
      <!--bordered-->
      <!--&gt;-->
      <!--<span slot="status" slot-scope="text">-->
      <!--<a-tag :color="text | statusTypeFilter">{{text | statusFilter}}</a-tag>-->
      <!--</span>-->
      <!--<span slot="icon" slot-scope="text">-->
      <!--<tc-icon :type="text"/>-->
      <!--</span>-->

      <!--<span slot="action" slot-scope="text, record">-->
      <!--<template>-->
      <!--<a-button @click="handleEdit(record)" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">-->
      <!--<tc-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></tc-icon>-->
      <!--<span style="font-size: 12px;">编辑</span>-->
      <!--</a-button>-->
      <!--<a-button @click="handleRemove(record)" style="padding: 0 6px;font-size: 12px;height: 26px;">-->
      <!--<tc-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></tc-icon>-->
      <!--<span style="font-size: 12px;">删除</span>-->
      <!--</a-button>-->
      <!--</template>-->
      <!--</span>-->
      <!--</a-table>-->
      <category-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import CategoryModal from './modal'
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
  name: 'SystemUser',
  components: {
    CategoryModal,
    PageView,
    STable
  },
  data () {
    return {
      loading: true,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '分类名称',
          dataIndex: 'name'
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
        return this.$http.get(this.$apis.category.page, Object.assign(parameter, this.queryParam), this).then(res => {
          res.data.current = parseInt(res.data.current)
          res.data.total = parseInt(res.data.total)
          res.data.size = parseInt(res.data.size)
          res.data.pages = parseInt(res.data.pages)
          return res
        })
      }
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
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

    // 加载数据方法 必须为 Promise 对象
    // loadData(){
    //   this.loading = true
    //   const that = this
    //   return this.$http.get(this.$apis.category.list, this.queryParam, this).then(res => {
    //     debugger
    //     for(var s = 0;s<res.data.length;s++){
    //       Object.assign(res.data[s], {children: [""]})
    //     }
    //     that.data=this.render(res.data,"0")
    //     this.loading = false
    //   })
    // },
    // render(data,parentId,parentName){
    //   const children = []
    //   const parent = []
    //   if (!data) return null
    //   for(var i = 0; i < data.length;i++){
    //     if(data[i].parentId===parentId){
    //       if(parentName){
    //         data[i].parentName = parentName
    //       }
    //       parent.push(data[i])
    //     }else{
    //       children.push(data[i])
    //     }
    //   }
    //   if(parent.length>0){
    //     for(var t = 0; t<parent.length;t++){
    //       const tt = this.render(children,parent[t].categoryId,parent[t].name)
    //       if(tt && tt.length>0){
    //         parent[t].children=tt
    //       }else{
    //         parent[t].children=null
    //       }
    //
    //     }
    //   }
    //   return parent
    // },
    handleRestQuery () {
      this.queryParam = {}
      this.handleTableQuery()
    },
    handleTableQuery () {
      this.$refs.table.refresh(true)
    },
    handleEdit (event, record) {
      this.$nextTick(() => {
        this.$refs.modal.edit(record)
      })
      event.preventDefault()
    },
    handleRemove (event, record) {
      this.$http.delete(this.$apis.category.remove, {
        categoryId: record.categoryId
      }, this).then(res => {
        this.handleTableQuery()
      })
      event.preventDefault()
    },
    handleOk () {
      this.handleTableQuery()
    }
  }
}
</script>
