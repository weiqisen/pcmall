<template>
  <!--修改密码-->
  <div class="search">
    <a-form @submit="handleSubmit" :form="form">

      <a-form-item
        label="登录密码"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' },{validator: validatePass}]}
          ]"
          name="password"
          type="password"
          placeholder="请输入密码" />
      </a-form-item>

      <a-form-item
        label="再次确认密码"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'passwordConfirm',
            {rules: [{ required: true, message: '请再次输入密码' },{validator: validatePassConfirm}]}
          ]"
          name="passwordConfirm"
          type="password"
          placeholder="请再次输入密码" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'UpdatePassword',
  props: {},
  data () {
    return {
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    validatePass (rule, value, callback) {
      const reg2 = /^.{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (this.form.getFieldValue('passwordConfirm')&&value !== this.form.getFieldValue('passwordConfirm')) {
        callback(new Error('两次输入密码不一致'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('长度6到18个字符'))
      } else {
        callback()
      }
    },
    validatePassConfirm (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.getFieldValue('password')) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },
    getFormItem () {
      return {
        userId: '',
        password: '',
        passwordConfirm: ''
      }
    },
    setData (data) {
      if (data && data.userId) {
        Object.assign(this.formItem, {
          userId: data.userId
        })
      }
    },
    handleResetForm () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleReset () {
      this.handleResetForm()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$http.post(this.$apis.user.updateUserPassword, {
              userId: this.formItem.userId,
              confirmPassword: values.passwordConfirm,
              password: values.password
            }, this).then(res => {
              if (res.code === 0) {
                this.$notification.success({
                  message: '提示',
                  description: '修改密码成功',
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
            resolve()
          }
        })
      })
    }
    // validatePass (rule, value, callback) {
    //   const reg2 = /^.{6,18}$/
    //   if (value === '') {
    //     callback(new Error('请输入密码'))
    //   } else if (value !== this.form.getFieldValue('password')) {
    //     callback(new Error('两次输入密码不一致'))
    //   } else if (value !== '' && !reg2.test(value)) {
    //     callback(new Error('长度6到18个字符'))
    //   } else {
    //     callback()
    //   }
    // },
    // handlePasswordLevel (rule, value, callback) {
    //   let level = 0
    //
    //   // 判断这个字符串中有没有数字
    //   if (/[0-9]/.test(value)) {
    //     level++
    //   }
    //   // 判断字符串中有没有字母
    //   if (/[a-zA-Z]/.test(value)) {
    //     level++
    //   }
    //   // 判断字符串中有没有特殊符号
    //   if (/[^0-9a-zA-Z_]/.test(value)) {
    //     level++
    //   }
    //   this.state.passwordLevel = level
    //   this.state.percent = level * 30
    //   if (level >= 2) {
    //     if (level >= 3) {
    //       this.state.percent = 100
    //     }
    //     callback()
    //   } else {
    //     if (level === 0) {
    //       this.state.percent = 10
    //     }
    //     callback(new Error('密码强度不够'))
    //   }
    // },
    // handlePasswordInputClick (bool) {
    //   this.state.passwordLevelChecked = bool
    // },
    // handlePasswordCheck (rule, value, callback) {
    //   const newPassword = this.form.getFieldValue('newPassword')
    //   console.log('value', value)
    //   if (value === undefined) {
    //     callback(new Error('请输入密码'))
    //   }
    //   if (value && newPassword && value.trim() !== newPassword.trim()) {
    //     callback(new Error('两次密码不一致'))
    //   }
    //   callback()
    // }
  },
  mounted: function () {
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
