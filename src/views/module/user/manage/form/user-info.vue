<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        help="支持数字，字母，汉字，下划线及破折号，2到30位"
        label="昵称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'nickName',
            {rules: [{ required: true, message: '昵称不能为空' },$rules.nickName]}
          ]"
          name="nickName"
          placeholder="昵称不能为空" />
      </a-form-item>
      <a-form-item
        help="用户名支持数字，字母，4到20位"
        label="用户名"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          autocomplete="off"
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: '请输入用户名' },{validator: validateToUserName}]}
          ]"
          :disabled="!isAdd"
          name="userName"
          placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item
        v-if="isAdd"
        label="登录密码"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          autocomplete="off"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' },{validator: validatePass}]}
          ]"
          name="password"
          type="password"
          placeholder="请输入密码" />
      </a-form-item>

      <a-form-item
        v-if="isAdd"
        label="再次确认密码"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          autocomplete="off"
          v-decorator="[
            'passwordConfirm',
            {rules: [{ required: true, message: '请重复密码' },{validator: validatePassConfirm}]}
          ]"
          name="passwordConfirm"
          type="password"
          placeholder="请再次输入密码" />
      </a-form-item>

      <a-form-item
        label="手机号"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          :disabled="formItem.isSystem===1?true:false"
          v-decorator="[
            'mobile',
            {rules: $rules.mobile}
          ]"
          name="mobile"
          placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item
        label="邮箱"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'email',
            {rules: [{ required: false, message: '请输入邮箱' },{validator: validateEmail}]}
          ]"
          name="email"
          placeholder="请输入邮箱(选填)" />
      </a-form-item>

      <a-form-item
        label="状态"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <div>
          <a-radio-group :disabled="formItem.isSystem===1?true:false" buttonStyle="solid" v-decorator="['status' ,{rules: [{ required: true, message: '请选择状态' }]}, { initialValue: '1' }]">
            <a-radio-button value="0">禁用</a-radio-button>
            <a-radio-button value="1">正常</a-radio-button>
            <!--<a-radio-button value="2">锁定</a-radio-button>-->
          </a-radio-group>
        </div>
      </a-form-item>
      <a-form-item
        label="简介"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-textarea
          rows="4"
          placeholder="请输入描述内容"
          v-decorator="[
            'userDesc',
            {rules: [{ required: false, message: '请输入内容' },$rules.char0to100Desc]}
          ]" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'RoleInfo',
  data () {
    return {
      isAdd: true,
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    validateEmail (rule, value, callback) {
      const reg = this.$rules.emailRule
      // 邮箱
      if (value) {
        if (!reg.test(value)) {
          callback(this.$rules.emailRuleMsg)
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    validateToUserName (rule, value, callback) {
      const reg = this.$rules.enNum4to20
      if (!reg.test(value)) {
        callback(new Error(this.$rules.enNum4to20Msg))
      } else {
        callback()
      }
    },
    getFormItem () {
      return {
        userId: '',
        userName: '',
        nickName: '',
        status: '1',
        email: '',
        isSystem: 0,
        mobile: '',
        userType: 'normal',
        userDesc: '',
        avatar: '',
        password: '',
        passwordConfirm: ''
      }
    },
    setData (data, type) {
      this.isAdd = true
      if (data && data.userId) {
        if (this.formItem.userId) {
          if (type === 1) {
            Object.assign(this.formItem, this.form.getFieldsValue())
          } else {
            Object.assign(this.formItem, {
              userId: data.userId,
              userName: data.userName,
              nickName: data.nickName,
              status: data.status + '',
              email: data.email,
              isSystem: data.isSystem,
              mobile: data.mobile,
              userType: data.userType,
              userDesc: data.userDesc,
              avatar: data.avatar
            })
          }
        } else {
          Object.assign(this.formItem, {
            userId: data.userId,
            userName: data.userName,
            nickName: data.nickName,
            status: data.status + '',
            email: data.email,
            isSystem: data.isSystem,
            mobile: data.mobile,
            userType: data.userType,
            userDesc: data.userDesc,
            avatar: data.avatar
          })
        }
        this.isAdd = false
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
        Object.assign(this.formItem, this.form.getFieldsValue())
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['userName', 'nickName', 'status', 'email', 'mobile', 'userDesc']))
      })
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      const that = this
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            Object.assign(this.formItem, {
              userName: values.userName,
              nickName: values.nickName,
              status: values.status,
              email: values.email,
              mobile: values.mobile,
              userDesc: values.userDesc
            })
            if (this.isAdd) {
              this.formItem.password = values.password
            }
            values.userId = this.formItem.userId
            this.$http.post(this.$apis.user.save, this.formItem, this).then(res => {
              if (res.code === 0) {
                that.formItem.userId = res.data
                that.isAdd = false
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
            debugger
            resolve(false)
          }
        })
      })
    },
    validatePass (rule, value, callback) {
      const reg2 = /^.{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.form.getFieldValue('password')) {
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
    }
  },
  mounted: function () {
  }
}
</script>
