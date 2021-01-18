<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="过期时间"
        :validate-status="formItem.isExpired?'success':'warning'"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-date-picker v-model="formItem.expireTime" style="width: 100%"/>
      </a-form-item>

      <a-form-item
        label="功能权限"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 17} }">
        <div style="height: 350px;overflow: auto;">
          <a-tree
            checkable
            v-model="checkRowKeys"
            :treeData="selectMenus"
            @check="getCheckedAuthorities"
            :replaceFields="replaceFields"/>
        </div>
      </a-form-item>

      <!--<vxe-table-->
      <!--border-->
      <!--resizable-->
      <!--height="450"-->
      <!--ref="tree"-->
      <!--row-id="menuId"-->
      <!--:tree-config="{children: 'children',expandAll: true}"-->
      <!--:select-config="{labelField: 'menuName',checkRowKeys: checkRowKeys}"-->
      <!--:data.sync="selectMenus">-->
      <!--<vxe-table-column type="selection" field="menuId" title="菜单" tree-node width="220"></vxe-table-column>-->
      <!--<vxe-table-column field="operation" title="操作">-->
      <!--<template v-slot="{ row }">-->
      <!--<CheckboxGroup v-model="formItem.grantActions">-->
      <!--<Checkbox v-for="(item,index) in row.actionList" :key="index" :label="item.authorityId">-->
      <!--<span :title="item.actionDesc">{{ item.actionName }}</span>-->
      <!--</Checkbox>-->
      <!--</CheckboxGroup>-->
      <!--</template>-->
      <!--</vxe-table-column>-->
      <!--</vxe-table>-->
      <!--</a-form-item>-->
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'RoleAuth',
  components: {
    moment
  },
  data () {
    return {
      selectMenus: [],
      submitMenus: [],
      pageInfo: {},
      checkRowKeys: [],
      formItem: this.getFormItem(),
      form: this.$form.createForm(this),
      replaceFields: {
        key: 'menuId',
        title: 'menuName'
      }
    }
  },
  methods: {
    getFormItem () {
      return {
        roleId: '',
        grantMenus: [],
        expireTime: '',
        isExpired: false
      }
    },
    /* 初始数据 */
    setData (data) {
      if (data && data.roleId) {
        Object.assign(this.formItem, {
          roleId: data.roleId
        })
        this.handleLoadRoleGranted(data.roleId)
      }
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
      this.submitMenus = []
      this.checkRowKeys = []
    },
    /* 提交授权 */
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$http.post(this.$apis.authority.roleGrantMenu, {
              roleId: this.formItem.roleId,
              expireTime: this.formItem.expireTime ? this.formItem.expireTime.format('YYYY-MM-DD HH:mm:ss') : '',
              menuIds: this.submitMenus.join(',')
            }, this).then(res => {
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
          } else {
            resolve(false)
          }
        })
      })
    },
    /* 获取已选择节点 */
    getCheckedAuthorities (node, event) {
      this.submitMenus = node
      // this.$refs['tree'].getSelectRecords().map(item => {
      //   menuIds.push(item.authorityId)
      // })
      // return menuIds.concat(this.formItem.grantActions)
      // return node
    },
    /* 加载权限 */
    handleLoadRoleGranted (roleId) {
      if (!roleId) {
        return
      }
      const that = this
      const p1 = this.$http.get(this.$apis.authority.menu, {}, this)
      const p2 = this.$http.get(this.$apis.authority.roleMenu, {
        roleId: roleId
      }, this)
      Promise.all([p1, p2]).then(function (values) {
        const res1 = values[0]
        const res2 = values[1]
        if (res1.code === 0 && res1.data) {
          if (res2.code === 0 && res2.data && res2.data.length > 0) {
            const menus = []
            res2.data.map(item => {
              // 菜单权限
              // if (item.authority.indexOf('MENU_') != -1 && !menus.includes(item.authorityId)) {
              //   menus.push(item.authorityId)
              // }
              // // 操作权限
              // if (item.authority.indexOf('ACTION_') != -1 && !actions.includes(item.authorityId)) {
              //   actions.push(item.authorityId)
              // }
              menus.push(item.authorityId)
            })
            that.formItem.grantMenus = menus
            // that.formItem.grantActions = actions
            // 时间
            if (res2.data.length > 0) {
              that.formItem.expireTime = res2.data[0].expireTime ? moment(res2.data[0].expireTime, 'YYYY-MM-DD HH:mm:ss') : null
              that.formItem.isExpired = res2.data[0].isExpired
            }
          }
          const checkRowKeys = []
          res1.data.map(item => {
            // 菜单选中
            if (that.formItem.grantMenus.includes(item.authorityId)) {
              checkRowKeys.push(item.menuId)
            }
            if (item.actionList && item.actionList.length > 0) {
              item.children = item.actionList
            }
          })
          that.checkRowKeys = checkRowKeys
          that.submitMenus = checkRowKeys
          const opt = {
            key: 'menuId',
            parentKey: 'parentId',
            children: 'children'
          }
          that.selectMenus = that.$utils.toArrayTree(res1.data, opt)
          console.log(that.selectMenus)
        }
      })
    }
  },
  mounted: function () {
  }
}
</script>
