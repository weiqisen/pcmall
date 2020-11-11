<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="当前密码"
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-input
          v-decorator="[
            'oldPassword',
            {rules: [{ required: true, message: '请输入当前密码' }]}
          ]"
          type="password"
          name="oldPassword"
          placeholder="请输入当前密码" />
      </a-form-item>
      <a-popover placement="top" trigger="click" :visible="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }" >
            <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
            <div style="margin-top: 10px;">
              <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
            </div>
          </div>
        </template>
        <a-form-item
          label="新密码"
          :labelCol="{lg: {span: 5}, sm: {span: 5}}"
          :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
          <a-input
            type="password"
            @focus="handlePasswordInputClick(true)"
            @blur="handlePasswordInputClick(false)"
            autocomplete="false"
            placeholder="至少6位密码，区分大小写"
            v-decorator="['newPassword', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          />
        </a-form-item>
      </a-popover>
      <a-form-item
        label="确认新密码"
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-input
          type="password"
          autocomplete="false"
          placeholder="请再一次输入新密码"
          v-decorator="[
            'confirmPassword',
            {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}
          ]"
          name="confirmPassword"/>
      </a-form-item>
      <a-form-item
        label=" "
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-button @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>

<script>
const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'MidifyPassword',
  data () {
    return {
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    handlePasswordLevel (rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },
    handlePasswordInputClick (bool) {
      this.state.passwordLevelChecked = bool
    },
    handlePasswordCheck (rule, value, callback) {
      const newPassword = this.form.getFieldValue('newPassword')
      console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && newPassword && value.trim() !== newPassword.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },

    getFormItem () {
      return {
        userId: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    setData (data) {
      if (data && data.userId) {
        Object.assign(this.formItem, {
          userId: data.userId,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        })
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
      }
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit (e) {
      e.preventDefault()
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            const param = {
              oldPassword: values.oldPassword,
              newPassword: values.newPassword
            }
            this.$http.post(this.$apis.user.updatePassword, param, this).then(res => {
              if (res.code === 0) {
                this.$notification.open({
                  message: '操作',
                  description: '修改密码成功！'
                })
                this.handleReset()
                this.$emit('ok')
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
    }
  },
  mounted: function () {
  }
}
</script>
<style>
  .ant-form .ant-form-item:last-child .ant-form-item-label label::after{
    content: '';
  }
</style>
