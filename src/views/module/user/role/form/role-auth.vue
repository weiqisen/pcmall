<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">

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
        isExpired: false
      }
    },
    /* 初始数据 */
    setData (data) {
      if (data && data.roleId) {
        Object.assign(this.formItem, {
          roleId: data.roleId
        })
        this.handleLoadRoleGranted(data.roleType, data.roleId)
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
            this.$http.post(this.$apis.role.grantMenu, {
              roleId: this.formItem.roleId,
              menuIds: this.submitMenus.join(',')
            }, this).then(res => {
              if (res.code === 0) {
                this.$notification.success({
                  message: '提示',
                  description: '操作成功',
                  duration: 8
                })
              } else {
                this.$notification.error({
                  message: '提示',
                  description: res.data.message
                })
              }
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
      const checkArray = []
      checkArray.push(...node)
      checkArray.push(...event.halfCheckedKeys)
      this.submitMenus = checkArray
    },
    /* 加载权限 */
    handleLoadRoleGranted (roleType, roleId) {
      if (!roleId) {
        return
      }
      const that = this
      this.$http.get(this.$apis.role.authorityMenu, { roleType: roleType, roleId: roleId }, this).then(res => {
        that.selectMenus = that.render(res.data.roleMenuAllList, '0')
        that.checkRowKeys = res.data.roleMenuGrantLeafList
        that.submitMenus = res.data.roleMenuGrantHalfList
      })
    },
    render (data, parentId, parentName) {
      debugger
      const children = []
      const parent = []
      if (!data) return null
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentId === parentId) {
          if (parentName) {
            data[i].parentName = parentName
          }
          parent.push(data[i])
        } else {
          children.push(data[i])
        }
      }
      if (parent.length > 0) {
        for (var t = 0; t < parent.length; t++) {
          const tt = this.render(children, parent[t].menuId, parent[t].menuName)
          if (tt && tt.length > 0) {
            parent[t].children = tt
          } else {
            parent[t].children = null
          }
        }
      }
      return parent
    }
  },
  mounted: function () {
  }
}
</script>
