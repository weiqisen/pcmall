<!--自定义table插件-->
<template>
  <div>
    <Row>
      <Table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        @on-selection-change="showSelect"
        :style="styleObject">
        <!--定义列操作插槽-->
        <template slot-scope="{row,index}" :slot="item.name" v-for="item in getColumnsSolt">
          <slot :row="row" :name="item.name">
          </slot>
        </template>
        <template slot="footer">
          <slot name="footer">
          </slot>
        </template>
      </Table>
    </Row>
    <Row type="flex" justify="end" v-if="showPager">
      <Page
        class="table-page-toolbar"
        transfer
        :total="total"
        :show-total="showTotal"
        show-elevator
        show-size-changer
        show-sizer
        :pageSize="limit"
        :current="page"
        @on-change="changePage"
        @on-page-size-change="handlePageSize"></Page>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'STable',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    handler: {
      type: String,
      default: ''
    },
    showPager: {
      type: Boolean,
      default: true
    },
    borderTop: {
      type: String,
      default: 'display'
    },
    marginTop: {
      type: String,
      default: ''
    },
    sort: {
      type: String,
      default: ''
    },
    order: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {
      }
    },
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      styleObject: {
        'border-top': this.borderTop,
        'margin-top': this.marginTop
      },
      myparams: this.params,
      loading: false,
      columnsSolts: [],
      tableData: [],
      total: 0,
      page: 1,
      limit: 10,
      selectList: [],
      selectCount: 0
    }
  },
  computed: {
    // 遍历使用插槽的列
    getColumnsSolt () {
      for (const column of this.columns) {
        if (column.slot) {
          this.columnsSolts.push({ name: column.slot })
        }
      }
      return this.columnsSolts
    }
  },
  methods: {
    showTotal (total, range){
      return "总"+total+"条数"
    },
    // 请求数据
    getData () {
      this.loading = true
      Object.assign(this.myparams, {
        limit: this.limit,
        page: this.page,
        sort: this.sort,
        order: this.order
      })
      this.$http.get(this.url, this.myparams, this).then(res => {
        // 总记录
        this.total = parseInt(res.data.total)
        this.tableData = res.data.records
        // 执行自定义回调
        this.$emit('on-success', res.data)
      }).finally(() => {
        this.loading = false
      })
    },
    showSelect (e) {
      this.selectList = e
      this.selectCount = e.length
    },
    // 查询
    search () {
      this.page = 1
      this.getData()
    },
    // 重新加载
    reload () {
      this.getData()
    },
    // 翻页
    changePage (v) {
      this.page = v
      this.getData()
    },
    handlePageSize (size) {
      this.limit = size
      this.getData()
    },
    getSelected (field) {
      const ids = new Array()
      this.selectList.forEach(function (e) {
        ids.push(e[field])
      })
      if (this.selectCount <= 0) {
        this.$Message.warning('您还未选择数据')
        return false
      }
      return ids
    }
  },
  created () {
    // 监听table刷新事件
    this.$on('reloadTable', (name) => {
      this.reload()
    })
  },
  mounted () {
  }
}
</script>
