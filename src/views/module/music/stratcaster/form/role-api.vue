<template>
  <div>
    <a-form @submit="handleSubmit" :form="formItem">
      <a-form-item
        :wrapperCol="{lg: {span: 24}, sm: {span: 24} }">
        <a-transfer
          showSearch
          :dataSource="selectApis"
          :listStyle="{
            width: '46%',
            height: '350px',
          }"
          :targetKeys="formItem.authorityIds"
          @change="handleTransferChange"
          :render="item=>`${item.title}`">
          <span slot="notFoundContent">
            没数据
          </span>
        </a-transfer>
      </a-form-item>
    </a-form>

    <!--    <Form ref="form" :model="formItem">-->
    <!--      <FormItem prop="authorities">-->
    <!--        <Transfer-->
    <!--          :data="selectUsers"-->
    <!--          :list-style="{width: '45%',height: '480px'}"-->
    <!--          :titles="['选择用户', '已选择用户']"-->
    <!--          :render-format="transferRender"-->
    <!--          :target-keys="formItem.userIds"-->
    <!--          @on-change="handleTransferChange"-->
    <!--          filterable>-->
    <!--        </Transfer>-->
    <!--      </FormItem>-->
    <!--    </Form>-->
  </div>
</template>

<script>

export default {
  name: 'RoleApi',
  data () {
    return {
      selectApis: [],
      selectMenus: [],
      selectUsers: [],
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getFormItem () {
      return {
        roleId: '',
        authorityIds: []
      }
    },
    setData (data) {
      if (data && data.roleId) {
        Object.assign(this.formItem, {
          roleId: data.roleId
        })
        this.handleTransfer(data.roleId)
      }
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$http.post(this.$apis.authority.roleGrant, {
          roleId: this.formItem.roleId,
          authorityIds: this.formItem.authorityIds.join(',')
        }).then(res => {
          resolve(res)
        }).catch(function (err) {
          reject(err)
        })
      })
    },
    // handleLoadRoleUsers (roleId) {
    //   if (!roleId) {
    //     return
    //   }
    //   const that = this
    //   const p1 = this.$http.get(this.$apis.user.list, {}, this)
    //   const p2 = this.$http.get(this.$apis.role.getRoleUsers, { roleId: roleId }, this)
    //   Promise.all([p1, p2]).then(function (values) {
    //     const res1 = values[0]
    //     const res2 = values[1]
    //     if (res1.code === 0) {
    //       res1.data.map(item => {
    //         item.key = item.userId
    //         item.title = `${item.userName}(${item.nickName})`
    //       })
    //       that.selectUsers = res1.data
    //     }
    //     if (res2.code === 0) {
    //       const userIds = []
    //       res2.data.map(item => {
    //         if (!userIds.includes(item.userId)) {
    //           userIds.push(item.userId)
    //         }
    //       })
    //       that.formItem.userIds = userIds
    //     }
    //   })
    // },

    handleTransfer (roleId) {
      this.selectApis = []
      this.authorityIds = []
      if (!roleId) {
        return
      }
      const that = this
      const p1 = this.$http.get(this.$apis.authority.api, {}, this)
      const p2 = this.$http.get(this.$apis.authority.roleApi, { roleId: roleId }, this)
      Promise.all([p1, p2]).then(function (values) {
        const res1 = values[0]
        const res2 = values[1]
        if (res1.code === 0) {
          res1.data.map(item => {
            item.key = item.authorityId
            item.title = `${item.prefix.replace('/**', '')}${item.path} - ${item.apiName}`
            item.disabled = item.path === '/**'
          })
          that.selectApis = res1.data
        }
        if (res2.code === 0) {
          const result = []
          res2.data.map(item => {
            if (!result.includes(item.authorityId)) {
              result.push(item.authorityId)
            }
          })
          that.formItem.authorityIds = result
        }
      })
    },
    // transferRender (item) {
    //   const customLabel = (`<span  title="${item.title}">${item.title}</span>`)
    //   return {
    //     label: customLabel, // for displayed item
    //     value: item.title, // for title and filter matching
    //   };
    // },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      this.formItem.authorityIds = newTargetKeys
    },
    handleClick (name, row) {
      switch (name) {
        case 'remove':
          this.handleRemove(row)
          break
      }
    }
  },
  mounted: function () {
  }
}
</script>
