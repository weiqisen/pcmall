<template>
  <div>
    <a-form @submit="handleSubmit" :form="formItem">
      <a-form-item
        label="角色编码"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 18}, sm: {span: 18} }">
        <a-transfer
          :dataSource="selectUsers"
          :listStyle="{
            width: '40%',
            height: '350px',
          }"
          :targetKeys="formItem.userIds"
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
  name: 'RoleUser',
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
        userIds: []
      }
    },
    setData (data) {
      if (data && data.roleId) {
        Object.assign(this.formItem, {
          roleId: data.roleId
        })
        this.handleLoadRoleUsers(data.roleId)
      }
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        // this.$refs['form'].validate((valid) => {
        //   if (valid) {
        this.$http.post(this.$apis.role.saveRoleUsers, {
          roleId: this.formItem.roleId,
          userIds: this.formItem.userIds.join(',')
        }).then(res => {
          resolve(res)
        }).catch(function (err) {
          reject(err)
        })
        // } else {
        //   resolve(false)
        // }
        // })
      })
    },
    handleLoadRoleUsers (roleId) {
      if (!roleId) {
        return
      }
      const that = this
      const p1 = this.$http.get(this.$apis.user.list, {}, this)
      const p2 = this.$http.get(this.$apis.role.getRoleUsers, { roleId: roleId }, this)
      Promise.all([p1, p2]).then(function (values) {
        const res1 = values[0]
        const res2 = values[1]
        if (res1.code === 0) {
          res1.data.map(item => {
            item.key = item.userId
            item.title = `${item.userName}(${item.nickName})`
          })
          that.selectUsers = res1.data
        }
        if (res2.code === 0) {
          const userIds = []
          res2.data.map(item => {
            if (!userIds.includes(item.userId)) {
              userIds.push(item.userId)
            }
          })
          that.formItem.userIds = userIds
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
      this.formItem.userIds = newTargetKeys
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
