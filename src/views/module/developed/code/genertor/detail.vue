<template>
  <page-view :title="title">
    <div class="page-header-index-wide" style="height: 100%;">
      <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
        <template>
          <div>
            <a-back-top />
          </div>
        </template>
        <div class="account-settings-info-main" :class="device">
          <div class="account-settings-info-left">
            <a-tree
              checkable
              :load-data="onLoadData"
              :tree-data="treeData"
              :replace-fields="replaceFields"
              @select="onSelect"
              @check="onCheck"
            />
          </div>
          <div class="account-settings-info-right">
            <a-tabs :activeKey="noTitleKey" @tabClick="handleTabClick">
              <a-tab-pane tab="代码生成配置" key="form1" name="form1">
                <table-config @ok="handleConfigOk('form1')" ref="form1" :parent-visable.sync="visible"></table-config>
              </a-tab-pane>
              <a-tab-pane tab="表结构查看" key="form2" forceRender name="form2">
                <table-structure @ok="handleStructureOk('form2')" ref="form2"></table-structure>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </a-card>
    </div>
  </page-view>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import { mixinDevice } from '@/utils/mixin.js'
import TableConfig from './form/table-config'
import TableStructure from './form/table-structure'
export default {
  components: {
    RouteView,
    PageView,
    TableConfig,
    TableStructure
  },
  mixins: [mixinDevice],
  data () {
    return {
      treeData: [],
      genertorId: '',
      replaceFields: {
        children: 'child',
        title: 'name'
      },
      tableList: [],
      tableSelect: {},
      tableFields: [],
      noTitleKey: 'form1',
      visible: false
    }
  },
  created () {
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  methods: {
    handleInit () {
      if (this.$route.params.genertorId) {
        this.genertorId = this.$route.params.genertorId
      } else if (this.genertorId) {
        this.genertorId = this.genertorId
      } else {
        return
      }
      const that = this
      this.$http.get(this.$apis.developer.code.genertor.tables, { genertorId: this.genertorId }, this).then(res => {
        if (res.code === 0) {
          that.treeData = []
          res.data.map(item => {
            that.treeData.push({
              name: item.comment ? item.comment : item.name,
              key: item.name,
              fields: item.fields
            })
          })
          that.tableList = res.data
        }
      })
    },
    onChange (e) {
      const value = e.target.value
      const that = this
      const expandedKeys = this.treeData.map(item => {
        if (item.title.indexOf(value) > -1) {
          return that.getParentKey(item.key, that.tableList)
        }
        return null
      })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    getParentKey (key, tableList) {
      let parentKey
      for (let i = 0; i < tableList.length; i++) {
        const node = tableList[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    onSelect (selectedKeys, info) {
      this.tableFields = info.selectedNodes[0].data.props.fields
      this.$refs.form2.setData(this.tableFields)
    },
    onCheck (checkedKeys) {
      this.tableSelect = checkedKeys
      this.$refs.form1.setData({
        genertorId: this.genertorId,
        tableSelect: this.tableSelect })
    },
    onLoadData (treeNode) {
      if (treeNode) {
        this.$http.get(this.$apis.deploy.service.page, Object.assign(parameter, this.queryParam), this).then(res => {
          this.dataSource.push({})
          this.dataSource.push(...res.data.records)
          this.pagination.current = parseInt(res.data.current)
          this.pagination.total = parseInt(res.data.total)
          this.pagination.pageSize = parseInt(res.data.size) + 1
          this.pagination.pages = parseInt(res.data.pages)
        })
      }
    },
    handleTabClick (name) {
      this.$nextTick(() => {
        this.noTitleKey = name
        if (name == 'form1') {
          this.$refs.form1.setData({
            genertorId: this.genertorId,
            tableSelect: this.tableSelect })
        } else if (name == 'form2') {
          this.$refs.form2.setData(this.tableFields)
        }
      })
    },
    handleConfigOk () {

    },
    handleStructureOk (from) {
      this.handleTabClick(from)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.handleInit()
    })
  }
}
</script>

<style lang="less" scoped>
  .account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
      display: block;

      .account-settings-info-left {
        border-right: unset;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .account-settings-info-right {
        padding: 20px 40px;
      }
    }

    .account-settings-info-left {
      border-right: 1px solid #e8e8e8;
      width: 250px;
    }

    .account-settings-info-right {
      flex: 1 1;
      padding: 8px 40px;

      .account-settings-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .account-settings-info-view {
        padding-top: 12px;
      }
    }
  }

</style>
