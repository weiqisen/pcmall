<template>
  <!--分配角色-->
  <div class="search">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item label="拥有角色"
       :labelCol="{lg: {span: 7}, sm: {span: 7}}"
       :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-radio-group
          v-model="formItem.grantRoles"
          style="width: 100%;"
        >
            <a-col
              :div="12"
              :key="index"
              v-for="(item,index) in selectRoles"
              >
              <a-radio :disabled="formItem.isSystem === 1" :value="item.roleId">{{ item.roleName }}</a-radio>
            </a-col>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>

export default {
  name: 'UserRole',
  props: {},
  data () {
    return {
      selectRoles: '',
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getFormItem () {
      return {
        userId: '',
        isSystem: 0,
        grantRoles: []
      }
    },
    setData (data) {
      if (data && data.userId) {
        Object.assign(this.formItem, {
          userId: data.userId,
          isSystem: data.isSystem
        })
        this.handleLoadRoles(data.userId)
      }
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$http.post(this.$apis.user.saveUserRoles, {
              userId: this.formItem.userId,
              roleIds: this.formItem.grantRoles }, this).then(res => {
              if(res.code===0) {
                this.$notification.success({
                  message: '提示',
                  description: '授权角色成功',
                  duration: 8
                })
              }else{
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
    handleLoadRoles (userId) {
      if (!userId) {
        return
      }
      const that = this
      this.$http.get(this.$apis.user.getUserRoles, { userId: userId }, this).then(res => {
        that.selectRoles = res.data.allRoles
        that.formItem.grantRoles = res.data.selectRoles
      })
    }
  },
  created () {

  },
  components: {}
}
</script>

<style scoped lang="less" rel="stylesheet/less">
  .ant-checkbox-group>div{
    line-height: 30px;
    padding-top: 4px;
  }
</style>
